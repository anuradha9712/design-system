import React, { useEffect } from 'react';
import { useNavItems } from '../../util/NavItems';
import {
  VerticalNav,
  Subheading,
  Button,
} from '@innovaccer/design-system';
import { navigate } from 'gatsby';
import { MOBILE } from '../../util/constants';

const isBrowser = typeof window !== 'undefined';

function getActiveNavItem(tabs, navItems) {
  const pathName = window.location.pathname;
  if (isBrowser && pathName && tabs) {
    const url = pathName.split('/');
    const componentName = pathName.includes('mobile') ? url[2] + '/' + url[3] : url[1] + '/' + url[2];
    const activeMenu = navItems.filter(({ link }) => {
      return link && link.includes(componentName);
    });
    return activeMenu[0]?.link;
  }
  return pathName;
}

const handleNavigate = (name) => {
  if (name === MOBILE) {
    navigate(`/mobile${window.location.pathname}`);
  } else {
    if (window.location.pathname.includes('/mobile')) {
      navigate(
        window.location.pathname.replace('/mobile', '')
      );
    }
  }
};

function getHeading(relativePagePath) {
  const componentName =
    relativePagePath && relativePagePath.split('/')[1];
  return componentName.toUpperCase();
};

const LeftNav = (props) => {
  const { relativePagePath, showMobile, frontmatter } = props;
  const navItemsList = useNavItems(relativePagePath);
  const showMenuButtons = showMobile || frontmatter?.showMobile;
  const [active, setActive] = React.useState();

  const navItems = navItemsList.filter((item) => {
    if (relativePagePath.includes(MOBILE)) {
      return !item.hideInMobile;
    }
    return !item.hideInWeb;
  });

  useEffect(() => {
    const active = isBrowser ? getActiveNavItem(frontmatter.tabs, navItems) : '';
    const obj = { link: active }
    setActive(obj);
  }, []);

  const onClickHandler = (menu) => {
    navigate(menu.link);
    setActive(menu);
  };

  return (
    <div className='h-100 bg-secondary-lightest border-right page-scroll'>
      {showMenuButtons && (
        <div className='d-flex pt-6 pl-6'>
          <Button
            appearance='basic'
            size='regular'
            className='mr-4'
            onClick={() => handleNavigate()}
            selected={!relativePagePath.includes(MOBILE)}
            expanded={true}
          >
            Web
          </Button>
          <Button
            appearance='basic'
            onClick={() => handleNavigate(MOBILE)}
            selected={relativePagePath.includes(MOBILE)}
            className='mr-6'
            expanded={true}
          >
            Mobile
          </Button>
        </div>
      )}
      <Subheading className='pl-6 pt-6 pb-3' appearance='subtle'>
        {getHeading(relativePagePath)}
      </Subheading>
      <VerticalNav
        menus={navItems}
        active={active}
        onClick={onClickHandler}
        expanded={true}
        autoCollapse={false}
      />
    </div>
  );
};

export default LeftNav;
