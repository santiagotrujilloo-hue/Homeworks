import { Graph } from './dataStructures/Graph';

export const ORIGIN = 'granada'; // Cocina central

export const PLACES = [
  { id: 'granada', name: 'Granada (cocina central)', lat: 3.4585, lng: -76.5373 },
  { id: 'versalles', name: 'Versalles', lat: 3.4680, lng: -76.5300 },
  { id: 'chipichape', name: 'Chipichape', lat: 3.4770, lng: -76.5270 },
  { id: 'centro', name: 'Centro', lat: 3.4516, lng: -76.5320 },
  { id: 'sanantonio', name: 'San Antonio', lat: 3.4480, lng: -76.5430 },
  { id: 'sanfernando', name: 'San Fernando', lat: 3.4330, lng: -76.5410 },
  { id: 'tequendama', name: 'Tequendama', lat: 3.4260, lng: -76.5330 },
  { id: 'ciudadjardin', name: 'Ciudad Jardín', lat: 3.3750, lng: -76.5400 },
  { id: 'univalle', name: 'Univalle (Meléndez)', lat: 3.3760, lng: -76.5330 },
  { id: 'uao', name: 'UAO', lat: 3.3540, lng: -76.5230 },
  { id: 'pance', name: 'Pance', lat: 3.3350, lng: -76.5420 },
];

const EDGES = [
  ['granada', 'versalles'], ['granada', 'centro'], ['versalles', 'chipichape'],
  ['versalles', 'centro'], ['centro', 'sanantonio'], ['centro', 'tequendama'],
  ['sanantonio', 'sanfernando'], ['sanfernando', 'tequendama'],
  ['sanfernando', 'ciudadjardin'], ['tequendama', 'ciudadjardin'],
  ['ciudadjardin', 'univalle'], ['univalle', 'uao'], ['univalle', 'pance'],
  ['uao', 'pance'],
];

export const placeById = (id) => PLACES.find((p) => p.id === id);

const haversineKm = (a, b) => {
  const rad = (x) => (x * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
};

// Peso de cada arista = distancia aprox. por calle (haversine x 1.3).
export const buildCaliGraph = () => {
  const graph = new Graph();
  PLACES.forEach((p) => graph.addNode(p.id));
  EDGES.forEach(([a, b]) =>
    graph.addEdge(a, b, haversineKm(placeById(a), placeById(b)) * 1.3)
  );
  return graph;
};

// 10 min de preparación + moto a 25 km/h.
export const etaMinutes = (km) => Math.round(10 + (km / 25) * 60);
