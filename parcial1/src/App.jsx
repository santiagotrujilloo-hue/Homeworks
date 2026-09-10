import { useEffect, useState } from 'react';
import { crearSalaDeEspera } from './ListaEspera';
import { crearHistorial } from './Historial';
import { crearRotacion } from './RotacionDoctores';
import { crearComite } from './Comite';

const sala = crearSalaDeEspera();
const historial = crearHistorial();
const rotacion = crearRotacion();
const comite = crearComite();

const SEGUNDOS_ROTACION = 10;

export default function App() {
  const [, actualizar] = useState(0);
  const rerender = () => actualizar((n) => n + 1);

  const [segundos, setSegundos] = useState(SEGUNDOS_ROTACION);
  const [nombrePaciente, setNombrePaciente] = useState('');

  // cada 10 segundos cambia el doctor de guardia solo
  useEffect(() => {
    const intervalo = setInterval(() => {
      setSegundos((s) => {
        if (s <= 1) {
          rotacion.siguiente();
          rerender();
          return SEGUNDOS_ROTACION;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalo);
  }, []);

  const atenderPaciente = () => {
    const paciente = sala.atender();
    if (!paciente) return;
    historial.agregar({
      ...paciente,
      doctor: rotacion.current.doctor.nombre,
      hora: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
    });
    rerender();
  };

  const agregarPaciente = (e) => {
    e.preventDefault();
    if (!nombrePaciente.trim()) return;
    sala.agregar({
      id: 'P-' + Math.floor(100 + Math.random() * 900),
      nombre: nombrePaciente.trim(),
      motivo: 'Consulta general',
    });
    setNombrePaciente('');
    rerender();
  };

  const pacientes = sala.getAll();
  const registros = historial.getAll();
  const registroActual = historial.current?.registro;
  const doctores = rotacion.getAll();
  const doctorActual = rotacion.current.doctor;
  const miembros = comite.getAll();
  const miembroActual = comite.current.miembro;

  return (
    <div className="app">
      <header className="encabezado">
        <h1>Panel de turnos - Clínica</h1>
        <span className="chip">Guardia: {doctorActual.nombre}</span>
      </header>

      <div className="tablero">
        {/* Lista enlazada simple */}
        <section className="tarjeta">
          <h2>Sala de espera</h2>
          <p className="etiqueta">Lista enlazada simple</p>
          <ul className="lista">
            {pacientes.length === 0 && <li>No hay pacientes esperando</li>}
            {pacientes.map((p, i) => (
              <li key={p.id} className={i === 0 ? 'activo' : ''}>
                {p.nombre} - {p.motivo}
              </li>
            ))}
          </ul>
          <button onClick={atenderPaciente} disabled={pacientes.length === 0}>
            Atender siguiente paciente
          </button>
          <form onSubmit={agregarPaciente} className="formulario">
            <input
              type="text"
              placeholder="Nombre del paciente"
              value={nombrePaciente}
              onChange={(e) => setNombrePaciente(e.target.value)}
            />
            <button type="submit">Agregar</button>
          </form>
        </section>

        {/* Lista doblemente enlazada */}
        <section className="tarjeta">
          <h2>Historial de atención</h2>
          <p className="etiqueta">Lista doblemente enlazada</p>
          {registros.length === 0 ? (
            <p>Todavía no se ha atendido a nadie</p>
          ) : (
            <>
              <div className="visor">
                <button
                  onClick={() => {
                    historial.atras();
                    rerender();
                  }}
                  disabled={!historial.current.prev}
                >
                  ◂
                </button>
                <span>
                  {registroActual.nombre} - {registroActual.doctor} ({registroActual.hora})
                </span>
                <button
                  onClick={() => {
                    historial.adelante();
                    rerender();
                  }}
                  disabled={!historial.current.next}
                >
                  ▸
                </button>
              </div>
              <ul className="lista">
                {registros.map((r) => (
                  <li key={r.id} className={r.id === registroActual.id ? 'activo' : ''}>
                    {r.nombre} - {r.doctor}
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        {/* Lista circular simple */}
        <section className="tarjeta">
          <h2>Rotación de guardia</h2>
          <p className="etiqueta">Lista circular simple</p>
          <div className="visor">
            <span>
              {doctorActual.nombre} - {doctorActual.especialidad}
            </span>
            <span className="temporizador">{segundos}s</span>
          </div>
          <ul className="lista">
            {doctores.map((d) => (
              <li key={d.nombre} className={d.nombre === doctorActual.nombre ? 'activo' : ''}>
                {d.nombre}
              </li>
            ))}
          </ul>
          <button
            onClick={() => {
              rotacion.siguiente();
              setSegundos(SEGUNDOS_ROTACION);
              rerender();
            }}
          >
            Rotar guardia ahora
          </button>
        </section>

        {/* Lista circular doblemente enlazada */}
        <section className="tarjeta">
          <h2>Comité administrativo</h2>
          <p className="etiqueta">Lista circular doblemente enlazada</p>
          <div className="visor">
            <button
              onClick={() => {
                comite.anterior();
                rerender();
              }}
            >
              ◂
            </button>
            <span>
              {miembroActual.nombre} - {miembroActual.rol}
            </span>
            <button
              onClick={() => {
                comite.siguiente();
                rerender();
              }}
            >
              ▸
            </button>
          </div>
          <ul className="lista">
            {miembros.map((m) => (
              <li key={m.nombre} className={m.nombre === miembroActual.nombre ? 'activo' : ''}>
                {m.nombre}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
