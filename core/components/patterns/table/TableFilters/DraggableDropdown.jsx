import * as React from 'react';
import { Icon, Button, Checkbox, Popover } from '@/index';

export const DraggableDropdown = (props) => {
  const { options, onChange } = props;

  const [open, setOpen] = React.useState(false);
  const [tempOptions, setTempOptions] = React.useState(options);
  const [triggerWidth, setTriggerWidth] = React.useState('var(--spacing-8)');

  React.useEffect(() => {
    setTempOptions(options);
  }, [open]);

  const handleParentChange = (e) => {
    setTempOptions(tempOptions.map((option) => ({ ...option, selected: e.target.checked })));
  };

  const handleChildChange = (e, index) => {
    const newOptions = [...tempOptions];
    newOptions[index] = {
      ...newOptions[index],
      selected: e.target.checked,
    };

    setTempOptions(newOptions);
  };

  const onToggleHandler = (newOpen) => {
    setOpen(newOpen);
  };

  const onCancelHandler = () => {
    setOpen(false);
  };

  const onApplyHandler = () => {
    setOpen(false);

    if (onChange) onChange(tempOptions);
  };

  const moveToIndex = (arr, from, to) => {
    if (from === to) return arr;

    let newArr = arr;
    if (from < to) {
      newArr = [...arr.slice(0, from), ...arr.slice(from + 1, to + 1), arr[from], ...arr.slice(to + 1)];
    } else {
      newArr = [...arr.slice(0, to), arr[from], ...arr.slice(to, from), ...arr.slice(from + 1)];
    }

    return newArr;
  };

  const getPluralSuffix = (count) => (count > 1 ? 's' : '');

  return (
    <div className="Dropdown">
      <Popover
        open={open}
        onToggle={onToggleHandler}
        trigger={
          <Button
            ref={(el) => {
              // setTriggerWidth(`${el.clientWidth}px`);
            }}
            size="tiny"
            appearance="transparent"
            icon="keyboard_arrow_down_filled"
            iconAlign="right"
          >
            {`Showing ${options.filter((option) => option.selected).length} of ${
              options.length
            } column${getPluralSuffix(options.length)}`}
          </Button>
        }
        triggerClass="w-100"
        customStyle={{
          width: triggerWidth,
        }}
        className="Header-draggableDropdown"
      >
        <div className="Dropdown-wrapper">
          <div className="OptionWrapper">
            <Checkbox
              className="OptionCheckbox"
              label="Select All"
              checked={tempOptions.every((option) => option.selected)}
              indeterminate={
                tempOptions.some((option) => option.selected) && tempOptions.some((option) => !option.selected)
              }
              onChange={handleParentChange}
            />
          </div>
          {tempOptions.map((option, index) => {
            return (
              <div
                key={option.value}
                className="OptionWrapper d-flex flex-space-between align-items-center cursor-pointer"
                draggable={true}
                onDragStart={(e) => {
                  e.dataTransfer.setData('index', `${index}`);
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const from = +e.dataTransfer.getData('index');
                  const to = index;

                  if (from !== to) setTempOptions(moveToIndex(tempOptions, from, to));
                }}
              >
                <Checkbox
                  className="OptionCheckbox"
                  name={option.value}
                  label={option.label}
                  checked={tempOptions[index].selected}
                  onChange={(e) => handleChildChange(e, index)}
                />
                <Icon name="drag_handle" className="mr-4" />
              </div>
            );
          })}
        </div>
        <div className="Dropdown-buttonWrapper">
          <Button className="mr-4" size="tiny" onClick={onCancelHandler}>
            Cancel
          </Button>
          <Button appearance="primary" size="tiny" onClick={onApplyHandler}>
            Apply
          </Button>
        </div>
      </Popover>
    </div>
  );
};

export default DraggableDropdown;
