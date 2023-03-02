import * as React from 'react';
// import { debounce } from 'throttle-debounce';
import { Subheading, Icon } from '@/index';

export const TableFilters = () => {
  return (
    <div className="p-5 h-100">
      <div className="d-flex align-items-center justify-content-between">
        <Subheading>Filters</Subheading>
        <Icon
          name="close"
          className="Table-filtersCloseIcon"
          // onClick={() => this.setState({ showVerticalFilters: false })}
        />
      </div>
    </div>
  );
};

export default TableFilters;
