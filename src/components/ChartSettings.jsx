import { useState } from "react";
import Select from "./Select";

function ChartSettings({
  keys,
  selectedKey,
  startDate,
  endDate,
  sortedDates,
  selectedFilter,
  activeDates,
  onStartDateChange,
  onEndDateChange,
  onFilterChange,
  onDateToggle,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4 ">
      <button
        className="btn btn-secondary w-100 mb-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "Hide Settings ▼" : "Show Settings ▲"}
      </button>

      <div className={`collapse ${isOpen ? "show" : ""}`}>
        <Select
          options={["percentage", "count"]}
          value={selectedFilter}
          onChange={onFilterChange}
          title="Measurement Type"
        />

        <h2>Filter</h2>
        <p>
          Add a select here that dynamicay changes which dataset is loaded into
          the available component and renders start and end when dates are
          selected
        </p>
        <Select
          options={sortedDates}
          value={startDate}
          onChange={onStartDateChange}
          title="Start Date"
        />

        <Select
          options={sortedDates}
          value={endDate}
          onChange={onEndDateChange}
          title="End Date"
        />

        <div className="form-group mt-3">
          <label>Available Dates</label>
          <div
            className="date-dropdown border p-2 bg-light"
            style={{ maxHeight: "100px", overflowY: "auto" }}
          >
            {sortedDates.map((date) => (
              <div key={date} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`date-${date}`}
                  checked={activeDates.includes(date)}
                  onChange={() => onDateToggle(date)}
                />
                <label className="form-check-label" htmlFor={`date-${date}`}>
                  {date}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChartSettings;
