import { Button } from "react-bootstrap";

const formatDate = (ts) =>
  ts?.toDate
    ? ts.toDate().toLocaleDateString("es-CO", { day: "2-digit", month: "short" })
    : "ahora";

function TaskRow({ task, index, onToggle, onEdit, onDelete, disabled }) {
  return (
    <li className={`task-row task-row--${task.priority} ${task.done ? "is-done" : ""}`}>
      <span className="task-row__index mono">{String(index + 1).padStart(2, "0")}</span>

      <button
        type="button"
        className="task-check"
        onClick={() => onToggle(task)}
        disabled={disabled}
        aria-pressed={task.done}
        aria-label={task.done ? "Marcar como pendiente" : "Marcar como hecha"}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12.5l4.2 4.2L19 7" />
        </svg>
      </button>

      <div className="task-row__body">
        <h3>{task.title}</h3>
        {task.notes && <p>{task.notes}</p>}
        <div className="task-row__meta mono">
          <span className={`tag tag--${task.priority}`}>{task.priority}</span>
          <span>{formatDate(task.createdAt)}</span>
          <span>{task.done ? "hecha" : "pendiente"}</span>
        </div>
      </div>

      <div className="task-row__actions">
        <Button variant="link" size="sm" onClick={() => onEdit(task)} disabled={disabled}>
          Editar
        </Button>
        <Button
          variant="link"
          size="sm"
          className="text-danger"
          onClick={() => onDelete(task)}
          disabled={disabled}
        >
          Borrar
        </Button>
      </div>
    </li>
  );
}

export default TaskRow;
