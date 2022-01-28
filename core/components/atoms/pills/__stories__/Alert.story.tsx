import * as React from 'react';
import Pills from '../Pills';

export const alert = () => (
  <Pills appearance="alert" subtle={false}>
    10
  </Pills>
);

export default {
  title: 'Components/Pills/Alert',
  component: Pills,
  parameters: {
    docs: {
      docPage: {
        title: 'Pills',
        description: 'Pills are used to highlight number of items. For status and text, use a Badge.',
      },
    },
  },
};
