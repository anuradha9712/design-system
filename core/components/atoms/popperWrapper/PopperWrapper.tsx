import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { getPosition, isInViewport, isEqual } from './positionHelper';

type PositionType = 'bottom' | 'top' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left' | 'right';

type ActionType = 'click' | 'hover';
type Offset = 'small' | 'medium' | 'large';
export interface PopperWrapperProps {
  init?: boolean;
  /**
   * Element triggering the `Popover`
   */
  trigger: React.ReactElement<any>;
  boundaryElement?: Element | null;
  triggerClass?: string;
  placement: PositionType;
  children: React.ReactElement<any>;
  style: React.CSSProperties;
  /**
   * Appends `trigger` wrapper inside body
   */
  appendToBody: boolean;
  /**
   * Event triggering the `Popover`
   */
  on: ActionType;
  /**
   * Holds `Popover` on hover
   *
   * **Use only if you are using `on = 'hover'`**
   */
  hoverable: boolean;
  /**
   * Vertical offset from trigger
   *
   * <pre className="DocPage-codeBlock">
   * {
   *    small: '2px',
   *    medium: '4px',
   *    large: '8px'
   * }
   * </pre>
   */
  offset: Offset;
  /**
   * Close on Backdrop click
   */
  closeOnBackdropClick: boolean;
  /**
   * Close on `boundaryElement` scroll
   */
  closeOnScroll?: boolean;
  /**
   * Handles open/close
   */
  open?: boolean;
  hide?: boolean;
  /**
   * Callback after `Popover` is toggled
   *
   * type: 'onMouseLeave' | 'onMouseEnter' | 'outsideClick' | 'onClick';
   */
  onToggle: (open: boolean, type?: string) => void;
}

// type IPopupProps = Omit<JSX.IntrinsicElements['div'], 'ref'>;

// enum OnEvents {
//   click,
//   hover,
// }

enum Position {
  'TopLeft',
  'TopCenter',
  'TopRight',
  'RightCenter',
  'BottomRight',
  'BottomCenter',
  'BottomLeft',
  'LeftCenter',
}

const placementToPosition: Record<string, keyof typeof Position> = {
  bottom: 'BottomCenter',
  top: 'TopCenter',
  'top-start': 'TopLeft',
  'top-end': 'TopRight',
  'bottom-start': 'BottomLeft',
  'bottom-end': 'BottomRight',
  left: 'LeftCenter',
  right: 'RightCenter',
};

// interface IProps extends IPopupProps {
//   /**
//    * Close popup if clicked outside the popup
//    */
//   closeOnBackdropClick?: boolean;
//   /**
//    * Horizontal offset from trigger
//    */
//   horizontalOffset?: number;
//   /**
//    * Append Date picker to body
//    */
//   appendToBody?: boolean;
//   /**
//    * Delay after which popup should close after mouseLeave
//    */
//   mouseLeaveDelay?: number;
//   /**
//    * Delay after which popup should open after mouseEnter
//    */
//   mouseEnterDelay?: number;
//   /**
//    * Event triggering the popup
//    */
//   on?: keyof typeof OnEvents;
//   /**
//    * Callback after popup is toggled
//    */
//   onToggle?(open: boolean): void;
//   /**
//    * Handle open/close of popup
//    */
//   open: boolean;
//   /**
//    * Position of the popup
//    */
//   position?: keyof typeof Position;
//   /**
//    * Element triggering the popup
//    */
//   trigger: React.ReactElement<any>;
//   /**
//    * Vertical offset from trigger
//    */
//   verticalOffset?: number;
//   /**
//    * Hold popup on hover
//    */
//   hoverable?: boolean;
// }

interface IState {
  position: {
    top: number;
    left: number;
  };
  style: React.CSSProperties;
  isOpen?: boolean;
}

/**
 * @description Find DOM node from ref
 * @param {ref} ref React ref
 */
// const findDOMNode = (ref: React.RefObject<HTMLElement>) => {
//   return ref.current;
// };

/**
 * Popup display additional information on click or hover event
 * @class Popup
 * @extends {React.Component<IProps, IState>}
 */
export class PopperWrapper extends React.Component<PopperWrapperProps, IState> {
  // Type definition to use innerRef
  private triggerRef: React.RefObject<HTMLElement>;
  private popupRef: React.RefObject<HTMLDivElement>;
  private style: React.CSSProperties = {
    position: 'absolute',
    display: 'inline-block',
  };
  private mouseEnterTimer?: number;
  private mouseLeaveTimer?: number;
  private animateTimer?: number;
  private mountNode: HTMLElement;

  constructor(props: PopperWrapperProps) {
    super(props);

    this.triggerRef = React.createRef();
    this.popupRef = React.createRef();
    this.mountNode = document.body;
  }

  static defaultProps = {
    on: 'click',
    offset: 'medium',
    closeOnBackdropClick: true,
    hoverable: true,
    appendToBody: true,
    style: {},
  };

