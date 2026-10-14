import { Button, Modal } from "react-bootstrap";

function DeleteTaskModal({ task, onConfirm, onClose, deleting }) {
  return (
    <Modal show onHide={onClose} centered size="sm" contentClassName="paper-modal">
      <Modal.Body className="text-center p-4">
        <span className="stamp stamp--danger mb-3">Borrar</span>
        <p className="mb-1">¿Eliminar esta entrada?</p>
        <strong className="d-block mb-4">“{task.title}”</strong>

        <div className="d-flex gap-2 justify-content-center">
          <Button variant="outline-dark" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={() => onConfirm(task.id)} disabled={deleting}>
            Sí, borrar
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default DeleteTaskModal;
