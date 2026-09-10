export default function CommitteeCard({ committee, onPrev, onNext }) {
  const members = committee.toArray();
  const current = committee.current?.member;

  return (
    <article className="card">
      <header className="card-header">
        <span className="card-tag tag-double-circular">Lista circular doblemente enlazada</span>
        <h2>Comité administrativo</h2>
        <p>El círculo enlaza en ambos sentidos: siempre hay un anterior y un siguiente.</p>
      </header>

      <div className="record-viewer">
        <button className="btn btn-icon" onClick={onPrev} aria-label="Miembro anterior">
          ◂
        </button>
        <div className="record-body">
          <strong>{current.name}</strong>
          <span className="node-sub">{current.role}</span>
        </div>
        <button className="btn btn-icon" onClick={onNext} aria-label="Miembro siguiente">
          ▸
        </button>
      </div>

      <ol className="node-list ring">
        {members.map((m) => (
          <li key={m.name} className={m.name === current.name ? 'active' : ''}>
            <div className="node-body">
              <strong>{m.name}</strong>
              <span className="node-sub">{m.role}</span>
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
}
