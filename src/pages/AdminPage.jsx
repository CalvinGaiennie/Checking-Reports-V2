import NavBar from "../components/NavBar";
import Admin from "../components/Admin";

function AdminPage() {
  return (
    <div>
      <NavBar />
      <div className="container d-flex flex-column align-items-center mt-5">
        <h1 className="mb-4">Admin</h1>
        <Admin />
      </div>
    </div>
  );
}

export default AdminPage;
