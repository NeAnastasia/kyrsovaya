import { Connector } from "./connector.js";
import { MovingConnection } from "./movingConnection.js";
import { View } from "./view.js";

export class Socket {
  constructor(el, parent = null, type = "up") {
    if (el == null) {
      return;
    }
    this.parent = parent;
    this.el = el;
    this.type = type;
    this.connections = [];
    this.el.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (Connector.singleton.currentSocket == null) {
        Connector.singleton.currentSocket = this;
        console.log("grabbed");
      } else {
        Connector.singleton.connectSockets(this);
        console.log("connected");
      }
    });
    $(this.el).on("mouseup", (e) => {
      if (View.singleton.connectionIsMoving) {
        if (MovingConnection.singleton.currentConnection.outPoint !== null) {
          Connector.singleton.currentSocket = this;
          Connector.singleton.reconnectAssociation(
            MovingConnection.singleton.currentConnection.outPoint,
            MovingConnection.singleton.currentConnection.outPoint
              .connectionParent
          );
          MovingConnection.singleton.deleteCurrentConnection();
        } else {
          Connector.singleton.reconnectSockets(this);
          MovingConnection.singleton.deleteCurrentConnection();
        }
      }
    });
  }
  addConnection(conn) {
    this.connections.push(conn);
    return this;
  }
  removeConnection(conn) {
    const index = this.connections.indexOf(conn);
    if (index == -1) {
      return this;
    }
    this.connections.splice(index, 1);
    return this;
  }
  getAbsolutePosition() {
    return [
      this.parent.pos[0] + this.el.offsetLeft + this.el.offsetWidth / 2,
      this.parent.pos[1] + this.el.offsetTop + this.el.offsetHeight / 2,
    ];
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
  isUp() {
    return this.type.match(/^up*/);
  }
  isRight() {
    return this.type.match(/^right*/);
  }
  isLeft() {
    return this.type.match(/^left*/);
  }
  isDown() {
    return this.type.match(/^down*/);
  }
}
