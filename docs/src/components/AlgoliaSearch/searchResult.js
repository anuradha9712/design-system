import { Link } from "gatsby";
import { default as React } from "react";
import {
  connectStateResults,
  Highlight,
  Hits,
  Index,
  Snippet,
  PoweredBy,
} from "react-instantsearch-dom";
import { Popover } from '@innovaccer/design-system';
import searchBox from "./searchBox";
import './search.css';

const HitCount = connectStateResults(({ searchResults }) => {
  const hitCount = searchResults && searchResults.nbHits

  return hitCount > 0 ? (
    <div className="HitCount">
      {hitCount} result{hitCount !== 1 ? `s` : ``}
    </div>
  ) : null
})

const PageHit = ({ hit }) => {
  console.log('hittt', hit);
  return (
    <div>
      <Link to={hit.slug}>
        <h4>
          <Highlight attribute="title" hit={hit} tagName="mark" />
        </h4>
        <Snippet attribute="description" hit={hit} tagName="mark" />

      </Link>
    </div>
  )
}

// const PageHit = ({hit}) => {
//   // const { hit } = props;
//   // console.log('hittt', hit, 'vv', props);
//   return (<div>
//     {/* <h1>Patterns</h1> */}
//     {/* {
//       hit.filter((item) => item.slug.includes('pattern')).map((data) => {
//         return (
//           <p>{data.title}</p>
//         )
//       })
//     } */}
//     <div>
//       <Link to={hit.slug}>
//         <h4>
//           <Highlight attribute="title" hit={hit} tagName="mark" />
//         </h4>
//         <Snippet attribute="description" hit={hit} tagName="mark" />
//       </Link>
//     </div>
//   </div>
//   )
// }

const HitsInIndex = ({ index }) => (
  <Index indexName={index.name}>
    <HitCount />
    <Hits className="Hits" hitComponent={PageHit} />
  </Index>
)

// const SearchResult = ({ indices, className }) => (
//   <div className={className}>
//     {indices.map(index => (
//       <HitsInIndex index={index} key={index.name} />
//     ))}
//     <PoweredBy />
//   </div>
// )

const SearchResult = ({ indices, className, show }) => {
  // console.log('indices', indices);
  return (
    <Popover
      position="bottom-start"
      open={show}
      className="p-4 overflow-auto search-result"
    // appendToBody={true}
    // trigger={searchBox}
    >
      {indices.map(index => (
        <HitsInIndex index={index} key={index.name} />
      ))}
      <PoweredBy />
    </Popover>
  )
}


export default SearchResult;
