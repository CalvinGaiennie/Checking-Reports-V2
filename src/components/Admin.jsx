import { useReducer, useEffect } from "react";
import {
  getFormResponses,
  createForm,
  createChart,
  deleteChart,
  api,
  getForms,
  getMetrics,
} from "../services/api.service";
import CreateNewForm from "./CreateNewForm";
import ManageChartsTable from "./ManageChartsTable";
import UserAccountsTable from "./UserAccountsTable";
import ChartCreationForm from "./ChartCreationForm";

const initialState = {
  users: [],
  charts: [],
  formNames: [],
  formResponses: [],
  inputFields: [],
  currentInputDescription: "",
  inputType: "input",
  inputTitle: "name",
  inputOptions: [],
  keys: [],
  formKey: 0,
  error: null,
  updateMessage: "",
  permissionLevels: ["user", "viewer", "basic admin", "full admin"],
  currentInputRequiredBool: false,
  inProgressFormName: "",
  inProgressChartName: "",
  inProgressChartMetrics: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "setUsers":
      return { ...state, users: action.payload };
    case "setCharts":
      return { ...state, charts: action.payload };
    case "setFormNames":
      return { ...state, formNames: action.payload };
    case "setFormResponses":
      return { ...state, formResponses: action.payload };
    case "setInputFields":
      return { ...state, inputFields: action.payload };
    case "setInputType":
      return {
        ...state,
        inputType: action.payload,
      };
    case "setInputTitle":
      return { ...state, inputTitle: action.payload };
    case "setInputOptions":
      return { ...state, inputOptions: action.payload };
    case "setKeys":
      return { ...state, keys: action.payload };
    case "setError":
      return { ...state, error: action.payload };
    case "setUpdateMessage":
      return { ...state, updateMessage: action.payload };
    case "setFormKey":
      return { ...state, formKey: state.formKey + 1 };
    case "setinProgressFormName":
      return { ...state, inProgressFormName: action.payload };
    case "setCurrentInputDescription":
      return { ...state, currentInputDescription: action.payload };
    case "setCurrentInputRequiredBool":
      return { ...state, currentInputRequiredBool: action.payload };
    case "setinProgressChartName":
      return { ...state, inProgressChartName: action.payload };
    case "setinProgressChartMetrics":
      return { ...state, inProgressChartMetrics: action.payload };
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
      payload: [{ index: 0, text: "" }],
    });
  }

  function handleInputTitleChange(e) {
    dispatch({ type: "setInputTitle", payload: e.target.value });
  }
  function handleAddInputOption(index) {
    dispatch({
      type: "setInputOptions",
      payload: [...state.inputOptions, { index, text: "" }],
    });
  }

  function handleInputAdd() {
    let finalOptions = [...state.inputOptions];

    const currentInputSchema = {
      name: state.inputTitle,
      description: state.currentInputDescription,
      type: state.inputType,
      options: finalOptions,
      required: state.currentInputRequiredBool,
    };
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
  }

  async function handleSaveForm() {
    try {
      if (!state.inProgressFormName) {
        console.log("[Admin] Form save failed: Name required");
        dispatch({ type: "setError", payload: "Form name is required" });
        return;
      }

      if (state.inputFields.length === 0) {
        dispatch({
          type: "setError",
          payload: "Form must have at least one field",
        });
        return;
      }

      const payload = {
        name: state.inProgressFormName,
        fields: state.inputFields,
      };
      await createForm(payload);

      // Clear form after successful save
      dispatch({ type: "setInputFields", payload: [] });
      dispatch({ type: "setinProgressFormName", payload: "" });
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
    const newOptions = state.inputOptions
      .filter((_, i) => i !== index)
      .map((option, i) => ({ ...option, index: i }));

    dispatch({
      type: "setInputOptions",
      payload: newOptions,
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFormResponses();
        dispatch({ type: "setFormResponses", payload: data });

        if (data.length > 0) {
          dispatch({ type: "setKeys", payload: Object.keys(data[0]) });
          dispatch({ type: "setFormKey" });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        dispatch({
          type: "setError",
          payload: "Failed to load form responses",
        });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const forms = await getForms();
        const formNames = [];
        forms.forEach((form) => {
          formNames.push(form.name);
        });
        dispatch({ type: "setFormNames", payload: formNames });
      } catch (error) {
        console.error("[Input Page] Error fetching forms:", error);
      }
    };
    fetchForms();
  }, []);

  useEffect(() => {
    const fetchMetrics = async () => {
      const metrics = await getMetrics(state.inProgressChartName);
      console.log("Metrics", metrics);
      dispatch({ type: "setinProgressChartMetrics", payload: metrics });
    };
    fetchMetrics();
  }, [state.inProgressChartName]);

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
        <ChartCreationForm
          key={state.formKey}
          onSubmit={createChart}
          dispatch={dispatch}
          //Make it so that the selected input becomes the inprogresschartform
          initialData={{
            type: "bar",
            name: "",
            input: "formResponses",
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
              options: [...state.formNames],
            },
            {
              name: "metric",
              type: "select",
              options: [...state.inProgressChartMetrics],
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
        handleRemoveOption={handleRemoveOption}
      />
    </div>
  );
}

export default Admin;
