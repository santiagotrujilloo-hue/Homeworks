import { useState, useEffect } from 'react';
import Loader from './components/Loader';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';
import './App.css';

const contactosIniciales = [
  { id: 1, nombre: 'Ana', telefono: '3001234567' },
  { id: 2, nombre: 'Carlos', telefono: '3119876543' },
];

function App() {
  const [contactos, setContactos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setContactos(contactosIniciales);
      setCargando(false);
    }, 1500);
  }, []);

  const agregarContacto = (contacto) => {
    setContactos((prev) => [...prev, contacto]);
  };

  const eliminarContacto = (id) => {
    setContactos((prev) => prev.filter((c) => c.id !== id));
  };

  if (cargando) {
    return <Loader />;
  }

  return (
    <div className="app-container">
      <h1 className="app-title">Contactos</h1>
      <ContactForm onAdd={agregarContacto} />
      <ContactList contactos={contactos} onDelete={eliminarContacto} />
    </div>
  );
}

export default App;
