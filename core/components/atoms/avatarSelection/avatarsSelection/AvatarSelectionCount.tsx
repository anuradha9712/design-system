import * as React from 'react';
import { Text, Avatar } from '@/index';
import classNames from 'classnames';
import { AvatarData } from '../AvatarSelection';
import { AvatarSelectionContext } from '../AvatarSelectionProvider';
import { handleKeyDown } from './utils';
import { AvatarSize } from '@/common.type';

interface CountAvatarProp {
  size?: AvatarSize;
  hiddenAvatarCount?: number;
  hiddenAvatarList: AvatarData[];
  avatarStyle?: { backgroundColor?: string; boxShadow?: string };
}

export const SelectionAvatarCount = (props: CountAvatarProp) => {
  const { hiddenAvatarCount, avatarStyle, size, hiddenAvatarList } = props;

  const contextProp = React.useContext(AvatarSelectionContext);
  const { selectedItems, setHighlightFirstItem, setHighlightLastItem, triggerRef, setOpenPopover } = contextProp;

  const [selectedItemCount, setSelectedItemCount] = React.useState(0);

  const wrapperClassName = classNames({
    ['SelectionAvatarCount-wrapper']: true,
    ['SelectionAvatarCount--selected']: selectedItemCount > 0,
  });

  React.useEffect(() => {
    const selectedList = hiddenAvatarList.filter((data1: AvatarData) =>
      selectedItems?.some((data2: AvatarData) => data2 === data1)
    );
    setSelectedItemCount(selectedList.length);
  }, [selectedItems]);

  return (
    <div
      data-test="DesignSystem-AvatarGroup--TriggerAvatar"
      className={wrapperClassName}
      onKeyDown={(event) => handleKeyDown(event, setOpenPopover, setHighlightFirstItem, setHighlightLastItem)}
      style={avatarStyle}
      tabIndex={0}
      role="button"
      ref={triggerRef}
    >
      <Avatar size={size} appearance="secondary" className="SelectionAvatarCount">
        <Text className="overflow-hidden">{`+${hiddenAvatarCount}`}</Text>
      </Avatar>
    </div>
  );
};

export default SelectionAvatarCount;
