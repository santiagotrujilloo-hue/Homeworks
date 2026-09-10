// Lista doblemente enlazada
// Cada nodo tiene un dato (page) y apunta al anterior (prev) y al siguiente (next)

class Node {
  constructor(page) {
    this.page = page;
    this.prev = null;
    this.next = null;
  }
}

export class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.current = null;
  }

  add(page) {
    const newNode = new Node(page);
    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
      this.current = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }
  }

  atras() {
    if (this.current && this.current.prev) {
      this.current = this.current.prev;
    }
  }

  adelante() {
    if (this.current && this.current.next) {
      this.current = this.current.next;
    }
  }

  getAll() {
    const pages = [];
    let node = this.head;
    while (node !== null) {
      pages.push(node.page);
      node = node.next;
    }
    return pages;
  }
}

// paginas de prueba (historial ya "visitado")
export function crearHistorial() {
  const historial = new DoublyLinkedList();
  historial.add({ url: '/inicio' });
  historial.add({ url: '/catalogo' });
  historial.add({ url: '/catalogo/zapatos' });
  historial.add({ url: '/producto/442' });
  historial.add({ url: '/carrito' });
  // dejamos el puntero a la mitad, como si ya hubiera navegado
  historial.current = historial.head.next.next;
  return historial;
}
