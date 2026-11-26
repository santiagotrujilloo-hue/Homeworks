# SoundLab · Mini plataforma musical educativa

Estructuras de datos implementadas desde cero (`src/structures/`):
- **Trie** → buscador predictivo (insertar, buscar, sugerir por prefijo)
- **Max Heap** → ranking de canciones más escuchadas
- **Grafo no dirigido** → canciones relacionadas / recomendaciones (BFS)
- **Sass** (`src/styles/`) → variables, mixins y estilos reutilizables del panel

## Comandos
```bash
npm install      # instala Vite y Sass (una sola vez)
npm run dev      # abre el panel en http://localhost:5173
npm test         # pruebas de las estructuras
npm run build    # versión de producción en /dist
```

## Sonido
Al pulsar **Escuchar** se busca en la API pública de iTunes el fragmento real de 30 s (requiere internet). Si no hay conexión o no se encuentra, suena una melodía generada con Web Audio (`src/audio.js`).
