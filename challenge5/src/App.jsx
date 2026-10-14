import { useState } from "react";
import "./App.css";

import ColaPersonas from "./structures/ColaPersonas";
import personasPrueba from "./data/personasPrueba";

const colaInicial = new ColaPersonas();

personasPrueba.forEach((persona) => {
  colaInicial.enqueue(persona);
});

function App() {
  const [cola, setCola] = useState(colaInicial);

  const [formulario, setFormulario] = useState({
    nombre: "",
    montoRetiro: "",
  });

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario({
      ...formulario,
      [name]: value,
    });
  };

  const generarFechaAleatoria = () => {
    const ahora = new Date();

    const minutosAleatorios = Math.floor(Math.random() * 60);
    const segundosAleatorios = Math.floor(Math.random() * 60);

    ahora.setMinutes(
      ahora.getMinutes() + minutosAleatorios
    );

    ahora.setSeconds(segundosAleatorios);

    return ahora.toISOString();
  };

  const agregarPersona = (e) => {
    e.preventDefault();

    if (
      !formulario.nombre.trim() ||
      !formulario.montoRetiro
    ) {
      alert("Por favor completa todos los campos.");
      return;
    }

    if (Number(formulario.montoRetiro) <= 0) {
      alert(
        "El monto de retiro debe ser mayor a 0."
      );
      return;
    }

    const nuevaPersona = {
      id: Date.now(),
      nombre: formulario.nombre,
      montoRetiro: Number(
        formulario.montoRetiro
      ),
      fechaLlegada: generarFechaAleatoria(),
    };

    const nuevaCola = new ColaPersonas();

    cola.obtenerPersonas().forEach((persona) => {
      nuevaCola.enqueue(persona);
    });

    nuevaCola.enqueue(nuevaPersona);

    setCola(nuevaCola);

    setFormulario({
      nombre: "",
      montoRetiro: "",
    });
  };

  const atenderPersona = () => {
    if (cola.estaVacia()) {
      return;
    }

    const nuevaCola = new ColaPersonas();

    cola
      .obtenerPersonas()
      .slice(1)
      .forEach((persona) => {
        nuevaCola.enqueue(persona);
      });

    setCola(nuevaCola);
  };

  const personas = cola.obtenerPersonas();

  const formatearDinero = (valor) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(valor);
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString(
      "es-CO",
      {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  return (
    <div className="app">
      <header className="barra-superior">
        <div className="marca">
          <div className="logo-atm">$</div>

          <div>
            <span>TURNOS ATM</span>
            <h1>Gestión de turnos</h1>
          </div>
        </div>

        <div className="estado-cajero">
          <div className="punto-activo"></div>

          <div>
            <small>CAJERO</small>
            <strong>Disponible</strong>
          </div>
        </div>
      </header>

      <main className="contenido">
        <section className="panel-formulario">
          <span className="subtitulo">
            NUEVO TURNO
          </span>

          <h2>Registrar persona</h2>

          <p className="descripcion">
            Ingresa los datos del cliente. La fecha
            de llegada será generada automáticamente
            por el sistema.
          </p>

          <form onSubmit={agregarPersona}>
            <div className="campo">
              <label htmlFor="nombre">
                Nombre completo
              </label>

              <input
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Ej. Juan Pérez"
                value={formulario.nombre}
                onChange={manejarCambio}
              />
            </div>

            <div className="campo">
              <label htmlFor="montoRetiro">
                Monto a retirar
              </label>

              <div className="input-dinero">
                <span>$</span>

                <input
                  id="montoRetiro"
                  name="montoRetiro"
                  type="number"
                  min="1"
                  placeholder="200000"
                  value={formulario.montoRetiro}
                  onChange={manejarCambio}
                />
              </div>
            </div>

            <div className="info-fecha">
              <span>◷</span>

              <p>
                La fecha y hora de llegada se asignan
                <strong> automáticamente</strong>.
              </p>
            </div>

            <button
              type="submit"
              className="boton-agregar"
            >
              Generar turno
              <span>→</span>
            </button>
          </form>
        </section>

        <section className="panel-cola">
          <div className="encabezado-cola">
            <div>
              <span className="subtitulo">
                COLA FIFO
              </span>

              <h2>Personas en espera</h2>

              <p>
                Los clientes están organizados según
                su fecha de llegada.
              </p>
            </div>

            <div className="total-personas">
              <strong>{cola.tamaño()}</strong>
              <span>EN ESPERA</span>
            </div>
          </div>

          {personas.length > 0 && (
            <div className="siguiente-turno">
              <div className="numero-turno">
                <span>PRÓXIMO</span>
                <strong>01</strong>
              </div>

              <div className="info-siguiente">
                <small>
                  SIGUIENTE CLIENTE
                </small>

                <h3>{personas[0].nombre}</h3>

                <p>
                  {formatearDinero(
                    personas[0].montoRetiro
                  )}
                </p>
              </div>

              <button
                onClick={atenderPersona}
                className="boton-atender"
              >
                Atender
              </button>
            </div>
          )}

          <div className="cabecera-tabla">
            <span>Turno</span>
            <span>Cliente</span>
            <span>Retiro</span>
            <span>Llegada</span>
          </div>

          <div className="lista-personas">
            {personas.length === 0 ? (
              <div className="estado-vacio">
                <div>✓</div>

                <h3>
                  No hay personas en espera
                </h3>

                <p>
                  Todos los clientes han sido
                  atendidos.
                </p>
              </div>
            ) : (
              personas.map(
                (persona, index) => (
                  <article
                    className={`persona ${
                      index === 0
                        ? "persona-siguiente"
                        : ""
                    }`}
                    key={persona.id}
                  >
                    <div className="turno">
                      {String(
                        index + 1
                      ).padStart(2, "0")}
                    </div>

                    <div className="cliente">
                      <div className="avatar">
                        {persona.nombre
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <strong>
                          {persona.nombre}
                        </strong>

                        {index === 0 && (
                          <small>
                            Siguiente
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="monto">
                      {formatearDinero(
                        persona.montoRetiro
                      )}
                    </div>

                    <div className="fecha">
                      {formatearFecha(
                        persona.fechaLlegada
                      )}
                    </div>
                  </article>
                )
              )
            )}
          </div>

          <div className="explicacion-fifo">
            <div>
              <strong>FIFO</strong>
            </div>

            <p>
              Primero en entrar, primero en salir:
              la primera persona en llegar es la
              primera en ser atendida.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;