export const CANCIONES = [
  { titulo: 'Bohemian Rhapsody', artista: 'Queen', genero: 'Rock', reproducciones: 980 },
  { titulo: 'Billie Jean', artista: 'Michael Jackson', genero: 'Pop', reproducciones: 870 },
  { titulo: 'Blinding Lights', artista: 'The Weeknd', genero: 'Pop', reproducciones: 1200 },
  { titulo: 'Bailando', artista: 'Enrique Iglesias', genero: 'Latino', reproducciones: 640 },
  { titulo: 'Believer', artista: 'Imagine Dragons', genero: 'Rock', reproducciones: 720 },
  { titulo: 'Imagine', artista: 'John Lennon', genero: 'Rock', reproducciones: 910 },
  { titulo: 'Hotel California', artista: 'Eagles', genero: 'Rock', reproducciones: 850 },
  { titulo: 'Stairway to Heaven', artista: 'Led Zeppelin', genero: 'Rock', reproducciones: 780 },
  { titulo: 'Shape of You', artista: 'Ed Sheeran', genero: 'Pop', reproducciones: 1100 },
  { titulo: 'Salad Days', artista: 'Mac DeMarco', genero: 'Indie', reproducciones: 210 },
  { titulo: 'Despacito', artista: 'Luis Fonsi', genero: 'Latino', reproducciones: 1300 },
  { titulo: 'Danza Kuduro', artista: 'Don Omar', genero: 'Latino', reproducciones: 560 },
  { titulo: 'Dákiti', artista: 'Bad Bunny', genero: 'Latino', reproducciones: 690 },
  { titulo: 'Súbeme la Radio', artista: 'Enrique Iglesias', genero: 'Latino', reproducciones: 430 },
  { titulo: 'Levitating', artista: 'Dua Lipa', genero: 'Pop', reproducciones: 760 },
  { titulo: 'Take On Me', artista: 'a-ha', genero: 'Pop', reproducciones: 520 },
];

// Cada par es una arista (no dirigida) entre canciones similares
export const RELACIONES = [
  ['Bohemian Rhapsody', 'Stairway to Heaven'], ['Bohemian Rhapsody', 'Hotel California'],
  ['Hotel California', 'Stairway to Heaven'], ['Imagine', 'Bohemian Rhapsody'],
  ['Billie Jean', 'Blinding Lights'], ['Blinding Lights', 'Shape of You'],
  ['Blinding Lights', 'Levitating'], ['Levitating', 'Billie Jean'],
  ['Believer', 'Shape of You'], ['Take On Me', 'Blinding Lights'],
  ['Despacito', 'Bailando'], ['Despacito', 'Danza Kuduro'], ['Dákiti', 'Despacito'],
  ['Bailando', 'Súbeme la Radio'], ['Danza Kuduro', 'Súbeme la Radio'],
];
