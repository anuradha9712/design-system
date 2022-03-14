// const mdxQuery = `{
//   allMdx {
//     edges {
//       node {
//         objectID: id
//         slug
//         frontmatter {
//           description
//           title
//         }
//       }
//     }
//   }
// }
// `

// const unnestFrontmatter = node => {
//   const { frontmatter, ...rest } = node

//   return {
//     ...frontmatter,
//     ...rest,
//   }
// }

// const queries = [
//   {
//     query: mdxQuery,
//     transformer: ({ data }) =>
//       data.allMdx.edges.map(edge => edge.node).map(unnestFrontmatter),
//   },
// ]

// module.exports = queries;

// =========================================================
const pageQuery = `{
  docs: allMdx {
    edges {
      node {
        objectID: id
        slug
        frontmatter {
          title
          description
      }
     }
    }
   }
  }`

const flatten = arr =>
  arr.map(({ node: { frontmatter, ...rest } }) => ({
    ...frontmatter,
    ...rest,
  }))
const settings = { attributesToSnippet: [`excerpt:20`] }
const queries = [{
  query: pageQuery,
  transformer: ({ data }) => flatten(data.docs.edges),
  indexName: `docs`,
  settings,
}]
module.exports = queries
