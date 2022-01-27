import * as React from 'react';
import Badge from '../Badge';

export const subtleAlert = () => (
  <Badge appearance="alert" subtle={true}>
    {'Alert'}
  </Badge>
);

export default {
  title: 'Components/Badge/Subtle Alert',
  component: Badge,
  parameters: {
    docs: {
      docPage: {
        title: 'Badge',
      },
    },
  },
};
