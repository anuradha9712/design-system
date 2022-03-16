const pageQuery = `{
  allMdx {
    edges {
      node {
        id
        slug
        frontmatter {
          title
          description
        }
      }
    }
  }
}`

// const queries = [
//   {
//     query: pageQuery,
//     transformer: ({ data }) => data.allMdx.edges.map(({ node }) => node),
//     indexName: process.env.GATSBY_ALGOLIA_INDEX_NAME || 'Algolia-Search',
//     // matchFields: ['slug', 'modified'],
//   }
// ];
// module.exports = queries;

function pageToAlgoliaRecord({ node: { id, frontmatter, ...rest } }) {
  return {
    objectID: id,
    ...frontmatter,
    ...rest,
  }
}
const queries = [
  {
    query: pageQuery,
    transformer: ({ data }) => data.allMdx.edges.map(pageToAlgoliaRecord),
    indexName: process.env.GATSBY_ALGOLIA_INDEX_NAME || 'Algolia-Search',
    //tells Algolia you will want to generate “snippets” of context around your hits in the 'title' & 'description' attribute.
    settings: { attributesToSnippet: ['title', 'description'] },
  },
]
module.exports = queries
