import * as React from 'react';
import { action } from '@/utils/action';
import { Tabs, Dropdown, Input, Tab } from '@/index';

// CSF format story
export const inlineContent = () => {
  const options = [
    {
      label: 'Increasing',
      value: 'Increasing',
    },
    {
      label: 'Decreasing',
      value: 'Decreasing',
    },
  ];

  const onTabChangeHandler = (tabIndex) => {
    return action(`tab-change: ${tabIndex}`)();
  };

  return (
    <Tabs onTabChange={onTabChangeHandler} className="mb-6">
      <Tab label="All" count={12} className="pl-5">
        <div>All</div>
      </Tab>
      <Tab label="Active User" count={3} className="pl-5">
        <div>Active User</div>
      </Tab>
      <Tab label="Inactive User" count={9} className="pl-5">
        <div>Inactive User</div>
      </Tab>
      <div className="d-flex justify-content-end flex-grow-1">
        <div style={{ width: 'var(--spacing-9)' }} className="ml-8">
          <Input placeholder="Search by name" icon="search" />
        </div>
        <div style={{ width: 'var(--spacing-8)' }} className="ml-4">
          <Dropdown options={options} placeholder="Sort by" />
        </div>
      </div>
    </Tabs>
  );
};

const customCode = `() => {
  const options = [
    {
      label: 'Increasing',
      value: 'Increasing',
    },
    {
      label: 'Decreasing',
      value: 'Decreasing'
    },
  ];

  return(
    <Tabs
      onTabChange={console.log}
      className="mb-6"
    >
      <Tab label="All" count={12} className="pl-5">
        <div>All</div>
      </Tab>
      <Tab label="Active User" count={3} className="pl-5">
        <div>Active User</div>
      </Tab>
      <Tab label="Inactive User" count={9} className="pl-5">
        <div>Inactive User</div>
      </Tab>
      <div className="d-flex justify-content-end flex-grow-1">
        <div style={{ width: 'var(--spacing-9)' }} className="ml-8">
          <Input placeholder="Search by name" icon="search" />
        </div>
        <div style={{ width: 'var(--spacing-8)' }} className="ml-4">
          <Dropdown options={options} placeholder="Sort by" />
        </div>
      </div>
    </Tabs>
  );
}`;

export default {
  title: 'Components/Tabs/Inline Content',
  component: Tabs,
  parameters: {
    docs: {
      docPage: {
        customCode,
      },
    },
  },
};
