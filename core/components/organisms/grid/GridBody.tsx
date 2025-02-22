import * as React from 'react';
import { GridRow } from './GridRow';
import { GridState, onSelectFn, Schema, updatePrevPageInfoFunction } from './Grid';
import GridContext from './GridContext';
import styles from '@css/components/grid.module.css';
import { GridProps } from '@/index.type';
import VirtualScroll from './VirtualScroll';
import { ProgressBar } from '@/index';

export interface GridVirtualBodyProps {
  schema: Schema;
  onSelect: onSelectFn;
  prevPageInfo: GridState['prevPageInfo'];
  updatePrevPageInfo: updatePrevPageInfoFunction;
  virtualRowOptions: GridProps['virtualRowOptions'];
  preFetchOptions: GridProps['preFetchOptions'];
  enablePreFetch?: GridProps['enablePreFetch'];
  onScroll?: GridProps['onScroll'];
  updateVirtualData: GridProps['updateVirtualData'];
  enableRowVirtualization?: GridProps['enableRowVirtualization'];
}

export const GridBody = (props: GridVirtualBodyProps) => {
  const context = React.useContext(GridContext);

  const { data, ref, loading, error, withPagination, page, pageSize, totalRecords, errorTemplate, size } = context;
  const listRef = React.useRef<HTMLDivElement | null>(null);

  if (!loading && error) {
    return errorTemplate ? (typeof errorTemplate === 'function' ? errorTemplate({}) : errorTemplate) : null;
  }

  const {
    schema,
    prevPageInfo,
    updatePrevPageInfo,
    onSelect,
    virtualRowOptions,
    preFetchOptions,
    enablePreFetch,
    onScroll,
    updateVirtualData,
    enableRowVirtualization,
  } = props;

  const { buffer, visibleRows } = virtualRowOptions;

  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [hasMoreData, setHasMoreData] = React.useState(true);
  const endReached = React.useRef(false);
  const { fetchRowsCount, fetchThreshold } = preFetchOptions;

  // const currentPage = React.useRef(1);

  React.useEffect(() => {
    const gridBodyEl = ref!.querySelector('.Grid-body');
    const gridHeadEl = ref!.querySelector('.Grid-head');
    if (gridBodyEl && gridHeadEl) {
      window.requestAnimationFrame(() => {
        if (prevPageInfo.page === page) {
          gridBodyEl.scrollTop = prevPageInfo.scrollTop;
        }
        gridBodyEl.scrollLeft = gridHeadEl.scrollLeft;
      });
    }

    return () => {
      if (gridBodyEl) {
        updatePrevPageInfo({ page, scrollTop: gridBodyEl.scrollTop });
      }
    };
  }, []);

  React.useEffect(() => {
    if (data.length === fetchRowsCount && enablePreFetch) {
      console.log('>>>bbbb aaaa Fetching next rows', data.length, data);
      fetchNextRows();
    }
  }, [data]);

  const totalPages = Math.ceil(totalRecords / pageSize);
  const isLastPage = withPagination && page === totalPages;
  const dataLength = isLastPage
    ? totalRecords - (page - 1) * pageSize
    : loading
    ? pageSize
    : withPagination
    ? Math.min(totalRecords, pageSize)
    : totalRecords;

  const renderRow = React.useCallback(
    (rowIndex: number, item?: object) => {
      return (
        <GridRow
          key={rowIndex}
          rowIndex={rowIndex}
          data={!item ? data[rowIndex] : item}
          schema={schema}
          onSelect={onSelect}
        />
      );
    },
    [data, schema, onSelect]
  );

  const minRowHeight: Record<GridProps['size'], number> = {
    comfortable: 40,
    standard: 40,
    compressed: 32,
    tight: 24,
  };

  const getArrayList = () => {
    if (loading && !data.length) {
      return [...Array(dataLength).map((x) => x)];
    }
    return data;
  };

  const fetchNextRows = React.useCallback(async () => {
    console.log('>>>aaa Fetching next rows currentPage', currentPage, 'prevData', data);
    const {
      fetchRowsCount,
      // fetchNewData
    } = preFetchOptions || {};

    // if (fetchNewData && !isLoadingMore && hasMoreData) {
    if (updateVirtualData && !isLoadingMore && hasMoreData) {
      setIsLoadingMore(true);
      try {
        // const dataList = await fetchNewData({ page: currentPage.current + 1, fetchRowsCount });
        // const dataList = await fetchNewData({ page: currentPage + 1, rowsCount: fetchRowsCount });
        const dataList = await updateVirtualData?.({ page: currentPage + 1, rowsCount: fetchRowsCount });
        if (dataList?.length === 0) {
          setHasMoreData(false);
        }
        setCurrentPage((prevPage) => prevPage + 1);
        // currentPage.current = currentPage.current + 1;
      } finally {
        setIsLoadingMore(false);
      }
    }
  }, [isLoadingMore, hasMoreData, currentPage, fetchRowsCount]);

  const thresholdMapper: Record<typeof fetchThreshold, number> = {
    early: 0.5,
    balanced: 0.75,
    lazy: 0.9,
    'at-end': 0,
  };

  const onScrollHandler = (event: Event, listRef: HTMLElement) => {
    if (enablePreFetch && preFetchOptions && !withPagination) {
      const { fetchThreshold } = preFetchOptions;

      const { scrollTop, scrollHeight, clientHeight } = listRef;

      const hasEndReached = fetchThreshold === 'at-end' && scrollTop + clientHeight >= scrollHeight;
      const hasThresholdReached =
        fetchThreshold !== 'at-end' && scrollTop + clientHeight >= scrollHeight * thresholdMapper[fetchThreshold];

      // Check if user has scrolled to the threshold
      if (hasEndReached || hasThresholdReached) {
        if (!endReached.current) {
          endReached.current = true;
          fetchNextRows();
        }
      } else if (!hasEndReached && !hasThresholdReached) {
        endReached.current = false;
      }
    }

    if (onScroll) {
      onScroll(event);
    }
  };

  const memoizedVirtualScroll = React.useMemo(
    () => (
      <VirtualScroll
        className={styles['Grid-body']}
        buffer={buffer}
        length={visibleRows}
        minItemHeight={minRowHeight[size]}
        totalLength={dataLength}
        renderItem={renderRow}
        onScroll={onScrollHandler}
        // enablePreFetch={enablePreFetch}
        // preFetchOptions={preFetchOptions}
        // fetchThreshold={fetchThreshold}
        // fetchNewData={fetchNextRows}
      />
    ),
    [
      dataLength,
      renderRow,
      // fetchNextRows,
      minRowHeight,
      size,
    ]
  );

  const handleOnScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if (!enableRowVirtualization) {
      onScrollHandler(event.nativeEvent as Event, listRef.current as HTMLElement);
    }
  };

  return (
    <div className={styles['Grid-body']} onScroll={(event) => handleOnScroll(event)} ref={listRef}>
      {isLoadingMore && <ProgressBar state="indeterminate" className={styles['Grid-progress-bar']} size="small" />}
      {enableRowVirtualization
        ? memoizedVirtualScroll
        : getArrayList().map((item, i) => {
            return renderRow(i, item);
          })}
      {isLoadingMore && <ProgressBar className="position-absolute bottom-0" state="indeterminate" size="small" />}
    </div>
  );
};

export default GridBody;
