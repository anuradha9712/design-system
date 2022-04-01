import React, { useState } from 'react';
import { useSearchItems } from '../../util/Search';
import { Input, Popover } from '@innovaccer/design-system';

const Search = () => {
  const [query, setQuery] = useState(null);
  const [searchResult, setSearchResult] = useState([]);
  const [openPopover, setOpenPopover] = useState(false);
  const searchList = useSearchItems();

  const handleSearchQuery = (e) => {
    setQuery(e.target.value);
    const query = e.target.value;
    setOpenPopover(true);
    const list = searchList.filter((data) => {
      const { title, description } = data.frontmatter;
      return title.toLowerCase().includes(query.toLowerCase()) || description.toLowerCase().includes(query.toLowerCase());
    });
    console.log('list', searchList);

    setSearchResult(list);
  }

  return (
    <div>
      <Popover
        position="bottom-start"
        open={openPopover}
        className="pt-4 pl-5"
        trigger={<Input
          className="w-25"
          icon="search"
          name="input"
          placeholder="Search components, patterns.."
          onChange={(e) => handleSearchQuery(e)}
        />}
      >
        {
          !query && 
          <div className="px-7 py-6 d-flex align-items-center overflow-hidden">
            <Icon className="mr-6" appearance='subtle' size={24} name='search_off' />
            <Text weight="medium">
              {`No results found for ${SearchQuery}`}
            </Text>
          </div>
        }
        {searchResult.length > 0 && searchResult.map((item) => <p>{item.frontmatter.title}</p>)}
      </Popover>
    </div>
  );
};

export default Search;
