import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { getTranslateOffset, transformItem, setItemTransition, binarySearch, schd, isTouchEvent } from './utils';
import type { IItemProps, IProps, TEvent } from './types';
import styles from '@css/components/listbox.module.css';

const AUTOSCROLL_ACTIVE_OFFSET = 200;
const AUTOSCROLL_SPEED_RATIO = 10;

class Draggable<Value = string> extends React.Component<IProps<Value>> {
  listRef = React.createRef<HTMLElement>();
  ghostRef = React.createRef<HTMLElement>();
  topOffsets: number[] = [];
  itemTranslateOffsets: number[] = [];
  initialYOffset = 0;
  lastScroll = 0;
  lastYOffset = 0;
  lastListYOffset = 0;
  dropTimeout?: number;
  needle = -1;
  afterIndex = -2;
  state = {
    itemDragged: -1,
    itemDraggedOutOfBounds: -1,
    selectedItem: -1,
    initialX: 0,
    initialY: 0,
    targetX: 0,
    targetY: 0,
    targetHeight: 0,
    targetWidth: 0,
    scrollingSpeed: 0,
    scrollWindow: false,
  };
  schdOnMouseMove: { (e: MouseEvent): void; cancel(): void };
  schdOnTouchMove: { (e: TouchEvent): void; cancel(): void };
  schdOnEnd: { (e: Event): void; cancel(): void };

  constructor(props: IProps<Value>) {
    super(props);
    this.schdOnMouseMove = schd(this.onMouseMove);
    this.schdOnTouchMove = schd(this.onTouchMove);
    this.schdOnEnd = schd(this.onEnd);
  }

  componentDidMount() {
    this.calculateOffsets();
    document.addEventListener('touchstart', this.onMouseOrTouchStart as any, {
      passive: false,
      capture: false,
    });
    document.addEventListener('mousedown', this.onMouseOrTouchStart as any);
  }

