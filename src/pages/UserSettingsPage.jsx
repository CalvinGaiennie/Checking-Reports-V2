import NavBar from "../components/NavBar";
import UserSettings from "../components/UserSettings";
// import AuthDebug from "../components/AuthDebug";

function UserSettingsPage() {
  return (
    <div>
      <NavBar />
      <div className="container d-flex flex-column align-items-center mt-5">
        <h1 className="mb-4">User Settings</h1>
        <UserSettings />
        {/* <AuthDebug /> */}
      </div>
    </div>
  );
}

export default UserSettingsPage;
