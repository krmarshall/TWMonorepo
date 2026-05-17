interface PropInterface {
  name: string;
  value: boolean | undefined;
  setValue: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

const TripleToggle = ({ name, value, setValue }: PropInterface) => {
  const onChangeListener = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === 'true') setValue(true);
    if (event.target.value === 'undefined') setValue(undefined);
    if (event.target.value === 'false') setValue(false);
  };

  const divClass = 'relative mt-0.5';
  const inputClass = 'z-3 opacity-0 cursor-pointer -mx-1 w-6 h-6';
  const labelClass = 'absolute z-2 text-lg pointer-events-none';
  let spanState = ' left-4 bg-gray-400';
  if (value) spanState = 'left-0.5 bg-green-400';
  if (value === false) spanState = 'left-7.5 bg-red-400';
  return (
    <div className="flex flex-row place-content-between">
      <p className="text-xl mr-2">{name}</p>
      <div className="px-1 h-7.5 w-14.5 flex flex-row flex-nowrap place-content-between rounded-full relative border bg-gray-500 border-gray-800 shadow-2xl">
        <div className={divClass}>
          <label className={labelClass + ' left-0'}>✓</label>
          <input
            type="radio"
            name={name}
            value="true"
            checked={value === true}
            className={inputClass}
            onChange={onChangeListener}
          />
        </div>

        <div className={divClass}>
          <label className={labelClass + ' left-1.5 -top-0.5'}>-</label>
          <input
            type="radio"
            name={name}
            value="undefined"
            checked={value === undefined}
            className={inputClass}
            onChange={onChangeListener}
          />
        </div>

        <div className={divClass}>
          <label className={labelClass + ' right-0'}>✗</label>
          <input
            type="radio"
            name={name}
            value="false"
            checked={value === false}
            className={inputClass}
            onChange={onChangeListener}
          />
        </div>

        <span
          className={spanState + ' h-6 w-6 leading-5 rounded-full bg-gray-400 absolute top-0.5'}
          style={{ transition: 'all 0.2s ease-in-out' }}
        ></span>
      </div>
    </div>
  );
};

export default TripleToggle;

// const inputClass = 'absolute z-3 opacity-0 cursor-pointer w-5 h-6 top-0.5';
//   const labelClass = 'inline-block relative z-2 m-0 text-lg';
//   let spanState = 'left-4.5 bg-gray-400';
//   if (value) spanState = 'left-0.5 bg-green-400';
//   if (value === false) spanState = 'left-8.5 bg-red-400';
//   return (
//     <div className="px-1 w-14.5 inline-block rounded-full relative border bg-gray-500 border-gray-800 shadow-2xl">
//       <input
//         type="radio"
//         name={name}
//         value="true"
//         checked={value === true}
//         className={inputClass + ' left-0.5'}
//         onChange={onChangeListener}
//       />
//       <label className={labelClass + ' mr-2'}>✓</label>

//       <input
//         type="radio"
//         name={name}
//         value="undefined"
//         checked={value === undefined}
//         className={inputClass + ' left-4.5'}
//         onChange={onChangeListener}
//       />
//       <label className={labelClass + ' mr-2'}>-</label>

//       <input
//         type="radio"
//         name={name}
//         value="false"
//         checked={value === false}
//         className={inputClass + ' left-8.5'}
//         onChange={onChangeListener}
//       />
//       <label className={labelClass}>✗</label>
//       <span
//         className={spanState + ' h-5 w-5 leading-5 rounded-full bg-gray-400 block absolute top-1'}
//         style={{ transition: 'all 0.2s ease-in-out' }}
//       ></span>
//     </div>
//   );
