import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Display from "./pages/Display";
import Input from "./pages/Input";
import Login from "./pages/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import CreateAccount from "./pages/CreateAccount";
import AdminPage from "./pages/AdminPage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute
                element={<Display />}
                allowedPermissions={["viewer", "basic admin", "full admin"]}
              />
            }
          />
          <Route path="/input" element={<Input />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute
                element={<AdminPage />}
                allowedPermissions={["full admin"]}
              />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
