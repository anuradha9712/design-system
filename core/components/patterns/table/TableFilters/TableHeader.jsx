import * as React from 'react';
import { Input, Button, Checkbox, Dropdown, PlaceholderParagraph, Placeholder, Label } from '@/index';
import { DraggableDropdown } from './DraggableDropdown';

export const Header = (props) => {
  const {
    loading,
    error,
    data,
    schema,
    showHead,
    withPagination,
    page,
    pageSize,
    withCheckbox,
    updateSchema,
    filterList = {},
    updateFilterList,
    totalRecords = 0,
    onSelectAll,
    searchPlaceholder,
    selectAll,
    searchTerm,
    updateSearchTerm,
    allowSelectAll,
    updateShowVerticalFilters,
  } = props;

  const [selectAllRecords, setSelectAllRecords] = React.useState(false);
  const [flag, setFlag] = React.useState(true);

  React.useEffect(() => {
    setFlag(!flag);
  }, [schema]);

  React.useEffect(() => {
    if (selectAll && selectAll.checked) {
      if (onSelectAll) onSelectAll(true, selectAllRecords);
    }
  }, [selectAllRecords]);

  React.useEffect(() => {
    if (selectAll && !selectAll.checked) setSelectAllRecords(false);
  }, [selectAll]);

  // const filterSchema = schema.filter((s) => s.filters);

  const onSearchChange = (e) => {
    const value = e.target.value;
    if (updateSearchTerm) {
      updateSearchTerm(value);
    }
  };

  const onFilterChange = (name, filters) => {
    const newFilterList = {
      ...filterList,
      [name]: filters,
    };

    if (updateFilterList) {
      updateFilterList(newFilterList);
    }
  };

  const columnOptions = schema.map((s) => ({
    label: s.displayName,
    value: s.name,
    selected: !s.hidden,
  }));

  const onDynamicColumnUpdate = (options) => {
    const newSchema = options.map((option) => ({
      ...schema.find((colSchema) => colSchema.name === option.value),
      hidden: !option.selected,
    }));

    if (updateSchema) updateSchema(newSchema);
  };

  const hasSchema = (schema) => schema && !!schema.length;

  const getPluralSuffix = (count) => (count > 1 ? 's' : '');

  const selectedCount = data.filter((d) => d._selected).length;
  const startIndex = (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, totalRecords);
  const label = error
    ? `Showing 0 items`
    : withCheckbox && selectedCount
    ? selectAllRecords
      ? `Selected all ${totalRecords} item${getPluralSuffix(totalRecords)}`
      : `Selected ${selectedCount} item${getPluralSuffix(totalRecords)} on this page`
    : withPagination
    ? `Showing ${startIndex}-${endIndex} of ${totalRecords} item${getPluralSuffix(totalRecords)}`
    : `Showing ${totalRecords} item${getPluralSuffix(totalRecords)}`;

  return (
    <div className="Header">
      <div className="Header-content Header-content--top">
        <div className="Header-search">
          <Input
            name="GridHeader-search"
            icon="search"
            placeholder={searchPlaceholder}
            onChange={onSearchChange}
            value={searchTerm}
            onClear={() => updateSearchTerm && updateSearchTerm('')}
            disabled={loading && !hasSchema(schema)}
          />
        </div>
        <div className="Header-dropdown">
          <div className="Table-filters Table-filters--horizontal">
            <div className="Table-filter">
              <Dropdown
                key="name"
                disabled={loading}
                withCheckbox={true}
                showApplyButton={true}
                inlineLabel={'Name'}
                options={[
                  { label: 'A-G', value: 'a-g', selected: true },
                  { label: 'H-R', value: 'h-r', selected: true },
                  { label: 'S-Z', value: 's-z', selected: true },
                ]}
                onChange={(selected) => onFilterChange('name', selected)}
              />
            </div>
            <div className="Table-filter">
              <Button icon="add" onClick={() => updateShowVerticalFilters(true)}>
                More Filters
              </Button>
            </div>
          </div>
        </div>
        <div className="Header-actions"></div>
      </div>
      <div className="Header-content Header-content--bottom">
        <div className="Header-label">
          {showHead && !loading && (
            <Checkbox
              {...selectAll}
              onChange={(event) => {
                if (onSelectAll) onSelectAll(event.target.checked);
              }}
            />
          )}
          {loading ? (
            <Placeholder withImage={!showHead && withCheckbox}>
              <PlaceholderParagraph length={'small'} size={'s'} />
            </Placeholder>
          ) : (
            <>
              <Label>{label}</Label>
              {withPagination && selectAll.checked && allowSelectAll && (
                <div className="ml-4">
                  {!selectAllRecords ? (
                    <Button size="tiny" onClick={() => setSelectAllRecords(true)}>
                      {`Select all totalRecords} items`}
                    </Button>
                  ) : (
                    <Button size="tiny" onClick={() => setSelectAllRecords(false)}>
                      Clear Selection
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
        <div className="Header-hideColumns">
          <DraggableDropdown options={columnOptions} onChange={onDynamicColumnUpdate} />
        </div>
      </div>
    </div>
  );
};

Header.defaultProps = {
  schema: [],
  data: [],
  searchPlaceholder: 'Search',
  dynamicColumn: true,
};

export default Header;
