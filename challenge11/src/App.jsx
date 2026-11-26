import { useEffect, useMemo, useState } from "react";
import { Graph } from "react-d3-graph";
import GrafoSocial from "./structures/GrafoSocial";
import "./App.css";

const datosIniciales = {
  ciudades: ["Cali", "Bogotá", "Medellín"],
  personas: [
    { nombre: "Santiago", edad: 21, ciudad: "Cali" },
    { nombre: "Daniela", edad: 22, ciudad: "Bogotá" },
    { nombre: "Andrés", edad: 20, ciudad: "Cali" },
    { nombre: "Valentina", edad: 23, ciudad: "Medellín" },
  ],
  amistades: [
    ["Santiago", "Daniela"],
    ["Santiago", "Andrés"],
    ["Daniela", "Valentina"],
  ],
};

function cargarDatos() {
  try {
    const guardados = localStorage.getItem("challenge11-grafo");

    if (guardados) {
      const datos = JSON.parse(guardados);
      const grafo = new GrafoSocial(datos);
      return grafo.exportarDatos();
    }
  } catch (error) {
    console.error("Error cargando datos:", error);
  }

  return datosIniciales;
}

const configuracionGrafo = {
  directed: false,
  nodeHighlightBehavior: true,
  automaticRearrangeAfterDropNode: true,
  height: 500,
  width: 900,
  d3: {
    gravity: -250,
    linkLength: 170,
  },
  node: {
    size: 420,
    fontSize: 13,
    fontColor: "#334155",
    highlightFontSize: 15,
    highlightStrokeColor: "#f59e0b",
    labelProperty: "name",
  },
  link: {
    color: "#94a3b8",
    highlightColor: "#f59e0b",
    strokeWidth: 2,
  },
};

