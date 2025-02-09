import InputForm from "../components/InputForm";
import NavBar from "../components/NavBar";

function Input() {
  return (
    <div>
      <NavBar />
      <div className="container d-flex flex-column align-items-center mt-5">
        <h1 className="mb-4">Input</h1>
        <InputForm />
      </div>
    </div>
  );
}

export default Input;
