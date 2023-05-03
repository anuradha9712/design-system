import * as React from 'react';
import StatusHint from '../StatusHint';

// CSF format story
export const all = () => {
  const children = 'Status Hint';

  const appearance = 'success';

  const options = {
    appearance,
  };

  return (
    <div>
      <StatusHint {...options}>{children}</StatusHint>
    </div>
  );
};

export default {
  title: 'Indicators/StatusHint/All',
  component: StatusHint,
};
