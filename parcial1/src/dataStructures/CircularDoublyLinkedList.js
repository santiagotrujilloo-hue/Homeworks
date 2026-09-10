// Punto 4: Lista circular doblemente enlazada (circular doubly linked list)
// El comité administrativo se modela como un círculo en ambos sentidos:
// head.prev === tail y tail.next === head. Esto permite avanzar o
// retroceder entre los miembros sin nunca "quedarse sin siguiente/anterior".

export class MemberNode {
  constructor(member) {
    this.member = member; // { name, role }
    this.prev = null;
    this.next = null;
  }
}

export class CircularDoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.current = null;
    this.size = 0;
  }

  append(member) {
    const node = new MemberNode(member);
    if (!this.head) {
      this.head = node;
      this.tail = node;
      node.next = node;
      node.prev = node;
      this.current = node;
    } else {
      node.prev = this.tail;
      node.next = this.head;
      this.tail.next = node;
      this.head.prev = node;
      this.tail = node;
    }
    this.size += 1;
    return this;
  }

  // Como el círculo se cierra en ambos sentidos, next()/prev() nunca
  // devuelven null: siempre hay un "siguiente" o "anterior" al cual ir.
  next() {
    if (this.current) this.current = this.current.next;
    return this.current;
  }

  prev() {
    if (this.current) this.current = this.current.prev;
    return this.current;
  }

  toArray() {
    const result = [];
    let node = this.head;
    for (let i = 0; i < this.size; i += 1) {
      result.push(node.member);
      node = node.next;
    }
    return result;
  }
}

// Datos simulados: miembros del comité administrativo
export function buildMockCommittee() {
  const list = new CircularDoublyLinkedList();
  const members = [
    { name: 'Dra. Medina', role: 'Directora médica' },
    { name: 'Sr. Vargas', role: 'Subdirector administrativo' },
    { name: 'Sra. Rojas', role: 'Tesorera' },
    { name: 'Sr. Peña', role: 'Secretario general' },
  ];
  members.forEach((m) => list.append(m));
  return list;
}
