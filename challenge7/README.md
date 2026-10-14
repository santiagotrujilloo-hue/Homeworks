# Challenge 07 — Bitácora (Firebase Login + Tareas)

Transformación de la *Fake Login App* del Challenge 06 a una app real con Firebase.

## Qué incluye

| Requisito | Dónde está |
|---|---|
| Login, registro y logout con Firebase | `src/hooks/useFirebaseAuth.js` (`signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, `signOut`) |
| Rutas `/login`, `/register` y `/tasks` protegida | `src/App.jsx`, `src/components/PublicRoute.jsx`, `src/components/PrivateRoute.jsx` |
| App de tareas: crear, editar, borrar y marcar hecha/pendiente | `src/pages/TasksPage.jsx`, `src/components/` |
| Contexto para los datos de tareas | `src/context/TasksContext.js` + `TasksProvider.jsx` |
| Contexto distinto para login/registro | `src/context/AuthContext.js` + `AuthProvider.jsx` |
| Custom hooks con la lógica de Firebase | `useFirebaseAuth` (Auth) y `useCollection` (CRUD de Firestore) |
| Librería CSS + SASS | React Bootstrap, con Bootstrap compilado desde Sass en `src/styles/` (variables, nesting, mixins, operaciones, funciones y `@each`) |

Las tareas se guardan en la colección `tasks` de Cloud Firestore con los campos
`title`, `notes`, `priority`, `done`, `uid`, `createdAt`. Cada usuario solo ve las suyas
(filtro `["uid", "==", user.uid]`).

## Configurar Firebase

Proyecto usado: **tareas-challenge7** (ya configurado en `src/firebase/config.js`).

Para replicarlo en otro proyecto:

1. En <https://console.firebase.google.com/> crear un proyecto.
2. **Authentication → Comenzar → Correo electrónico/contraseña → Habilitar**.
3. **Firestore Database → Crear base de datos** y pegar en **Reglas** el contenido de `firestore.rules`.
4. **Configuración del proyecto → General → Tus apps → Web (`</>`)**, registrar la app y copiar el objeto `firebaseConfig`.
5. Pegar ese objeto en `src/firebase/config.js`.

## Ejecutar

```bash
npm install
npm run dev
```
