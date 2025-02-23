import NavBar from "../components/NavBar";
import GenericInputForm from "../components/GenericInputForm";
import { postData } from "../services/api.service";

function Input() {
  const handleSubmit = async (formData) => {
    try {
      // Ensure data is properly formatted before sending
      const payload = {
        name: formData.name.trim(),
        value: formData.value.trim(),
        category: formData.category.trim(),
      };
      await postData(payload);
    } catch (error) {
      console.error("Form submission error:", error);
      // Optionally add user feedback here
    }
  };

  return (
    <div>
      <NavBar />
      <div className="container d-flex flex-column align-items-center mt-5">
        <h1 className="mb-4">Input</h1>
        <GenericInputForm
          onSubmit={handleSubmit}
          fields={[
            { type: "text", name: "name", input: "text" },
            { type: "number", name: "value", input: "text" },
            { type: "text", name: "category", input: "text" },
          ]}
        />
      </div>
    </div>
  );
}

export default Input;
