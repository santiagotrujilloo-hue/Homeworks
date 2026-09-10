// Lista enlazada simple
// cada nodo tiene un paciente y apunta al siguiente (next)

class Node {
  constructor(paciente) {
    this.paciente = paciente;
    this.next = null;
  }
}

export class ListaEspera {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  // el paciente nuevo entra al final de la fila
  agregar(paciente) {
    const nodo = new Node(paciente);
    if (this.head === null) {
      this.head = nodo;
      this.tail = nodo;
    } else {
      this.tail.next = nodo;
      this.tail = nodo;
    }
  }

  // se atiende al primero de la fila
  atender() {
    if (this.head === null) return null;
    const paciente = this.head.paciente;
    this.head = this.head.next;
    if (this.head === null) this.tail = null;
    return paciente;
  }

  getAll() {
    const pacientes = [];
    let nodo = this.head;
    while (nodo !== null) {
      pacientes.push(nodo.paciente);
      nodo = nodo.next;
    }
    return pacientes;
  }
}

export function crearSalaDeEspera() {
  const sala = new ListaEspera();
  sala.agregar({ id: 'P-104', nombre: 'Ana Gómez', motivo: 'Control general' });
  sala.agregar({ id: 'P-105', nombre: 'Carlos Ruiz', motivo: 'Dolor abdominal' });
  sala.agregar({ id: 'P-106', nombre: 'Marta Salcedo', motivo: 'Fiebre' });
  return sala;
}
