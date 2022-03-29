import { useStaticQuery, graphql } from 'gatsby';

export function useSearchItems() {
  const data = useStaticQuery(graphql`
			query SearchIndexQuery {
				siteSearchIndex {
					index
				}
			}
  `);

  // const items = edges.map(({ node }) => node);
  return data;
}
