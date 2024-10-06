export class Selection {
  static singleton = new Selection();
  constructor() {
    this.els = [];
  }
  add(node) {
    this.els.push(node);
    return this;
  }
  clear() {
    while (this.els.length) {
      this.removeAt(0);
    }

    return this;
  }
  removeAt(index) {
    const node = this.els.splice(index, 1);
    node[0].el.classList.remove("selected");
    return this;
  }
  has(item) {
    return this.els.indexOf(item) != -1;
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
