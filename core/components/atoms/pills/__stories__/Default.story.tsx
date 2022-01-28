import * as React from 'react';
import Pills from '../Pills';

export const defaultPill = () => (
  <Pills appearance="secondary" subtle={false}>
    20
  </Pills>
);

export default {
  title: 'Components/Pills/Default Pill',
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
