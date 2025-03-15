function UserAccountsTable({
  state,
  handlePermissionChange,
  permissionLevels,
}) {
  return (
    <div>
      <div className="mb-5 border rounded p-4">
        <h2>User Accounts</h2>
        <hr />
        {state.updateMessage && (
          <div className="alert alert-success" role="alert">
            {state.updateMessage}
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
            {state.users.map((user) => (
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
    </div>
  );
}

export default UserAccountsTable;
