import { useState } from "react";
import "./TaskForm.css";

const prioritiesList = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" }
];

export default function TaskForm({ initialData, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initialData ? initialData.title : "");
  const [description, setDescription] = useState(initialData ? initialData.description : "");
  const [priority, setPriority] = useState(initialData ? initialData.priority : "medium");
  const [submitting, setSubmitting] = useState(false);
  const [titleError, setTitleError] = useState("");
  const isEdit = initialData ? true : false; 
  async function handleSubmit(e) {
    e.preventDefault();
    
    if (title.trim() === "") {
      setTitleError("Title is required.");
      return;
    }
      setSubmitting(true);
    try {
      await onSubmit({ 
        title: title.trim(), 
        description: description.trim(), 
        priority: priority 
      });
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-body">
        <div className={titleError ? "form-field error" : "form-field"}>
          <label>Title *</label>
          <input
            type="text"
            className="form-input"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setTitleError("");
            }}
          />
          {titleError && <span className="error-text">{titleError}</span>}
        </div>
        <div className="form-field">
          <label>Description</label>
          <textarea
            className="form-input"
            placeholder="Add more details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
        <div className="form-field">
          <label>Priority</label>
          <div className="priority-picker">
            {prioritiesList.map((p) => (
              <button
                key={p.value}
                type="button"
                className={priority === p.value ? "priority-btn active" : "priority-btn"}
                onClick={() => setPriority(p.value)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="form-actions">
        <button type="button" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" disabled={submitting}>
          {isEdit ? "Save Changes" : "Add Task"}
        </button>
      </div>
    </form>
  );
}