  // public static defaultProps = {
  //   closeOnBackdropClick: true,
  //   horizontalOffset: 0,
  //   hoverable: false,
  //   mountNode: document.body,
  //   mouseLeaveDelay: 50,
  //   mouseEnterDelay: 0,
  //   on: 'click',
  //   open: false,
  //   position: 'BottomRight',
  //   verticalOffset: 0,
  //   appendToBody: true,
  // };

  public state: IState = {
    position: {
      top: 0,
      left: 0,
    },
    style: {},
    isOpen: this.props.open,
  };

  public componentWillUnmount() {
    // Clean up timers
    if (this.mouseEnterTimer) {
      clearTimeout(this.mouseEnterTimer);
    }
    if (this.mouseLeaveTimer) {
      clearTimeout(this.mouseLeaveTimer);
    }
    if (this.animateTimer) {
      clearTimeout(this.animateTimer);
    }

    // Remove event listener
    document.removeEventListener('mousedown', this.doesNodeContainClick);
  }

  /**
   * @description Set popup position according to user input
   * @returns {object} Position object
   */
  private getPopupPosition = (position: keyof typeof Position) => {
    const { offset, placement } = this.props;
    const offSetMap = {
      small: 2,
      medium: 4,
      large: 8,
    };

    let verticalOffset = offSetMap[offset]!;
    let horizontalOffset = 0;

    if (['left', 'right'].includes(placement)) {
      horizontalOffset = verticalOffset;
      verticalOffset = 0;
    }

    // TODO: check about the availability of refs
    return getPosition(
      position,
      this.triggerRef.current!,
      this.popupRef.current!,
      {
        vertical: verticalOffset,
        horizontal: horizontalOffset,
      },
      !!this.props.appendToBody
    );
  };

  /**
   * @description Set popup style
   */
  private setPopupStyle = () => {
    if (!this.popupRef.current) {
      return;
    }

    const { appendToBody } = this.props;
    const positionName = placementToPosition[this.props.placement];

    // Calculate position with passed prop
    let position = this.getPopupPosition(positionName);
    let tempPosition;
    let positionFound = false;
    const initialPositionIndex: number = Position[positionName];

    const popupElement = this.popupRef.current!;
    const triggerElement = this.triggerRef.current!;

    if (!isInViewport(popupElement, position, appendToBody, triggerElement)) {
      for (let i = 0; i < 7; i++) {
        tempPosition = this.getPopupPosition(Position[(initialPositionIndex + i + 1) % 8] as keyof typeof Position);
        if (isInViewport(popupElement, tempPosition, appendToBody, triggerElement)) {
          position = tempPosition;
          positionFound = true;
          break;
        }
      }
    } else {
      positionFound = true;
    }

    if (!positionFound) {
      position = this.getPopupPosition('BottomLeft');
    }

    const PositionOffset: Record<PositionType, string> = {
      'top-start': 'bottom left',
      top: 'bottom',
      'top-end': 'bottom right',
      right: 'top right',
      'bottom-end': 'top right',
      bottom: 'top',
      'bottom-start': 'top left',
      left: 'top left',
    };

    const style = {
      ...this.style,
      left: position.left + 'px',
      top: position.top + 'px',
      transformOrigin: PositionOffset[this.props.placement],
    };

    if (isEqual(style, this.state.style)) {
      return;
    }

    this.setState({ style });
  };

  /**
   * @description Set popup position
   */
  private setPosition = () => {
    if (this.triggerRef) {
      this.setPopupStyle();
    }
  };

  /**
   * @description Callback on portal mount
   */
  private handlePortalMount = () => {
    this.setPosition();
  };

  /**
   * @description Handle trigger mouseenter
   */
  private handleMouseEnter = (event: Event) => {
    if (this.mouseLeaveTimer) {
      clearTimeout(this.mouseLeaveTimer);
      this.mouseLeaveTimer = undefined;
    }

    const { open } = this.props;

    // Call original event handler
    if (!this.mouseEnterTimer && !open) {
      this.mouseEnterTimer = window.setTimeout(() => {
        this.props.onToggle && this.props.onToggle(true);
      }, 0);
    }

    this.props.trigger.props.onMouseEnter && this.props.trigger.props.onMouseEnter(event);
  };

  /**
   * @description Handle trigger mouseleave
   */
  private handleMouseLeave = (event: Event) => {
    if (this.mouseEnterTimer) {
      clearTimeout(this.mouseEnterTimer);
      this.mouseEnterTimer = undefined;
    }

    // const { mouseLeaveDelay } = this.props;

    // Call original event handler
    if (!this.mouseLeaveTimer) {
      this.mouseLeaveTimer = window.setTimeout(() => {
        this.props.onToggle && this.props.onToggle(false);
      }, 0);
    }

    this.props.trigger.props.onMouseLeave && this.props.trigger.props.onMouseLeave(event);
  };

