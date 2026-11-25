// TRIE (árbol de prefijos) para autocompletar productos.
const normalize = (s) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

class TrieNode {
  children = new Map();
  items = new Map();
}

export class Trie {
  #root = new TrieNode();

  // Indexa cada palabra del texto: "Sancocho de gallina" se encuentra por "gal".
  insert(text, item) {
    for (const word of normalize(text).split(/\s+/).filter(Boolean)) {
      let node = this.#root;
      for (const ch of word) {
        if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
        node = node.children.get(ch);
      }
      node.items.set(item.id, item);
    }
  }

  #byPrefix(prefix) {
    let node = this.#root;
    for (const ch of prefix) {
      node = node.children.get(ch);
      if (!node) return new Map();
    }
    const found = new Map();
    const walk = (n) => {
      n.items.forEach((v, k) => found.set(k, v));
      n.children.forEach((child) => walk(child));
    };
    walk(node);
    return found;
  }

  // Varias palabras = intersección de resultados.
  search(query, limit = Infinity) {
    const tokens = normalize(query).split(/\s+/).filter(Boolean);
    if (!tokens.length) return [];
    let result = null;
    for (const token of tokens) {
      const found = this.#byPrefix(token);
      result = result
        ? new Map([...result].filter(([id]) => found.has(id)))
        : found;
    }
    return [...result.values()].slice(0, limit);
  }
}

export const buildProductTrie = (products) => {
  const trie = new Trie();
  products.forEach((p) => trie.insert(`${p.name} ${p.category}`, p));
  return trie;
};
