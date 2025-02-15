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

  useEffect(() => {
    if (inputData.length !== 0) {
      const filteredKeys = Object.keys(inputData[0]).filter(
        (key) => key !== "_id" && key !== "__v"
      );
      setKeys(filteredKeys);
      setSelectedKey(filteredKeys[0] || ""); // Set the first key as default if available
    }
  }, [inputData]);

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

  function handleTypeChange(e) {
    setSelectedKey(e.target.value);
  }

  function getDates() {}
  function changeAvailableDates() {}
  return (
    <div>
      <h3>Data Type</h3>
      <select onChange={handleTypeChange} value={selectedKey}>
        {keys.map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
      <br />
      <br />
      <br />
      <div>
        <h1>Legacy Data</h1>
        <h2>Orders Checked per Checker</h2>
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
