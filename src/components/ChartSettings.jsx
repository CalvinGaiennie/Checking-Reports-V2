import Select from "./Select";

function ChartSettings({
  keys,
  selectedKey,
  startDate,
  endDate,
  sortedDates,
  selectedFilter,
  onTypeChange,
  onStartDateChange,
  onEndDateChange,
  onFilterChange,
}) {
  return (
    <div>
      <Select
        options={keys}
        value={selectedKey}
        onChange={onTypeChange}
        title="Data Type"
      />

      <Select
        options={keys}
        value={selectedFilter}
        onChange={onFilterChange}
        title="Filter"
      />

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
    </div>
  );
}

export default ChartSettings;
