const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');

exports.onPreBootstrap = ({ store, reporter }) => {
  const { program } = store.getState();

  const dirs = [
    path.join(program.directory, 'src/images'),
    path.join(program.directory, 'src/data'),
  ];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      reporter.log(`creating the ${dir} directory`);
      mkdirp.sync(dir);
    }
  });
};

exports.createPages = async ({ actions, graphql, reporter }, pluginOptions) => {
  const result = await graphql(`
    query {
      allMdx {
        nodes {
          body
          frontmatter {
            date
            description
            logos
            showMobile
            tabs
            title
          }
          slug
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panic("failed to create posts ", result.errors);
  }

  const pages = result.data.allMdx.nodes;

  // The context object **is** supplied to MDX templates through the pageContext prop.

  pages.forEach((page) => {
    // console.log('==============',page)
    // actions.deletePage(page);
    actions.createPage({
      path: page.slug,
      //component: require.resolve("./src/templates/Default.js"),
      component: require.resolve("./src/components/templates/Default.js"),
      context: {
        slug: page.slug,
        body: page.body,
        frontmatter: page.frontmatter,
        titleType: 'page',
        relativePagePath: '/components/overview/all-components/',
        // relativePagePath: page.componentPath?.split('src/pages').splice('-1')
        // children:
        //relativePagePath: page.slug
      },
    });
  });
};
