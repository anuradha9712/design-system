import * as React from 'react';
import classNames from 'classnames';
import { Icon } from '@/index';
import { ListboxItemProps } from './ListboxItem';
import { ListboxContext } from '../Listbox';
import { onKeyDown } from '../utils';

export const ListBody = (props: ListboxItemProps) => {
  const { children, className, disabled, selected, activated } = props;

  const contextProp = React.useContext(ListboxContext);
  const { size, type, draggable } = contextProp;

  const itemClass = classNames(
    {
      'Listbox-item': true,
      [`Listbox-item--${size}`]: size,
      [`Listbox-item--${type}`]: type,
      'Listbox-item--disabled': disabled,
      'Listbox-item--selected': selected && type === 'option',
      'Listbox-item--activated': activated && type === 'resource',
    },
    className
  );

  return (
    <div
      data-disabled={disabled}
      data-test="DesignSystem-Listbox-ItemWrapper"
      tabIndex={draggable ? -1 : 0}
      className={itemClass}
      onKeyDown={onKeyDown}
      role="tablist"
    >
      {draggable && (
        <Icon
          size={16}
          appearance="subtle"
          name="drag_indicator"
          className="Listbox-item--drag-icon"
          data-test="DesignSystem-Listbox-DragIcon"
        />
      )}
      {children}
    </div>
  );
};

export default ListBody;
