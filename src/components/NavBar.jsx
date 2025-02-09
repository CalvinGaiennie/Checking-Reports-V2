import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Display
        </Link>
        <br></br>
        <Link className="navbar-brand" to="/input">
          Input
        </Link>
        <br></br>
        <Link className="navbar-brand" to="/login">
          Login
        </Link>
      </div>
    </nav>
  );
}

export default NavBar;
