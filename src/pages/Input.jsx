import NavBar from "../components/NavBar";
import InputForm from "../components/InputForm";
import { postFormResponse } from "../services/api.service";
import { useEffect, useReducer } from "react";
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

  const handleSubmit = async (formData) => {
    try {
      // Add the form name to the data before sending
      const dataWithFormName = {
        ...formData,
        formName: state.currentForm,
      };

      await postFormResponse(dataWithFormName);
    } catch (error) {
      console.error("Form submission error:", error);
      // Optionally add user feedback here
    }
  };

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const forms = await getForms();
        dispatch({ type: "setForms", payload: forms });

        // Auto-select the first form if available
        if (forms && forms.length > 0) {
          dispatch({ type: "setCurrentForm", payload: forms[0].name });
          console.log("FORM SELECTED", `${forms[0].name}`);
        }
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
        options={state.forms.map((form) => form.name)}
        value={state.currentForm}
        onChange={(event) =>
          dispatch({ type: "setCurrentForm", payload: event.target.value })
        }
      />
      {state.currentForm && (
        <div className="container d-flex flex-column align-items-center mt-5">
          <h1 className="mb-4">Input</h1>
          <InputForm
            onSubmit={handleSubmit}
            fields={
              state.forms.find((form) => form.name === state.currentForm).fields
            }
          />
        </div>
      )}
    </div>
  );
}

export default Input;
