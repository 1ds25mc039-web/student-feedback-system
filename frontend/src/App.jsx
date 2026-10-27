import { Link, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import StudentHome from "./pages/StudentHome.jsx";
import AdminView from "./pages/AdminView.jsx";

function Protected({ roles, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const { user, logout } = useAuth();
  const home = !user ? "/login" : user.role === "student" ? "/student" : "/admin";

  return (
    <>
      <nav className="nav">
        <strong>Student Feedback</strong>
        <span className="spacer" />
        {user ? (
          <>
            <span>{user.name} ({user.role})</span>
            <button className="ghost" onClick={logout}>Log out</button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to={home} replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/student" element={<Protected roles={["student"]}><StudentHome /></Protected>} />
          <Route path="/admin" element={<Protected roles={["faculty", "admin"]}><AdminView /></Protected>} />
        </Routes>
      </main>
    </>
  );
}
