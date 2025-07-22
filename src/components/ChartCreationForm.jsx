import { useState, useEffect } from "react";

function ChartCreationForm({ onSubmit, initialData, fields, dispatch }) {
  const [formData, setFormData] = useState(
    initialData || {
      type: "bar",
      name: "",
      input: "",
      metric: "",
    }
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check for empty metric
      if (!formData.metric || formData.metric.trim() === "") {
        alert("Please select a metric for the chart.");
        return;
      }

      // Check for empty name
      if (!formData.name || formData.name.trim() === "") {
        alert("Please enter a chart name.");
        return;
      }

      // Check for empty input
      if (!formData.input || formData.input.trim() === "") {
        alert("Please select an input form.");
        return;
      }

      const transformedData = fields.reduce((acc, field) => {
        const serverKey = field.name.toLowerCase();
        acc[serverKey] = formData[serverKey];
        return acc;
      }, {});

      await onSubmit(transformedData);
      setFormData(
        initialData || {
          type: "bar",
          name: "",
          input: "",
          metric: "",
        }
      );
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name.toLowerCase()]: value,
    });
  };

  return (
    <form className="container mt-4" onSubmit={handleSubmit}>
      <div className="mb-3">
        {fields.map((field, index) => (
          <div key={`${field.name}-${index}`}>
            <label className="form-label">
              {field.name.charAt(0).toUpperCase() + field.name.slice(1)}
            </label>
            {field.type === "select" ? (
              <select
                name={field.name.toLowerCase()}
                className="form-select"
                value={formData[field.name.toLowerCase()] || ""}
                onChange={
                  field.name === "input"
                    ? (e) => {
                        handleChange(e);
                        dispatch({
                          type: "setinProgressChartName",
                          payload: e.target.value,
                        });
                      }
                    : handleChange
                }
                required
              >
                {field.options.map((option, optionIndex) => {
                  const optionText =
                    typeof option === "string" ? option : option.text;
                  const optionKey =
                    typeof option === "string"
                      ? option
                      : `${option.text}-${optionIndex}`;
                  return (
                    <option key={optionKey} value={optionText}>
                      {optionText}
                    </option>
                  );
                })}
              </select>
            ) : (
              <input
                type={field.type}
                name={field.name.toLowerCase()}
                className="form-control"
                value={formData[field.name.toLowerCase()] || ""}
                onChange={handleChange}
                required
              />
            )}
          </div>
        ))}
        <button type="submit" className="btn btn-primary mt-3">
          Submit
        </button>
      </div>
    </form>
  );
}

export default ChartCreationForm;
