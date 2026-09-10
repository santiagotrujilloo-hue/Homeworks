// Punto 2: Lista doblemente enlazada (doubly linked list)
// Se usa para navegar atrás/adelante entre páginas visitadas, como el historial de un navegador.
// Cada nodo conoce al anterior (prev) y al siguiente (next).

export class PageNode {
  constructor(page) {
    this.page = page; // { url, title }
    this.prev = null;
    this.next = null;
  }
}

export class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.current = null; // nodo actualmente "visitado"
    this.size = 0;
  }

  // Agrega una página visitada al final de la lista
  append(page) {
    const node = new PageNode(page);
    if (!this.head) {
      this.head = node;
      this.tail = node;
      this.current = node;
    } else {
      node.prev = this.tail;
      this.tail.next = node;
      this.tail = node;
    }
    this.size += 1;
    return this;
  }

  // Mueve el puntero "current" hacia atrás (historial) si es posible
  back() {
    if (this.current && this.current.prev) {
      this.current = this.current.prev;
    }
    return this.current;
  }

  // Mueve el puntero "current" hacia adelante (historial) si es posible
  forward() {
    if (this.current && this.current.next) {
      this.current = this.current.next;
    }
    return this.current;
  }

  canGoBack() {
    return !!(this.current && this.current.prev);
  }

  canGoForward() {
    return !!(this.current && this.current.next);
  }

  toArray() {
    const result = [];
    let node = this.head;
    while (node) {
      result.push(node.page);
      node = node.next;
    }
    return result;
  }
}

// Datos simulados (fake data) de páginas ya "visitadas"
export function buildMockHistory() {
  const list = new DoublyLinkedList();
  const pages = [
    { url: '/inicio', title: 'Inicio' },
    { url: '/catalogo', title: 'Catálogo' },
    { url: '/catalogo/zapatos', title: 'Zapatos' },
    { url: '/producto/442', title: 'Producto #442' },
    { url: '/carrito', title: 'Carrito' },
  ];
  pages.forEach((p) => list.append(p));
  // Dejamos el puntero "current" a la mitad del historial, como si el
  // usuario ya hubiera navegado y ahora pudiera ir atrás o adelante.
  list.current = list.head.next.next; // "Zapatos"
  return list;
}
