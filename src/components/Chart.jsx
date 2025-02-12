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
import ItemCard from "./ItemCard";
import { useEffect, useState } from "react";

function Chart({ data }) {
  const [legacyData, setLegacyData] = useState([]);
  const [formattedData, setFormattedData] = useState([]);

  useEffect(() => {
    fetch("/output.json")
      .then((response) => response.json())
      .then((json) => setLegacyData(json))
      .catch((error) => console.error("Error loading JSON:", error));
  }, []);

  useEffect(() => {
    const formatted = Object.entries(
      legacyData.reduce((acc, item) => {
        acc[item.OrderChecker] = (acc[item.OrderChecker] || 0) + 1;
        return acc;
      }, {})
    ).map(([checker, count]) => ({ checker, count }));
    setFormattedData(formatted);
    console.log("legacy", legacyData);
    console.log("formatted", formatted);
  }, [legacyData]);

  const categoryCounts = data.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(categoryCounts).map((category) => ({
    category,
    count: categoryCounts[category],
  }));
  console.log("chart data", chartData);
  return (
    <div>
      <div>
        <h1>User Input Data</h1>
        <h2>Count of entries per category</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8">
              <LabelList dataKey="count" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div>
        <h1>Legacy Data</h1>
        <h2>Orders Checked per Checker</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={formattedData}>
            <XAxis dataKey="checker" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8">
              <LabelList dataKey="count" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div>Chart 3</div>
      {data.map((data, index) => (
        <ItemCard data={data} key={`IC${index}`} />
      ))}
    </div>
  );
}

export default Chart;
