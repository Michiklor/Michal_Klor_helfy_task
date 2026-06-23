import { useState, useEffect, useRef } from "react";
import TaskItem from "./TaskItem";
import "./TaskList.css";

const CARD_WIDTH = 300;
const GAP = 16;

export default function TaskList({ tasks, onToggle, onDelete, onEdit, isModalOpen }) {
  const [index, setIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const autoRef = useRef(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    if (tasks.length === 0) return;
    if (index >= tasks.length) setIndex(0);
  }, [tasks.length]);

  useEffect(() => {
    if (tasks.length <= 1) return;
    autoRef.current = setInterval(() => {
      if (!pausedRef.current) goNext();
    }, 3500);
    return () => clearInterval(autoRef.current);
  }, [tasks.length, index]);

  function goNext() {
    if (transitioning) return;
    setIndex((prev) => (prev + 1) % tasks.length);
  }

  function goPrev() {
    if (transitioning) return;
    setIndex((prev) => (prev - 1 + tasks.length) % tasks.length);
  }

  function resetAuto() {
    clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      if (!pausedRef.current) goNext();
    }, 3500);
  }

  function handlePrev() {
    goPrev();
    resetAuto();
  }

  function handleNext() {
    goNext();
    resetAuto();
  }

  function handleItemBusyChange(isBusy) {
    pausedRef.current = isBusy;
  }

  useEffect(() => {
    if (isModalOpen) {
      pausedRef.current = true;
    } else {
      pausedRef.current = false;
    }
  }, [isModalOpen]);

  if (tasks.length === 0) {
    return (
      <div className="carousel-empty">
        <p>No tasks here.</p>
      </div>
    );
  }

  if (tasks.length === 1) {
    return (
      <div className="carousel-single">
        <TaskItem task={tasks[0]} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
      </div>
    );
  }

  const visible = [];
  for (let i = -1; i <= 1; i++) {
    const idx = (index + i + tasks.length) % tasks.length;
    visible.push({ task: tasks[idx], offset: i });
  }

  return (
    <div className="carousel">
      <button className="carousel-btn carousel-btn--prev" onClick={handlePrev}>&#8249;</button>

      <div className="carousel-window">
        {visible.map(({ task, offset }) => (
          <div
            key={task.id + "-" + offset}
            className={`carousel-card-wrap ${offset === 0 ? "active" : "side"}`}
            style={{ transform: `translateX(${offset * (CARD_WIDTH + GAP)}px)` }}
          >
            <TaskItem task={task} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} onBusyChange={handleItemBusyChange} />
          </div>
        ))}
      </div>

      <button className="carousel-btn carousel-btn--next" onClick={handleNext}>&#8250;</button>

      <div className="carousel-dots">
        {tasks.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot${i === index ? " carousel-dot--active" : ""}`}
            onClick={() => { setIndex(i); resetAuto(); }}
          />
        ))}
      </div>

      <div className="carousel-counter">{index + 1} / {tasks.length}</div>
    </div>
  );
}
