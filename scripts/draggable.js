import { View } from "./view.js";
export class Draggable {
  constructor(
    el,
    onMouseDown = () => {},
    onMouseUp = () => {},
    onMouseMove = () => {}
  ) {
    this.el = el;
    window.addEventListener("mousemove", this.move.bind(this));
    this.el.addEventListener("mousedown", this.down.bind(this));
    window.addEventListener("mouseup", this.up.bind(this));
    this._sp = null;
    this.md = onMouseDown;
    this.mu = onMouseUp;
    this.mm = onMouseMove;
  }
  down(e) {
    e.stopPropagation();
    if (
      this.sp != null ||
      ($(document.activeElement).hasClass("node-text") &&
        $(e.target).hasClass("node-text")) ||
      ($(document.activeElement).hasClass("node-text-content") &&
        ($(e.target).hasClass("node-text-content") || $(e.target).closest('.node-text-content').length !== 0))
    ) {
      return;
    }
    if (!View.singleton.nodes.find((node) => node.el === this.el).isDblClick) {
      e.preventDefault();
    }
    this._sp = [e.pageX, e.pageY];
    this.md(e, this._sp);
  }
  up(e) {
    e.stopPropagation();
    if (this._sp == null) {
      return;
    }
    this._sp = null;
    this.mu(e);
  }
  move(e) {
    e.stopPropagation();
    if (this._sp == null) {
      return;
    }
    const delta = [e.pageX - this._sp[0], e.pageY - this._sp[1]];
    this.mm(e, delta);
  }
}
