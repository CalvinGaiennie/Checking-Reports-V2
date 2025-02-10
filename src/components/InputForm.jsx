import { useState } from "react";
import { postData } from "../services/api.service";

function InputForm() {
  const [formData, setFormData] = useState({
    name: "",
    value: "",
    category: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postData(formData);
      // Reset form
      setFormData({ name: "", value: "", category: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form className="container mt-4" onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Name</label>
        <input
          type="text"
          name="name"
          className="form-control"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Value</label>
        <input
          type="number"
          name="value"
          className="form-control"
          value={formData.value}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Category</label>
        <input
          type="text"
          name="category"
          className="form-control"
          value={formData.category}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
}

export default InputForm;
