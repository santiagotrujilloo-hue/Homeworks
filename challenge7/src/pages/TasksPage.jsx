import { useState } from "react";
import { Alert, Nav, ProgressBar, Spinner } from "react-bootstrap";
import useAuth from "../hooks/useAuth";
import useTasks from "../hooks/useTasks";
import TaskComposer from "../components/TaskComposer";
import TaskRow from "../components/TaskRow";
import EditTaskModal from "../components/EditTaskModal";
import DeleteTaskModal from "../components/DeleteTaskModal";

const FILTERS = {
  todas: () => true,
  pendientes: (t) => !t.done,
  hechas: (t) => t.done,
};

const today = new Date().toLocaleDateString("es-CO", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

function TasksPage() {
  const { user } = useAuth();
  const { tasks, stats, isPending, error, editTask, toggleTask, deleteTask } = useTasks();

  const [filter, setFilter] = useState("todas");
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const visible = tasks.filter(FILTERS[filter]);
  const firstName = (user?.displayName || "").split(" ")[0];

  const handleSave = async (id, data) => {
    if (await editTask(id, data)) setEditing(null);
  };

  const handleDelete = async (id) => {
    if (await deleteTask(id)) setDeleting(null);
  };

  return (
    <>
      <header className="page-head">
        <div>
          <span className="mono page-head__date">{today}</span>
          <h1>{firstName ? `Hola, ${firstName}.` : "Tu bitácora."}</h1>
        </div>

        <dl className="tally">
          <div>
            <dt>Pendientes</dt>
            <dd>{stats.pending}</dd>
          </div>
          <div>
            <dt>Hechas</dt>
            <dd>{stats.done}</dd>
          </div>
          <div>
            <dt>Avance</dt>
            <dd>{stats.percent}%</dd>
          </div>
        </dl>
      </header>

      <ProgressBar now={stats.percent} className="ledger-progress mb-4" aria-label="Avance" />

      <div className="row g-4">
        <aside className="col-lg-4">
          <TaskComposer />
        </aside>

        <section className="col-lg-8">
          <div className="list-head">
            <Nav variant="underline" activeKey={filter} onSelect={(k) => setFilter(k)}>
              {Object.keys(FILTERS).map((key) => (
                <Nav.Item key={key}>
                  <Nav.Link eventKey={key} className="text-capitalize">
                    {key}
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
            {isPending && <Spinner size="sm" animation="border" variant="primary" />}
          </div>

          {error && <Alert variant="danger">No se pudo hablar con Firestore: {error}</Alert>}

          {visible.length === 0 ? (
            <div className="empty-page">
              <p className="mono">
                {tasks.length === 0
                  ? "Página en blanco. Anota tu primera tarea."
                  : `No hay tareas ${filter}.`}
              </p>
            </div>
          ) : (
            <ol className="ledger">
              {visible.map((task, i) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  index={i}
                  disabled={isPending}
                  onToggle={toggleTask}
                  onEdit={setEditing}
                  onDelete={setDeleting}
                />
              ))}
            </ol>
          )}
        </section>
      </div>

      {editing && (
        <EditTaskModal
          key={editing.id}
          task={editing}
          saving={isPending}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}

      {deleting && (
        <DeleteTaskModal
          task={deleting}
          deleting={isPending}
          onConfirm={handleDelete}
          onClose={() => setDeleting(null)}
        />
      )}
    </>
  );
}

export default TasksPage;
