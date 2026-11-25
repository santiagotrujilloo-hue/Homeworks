import { Heap } from './Heap';

// GRAFO no dirigido y ponderado (lista de adyacencia) + Dijkstra.
export class Graph {
  #adj = new Map();

  addNode(id) {
    if (!this.#adj.has(id)) this.#adj.set(id, []);
  }

  addEdge(a, b, weight) {
    this.addNode(a);
    this.addNode(b);
    this.#adj.get(a).push({ to: b, weight });
    this.#adj.get(b).push({ to: a, weight });
  }

  // Camino más corto: usa un min-heap como cola de prioridad.
  dijkstra(start, end) {
    const dist = new Map([[start, 0]]);
    const prev = new Map();
    const done = new Set();
    const heap = new Heap((a, b) => a.d - b.d);
    heap.push({ id: start, d: 0 });

    while (!heap.isEmpty()) {
      const { id, d } = heap.pop();
      if (done.has(id)) continue;
      done.add(id);
      if (id === end) break;
      for (const { to, weight } of this.#adj.get(id) ?? []) {
        const nd = d + weight;
        if (nd < (dist.get(to) ?? Infinity)) {
          dist.set(to, nd);
          prev.set(to, id);
          heap.push({ id: to, d: nd });
        }
      }
    }

    if (!dist.has(end)) return { path: [], distance: Infinity };
    const path = [];
    for (let cur = end; cur !== undefined; cur = prev.get(cur)) path.unshift(cur);
    return { path, distance: dist.get(end) };
  }
}
