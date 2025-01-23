import { View } from "./view.js";
import { Point } from "./point.js";
import { FreeSocket } from "./socket.js";

export class Draggable {
  #mouseDown;
  #mouseUp;
  #mouseMove;
  constructor(
    el,
    onMouseDown = () => {},
    onMouseUp = () => {},
    onMouseMove = () => {}
  ) {
    this.el = el;
    window.addEventListener("mousemove", this.#move.bind(this));
    this.el.addEventListener("mousedown", this.#down.bind(this));
    window.addEventListener("mouseup", this.#up.bind(this));
    this._sp = null;
    this.#mouseDown = onMouseDown;
    this.#mouseUp = onMouseUp;
    this.#mouseMove = onMouseMove;
  }
  #down(e) {
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
    this._sp = new Point(e.pageX, e.pageY);
    this.#mouseDown(e, this._sp);
  }
  #up(e) {
    e.stopPropagation();
    if (this._sp == null) {
      return;
    }
    this._sp = null;
    this.#mouseUp(e);
  }
  #move(e) {
    e.stopPropagation();
    if (FreeSocket.movingSocket !== null) {
      FreeSocket.movingSocket.move(e);
    }
    if (this._sp == null) {
      return;
    }
    const delta = new Point(e.pageX - this._sp.x, e.pageY - this._sp.y);
    this.#mouseMove(e, delta);
  }
}
