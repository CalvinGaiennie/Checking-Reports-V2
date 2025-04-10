import NavBar from "../components/NavBar";
import GenericInputForm from "../components/GenericInputForm";
import { postData } from "../services/api.service";
import { useEffect, useReducer, useState } from "react";
import Select from "../components/Select";
import { getForms } from "../services/api.service";

const initialState = {
  currentForm: "",
  forms: [],
  formResponseName: "",
  responseInputFields: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "setCurrentForm":
      return { ...state, currentForm: action.payload };
    case "setForms":
      return { ...state, forms: action.payload };
    case "setFormResponseName":
      return { ...state, formResponseName: action.payload };
    case "setResponseInputFields":
      return { ...state, responseInputFields: action.payload };
  }
};

function Input() {
  const [state, dispatch] = useReducer(reducer, initialState);
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

  async function handleSaveFormResponse() {
    try {
      console.log("Starting Form submission process");
      if (!state.currentFormResponseName) {
        console.log("Form submission failed: Name required");
        dispatch({
          type: "setError",
          payload: "Form response name is required",
        });
        return;
      }
      if (state.responseInputFields.length === 0) {
        console.log("Form save failed: No fields");
        dispatch({
          type: "setError",
          payload: "Form must have at least one field",
        });
        return;
      }
      const payload = {
        name: state.formResponseName,
        fields: state.responseInputFields,
      };
      console.log("Attempting to save form response with payload:", payload);
      console.log("Current State:", state);

      dispatch({ type: "setResponseInputFields", payload: [] });
      dispatch({ type: "setFormResponseName", payload: "" });
      dispatch({
        type: "setUpdateMessage",
        payload: "Form response saved successfully!",
      });
      setTimeout(
        () => dispatch({ type: "setUpdateMessage", payload: "" }),
        3000
      );
    } catch (error) {
      console.error("Error saving form:", error);
      dispatch({
        type: "setError",
        payload: error.response?.data?.message || "Error saving form",
      });
    }
  }

  useEffect(() => {
    const fetchForms = async () => {
      try {
        console.log("[Input Page] Fetching forms");
        const forms = await getForms();
        console.log("[Input Page] Retrieved forms:", forms);
        dispatch({ type: "setForms", payload: forms });
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
        style={{ width: "80%" }}
        title="Selected Form"
        options={forms.map((form) => form.name)}
        value={currentForm}
        onChange={(event) =>
          dispatch({ type: "setCurrentForm", payload: event.target.value })
        }
      />
      {currentForm && (
        <div className="container d-flex flex-column align-items-center mt-5">
          <h1 className="mb-4">Input</h1>
          <GenericInputForm
            onSubmit={handleSubmit}
            fields={forms.find((form) => form.name === currentForm).fields}
          />
        </div>
      )}
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
