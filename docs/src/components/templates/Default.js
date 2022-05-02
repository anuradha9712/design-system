import React from 'react';
import Layout from '../Layout';
import { useFrontmatter } from '../../util/Frontmatter';
import MDXPage from '../PageLayout/MDXPage';

// export default ({ pageContext, children, ...rest }) => {
 const defaultTemplate =  (props) => {
  // console.log('pageContext', pageContext, '--1', children, '--2', ...rest);
  console.log('props', props);
  const { frontmatter = {}, titleType, body } = props.pageContext;
  const { title, description, keywords, tabs, logos, showMobile = false } = frontmatter;
  // const is404 = children && children.key === null;
  const is404 = false;
  const relativePagePath = props.path;
 // const newFrontmatter = useFrontmatter(relativePagePath);

  return (
    <Layout
      titleType={titleType}
      title={title}
      description={description}
      keywords={keywords}
      relativePagePath={relativePagePath}
      showMobile={showMobile}
      frontmatter={frontmatter}
      showAnimation={props.location.state?.animation === false ? false : true}
      is404Page={is404}
    >
      <MDXPage 
        frontmatter={frontmatter}
        relativePagePath={relativePagePath}
        description={description}
        title={title}
        tabs={tabs}
        children={body}
        is404Page={is404}
        location={props.location}
        logos={logos}
      />
    </Layout>
  );
};

export default defaultTemplate;