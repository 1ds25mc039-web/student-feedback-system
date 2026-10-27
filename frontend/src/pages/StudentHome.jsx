import { useEffect, useState } from "react";
import { api } from "../api.js";

// Reusable star rating control
function Stars({ value, onChange }) {
  return (
    <div className="stars" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button type="button" key={n} className={n <= value ? "star on" : "star"} onClick={() => onChange(n)} aria-label={`${n} star${n > 1 ? "s" : ""}`}>
          ★
        </button>
      ))}
    </div>
  );
}

export default function StudentHome() {
  const [courses, setCourses] = useState([]);
  const [mine, setMine] = useState([]);
  const [course, setCourse] = useState("");
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });

  const load = async () => {
    setCourses(await api("/courses"));
    setMine(await api("/feedback/mine"));
  };
  useEffect(() => { load(); }, []);

  const submitted = new Set(mine.map((f) => f.course?._id));

  const submit = async (e) => {
    e.preventDefault();
    if (!course) return setMsg({ type: "error", text: "Select a course first" });
    if (!rating) return setMsg({ type: "error", text: "Pick a star rating" });
    try {
      await api("/feedback", { method: "POST", body: { course, rating, comments } });
      setMsg({ type: "ok", text: "Feedback submitted. Thank you!" });
      setCourse(""); setRating(0); setComments("");
      load();
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    }
  };

  return (
    <div className="grid">
      <form className="card" onSubmit={submit}>
        <h2>Give feedback</h2>
        {msg.text && <p className={msg.type === "ok" ? "ok" : "error"}>{msg.text}</p>}
        <label>Course
          <select value={course} onChange={(e) => setCourse(e.target.value)}>
            <option value="">Select a course</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id} disabled={submitted.has(c._id)}>
                {c.code} - {c.name}{submitted.has(c._id) ? " (done)" : ""}
              </option>
            ))}
          </select>
        </label>
        <label>Rating</label>
        <Stars value={rating} onChange={setRating} />
        <label>Comments
          <textarea rows={4} maxLength={500} value={comments} onChange={(e) => setComments(e.target.value)} placeholder="What worked well? What could improve?" />
        </label>
        <button>Submit feedback</button>
      </form>

      <section className="card">
        <h2>Your submissions</h2>
        {mine.length === 0 && <p>You have not submitted any feedback yet.</p>}
        {mine.map((f) => (
          <div className="row" key={f._id}>
            <div>
              <strong>{f.course?.code}</strong> - {f.course?.name}
              <div className="muted">{f.comments || "No comments"}</div>
            </div>
            <span className="badge">{f.rating} / 5</span>
          </div>
        ))}
      </section>
    </div>
  );
}
