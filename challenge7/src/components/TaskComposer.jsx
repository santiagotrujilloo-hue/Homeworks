import { useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import useTasks from "../hooks/useTasks";
import { PRIORITIES } from "./priorities";

const EMPTY = { title: "", notes: "", priority: "media" };

function TaskComposer() {
  const { createTask, isPending } = useTasks();
  const [form, setForm] = useState(EMPTY);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    await createTask(form);
    setForm(EMPTY);
  };

  return (
    <Form className="composer" onSubmit={handleSubmit}>
      <span className="composer__label mono">Nueva entrada</span>

      <Form.Control
        className="composer__title"
        name="title"
        placeholder="¿Qué hay que hacer?"
        value={form.title}
        onChange={handleChange}
        aria-label="Título de la tarea"
        maxLength={120}
      />

      <Form.Control
        as="textarea"
        rows={2}
        className="composer__notes"
        name="notes"
        placeholder="Notas (opcional)"
        value={form.notes}
        onChange={handleChange}
        aria-label="Notas"
        maxLength={400}
      />

      <div className="composer__footer">
        <div className="priority-picker" role="radiogroup" aria-label="Prioridad">
          {PRIORITIES.map((p) => (
            <Form.Check
              key={p.value}
              inline
              type="radio"
              id={`new-${p.value}`}
              name="priority"
              value={p.value}
              label={p.label}
              checked={form.priority === p.value}
              onChange={handleChange}
              className={`priority-option priority-option--${p.value}`}
            />
          ))}
        </div>

        <Button type="submit" className="btn-ink" disabled={isPending || !form.title.trim()}>
          {isPending ? <Spinner size="sm" animation="border" /> : "Anotar"}
        </Button>
      </div>
    </Form>
  );
}

export default TaskComposer;