function App() {
  const [datos, setDatos] = useState(cargarDatos);

  const [nombreCiudad, setNombreCiudad] = useState("");
  const [nombrePersona, setNombrePersona] = useState("");
  const [edadPersona, setEdadPersona] = useState("");
  const [ciudadPersona, setCiudadPersona] = useState("");

  const [amigo1, setAmigo1] = useState("");
  const [amigo2, setAmigo2] = useState("");
  const [ciudadConsulta, setCiudadConsulta] = useState("");

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const grafo = useMemo(() => new GrafoSocial(datos), [datos]);

  const { ciudades, personas, amistades } = grafo.exportarDatos();

  const datosGrafo = useMemo(() => {
    const resultado = grafo.obtenerGrafo();

    return {
      nodes: resultado.nodes.map((nodo) => ({
        ...nodo,
        color: nodo.tipo === "ciudad" ? "#f59e0b" : "#2563eb",
      })),
      links: resultado.links,
    };
  }, [grafo]);

  useEffect(() => {
    localStorage.setItem("challenge11-grafo", JSON.stringify(datos));
  }, [datos]);

  const ejecutarOperacion = (operacion, mensajeExito) => {
    try {
      const nuevoGrafo = new GrafoSocial(datos);

      operacion(nuevoGrafo);

      setDatos(nuevoGrafo.exportarDatos());
      setError("");
      setMensaje(mensajeExito);

      return true;
    } catch (err) {
      setError(err.message);
      setMensaje("");
      return false;
    }
  };

  const crearCiudad = (e) => {
    e.preventDefault();

    const creada = ejecutarOperacion(
      (nuevoGrafo) => nuevoGrafo.agregarCiudad(nombreCiudad),
      "Ciudad registrada correctamente."
    );

    if (creada) setNombreCiudad("");
  };

  const crearPersona = (e) => {
    e.preventDefault();

    const creada = ejecutarOperacion(
      (nuevoGrafo) =>
        nuevoGrafo.agregarPersona(
          nombrePersona,
          edadPersona,
          ciudadPersona
        ),
      "Persona registrada correctamente."
    );

    if (creada) {
      setNombrePersona("");
      setEdadPersona("");
      setCiudadPersona("");
    }
  };

  const crearAmistad = (e) => {
    e.preventDefault();

    const creada = ejecutarOperacion(
      (nuevoGrafo) => nuevoGrafo.agregarAmistad(amigo1, amigo2),
      "Amistad registrada correctamente."
    );

    if (creada) {
      setAmigo1("");
      setAmigo2("");
    }
  };

  const borrarPersona = (nombre) => {
    if (!window.confirm(`¿Eliminar a ${nombre} del grafo?`)) return;

    ejecutarOperacion(
      (nuevoGrafo) => nuevoGrafo.eliminarPersona(nombre),
      "Persona eliminada correctamente."
    );
  };

  const borrarCiudad = (nombre) => {
    if (!window.confirm(`¿Eliminar la ciudad ${nombre}?`)) return;

    const eliminada = ejecutarOperacion(
      (nuevoGrafo) => nuevoGrafo.eliminarCiudad(nombre),
      "Ciudad eliminada correctamente."
    );

    if (eliminada && ciudadConsulta === nombre) {
      setCiudadConsulta("");
    }
  };

  const borrarAmistad = (persona1, persona2) => {
    ejecutarOperacion(
      (nuevoGrafo) =>
        nuevoGrafo.eliminarAmistad(persona1, persona2),
      "Amistad eliminada correctamente."
    );
  };

  const habitantes = ciudadConsulta
    ? grafo.obtenerPersonasPorCiudad(ciudadConsulta)
    : [];

  const restaurarEjemplo = () => {
    if (!window.confirm("¿Restaurar los datos de ejemplo?")) return;

    setDatos(datosIniciales);
    setCiudadConsulta("");
    setError("");
    setMensaje("Datos de ejemplo restaurados.");
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">G</span>
            <h1>SocialGraph</h1>
          </div>
          <p>Challenge 11 | Grafos con React</p>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <h2>Red de amigos y ciudades</h2>
          <p>
            Administra personas, registra ciudades y visualiza
            las conexiones de amistad mediante grafos.
          </p>
        </section>

        <section className="estadisticas">
          <div className="stat-card">
            <h3>{personas.length}</h3>
            <p>Personas registradas</p>
          </div>

          <div className="stat-card">
            <h3>{ciudades.length}</h3>
            <p>Ciudades registradas</p>
          </div>

          <div className="stat-card">
            <h3>{amistades.length}</h3>
            <p>Amistades registradas</p>
          </div>
        </section>

        {mensaje && (
          <div className="mensaje-exito" role="status">
            {mensaje}
          </div>
        )}

        {error && (
          <div className="mensaje-error" role="alert">
            {error}
          </div>
        )}

        <section className="formularios">
          <div className="form-card">
            <h2>Registrar ciudad</h2>
            <p>Agrega nuevas ciudades a la red.</p>

            <form onSubmit={crearCiudad}>
              <label htmlFor="nombre-ciudad">Nombre de la ciudad</label>
              <input
                id="nombre-ciudad"
                type="text"
                placeholder="Ejemplo: Barranquilla"
                value={nombreCiudad}
                onChange={(e) => setNombreCiudad(e.target.value)}
                required
              />

              <button type="submit">Agregar ciudad</button>
            </form>
          </div>

          <div className="form-card">
            <h2>Registrar persona</h2>
            <p>Asocia una persona a una ciudad.</p>

            <form onSubmit={crearPersona}>
              <label htmlFor="nombre-persona">Nombre</label>
              <input
                id="nombre-persona"
                type="text"
                placeholder="Nombre de la persona"
                value={nombrePersona}
                onChange={(e) => setNombrePersona(e.target.value)}
                required
              />

              <label htmlFor="edad-persona">Edad</label>
              <input
                id="edad-persona"
                type="number"
                min="0"
                max="120"
                placeholder="Edad"
                value={edadPersona}
                onChange={(e) => setEdadPersona(e.target.value)}
                required
              />

              <label htmlFor="ciudad-persona">Ciudad</label>
              <select
                id="ciudad-persona"
                value={ciudadPersona}
                onChange={(e) => setCiudadPersona(e.target.value)}
                required
              >
                <option value="">Selecciona una ciudad</option>
                {ciudades.map((ciudad) => (
                  <option key={ciudad} value={ciudad}>
                    {ciudad}
                  </option>
                ))}
              </select>

              <button type="submit" disabled={ciudades.length === 0}>
                Agregar persona
              </button>
            </form>
          </div>

          <div className="form-card">
            <h2>Crear amistad</h2>
            <p>Conecta dos personas de la red.</p>

            <form onSubmit={crearAmistad}>
              <label htmlFor="amigo1">Primera persona</label>
              <select
                id="amigo1"
                value={amigo1}
                onChange={(e) => setAmigo1(e.target.value)}
                required
              >
                <option value="">Selecciona una persona</option>
                {personas.map((persona) => (
                  <option key={persona.nombre} value={persona.nombre}>
                    {persona.nombre}
                  </option>
                ))}
              </select>

              <label htmlFor="amigo2">Segunda persona</label>
              <select
                id="amigo2"
                value={amigo2}
                onChange={(e) => setAmigo2(e.target.value)}
                required
              >
                <option value="">Selecciona una persona</option>
                {personas.map((persona) => (
                  <option key={persona.nombre} value={persona.nombre}>
                    {persona.nombre}
                  </option>
                ))}
              </select>

              <button type="submit" disabled={personas.length < 2}>
                Crear amistad
              </button>
            </form>
          </div>
        </section>

        <section className="grafo-section">
          <div className="section-header">
            <div>
              <h2>Visualización del grafo</h2>
              <p>
                Azul: personas | Naranja: ciudades
              </p>
            </div>

            <button
              type="button"
              className="secondary-button"
              onClick={restaurarEjemplo}
            >
              Restaurar ejemplo
            </button>
          </div>

          <div
            className="grafo-container"
            style={{ overflowX: "auto" }}
          >
            {datosGrafo.nodes.length > 0 ? (
              <Graph
                id="grafo-social"
                data={datosGrafo}
                config={configuracionGrafo}
              />
            ) : (
              <p>Registra una ciudad para comenzar el grafo.</p>
            )}
          </div>
        </section>

        <section className="informacion-grid">
          <div className="info-card">
            <h2>Habitantes por ciudad</h2>

            <label htmlFor="consulta-ciudad">
              Selecciona una ciudad
            </label>

            <select
              id="consulta-ciudad"
              value={ciudadConsulta}
              onChange={(e) => setCiudadConsulta(e.target.value)}
            >
              <option value="">Selecciona una ciudad</option>
              {ciudades.map((ciudad) => (
                <option key={ciudad} value={ciudad}>
                  {ciudad}
                </option>
              ))}
            </select>

            {ciudadConsulta && (
              <div className="habitantes">
                <h3>Personas en {ciudadConsulta}</h3>

                {habitantes.length > 0 ? (
                  <ul>
                    {habitantes.map((persona) => (
                      <li key={persona.nombre}>
                        {persona.nombre} — {persona.edad} años
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No hay habitantes registrados.</p>
                )}
              </div>
            )}
          </div>

          <div className="info-card">
            <h2>Ciudades registradas</h2>

            <ul className="lista-registros">
              {ciudades.map((ciudad) => (
                <li key={ciudad}>
                  <span>{ciudad}</span>

                  <button
                    type="button"
                    onClick={() => borrarCiudad(ciudad)}
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="info-card">
            <h2>Personas registradas</h2>

            <ul className="lista-registros">
              {personas.map((persona) => (
                <li key={persona.nombre}>
                  <span>
                    <strong>{persona.nombre}</strong>
                    <small>
                      {persona.edad} años — {persona.ciudad}
                    </small>
                  </span>

                  <button
                    type="button"
                    onClick={() => borrarPersona(persona.nombre)}
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="info-card">
            <h2>Relaciones de amistad</h2>

            {amistades.length === 0 ? (
              <p>No hay amistades registradas.</p>
            ) : (
              <ul className="lista-registros">
                {amistades.map(([persona1, persona2]) => (
                  <li key={`${persona1}-${persona2}`}>
                    <span>
                      {persona1} y {persona2}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        borrarAmistad(persona1, persona2)
                      }
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>
          Challenge 11 — Estructura de Datos y Algoritmos
        </p>
      </footer>
    </div>
  );
}

export default App;
