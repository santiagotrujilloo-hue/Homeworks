function ContactList({ contactos, onDelete }) {
  if (contactos.length === 0) {
    return <p className="empty-message">No hay contactos registrados.</p>;
  }

  return (
    <ul className="contact-list">
      {contactos.map((contacto) => (
        <li className="contact-item" key={contacto.id}>
          <div className="contact-info">
            <span className="contact-name">{contacto.nombre}</span>
            <span className="contact-phone">{contacto.telefono}</span>
          </div>
          <button className="delete-btn" onClick={() => onDelete(contacto.id)}>
            Eliminar
          </button>
        </li>
      ))}
    </ul>
  );
}

export default ContactList;
