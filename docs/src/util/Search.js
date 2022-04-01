import { useStaticQuery, graphql } from 'gatsby';

export function useSearchItems(query) {
  const {
    allMdx: { edges },
  } = useStaticQuery(graphql`
    query SEARCH_QUERY {
      allMdx {
        edges {
          node {
            frontmatter {
              title
              description
            }
            slug
          }
        }
      }
    }
  `);

  console.log('query-> ', query);
  const items = edges.map(({ node }) => node);
  console.log('search Items', items);
  return items;
}
