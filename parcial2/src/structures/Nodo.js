export const TIPOS = Object.freeze({
  CARPETA: "carpeta",
  ARCHIVO: "archivo",
});

/**
 * Nodo de un árbol n-ario.
 * Cada nodo guarda su valor (los datos de la carpeta o archivo)
 * y una lista de referencias a sus hijos.
 */
export default class Nodo {
  constructor({ id, nombre, tipo, creadoPor = null, creadoEn = null }) {
    if (!Object.values(TIPOS).includes(tipo)) {
      throw new Error(`Tipo de nodo no válido: ${tipo}`);
    }

    this.id = id;
    this.nombre = nombre;
    this.tipo = tipo;
    this.creadoPor = creadoPor; // correo de quien lo creó (dato validador)
    this.creadoEn = creadoEn;
    this.padre = null;
    this.hijos = [];
  }

  esCarpeta() {
    return this.tipo === TIPOS.CARPETA;
  }

  esArchivo() {
    return this.tipo === TIPOS.ARCHIVO;
  }

  // Hoja: nodo sin hijos (un archivo siempre es hoja)
  esHoja() {
    return this.hijos.length === 0;
  }

  // Un archivo no puede tener hijos; una carpeta sí
  puedeTenerHijos() {
    return this.esCarpeta();
  }

  tieneHijoLlamado(nombre) {
    const buscado = nombre.trim().toLowerCase();
    return this.hijos.some((h) => h.nombre.toLowerCase() === buscado);
  }

  agregarHijo(nodo) {
    if (!this.puedeTenerHijos()) {
      throw new Error(`"${this.nombre}" es un archivo y no puede tener hijos.`);
    }
    if (this.tieneHijoLlamado(nodo.nombre)) {
      throw new Error(`Ya existe "${nodo.nombre}" dentro de "${this.nombre}".`);
    }

    nodo.padre = this;
    this.hijos.push(nodo);
    // Carpetas primero y luego orden alfabético, como un explorador
    this.hijos.sort(Nodo.comparar);
    return nodo;
  }

  eliminarHijo(id) {
    const indice = this.hijos.findIndex((h) => h.id === id);
    if (indice === -1) return null;

    const [eliminado] = this.hijos.splice(indice, 1);
    eliminado.padre = null;
    return eliminado;
  }

  // Nivel: número de saltos hasta la raíz (la raíz es nivel 0)
  get nivel() {
    let nivel = 0;
    let actual = this.padre;
    while (actual) {
      nivel++;
      actual = actual.padre;
    }
    return nivel;
  }

  static comparar(a, b) {
    if (a.tipo !== b.tipo) return a.esCarpeta() ? -1 : 1;
    return a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" });
  }
}
