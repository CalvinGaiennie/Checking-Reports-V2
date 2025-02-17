function Select({ options, dispatch, stateValue, title, dispatchType }) {
  return (
    <div>
      <h3>{title}</h3>
      <select
        onChange={(e) =>
          dispatch({ type: dispatchType, payload: e.target.value })
        }
        value={stateValue}
        className="form-select"
      >
        {options.map((options) => (
          <option key={options} value={options}>
            {options}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;
