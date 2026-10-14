class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  insert(value) {
    const newNode = new Node(value);

    if (this.root === null) {
      this.root = newNode;
      return;
    }

    let current = this.root;

    while (true) {
      if (value === current.value) {
        return;
      }

      if (value < current.value) {
        if (current.left === null) {
          current.left = newNode;
          return;
        }

        current = current.left;
      } else {
        if (current.right === null) {
          current.right = newNode;
          return;
        }

        current = current.right;
      }
    }
  }

  contains(value) {
    let current = this.root;

    while (current !== null) {
      if (value === current.value) {
        return true;
      }

      if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    return false;
  }

  inorder() {
    const values = [];

    const traverse = (node) => {
      if (!node) {
        return;
      }

      traverse(node.left);
      values.push(node.value);
      traverse(node.right);
    };

    traverse(this.root);

    return values;
  }

  preorder() {
    const values = [];

    const traverse = (node) => {
      if (!node) {
        return;
      }

      values.push(node.value);
      traverse(node.left);
      traverse(node.right);
    };

    traverse(this.root);

    return values;
  }

  postorder() {
    const values = [];

    const traverse = (node) => {
      if (!node) {
        return;
      }

      traverse(node.left);
      traverse(node.right);
      values.push(node.value);
    };

    traverse(this.root);

    return values;
  }

  toD3Data(node = this.root) {
    if (!node) {
      return null;
    }

    const data = {
      name: String(node.value),
    };

    const children = [];

    if (node.left) {
      children.push(this.toD3Data(node.left));
    }

    if (node.right) {
      children.push(this.toD3Data(node.right));
    }

    if (children.length > 0) {
      data.children = children;
    }

    return data;
  }
}

export default BinarySearchTree;