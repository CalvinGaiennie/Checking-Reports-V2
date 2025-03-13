function Select({ options, value, onChange, title, className }) {
  return (
    <div className={className}>
      <h3>{title}</h3>
      <select onChange={onChange} value={value} className="form-select">
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;
