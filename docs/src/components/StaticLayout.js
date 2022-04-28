import React, { useState } from 'react';

const StaticLayout = ({ children }) => {
  return (
    <div>
      <h1>static layout header</h1>
      <div>{children}</div>
    </div>
  )
}

export default StaticLayout;
