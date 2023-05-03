import * as React from 'react';
import Badge from '../Badge';

export const solidSecondary = () => (
  <Badge appearance="secondary" subtle={false}>
    {'Closed'}
  </Badge>
);

export default {
  title: 'Indicators/Badge',
  component: Badge,
  parameters: {
    docs: {
      docPage: {
        title: 'Badge',
      },
    },
  },
};
