// Punto 2: Lista doblemente enlazada (doubly linked list)
// Guarda el historial de pacientes ya atendidos. Cada registro conoce al
// anterior (prev) y al siguiente (next), por lo que el historial se puede
// recorrer hacia atrás o hacia adelante, además de seguir creciendo.

export class RecordNode {
  constructor(record) {
    this.record = record; // { id, name, doctor, attendedAt }
    this.prev = null;
    this.next = null;
  }
}

export class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.current = null; // registro que se está visualizando
    this.size = 0;
  }

  // Se agrega un nuevo registro cuando un paciente termina su atención
  append(record) {
    const node = new RecordNode(record);
    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      node.prev = this.tail;
      this.tail.next = node;
      this.tail = node;
    }
    this.current = node; // el más reciente queda como "actual"
    this.size += 1;
    return this;
  }

  back() {
    if (this.current && this.current.prev) this.current = this.current.prev;
    return this.current;
  }

  forward() {
    if (this.current && this.current.next) this.current = this.current.next;
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
      result.push(node.record);
      node = node.next;
    }
    return result;
  }
}

// Datos simulados: algunos pacientes que ya fueron atendidos antes de abrir el panel
export function buildMockHistory() {
  const list = new DoublyLinkedList();
  const records = [
    { id: 'P-101', name: 'Laura Peña', doctor: 'Dra. López', attendedAt: '08:10 am' },
    { id: 'P-102', name: 'Esteban Cano', doctor: 'Dr. Pérez', attendedAt: '08:32 am' },
    { id: 'P-103', name: 'Rocío Iglesias', doctor: 'Dra. López', attendedAt: '09:05 am' },
  ];
  records.forEach((r) => list.append(r));
  return list;
}
