import { useMemo, useState } from 'react';
import { buildMockPlaylist } from '../dataStructures/LinkedList';

export default function SongsPage() {
  // La lista se construye una sola vez (mock data)
  const playlist = useMemo(() => buildMockPlaylist(), []);
  const [currentIndex, setCurrentIndex] = useState(0);

  const songs = playlist.toArray();
  const currentSong = songs[currentIndex];
  const isLast = currentIndex === songs.length - 1;

  const playNext = () => {
    // Avanzamos siguiendo el puntero "next" del nodo actual
    const nextNode = playlist.getNext(currentIndex);
    if (nextNode) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const restart = () => setCurrentIndex(0);

  return (
    <section className="page songs-page">
      <header className="page-header">
        <span className="page-eyebrow">Lista enlazada simple</span>
        <h1>Reproductor en orden</h1>
        <p>
          Cada canción apunta solo a la siguiente (<code>next</code>). El
          reproductor avanza en una única dirección, nodo por nodo.
        </p>
      </header>

      <div className="player-card">
        <div className="player-art" aria-hidden="true">
          ♪
        </div>
        <div className="player-info">
          <h2>{currentSong.title}</h2>
          <p className="player-artist">{currentSong.artist}</p>
          <p className="player-duration">{currentSong.duration}</p>
        </div>
        <div className="player-controls">
          <button onClick={restart} className="btn btn-ghost">
            Reiniciar
          </button>
          <button onClick={playNext} className="btn btn-primary" disabled={isLast}>
            {isLast ? 'Fin de la lista' : 'Siguiente ▸'}
          </button>
        </div>
      </div>

      <ol className="track-list">
        {songs.map((song, i) => (
          <li key={song.title} className={i === currentIndex ? 'active' : ''}>
            <span className="track-index">{i + 1}</span>
            <span>{song.title}</span>
            <span className="track-artist">{song.artist}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
