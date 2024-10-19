export class Selection {
  static singleton = new Selection();
  constructor() {
    this.els = [];
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
