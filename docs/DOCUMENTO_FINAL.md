# Documento final: Cali Delivery

## 1. Alcance del sistema

Cali Delivery permite a los clientes explorar un menú de comida valluna, armar un carrito, elegir su barrio de entrega y seguir el pedido en un mapa mientras chatean con la cocina. La cocina (administrador) atiende los pedidos en orden de llegada y mueve al repartidor por la ruta.

**Roles**
- **Visitante:** ve el inicio y el menú, busca platos y llena el carrito. Para confirmar debe iniciar sesión.
- **Cliente:** crea pedidos, ve el historial, sigue el pedido en el mapa y usa el chat.
- **Administrador:** atiende la cola de pedidos, cambia estados, mueve al repartidor y responde chats.

**Funcionalidades principales**
- Registro e inicio de sesión reales (Firebase Authentication).
- Datos persistentes y en tiempo real (Firestore): productos, pedidos y mensajes.
- Mapa con la ruta de entrega y la posición del repartidor (Leaflet).
- Chat por pedido en tiempo real.
- Menús y rutas públicas, de usuario (`/cuenta/*`) y de administrador (`/admin/*`).

## 2. Tecnologías

| Tecnología | Uso |
|---|---|
| React 18 + Vite | Interfaz y herramienta de compilación |
| React Router 6 | Navegación y rutas protegidas por rol |
| SCSS Modules | Estilos aislados por componente |
| Firebase Authentication | Registro e inicio de sesión |
| Cloud Firestore | Base de datos en tiempo real y reglas de seguridad por rol |
| Leaflet + OpenStreetMap | Mapas sin clave de API |
| Netlify | Publicación del frontend |

## 3. Estructura del proyecto

```
src/
  helpers/      funciones generales y estructuras de datos
  context/      AuthContext, CartContext
  hooks/        useProducts, useOrders, useChat
  routes/       AppRoutes, UserRoutes, AdminRoutes
  pages/        Home, Menu, Cart, Login, Register, Orders, OrderTracking, AdminDashboard
  components/   Index (ProductCard) y Shared (Navbar, SearchBar, MapView, ChatBox...)
  firebase/     configuración de Firebase
```

## 4. Estructuras de datos y por qué se eligieron

### Cola (Queue), implementada con lista enlazada
**Dónde:** panel de administración. Los pedidos con estado "pendiente" entran a la cola ordenados por hora de llegada, y "Atender siguiente" hace `dequeue`.
**Por qué:** el criterio de negocio es justo y simple: primero en llegar, primero en ser atendido (FIFO). Con lista enlazada, encolar y desencolar cuestan O(1); un arreglo con `shift` costaría O(n).

### Pila (Stack)
**Dónde:** carrito de compras. Antes de cada cambio se guarda el estado anterior; "Deshacer" hace `pop`.
**Por qué:** deshacer exige recuperar siempre lo último que se hizo (LIFO). La pila lo resuelve con `push`/`pop` en O(1) y permite deshacer varios pasos seguidos.

### Trie (árbol de prefijos)
**Dónde:** buscador del inicio y del menú. Cada palabra de cada producto se indexa en el árbol.
**Por qué:** el autocompletado consulta por prefijo en cada letra. En un Trie el costo depende de la longitud del texto escrito (O(m)), no de la cantidad de productos. Recorrer todo el catálogo con `filter` crece con el menú.

### Heap (montículo binario)
**Dónde:** (1) "Los más pedidos" en el inicio obtiene los 5 productos mejor calificados; (2) sirve de cola de prioridad dentro de Dijkstra.
**Por qué:** el heap entrega siempre el elemento de mayor prioridad con inserción y extracción en O(log n), sin reordenar toda la lista.

### Grafo ponderado + Dijkstra
**Dónde:** la ciudad se modela como 11 nodos (barrios) y 14 aristas (calles), con el peso en kilómetros. Al elegir el barrio, Dijkstra calcula la ruta más corta desde la cocina; esa ruta se dibuja en el mapa y define el tiempo estimado y los pasos del repartidor.
**Por qué:** un mapa de vías es una red de conexiones con costos, y el grafo es la estructura natural para representarlo. Dijkstra encuentra el camino mínimo cuando los pesos no son negativos.

## 5. Datos en Firestore

- `users/{uid}`: nombre, correo, rol (`user` o `admin`).
- `products/{id}`: nombre, precio, categoría, calificación, emoji.
- `orders/{id}`: cliente, productos, total, destino, ruta, distancia, tiempo estimado, estado, posición del repartidor.
- `orders/{id}/messages/{id}`: texto, emisor, fecha (chat).

Las reglas de seguridad (`firestore.rules`) limitan cada pedido a su dueño y al administrador, y solo el administrador puede modificar productos y estados.
