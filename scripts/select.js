class Selection {
  static singleton = new Selection();
  constructor() {
    this.items = [];
  }
  add(draggable) {
    this.items.push(draggable);
    draggable.setParent(this);
  }
  startAll(draggable, e) {
    for (const d of this.items) {
      if (draggable === d) {
        continue;
      }
      d.mousedown(e, true);
    }
  }
  moveAll(draggable, e) {
    for (const d of this.items) {
      if (draggable === d) {
        continue;
      }
      d.move(e, true);
    }
  }
  stopAll(draggable, e) {
    for (const d of this.items) {
      if (draggable === d) {
        continue;
      }
      d.mouseup(e, true);
    }
  }
  clear() {
    for (const item of this.items) {
      item.setParent(null);
    }
    this.items.splice(0);
  }
}
