import LoginForm from "../components/LoginForm";
import NavBar from "../components/NavBar";

function Login() {
  return (
    <div>
      <NavBar />
      <div className="container d-flex flex-column align-items-center mt-5">
        <h1 className="mb-4">Login</h1>
        <p>Here&apos;s an admin login to test the app with:</p>
        <div className="d-flex flex-row align-items-center gap-3">
          <p>
            <strong>Username:</strong> TestAdmin
          </p>
          <p>
            <strong>Password:</strong> TestAdmin
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
