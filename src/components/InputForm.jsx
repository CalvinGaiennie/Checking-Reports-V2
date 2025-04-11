import { useState } from "react";

function InputForm({ onSubmit, fields }) {
  const [formData, setFormData] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const date = new Date();
    const payload = { id: date, questionResponses: formData };
    try {
      await onSubmit(payload);
      setFormData([]);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleChange = (e, fieldName) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      [fieldName]: value,
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
                onChange={(e) => handleChange(e, field.name)}
                required
              >
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                name={field.name.toLowerCase()}
                className="form-control"
                value={formData[field.name.toLowerCase()] || ""}
                onChange={(e) => handleChange(e, field.name)}
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

export default InputForm;
