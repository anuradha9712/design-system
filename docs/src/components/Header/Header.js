import React, { useState } from 'react';
import { Link } from 'gatsby';
import { useHeaderItems } from '../../util/HeaderItems';
import './Header.css';
import { Link as MDSLink } from '@innovaccer/design-system';
import Search from '../AlgoliaSearch/Search';
// const ClickOutHandler = require('react-onclickout');

import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  SearchBox,
  Hits,
  Configure
} from 'react-instantsearch-dom';
import { CustomHits, CustomSearchBox } from '../AlgoliaSearch/searchPreview';

const Header = ({ relativePagePath }) => {
  const [isToggledOn, setIsToggledOn] = useState(false);
  const [hasInput, setHasInput] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const searchClient = algoliasearch('3BR8B13LJF', '1abd7ed1344e89cf8cbcc5a8eb40d910');

  const items = useHeaderItems();
  const checkActive = (label) => {
    const pagePath = relativePagePath.split('/');
    if (pagePath[1] === label.toLowerCase() || pagePath[2] === label.toLowerCase()) return true;
    return false;
  }

  const onClickOut = () => {
    document.getElementsByClassName('ais-SearchBox-input')[0].value = '';
    setHasInput(false);
  }

  return (
    <div
      id="mainHeader"
      className='header bg-light d-flex w-100 position-sticky px-5'
    >
      <Link to='/' className='HeaderLink ml-0'>
        <img src="/images/headerLogo.png" width="290px" height="28px" />
      </Link>
      <div >
        {items.map(({ link, label }, index) => {
          const isExternal =
            link.startsWith('http://') ||
            link.startsWith('https://');

          if (isExternal) {
            return (
              <MDSLink
                key={index}
                href={link}
                className="HeaderLink HeaderLink--default"
                target="_blank"
              >
                {label}
              </MDSLink>
            )
          }
          return (
            <Link
              key={index}
              to={link}
              className={`HeaderLink  ${checkActive(label)
                ? 'HeaderLink--active'
                : 'HeaderLink--default'
                }`}
            >
              {label}
            </Link>
          );
        })}
      </div>
      <div>
        {/* <ClickOutHandler onClickOut={this.onClickOut}> */}

          <InstantSearch
            searchClient={searchClient}
            indexName="docs"
            refresh={refresh}
          >
            <Configure 
            // hitsPerPage={10}
             />
            {/* <SearchBox
              className="searchbox"
              class="ais-SearchBox-input"
              submit={<></>}
              reset={<></>}
              translations={{
                placeholder: 'Search Postman Docs',
              }}
              onKeyUp={(event) => {
                setHasInput(event.currentTarget.value !== '')
                // setHasInput(true)
              }}
            /> */}
            <CustomSearchBox />
            {/* forcefeed className because component does not accept natively as prop */}
            <div className={!hasInput ? 'input-empty' : 'input-value'}>
              <CustomHits hitComponent={Hits} />
            </div>
          </InstantSearch>
        {/* </ClickOutHandler > */}
      </div >
      {/* <Search /> */}
    </div >
  );
};

export default Header;
