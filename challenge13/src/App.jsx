import { useEffect, useRef, useState } from "react";
import { buscarGifs } from "./services/giphy";
import "./App.css";

const LIMITE = 20;
const sugerencias = ["Gatos", "Perros", "Fútbol", "Anime", "Feliz", "Baile"];

function App() {
  const [texto, setTexto] = useState("");
  const [busquedaActual, setBusquedaActual] = useState("");
  const [gifs, setGifs] = useState([]);
  const [total, setTotal] = useState(0);
  const [siguienteOffset, setSiguienteOffset] = useState(0);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [haBuscado, setHaBuscado] = useState(false);
  const controladorRef = useRef(null);

  useEffect(() => {
    return () => {
      controladorRef.current?.abort();
    };
  }, []);

  const realizarBusqueda = async (termino) => {
    const consulta = String(termino ?? "").trim();

    if (!consulta) {
      setError("Escribe una palabra para buscar GIFs.");
      return;
    }

    if (consulta.length > 50) {
      setError("La búsqueda no puede superar los 50 caracteres.");
      return;
    }

    controladorRef.current?.abort();

    const controlador = new AbortController();
    controladorRef.current = controlador;

    setBusquedaActual(consulta);
    setGifs([]);
    setTotal(0);
    setSiguienteOffset(0);
    setError("");
    setCargando(true);
    setHaBuscado(true);

    try {
      const resultado = await buscarGifs(consulta, {
        limite: LIMITE,
        offset: 0,
        signal: controlador.signal,
      });

      if (controladorRef.current !== controlador) return;

      setGifs(resultado.gifs);
      setTotal(resultado.total);
      setSiguienteOffset(LIMITE);
    } catch (err) {
      if (
        err.name !== "AbortError" &&
        controladorRef.current === controlador
      ) {
        setError(err.message || "Ocurrió un error al buscar GIFs.");
      }
    } finally {
      if (controladorRef.current === controlador) {
        setCargando(false);
        controladorRef.current = null;
      }
    }
  };

  const manejarBusqueda = (evento) => {
    evento.preventDefault();
    realizarBusqueda(texto);
  };

  const buscarSugerencia = (sugerencia) => {
    setTexto(sugerencia);
    realizarBusqueda(sugerencia);
  };

  const cargarMas = async () => {
    if (
      cargando ||
      controladorRef.current ||
      !busquedaActual ||
      siguienteOffset >= total
    ) {
      return;
    }

    const controlador = new AbortController();
    controladorRef.current = controlador;

    setCargando(true);
    setError("");

    try {
      const resultado = await buscarGifs(busquedaActual, {
        limite: LIMITE,
        offset: siguienteOffset,
        signal: controlador.signal,
      });

      if (controladorRef.current !== controlador) return;

      setGifs((anteriores) => {
        const idsExistentes = new Set(
          anteriores.map((gif) => gif.id)
        );

        const nuevos = resultado.gifs.filter(
          (gif) => !idsExistentes.has(gif.id)
        );

        return [...anteriores, ...nuevos];
      });

      setTotal(resultado.total);
      setSiguienteOffset((anterior) => anterior + LIMITE);
    } catch (err) {
      if (
        err.name !== "AbortError" &&
        controladorRef.current === controlador
      ) {
        setError(err.message || "No se pudieron cargar más GIFs.");
      }
    } finally {
      if (controladorRef.current === controlador) {
        setCargando(false);
        controladorRef.current = null;
      }
    }
  };

  const hayMas = gifs.length > 0 && siguienteOffset < total;

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">G</span>
            <div className="logo-text">
              <h1>GifExplorer</h1>
              <p>Explora, descubre y comparte</p>
            </div>
          </div>
          <div className="header-badge">Challenge 13 | GIPHY API</div>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <div className="hero-content">
            <span className="hero-tag">EXPLORADOR DE GIFS</span>
            <h2>Encuentra el GIF perfecto para cada momento.</h2>
            <p>
              Busca entre miles de GIFs animados, descubre nuevas
              expresiones y encuentra exactamente lo que necesitas.
            </p>
            <div className="hero-labels">
              <span>Búsqueda rápida</span>
              <span>GIFs animados</span>
              <span>GIPHY API</span>
            </div>
          </div>
          <div className="hero-decoration" aria-hidden="true">
            <div className="decoracion-principal">GIF</div>
            <div className="decoracion-secundaria">EXPLORE</div>
          </div>
        </section>

        <section className="buscador-section">
          <div className="section-heading">
            <span className="section-tag">BUSCADOR</span>
            <h2>¿Qué GIF estás buscando?</h2>
            <p>
              Escribe una palabra o frase y descubre los resultados.
            </p>
          </div>

          <form className="buscador-form" onSubmit={manejarBusqueda}>
            <div className="input-container">
              <span className="search-icon" aria-hidden="true">
                ⌕
              </span>
              <input
                type="search"
                placeholder="Busca gatos, fútbol, memes, anime..."
                value={texto}
                onChange={(evento) => setTexto(evento.target.value)}
                maxLength={50}
                aria-label="Buscar GIFs"
              />
            </div>
            <button
              type="submit"
              className="buscar-button"
              disabled={!texto.trim()}
            >
              Buscar GIFs
            </button>
          </form>

          <div className="sugerencias">
            <span className="sugerencias-label">
              Búsquedas populares:
            </span>
            <div className="sugerencias-lista">
              {sugerencias.map((sugerencia) => (
                <button
                  key={sugerencia}
                  type="button"
                  className="sugerencia-button"
                  onClick={() => buscarSugerencia(sugerencia)}
                >
                  {sugerencia}
                </button>
              ))}
            </div>
          </div>
        </section>

        {error && (
          <div className="mensaje-error" role="alert">
            <strong>Algo salió mal</strong>
            <p>{error}</p>
          </div>
        )}

        <section className="resultados-section">
          <div className="resultados-header">
            <div>
              <span className="section-tag">GALERÍA DE GIFS</span>
              <h2>
                {haBuscado
                  ? `Resultados para "${busquedaActual}"`
                  : "Explora GIFs animados"}
              </h2>
              <p>
                {haBuscado
                  ? `${total.toLocaleString("es-CO")} GIFs encontrados`
                  : "Utiliza el buscador para descubrir contenido."}
              </p>
            </div>

            {gifs.length > 0 && (
              <div className="resultados-contador">
                <strong>{gifs.length}</strong>
                <span>GIFs mostrados</span>
              </div>
            )}
          </div>

          {!haBuscado && (
            <div className="estado-inicial">
              <div className="estado-icono">GIF</div>
              <h3>Tu próxima búsqueda comienza aquí</h3>
              <p>
                Escribe una palabra en el buscador o selecciona
                una categoría popular para descubrir GIFs.
              </p>
              <button
                type="button"
                onClick={() => buscarSugerencia("Gatos")}
              >
                Explorar GIFs de gatos
              </button>
            </div>
          )}

          {cargando && gifs.length === 0 && (
            <div className="estado-cargando" role="status">
              <div className="spinner" />
              <h3>Buscando GIFs...</h3>
              <p>Estamos consultando GIPHY.</p>
            </div>
          )}

          {haBuscado &&
            !cargando &&
            gifs.length === 0 &&
            !error && (
              <div className="estado-vacio">
                <div className="estado-icono">?</div>
                <h3>No encontramos GIFs</h3>
                <p>
                  Intenta buscar otra palabra o utiliza alguna
                  de las sugerencias disponibles.
                </p>
              </div>
            )}

          {gifs.length > 0 && (
            <div className="gifs-grid">
              {gifs.map((gif) => {
                const imagen =
                  gif.images?.fixed_width?.url ||
                  gif.images?.original?.url;

                return (
                  <article className="gif-card" key={gif.id}>
                    <div className="gif-imagen-container">
                      <img
                        src={imagen}
                        alt={gif.title || "GIF animado"}
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="gif-etiqueta">GIF</span>
                    </div>

                    <div className="gif-info">
                      <h3 title={gif.title || "GIF animado"}>
                        {gif.title || "GIF animado"}
                      </h3>
                      <p>
                        {gif.username
                          ? `Por @${gif.username}`
                          : "Disponible en GIPHY"}
                      </p>
                      <a
                        href={gif.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gif-enlace"
                      >
                        Ver en GIPHY
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {hayMas && (
            <div className="cargar-mas-container">
              <button
                type="button"
                className="cargar-mas-button"
                onClick={cargarMas}
                disabled={cargando}
              >
                {cargando ? "Cargando GIFs..." : "Cargar más GIFs"}
              </button>
              <p>
                Mostrando {gifs.length} de{" "}
                {total.toLocaleString("es-CO")} resultados
              </p>
            </div>
          )}
        </section>

        <section className="informacion-section">
          <div className="informacion-heading">
            <span className="section-tag">TECNOLOGÍA</span>
            <h2>¿Cómo funciona GifExplorer?</h2>
            <p>
              Una aplicación desarrollada con React y conectada
              a los servicios de GIPHY.
            </p>
          </div>

          <div className="informacion-grid">
            <article className="info-card">
              <div className="info-icon">01</div>
              <h3>React</h3>
              <p>
                Permite crear una interfaz interactiva que
                actualiza los resultados automáticamente.
              </p>
            </article>

            <article className="info-card">
              <div className="info-icon">02</div>
              <h3>Fetch API</h3>
              <p>
                Realiza solicitudes HTTP para consultar
                los GIFs disponibles en GIPHY.
              </p>
            </article>

            <article className="info-card">
              <div className="info-icon">03</div>
              <h3>Variables de entorno</h3>
              <p>
                Configuran la API Key utilizada
                para conectar la aplicación con GIPHY.
              </p>
            </article>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p>
            GifExplorer | Challenge 13 — Estructura de Datos y Algoritmos
          </p>
          <p>Powered by GIPHY</p>
        </div>
      </footer>
    </div>
  );
}

export default App;