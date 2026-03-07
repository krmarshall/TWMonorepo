interface PropsInterface {
  name: string;
  checkedColor?: string;
  optionsArray: Array<string>;
  selectedValues: Array<string>;
  setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>;
}

const MultiSelector = ({
  name,
  checkedColor = 'accent-blue-500',
  optionsArray,
  selectedValues,
  setSelectedValues,
}: PropsInterface) => {
  const checkboxHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const checked = event.target.checked;
    if (value === 'All' && checked) {
      return setSelectedValues(optionsArray);
    }
    if (value === 'All' && !checked) {
      return setSelectedValues([]);
    }
    if (checked) {
      const newValues = structuredClone(selectedValues);
      newValues.push(value);
      setSelectedValues(newValues);
    }
    if (!checked) {
      const newValues = structuredClone(selectedValues);
      const removeIndex = newValues.indexOf(value);
      newValues.splice(removeIndex, 1);
      setSelectedValues(newValues);
    }
  };

  let allChecked = true;
  optionsArray.forEach((option) => {
    if (!selectedValues.includes(option)) {
      allChecked = false;
    }
  });
  const checkBoxClass = 'cursor-pointer';
  return (
    <div className={checkedColor + ' text-xl flex flex-row h-52'}>
      <p className="mr-2">{name}</p>
      <div className="flex flex-col flex-wrap">
        <div>
          <input
            className={checkBoxClass}
            type="checkbox"
            checked={allChecked}
            id={name + 'All'}
            value="All"
            onChange={(event) => checkboxHandler(event)}
          />
          <label htmlFor={name + 'All'} className="ml-1.5 cursor-pointer">
            All
          </label>
        </div>
        {optionsArray.map((option, index) => {
          const checked = selectedValues.includes(option);

          return (
            <div key={option}>
              <input
                className={checkBoxClass}
                type="checkbox"
                checked={checked}
                id={name + option}
                value={option}
                onChange={(event) => checkboxHandler(event)}
              />
              <label htmlFor={name + option} className="ml-1.5 cursor-pointer">
                {option}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MultiSelector;
