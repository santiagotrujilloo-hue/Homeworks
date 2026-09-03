import { useState } from 'react';

function ContactForm({ onAdd }) {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [error, setError] = useState('');

  const handleNombreChange = (e) => {
    const valor = e.target.value;
    // Solo permite letras y espacios
    if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(valor)) {
      setNombre(valor);
    }
  };

  const handleTelefonoChange = (e) => {
    const valor = e.target.value;
    // Solo permite números, máximo 10 dígitos
    if (/^[0-9]*$/.test(valor) && valor.length <= 10) {
      setTelefono(valor);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (nombre.trim() === '' || telefono.trim() === '') {
      setError('Nombre y teléfono son obligatorios');
      return;
    }

    if (telefono.length < 7) {
      setError('El teléfono debe tener al menos 7 dígitos');
      return;
    }

    onAdd({ id: Date.now(), nombre: nombre.trim(), telefono });
    setNombre('');
    setTelefono('');
    setError('');
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <input
        className={error && nombre.trim() === '' ? 'input-error' : ''}
        placeholder="Nombre"
        value={nombre}
        onChange={handleNombreChange}
      />
      <input
        className={error && telefono.trim() === '' ? 'input-error' : ''}
        placeholder="Teléfono"
        value={telefono}
        onChange={handleTelefonoChange}
      />
      {error && <p className="error-text">{error}</p>}
      <button type="submit">Agregar</button>
    </form>
  );
}

export default ContactForm;
