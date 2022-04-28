// require('@fontsource/nunito-sans');
// require('@fontsource/roboto-mono');
// require('@fontsource/nunito-sans/600.css');
// require('@fontsource/nunito-sans/700.css');
// require('@fontsource/nunito-sans/800.css');
// require('@fontsource/nunito-sans/900.css');
// require("@innovaccer/design-system/css");
// require("./src/components/css/prism.css");
// require("prismjs/themes/prism-solarizedlight.css");
// require('./src/components/css/global.css');
// // import React from 'react';
const React = require('react');
const IndexPage = require('./src/components/IndexPage');

// export function wrapPageElement({ element, props }) {
//   const Layout = element.type.Layout ?? <></>
//   return <Layout {...props}>{element}</Layout>
// }

// Wraps every page in a component
exports.wrapPageElement = ({ element, props }) => {
  return <IndexPage {...props}>{element}</IndexPage>
}

