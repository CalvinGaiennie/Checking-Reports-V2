import { useState } from "react";

function GenericInputForm({ onSubmit, initialData, fields }) {
  const [formData, setFormData] = useState(
    initialData || {
      type: "bar",
      name: "",
      input: "items",
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const transformedData = fields.reduce((acc, field) => {
        const serverKey = field.name.toLowerCase();
        acc[serverKey] = formData[serverKey];
        return acc;
      }, {});

      await onSubmit(transformedData);
      setFormData(initialData || { type: "bar", name: "", input: "items" });
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
        {fields.map((field) => (
          <div key={field.name}>
            <label className="form-label">
              {field.name.charAt(0).toUpperCase() + field.name.slice(1)}
            </label>
            {field.type === "select" ? (
              <select
                name={field.name.toLowerCase()}
                className="form-control"
                value={formData[field.name.toLowerCase()] || ""}
                onChange={handleChange}
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

export default GenericInputForm;
