import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      login(await api("/auth/register", { method: "POST", body: form }));
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="card narrow" onSubmit={submit}>
      <h2>Create account</h2>
      {error && <p className="error">{error}</p>}
      <label>Full name<input required value={form.name} onChange={set("name")} /></label>
      <label>Email<input type="email" required value={form.email} onChange={set("email")} /></label>
      <label>Password<input type="password" minLength={6} required value={form.password} onChange={set("password")} /></label>
      <label>I am a
        <select value={form.role} onChange={set("role")}>
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
        </select>
      </label>
      <button>Register</button>
    </form>
  );
}
