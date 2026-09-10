// Punto 1: Lista enlazada simple (singly linked list)
// Se usa como cola de pacientes en espera: entran por el final (enqueue)
// y se atienden por el principio (dequeue), en orden de llegada.

export class PatientNode {
  constructor(patient) {
    this.patient = patient; // { id, name, reason }
    this.next = null;
  }
}

export class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  // Un paciente nuevo llega y se pone al final de la fila
  enqueue(patient) {
    const node = new PatientNode(patient);
    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
    this.size += 1;
    return this;
  }

  // Se atiende al paciente que lleva más tiempo esperando (el primero)
  dequeue() {
    if (!this.head) return null;
    const node = this.head;
    this.head = this.head.next;
    if (!this.head) this.tail = null;
    this.size -= 1;
    return node.patient;
  }

  toArray() {
    const result = [];
    let current = this.head;
    while (current) {
      result.push(current.patient);
      current = current.next;
    }
    return result;
  }
}

// Datos simulados: pacientes ya esperando en la fila
export function buildMockWaitingList() {
  const list = new LinkedList();
  const patients = [
    { id: 'P-104', name: 'Ana Gómez', reason: 'Control general' },
    { id: 'P-105', name: 'Carlos Ruiz', reason: 'Dolor abdominal' },
    { id: 'P-106', name: 'Marta Salcedo', reason: 'Fiebre' },
    { id: 'P-107', name: 'Julián Reyes', reason: 'Chequeo post-operatorio' },
  ];
  patients.forEach((p) => list.enqueue(p));
  return list;
}
