import { Connection } from "./connection.js";
import { Connector } from "./connector.js";
import { MovingConnection } from "./movingConnection.js";
import { Selection } from "./selection.js";
import { TextMenu } from "./textMenu.js";
import { FreeSocket } from "./socket.js";
import { Point } from "./point.js";

export class View {
  static singleton = new View();
  #container;
  #opos;
  #isMouseDownHappened;
  #alert;
  constructor() {
    this.el = $("#view-area")[0];
    this.#container = $("#view")[0];
    this.connectionIsMoving = false;
    this.isMouseDownOnFreeSocket = false;
    this.#isMouseDownHappened = false;
    this.#container.addEventListener("mousedown", this.#down.bind(this));
    window.addEventListener("mouseup", this.#up.bind(this));
    window.addEventListener("mousemove", this.#move.bind(this));
    window.addEventListener("click", this.#click.bind(this));
    this.#opos = null;
    this.position = new Point(0, 0);
    this.nodes = [];
    this.freeSockets = [];
    this.connections = [];
    window.addEventListener("keydown", (e) => {
      if (e.key === "Delete") {
        for (const node of Selection.singleton.els) {
          this.#removeNode(node);
        }
        Selection.singleton.clear();
      }
    });
    this.#alert = $(
      `<div class="alert alert-danger alert-click" role="alert">
      </div>`
    )[0];
  }
  #down(e) {
    if (!this.connectionIsMoving && !this.isMouseDownOnFreeSocket) {
      e.preventDefault();
      e.stopPropagation();
      Selection.singleton.clear();
      this._sp = new Point(e.pageX, e.pageY);
      this.#opos = new Point(this.position.x, this.position.y);
    }
  }
  #up(e) {
    if (!this.isMouseDownOnFreeSocket) {
      if (!this.connectionIsMoving) {
        e.preventDefault();
        e.stopPropagation();
        this.#opos = null;
        this._sp = null;
      } else {
        if (
          !e.target.classList.contains("node-connection-socket") &&
          !e.target.classList.contains("arrow")
        ) {
          Connector.singleton.reconnect(
            new FreeSocket(new Point(e.pageX, e.pageY))
          );
        }
        this.#resetAftermathOfMovingConnection();
      }
    }
  }
  #move(e) {
    if (!this.connectionIsMoving && !this.isMouseDownOnFreeSocket) {
      e.preventDefault();
      e.stopPropagation();
      if (this.#opos == null) {
        return;
      }
      this.position.set(
        this.#opos.x + e.pageX - this._sp.x,
        this.#opos.y + e.pageY - this._sp.y
      );
      this.update();
    }
  }
  #click(e) {
    if (!this.isMouseDownOnFreeSocket) {
      if (
        !this.connectionIsMoving &&
        !this.#isMouseDownHappened &&
        (e.target == this.el || e.target == this.#container)
      ) {
        if (Connector.singleton.currentSocket !== null) {
          const socket = new FreeSocket(new Point(e.pageX, e.pageY));
          Connector.singleton.connectSockets(socket);
        } else {
          const selection = window.getSelection();
          if (selection.rangeCount > 0) {
            selection.removeAllRanges();
          }
          if ($(".text-menu").length !== 0) {
            TextMenu.singleton.deleteMenu();
          }
          document.activeElement.blur();
          Selection.singleton.clear();
          this.removeAlert();
        }
      } else {
        this.#isMouseDownHappened = false;
      }
    }
  }
  addNode(node) {
    this.nodes.push(node);
    this.el.appendChild(node.el);
    window.dispatchEvent(new Event("viewupdate"));
  }
  #removeNode(n) {
    for (const sock of Object.values(n.sockets)) {
      if (sock && sock.destroy) {
        sock.destroy();
      }
    }
    const index = this.nodes.indexOf(n);

    if (index != -1) {
      const n = this.nodes[index];
      this.nodes.splice(index, 1);
      n.remove();
      window.dispatchEvent(new Event("viewupdate"));
    }
  }
  #removeConnection(conn) {
    const index = this.connections.indexOf(conn);
    if (index == -1) {
      return;
    }
    this.connections.splice(index, 1);
    conn.destroy();
    window.dispatchEvent(new Event("viewupdate"));
  }
  addConnection(conn) {
    this.connections.push(conn);
    window.dispatchEvent(new Event("viewupdate"));
  }
  addFreeSocket(sock) {
    this.freeSockets.push(sock);
    window.dispatchEvent(new Event("viewupdate"));
  }
  removeFreeSocket(sock) {
    const index = this.freeSockets.indexOf(sock);
    if (index > -1) {
      this.freeSockets.splice(index, 1);
    }
  }
  showAlertForConnectingSockPointConnectionToConnectionBySock() {
    this.#isMouseDownHappened = true;
    this.#alert.textContent = "Вы не можете соединять связи";
    this.#showAlert();
  }
  showAlertForConnectingConnectionToItself() {
    this.#alert.textContent = "Вы не можете присоединить связь к самой себе.";
    this.#showAlert();
  }
  showAlertForConnectingTwoFreeSockets() {
    this.#alert.textContent =
      "Вы не можете соединить два свободных конца ребёр.";
    this.#showAlert();
  }
  showAlertForConnectingFreeSocketAndPoint() {
    this.#alert.textContent =
      "Вы не можете соединить свободный конец ребра и ребро.";
    this.#showAlert();
  }
  #showAlert() {
    $(this.#alert).appendTo(document.body);
    this.connectionIsMoving = false;
  }
  removeAlert() {
    if ($(".alert-danger").length !== 0) {
      $(".alert-danger").remove();
      this.#resetAftermathOfMovingConnection();
    }
  }
  update() {
    this.el.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
  }
  #resetAftermathOfMovingConnection() {
    $(".no-select").removeClass("no-select");
    this.connectionIsMoving = false;
    MovingConnection.singleton.currentConnection = null;
    Connector.singleton.currentSocket = null;
  }
  toJSON() {
    const ret = {
      nodes: [],
      connections: [],
    };
    for (const n of this.nodes) {
      ret.nodes.push(n.toJSON());
    }
    for (const c of this.connections) {
      ret.connections.push(c.toJSON());
    }
    return ret;
  }
  fromJSON(json) {
    this.#clear();
    for (const n of json.nodes) {
      Node.fromJSON(n);
    }
    const conns = json.connections.sort((a, b) => {
      if (a.outPoint === null && b.outPoint !== null) {
        return -1;
      }
      if (a.outPoint !== null && b.outPoint === null) {
        return 1;
      }
      return 0;
    });
    for (const conn of conns) {
      Connection.fromJSON(conn);
    }
    window.dispatchEvent(new Event("viewupdate"));
  }
  #clear() {
    const tr = Object.values(Node.nodes);
    for (const n of tr) {
      this.#removeNode(n);
    }
    const trc = [...this.connections];
    for (const c of trc) {
      this.#removeConnection(c);
    }
    window.dispatchEvent(new Event("viewupdate"));
  }
}
