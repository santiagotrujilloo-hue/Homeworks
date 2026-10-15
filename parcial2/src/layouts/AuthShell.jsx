import { useMemo } from "react";
import ArbolNario, { RAIZ_ID } from "../structures/ArbolNario";
import Nodo, { TIPOS } from "../structures/Nodo";

// Árbol de ejemplo dibujado al estilo del comando `tree` usando un recorrido DFS
function arbolDeMuestra() {
  const arbol = new ArbolNario();
  const n = (id, tipo = TIPOS.CARPETA) => new Nodo({ id, nombre: id, tipo });
  arbol.insertar(RAIZ_ID, n("universidad"));
  arbol.insertar("universidad", n("estructuras-2"));
  arbol.insertar("estructuras-2", n("parcial2.jsx", TIPOS.ARCHIVO));
  arbol.insertar("estructuras-2", n("arbol-nario.js", TIPOS.ARCHIVO));
  arbol.insertar("universidad", n("horario.pdf", TIPOS.ARCHIVO));
  arbol.insertar(RAIZ_ID, n("notas.txt", TIPOS.ARCHIVO));
  return arbol;
}

function lineas(nodo, prefijo = "", esUltimo = true, raiz = true) {
  const actual = raiz
    ? [{ texto: "raíz/", tipo: TIPOS.CARPETA }]
    : [
        {
          texto: `${prefijo}${esUltimo ? "└── " : "├── "}${nodo.nombre}${nodo.esCarpeta() ? "/" : ""}`,
          tipo: nodo.tipo,
        },
      ];
  const siguiente = raiz ? "" : prefijo + (esUltimo ? "    " : "│   ");
  return nodo.hijos.reduce(
    (acc, hijo, i) => acc.concat(lineas(hijo, siguiente, i === nodo.hijos.length - 1, false)),
    actual
  );
}

function AuthShell({ title, subtitle, children }) {
  const muestra = useMemo(() => lineas(arbolDeMuestra().raiz), []);

  return (
    <main className="auth">
      <div className="auth__window">
        <header className="auth__bar">
          <span className="dots" aria-hidden="true"><i /><i /><i /></span>
          <span className="mono">raíz/ — explorador n-ario</span>
        </header>

        <div className="auth__grid">
          <pre className="auth__tree" aria-hidden="true">
            {muestra.map((l, i) => (
              <span key={i} className={`ln ln--${l.tipo}`}>
                {l.texto}
                {"\n"}
              </span>
            ))}
          </pre>

          <section className="auth__form">
            <h1>{title}</h1>
            <p className="auth__sub">{subtitle}</p>
            {children}
          </section>
        </div>
      </div>
      <p className="auth__foot mono">Parcial 2 · Estructuras de Datos II · Firebase Auth + Cloud Firestore</p>
    </main>
  );
}

export default AuthShell;
