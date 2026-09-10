export default function HistoryCard({ history, onBack, onForward }) {
  const records = history.toArray();
  const current = history.current?.record;

  return (
    <article className="card">
      <header className="card-header">
        <span className="card-tag tag-double">Lista doblemente enlazada</span>
        <h2>Historial de atención</h2>
        <p>Cada registro conoce al anterior y al siguiente: se puede navegar en ambos sentidos.</p>
      </header>

      {records.length === 0 ? (
        <p className="empty">Todavía no se ha atendido a nadie.</p>
      ) : (
        <>
          <div className="record-viewer">
            <button
              className="btn btn-icon"
              onClick={onBack}
              disabled={!history.canGoBack()}
              aria-label="Registro anterior"
            >
              ◂
            </button>
            <div className="record-body">
              <strong>{current.name}</strong>
              <span className="node-sub">
                Atendido por {current.doctor} · {current.attendedAt}
              </span>
              <span className="node-id">{current.id}</span>
            </div>
            <button
              className="btn btn-icon"
              onClick={onForward}
              disabled={!history.canGoForward()}
              aria-label="Registro siguiente"
            >
              ▸
            </button>
          </div>

          <ol className="node-list compact">
            {records.map((r) => (
              <li key={r.id} className={r.id === current.id ? 'active' : ''}>
                <div className="node-body">
                  <strong>{r.name}</strong>
                  <span className="node-sub">{r.doctor}</span>
                </div>
                <span className="node-id">{r.attendedAt}</span>
              </li>
            ))}
          </ol>
        </>
      )}
    </article>
  );
}
