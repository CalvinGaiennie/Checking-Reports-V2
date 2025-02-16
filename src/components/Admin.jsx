import { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api";

function Admin() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [updateMessage, setUpdateMessage] = useState("");

  const permissionLevels = ["user", "viewer", "basic admin", "full admin"];

  useEffect(() => {
    fetchUsers();
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
    </div>
  );
}

export default Admin;
