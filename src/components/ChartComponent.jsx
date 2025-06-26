import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useEffect, useReducer } from "react";
import { useAuth } from "../context/AuthContext";
import ChartSettings from "./ChartSettings";

const initialState = {
  keys: [],
  chartData: [],
  sortedDates: [],
  startDate: "",
  endDate: "",
  error: "",
  selectedFilter: "",
  activeDates: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "set_keys":
      return { ...state, keys: action.payload };
    case "set_chart_data":
      return { ...state, chartData: action.payload };
    case "set_sorted_dates":
      return { ...state, sortedDates: action.payload };
    case "set_start_date":
      return { ...state, startDate: action.payload };
    case "set_end_date":
      return { ...state, endDate: action.payload };
    case "set_error":
      return { ...state, error: action.payload };
    case "set_filter":
      return { ...state, selectedFilter: action.payload };
    case "set_active_dates":
      return { ...state, activeDates: action.payload };
    case "set_possible_dates":
      return { ...state, possibleDates: action.payload };
    default:
      return state;
  }
}

function ChartComponent({ inputData = [], chartType, title, metric }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { authState } = useAuth();

  // Verify user has appropriate permissions
  if (
    !["viewer", "basic admin", "full admin"].includes(authState.permissions)
  ) {
    return <div className="alert alert-danger">Unauthorized access</div>;
  }

  function handleStartDateChange(e) {
    dispatch({ type: "set_start_date", payload: e.target.value });
  }

  function handleEndDateChange(e) {
    dispatch({ type: "set_end_date", payload: e.target.value });
  }

  function handleFilterChange(e) {
    dispatch({ type: "set_filter", payload: e.target.value });
  }

  function handleDateToggle(date) {
    const newActiveDates = state.activeDates.includes(date)
      ? state.activeDates.filter((d) => d !== date)
      : [...state.activeDates, date];
    dispatch({ type: "set_active_dates", payload: newActiveDates });
  }

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AF19FF",
    "#FF4567",
  ];

  // Sanitize and validate input data
  useEffect(() => {
    try {
      if (!Array.isArray(inputData)) {
        throw new Error("Invalid input data format");
      }

      if (inputData.length !== 0) {
        const firstItem = inputData[0];
        if (typeof firstItem !== "object") {
          throw new Error("Invalid data structure");
        }

        const filteredKeys = Object.keys(firstItem).filter((key) => {
          const safeKey = key.replace(/[^a-zA-Z0-9_]/g, "");
          return safeKey !== "_id" && safeKey !== "__v";
        });

        dispatch({ type: "set_keys", payload: filteredKeys });
        dispatch({ type: "set_selected_key", payload: filteredKeys[0] || "" });
        dispatch({ type: "set_error", payload: "" });
      }
    } catch (err) {
      dispatch({
        type: "set_error",
        payload: "Error processing data: " + err.message,
      });
      console.error("Chart data error:", err);
    }
  }, [inputData]);

  // Safe data processing for chart
  useEffect(() => {
    try {
      if (!Array.isArray(inputData) || inputData.length === 0) return;

      const data = Object.entries(
        inputData.reduce((acc, item) => {
          const value = item[metric];
          if (value && typeof value !== "function") {
            // Prevent code injection
            const safeValue = String(value).slice(0, 100); // Limit string length
            acc[safeValue] = (acc[safeValue] || 0) + 1;
          }
          return acc;
        }, {})
      ).map(([key, count]) => ({
        key: key.replace(/[<>]/g, ""), // Remove potential HTML tags
        count: Number(count) || 0,
      }));

      dispatch({ type: "set_chart_data", payload: data });
      dispatch({ type: "set_error", payload: "" });
    } catch (err) {
      dispatch({ type: "set_error", payload: "Error generating chart data" });
      console.error("Chart generation error:", err);
    }
  }, [inputData]);

  //gets the unique dates from the input data and sorts them
  // useEffect(() => {
  //   const uniqueDates = new Set(
  //     inputData
  //       .map((item) => {
  //         if (!item.date && !item.Date) return null;
  //         let dateStr = item.date || item.Date;
  //         let dateObj = new Date(dateStr);
  //         if (isNaN(dateObj)) {
  //           return String(dateStr).split("T")[0];
  //         }
  //         return dateObj.toISOString().split("T")[0];
  //       })
  //       .filter(Boolean)
  //   );

  //   const sortedDates = Array.from(uniqueDates).sort((a, b) =>
  //     a.localeCompare(b)
  //   );
  //   dispatch({ type: "set_sorted_dates", payload: sortedDates });

  //   if (sortedDates.length > 0) {
  //     dispatch({ type: "set_start_date", payload: sortedDates[0] });
  //     dispatch({
  //       type: "set_end_date",
  //       payload: sortedDates[sortedDates.length - 1],
  //     });
  //   }
  // }, [inputData]);

  //counts the number of submissions based on the selected key and the available dates and updates the chart data
  // useEffect(() => {
  //   if (!state.startDate || !state.endDate) return;

  //   const filteredData = inputData.filter((item) => {
  //     const itemDate = item.date || item.Date;
  //     const itemDateStr = new Date(itemDate).toISOString().split("T")[0];
  //     return state.activeDates.includes(itemDateStr);
  //   });

  //   const data = Object.entries(
  //     filteredData.reduce((acc, item) => {
  //       if (item[metric]) {
  //         acc[item[metric]] = (acc[item[metric]] || 0) + 1;
  //       }
  //       return acc;
  //     }, {})
  //   ).map(([key, count]) => ({ key, count }));

  //   // Apply percentage calculation if percentage filter is selected
  //   if (state.selectedFilter === "percentage") {
  //     const totalSubmissions = data.reduce((acc, item) => acc + item.count, 0);
  //     const percentages = data.map((item) => ({
  //       ...item,
  //       count: Number(((item.count / totalSubmissions) * 100).toFixed(2)),
  //     }));
  //     dispatch({ type: "set_chart_data", payload: percentages });
  //   } else {
  //     dispatch({ type: "set_chart_data", payload: data });
  //   }
  // }, [
  //   inputData,
  //   state.startDate,
  //   state.endDate,
  //   state.activeDates,
  //   state.selectedFilter,
  // ]);

  // useEffect(() => {
  //   if (!state.startDate || !state.endDate || state.activeDates.length > 0)
  //     return;

  //   const dates = [];
  //   const startDate = new Date(state.startDate);
  //   const endDate = new Date(state.endDate);

  //   while (startDate <= endDate) {
  //     dates.push(startDate.toISOString().split("T")[0]);
  //     startDate.setDate(startDate.getDate() + 1);
  //   }

  //   // Only dispatch if dates are actually different
  //   if (
  //     dates.length !== state.activeDates.length ||
  //     !dates.every((d, i) => d === state.activeDates[i])
  //   ) {
  //     dispatch({ type: "set_active_dates", payload: dates });
  //   }
  // }, [state.startDate, state.endDate, state.activeDates]);

  console.log("inputData:", inputData);
  console.log("metric:", metric);
  console.log("chartData:", state.chartData);

  return (
    <div className="mt-4">
      {state.error && <div className="alert alert-danger">{state.error}</div>}
      <h2 className="mb-4 text-center">{title}</h2>
      {/* <ChartSettings
        startDate={state.startDate}
        endDate={state.endDate}
        sortedDates={state.sortedDates}
        selectedFilter={state.selectedFilter}
        activeDates={state.activeDates}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
        onFilterChange={handleFilterChange}
        onDateToggle={handleDateToggle}
      /> */}
      {chartType == "pie" ? (
        <div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart data={state.chartData} margin={{ bottom: 50 }}>
              <Pie
                data={state.chartData}
                dataKey="count"
                nameKey="key"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={({ key }) => key}
              >
                {state.chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={state.chartData} margin={{ bottom: 50 }}>
              <XAxis dataKey="key" angle={-45} textAnchor="end" interval={0} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8">
                <LabelList
                  position="top"
                  formatter={(value) =>
                    state.selectedFilter === "percentage" ? `${value}%` : value
                  }
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default ChartComponent;
