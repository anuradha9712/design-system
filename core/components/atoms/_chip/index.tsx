import * as React from 'react';
import classNames from 'classnames';
import Icon from '@/components/atoms/icon';
import Text from '@/components/atoms/text';
import { Name } from '../chip/Chip';
import { BaseProps, extractBaseProps } from '@/utils/types';
import { IconProps, TextProps } from '@/index.type';
import { IconType } from '@/common.type';

export interface GenericChipProps extends BaseProps {
  label: string | React.ReactElement;
  labelPrefix?: string;
  icon?: string;
  clearButton?: boolean;
  disabled?: boolean;
  selected?: boolean;
  onClose?: () => void;
  onClick?: () => void;
  iconType?: IconType;
  name: Name;
}

export const GenericChip = (props: GenericChipProps) => {
  const { label, icon, clearButton, disabled, className, selected, onClose, onClick, labelPrefix, iconType } = props;

  const baseProps = extractBaseProps(props);

  const iconClass = (align: string) =>
    classNames({
      ['Chip-icon']: true,
      [`Chip-icon--${align}`]: align,
      [`Chip-icon-disabled--right`]: align === 'right' && disabled,
      ['cursor-pointer']: align === 'right' && !disabled,
      ['Chip-icon--selected']: align === 'right' && selected,
    });

  const onCloseHandler = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (onClose) onClose();
  };

  const onClickHandler = () => {
    if (onClick) onClick();
  };

  const onKeyDownHandler = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      onCloseHandler(event);
    }
  };

  const iconAppearance = (align: string) =>
    classNames({
      ['disabled']: disabled && !selected,
      ['primary_dark']: !disabled && selected,
      ['primary_lighter']: disabled && selected,
      ['subtle']: !disabled && !selected && align === 'right',
      ['inverse']: !disabled && !selected && align === 'left',
    }) as IconProps['appearance'];

  const textColor = classNames({
    ['primary-lighter']: disabled && selected,
    ['inverse-lightest']: disabled && !selected,
    ['primary-dark']: selected,
    ['inverse']: !disabled && !selected,
  }) as TextProps['color'];

  const renderLabel = () => {
    if (typeof label === 'string') {
      return (
        <>
          {labelPrefix && (
            <Text
              data-test="DesignSystem-GenericChip--LabelPrefix"
              weight="medium"
              color={textColor}
              className="Chip-text mr-3"
            >
              {labelPrefix}
            </Text>
          )}
          <Text data-test="DesignSystem-GenericChip--Text" color={textColor} className="Chip-text">
            {label}
          </Text>
        </>
      );
    }
    return label;
  };

  return (
    // TODO(a11y)
    // eslint-disable-next-line
    <div
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={disabled ? -1 : 0}
      data-test="DesignSystem-GenericChip--GenericChipWrapper"
      {...baseProps}
      className={`Chip-wrapper ${className}`}
      onClick={onClickHandler}
    >
      {icon && (
        <Icon
          data-test="DesignSystem-GenericChip--Icon"
          name={icon}
          type={iconType}
          appearance={iconAppearance('left')}
          className={iconClass('left')}
        />
      )}
      {renderLabel()}
      {clearButton && (
        <div
          role="button"
          onClick={onCloseHandler}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={onKeyDownHandler}
          className={iconClass('right')}
          data-test="DesignSystem-GenericChip--clearButton"
        >
          <Icon name="clear" appearance={iconAppearance('right')} className="p-2" />
        </div>
      )}
    </div>
  );
};

GenericChip.displayName = 'GenericChip';

export default GenericChip;
