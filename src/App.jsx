import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Display from "./pages/Display";
import Input from "./pages/Input";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Display />} />
        <Route path="/input" element={<Input />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
