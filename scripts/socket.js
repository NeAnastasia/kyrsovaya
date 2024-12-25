import { Connector } from "./connector.js";
import { SocketType } from "./enum/SocketType.js";
import { View } from "./view.js";
import { Point } from "./point.js";

export class Socket {
  constructor(el) {
    if (el == null) {
      return;
    }
    this.el = el;
    this.connections = [];
  }
  addConnection(conn) {
    this.connections.push(conn);
  }
  removeConnection(conn) {
    const index = this.connections.indexOf(conn);
    if (index == -1) {
      return this;
    }
    this.connections.splice(index, 1);
    return this;
  }
  update() {
    if (this.el == null) {
      return;
    }
    for (const item of this.connections) {
      item.update();
    }
  }
  destroy() {
    const conns = [...this.connections];
    for (const c of conns) {
      c.destroy();
    }
  }
}

export class NodeSocket extends Socket {
  parent;
  #type;
  constructor(el, parent = null, type = SocketType.Up) {
    super(el);
    this.parent = parent;
    this.#type = type;
    this.el.addEventListener("mousedown", this.down.bind(this));
    $(this.el).on("mouseup", this.up.bind(this));
  }
  down(e) {
    e.preventDefault();
    e.stopPropagation();
    if (Connector.singleton.currentSocket == null) {
      Connector.singleton.currentSocket = this;
      console.log("grabbed");
    } else {
      Connector.singleton.connectSockets(this);
      console.log("connected");
    }
  }
  up(e) {
    if (View.singleton.connectionIsMoving) {
      Connector.singleton.reconnect(this);
    }
  }
  getAbsolutePosition() {
    return new Point(
      this.parent.position.x + this.el.offsetLeft + this.el.offsetWidth / 2,
      this.parent.position.y + this.el.offsetTop + this.el.offsetHeight / 2
    );
  }
  isUp() {
    return (
      this.#type === SocketType.Up ||
      this.#type === SocketType.Upleft ||
      this.#type === SocketType.Upright
    );
  }
  isRight() {
    return (
      this.#type === SocketType.Right ||
      this.#type === SocketType.Rightdown ||
      this.#type === SocketType.Rightup
    );
  }
  isLeft() {
    return (
      this.#type === SocketType.Left ||
      this.#type === SocketType.Leftdown ||
      this.#type === SocketType.Leftup
    );
  }
  isDown() {
    return (
      this.#type === SocketType.Down ||
      this.#type === SocketType.Downleft ||
      this.#type === SocketType.Downright
    );
  }
}

export class FreeSocket extends Socket {
  static idSockNum = 0;
  constructor(point, id = "") {
    const el = document.createElement("div");
    $(el).addClass("node-connection-socket");
    $(el).addClass("freeone");
    $(el).appendTo("#view-area")[0];
    super(el);
    if (id === "") {
      this.id = "free-socket-" + FreeSocket.idSockNum;
      FreeSocket.idSockNum++;
    } else {
      this.id = id;
      FreeSocket.idSockNum = parseInt(id.replace("free-socket-", ""), 10);
      FreeSocket.idSockNum = FreeSocket.idSockNum + 1;
    }
    this.isMouseDown = false;
    this.position = point;
    this.position.set(
      point.x - View.singleton.position.x,
      point.y - View.singleton.position.y
    );
    this.setStyleTopLeft();
    this.el.setAttribute("id", this.id);
    View.singleton.freeSockets.push(this);
    this.el.addEventListener("mousedown", this.down.bind(this));
    this.el.addEventListener("mouseup", this.up.bind(this));
    this.el.addEventListener("mousemove", this.move.bind(this));
  }
  removeConnection(conn) {
    super.removeConnection(conn);
    this.checkIfNeedsToBeDeleted();
  }
  checkIfNeedsToBeDeleted() {
    if (this.connections.length == 0) {
      $(this.el).remove();
      View.singleton.removeFreeSocket(this);
    }
  }
  down(e) {
    $(this.el).addClass("moving");
    for (var i = 0; i < this.connections.length; i++) {
      this.connections[i].disableClickEndEls();
    }
    View.singleton.isMouseDownOnFreeSocket = true;
  }
  up(e) {
    $(this.el).removeClass("moving");
    for (var i = 0; i < this.connections.length; i++) {
      this.connections[i].enableClickEndEls();
    }
    View.singleton.isMouseDownOnFreeSocket = false;
  }
  move(e) {
    if (View.singleton.isMouseDownOnFreeSocket) {
      this.position.set(
        e.pageX - View.singleton.position.x,
        e.pageY - View.singleton.position.y
      );
      this.setStyleTopLeft();
      for (var i = 0; i < this.connections.length; i++) {
        this.connections[i].update();
      }
    }
  }
  setStyleTopLeft() {
    this.el.style.top = this.position.y - this.el.offsetHeight / 2 + "px";
    this.el.style.left = this.position.x - this.el.offsetWidth / 2 + "px";
  }
}
