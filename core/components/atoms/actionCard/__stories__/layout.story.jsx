import * as React from 'react';
import { ActionCard, Icon, Text } from '@/index';

export const layout = () => {
  return (
    <div>
      <Text weight="strong">Center Content Alignment:</Text>
      <ActionCard className="w-25 mb-8 mt-6">
        <div className="d-flex flex-column align-items-center justify-content-center p-6 text-align-center">
          <Icon name="store" size={24} className="mb-4" />
          <Text weight="strong" className="mb-2">
            Marketplace
          </Text>
          <Text appearance="subtle">Explore and purchase apps and add-ons</Text>
        </div>
      </ActionCard>

      <Text weight="strong">Left Content Alignment:</Text>
      <ActionCard className="w-25 mt-6">
        <div className="d-flex justify-content-center pl-5 py-6 pr-6 text-align-start">
          <Icon name="store" size={24} className="mr-5" />
          <div>
            <Text weight="strong">Marketplace</Text>
            <br />
            <Text appearance="subtle">Explore and purchase apps and add-ons</Text>
          </div>
        </div>
      </ActionCard>
    </div>
  );
};

export default {
  title: 'Components/Action Card/Layout',
  component: ActionCard,
  parameters: {
    docs: {
      docPage: {
        title: 'Action Card',
        propDescription: `Note: All the valid properties of HTML DIV elements are acceptable as a prop`,
      },
    },
  },
};
