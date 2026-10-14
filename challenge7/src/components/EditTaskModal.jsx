import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { PRIORITIES } from "./priorities";

// Se monta con key={task.id}, así el formulario arranca con los datos de la tarea
function EditTaskModal({ task, onSave, onClose, saving }) {
  const [form, setForm] = useState({
    title: task.title,
    notes: task.notes ?? "",
    priority: task.priority ?? "media",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave(task.id, form);
  };

  return (
    <Modal show onHide={onClose} centered contentClassName="paper-modal">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Editar entrada</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3" controlId="edit-title">
            <Form.Label>Título</Form.Label>
            <Form.Control name="title" value={form.title} onChange={handleChange} maxLength={120} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="edit-notes">
            <Form.Label>Notas</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="notes"
              value={form.notes}
              onChange={handleChange}
              maxLength={400}
            />
          </Form.Group>

          <Form.Group controlId="edit-priority">
            <Form.Label>Prioridad</Form.Label>
            <Form.Select name="priority" value={form.priority} onChange={handleChange}>
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-dark" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" className="btn-ink" disabled={saving || !form.title.trim()}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default EditTaskModal;
