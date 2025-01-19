import { Connector } from "./connector.js";
import { SocketType } from "./enum/SocketType.js";
import { View } from "./view.js";
import { Point } from "./point.js";
import { EdgeEndType } from "./enum/EdgeEndType.js";
import { BaseOperationsURL } from "./consts/baseUrl.js";
import { OperationType } from "./enum/OperationType.js";
import { WebSocketConnection } from "./webSocket/webSocket.js";

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
  constructor(el, parent = null, type = SocketType.Up, id = "") {
    super(el);
    this.id = id;
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
      Connector.singleton.connectSocketsAsThisUser(this);
      console.log("connected");
    }
  }
  up(e) {
    if (View.singleton.connectionIsMoving) {
      Connector.singleton.reconnectFromThisUser(this);
    }
  }
  updateArrowsPositionInDB() {
    for (const item of this.connections) {
      const edge_end =
        item.inSock === this ? EdgeEndType.Source : EdgeEndType.Target;
      const pos = this.getAbsolutePosition();
      Connector.singleton.reconnectEdgeToNode(
        item.id,
        edge_end,
        this.parent.id,
        pos
      );
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
  #moveRequestCounter;
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
    this.#moveRequestCounter = 0;
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
  destroy() {
    super.destroy();
    $(this.el).remove();
  }
  destroyWithRemovingFromDB() {
    this.destroy();
    View.singleton.removeElementRequest(this.id);
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
    if (this.#moveRequestCounter !== 100) {
      View.singleton.moveAnyElementRequest(this.id, this.position);
      this.#moveRequestCounter = 0;
    }
    View.singleton.isMouseDownOnFreeSocket = false;
  }
  move(e) {
    if (View.singleton.isMouseDownOnFreeSocket) {
      const navbar = document.getElementById("navbar");
      const navbarHeight = navbar ? navbar.offsetHeight : 0;
      this.position.set(
        e.pageX - View.singleton.position.x,
        e.pageY - View.singleton.position.y - navbarHeight
      );
      this.setStyleTopLeft();
      for (var i = 0; i < this.connections.length; i++) {
        this.connections[i].update();
      }
      this.#moveRequestCounter++;
      if (this.#moveRequestCounter >= 100) {
        View.singleton.moveAnyElementRequest(this.id, this.position);
        this.#moveRequestCounter = 0;
      }
    }
  }
  setStyleTopLeft() {
    this.el.style.top = this.position.y - this.el.offsetHeight / 2 + "px";
    this.el.style.left = this.position.x - this.el.offsetWidth / 2 + "px";
  }
  //   ### Add Socket to Diagram (requires JWT token)
  // POST {{base_url}}/v1/diagram/{{diagram_id}}/socket/add
  // Content-Type: application/json
  // Authorization: Bearer {{token}}

  // {
  //   "position": {
  //     "x": 50.0,
  //     "y": 75.25
  //   }
  // }
  static fromJSONofAnotherUser(json) {
    const socket = FreeSocket.fromJSON(json);
    socket.id = json.id;
    console.log(socket)
  }

  static fromJSON(json) {
    const socket = new FreeSocket(new Point(json.x, json.y), json.Id);
    View.singleton.addFreeSocket(socket);
    return socket;
  }
  addSocketRequest(isReconnection = false) {
    const timestamp = Date.now();
    WebSocketConnection.singleton.sentRequests.push({
      timestamp: timestamp,
      operation: OperationType.AddSocket,
    });
    //done
    const diagramId = window.location.hash.split("/").pop();
    $.ajax({
      url: BaseOperationsURL + "/v1/diagram/" + diagramId + "/socket/add",
      method: "POST",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      data: JSON.stringify({
        position: {
          x: this.position.x,
          y: this.position.y,
        },
      }),
      success: (response) => {
        console.log("Add socket", response);
        WebSocketConnection.singleton.removeRequest(
          timestamp,
          OperationType.AddSocket,
          response.operationId,
          this,
          isReconnection
        );
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.error("Adding socket failed:", textStatus, errorThrown);
        return false;
      },
    });
  }
}
