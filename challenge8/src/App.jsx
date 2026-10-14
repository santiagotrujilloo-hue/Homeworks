import { useEffect, useMemo, useState } from "react";
import Tree from "react-d3-tree";
import "./App.css";

import BinarySearchTree from "./structures/BinarySearchTree";

const numerosIniciales = [50, 30, 70, 20, 40, 60, 80];

function App() {
  const [numeros, setNumeros] = useState(numerosIniciales);

  const [nuevoValor, setNuevoValor] = useState("");
  const [valorBusqueda, setValorBusqueda] = useState("");

  const [resultadoBusqueda, setResultadoBusqueda] = useState(null);

  const arbol = useMemo(() => {
    const nuevoArbol = new BinarySearchTree();

    numeros.forEach((numero) => {
      nuevoArbol.insert(numero);
    });

    return nuevoArbol;
  }, [numeros]);

  const inorder = arbol.inorder();
  const preorder = arbol.preorder();
  const postorder = arbol.postorder();

  const datosArbol = arbol.toD3Data();

  useEffect(() => {
    console.clear();

    console.log("ÁRBOL BINARIO DE BÚSQUEDA");
    console.log("-----------------------------");

    console.log("Valores insertados:");
    console.log(numeros);

    console.log("Recorrido Inorder:");
    console.log(inorder);

    console.log("Recorrido Preorder:");
    console.log(preorder);

    console.log("Recorrido Postorder:");
    console.log(postorder);
  }, [numeros]);

  const manejarInsercion = (e) => {
    e.preventDefault();

    const valor = Number(nuevoValor);

    if (nuevoValor === "" || Number.isNaN(valor)) {
      return;
    }

    if (arbol.contains(valor)) {
      alert("Este valor ya existe en el árbol.");
      return;
    }

    setNumeros((numerosActuales) => [
      ...numerosActuales,
      valor,
    ]);

    setNuevoValor("");
    setResultadoBusqueda(null);
  };

  const manejarBusqueda = (e) => {
    e.preventDefault();

    const valor = Number(valorBusqueda);

    if (valorBusqueda === "" || Number.isNaN(valor)) {
      return;
    }

    const existe = arbol.contains(valor);

    console.log(
      `Buscando el valor ${valor}:`,
      existe ? "Encontrado" : "No encontrado"
    );

    setResultadoBusqueda({
      value: valor,
      exists: existe,
    });
  };

  const reiniciarArbol = () => {
    setNumeros(numerosIniciales);
    setValorBusqueda("");
    setNuevoValor("");
    setResultadoBusqueda(null);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <div className="brand-icon">A</div>

          <div>
            <span>CHALLENGE 08</span>
            <h1>Laboratorio de árbol binario</h1>
          </div>
        </div>

        <div className="tree-status">
          <div className="status-dot"></div>

          <div>
            <small>ESTADO DEL ÁRBOL</small>
            <strong>
              {numeros.length}{" "}
              {numeros.length === 1 ? "nodo" : "nodos"}
            </strong>
          </div>
        </div>
      </header>

      <main className="main-content">
        <aside className="control-panel">
          <div className="panel-heading">
            <span>CONTROLES DEL BST</span>

            <h2>Administrar árbol</h2>

            <p>
              Inserta números y comprueba si un valor se encuentra
              dentro del árbol binario de búsqueda.
            </p>
          </div>

          <section className="control-section">
            <div className="control-title">
              <span>01</span>

              <div>
                <strong>Insertar nodo</strong>
                <small>Agrega un número al árbol</small>
              </div>
            </div>

            <form
              className="control-form"
              onSubmit={manejarInsercion}
            >
              <input
                type="number"
                placeholder="Ej. 45"
                value={nuevoValor}
                onChange={(e) =>
                  setNuevoValor(e.target.value)
                }
              />

              <button type="submit">
                Agregar
              </button>
            </form>
          </section>

          <section className="control-section">
            <div className="control-title">
              <span>02</span>

              <div>
                <strong>Buscar valor</strong>
                <small>
                  Comprueba si un número existe
                </small>
              </div>
            </div>

            <form
              className="control-form"
              onSubmit={manejarBusqueda}
            >
              <input
                type="number"
                placeholder="Ej. 60"
                value={valorBusqueda}
                onChange={(e) =>
                  setValorBusqueda(e.target.value)
                }
              />

              <button type="submit">
                Buscar
              </button>
            </form>

            {resultadoBusqueda && (
              <div
                className={`search-result ${
                  resultadoBusqueda.exists
                    ? "found"
                    : "not-found"
                }`}
              >
                <div>
                  {resultadoBusqueda.exists ? "✓" : "×"}
                </div>

                <span>
                  El valor{" "}
                  <strong>
                    {resultadoBusqueda.value}
                  </strong>{" "}
                  {resultadoBusqueda.exists
                    ? "se encuentra en el árbol."
                    : "no se encuentra en el árbol."}
                </span>
              </div>
            )}
          </section>

          <section className="values-section">
            <span>VALORES ACTUALES</span>

            <div className="values-list">
              {numeros.map((numero) => (
                <div key={numero}>
                  {numero}
                </div>
              ))}
            </div>
          </section>

          <button
            className="reset-button"
            onClick={reiniciarArbol}
          >
            Reiniciar árbol
          </button>
        </aside>

        <section className="tree-area">
          <div className="tree-heading">
            <div>
              <span>VISUALIZACIÓN</span>

              <h2>Árbol binario de búsqueda</h2>

              <p>
                Los valores menores se ubican a la izquierda y
                los valores mayores a la derecha.
              </p>
            </div>

            <div className="bst-badge">
              <strong>BST</strong>
              <span>Estructura</span>
            </div>
          </div>

          <div className="tree-wrapper">
            {datosArbol && (
              <Tree
                data={datosArbol}
                orientation="vertical"
                translate={{
                  x: 430,
                  y: 70,
                }}
                nodeSize={{
                  x: 130,
                  y: 100,
                }}
                separation={{
                  siblings: 1.1,
                  nonSiblings: 1.3,
                }}
                pathFunc="step"
                zoomable={true}
                draggable={true}
                collapsible={false}
                rootNodeClassName="node-root"
                branchNodeClassName="node-branch"
                leafNodeClassName="node-leaf"
              />
            )}
          </div>

          <div className="traversals">
            <article className="traversal-card">
              <div className="traversal-number">
                01
              </div>

              <div>
                <span>INORDER</span>

                <h3>
                  Izquierda → Raíz → Derecha
                </h3>

                <p>{inorder.join(" → ")}</p>
              </div>
            </article>

            <article className="traversal-card">
              <div className="traversal-number">
                02
              </div>

              <div>
                <span>PREORDER</span>

                <h3>
                  Raíz → Izquierda → Derecha
                </h3>

                <p>{preorder.join(" → ")}</p>
              </div>
            </article>

            <article className="traversal-card">
              <div className="traversal-number">
                03
              </div>

              <div>
                <span>POSTORDER</span>

                <h3>
                  Izquierda → Derecha → Raíz
                </h3>

                <p>{postorder.join(" → ")}</p>
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;