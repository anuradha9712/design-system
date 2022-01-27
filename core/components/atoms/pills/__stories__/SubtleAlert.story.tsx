import * as React from 'react';
import Pills from '../Pills';

export const subtleAlert = () => {
  return (
    <Pills appearance="alert" subtle={true}>
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
      },
    },
  },
};
