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
import { useEffect, useState, useReducer } from "react";
import { useAuth } from "../context/AuthContext";
import Select from "./Select";

const initialState = {
  keys: [],
  chartData: [],
  selectedKey: "",
  sortedDates: [],
  startDate: "",
  endDate: "",
  error: "",
  selectedFilter: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "set_keys":
      return { ...state, keys: action.payload };
    case "set_chart_data":
      return { ...state, chartData: action.payload };
    case "set_selected_key":
      return { ...state, selectedKey: action.payload };
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
    default:
      return state;
  }
}

function Chart({ inputData = [] }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { authState } = useAuth();

  // Verify user has appropriate permissions
  if (
    !["viewer", "basic admin", "full admin"].includes(authState.permissions)
  ) {
    return <div className="alert alert-danger">Unauthorized access</div>;
  }

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
      if (
        !state.selectedKey ||
        !Array.isArray(inputData) ||
        inputData.length === 0
      )
        return;

      const data = Object.entries(
        inputData.reduce((acc, item) => {
          const value = item[state.selectedKey];
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
  }, [inputData, state.selectedKey]);

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
    dispatch({ type: "set_sorted_dates", payload: sortedDates });

    if (sortedDates.length > 0) {
      dispatch({ type: "set_start_date", payload: sortedDates[0] });
      dispatch({
        type: "set_end_date",
        payload: sortedDates[sortedDates.length - 1],
      });
    }
  }, [inputData]);

  //filters the data based on the selected key and the start and end dates and sets the chart data
  useEffect(() => {
    if (!state.selectedKey || !state.startDate || !state.endDate) return;

    const filteredData = inputData.filter((item) => {
      const itemDate = item.date || item.Date;
      const itemDateObj = new Date(itemDate);
      const startDateObj = new Date(state.startDate);
      const endDateObj = new Date(state.endDate);

      return itemDateObj >= startDateObj && itemDateObj <= endDateObj;
    });

    const data = Object.entries(
      filteredData.reduce((acc, item) => {
        if (item[state.selectedKey]) {
          acc[item[state.selectedKey]] =
            (acc[item[state.selectedKey]] || 0) + 1;
        }
        return acc;
      }, {})
    ).map(([key, count]) => ({ key, count }));

    dispatch({ type: "set_chart_data", payload: data });
  }, [inputData, state.selectedKey, state.startDate, state.endDate]);

  function handleTypeChange(e) {
    dispatch({ type: "set_selected_key", payload: e.target.value });
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

  return (
    <div>
      {state.error && <div className="alert alert-danger">{state.error}</div>}
      <div id="chart-settings">
        <Select
          options={state.keys}
          dispatch={dispatch}
          stateValue={state.selectedKey}
          title="Data Type"
          dispatchType="set_selected_key"
        />

        <Select
          options={state.keys}
          dispatch={dispatch}
          stateValue={state.selectedFilter}
          title="Filter"
          dispatchType="set_filter"
        />

        <Select
          options={state.sortedDates}
          dispatch={dispatch}
          stateValue={state.startDate}
          title="Start Date"
          dispatchType="set_start_date"
        />

        <Select
          options={state.sortedDates}
          dispatch={dispatch}
          stateValue={state.endDate}
          title="End Date"
          dispatchType="set_end_date"
        />
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={state.chartData} margin={{ bottom: 50 }}>
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
  );
}

export default Chart;
