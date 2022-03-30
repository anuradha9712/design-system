import { useStaticQuery, graphql } from 'gatsby';

export function useSearchItems() {
  const data = useStaticQuery(graphql`
    query SearchQuery {
      localSearchPages {
        store
        publicStoreURL
        publicIndexURL
        id
      }
    }
  `);

  // const items = edges.map(({ node }) => node);
  console.log('search data', data)
  return data;
}
