# Parcial 2 — Explorador de carpetas con árbol n-ario

Aplicación web en React que gestiona un sistema jerárquico de carpetas y archivos usando un
**árbol n-ario implementado desde cero**, con login y persistencia en **Firebase**.

## Requisitos y dónde se cumplen

| Requisito | Implementación |
|---|---|
| Árbol n-ario desde cero | `src/structures/Nodo.js` (valor + lista de `hijos`, `agregarHijo`) y `src/structures/ArbolNario.js` (`buscar`, `insertar`, `eliminar`, `dfs`, `bfs`, `postOrden`, `altura`, `ruta`, `contar`, `desdeRegistros`) |
| Login con Firebase | `src/hooks/useFirebaseAuth.js` (`signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, `signOut`) + rutas `/login` y `/register` |
| Solo usuarios registrados crean carpetas/archivos | `PrivateRoute`, validación en `FileSystemProvider.crear` y reglas de Firestore (`firestore.rules`) |
| El árbol queda en base de datos y se puede consultar a futuro | Colección `nodos` de Cloud Firestore: cada documento guarda `nombre`, `tipo`, `padreId`, `nivel`, `creadoPor`, `uid`, `creadoEn`. Al cargar, `ArbolNario.desdeRegistros` reconstruye el árbol |
| Correo de quien creó la carpeta/archivo como dato validador | Campo `creadoPor`; las reglas exigen que sea igual al correo del usuario autenticado y solo ese correo puede renombrar o eliminar |
| Un archivo no puede tener hijos, una carpeta sí | `Nodo.agregarHijo` lanza error si el nodo es archivo; la interfaz bloquea la creación y las reglas de Firestore verifican que el padre sea una carpeta |
| Presentación visual con SASS | `src/styles/` — tokens con variables, mapas, funciones, mixins, `@each` y nesting |

### Buenas prácticas de clase
- **Custom hooks** para Firebase: `useFirebaseAuth`, `useCollection` (CRUD genérico).
- **Contextos separados**: `AuthContext` (sesión) y `FileSystemContext` (árbol compartido entre componentes).
- **Rutas protegidas** con React Router.
- Recorridos **DFS** (recursivo) y **BFS** (con cola) visibles en pantalla.

## Firebase

Proyecto: **parcial2-arbol** (`parcial2-arbol-c6f27`), ya configurado en `src/firebase/config.js`.
Las reglas publicadas están en `firestore.rules`.

## Ejecutar

```bash
npm install
npm run dev
```
