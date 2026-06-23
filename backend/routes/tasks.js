const express = require("express");
const router = express.Router();

let tasks = [];
let nextId = 1;

const allowedPriorities = ["low", "medium", "high"];


router.get("/", (req, res) => {
  res.json(tasks);
});


router.post("/", (req, res) => {
  const { title, description, priority } = req.body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ message: "Title is required" });
  }

  if (priority && !allowedPriorities.includes(priority)) {
    return res.status(400).json({ message: "Invalid priority value" });
  }

  const newTask = {
    id: nextId++,
    title: title.trim(),
    description: description ? description.trim() : "",
    completed: false,
    createdAt: new Date(),
    priority: priority || "medium",
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});


router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const { title, description, priority } = req.body;

  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({ message: "Invalid title" });
    }
    task.title = title.trim();
  }

  if (description !== undefined) {
    task.description = description.trim();
  }

  if (priority !== undefined) {
    if (!allowedPriorities.includes(priority)) {
      return res.status(400).json({ message: "Invalid priority" });
    }
    task.priority = priority;
  }

  res.json(task);
});


router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  const deleted = tasks.splice(index, 1)[0];

  res.json({ message: "deleted", task: deleted });
});


router.patch("/:id/toggle", (req, res) => {
  const id = Number(req.params.id);

  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  task.completed = !task.completed;

  res.json(task);
});

module.exports = router;