  componentDidUpdate(_prevProps: any, prevState: { scrollingSpeed: number }) {
    if (prevState.scrollingSpeed !== this.state.scrollingSpeed && prevState.scrollingSpeed === 0) {
      this.doScrolling();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('touchstart', this.onMouseOrTouchStart as any);
    document.removeEventListener('mousedown', this.onMouseOrTouchStart as any);
    if (this.dropTimeout) {
      window.clearTimeout(this.dropTimeout);
    }
    this.schdOnMouseMove.cancel();
    this.schdOnTouchMove.cancel();
    this.schdOnEnd.cancel();
  }

  doScrolling = () => {
    const { scrollingSpeed, scrollWindow } = this.state;
    const listEl = this.listRef.current!;
    window.requestAnimationFrame(() => {
      if (scrollWindow) {
        window.scrollTo(window.pageXOffset, window.pageYOffset + scrollingSpeed * 1.5);
      } else {
        listEl.scrollTop += scrollingSpeed;
      }
      if (scrollingSpeed !== 0) {
        this.doScrolling();
      }
    });
  };

  getChildren = () => {
    if (this.listRef && this.listRef.current) {
      return Array.from(this.listRef.current.children);
    }

    return [];
  };

  static defaultProps = {
    transitionDuration: 240,
    lockVertically: false,
    removableByMove: false,
  };

  calculateOffsets = () => {
    this.topOffsets = this.getChildren().map((item) => item.getBoundingClientRect().top);
    this.itemTranslateOffsets = this.getChildren().map((item) => getTranslateOffset(item));
  };

  getTargetIndex = (e: TEvent) => {
    return this.getChildren().findIndex((child) => child === e.target || child.contains(e.target as Node));
  };

  onMouseOrTouchStart = (e: MouseEvent & TouchEvent) => {
    if (this.dropTimeout && this.state.itemDragged > -1) {
      window.clearTimeout(this.dropTimeout);
      this.finishDrop();
    }
    const isTouch = isTouchEvent(e);
    if (!isTouch && e.button !== 0) return;
    const index = this.getTargetIndex(e as any);

    const listItemTouched = this.getChildren()[index] as HTMLElement;
    const isValidDragHandle = (e.target as Element)?.classList.contains(styles['Listbox-item--drag-icon']);
    if (!isValidDragHandle) return;
    e.preventDefault();

    if (isTouch) {
      const opts = { passive: false };
      listItemTouched.style.touchAction = 'none';
      document.addEventListener('touchend', this.schdOnEnd, opts);
      document.addEventListener('touchmove', this.schdOnTouchMove, opts);
      document.addEventListener('touchcancel', this.schdOnEnd, opts);
    } else {
      document.addEventListener('mousemove', this.schdOnMouseMove);
      document.addEventListener('mouseup', this.schdOnEnd);

      const listItemDragged = this.getChildren()[this.state.itemDragged] as HTMLElement;
      if (listItemDragged && listItemDragged.style) {
        listItemDragged.style.touchAction = '';
      }
    }
    this.onStart(
      listItemTouched,
      isTouch ? e.touches[0].clientX : e.clientX,
      isTouch ? e.touches[0].clientY : e.clientY,
      index
    );
  };

  getYOffset = () => {
    const listScroll = this.listRef.current ? this.listRef.current.scrollTop : 0;
    return window.pageYOffset + listScroll;
  };

  onStart = (target: HTMLElement, clientX: number, clientY: number, index: number) => {
    if (this.state.selectedItem > -1) {
      this.setState({ selectedItem: -1 });
      this.needle = -1;
    }
    const targetRect = target.getBoundingClientRect() as DOMRect;
    const targetStyles = window.getComputedStyle(target);
    this.calculateOffsets();
    this.initialYOffset = this.getYOffset();
    this.lastYOffset = window.pageYOffset;
    this.lastListYOffset = this.listRef.current!.scrollTop;
    this.setState({
      itemDragged: index,
      targetX: targetRect.left - parseInt(targetStyles['margin-left' as any], 10),
      targetY: targetRect.top - parseInt(targetStyles['margin-top' as any], 10),
      targetHeight: targetRect.height,
      targetWidth: targetRect.width,
      initialX: clientX,
      initialY: clientY,
    });
  };

  onMouseMove = (e: MouseEvent) => {
    e.cancelable && e.preventDefault();
    this.onMove(e.clientX, e.clientY);
  };

  onTouchMove = (e: TouchEvent) => {
    e.cancelable && e.preventDefault();
    this.onMove(e.touches[0].clientX, e.touches[0].clientY);
  };

  onWheel = (e: React.WheelEvent) => {
    if (this.state.itemDragged < 0) return;
    this.lastScroll = this.listRef.current!.scrollTop += e.deltaY;
    this.moveOtherItems();
  };

  onMove = (clientX: number, clientY: number) => {
    if (this.state.itemDragged === -1) return null;
    transformItem(
      this.ghostRef.current!,
      clientY - this.state.initialY,
      this.props.lockVertically ? 0 : clientX - this.state.initialX
    );
    this.autoScrolling(clientY);
    this.moveOtherItems();

    return;
  };

  moveOtherItems = () => {
    const targetRect = this.ghostRef.current!.getBoundingClientRect();
    const itemVerticalCenter = targetRect.top + targetRect.height / 2;
    const offset = getTranslateOffset(this.getChildren()[this.state.itemDragged]);
    const currentYOffset = this.getYOffset();
    // adjust offsets if scrolling happens during the item movement
    if (this.initialYOffset !== currentYOffset) {
      this.topOffsets = this.topOffsets.map((offset) => offset - (currentYOffset - this.initialYOffset));
      this.initialYOffset = currentYOffset;
    }
    if (this.isDraggedItemOutOfBounds() && this.props.removableByMove) {
      this.afterIndex = this.topOffsets.length + 1;
    } else {
      this.afterIndex = binarySearch(this.topOffsets, itemVerticalCenter);
    }
    this.animateItems(this.afterIndex === -1 ? 0 : this.afterIndex, this.state.itemDragged, offset);
  };

  autoScrolling = (clientY: number) => {
    const { top, bottom, height } = this.listRef.current!.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    // auto scrolling for the window (down)
    if (bottom > viewportHeight && viewportHeight - clientY < AUTOSCROLL_ACTIVE_OFFSET) {
      this.setState({
        scrollingSpeed: Math.round((AUTOSCROLL_ACTIVE_OFFSET - (viewportHeight - clientY)) / AUTOSCROLL_SPEED_RATIO),
        scrollWindow: true,
      });
      // auto scrolling for the window (up)
    } else if (top < 0 && clientY < AUTOSCROLL_ACTIVE_OFFSET) {
      this.setState({
        scrollingSpeed: Math.round((AUTOSCROLL_ACTIVE_OFFSET - clientY) / -AUTOSCROLL_SPEED_RATIO),
        scrollWindow: true,
      });
    } else {
      if (this.state.scrollWindow && this.state.scrollingSpeed !== 0) {
        this.setState({ scrollingSpeed: 0, scrollWindow: false });
      }
      // auto scrolling for containers with overflow
      if (height + 20 < this.listRef.current!.scrollHeight) {
        let scrollingSpeed = 0;
        if (clientY - top < AUTOSCROLL_ACTIVE_OFFSET) {
          scrollingSpeed = Math.round((AUTOSCROLL_ACTIVE_OFFSET - (clientY - top)) / -AUTOSCROLL_SPEED_RATIO);
        } else if (bottom - clientY < AUTOSCROLL_ACTIVE_OFFSET) {
          scrollingSpeed = Math.round((AUTOSCROLL_ACTIVE_OFFSET - (bottom - clientY)) / AUTOSCROLL_SPEED_RATIO);
        }
        if (this.state.scrollingSpeed !== scrollingSpeed) {
          this.setState({ scrollingSpeed });
        }
      }
    }
  };

  animateItems = (needle: number, movedItem: number, offset: number, animateMovedItem = false) => {
    this.getChildren().forEach((item, i) => {
      setItemTransition(item, this.props.transitionDuration);
      if (movedItem === i && animateMovedItem) {
        if (movedItem === needle) {
          return transformItem(item, null);
        }
        transformItem(
          item,
          movedItem < needle
            ? this.itemTranslateOffsets.slice(movedItem + 1, needle + 1).reduce((a, b) => a + b, 0)
            : this.itemTranslateOffsets.slice(needle, movedItem).reduce((a, b) => a + b, 0) * -1
        );
      } else if (movedItem < needle && i > movedItem && i <= needle) {
        transformItem(item, -offset);
      } else if (i < movedItem && movedItem > needle && i >= needle) {
        transformItem(item, offset);
      } else {
        transformItem(item, null);
      }
    });
  };

  isDraggedItemOutOfBounds = () => {
    const initialRect = this.getChildren()[this.state.itemDragged].getBoundingClientRect();
    const targetRect = this.ghostRef.current!.getBoundingClientRect();
    if (Math.abs(initialRect.left - targetRect.left) > targetRect.width) {
      if (this.state.itemDraggedOutOfBounds === -1) {
        this.setState({ itemDraggedOutOfBounds: this.state.itemDragged });
      }
      return true;
    }
    if (this.state.itemDraggedOutOfBounds > -1) {
      this.setState({ itemDraggedOutOfBounds: -1 });
    }
    return false;
  };

  onEnd = (e: TouchEvent & MouseEvent) => {
    e.cancelable && e.preventDefault();
    document.removeEventListener('mousemove', this.schdOnMouseMove);
    document.removeEventListener('touchmove', this.schdOnTouchMove);
    document.removeEventListener('mouseup', this.schdOnEnd);
    document.removeEventListener('touchup', this.schdOnEnd);
    document.removeEventListener('touchcancel', this.schdOnEnd);

    const removeItem = this.props.removableByMove && this.isDraggedItemOutOfBounds();
    if (!removeItem && this.props.transitionDuration > 0 && this.afterIndex !== -2) {
      // animate drop
      schd(() => {
        setItemTransition(this.ghostRef.current!, this.props.transitionDuration, 'cubic-bezier(0.2, 0, 0.38, 0.9)');
        if (this.afterIndex < 1 && this.state.itemDragged === 0) {
          transformItem(this.ghostRef.current!, 0, 0);
        } else {
          transformItem(
            this.ghostRef.current!,
            // compensate window scroll
            -(window.pageYOffset - this.lastYOffset) +
              // compensate container scroll
              -(this.listRef.current!.scrollTop - this.lastListYOffset) +
              (this.state.itemDragged < this.afterIndex
                ? this.itemTranslateOffsets
                    .slice(this.state.itemDragged + 1, this.afterIndex + 1)
                    .reduce((a, b) => a + b, 0)
                : this.itemTranslateOffsets
                    .slice(this.afterIndex < 0 ? 0 : this.afterIndex, this.state.itemDragged)
                    .reduce((a, b) => a + b, 0) * -1),
            0
          );
        }
      })();
    }
    this.dropTimeout = window.setTimeout(
      this.finishDrop,
      removeItem || this.afterIndex === -2 ? 0 : this.props.transitionDuration
    );
  };

  finishDrop = () => {
    const removeItem = this.props.removableByMove && this.isDraggedItemOutOfBounds();
    if (removeItem || (this.afterIndex > -2 && this.state.itemDragged !== this.afterIndex)) {
      this.props.onChange({
        oldIndex: this.state.itemDragged,
        newIndex: removeItem ? -1 : Math.max(this.afterIndex, 0),
        targetRect: this.ghostRef.current!.getBoundingClientRect(),
      });
    }
    this.getChildren().forEach((item) => {
      setItemTransition(item, 0);
      transformItem(item, null);
      (item as HTMLElement).style.touchAction = '';
    });
    this.setState({ itemDragged: -1, scrollingSpeed: 0 });
    this.afterIndex = -2;
    // sometimes the scroll gets messed up after the drop, fix:
    if (this.lastScroll > 0) {
      this.listRef.current!.scrollTop = this.lastScroll;
      this.lastScroll = 0;
    }
  };

  onKeyDown = (e: React.KeyboardEvent) => {
    const selectedItem = this.state.selectedItem;
    const index = this.getTargetIndex(e);

    if (index === -1 || (this.props.values[index] && this.props.values[index].props.disabled)) {
      return;
    }

    if (e.key === ' ') {
      e.preventDefault();
      if (selectedItem === index) {
        if (selectedItem !== this.needle) {
          this.getChildren().forEach((item) => {
            setItemTransition(item, 0);
            transformItem(item, null);
          });
          this.props.onChange({
            oldIndex: selectedItem,
            newIndex: this.needle,
            targetRect: this.getChildren()[this.needle].getBoundingClientRect(),
          });

          (this.getChildren()[this.needle] as HTMLElement).focus();
        }
        this.setState({
          selectedItem: -1,
        });
        this.needle = -1;
      } else {
        this.setState({
          selectedItem: index,
        });
        this.needle = index;
        this.calculateOffsets();
      }
    }
    if ((e.key === 'ArrowDown' || e.key === 'j') && selectedItem > -1 && this.needle < this.props.values.length - 1) {
      e.preventDefault();
      const offset = getTranslateOffset(this.getChildren()[selectedItem]);
      this.needle++;
      this.animateItems(this.needle, selectedItem, offset, true);
    }
    if ((e.key === 'ArrowUp' || e.key === 'k') && selectedItem > -1 && this.needle > 0) {
      e.preventDefault();
      const offset = getTranslateOffset(this.getChildren()[selectedItem]);
      this.needle--;
      this.animateItems(this.needle, selectedItem, offset, true);
    }
    if (e.key === 'Escape' && selectedItem > -1) {
      this.getChildren().forEach((item) => {
        setItemTransition(item, 0);
        transformItem(item, null);
      });
      this.setState({
        selectedItem: -1,
      });
      this.needle = -1;
    }
    if ((e.key === 'Tab' || e.key === 'Enter') && selectedItem > -1) {
      e.preventDefault();
    }
  };

  render() {
    const baseStyle = {
      userSelect: 'none',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      msUserSelect: 'none',
      boxSizing: 'border-box',
      position: 'relative',
    } as React.CSSProperties;
    const ghostStyle = {
      ...baseStyle,
      top: this.state.targetY,
      left: this.state.targetX,
      width: this.state.targetWidth,
      height: this.state.targetHeight,
      backgroundColor: '#ffffff',
      listStyleType: 'none',
      margin: 0,
      position: 'fixed',
      boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.16)',
    } as React.CSSProperties;
    return (
      <React.Fragment>
        {this.props.renderList({
          children: this.props.values.map((value: any, index: number) => {
            const isHidden = index === this.state.itemDragged;
            const isSelected = index === this.state.selectedItem;

            const isDisabled = this.props.values[index] && this.props.values[index].props.disabled;
            const props: IItemProps = {
              key: index,
              tabIndex: isDisabled ? -1 : 0,
              onKeyDown: this.onKeyDown,
              style: {
                ...baseStyle,
                visibility: isHidden ? 'hidden' : undefined,
                zIndex: isSelected ? 5000 : 0,
              } as React.CSSProperties,
            };

            return this.props.renderItem({
              value,
              props,
              index,
              isDragged: false,
              isSelected,
              isOutOfBounds: false,
            });
          }),
          isDragged: this.state.itemDragged > -1,
          props: {
            ref: this.listRef,
          },
        })}
        {this.state.itemDragged > -1 &&
          ReactDOM.createPortal(
            this.props.renderItem({
              value: this.props.values[this.state.itemDragged],
              props: {
                ref: this.ghostRef,
                style: ghostStyle,
                onWheel: this.onWheel,
              },
              index: this.state.itemDragged,
              isDragged: true,
              isSelected: false,
              isOutOfBounds: this.state.itemDraggedOutOfBounds > -1,
            }),
            document.body
          )}
      </React.Fragment>
    );
  }
}

export default Draggable;
