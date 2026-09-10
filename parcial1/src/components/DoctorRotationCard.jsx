export default function DoctorRotationCard({ rotation, onNext, secondsLeft }) {
  const doctors = rotation.toArray();
  const current = rotation.current?.doctor;

  return (
    <article className="card">
      <header className="card-header">
        <span className="card-tag tag-circular">Lista circular simple</span>
        <h2>Rotación de guardia</h2>
        <p>El último médico enlaza otra vez con el primero: la ronda nunca termina.</p>
      </header>

      <div className="duty-badge">
        <div className="duty-pulse" aria-hidden="true" />
        <div>
          <strong>{current.name}</strong>
          <span className="node-sub">{current.specialty}</span>
        </div>
        <span className="duty-timer">{secondsLeft}s</span>
      </div>

      <ol className="node-list ring">
        {doctors.map((d) => (
          <li key={d.name} className={d.name === current.name ? 'active' : ''}>
            <div className="node-body">
              <strong>{d.name}</strong>
              <span className="node-sub">{d.specialty}</span>
            </div>
          </li>
        ))}
      </ol>

      <button className="btn btn-ghost" onClick={onNext}>
        Rotar guardia ahora ▸
      </button>
    </article>
  );
}
