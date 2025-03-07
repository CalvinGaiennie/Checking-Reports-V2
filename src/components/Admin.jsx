import { useState, useReducer, useEffect } from "react";
import GenericInputForm from "./GenericInputForm";
import {
  getData,
  createForm,
  createChart,
  deleteChart,
  api,
} from "../services/api.service";
import Select from "./Select";

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
      return { ...state, inputType: action.payload };
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
  const [formKey, setFormKey] = useState(0);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [updateMessage, setUpdateMessage] = useState("");
  const [charts, setCharts] = useState([]);
  const [items, setItems] = useState([]);
  const [inputFields, setInputFields] = useState([]);
  const [inputType, setInputType] = useState("input");
  const [inputTitle, setInputTitle] = useState("name");
  const [inputOptions, setInputOptions] = useState([]);
  const [formOptionNumber, setFormOptionNumber] = useState([]);
  const [keys, setKeys] = useState([]);
  const permissionLevels = ["user", "viewer", "basic admin", "full admin"];

  useEffect(() => {
    fetchUsers();
    fetchCharts();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchCharts = async () => {
    try {
      const response = await api.get("/charts");
      setCharts(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePermissionChange = async (userId, newPermission) => {
    try {
      const response = await api.patch(`/users/${userId}/permissions`, {
        permissions: newPermission,
      });

      if (response.data.success) {
        setUpdateMessage("Permissions updated successfully!");
        setUsers(
          users.map((user) =>
            user._id === userId ? { ...user, permissions: newPermission } : user
          )
        );
        setTimeout(() => setUpdateMessage(""), 3000);
      }
    } catch (error) {
      setError("Failed to update permissions");
      console.error("Error updating permissions:", error);
    }
  };

  const handleDeleteChart = async (chartId) => {
    try {
      console.log("Attempting to delete chart with ID:", chartId);
      await deleteChart(chartId);
      await fetchCharts();
      setUpdateMessage("Chart deleted successfully!");
      setTimeout(() => setUpdateMessage(""), 3000);
    } catch (error) {
      console.error("Chart ID that failed:", chartId);
      setError("Failed to delete chart");
      console.error("Error deleting chart:", error);
    }
  };

  function handleInputTypeChange(e) {
    setInputType(e.target.value);
  }
  function handleInputTitleChange(e) {
    setInputTitle(e.target.value);
  }
  function handleAddInputOption(e) {
    setInputOptions([...inputOptions, e.target.value]);
  }

  function handleInputAdd() {
    const currentInputFields = inputFields;
    const currentInputSchema = {
      name: inputTitle,
      type: inputType,
      options: [],
    };
    setInputFields([...currentInputFields, currentInputSchema]);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData();
        setItems(data);

        if (data.length > 0) {
          setKeys(Object.keys(data[0]));
          dispatch({ type: "setFormKey" });
          setFormKey((prev) => prev + 1);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load items");
      }
    };
    fetchData();
  }, []);

  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h2>User Accounts</h2>
      {updateMessage && (
        <div className="alert alert-success" role="alert">
          {updateMessage}
        </div>
      )}
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Permissions</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.permissions || "user"}</td>
              <td>
                <select
                  className="form-select"
                  value={user.permissions || "user"}
                  onChange={(e) =>
                    handlePermissionChange(user._id, e.target.value)
                  }
                >
                  {permissionLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Manage Charts</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Input</th>
            <th>Metric</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {charts.map((chart) => (
            <tr key={chart._id}>
              <td>{chart.name}</td>
              <td>{chart.type}</td>
              <td>{chart.input}</td>
              <td>{chart.metric}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteChart(chart._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <h2>Create New Chart</h2>
        <GenericInputForm
          key={formKey}
          onSubmit={createChart}
          initialData={{
            type: "bar",
            name: "",
            input: "items",
            metric: keys.length > 0 ? keys[0] : "",
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
              options: [...keys],
            },
          ]}
        />
      </div>
      <div>
        <h2>Manage Forms</h2>
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

      {/* I should probably seperate this out into its own component and use use reducer in this admin file.
      its getting real complicated and harder to follow than it should be */}
      <div className="mb-5">
        <h2>Create New Form</h2>
        <GenericInputForm
          key={`${formKey} i`}
          onSubmit={createForm}
          fields={inputFields}
        />
        <h3>Add New Input</h3>
        <h3>Input Title</h3>
        <input className="form-control" onChange={handleInputTitleChange} />
        <Select
          title="Input Type"
          onChange={handleInputTypeChange}
          value={inputType}
          options={["input", "select"]}
        />
        {inputType === "select" &&
          formOptionNumber.map(() => (
            <div key={`${state.formKey}option`}>
              <h3>Option</h3>
              <input
                className="form-control mb-4"
                onChange={(e) => handleAddInputOption(e)}
              />
            </div>
          ))}
        <button className="mt-4" onClick={handleInputAdd}>
          Add
        </button>
      </div>
    </div>
  );
}

export default Admin;
