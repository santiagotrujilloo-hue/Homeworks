// HEAP binario con comparador. Con (a, b) => a - b es un min-heap.
export class Heap {
  #data = [];
  #cmp;

  constructor(cmp = (a, b) => a - b) {
    this.#cmp = cmp;
  }

  get size() {
    return this.#data.length;
  }

  isEmpty() {
    return this.#data.length === 0;
  }

  peek() {
    return this.#data[0];
  }

  push(value) {
    const a = this.#data;
    a.push(value);
    let i = a.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.#cmp(a[i], a[parent]) >= 0) break;
      [a[i], a[parent]] = [a[parent], a[i]];
      i = parent;
    }
  }

  pop() {
    const a = this.#data;
    if (!a.length) return undefined;
    const top = a[0];
    const last = a.pop();
    if (a.length) {
      a[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1;
        const r = l + 1;
        let m = i;
        if (l < a.length && this.#cmp(a[l], a[m]) < 0) m = l;
        if (r < a.length && this.#cmp(a[r], a[m]) < 0) m = r;
        if (m === i) break;
        [a[i], a[m]] = [a[m], a[i]];
        i = m;
      }
    }
    return top;
  }
}

// Los N elementos "mejores" según el comparador (O(n log n)).
export const topN = (items, n, cmp) => {
  const heap = new Heap(cmp);
  items.forEach((x) => heap.push(x));
  const out = [];
  while (out.length < n && !heap.isEmpty()) out.push(heap.pop());
  return out;
};
