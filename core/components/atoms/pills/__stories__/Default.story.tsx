import * as React from 'react';
import Pills from '../Pills';

export const defaultPill = () => (
  <Pills appearance="secondary" subtle={false} ariaLabel="20 records added">
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
        a11yProps: ` 
        **ariaLabel:** Add \`ariaLabel='20 records added'\` to describe the numeric value in Pill. 
         `,
      },
    },
  },
};
