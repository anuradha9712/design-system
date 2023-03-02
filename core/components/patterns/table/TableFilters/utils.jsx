export const getSelectAll = (data) => {
  if (data.length) {
    const anyUnSelected = data.some((d) => !d._selected);
    const allUnSelected = data.every((d) => !d._selected);

    const indeterminate = data.length >= 0 && anyUnSelected && !allUnSelected;
    const checked = !indeterminate && !allUnSelected;

    return { indeterminate, checked };
  }
  return { indeterminate: false, checked: false };
};

export const updateBatchData = (data, rowIndexes, dataUpdate) => {
  const updatedData = [...data];
  for (const rowIndex of rowIndexes) {
    updatedData[rowIndex] = {
      ...updatedData[rowIndex],
      ...dataUpdate,
    };
  }

  return updatedData;
};

export const getTotalPages = (totalRecords, pageSize) => Math.ceil(totalRecords / pageSize);
