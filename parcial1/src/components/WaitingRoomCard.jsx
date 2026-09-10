import { useState } from 'react';

export default function WaitingRoomCard({ waitingList, onAttend, onAddPatient }) {
  const [name, setName] = useState('');
  const [reason, setReason] = useState('');
  const patients = waitingList.toArray();

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddPatient({
      id: `P-${Math.floor(100 + Math.random() * 900)}`,
      name: name.trim(),
      reason: reason.trim() || 'Consulta general',
    });
    setName('');
    setReason('');
  };

  return (
    <article className="card">
      <header className="card-header">
        <span className="card-tag tag-simple">Lista enlazada simple</span>
        <h2>Sala de espera</h2>
        <p>Los pacientes entran al final y se atienden por el principio.</p>
      </header>

      <ol className="node-list">
        {patients.length === 0 && <li className="empty">No hay pacientes esperando.</li>}
        {patients.map((p, i) => (
          <li key={p.id} className={i === 0 ? 'active' : ''}>
            <span className="node-index">{i + 1}</span>
            <div className="node-body">
              <strong>{p.name}</strong>
              <span className="node-sub">{p.reason}</span>
            </div>
            <span className="node-id">{p.id}</span>
          </li>
        ))}
      </ol>

      <button
        className="btn btn-primary"
        onClick={onAttend}
        disabled={patients.length === 0}
      >
        Atender siguiente paciente ▸
      </button>

      <form className="mini-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Nombre del paciente"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Motivo (opcional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <button type="submit" className="btn btn-ghost">
          Agregar a la fila
        </button>
      </form>
    </article>
  );
}
