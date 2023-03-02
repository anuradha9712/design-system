import * as React from 'react';
import { debounce } from 'throttle-debounce';
// import data from '@/components/organisms/grid/__stories__/_common_/data';
import './style.css';
import { Card, Grid, Dropdown, Subheading, Icon, Pagination, DatePicker } from '@/index';
import { updateBatchData, getSelectAll, getTotalPages } from './utils';
import Header from './TableHeader';

export class Table extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      schema: [],
      page: 1,
      totalRecords: 0,
      sortingList: props.sortingList || [],
      filterList: props.filterList || {},
      loading: true,
      error: false,
      selectAll: getSelectAll([]),
      searchTerm: undefined,
      showVerticalFilters: props.showVerticalFilters,
    };

    this.pageSize = 4;
    this.searchDebounceDuration = 750;
    this.debounceUpdate = debounce(this.searchDebounceDuration, this.updateDataFn);
  }

  componentDidMount() {
    this.updateData();
  }

  componentDidUpdate(_prevProps, prevState) {
    if (prevState.page !== this.state.page) {
      const { onPageChange } = this.props;
      if (onPageChange) onPageChange(this.state.page);
    }

    if (
      prevState.page !== this.state.page ||
      prevState.filterList !== this.state.filterList ||
      prevState.sortingList !== this.state.sortingList ||
      prevState.searchTerm !== this.state.searchTerm
    ) {
      if (!this.props.loading) this.updateData({});
    }
  }

  updateData() {
    this.setState({
      loading: true,
    });

    this.debounceUpdate();
  }

  updateDataFn() {
    this.onSelect(-1, false);

    const { fetchData } = this.props;

    const { page, sortingList, filterList, searchTerm } = this.state;

    const { pageSize } = this;

    const opts = {
      page,
      pageSize,
      sortingList,
      filterList,
      searchTerm,
    };

    this.setState({
      loading: true,
    });
    if (fetchData) {
      fetchData(opts)
        .then((res) => {
          const data = res.data;
          const schema = this.state.schema.length ? this.state.schema : res.schema;
          this.setState({
            data,
            schema,
            selectAll: getSelectAll(data),
            totalRecords: res.count,
            loading: false,
            error: !data.length,
          });
        })
        .catch(() => {
          this.setState({
            loading: false,
            error: true,
            data: [],
          });
        });
    }
  }

  onSelect(rowIndexes, selected) {
    const { data } = this.state;

    const { onSelect } = this.props;

    const indexes = [rowIndexes];
    let newData = data;
    if (rowIndexes >= 0) {
      newData = updateBatchData(data, indexes, {
        _selected: selected,
      });

      this.setState({
        data: newData,
        selectAll: getSelectAll(newData),
      });
    }

    if (onSelect) {
      onSelect(indexes, selected, rowIndexes === -1 ? [] : newData.filter((d) => d._selected));
    }
  }

  onSelectAll(selected, selectAll) {
    const { onSelect } = this.props;

    const { data } = this.state;

    const indexes = Array.from({ length: data.length }, (_, i) => i);

    const newData = updateBatchData(data, indexes, {
      _selected: selected,
    });

    if (onSelect) {
      onSelect(
        indexes,
        selected,
        newData.filter((d) => d._selected),
        selectAll
      );
    }

    this.setState({
      data: newData,
      selectAll: getSelectAll(newData),
    });
  }

  onPageChange(newPage) {
    this.setState({
      page: newPage,
    });
  }

  onFilterChange(name, selected) {
    const { filterList } = this.props;

    const newFilterList = {
      ...filterList,
      [name]: selected,
    };

    this.updateFilterList(newFilterList);
  }

  updateShowVerticalFilters(val) {
    this.setState({
      showVerticalFilters: val,
    });
  }

  updateSchema(newSchema) {
    this.setState({
      schema: newSchema,
    });
  }

  updateSortingList(newSortingList) {
    const { multipleSorting } = this.props;

    this.setState({
      sortingList: multipleSorting ? [...newSortingList] : newSortingList.slice(-1),
      page: 1,
    });
  }

  updateFilterList(newFilterList) {
    this.setState({
      filterList: newFilterList,
      page: 1,
    });
  }

  updateSearchTerm(newSearchTerm) {
    this.setState({
      searchTerm: newSearchTerm,
      page: 1,
    });
  }

  render() {
    const { loaderSchema } = this.props;

    const withCheckbox = true;
    const withPagination = true;
    const { pageSize } = this;

    const { totalRecords, showVerticalFilters, loading } = this.state;
    const totalPages = getTotalPages(totalRecords, pageSize);

    const classNames = showVerticalFilters ? 'Table-verticalFilter' : 'w-100';

    return (
      <div className="Table-container">
        <div className={classNames}>
          <Card className="Table overflow-hidden">
            <div className="Table-header">
              <Header
                {...this.state}
                updateSchema={this.updateSchema.bind(this)}
                updateFilterList={this.updateFilterList.bind(this)}
                updateSearchTerm={this.updateSearchTerm.bind(this)}
                updateShowVerticalFilters={this.updateShowVerticalFilters.bind(this)}
                onSelectAll={this.onSelectAll.bind(this)}
                withCheckbox={withCheckbox}
                withPagination={withPagination}
                pageSize={pageSize}
              />
            </div>
            <div className="Table-grid">
              <Grid
                {...this.state}
                updateData={this.updateData.bind(this)}
                updateSchema={this.updateSchema.bind(this)}
                updateSortingList={this.updateSortingList.bind(this)}
                updateFilterList={this.updateFilterList.bind(this)}
                withCheckbox={withCheckbox}
                onSelect={this.onSelect.bind(this)}
                onSelectAll={this.onSelectAll.bind(this)}
                showMenu={true}
                type="data"
                size="comfortable"
                draggable={true}
                withPagination={withPagination && totalPages > 1}
                pageSize={pageSize}
                loaderSchema={loaderSchema}
              />
            </div>
            {withPagination && totalPages > 1 && (
              <div className="Table-pagination">
                <Pagination
                  page={this.state.page}
                  totalPages={getTotalPages(totalRecords, pageSize)}
                  type="jump"
                  onPageChange={this.onPageChange.bind(this)}
                />
              </div>
            )}
          </Card>
        </div>
        <div className={`Table-filters Table-filters--vertical${!showVerticalFilters ? ' d-none' : ''}`}>
          <div className="Table-filtersHeading">
            <Subheading>Filters</Subheading>
            <Icon
              name="close"
              className="Table-filtersCloseIcon"
              onClick={() => this.setState({ showVerticalFilters: false })}
            />
          </div>
          <div>
            <div className="Table-filter">
              <Dropdown
                key="gender"
                disabled={loading}
                withCheckbox={true}
                showApplyButton={true}
                inlineLabel={'Gender'}
                options={[
                  { label: 'Male', value: 'male', selected: true },
                  { label: 'Female', value: 'female', selected: true },
                ]}
                onChange={(selected) => this.onFilterChange('gender', selected)}
              />
            </div>
            <div className="Table-filter">
              <DatePicker
                withInput={true}
                label="Date"
                inputOptions={{
                  placeholder: 'mm/dd/yyyy',
                  disabled: loading,
                  minWidth: 'unset',
                }}
                onDateChange={(_date, dateStr) => this.onFilterChange('date', dateStr)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Table;
