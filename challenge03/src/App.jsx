import { useState } from 'react';
import PaginaCanciones from './PaginaCanciones';
import PaginaNavegador from './PaginaNavegador';

export default function App() {
  const [pagina, setPagina] = useState('canciones');

  return (
    <div className="app">
      <nav className="nav">
        <button
          className={pagina === 'canciones' ? 'activo' : ''}
          onClick={() => setPagina('canciones')}
        >
          Canciones
        </button>
        <button
          className={pagina === 'navegador' ? 'activo' : ''}
          onClick={() => setPagina('navegador')}
        >
          Navegador
        </button>
      </nav>

      {pagina === 'canciones' ? <PaginaCanciones /> : <PaginaNavegador />}
    </div>
  );
}
