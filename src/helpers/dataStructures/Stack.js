// PILA (LIFO): push, pop y peek en O(1).
export class Stack {
  #items = [];

  push(value) {
    this.#items.push(value);
  }

  pop() {
    return this.#items.pop();
  }

  peek() {
    return this.#items[this.#items.length - 1];
  }

  isEmpty() {
    return this.#items.length === 0;
  }

  get size() {
    return this.#items.length;
  }
}
