import { useState } from "react";
import "./TaskItem.css";

const priorityMap = {
  high: { label: "High", cls: "priority--high" },
  medium: { label: "Medium", cls: "priority--medium" },
  low: { label: "Low", cls: "priority--low" },
};

export default function TaskItem({ task, onToggle, onDelete, onEdit, onBusyChange }) {
  const [confirming, setConfirming] = useState(false);
  const [confirmingToggle, setConfirmingToggle] = useState(false);
  const [busy, setBusy] = useState(false);

  const p = priorityMap[task.priority] || priorityMap.medium;

  const createdAt = new Date(task.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  function setConfirmingWithNotify(val) {
    setConfirming(val);
    onBusyChange && onBusyChange(val);
  }

  function setConfirmingToggleWithNotify(val) {
    setConfirmingToggle(val);
    onBusyChange && onBusyChange(val);
  }

  async function handleToggle() {
    setBusy(true);
    await onToggle(task.id);
    setBusy(false);
    setConfirmingToggleWithNotify(false);
  }

  async function handleDelete() {
    if (!confirming) {
      setConfirmingWithNotify(true);
      return;
    }
    setBusy(true);
    onBusyChange && onBusyChange(false);
    await onDelete(task.id);
  }

  return (
    <article className={task.completed ? "task-card task-card--done" : "task-card"}>
      <div className={`task-stripe ${p.cls}`} />

      <div className="task-body">
        <div className="task-top">
          <button
            className={task.completed ? "task-check task-check--checked" : "task-check"}
            onClick={() => setConfirmingToggleWithNotify(true)}
            disabled={busy}
          >
            {task.completed && (
              <svg viewBox="0 0 12 10" fill="none">
                <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>

          <h3 className="task-title">{task.title}</h3>

          <span className={`priority-badge ${p.cls}`}>{p.label}</span>
        </div>

        {confirmingToggle && (
          <div className="toggle-popup">
            <span>{task.completed ? "Mark as incomplete?" : "Mark as completed?"}</span>
            <button className="popup-btn popup-btn--yes" onClick={handleToggle} disabled={busy}>Yes</button>
            <button className="popup-btn popup-btn--no" onClick={() => setConfirmingToggleWithNotify(false)} disabled={busy}>No</button>
          </div>
        )}

        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        <div className="task-footer">
          <span className="task-date">{createdAt}</span>

          <div className="task-actions">
            <button
              className="task-action-btn task-action-btn--edit"
              onClick={() => onEdit(task)}
              disabled={busy}
              title="Edit"
            >
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M11.5 2.5a1.414 1.414 0 0 1 2 2L5 13H3v-2L11.5 2.5z"
                      stroke="currentColor" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {confirming ? (
              <div className="confirm-row">
                <span className="confirm-text">Delete?</span>
                <button className="task-action-btn task-action-btn--confirm-yes" onClick={handleDelete} disabled={busy}>Yes</button>
                <button className="task-action-btn task-action-btn--confirm-no" onClick={() => setConfirmingWithNotify(false)} disabled={busy}>No</button>
              </div>
            ) : (
              <button
                className="task-action-btn task-action-btn--delete"
                onClick={handleDelete}
                disabled={busy}
                title="Delete"
              >
                <svg viewBox="0 0 16 16" fill="none">
                  <path d="M3 4h10M6 4V3h4v1M5 4l.5 9h5L11 4"
                        stroke="currentColor" strokeWidth="1.5"
                        strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
