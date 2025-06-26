import GenericInputForm from "./GenericInputForm";
import Select from "./Select";

function CreateNewForm({
  state,
  createForm,
  handleInputTitleChange,
  handleInputTypeChange,
  handleInputAdd,
  handleSaveForm,
  dispatch,
  handleRemoveOption,
  handleAddInputOption,
}) {
  return (
    <div className="mb-5">
      <div className="mb-5 border rounded p-4">
        <h2>Create New Form</h2>
        <hr />
        <div className="container">
          <h2>Form Name</h2>
          <input
            className="form-control"
            onChange={(e) =>
              dispatch({
                type: "setinProgressFormName",
                payload: e.target.value,
              })
            }
          />
        </div>
        <GenericInputForm
          parentName="create new form"
          key={`${state.formKey} i`}
          onSubmit={createForm}
          fields={state.inputFields}
          state={state}
        />
        <button onClick={() => handleSaveForm()}>Save Form</button>
      </div>
      <div className="mb-5 border rounded p-4">
        <h3>Add New Input</h3>
        <hr />
        <h3>Input Title</h3>
        <input
          className="form-control mb-2"
          onChange={handleInputTitleChange}
          value={state.inputTitle}
        />
        <Select
          title="Input Type"
          onChange={handleInputTypeChange}
          value={state.inputType}
          options={["input", "select"]}
        />
        <div>
          {state.inputType === "select" && (
            <>
              {state.inputOptions.map((_, index) => (
                <div key={`${state.formKey}option${index}`}>
                  <h4 className="mt-2">Option {index + 1}</h4>
                  <div className="d-flex align-items-center gap-2">
                    <input
                      className="form-control mb-4"
                      value={state.inputOptions[index]?.text || ""}
                      onChange={(e) => {
                        const newOptions = [...state.inputOptions];
                        newOptions[index] = {
                          ...newOptions[index],
                          text: e.target.value,
                        };
                        dispatch({
                          type: "setInputOptions",
                          payload: newOptions,
                        });
                      }}
                    />
                    <button
                      className="btn btn-danger mb-4"
                      style={{ height: "38px" }}
                      onClick={() => handleRemoveOption(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                className="btn btn-secondary"
                onClick={() => handleAddInputOption(state.inputOptions.length)}
              >
                Add Another Option
              </button>
            </>
          )}
        </div>
        <button className="mt-4" onClick={handleInputAdd}>
          Add
        </button>
      </div>
    </div>
  );
}

export default CreateNewForm;
