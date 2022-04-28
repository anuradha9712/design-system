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
