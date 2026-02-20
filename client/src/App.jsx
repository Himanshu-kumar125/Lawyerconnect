import { Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import Lawyers from "./pages/Lawyers";
import LawyerDetails from "./pages/LawyerDetails";
import Appointments from "./pages/Appointments";
import RegisterLawyer from "./pages/RegisterLawyer";
import Admin from "./pages/Admin";
import Login from "./pages/Login";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

function App() {
  return (
    <div>
      <nav
        style={{
          padding: "15px",
          background: "#eee",
          display: "flex",
          gap: "20px",
        }}
      >
        <Link to="/">Home</Link>
        <Link to="/lawyers">Lawyers</Link>
        <Link to="/appointments">My Appointments</Link>
        <Link to="/login">Login</Link>
        <Link to="/admin">Admin</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/lawyers" element={<Lawyers />} />
        <Route path="/lawyer/:id" element={<LawyerDetails />} />

        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <Appointments />
            </ProtectedRoute>
          }
        />

        <Route path="/register-lawyer" element={<RegisterLawyer />} />

        <Route
          path="/admin"
          element={
            <RoleRoute allowedRole="admin">
              <Admin />
            </RoleRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
