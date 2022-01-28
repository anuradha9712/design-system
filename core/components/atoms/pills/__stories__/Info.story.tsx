import * as React from 'react';
import Pills from '../Pills';

export const info = () => (
  <Pills appearance="primary" subtle={false}>
    10
  </Pills>
);

export default {
  title: 'Components/Pills/Info',
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
