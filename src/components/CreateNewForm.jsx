import GenericInputForm from "./GenericInputForm";
import Select from "./Select";

function CreateNewForm({
  state,
  createForm,
  handleInputTitleChange,
  handleInputTypeChange,
  handleAddInputOption,
  handleInputAdd,
  dispatch,
}) {
  return (
    <div className="mb-5">
      <h2>Create New Form</h2>
      <hr></hr>
      <GenericInputForm
        key={`${state.formKey} i`}
        onSubmit={createForm}
        fields={state.inputFields}
      />
      <h3>Add New Input</h3>
      <hr></hr>
      <h3>Input Title</h3>
      <input className="form-control" onChange={handleInputTitleChange} />
      <Select
        title="Input Type"
        onChange={handleInputTypeChange}
        value={state.inputType}
        options={["input", "select"]}
      />
      {state.inputType === "select" && (
        <>
          {state.formOptionNumber.map((_, index) => (
            <div key={`${state.formKey}option${index}`}>
              <h3>Option {index + 1}</h3>
              <input
                className="form-control mb-4"
                onChange={(e) => handleAddInputOption(e)}
              />
            </div>
          ))}
          <button
            className="btn btn-secondary"
            onClick={() =>
              dispatch({
                type: "setFormOptionNumber",
                payload: [
                  ...state.formOptionNumber,
                  state.formOptionNumber.length,
                ],
              })
            }
          >
            Add Another Option
          </button>
        </>
      )}
      <button className="mt-4" onClick={handleInputAdd}>
        Add
      </button>
    </div>
  );
}

export default CreateNewForm;
