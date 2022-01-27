import * as React from 'react';
import Pills from '../Pills';

export const subtleWarning = () => (
  <Pills appearance="warning" subtle={true}>
    {'99+'}
  </Pills>
);

export default {
  title: 'Components/Pills/Subtle Warning',
  component: Pills,
  parameters: {
    docs: {
      docPage: {
        title: 'Pills',
      },
    },
  },
};
