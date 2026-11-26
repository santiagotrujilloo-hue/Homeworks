import { useEffect, useMemo, useState } from "react";
import Trie from "./structures/Trie";
import MinHeap from "./structures/MinHeap";
import "./App.css";

const productosIniciales = [
  { nombre: "Air Max", popularidad: 90 },
  { nombre: "Air Force", popularidad: 95 },
  { nombre: "Air Jordan", popularidad: 85 },
  { nombre: "Adidas Boost", popularidad: 80 },
  { nombre: "Adidas Superstar", popularidad: 88 },
  { nombre: "Nike Dunk", popularidad: 92 },
  { nombre: "Nike Blazer", popularidad: 76 },
  { nombre: "Puma Suede", popularidad: 72 },
  { nombre: "New Balance 550", popularidad: 89 },
  { nombre: "Converse Chuck Taylor", popularidad: 82 },
  { nombre: "Vans Old Skool", popularidad: 84 },
  { nombre: "Reebok Classic", popularidad: 70 },
];

function cargarProductos() {
  try {
    const guardados = localStorage.getItem("challenge12-productos");
    if (guardados !== null) {
      const datos = JSON.parse(guardados);
      if (Array.isArray(datos)) {
        return datos.filter(
          (producto) =>
            typeof producto.nombre === "string" &&
            producto.nombre.trim() !== "" &&
            Number.isInteger(producto.popularidad) &&
            producto.popularidad >= 0
        );
      }
    }
  } catch (error) {
    console.error("Error al cargar los productos:", error);
  }
  return productosIniciales;
}

