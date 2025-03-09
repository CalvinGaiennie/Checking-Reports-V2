import { useState, useReducer, useEffect } from "react";
import GenericInputForm from "./GenericInputForm";
import {
  getData,
  createForm,
  createChart,
  deleteChart,
  api,
} from "../services/api.service";
import CreateNewForm from "./CreateNewForm";
import ManageChartsTable from "./ManageChartsTable";
import UserAccountsTable from "./UserAccountsTable";

const initialState = {
  users: [],
  charts: [],
  items: [],
  inputFields: [],
  inputType: "input",
  inputTitle: "name",
  inputOptions: [],
  formOptionNumber: [],
  keys: [],
  formKey: 0,
  error: null,
  updateMessage: "",
  permissionLevels: ["user", "viewer", "basic admin", "full admin"],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "setUsers":
      return { ...state, users: action.payload };
    case "setCharts":
      return { ...state, charts: action.payload };
    case "setItems":
      return { ...state, items: action.payload };
    case "setInputFields":
      return { ...state, inputFields: action.payload };
    case "setInputType":
      return {
        ...state,
        inputType: action.payload,
        formOptionNumber: action.payload === "select" ? [0] : [],
      };
    case "setInputTitle":
      return { ...state, inputTitle: action.payload };
    case "setInputOptions":
      return { ...state, inputOptions: action.payload };
    case "setFormOptionNumber":
      return { ...state, formOptionNumber: action.payload };
    case "setKeys":
      return { ...state, keys: action.payload };
    case "setError":
      return { ...state, error: action.payload };
    case "setUpdateMessage":
      return { ...state, updateMessage: action.payload };
    case "setFormKey":
      return { ...state, formKey: state.formKey + 1 };
    default:
      return state;
  }
};
//This file is getting too large. I need to seperate out components. Starting with the form builder.

function Admin() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const permissionLevels = ["user", "viewer", "basic admin", "full admin"];

  useEffect(() => {
    fetchUsers();
    fetchCharts();
  }, []);
  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      dispatch({ type: "setUsers", payload: response.data });
    } catch (err) {
      dispatch({ type: "setError", payload: err.message });
    }
  };

  const fetchCharts = async () => {
    try {
      const response = await api.get("/charts");
      dispatch({ type: "setCharts", payload: response.data });
    } catch (err) {
      dispatch({ type: "setError", payload: err.message });
    }
  };

  const handlePermissionChange = async (userId, newPermission) => {
    try {
      const response = await api.patch(`/users/${userId}/permissions`, {
        permissions: newPermission,
      });

      if (response.data.success) {
        dispatch({
          type: "setUpdateMessage",
          payload: "Permissions updated successfully!",
        });
        const currentUsers = state.users.map((user) =>
          user._id === userId ? { ...user, permissions: newPermission } : user
        );
        dispatch({ type: "setUsers", payload: currentUsers });
        setTimeout(
          () => dispatch({ type: "setUpdateMessage", payload: "" }),
          3000
        );
      }
    } catch (error) {
      dispatch({ type: "setError", payload: "Failed to update permissions" });
      console.error("Error updating permissions:", error);
    }
  };

  const handleDeleteChart = async (chartId) => {
    try {
      console.log("Attempting to delete chart with ID:", chartId);
      await deleteChart(chartId);
      await fetchCharts();

      dispatch({
        type: "setUpdateMessage",
        payload: "Chart deleted successfully!",
      });
      setTimeout(
        () => dispatch({ type: "setUpdateMessage", payload: "" }),
        3000
      );
    } catch (error) {
      console.error("Chart ID that failed:", chartId);
      dispatch({ type: "setError", payload: "Failed to delete chart" });
      console.error("Error deleting chart:", error);
    }
  };

  function handleInputTypeChange(e) {
    dispatch({
      type: "setInputType",
      payload: e.target.value,
    });
  }
  function handleInputTitleChange(e) {
    dispatch({ type: "setInputTitle", payload: e.target.value });
  }
  function handleAddInputOption(e) {
    dispatch({
      type: "setInputOptions",
      payload: [...state.inputOptions, e.target.value],
    });
  }

  function handleInputAdd() {
    const currentInputSchema = {
      name: state.inputTitle,
      type: state.inputType,
      options: [],
    };
    dispatch({
      type: "setInputFields",
      payload: [...state.inputFields, currentInputSchema],
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData();
        dispatch({ type: "setItems", payload: data });

        if (data.length > 0) {
          dispatch({ type: "setKeys", payload: Object.keys(data[0]) });
          dispatch({ type: "setFormKey" });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        dispatch({ type: "setError", payload: "Failed to load items" });
      }
    };
    fetchData();
  }, []);

  if (state.error)
    return <div className="alert alert-danger">{state.error}</div>;

  return (
    <div className="container mt-4">
      <UserAccountsTable
        state={state}
        handlePermissionChange={handlePermissionChange}
        permissionLevels={permissionLevels}
      />
      <ManageChartsTable state={state} handleDeleteChart={handleDeleteChart} />
      <div>
        <h2>Create New Chart</h2>
        <hr></hr>
        <GenericInputForm
          key={state.formKey}
          onSubmit={createChart}
          initialData={{
            type: "bar",
            name: "",
            input: "items",
            metric: state.keys.length > 0 ? state.keys[0] : "",
          }}
          fields={[
            {
              name: "type",
              type: "select",
              options: ["bar", "pie"],
            },
            {
              name: "name",
              type: "text",
            },
            {
              name: "input",
              type: "select",
              options: ["items", "legacyData"],
            },
            {
              name: "metric",
              type: "select",
              options: [...state.keys],
            },
          ]}
        />
      </div>
      <div>
        <h2>Manage Forms</h2>
        <hr></hr>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Chart 1</td>
              <td>
                {" "}
                <button className="btn btn-danger btn-sm">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <CreateNewForm
        state={state}
        createForm={createForm}
        handleInputTitleChange={handleInputTitleChange}
        handleInputTypeChange={handleInputTypeChange}
        handleAddInputOption={handleAddInputOption}
        handleInputAdd={handleInputAdd}
      />
    </div>
  );
}

export default Admin;
