import NavBar from "../components/NavBar";
import CreateAccountForm from "../components/CreateAccountForm";
function CreateAccount() {
  return (
    <div>
      <NavBar />
      <div className="container d-flex flex-column align-items-center mt-5">
        <h1 className="mb-4">Create Account</h1>
        <CreateAccountForm />
      </div>
    </div>
  );
}

export default CreateAccount;