function App() {
  const [productos, setProductos] = useState(cargarProductos);
  const [busqueda, setBusqueda] = useState("");
  const [cantidad, setCantidad] = useState(3);
  const [nombreNuevo, setNombreNuevo] = useState("");
  const [popularidadNueva, setPopularidadNueva] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const trie = useMemo(() => {
    const estructura = new Trie();
    productos.forEach((producto) => {
      estructura.insertar(producto.nombre, producto.popularidad);
    });
    return estructura;
  }, [productos]);

  const productoDuplicado = useMemo(() => {
    const nombre = nombreNuevo.trim();
    return nombre !== "" && trie.buscarExacto(nombre) !== null;
  }, [nombreNuevo, trie]);

  const coincidencias = useMemo(() => {
    return trie.buscarPorPrefijo(busqueda);
  }, [trie, busqueda]);

  const resultados = useMemo(() => {
    return MinHeap.obtenerTopK(coincidencias, cantidad);
  }, [coincidencias, cantidad]);

  const masPopular = useMemo(() => {
    return MinHeap.obtenerTopK(productos, 1)[0] ?? null;
  }, [productos]);

  useEffect(() => {
    localStorage.setItem(
      "challenge12-productos",
      JSON.stringify(productos)
    );
  }, [productos]);

  const agregarProducto = (evento) => {
    evento.preventDefault();
    setError("");
    setMensaje("");

    const nombre = nombreNuevo.trim();
    const popularidad = Number(popularidadNueva);

    if (!nombre) {
      setError("Debes escribir el nombre del producto.");
      return;
    }

    if (trie.buscarExacto(nombre)) {
      setError("Este producto ya está registrado.");
      return;
    }

    if (
      popularidadNueva === "" ||
      !Number.isInteger(popularidad) ||
      popularidad < 0 ||
      popularidad > 100
    ) {
      setError("La popularidad debe ser un número entero entre 0 y 100.");
      return;
    }

    try {
      const prueba = new Trie();
      prueba.insertar(nombre, popularidad);

      setProductos((anteriores) => [
        ...anteriores,
        { nombre, popularidad },
      ]);

      setNombreNuevo("");
      setPopularidadNueva("");
      setMensaje(`El producto ${nombre} fue agregado correctamente.`);
    } catch (err) {
      setError(err.message);
    }
  };

  const eliminarProducto = (nombre) => {
    const confirmar = window.confirm(
      `¿Estás seguro de eliminar ${nombre}?`
    );

    if (!confirmar) return;

    setProductos((anteriores) =>
      anteriores.filter(
        (producto) =>
          producto.nombre.toLowerCase() !== nombre.toLowerCase()
      )
    );

    setMensaje(`El producto ${nombre} fue eliminado correctamente.`);
    setError("");
  };

  const restaurarProductos = () => {
    const confirmar = window.confirm(
      "¿Deseas restaurar el catálogo de ejemplo?"
    );

    if (!confirmar) return;

    setProductos([...productosIniciales]);
    setBusqueda("");
    setCantidad(3);
    setNombreNuevo("");
    setPopularidadNueva("");
    setError("");
    setMensaje("El catálogo de ejemplo fue restaurado.");
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">S</span>
            <div>
              <h1>SmartSearch</h1>
              <span className="logo-subtitle">Búsqueda inteligente</span>
            </div>
          </div>
          <div className="header-label">Challenge 12 | Trie + Heap</div>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <div className="hero-content">
            <span className="hero-badge">
              Estructura de Datos y Algoritmos
            </span>
            <h2>Encuentra lo que buscas, más rápido.</h2>
            <p>
              Explora nuestro catálogo utilizando un árbol Trie
              para buscar por prefijos y un MinHeap para descubrir
              los productos más populares.
            </p>
          </div>
          <div className="hero-decoration">
            <span>Trie</span>
            <span>+</span>
            <span>Heap</span>
          </div>
        </section>

        <section className="estadisticas">
          <article className="stat-card">
            <div className="stat-icon">01</div>
            <div>
              <h3>{productos.length}</h3>
              <p>Productos registrados</p>
            </div>
          </article>
          <article className="stat-card">
            <div className="stat-icon">02</div>
            <div>
              <h3>{coincidencias.length}</h3>
              <p>Coincidencias encontradas</p>
            </div>
          </article>
          <article className="stat-card">
            <div className="stat-icon">03</div>
            <div>
              <h3>{masPopular?.popularidad ?? 0}</h3>
              <p>Popularidad más alta</p>
            </div>
          </article>
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

        <div className="contenido-principal">
          <section className="busqueda-section">
            <div className="section-header">
              <div>
                <span className="section-tag">BUSCADOR INTELIGENTE</span>
                <h2>Buscar productos</h2>
                <p>
                  Escribe las primeras letras del producto que
                  deseas encontrar.
                </p>
              </div>
            </div>

            <div className="busqueda-controles">
              <div className="busqueda-input-grupo">
                <label htmlFor="busqueda">Nombre o prefijo</label>
                <input
                  id="busqueda"
                  type="search"
                  placeholder="Ejemplo: air, nike, adidas..."
                  value={busqueda}
                  onChange={(evento) =>
                    setBusqueda(evento.target.value)
                  }
                />
              </div>

              <div className="cantidad-grupo">
                <label htmlFor="cantidad">Resultados (K)</label>
                <input
                  id="cantidad"
                  type="number"
                  min="1"
                  max="100"
                  value={cantidad}
                  onChange={(evento) =>
                    setCantidad(evento.target.value)
                  }
                />
              </div>
            </div>

            <div className="busqueda-info">
              <span>
                {coincidencias.length} coincidencia(s)
              </span>
              <span>
                Mostrando {resultados.length} resultado(s)
              </span>
            </div>

            <div className="resultados-lista">
              {resultados.length > 0 ? (
                resultados.map((producto, indice) => (
                  <article
                    className="resultado-card"
                    key={producto.nombre}
                  >
                    <div className="resultado-posicion">
                      {indice + 1}
                    </div>

                    <div className="resultado-info">
                      <h3>{producto.nombre}</h3>
                      <p>Producto del catálogo</p>
                    </div>

                    <div className="resultado-popularidad">
                      <span>Popularidad</span>
                      <strong>{producto.popularidad}</strong>
                      <div className="popularidad-barra">
                        <div
                          className="popularidad-progreso"
                          style={{
                            width: `${Math.min(
                              producto.popularidad,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="sin-resultados">
                  <div className="sin-resultados-icono">?</div>
                  <h3>No hay resultados disponibles</h3>
                  <p>
                    Prueba con otro prefijo o registra un
                    producto nuevo.
                  </p>
                </div>
              )}
            </div>

            <div className="explicacion">
              <h3>¿Cómo funciona esta búsqueda?</h3>
              <div className="explicacion-pasos">
                <div>
                  <span>1</span>
                  <p>El Trie encuentra los productos por prefijo.</p>
                </div>
                <div>
                  <span>2</span>
                  <p>El MinHeap selecciona los K más populares.</p>
                </div>
                <div>
                  <span>3</span>
                  <p>Los resultados aparecen de mayor a menor.</p>
                </div>
              </div>
            </div>
          </section>

          <aside className="sidebar">
            <section className="form-card">
              <div className="section-header">
                <div>
                  <span className="section-tag">ADMINISTRACIÓN</span>
                  <h2>Agregar producto</h2>
                  <p>Registra productos en el árbol Trie.</p>
                </div>
              </div>

              <form onSubmit={agregarProducto}>
                <label htmlFor="nombre-producto">
                  Nombre del producto
                </label>
                <input
                  id="nombre-producto"
                  type="text"
                  placeholder="Ejemplo: Air Zoom"
                  value={nombreNuevo}
                  onChange={(evento) => {
                    setNombreNuevo(evento.target.value);
                    setError("");
                    setMensaje("");
                  }}
                  aria-invalid={productoDuplicado}
                  aria-describedby={
                    productoDuplicado ? "error-duplicado" : undefined
                  }
                  required
                />

                {productoDuplicado && (
                  <p
                    id="error-duplicado"
                    role="alert"
                    style={{
                      color: "#dc2626",
                      fontSize: "13px",
                      fontWeight: "600",
                      margin: "0 0 10px",
                    }}
                  >
                    Este producto ya está registrado.
                  </p>
                )}

                <label htmlFor="popularidad-producto">
                  Popularidad (0 - 100)
                </label>
                <input
                  id="popularidad-producto"
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  placeholder="Ejemplo: 98"
                  value={popularidadNueva}
                  onChange={(evento) =>
                    setPopularidadNueva(evento.target.value)
                  }
                  required
                />

                <button
                  type="submit"
                  className="primary-button"
                  disabled={productoDuplicado}
                >
                  Agregar producto
                </button>
              </form>
            </section>

            <section className="info-card">
              <span className="section-tag">ESTRUCTURAS</span>
              <h2>Tecnologías utilizadas</h2>

              <div className="estructura-item">
                <span className="estructura-icono">T</span>
                <div>
                  <h3>Árbol Trie</h3>
                  <p>Búsqueda eficiente por prefijos.</p>
                </div>
              </div>

              <div className="estructura-item">
                <span className="estructura-icono">H</span>
                <div>
                  <h3>MinHeap</h3>
                  <p>Selección de los K productos más populares.</p>
                </div>
              </div>

              <div className="estructura-item">
                <span className="estructura-icono">R</span>
                <div>
                  <h3>React</h3>
                  <p>Interfaz dinámica e interactiva.</p>
                </div>
              </div>
            </section>
          </aside>
        </div>

        <section className="catalogo-section">
          <div className="catalogo-header">
            <div>
              <span className="section-tag">INVENTARIO</span>
              <h2>Catálogo de productos</h2>
              <p>
                Administra los productos almacenados
                en nuestro buscador.
              </p>
            </div>

            <button
              type="button"
              className="secondary-button"
              onClick={restaurarProductos}
            >
              Restaurar catálogo
            </button>
          </div>

          {productos.length === 0 ? (
            <div className="catalogo-vacio">
              No hay productos registrados.
            </div>
          ) : (
            <div className="catalogo-grid">
              {productos.map((producto) => (
                <article
                  className="producto-card"
                  key={producto.nombre}
                >
                  <div className="producto-icono">
                    {producto.nombre.charAt(0).toUpperCase()}
                  </div>

                  <div className="producto-info">
                    <h3>{producto.nombre}</h3>
                    <p>
                      Popularidad:
                      <strong> {producto.popularidad}</strong>
                    </p>
                  </div>

                  <button
                    type="button"
                    className="eliminar-button"
                    onClick={() =>
                      eliminarProducto(producto.nombre)
                    }
                  >
                    Eliminar
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>
          SmartSearch | Challenge 12 — Estructura de Datos y Algoritmos
        </p>
      </footer>
    </div>
  );
}

export default App;