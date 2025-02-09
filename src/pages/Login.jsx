import LoginForm from "../components/LoginForm";
import NavBar from "../components/NavBar";

function Login() {
  return (
    <div>
      <NavBar />
      <div className="container d-flex flex-column align-items-center mt-5">
        <h1 className="mb-4">Login</h1>
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
