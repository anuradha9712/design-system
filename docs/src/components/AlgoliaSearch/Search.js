import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, connectHits, Highlight } from 'react-instantsearch-dom';
import { Link } from "gatsby"

const searchClient = algoliasearch(
  process.env.GATSBY_ALGOLIA_APP_ID,
  process.env.GATSBY_ALGOLIA_SEARCH_KEY
)

const Hits = connectHits(({ hits }) => (
  // console.log(hits)
  // return (
  <div className="d-flex flex-wrap">
    {/* Always use a ternary when coercing an array length */}
    {/* otherwise you might print out "0" to your UI */}
    {JSON.stringify(hits)}
    <br />
    <br />
    <h3>Now content start</h3>
    {hits.length ? (
      <>
        {/* I wanted to give a little explanation of the search here */}
        <div
        // css={{
        //   fontFamily: FONTS.catamaran,
        //   fontSize: '.85rem',
        //   fontStyle: 'italic',
        //   marginBottom: bs(),
        //   maxWidth: '30rem',
        // }}
        >
          These are the results of your search. The title and excerpt are
          displayed, though your search may have been found in the content of
          the post as well.
        </div>
        {/* Here is the crux of the component */}
        {hits.map(hit => {
          return (
            <div
              // css={{ marginBottom: bs() }} 
              key={hit.objectID}>
              <Link
                className="d-block mb-4"
                // css={{ display: 'block', marginBottom: bs(0.5) }}
                to={hit.slug}
              >
                <div
                // className="bg-primary"
                // css={{ marginBottom: 0 }}
                >
                  <Highlight attribute="title" hit={hit} tagName="strong" />
                  <br /><br />
                </div>
                {hit.description ? (
                  <h5
                  // css={{ marginBottom: 0 }}
                  >
                    <Highlight
                      attribute="subtitle"
                      hit={hit}
                      tagName="strong"
                    />
                  </h5>
                ) : null}
              </Link>
              <div>
                <Highlight attribute="excerpt" hit={hit} tagName="strong" />
              </div>
            </div>
          )
        })}
      </>
    ) : (
      <p>There were no results for your query. Please try again.</p>
    )}
  </div>
  // )
))


export default function Search() {
  return (
    <div className="d-flex">
      <InstantSearch
        indexName={process.env.GATSBY_ALGOLIA_INDEX_NAME}
        searchClient={searchClient}
      >
        <SearchBox />
        <Hits />
      </InstantSearch>
    </div>
  )
}
