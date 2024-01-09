import * as React from 'react';
import Avatar from '../Avatar';
import { AvatarImage } from '../image';
import { AvatarIcon } from '../icon';

// CSF format story
export const withIcon = () => {
  const appearance = 'primary';
  const withTooltip = true;
  const firstName = 'Innovaccer';
  const lastName = 'Bot';

  const options = {
    appearance,
    withTooltip,
    firstName,
    lastName,
  };

  return (
    <Avatar {...options}>
      <Avatar.Icon name="smart_toy" />
    </Avatar>
  );
};

export default {
  title: 'Indicators/Avatar/With Icon',
  component: Avatar,
  subcomponents: { 'Avatar.Image': AvatarImage, 'Avatar.Icon': AvatarIcon },
};
