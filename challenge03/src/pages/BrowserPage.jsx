import { useMemo, useState } from 'react';
import { buildMockHistory } from '../dataStructures/DoublyLinkedList';

export default function BrowserPage() {
  const history = useMemo(() => buildMockHistory(), []);
  // Forzamos un re-render cada vez que movemos el puntero "current"
  const [, forceUpdate] = useState(0);

  const goBack = () => {
    history.back();
    forceUpdate((n) => n + 1);
  };

  const goForward = () => {
    history.forward();
    forceUpdate((n) => n + 1);
  };

  const pages = history.toArray();
  const currentPage = history.current.page;

  return (
    <section className="page browser-page">
      <header className="page-header">
        <span className="page-eyebrow">Lista doblemente enlazada</span>
        <h1>Historial de navegación</h1>
        <p>
          Cada página conoce a la anterior (<code>prev</code>) y a la
          siguiente (<code>next</code>), por eso se puede ir en ambos
          sentidos.
        </p>
      </header>

      <div className="browser-card">
        <div className="browser-toolbar">
          <button
            onClick={goBack}
            className="btn btn-icon"
            disabled={!history.canGoBack()}
            aria-label="Atrás"
          >
            ◂
          </button>
          <div className="browser-address">{currentPage.url}</div>
          <button
            onClick={goForward}
            className="btn btn-icon"
            disabled={!history.canGoForward()}
            aria-label="Adelante"
          >
            ▸
          </button>
        </div>
        <div className="browser-viewport">
          <h2>{currentPage.title}</h2>
          <p>Estás viendo esta página del historial simulado.</p>
        </div>
      </div>

      <ol className="history-list">
        {pages.map((page) => (
          <li
            key={page.url}
            className={page.url === currentPage.url ? 'active' : ''}
          >
            {page.title}
            <span className="history-url">{page.url}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
