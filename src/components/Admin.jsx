import { useReducer, useEffect } from "react";
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
  currentInputDescription: "",
  inputType: "input",
  inputTitle: "name",
  inputOptions: [],
  formOptionNumber: [0],
  keys: [],
  formKey: 0,
  error: null,
  updateMessage: "",
  permissionLevels: ["user", "viewer", "basic admin", "full admin"],
  currentInputRequiredBool: false,
  currentFormName: "",
  currentOption: "",
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
    case "setCurrentFormName":
      return { ...state, currentFormName: action.payload };
    case "setCurrentInputDescription":
      return { ...state, currentInputDescription: action.payload };
    case "setCurrentInputRequiredBool":
      return { ...state, currentInputRequiredBool: action.payload };
    case "setCurrentOption":
      return { ...state, currentOption: action.payload };
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
    dispatch({
      type: "setInputOptions",
      payload: [],
    });
    dispatch({
      type: "setFormOptionNumber",
      payload: e.target.value === "select" ? [0] : [],
    });
  }

  function handleInputTitleChange(e) {
    dispatch({ type: "setInputTitle", payload: e.target.value });
  }
  function handleAddInputOption(option) {
    dispatch({
      type: "setInputOptions",
      payload: [...state.inputOptions, option],
    });
  }

  function handleCurrentOptionSubmission() {
    dispatch({
      type: "setFormOptionNumber",
      payload: [...state.formOptionNumber, state.formOptionNumber.length],
    });
    handleAddInputOption(state.currentOption);
    dispatch({
      type: "setCurrentOption",
      payload: "",
    });
  }
  function handleInputAdd() {
    console.log("[Admin] handleInputAdd");

    // Create the final options array including the current option if it exists
    let finalOptions = [...state.inputOptions];
    if (state.currentOption && state.currentOption.trim() !== "") {
      finalOptions.push(state.currentOption);
    }

    const currentInputSchema = {
      name: state.inputTitle,
      description: state.currentInputDescription,
      type: state.inputType,
      options: finalOptions,
      required: state.currentInputRequiredBool,
    };
    console.log("[Admin] Adding new field:", currentInputSchema);
    console.log("[Admin] Current input fields:", state.inputFields);
    dispatch({
      type: "setInputFields",
      payload: [...state.inputFields, currentInputSchema],
    });
    // Clear all form fields after adding
    dispatch({
      type: "setInputOptions",
      payload: [],
    });
    dispatch({
      type: "setFormOptionNumber",
      payload: [],
    });
    dispatch({
      type: "setInputTitle",
      payload: "",
    });
    dispatch({
      type: "setCurrentInputDescription",
      payload: "",
    });
    dispatch({
      type: "setCurrentInputRequiredBool",
      payload: false,
    });
    dispatch({
      type: "setInputType",
      payload: "input",
    });
    dispatch({
      type: "setCurrentOption",
      payload: "",
    });
  }

  async function handleSaveForm() {
    try {
      console.log("[Admin] Starting form save process");
      if (!state.currentFormName) {
        console.log("[Admin] Form save failed: Name required");
        dispatch({ type: "setError", payload: "Form name is required" });
        return;
      }

      if (state.inputFields.length === 0) {
        console.log("[Admin] Form save failed: No fields");
        dispatch({
          type: "setError",
          payload: "Form must have at least one field",
        });
        return;
      }

      const payload = {
        name: state.currentFormName,
        fields: state.inputFields,
      };
      console.log("[Admin] Attempting to save form with payload:", payload);
      console.log("[Admin] Current state:", state);

      const savedForm = await createForm(payload);
      console.log("[Admin] Form saved successfully:", savedForm);

      // Clear form after successful save
      dispatch({ type: "setInputFields", payload: [] });
      dispatch({ type: "setCurrentFormName", payload: "" });
      dispatch({
        type: "setUpdateMessage",
        payload: "Form saved successfully!",
      });

      setTimeout(
        () => dispatch({ type: "setUpdateMessage", payload: "" }),
        3000
      );
    } catch (error) {
      console.error("[Admin] Error saving form:", error);
      dispatch({
        type: "setError",
        payload: error.response?.data?.message || "Error saving form",
      });
    }
  }

  function handleRemoveOption(index) {
    // dispatch({
    //   type: "setInputOptions",
    //   payload: state.inputOptions.filter((_, i) => i !== index),
    // });
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
      <div className="mb-5 border rounded p-4">
        <h2>Create New Chart</h2>
        <hr />
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
      <div className="mb-5 border rounded p-4">
        <h2>Manage Forms</h2>
        <hr />
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
        dispatch={dispatch}
        handleSaveForm={handleSaveForm}
        handleCurrentOptionSubmission={handleCurrentOptionSubmission}
        handleRemoveOption={handleRemoveOption}
      />
    </div>
  );
}

export default Admin;
