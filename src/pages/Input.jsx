import NavBar from "../components/NavBar";
import GenericInputForm from "../components/GenericInputForm";
import { postData } from "../services/api.service";
import { useEffect, useState } from "react";
import Select from "../components/Select";
import { getForms } from "../services/api.service";

function Input() {
  const [currentForm, setCurrentForm] = useState("");
  const [forms, setForms] = useState([]);
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

  useEffect(() => {
    const fetchForms = async () => {
      try {
        console.log("[Input Page] Fetching forms");
        const forms = await getForms();
        console.log("[Input Page] Retrieved forms:", forms);
        setForms(forms);
      } catch (error) {
        console.error("[Input Page] Error fetching forms:", error);
      }
    };
    fetchForms();
  }, []);
  return (
    <div>
      <NavBar />
      <Select
        className="text-center mx-4 px-3"
        title="Selected Form"
        options={forms.map((form) => form.name)}
        value={currentForm}
        onChange={(event) => setCurrentForm(event.target.value)}
      />
      <h1 className="text-center">
        I have the user input forms rendering here but the currently do not
        submit properly
      </h1>
      {currentForm && (
        <div className="container d-flex flex-column align-items-center mt-5">
          <h1 className="mb-4">Input</h1>
          <GenericInputForm
            onSubmit={handleSubmit}
            fields={forms.find((form) => form.name === currentForm).fields}
          />
        </div>
      )}
      <h1 className="text-center">Hardcoded one that actually works</h1>
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
