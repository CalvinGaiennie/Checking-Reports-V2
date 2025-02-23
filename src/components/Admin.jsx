import { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api";
import GenericInputForm from "./GenericInputForm";
import { createChart, deleteChart } from "../services/api.service";

function Admin() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [updateMessage, setUpdateMessage] = useState("");
  const [charts, setCharts] = useState([]);

  const permissionLevels = ["user", "viewer", "basic admin", "full admin"];

  useEffect(() => {
    fetchUsers();
    fetchCharts();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchCharts = async () => {
    try {
      const response = await fetch("/api/charts");
      if (!response.ok) {
        throw new Error("Failed to fetch charts");
      }
      const data = await response.json();
      setCharts(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePermissionChange = async (userId, newPermission) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/users/${userId}/permissions`,
        {
          permissions: newPermission,
        }
      );

      if (response.data.success) {
        setUpdateMessage("Permissions updated successfully!");
        // Update the local state to reflect the change
        setUsers(
          users.map((user) =>
            user._id === userId ? { ...user, permissions: newPermission } : user
          )
        );
        // Clear success message after 3 seconds
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
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {charts.map((chart) => (
            <tr key={chart._id}>
              <td>{chart.name}</td>
              <td>{chart.type}</td>
              <td>{chart.input}</td>
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
      <h2>Create New Chart</h2>
      <GenericInputForm
        onSubmit={createChart}
        initialData={{
          type: "bar",
          name: "",
          input: "items",
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
        ]}
      />
    </div>
  );
}

export default Admin;
