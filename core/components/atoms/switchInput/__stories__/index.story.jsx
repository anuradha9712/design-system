import * as React from 'react';
import { Switch } from '@/index';

// CSF format story
export const all = () => <Switch aria-label="Default Checked Switch" defaultChecked={true} size="regular" />;

export default {
  title: 'Selection/Switch/All',
  component: Switch,
  parameters: {
    docs: {
      docPage: {
        title: 'Switch',
        a11yProps: ` **aria-label:** Add \`aria-label='Default Checked Switch'\` to describe the action of switch.`,
      },
    },
  },
};
