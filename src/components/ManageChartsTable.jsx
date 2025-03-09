function ManageChartsTable({ state, handleDeleteChart }) {
  return (
    <div>
      <h2>Manage Charts</h2>
      <hr></hr>
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
          {state.charts.map((chart) => (
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
    </div>
  );
}

export default ManageChartsTable;
