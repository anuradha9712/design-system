import * as React from 'react';
import { Icon } from '@/index';

export const image = () => {
  return (
    <Icon size={48}>
      <img alt="Innovaccer logo" src="https://design.innovaccer.com/images/withoutType.png" width="48" height="48" />
    </Icon>
  );
};

export default {
  title: 'Components/Icon/Icon/Variants/Image',
  component: Icon,
  parameters: {
    docs: {
      docPage: {
        title: 'Components/Icon',
      },
    },
  },
};
