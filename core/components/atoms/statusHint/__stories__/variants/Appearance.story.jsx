import * as React from 'react';
import StatusHint from '../../StatusHint';

// CSF format story
export const appearance = () => {
  const appearances = ['info', 'success', 'alert', 'warning', 'default'];

  return (
    <div>
      {appearances.map((iconAppearance, i) => {
        return (
          <div key={i} className="mb-4">
            <StatusHint appearance={iconAppearance}>{iconAppearance}</StatusHint>
          </div>
        );
      })}
    </div>
  );
};

export default {
  title: 'Indicators/StatusHint/Variants/Appearance',
  component: StatusHint,
  parameters: {
    docs: {
      docPage: {
        title: 'StatusHint',
      },
    },
  },
};
