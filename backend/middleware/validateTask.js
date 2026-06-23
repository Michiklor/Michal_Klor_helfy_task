function validateTask(req, res, next) {
  const { title, priority } = req.body;
  const allowedPriorities = ["low", "medium", "high"];

  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ message: "Title is required" });
  }

  if (priority !== undefined && !allowedPriorities.includes(priority)) {
    return res.status(400).json({ message: "Priority must be low, medium, or high" });
  }

  next();
}

module.exports = validateTask;
