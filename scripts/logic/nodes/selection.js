export class Selection {
  static #instance;
  constructor() {
    if (Selection.#instance) {
      throw new Error(
        "Use Selection.getInstance() to get the singleton instance."
      );
    }
    Selection.#instance = this;
    this.els = [];
  }
  static getInstance() {
    if (!Selection.#instance) {
      Selection.#instance = new Selection();
    }
    return Selection.#instance;
  }
  add(node) {
    this.els.push(node);
  }
  clear() {
    while (this.els.length) {
      this.removeAt(0);
    }
  }
  removeAt(index) {
    const node = this.els.splice(index, 1);
    node[0].el.classList.remove("selected");
  }
  moveAll(delta) {
    for (const el of this.els) {
      el.moveOn(delta);
    }
  }
  pressAll(e) {
    for (const el of this.els) {
      el.press(e);
    }
  }
}
