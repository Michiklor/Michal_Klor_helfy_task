import "./TaskFilter.css";

const filters = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "completed", label: "Completed" },
];

export default function TaskFilter({ active, onChange, counts }) {
  return (
    <div className="task-filter">
      {filters.map(({ key, label }) => (
        <button
          key={key}
          className={active === key ? "filter-tab filter-tab--active" : "filter-tab"}
          onClick={() => onChange(key)}
        >
          {label}
          <span className={active === key ? "filter-badge filter-badge--active" : "filter-badge"}>
            {counts[key]}
          </span>
        </button>
      ))}
    </div>
  );
}
