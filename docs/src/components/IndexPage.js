import React, { useState } from 'react';
import StaticLayout from "./StaticLayout";

const IndexPage = (props) => {
  console.log('props-->', props);
  return <h1>I'm index page</h1>
}

IndexPage.Layout = StaticLayout;
export default IndexPage;