  /**
   * @description Handle popup mouseenter in case popup is hoverable
   */
  private handlePopupMouseEnter = () => {
    const { hoverable, on, open } = this.props;

    /* this.mouseLeaveTimer should be cleared in case the popup is open
     * and is hoverable.
     */
    if (on === 'hover' && hoverable && open) {
      if (this.mouseLeaveTimer) {
        clearTimeout(this.mouseLeaveTimer);
        this.mouseLeaveTimer = undefined;
      }
    }
  };

  /**
   * @description Handle popup mouseleave in case popup is hoverable
   */
  private handlePopupMouseLeave = () => {
    const { hoverable, on, open } = this.props;

    /* this.mouseLeaveTimer should be set in case the popup is open
     * and is hoverable. In case mouseLeaveDelay is not specified
     * timeout of 300ms is provided in order to provide some time
     * to move between the trigger and the popup.
     */
    if (on === 'hover' && hoverable && open) {
      if (!this.mouseLeaveTimer) {
        this.mouseLeaveTimer = window.setTimeout(() => {
          this.props.onToggle && this.props.onToggle(false);
        }, 0);
      }
    }
  };

  /**
   * @description Handle trigger toggle on click
   */
  private handleTriggerToggle = (event: Event) => {
    // Call original event handler
    this.props.onToggle && this.props.onToggle(!this.props.open);

    // Call original trigger click function
    if (this.props.on === 'click') {
      this.props.trigger.props.onClick && this.props.trigger.props.onClick(event);
    }
  };

  /**
   * @description Generate props for trigger
   */
  private getTriggerProps = () => {
    const triggerProps: { [key: string]: (event: Event) => void } = {};

    const { on } = this.props;

    if (on === 'click') {
      triggerProps.onClick = this.handleTriggerToggle;
    }

    if (on === 'hover') {
      triggerProps.onMouseEnter = this.handleMouseEnter;
      triggerProps.onMouseLeave = this.handleMouseLeave;
    }

    return triggerProps;
  };

  /**
   * @description Generate props for popup
   */
  private getPopupProps = () => {
    const popupProps: { [key: string]: (event: Event) => void } = {};

    const { on, hoverable } = this.props;

    if (on === 'hover' && hoverable) {
      popupProps.onMouseEnter = this.handlePopupMouseEnter;
      popupProps.onMouseLeave = this.handlePopupMouseLeave;
    }
    return popupProps;
  };

  /**
   * @description Close popup if clicked outside
   * @param {event} event Click event
   */
  public doesNodeContainClick = (event: Event) => {
    if (
      !(
        this.popupRef.current!.contains(event.target as HTMLElement) ||
        this.triggerRef.current!.contains(event.target as HTMLElement)
      )
    ) {
      this.handleTriggerToggle(event);
    }
  };

  public componentDidMount() {
    this.handlePortalMount();

    const { on, open, closeOnBackdropClick } = this.props;

    // Attach event listener in case closeOnBackdropClick is true
    if (on === 'click' && open && closeOnBackdropClick) {
      document.addEventListener('mousedown', this.doesNodeContainClick);
    }
  }

  public componentDidUpdate(prevProps: PopperWrapperProps) {
    const { on, open, closeOnBackdropClick } = this.props;

    if (open) {
      this.handlePortalMount();
    }

    if (prevProps.open !== this.props.open) {
      if (this.props.open) {
        this.setState({ isOpen: true });
      } else {
        this.animateTimer = window.setTimeout(() => {
          this.setState({ isOpen: false });
        }, 120);
      }
    }

    // Attach/remove event listeners on update
    if (on === 'click' && open && closeOnBackdropClick) {
      document.addEventListener('mousedown', this.doesNodeContainClick);
    } else if (on === 'click' && !open && closeOnBackdropClick) {
      document.removeEventListener('mousedown', this.doesNodeContainClick);
    }
  }

  public render() {
    const { children, trigger, appendToBody, open } = this.props;
    const { isOpen } = this.state;

    const popup = (
      // Wrapper
      <div
        className={open ? 'Popover--open' : 'Popover--close'}
        style={{ position: 'relative', display: 'inline-block', zIndex: 2147483600, ...this.state.style }}
        ref={this.popupRef}
        {...this.getPopupProps()}
      >
        {children}
      </div>
    );

    const popupWrapper = (
      <>
        {React.cloneElement(trigger, {
          ref: this.triggerRef,
          ...this.getTriggerProps(),
        })}
        {isOpen && ReactDOM.createPortal(popup, this.mountNode!)}
      </>
    );

    if (appendToBody) {
      return popupWrapper;
    } else {
      return (
        // <PopupContainerWrapper>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          {React.cloneElement(trigger, {
            ref: this.triggerRef,
            ...this.getTriggerProps(),
          })}
          {!appendToBody && isOpen && popup}
        </div>
      );
    }
  }
}

export default PopperWrapper;
