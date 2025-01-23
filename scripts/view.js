import { Connection } from "./connection.js";
import { Connector } from "./connector.js";
import { MovingConnection } from "./movingConnection.js";
import { Selection } from "./selection.js";
import { TextMenu } from "./textMenu.js";
import { FreeSocket } from "./socket.js";
import { Point } from "./point.js";
import { BaseOperationsURL } from "./consts/baseUrl.js";
import { EdgeEndType } from "./enum/EdgeEndType.js";
import { ElementType } from "./enum/ElementType.js";
import { WebSocketConnection } from "./webSocket/webSocket.js";
import { OperationType } from "./enum/OperationType.js";

export class View {
  static singleton = new View();
  #container;
  #opos;
  #isMouseDownHappened;
  #alert;
  constructor() {
    this.JSONInfo = null;
    this.connectionIsMoving = false;
    this.isMouseDownOnFreeSocket = false;
    this.#isMouseDownHappened = false;
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
          this.removeElementRequest(node.id);
        }
        Selection.singleton.clear();
      }
    });
    this.#alert = $(
      `<div class="alert alert-danger alert-click" role="alert">
      </div>`
    )[0];
  }
  defineElements() {
    this.el = $("#view-area")[0];
    this.#container = $("#view")[0];
    this.#container.addEventListener("mousedown", this.#down.bind(this));
    const rect = this.#container.getBoundingClientRect();
    //this.position = new Point(rect.x, rect.y);
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
          const navbar = document.getElementById("navbar");
          const navbarHeight = navbar ? navbar.offsetHeight : 0;
          if (
            Connector.getInstance().currentSocket !==
              MovingConnection.singleton.currentConnection.inSock &&
            MovingConnection.singleton.currentConnection.inSock instanceof
              FreeSocket
          ) {
            MovingConnection.singleton.currentConnection.inSock.changePositionWithRequestToDB(
              new Point(e.pageX, e.pageY)
            );
            this.resetAftermathOfMovingConnection();
            this.isMouseDownOnFreeSocket = false;
          } else if (
            Connector.getInstance().currentSocket !==
              MovingConnection.singleton.currentConnection.outSock &&
            MovingConnection.singleton.currentConnection.outSock instanceof
              FreeSocket
          ) {
            MovingConnection.singleton.currentConnection.outSock.changePositionWithRequestToDB(
              new Point(e.pageX, e.pageY)
            );
            this.resetAftermathOfMovingConnection();
            this.isMouseDownOnFreeSocket = false;
          } else {
            const socket = new FreeSocket(
              new Point(e.pageX, e.pageY - navbarHeight)
            );
            const isAdded = socket.addSocketRequest(true);
            if (isAdded === false) {
              this.showAlertForUnableToCreateSocket();
            }
          }
        }
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
        if (Connector.getInstance().currentSocket !== null) {
          const navbar = document.getElementById("navbar");
          const navbarHeight = navbar ? navbar.offsetHeight : 0;
          const socket = new FreeSocket(
            new Point(e.pageX, e.pageY - navbarHeight)
          );
          const isAdded = socket.addSocketRequest();
          if (isAdded === false) {
            this.showAlertForUnableToCreateSocket();
          }
          // MovingConnection.singleton.deleteCurrentConnection();
          // this.resetAftermathOfMovingConnection();
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
      n.removeHTMLElement();
      window.dispatchEvent(new Event("viewupdate"));
    }
  }
  removeConnection(conn) {
    const index = this.connections.indexOf(conn);
    if (index == -1) {
      return;
    }
    this.connections.splice(index, 1);
    window.dispatchEvent(new Event("viewupdate"));
  }
  #removeFreeSockets(socket) {
    const index = this.freeSockets.indexOf(socket);
    if (index == -1) {
      return;
    }
    this.freeSockets.splice(index, 1);
    socket.destroy();
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
  showAlertForUnableToCreateSocket() {
    this.#alert.textContent =
      "К сожалению, не удалось создать нужный элемент для создания соединения, что-то пошло не так";
    this.#showAlert();
  }
  #showAlert() {
    $(this.#alert).appendTo(document.body);
    this.connectionIsMoving = false;
  }
  removeAlert() {
    if ($(".alert-danger").length !== 0) {
      $(".alert-danger").remove();
      this.resetAftermathOfMovingConnection();
    }
  }
  update() {
    this.el.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
  }
  resetAftermathOfMovingConnection() {
    $(".no-select").removeClass("no-select");
    this.connectionIsMoving = false;
    MovingConnection.singleton.currentConnection = null;
    Connector.getInstance().currentSocket = null;
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
  getNodeById(id) {
    return this.nodes.find((node) => node.id === id) || null;
  }
  getConnectionById(id) {
    return this.connections.find((connection) => connection.id === id) || null;
  }
  getFreeSocketById(id) {
    return this.freeSockets.find((socket) => socket.id === id) || null;
  }
  removeElementById(id) {
    const node = this.getNodeById(id);
    if (node) {
      node.removeHTMLElement();
      window.dispatchEvent(new Event("viewupdate"));
      return;
    }
    const connection = this.getConnectionById(id);
    if (connection) {
      connection.removeWithouthDeletingDataInDB();
      window.dispatchEvent(new Event("viewupdate"));
      return;
    }
    const socket = this.getFreeSocketById(id);
    if (socket) {
      socket.destroy(false);
      window.dispatchEvent(new Event("viewupdate"));
      return;
    }
    return null;
  }
  fromJSON() {
    if (this.JSONInfo !== null) {
      this.#clear();
      const diagramStructure = this.JSONInfo.diagram_structure.elements;

      const nodes = Object.keys(diagramStructure)
        .filter((key) => diagramStructure[key].ElementType === ElementType.Node)
        .map((key) => Node.fromJSON(diagramStructure[key]));

      const freeSockets = Object.keys(diagramStructure)
        .filter(
          (key) => diagramStructure[key].ElementType === ElementType.FreeSocket
        )
        .map((key) => FreeSocket.fromJSON(diagramStructure[key]));

      const edges = Object.keys(diagramStructure).filter(
        (key) => diagramStructure[key].ElementType === ElementType.Edge
      );

      const assotiationEdges = [];
      const nodeToNodeEdges = [];
      const toFreeSocketEdges = [];

      edges.forEach((edge) => {
        if (
          diagramStructure[edge].SourceEnd.ConnectedElementId &&
          edges.includes(diagramStructure[edge].SourceEnd.ConnectedElementId)
        ) {
          diagramStructure[edge].edgePointEnd = EdgeEndType.Source;
          assotiationEdges.push(diagramStructure[edge]);
        } else if (
          diagramStructure[edge].TargetEnd.ConnectedElementId &&
          edges.includes(diagramStructure[edge].TargetEnd.ConnectedElementId)
        ) {
          diagramStructure[edge].edgePointEnd = EdgeEndType.Target;
          assotiationEdges.push(diagramStructure[edge]);
        } else if (
          this.freeSockets.some(
            (freeSocket) =>
              freeSocket.id ===
              diagramStructure[edge].TargetEnd.ConnectedElementId
          )
        ) {
          toFreeSocketEdges.push(diagramStructure[edge]);
        } else {
          nodeToNodeEdges.push(diagramStructure[edge]);
        }
      });

      nodeToNodeEdges.forEach((edge) => {
        Connection.fromJSONNodeToNode(edge);
      });      
      
      toFreeSocketEdges.forEach((edge) => {
        Connection.fromJSONNodeToFreeSocket(edge);
      });

      assotiationEdges.forEach((edge) => {
        Connection.fromJSONNodeToEdge(edge);
      });

      //Быстрая отчистка всех элементов из БД
      // Object.keys(diagramStructure).map((key) =>
      //   this.removeElementRequest(key)
      // );
      window.dispatchEvent(new Event("viewupdate"));
    }
  }
  #clear() {
    const tr = Object.values(Node.nodes);
    for (const n of tr) {
      this.#removeNode(n);
    }
    const trc = [...this.connections];
    for (const c of trc) {
      this.removeConnection(c);
      c.destroy();
    }
    const trf = [...this.freeSockets];
    for (const f of trf) {
      this.#removeFreeSockets(f);
    }
    window.dispatchEvent(new Event("viewupdate"));
  }
  removeElementRequest(id) {
    //done
    const timestamp = Date.now();
    WebSocketConnection.singleton.sentRequests.push({
      timestamp: timestamp,
      operation: OperationType.RemoveElement,
    });
    const diagramId = window.location.hash.split("/").pop();
    $.ajax({
      url: BaseOperationsURL + "/v1/diagrams/" + diagramId + "/element/remove",
      method: "DELETE",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      data: JSON.stringify({ element_id: id }),
      success: (response) => {
        console.log("Deleting element", response);
        WebSocketConnection.singleton.removeRequest(
          timestamp,
          OperationType.RemoveElement,
          response.operationId,
          this
        );
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.error("Removing element failed:", textStatus, errorThrown);
      },
    });
  }
  moveAnyElementRequest(elementId, position) {
    const timestamp = Date.now();
    WebSocketConnection.singleton.sentRequests.push({
      timestamp: timestamp,
      operation: OperationType.Move,
    });
    //done
    const id = window.location.hash.split("/").pop();
    $.ajax({
      url: BaseOperationsURL + "/api/v1/diagrams/" + id + "/element/move",
      method: "PATCH",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      data: JSON.stringify({
        element_id: elementId,
        new_position: {
          x: position.x,
          y: position.y,
        },
      }),
      success: (response) => {
        console.log("Move element: ", response);
        WebSocketConnection.singleton.removeRequest(
          timestamp,
          OperationType.Move,
          response.operationId,
          this
        );
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.error("Moving element failed:", textStatus, errorThrown);
      },
    });
  }
}
