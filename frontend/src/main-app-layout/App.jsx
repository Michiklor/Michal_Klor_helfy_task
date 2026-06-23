import { useEffect, useState } from "react";
import { getTasks, createTask, updateTask, deleteTask, toggleTask } from "../services/taskService";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import TaskFilter from "../components/TaskFilter";
import "./App.css";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);

  async function loadTasks() {
    try {
      setError(null);
      const data = await getTasks();
      setTasks(data);
    } catch {
      setError("Failed to load tasks. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreate = async (data) => {
    try {
      const newTask = await createTask(data);
      setTasks((prev) => [...prev, newTask]);
      setShowForm(false);
      setFilter("all");
    } catch {
      setError("Failed to create task.");
    }
  };
  const handleUpdate = async (id, data) => {
    try {
      const updated = await updateTask(id, data);
      if (updated && updated.id) {
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      }
      setEditingTask(null);
      setShowForm(false);
    } catch {
      setError("Failed to update task.");
    }
  };
  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setError("Failed to delete task.");
    }
  };

  const handleToggle = async (id) => {
    try {
      const updated = await toggleTask(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch {
      setError("Failed to update task.");
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "completed") return t.completed;
    if (filter === "pending") return !t.completed;
    return true;
  });

  const counts = {
    all: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-logo">
          </div>
          <button
            className="btn-primary"
            onClick={() => {
              setEditingTask(null);
              setShowForm(true);
            }}
          >
            <span className="btn-icon">+</span>
            New Task
          </button>
        </div>
      </header>
      <main className="app-main">
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-value">{counts.all}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value stat-value--success">{counts.completed}</span>
            <span className="stat-label">Done</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value stat-value--accent">{counts.pending}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
        <TaskFilter active={filter} onChange={setFilter} counts={counts} />
        {error && (
          <div className="error-banner">
            <span>⚠ {error}</span>
            <button onClick={() => setError(null)} className="error-close">✕</button>
          </div>
        )}
        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading tasks…</p>
          </div>
        ) : (
          <TaskList
            tasks={filteredTasks}
            onToggle={handleToggle}
            onDelete={handleDelete}
            isModalOpen={showForm}
            onEdit={(task) => {
              setEditingTask(task);
              setShowForm(true);
            }}
          />
        )}
      </main>
      {showForm && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowForm(false);
              setEditingTask(null);
            }
          }}
        >
          <div className="modal">
            <div className="modal-header">
              <h2>{editingTask ? "Edit Task" : "New Task"}</h2>
              <button
                className="modal-close"
                onClick={() => {
                  setShowForm(false);
                  setEditingTask(null);
                }}
              >
                ✕
              </button>
            </div>
            <TaskForm
              initialData={editingTask}
              onSubmit={editingTask
                ? (data) => handleUpdate(editingTask.id, data)
                : handleCreate
              }
              onCancel={() => {
                setShowForm(false);
                setEditingTask(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
