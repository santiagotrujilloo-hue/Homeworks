import { useState } from "react";
import "./App.css";

import PilaLibros from "./structures/PilaLibros";
import librosPrueba from "./data/librosPrueba";

const pilaInicial = new PilaLibros();

librosPrueba.forEach((libro) => {
  pilaInicial.push(libro);
});

function App() {
  const [pila, setPila] = useState(pilaInicial);

  const [formulario, setFormulario] = useState({
    nombre: "",
    isbn: "",
    autor: "",
    editorial: "",
  });

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario({
      ...formulario,
      [name]: value,
    });
  };

  const agregarLibro = (e) => {
    e.preventDefault();

    if (
      !formulario.nombre.trim() ||
      !formulario.isbn.trim() ||
      !formulario.autor.trim() ||
      !formulario.editorial.trim()
    ) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const nuevoLibro = {
      id: Date.now(),
      ...formulario,
    };

    const nuevaPila = new PilaLibros();

    pila.libros.forEach((libro) => {
      nuevaPila.push(libro);
    });

    nuevaPila.push(nuevoLibro);

    setPila(nuevaPila);

    setFormulario({
      nombre: "",
      isbn: "",
      autor: "",
      editorial: "",
    });
  };

  const libros = pila.obtenerLibros();

  return (
    <div className="app">
      <header className="header">
        <div>
          <span className="logo">BIBLIOTECA</span>
          <h1>Gestión de pila de libros</h1>
        </div>

        <div className="contador">
          <span>{pila.cantidad()}</span>
          <p>Libros</p>
        </div>
      </header>

      <main className="contenido">
        <section className="formulario-contenedor">
          <div className="formulario-header">
            <span className="etiqueta">NUEVO LIBRO</span>

            <h2>Agregar libro</h2>

            <p>
              Ingresa la información del libro para agregarlo en la
              parte superior de la pila.
            </p>
          </div>

          <form onSubmit={agregarLibro}>
            <div className="campo">
              <label htmlFor="nombre">Nombre del libro</label>

              <input
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Ej. Cien años de soledad"
                value={formulario.nombre}
                onChange={manejarCambio}
              />
            </div>

            <div className="campo">
              <label htmlFor="isbn">ISBN</label>

              <input
                id="isbn"
                name="isbn"
                type="text"
                placeholder="Ej. 9780307474728"
                value={formulario.isbn}
                onChange={manejarCambio}
              />
            </div>

            <div className="campo">
              <label htmlFor="autor">Autor</label>

              <input
                id="autor"
                name="autor"
                type="text"
                placeholder="Nombre del autor"
                value={formulario.autor}
                onChange={manejarCambio}
              />
            </div>

            <div className="campo">
              <label htmlFor="editorial">Editorial</label>

              <input
                id="editorial"
                name="editorial"
                type="text"
                placeholder="Nombre de la editorial"
                value={formulario.editorial}
                onChange={manejarCambio}
              />
            </div>

            <button type="submit" className="boton-agregar">
              <span>+</span>
              Agregar libro
            </button>
          </form>
        </section>

        <section className="pila-contenedor">
          <div className="pila-header">
            <div>
              <span className="etiqueta">ESTRUCTURA LIFO</span>

              <h2>Pila de libros</h2>
            </div>

            <div className="lifo">
              <span>Último en entrar</span>
              <strong>Primero en salir</strong>
            </div>
          </div>

          <div className="linea-superior">
            <span>CIMA DE LA PILA</span>
            <div></div>
          </div>

          <div className="lista-libros">
            {libros.length === 0 ? (
              <div className="estado-vacio">
                <span>□</span>

                <h3>No hay libros en la pila</h3>

                <p>
                  Agrega un libro para comenzar.
                </p>
              </div>
            ) : (
              libros.map((libro, index) => (
                <article
                  className={`libro-card ${
                    index === 0 ? "libro-top" : ""
                  }`}
                  key={libro.id}
                >
                  <div className="posicion">
                    {String(
                      libros.length - index
                    ).padStart(2, "0")}
                  </div>

                  <div className="icono-libro">
                    L
                  </div>

                  <div className="info-libro">
                    <div className="titulo-linea">
                      <h3>{libro.nombre}</h3>

                      {index === 0 && (
                        <span className="top-badge">
                          CIMA
                        </span>
                      )}
                    </div>

                    <p className="autor">
                      {libro.autor}
                    </p>

                    <div className="detalles">
                      <span>
                        <small>ISBN</small>
                        {libro.isbn}
                      </span>

                      <span>
                        <small>EDITORIAL</small>
                        {libro.editorial}
                      </span>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;