import * as React from 'react';
import Pills from '../Pills';

export const subtleAlert = () => {
  return (
    <Pills appearance="alert" subtle={true} ariaLabel="100 records found">
      {'99+'}
    </Pills>
  );
};

export default {
  title: 'Components/Pills/Subtle Alert',
  component: Pills,
  parameters: {
    docs: {
      docPage: {
        title: 'Pills',
        description: 'Pills are used to highlight number of items. For status and text, use a Badge.',
        a11yProps: ` 
        **ariaLabel:** Add \`ariaLabel='100 records found'\` to describe the numeric value in Pill. 
         `,
      },
    },
  },
};
