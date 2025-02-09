function InputForm() {
  return (
    <form className="container mt-4">
      <div className="mb-3">
        <label className="form-label">a</label>
        <input type="text" className="form-control" placeholder="" />
      </div>
      <div className="mb-3">
        <label className="form-label">a</label>
        <input type="text" className="form-control" placeholder="" />
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
}

export default InputForm;
