import { Link } from "gatsby";
import { default as React } from "react";
import {
  connectStateResults,
  Highlight,
  Hits,
  Index,
  Snippet,
  PoweredBy,
  connectHits
} from "react-instantsearch-dom";
import { Popover, Subheading, Text, Icon } from '@innovaccer/design-system';
import './search.css';
import { removeDuplicate, getHeadingUrl } from "./helpers";

const HitCount = connectStateResults(({ searchResults }) => {
  const hitCount = searchResults && searchResults.nbHits

  return hitCount > 0 ? (
    <div className="HitCount">
      {hitCount} result{hitCount !== 1 ? `s` : ``}
    </div>
  ) : null
})

let SearchQuery;

const CustomResultEntry = ({ data }) => {
  console.log('dataaa', data)
  const selectedHeadings = data.headings.filter((item) => item.toLowerCase().includes(SearchQuery.toLowerCase()))
  const headingList = selectedHeadings.map((heading) => {
    return { name: heading, link: getHeadingUrl(data.slug, heading) }
  });

  return (
    <div className="pb-6">
      <Link to={`/${data.slug}`} className="search-result-link">
        <div className="search-result-entry px-5 pt-3">
          <div className="py-2 d-flex align-items-center overflow-hidden">
            <Text weight="medium" >
              <Highlight attribute="title" hit={data} tagName="b" />
            </Text>
            {
              data.slug.includes('mobile') ?
                <Icon className="ml-4" appearance='subtle' size={16} name='phone_iphone' /> :
                <Icon className="ml-4" appearance='subtle' size={16} name='desktop_windows' />
            }
          </div>
          <div>
            <Text>
              <Highlight attribute="description" hit={data} tagName="b" />
            </Text>
          </div>
        </div>
      </Link>
      <div className="px-5 pt-3">
        {headingList && headingList.map((item) => {
          return (
            <Link
              to={`/${item.link}`}
              className="search-result-link">
              <div className="p-4 search-result-entry d-flex align-items-center">
                <Icon className="mx-4" appearance='subtle' size={16} name='tag' />
                <Text>{item.name}</Text>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

const ShowResults = ({ name, list }) => {
  return (
    <div>
      <Subheading className="pb-4 px-5" appearance="subtle">{name}</Subheading>
      {list.map((data) => <CustomResultEntry data={data} />)}
    </div>
  )
}

const PageHit = ({ hits }) => {
  console.log('hittt', hits);
  if (hits.length == 0) {
    return (
      <div className="p-7 d-flex align-items-center overflow-hidden">
        <Icon className="mr-6" appearance='subtle' size={24} name='search_off' />
        <Text weight="medium">
          {`No results found for ${SearchQuery}`}
        </Text>
      </div>
    )
  }
  const components = [],
    patterns = [],
    foundations = [],
    content = [],
    resources = [],
    introduction = [],
    mobile = [],
    web = [];

  hits.forEach((item) => {
    item.slug.includes('mobile') && mobile.push(item);
    !item.slug.includes('mobile') && web.push(item);
  });

  const updatedWebList = removeDuplicate(web);
  const updatedMobileList = removeDuplicate(mobile);

  hits.forEach((item) => {
    item.slug.includes('components') && components.push(item);
    item.slug.includes('patterns') && patterns.push(item);
    item.slug.includes('foundations') && foundations.push(item);
    item.slug.includes('content') && content.push(item);
    item.slug.includes('resources') && resources.push(item);
    item.slug.includes('introduction') && introduction.push(item);
  });

  return (
    <div>
      {components.length > 0 && <ShowResults name="Components" list={components} />}
      {patterns.length > 0 && <ShowResults name="Patterns" list={patterns} />}
      {foundations.length > 0 && <ShowResults name="Foundations" list={foundations} />}
      {content.length > 0 && <ShowResults name="Content" list={content} />}
      {resources.length > 0 && <ShowResults name="Resources" list={resources} />}
      {introduction.length > 0 && <ShowResults name="Introduction" list={introduction} />}
    </div>
  )
}
const CustomHits = connectHits(PageHit);

const HitsInIndex = ({ index }) => (
  <Index indexName={index.name}>
    {/* <HitCount /> */}
    {/* <Hits className="Hits" hitComponent={PageHit} /> */}
    <CustomHits />
  </Index>
)

const SearchResult = ({ indices, show, query, parentRef }) => {
  SearchQuery = query;
  return (
    <Popover
      position="bottom-start"
      open={show}
      className="py-4 overflow-auto search-result"
      boundaryElement={parentRef}
    // appendToBody={true}
    // trigger={searchBox}
    >
      {indices.map(index => (
        <HitsInIndex index={index} key={index.name} />
      ))}
      {/* <PoweredBy /> */}
    </Popover>
  )
}


export default SearchResult;
