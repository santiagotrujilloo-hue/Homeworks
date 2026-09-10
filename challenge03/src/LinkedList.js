// Lista enlazada simple
// Cada nodo tiene un dato (song) y apunta al siguiente nodo (next)

class Node {
  constructor(song) {
    this.song = song;
    this.next = null;
  }
}

export class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  // agrega una cancion al final de la lista
  add(song) {
    const newNode = new Node(song);
    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
  }

  // devuelve todas las canciones en un arreglo, en orden
  getAll() {
    const songs = [];
    let node = this.head;
    while (node !== null) {
      songs.push(node.song);
      node = node.next;
    }
    return songs;
  }
}

// canciones de prueba
export function crearListaDeCanciones() {
  const lista = new LinkedList();
  lista.add({ titulo: 'Blinding Lights', artista: 'The Weeknd' });
  lista.add({ titulo: "Don't Start Now", artista: 'Dua Lipa' });
  lista.add({ titulo: 'Levitating', artista: 'Dua Lipa' });
  lista.add({ titulo: 'Watermelon Sugar', artista: 'Harry Styles' });
  lista.add({ titulo: 'Save Your Tears', artista: 'The Weeknd' });
  return lista;
}
