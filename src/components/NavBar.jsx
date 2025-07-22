import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function NavBar() {
  const { authState, logout } = useAuth();
  const isLoggedIn = authState.status === "logged in";
  const permissions = authState.permissions;

  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <div className="container-fluid">
        {(permissions === "viewer" ||
          permissions === "basic admin" ||
          permissions === "full admin") && (
          <Link className="navbar-brand" to="/">
            Display
          </Link>
        )}
        {(permissions === "user" ||
          permissions === "viewer" ||
          permissions === "basic admin" ||
          permissions === "full admin") && (
          <Link className="navbar-brand" to="/input">
            Input
          </Link>
        )}

        {permissions === "full admin" && (
          <Link className="navbar-brand" to="/admin">
            Admin
          </Link>
        )}
        {/* {(permissions === "user" ||
          permissions === "viewer" ||
          permissions === "basic admin" ||
          permissions === "full admin") && (
          <Link className="navbar-brand" to="/user-settings">
            User Settings
          </Link>
        )} */}
        {!isLoggedIn ? (
          <>
            <Link className="navbar-brand" to="/login">
              Login
            </Link>
            <Link className="navbar-brand" to="/create-account">
              Create Account
            </Link>
          </>
        ) : (
          <button className="btn btn-outline-danger" onClick={logout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
