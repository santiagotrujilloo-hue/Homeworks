// Punto 1: Lista enlazada simple (singly linked list)
// Se usa para reproducir canciones en orden: cada nodo solo conoce al siguiente.

export class SongNode {
  constructor(song) {
    this.song = song; // { title, artist, duration }
    this.next = null;
  }
}

export class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  // Agrega una canción al final de la lista
  append(song) {
    const node = new SongNode(song);
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

  // Devuelve un array con las canciones en orden (recorriendo next)
  toArray() {
    const result = [];
    let current = this.head;
    while (current) {
      result.push(current.song);
      current = current.next;
    }
    return result;
  }

  // Devuelve el nodo que sigue al de la canción dada (o null si es la última)
  getNext(currentIndex) {
    let node = this.head;
    let i = 0;
    while (node && i < currentIndex) {
      node = node.next;
      i += 1;
    }
    return node ? node.next : null;
  }
}

// Datos simulados (mock data) para llenar la lista
export function buildMockPlaylist() {
  const list = new LinkedList();
  const songs = [
    { title: 'Blinding Lights', artist: 'The Weeknd', duration: '3:20' },
    { title: 'Don’t Start Now', artist: 'Dua Lipa', duration: '3:03' },
    { title: 'Levitating', artist: 'Dua Lipa', duration: '3:23' },
    { title: 'Watermelon Sugar', artist: 'Harry Styles', duration: '2:54' },
    { title: 'Save Your Tears', artist: 'The Weeknd', duration: '3:35' },
  ];
  songs.forEach((s) => list.append(s));
  return list;
}
