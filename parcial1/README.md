# Parcial 1 - Panel de turnos de una clínica

## Cómo correrlo

```
npm install
npm run dev
```

## Archivos importantes

- `src/ListaEspera.js` -> lista enlazada simple (pacientes en espera).
- `src/Historial.js` -> lista doblemente enlazada (historial de atención).
- `src/RotacionDoctores.js` -> lista circular simple (guardia de médicos, cambia sola cada 10 segundos).
- `src/Comite.js` -> lista circular doblemente enlazada (comité administrativo).
- `src/App.jsx` -> panel que junta las 4 listas. Al atender un paciente se saca de la sala de espera y se agrega al historial.
