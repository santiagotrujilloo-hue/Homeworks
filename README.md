# Cali Delivery

Plataforma web de pedidos de comida valluna a domicilio en Cali, con seguimiento del repartidor en mapa y chat en tiempo real.

## Integrantes

Santiago Trujillo Ortiz 240293

## Enlaces

- **Propuesta gráfica (Figma):** https://www.figma.com/design/L0pQGRnfqwQ16ao9EtAvcz/Cali-Delivery---Propuesta-gr%C3%A1fica?node-id=0-1&t=TqhlPJ1fMJWutYik-0
- **Sitio publicado (Netlify):** https://homeworks-zrw9.netlify.app
- **Documento final:** [docs/DOCUMENTO_FINAL.md](docs/DOCUMENTO_FINAL.md)

## Tecnologías

React 18 · Vite · React Router · SCSS Modules · Firebase (Authentication y Firestore en tiempo real) · Leaflet + OpenStreetMap · Netlify.
No hay backend propio: Firebase cumple esa función y ya está publicado.

## Estructuras de datos

| Estructura | Archivo | Dónde se usa |
|---|---|---|
| Cola | `helpers/dataStructures/Queue.js` | Panel admin: pedidos pendientes en orden de llegada |
| Pila | `helpers/dataStructures/Stack.js` | Carrito: botón "Deshacer" |
| Trie | `helpers/dataStructures/Trie.js` | Autocompletado y búsqueda del menú |
| Heap | `helpers/dataStructures/Heap.js` | Top 5 productos mejor calificados; cola de prioridad de Dijkstra |
| Grafo | `helpers/dataStructures/Graph.js` | Ruta más corta (Dijkstra) cocina → barrio del cliente |

## Ejecutar en local

```bash
npm install
npm run dev
```

## Configuración de Firebase

1. Authentication → activar **Correo electrónico/contraseña**.
2. Firestore → crear base de datos y publicar las reglas de `firestore.rules`.
3. Para crear un administrador: regístrate en la app, abre Firestore → `users` → tu documento y cambia `role` de `user` a `admin`.
4. Entra a `/admin` y pulsa **Cargar productos a la base de datos**.

/admin: elviejotruji1565@gmail.com
contra: Santiago14
