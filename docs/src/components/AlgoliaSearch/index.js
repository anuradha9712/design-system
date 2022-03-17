import algoliasearch from "algoliasearch/lite";
import { createRef, default as React, useState, useMemo } from "react";
import { InstantSearch } from "react-instantsearch-dom";
import SearchBox from "./searchBox";
import useClickOutside from "./use-click-outside";
import SearchResult from "./searchResult";
import './search.css';

export default function Search({ indices }) {
  const rootRef = createRef()
  const [query, setQuery] = useState()
  const [hasFocus, setFocus] = useState(false)
  const searchClient = useMemo(
    () =>
      algoliasearch(
        process.env.GATSBY_ALGOLIA_APP_ID,
        process.env.GATSBY_ALGOLIA_SEARCH_KEY
      ),
    []
  )

  // useClickOutside(rootRef, () => setFocus(false))

  return (
    <div
      className="position-absolute algolia-search mr-6"
      ref={rootRef}>
      <InstantSearch
        searchClient={searchClient}
        indexName={indices[0].name}
        onSearchStateChange={({ query }) => setQuery(query)}
      >
        <SearchBox onFocus={() => setFocus(true)} hasFocus={hasFocus} />
        <SearchResult
          show={query && query.length > 0 && hasFocus}
          indices={indices}
          query={query}
        />
      </InstantSearch>
    </div>

  )
}
