import { useEffect, useState } from "react";
import { api } from "../api.js";

export default function AdminView() {
  const [summary, setSummary] = useState([]);
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    api("/feedback/summary").then(setSummary);
    api("/feedback").then(setList);
  }, []);

  const shown = filter ? list.filter((f) => f.course?.code === filter) : list;

  return (
    <>
      <section className="card">
        <h2>Average rating by course</h2>
        {summary.length === 0 && <p>No feedback has been submitted yet.</p>}
        {summary.map((s) => (
          <div className="row" key={s.code}>
            <div><strong>{s.code}</strong> - {s.name}<div className="muted">{s.count} response(s)</div></div>
            <div className="bar"><span style={{ width: `${(s.avg / 5) * 100}%` }} /></div>
            <span className="badge">{s.avg}</span>
          </div>
        ))}
      </section>

      <section className="card">
        <h2>All feedback</h2>
        <label>Filter by course
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All courses</option>
            {summary.map((s) => <option key={s.code} value={s.code}>{s.code}</option>)}
          </select>
        </label>
        {shown.map((f) => (
          <div className="row" key={f._id}>
            <div>
              <strong>{f.course?.code}</strong>
              <div>{f.comments || <em className="muted">No comments</em>}</div>
              <div className="muted">{new Date(f.createdAt).toLocaleString()}</div>
            </div>
            <span className="badge">{f.rating} / 5</span>
          </div>
        ))}
      </section>
    </>
  );
}
