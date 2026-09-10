import { useState } from 'react';
import { crearListaDeCanciones } from './LinkedList';

const lista = crearListaDeCanciones();
const canciones = lista.getAll();

export default function PaginaCanciones() {
  const [indice, setIndice] = useState(0);

  const siguiente = () => {
    if (indice < canciones.length - 1) {
      setIndice(indice + 1);
    }
  };

  const cancionActual = canciones[indice];

  return (
    <div className="pagina">
      <h2>Reproductor (lista enlazada simple)</h2>
      <p className="descripcion">
        Cada canción apunta a la siguiente. El botón avanza usando ese enlace.
      </p>

      <div className="tarjeta">
        <h3>{cancionActual.titulo}</h3>
        <p>{cancionActual.artista}</p>
        <button onClick={siguiente} disabled={indice === canciones.length - 1}>
          Siguiente
        </button>
      </div>

      <ul className="lista">
        {canciones.map((c, i) => (
          <li key={c.titulo} className={i === indice ? 'activo' : ''}>
            {i + 1}. {c.titulo} - {c.artista}
          </li>
        ))}
      </ul>
    </div>
  );
}
