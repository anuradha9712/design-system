import * as React from 'react';
import classNames from 'classnames';
import { Avatar, Text, Placeholder, PlaceholderParagraph, Icon, StatusHint, Tooltip } from '@/index';
import { StatusHintProps, TextProps } from '@/index.type';
import { ColumnSchema, RowData, GridSize } from './Grid';
import { translateData } from './utility';
import styles from '@css/components/grid.module.css';
import GridContext from './GridContext';

export interface CellData {
  title: string;
  metaList?: string[];
  icon?: string;
  image?: string;
  firstName?: string;
  lastName?: string;
  statusAppearance?: StatusHintProps['appearance'];
}

// export interface ImageProps {
//   src: string;
//   size?: number;
// }

// export interface StatusProps extends PartialCellProps {
//   appearanceMapper?: GridProps['statusMapper'];
// }

export interface PartialCellProps {
  /**
   * Row data
   */
  data: RowData;
  /**
   * Column schema
   */
  schema: ColumnSchema;
  /**
   * Loading state of cell
   */
  loading?: boolean;
  /**
   * Expanded state of row
   */
  expanded?: boolean;
}

// export const Image = (props: ImageProps) => {
//   const {
//     src,
//     size
//   } = props;

//   const style = {
//     height: `${size}px`,
//     width: `${size}px`,
//   };

//   return (
//     <img className="Image" src={src} style={style} />
//   );
// };

// const ImageCell = (props: PartialCellProps) => {
//   const {
//     schema,
//     loading
//   } = props;

//   const src = schema.image;
//   const size = 32;

//   if (loading) {
//     return (
//       <Placeholder imageSize={'medium'} round={true} />
//     );
//   }

//   return (
//     <Image
//       src={src || ''}
//       size={size}
//     />
//   );
// };

interface HighlightedTextProps {
  text: string;
  searchTerm?: string;
  className?: string;
  appearance?: TextProps['appearance'];
  size?: TextProps['size'];
}

