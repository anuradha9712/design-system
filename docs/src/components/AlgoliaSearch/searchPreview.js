import React from 'react';
import { connectSearchBox, connectHits } from 'react-instantsearch-dom';
import { Popover, Input } from '@innovaccer/design-system';
import './_search.css';

// const SearchBox = ({ currentRefinement, refine }) => (
//   <div className="ais-SearchBox">
//     <form noValidate action="" role="search" className="ais-SearchBox-form">
//       <input
//         className="ais-SearchBox-input"
//         type="search"
//         value={currentRefinement}
//         onChange={(event) => refine(event.currentTarget.value)}
//       />
//     </form>
//   </div>
// );

// export const CustomSearchBox = connectSearchBox(SearchBox);
// // print out first and last characters around search term
const getSnippet = (excerpt, match) => {
  const index = excerpt.indexOf(match);
  return excerpt.substring(index - 50, index + 50);
};
// // only display Hits when user types in SearchBox
// const Hits = ({ hits }) => {
//   console.log('hits', hits)
//   return (
//     <ul className="style">
//       {hits.map((hit) => (
//         <li key={hit.title}>
//           <a href={hit.slug}>
//             {hit.title}
//             <p>{`...${getSnippet(hit.title, hit._highlightResult.title.matchedWords[0])}...`}
//             </p>
//           </a>
//         </li>
//       ))}
//     </ul>
//   )
// };

// export const CustomHits = connectHits(Hits);

//===================== Using DS Components =======================
const searchInput = ({ currentRefinement, refine }) => (
  <Input
    placeholder="Enter component name"
    name="input"
    className="w-25"
    value={currentRefinement}
    onChange={(event) => refine(event.currentTarget.value)}
  />
)

export const CustomSearchBox = connectSearchBox(searchInput);

// only display Hits when user types in searchInput
const Hits = ({ hits }) => {
  console.log('hits', hits)
  return (
    <Popover
      position="bottom-start"
      on="click"
      // trigger={searchInput}
    >
      <ul className="style">
        {hits.map((hit) => (
          <li key={hit.title}>
            <a href={hit.slug}>
              {hit.title}
              <p>{`...${getSnippet(hit.title, hit._highlightResult.title.matchedWords[0])}...`}
              </p>
            </a>
          </li>
        ))}
      </ul>
    </Popover>
  )
};

export const CustomHits = connectHits(Hits);
