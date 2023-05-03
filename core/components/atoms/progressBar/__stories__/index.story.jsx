import * as React from 'react';
import ProgressBar from '../ProgressBar';

// CSF format story
export const all = () => {
  const value = 10;
  const max = 100;

  return (
    <div className="w-50">
      <ProgressBar value={value} max={max} />
    </div>
  );
};

export default {
  title: 'Indicators/ProgressBar/All',
  component: ProgressBar,
};
