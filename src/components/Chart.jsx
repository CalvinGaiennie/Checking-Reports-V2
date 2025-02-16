import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { useEffect, useState } from "react";

function Chart({ inputData = [] }) {
  const [keys, setKeys] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [selectedKey, setSelectedKey] = useState("");
  const [sortedDates, setSortedDates] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  //gets the keys of the input data
  useEffect(() => {
    if (inputData.length !== 0) {
      const filteredKeys = Object.keys(inputData[0]).filter(
        (key) => key !== "_id" && key !== "__v"
      );
      setKeys(filteredKeys);
      setSelectedKey(filteredKeys[0] || ""); // Set the first key as default if available
    }
  }, [inputData]);

  //gets the count of entrys for each different value of the selected key  (e.g. count of submissions containing each different date or each different user) and sets it as the chart data

  useEffect(() => {
    if (!selectedKey || inputData.length === 0) return;

    const data = Object.entries(
      inputData.reduce((acc, item) => {
        if (item[selectedKey]) {
          acc[item[selectedKey]] = (acc[item[selectedKey]] || 0) + 1;
        }
        return acc;
      }, {})
    ).map(([key, count]) => ({ key, count }));

    setChartData(data);
  }, [inputData, selectedKey]);

  //gets the unique dates from the input data and sorts them
  useEffect(() => {
    const uniqueDates = new Set(
      inputData
        .map((item) => {
          if (!item.date && !item.Date) return null;
          let dateStr = item.date || item.Date;
          let dateObj = new Date(dateStr);
          if (isNaN(dateObj)) {
            return String(dateStr).split("T")[0];
          }
          return dateObj.toISOString().split("T")[0];
        })
        .filter(Boolean)
    );

    const sortedDates = Array.from(uniqueDates).sort((a, b) =>
      a.localeCompare(b)
    );
    setSortedDates(sortedDates);

    if (sortedDates.length > 0) {
      setStartDate(sortedDates[0]);
      setEndDate(sortedDates[sortedDates.length - 1]);
    }
  }, [inputData]);

  //filters the data based on the selected key and the start and end dates and sets the chart data
  useEffect(() => {
    if (!selectedKey || !startDate || !endDate) return;

    const filteredData = inputData.filter((item) => {
      const itemDate = item.date || item.Date;
      const itemDateObj = new Date(itemDate);
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);

      return itemDateObj >= startDateObj && itemDateObj <= endDateObj;
    });

    const data = Object.entries(
      filteredData.reduce((acc, item) => {
        if (item[selectedKey]) {
          acc[item[selectedKey]] = (acc[item[selectedKey]] || 0) + 1;
        }
        return acc;
      }, {})
    ).map(([key, count]) => ({ key, count }));

    setChartData(data);
  }, [inputData, selectedKey, startDate, endDate]);

  function handleTypeChange(e) {
    setSelectedKey(e.target.value);
  }

  function handleStartDateChange(e) {
    setStartDate(e.target.value);
  }
  function handleEndDateChange(e) {
    setEndDate(e.target.value);
  }
  function changeAvailableDates() {
    if (!selectedKey) return;

    const filteredData = inputData.filter((item) => {
      const itemDate = item.date || item.Date;
      return itemDate >= startDate && itemDate <= endDate;
    });

    const data = Object.entries(
      filteredData.reduce((acc, item) => {
        if (item[selectedKey]) {
          acc[item[selectedKey]] = (acc[item[selectedKey]] || 0) + 1;
        }
        return acc;
      }, {})
    ).map(([key, count]) => ({ key, count }));

    setChartData(data);
  }

  return (
    <div>
      <div>
        <h3>Data Type</h3>
        <select onChange={handleTypeChange} value={selectedKey}>
          {keys.map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </div>
      <div>
        <h3>Dates</h3>
        <div>
          <div className="d-flex flex-column">
            <label>Start Date</label>
            <select onChange={handleStartDateChange} value={startDate}>
              {sortedDates.map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div className="d-flex flex-column">
              <label>End Date</label>
              <select onChange={handleEndDateChange} value={endDate}>
                {sortedDates.map((date) => (
                  <option key={date} value={date}>
                    {date}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />
      <br />
      <div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ bottom: 50 }}>
            <XAxis dataKey="key" angle={-45} textAnchor="end" interval={0} />

            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8">
              <LabelList dataKey="count" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Chart;
