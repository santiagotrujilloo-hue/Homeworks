import Nodo, { TIPOS } from "./Nodo";

export const RAIZ_ID = "raiz";

/**
 * Árbol n-ario implementado desde cero.
 * Cada carpeta puede tener cualquier cantidad de hijos (carpetas o archivos);
 * los archivos siempre son hojas.
 */
export default class ArbolNario {
  constructor(nombreRaiz = "raíz") {
    this.raiz = new Nodo({ id: RAIZ_ID, nombre: nombreRaiz, tipo: TIPOS.CARPETA });
  }

  // ── Búsqueda (DFS recursivo) ──────────────────────────────
  buscar(id, nodo = this.raiz) {
    if (nodo.id === id) return nodo;

    for (const hijo of nodo.hijos) {
      const encontrado = this.buscar(id, hijo);
      if (encontrado) return encontrado;
    }
    return null;
  }

  // ── Inserción ─────────────────────────────────────────────
  insertar(padreId, nodo) {
    const padre = this.buscar(padreId);
    if (!padre) throw new Error("La carpeta de destino no existe.");
    return padre.agregarHijo(nodo);
  }

  // ── Eliminación: quita el nodo y todo su subárbol ─────────
  eliminar(id) {
    if (id === RAIZ_ID) throw new Error("La raíz no se puede eliminar.");

    const nodo = this.buscar(id);
    if (!nodo) return [];

    const eliminados = this.postOrden(nodo); // hijos antes que el padre
    nodo.padre.eliminarHijo(id);
    return eliminados;
  }

  // ── Recorridos ────────────────────────────────────────────

  // DFS: baja lo más profundo posible por una rama antes de seguir con otra
  dfs(nodo = this.raiz, resultado = []) {
    resultado.push(nodo);
    for (const hijo of nodo.hijos) {
      this.dfs(hijo, resultado);
    }
    return resultado;
  }

  // BFS: recorre nivel por nivel, de izquierda a derecha (usa una cola)
  bfs(nodo = this.raiz) {
    const resultado = [];
    const cola = [nodo];

    while (cola.length > 0) {
      const actual = cola.shift();
      resultado.push(actual);
      cola.push(...actual.hijos);
    }
    return resultado;
  }

  // Post-orden: primero los hijos y luego el padre (útil para borrar)
  postOrden(nodo = this.raiz, resultado = []) {
    for (const hijo of nodo.hijos) {
      this.postOrden(hijo, resultado);
    }
    resultado.push(nodo);
    return resultado;
  }

  // ── Consultas ─────────────────────────────────────────────

  // Altura: nivel máximo que se encuentra en el árbol
  altura(nodo = this.raiz) {
    if (nodo.esHoja()) return 0;
    return 1 + Math.max(...nodo.hijos.map((h) => this.altura(h)));
  }

  // Camino desde la raíz hasta el nodo
  ruta(id) {
    const camino = [];
    let actual = this.buscar(id);
    while (actual) {
      camino.unshift(actual);
      actual = actual.padre;
    }
    return camino;
  }

  rutaTexto(id) {
    return "/" + this.ruta(id).slice(1).map((n) => n.nombre).join("/");
  }

  contar(nodo = this.raiz) {
    const todos = this.dfs(nodo).filter((n) => n.id !== RAIZ_ID);
    return {
      carpetas: todos.filter((n) => n.esCarpeta()).length,
      archivos: todos.filter((n) => n.esArchivo()).length,
      total: todos.length,
    };
  }

  // Nodos del subárbol que NO creó el correo indicado
  ajenosEnSubarbol(id, correo) {
    const nodo = this.buscar(id);
    if (!nodo) return [];
    return this.dfs(nodo).filter((n) => n.creadoPor !== correo);
  }

  buscarPorNombre(texto) {
    const buscado = texto.trim().toLowerCase();
    if (!buscado) return [];
    return this.dfs().filter(
      (n) => n.id !== RAIZ_ID && n.nombre.toLowerCase().includes(buscado)
    );
  }

  /**
   * Reconstruye el árbol a partir de los registros planos guardados en
   * la base de datos. Cada registro tiene su propio id y el id de su padre.
   */
  static desdeRegistros(registros) {
    const arbol = new ArbolNario();
    const nodos = new Map();

    for (const r of registros) {
      nodos.set(
        r.id,
        new Nodo({
          id: r.id,
          nombre: r.nombre,
          tipo: r.tipo,
          creadoPor: r.creadoPor,
          creadoEn: r.creadoEn ?? null,
        })
      );
    }

    nodos.set(RAIZ_ID, arbol.raiz);

    for (const r of registros) {
      const padre = nodos.get(r.padreId);
      const hijo = nodos.get(r.id);
      // Se ignoran registros huérfanos o inválidos (p. ej. hijos de un archivo)
      if (!padre || !padre.puedeTenerHijos() || padre.tieneHijoLlamado(hijo.nombre)) {
        continue;
      }
      padre.agregarHijo(hijo);
    }

    return arbol;
  }
}