const HighlightedText: React.FC<HighlightedTextProps> = ({ text, searchTerm, className, ...rest }) => {
  if (!searchTerm || !text) {
    return (
      <Text className={className} {...rest}>
        {text}
      </Text>
    );
  }

  const regex = new RegExp(`(${searchTerm})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="GridCell-mark--default">
            {part}
          </mark>
        ) : (
          <Text key={i} className={className} {...rest}>
            {part}
          </Text>
        )
      )}
    </span>
  );
};

export interface GridCellProps extends PartialCellProps {
  /**
   * Grid size
   */
  size?: GridSize;
  /**
   * Row index for cell
   */
  rowIndex?: number;
  /**
   * Column index for cell
   */
  colIndex?: number;
  /**
   * Search term to highlight in cell content
   */
  searchTerm?: string;
}

type CellProps = {
  tooltip?: boolean;
  cellData: CellData;
};

const renderTitle = (props: CellProps & { searchTerm?: string }) => {
  const { tooltip, cellData, searchTerm } = props;

  const children = cellData.title;

  if (children !== undefined && children !== null) {
    if (tooltip) {
      return (
        <Tooltip tooltip={children} position={'top-start'} triggerClass="w-100 overflow-hidden">
          <HighlightedText text={children} searchTerm={searchTerm} className="w-100 ellipsis" />
        </Tooltip>
      );
    }
    return <HighlightedText text={children} searchTerm={searchTerm} className="w-100 ellipsis" />;
  }

  return null;
};

const getMetaContent = ({ searchTerm, list }: { searchTerm?: string; list: string }) => {
  if (searchTerm && list) {
    return list.split(new RegExp(`(${searchTerm})`, 'gi')).map((part, i) => {
      if (new RegExp(searchTerm, 'i').test(part)) {
        return (
          <mark key={i} className="GridCell-mark--metaList">
            {part}
          </mark>
        );
      }
      return (
        <Text key={i} appearance="subtle" size="small" className="white-space-pre">
          {part}
        </Text>
      );
    });
  }

  return (
    <Text appearance="subtle" size="small" className="white-space-pre">
      {list}
    </Text>
  );
};

const renderMetaList = (props: CellProps & { searchTerm?: string }) => {
  const { cellData, searchTerm } = props;

  const { metaList } = cellData;

  if (metaList) {
    const processedMetaList = metaList.map((list, index) => {
      const content = getMetaContent({ searchTerm, list });
      // searchTerm && list ? (
      //   list.split(new RegExp(`(${searchTerm})`, 'gi')).map((part, i) =>
      //     new RegExp(searchTerm, 'i').test(part) ? (
      //       <mark key={i} className="GridCell-mark--metaList">
      //         {part}
      //       </mark>
      //     ) : (
      //       <Text key={i} appearance="subtle" size="small" className="white-space-pre">
      //         {part}
      //       </Text>
      //     )
      //   )
      // ) : (
      //   <Text appearance="subtle" size="small" className="white-space-pre">
      //     {list}
      //   </Text>
      // );

      return (
        <div key={list} className="ellipsis d-flex align-items-center">
          <div className="ellipsis d-flex align-items-center">{content}</div>
          {index < metaList.length - 1 && (
            <Icon
              name="fiber_manual_record"
              size={4}
              className={styles['GridCell-metaSeparator']}
              appearance="disabled"
            />
          )}
        </div>
      );
    });

    return (
      <div className={styles['GridCell-metaList']} data-test="DesignSystem-GridCell-metaList">
        {processedMetaList}
      </div>
    );
  }

  return null;
};

const renderAvatar = (props: CellProps) => {
  const { cellData } = props;

  const { firstName, lastName, title } = cellData;

  if (firstName || lastName) {
    return <Avatar className="m-0 mr-5" firstName={firstName} lastName={lastName} />;
  }
  if (title) {
    return <Avatar className="m-0 mr-5">{title}</Avatar>;
  }

  return null;
};

const renderIcon = (props: CellProps) => {
  const { cellData } = props;

  const { title, icon } = cellData;
  const iconName = icon || title;
  if (iconName) {
    return <Icon name={iconName} />;
  }

  return null;
};

const renderStatusHint = (props: CellProps) => {
  const { cellData } = props;

  const { statusAppearance } = cellData;

  const children = cellData.title;

  if (children) {
    return (
      <StatusHint appearance={statusAppearance} className="overflow-hidden">
        {children}
      </StatusHint>
    );
  }

  return null;
};

export const GridCell = (props: GridCellProps) => {
  const {
    size,
    schema,
    // rowIndex,
    loading,
    // searchTerm,
  } = props;

  const data = !loading ? translateData(schema, props.data) : {};
  const context = React.useContext(GridContext);

  const { searchTerm } = context;

  const { name, cellType = 'DEFAULT', align = 'left', tooltip } = schema;

  const cellData = data[name];

  const cellClass = classNames({
    [styles['GridCell']]: true,
  });

  const defaultCellClass = classNames(
    {
      [styles[`GridCell--align-${align}`]]: true,
      [styles['GridCell--default']]: true,
    },
    cellClass
  );

  const metaListClass = classNames(
    {
      [styles['GridCell--metaList']]: true,
    },
    cellClass
  );

  const avatarCellClass = classNames(
    {
      [styles['GridCell--avatar']]: true,
      [styles[`GridCell--align-${align}`]]: true,
    },
    cellClass
  );

  const avatarWithTextCellClass = classNames(
    {
      [styles['GridCell--avatarWithText']]: true,
    },
    cellClass
  );

  const iconCellClass = classNames(
    {
      [styles['GridCell--icon']]: true,
      [styles[`GridCell--align-${align}`]]: true,
    },
    cellClass
  );

  const statusHintCellClass = classNames(
    {
      [styles['GridCell--statusHint']]: true,
      [styles[`GridCell--align-${align}`]]: true,
    },
    cellClass
  );

  switch (cellType) {
    case 'DEFAULT':
      return (
        <div className={defaultCellClass}>
          {loading ? (
            <PlaceholderParagraph length="medium" data-test="DesignSystem-GridCell-placeHolder" />
          ) : (
            renderTitle({ tooltip, cellData, searchTerm })
          )}
        </div>
      );

    case 'WITH_META_LIST':
      return (
        <div className={metaListClass}>
          {loading ? (
            <>
              <PlaceholderParagraph length="medium" data-test="DesignSystem-GridCell-withMetaList" />
              <PlaceholderParagraph length="large" size="xxs" />
            </>
          ) : (
            <>
              {renderTitle({ tooltip, cellData, searchTerm })}
              {renderMetaList({ cellData, searchTerm })}
            </>
          )}
        </div>
      );

    case 'AVATAR':
      if (loading) {
        return <Placeholder className={styles[`GridCell--align-${align}`]} imageSize={'medium'} round={true} />;
      }
      return (
        <div className={avatarCellClass} data-test="DesignSystem-GridCell-avatar">
          {size !== 'tight' && renderAvatar({ cellData })}
        </div>
      );

    case 'AVATAR_WITH_TEXT':
      if (loading) {
        return (
          <Placeholder imageSize={'medium'} round={true}>
            <PlaceholderParagraph className="ml-3" length="medium" />
          </Placeholder>
        );
      }
      return (
        <div className={`${cellClass}   `} data-test="DesignSystem-GridCell-avatarWithText">
          {size !== 'tight' && renderAvatar({ cellData })}
          {renderTitle({ tooltip, cellData, searchTerm })}
        </div>
      );

    case 'AVATAR_WITH_META_LIST':
      if (loading) {
        return (
          <Placeholder imageSize={'medium'} round={true}>
            <PlaceholderParagraph className="ml-3" length="medium" />
            <PlaceholderParagraph className="ml-3" length="large" />
          </Placeholder>
        );
      }
      return (
        <div className={avatarWithTextCellClass} data-test="DesignSystem-GridCell-avatarWithMetaList">
          {size !== 'tight' && renderAvatar({ cellData })}
          <div className={styles['GridCell-metaListWrapper']}>
            {renderTitle({ tooltip, cellData, searchTerm })}
            {renderMetaList({ cellData, searchTerm })}
          </div>
        </div>
      );

    case 'ICON':
      if (loading) {
        return <Placeholder className={styles[`GridCell--align-${align}`]} imageSize={'small'} round={true} />;
      }
      return (
        <div className={iconCellClass} data-test="DesignSystem-GridCell-icon">
          {renderIcon({ cellData })}
        </div>
      );

    case 'STATUS_HINT':
      return (
        <div className={statusHintCellClass}>
          {loading ? (
            <Placeholder className="w-75 flex-grow-0" imageSize={'small'} round={true}>
              <PlaceholderParagraph length="large" />
            </Placeholder>
          ) : (
            renderStatusHint({ cellData })
          )}
        </div>
      );
  }

  return null;
};

GridCell.displayName = 'GridCell';

export default GridCell;
