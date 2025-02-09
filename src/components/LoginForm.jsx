function LoginForm() {
  return (
    <form className="container mt-4">
      <div className="mb-3">
        <label className="form-label">name</label>
        <input
          type="text"
          className="form-control"
          placeholder="enter your name"
        />
      </div>
      <div className="mb-3">
        <label className="form-label">name</label>
        <input
          type="text"
          className="form-control"
          placeholder="enter your name"
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
}

export default LoginForm;
