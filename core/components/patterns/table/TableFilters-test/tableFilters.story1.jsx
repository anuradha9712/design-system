import * as React from 'react';
import { debounce } from 'throttle-debounce';
import { Card, Table, Subheading } from '@/index';
import TableFilters from './TableFilter';
// import data from '@/components/organisms/grid/__stories__/_common_/data';

// export const TableFilters = () => {
//   return (
//     <div className="p-5">
//       <Subheading>Filters</Subheading>
//     </div>
//   );
// };

export const TableWithFilters = () => {
  const [showVerticalFilters, setShowVerticalFilters] = React.useState(true);
  const data = [
    {
      firstName: 'Brooke',
      lastName: 'Heeran',
      lastRun: 'Yesterday 3:14 PM',
      name: 'Risk Analysis',
      type: 'Batch Execution',
      status: 'Failed',
      statusType: 'Error',
      errorCode: 2204,
      className: 'File not found',
      errorMessage: 'Cannot fetch files',
    },
    {
      firstName: 'Frazer',
      lastName: 'Cathro',
      lastRun: 'Yesterday 11:15 AM',
      name: 'Quality',
      type: 'Batch Execution',
      status: 'Completed',
      statusType: 'Done',
      className: 'Executed',
    },
    {
      firstName: 'Lemmie',
      lastName: 'Ciric',
      lastRun: 'Yesterday 9:17 PM',
      name: 'Claims',
      type: 'Test Function',
      status: 'Completed',
      statusType: 'Done',
      className: 'Executed',
    },
    {
      firstName: 'Randy',
      lastName: 'Boatwright',
      lastRun: 'Yesterday 4:26 PM',
      name: 'Risk Analysis',
      type: 'Batch Execution',
      status: 'Completed',
      statusType: 'Done',
      className: 'Executed',
    },
    {
      firstName: 'Rolando',
      lastName: 'Cyples',
      lastRun: 'Yesterday 7:34 AM',
      name: 'Quality',
      type: 'Test Function',
      status: 'Failed',
      statusType: 'Error',
      errorCode: 2204,
      className: 'File not found',
      errorMessage: 'Cannot fetch files',
    },
  ];

  const schema = [
    {
      name: 'lastRun',
      displayName: 'Last Run',
      width: '25%',
    },
    {
      name: 'name',
      displayName: 'Name',
      width: '15%',
      filters: [
        { label: 'Failed', value: 'failed' },
        { label: 'Completed', value: 'completed' },
      ],
    },
    {
      name: 'type',
      displayName: 'Type',
      width: '20%',
      filters: [
        { label: 'Failed', value: 'failed' },
        { label: 'Completed', value: 'completed' },
      ],
    },
    {
      name: 'status',
      displayName: 'Status',
      width: '20%',
      cellType: 'STATUS_HINT',
      translate: (a) => ({
        title: a.status,
        statusAppearance: a.status === 'Failed' ? 'alert' : 'success',
      }),
      filters: [
        { label: 'Failed', value: 'failed' },
        { label: 'Completed', value: 'completed' },
      ],
      onFilterChange: (a, filters) => {
        for (const filter of filters) {
          if (a.status.toLowerCase() === filter) return true;
        }
        return false;
      },
    },
    {
      name: 'user',
      displayName: 'User',
      width: '20%',
      translate: (a) => ({
        title: `${a.lastName}, ${a.firstName}`,
        firstName: a.firstName,
        lastName: a.lastName,
      }),
      cellType: 'AVATAR_WITH_TEXT',
    },
  ];

  const containerClass = showVerticalFilters ? 'Table-container' : 'w-100';

  return (
    <div className="d-flex h-100">
      <div className={containerClass}>
        <Card>
          <Table
            data={data}
            schema={schema}
            withHeader={true}
            headerOptions={{
              withSearch: true,
              dynamicColumn: false,
              children: <div>hello world</div>,
            }}
            separator={false}
            showMenu={false}
            filterPosition="HEADER"
            // filterList={{
            //   status: ["failed", "completed"]
            // }}
          />
        </Card>
      </div>
      <div className="bg-secondary-lightest h-100 w-100">
        <TableFilters />
        {/* <TableFilters /> */}
      </div>
    </div>
  );
};

export default {
  title: 'Patterns/Table/Table With Filters',
  subcomponents: { TableFilters },
  parameters: {
    docs: {
      docPage: {
        title: 'Table with filters',
        // customCode,
        imports: {
          debounce: debounce,
        },
        props: {
          exclude: ['showHead'],
        },
        noProps: true,
      },
    },
  },
};
