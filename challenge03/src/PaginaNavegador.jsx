import { useState } from 'react';
import { crearHistorial } from './DoublyLinkedList';

const historial = crearHistorial();

export default function PaginaNavegador() {
  const [, setActualizar] = useState(0);

  const atras = () => {
    historial.atras();
    setActualizar((n) => n + 1);
  };

  const adelante = () => {
    historial.adelante();
    setActualizar((n) => n + 1);
  };

  const paginas = historial.getAll();
  const actual = historial.current.page;

  return (
    <div className="pagina">
      <h2>Historial (lista doblemente enlazada)</h2>
      <p className="descripcion">
        Cada página conoce a la anterior y a la siguiente, por eso se puede ir en los dos sentidos.
      </p>

      <div className="tarjeta">
        <button onClick={atras} disabled={!historial.current.prev}>
          ◂ Atrás
        </button>
        <span className="url">{actual.url}</span>
        <button onClick={adelante} disabled={!historial.current.next}>
          Adelante ▸
        </button>
      </div>

      <ul className="lista">
        {paginas.map((p) => (
          <li key={p.url} className={p.url === actual.url ? 'activo' : ''}>
            {p.url}
          </li>
        ))}
      </ul>
    </div>
  );
}
