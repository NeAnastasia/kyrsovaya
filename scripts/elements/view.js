import { Connection } from "./connection.js";
import { Connector } from "../logic/connection/connector.js";
import { MovingConnection } from "../logic/connection/movingConnection.js";
import { Selection } from "../logic/nodes/selection.js";
import { TextMenu } from "../components/textMenu.js";
import { FreeSocket } from "./socket.js";
import { Point } from "../utils/point.js";
import { BaseOperationsURL } from "../consts/baseUrl.js";
import { EdgeEndType } from "../enum/EdgeEndType.js";
import { ElementType } from "../enum/ElementType.js";
import { OperationType } from "../enum/OperationType.js";
import { getNavbarHeight } from "../utils/helpers.js";
import { WebSocketConnection } from "../api/webSocket/webSocket.js";
import { removeElementRequest } from "../api/http/elementsApiRequests.js";
import { addSocketRequest } from "../api/http/socketApiRequests.js";

export class View {
  static #instance;
  #container;
  #opos;
  #isMouseDownHappened;
  #alert;
  constructor() {
    if (View.#instance) {
      throw new Error("Use View.getInstance() to get the singleton instance.");
    }
    View.#instance = this;
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
        for (const node of Selection.getInstance().els) {
          this.#removeNode(node);
          removeElementRequest(node.id, node);
        }
        Selection.getInstance().clear();
      }
    });
    this.#alert = $(
      `<div class="alert alert-danger alert-click" role="alert">
      </div>`
    )[0];
  }
  static getInstance() {
    if (!View.#instance) {
      View.#instance = new View();
    }
    return View.#instance;
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
      Selection.getInstance().clear();
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
          const navbarHeight = getNavbarHeight();
          if (
            Connector.getInstance().currentSocket !==
              MovingConnection.getInstance().currentConnection.inSock &&
            MovingConnection.getInstance().currentConnection.inSock instanceof
              FreeSocket
          ) {
            MovingConnection.getInstance().currentConnection.inSock.changePositionWithRequestToDB(
              new Point(e.pageX, e.pageY)
            );
            this.resetAftermathOfMovingConnection();
            this.isMouseDownOnFreeSocket = false;
          } else if (
            Connector.getInstance().currentSocket !==
              MovingConnection.getInstance().currentConnection.outSock &&
            MovingConnection.getInstance().currentConnection.outSock instanceof
              FreeSocket
          ) {
            MovingConnection.getInstance().currentConnection.outSock.changePositionWithRequestToDB(
              new Point(e.pageX, e.pageY)
            );
            this.resetAftermathOfMovingConnection();
            this.isMouseDownOnFreeSocket = false;
          } else {
            const socket = new FreeSocket(
              new Point(e.pageX, e.pageY - navbarHeight)
            );
            const isAdded = addSocketRequest(true, socket);
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
          const socket = new FreeSocket(
            new Point(e.pageX, e.pageY - getNavbarHeight())
          );
          const isAdded = addSocketRequest(false, socket);
          if (isAdded === false) {
            this.showAlertForUnableToCreateSocket();
          }
          // MovingConnection.getInstance().deleteCurrentConnection();
          // this.resetAftermathOfMovingConnection();
        } else {
          const selection = window.getSelection();
          if (selection.rangeCount > 0) {
            selection.removeAllRanges();
          }
          if ($(".text-menu").length !== 0) {
            TextMenu.getInstance().deleteMenu();
          }
          document.activeElement.blur();
          Selection.getInstance().clear();
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
      
    }
  }
  removeConnection(conn) {
    const index = this.connections.indexOf(conn);
    if (index == -1) {
      return;
    }
    this.connections.splice(index, 1);
    
  }
  #removeFreeSockets(socket) {
    const index = this.freeSockets.indexOf(socket);
    if (index == -1) {
      return;
    }
    this.freeSockets.splice(index, 1);
    socket.destroy();
    
  }
  addConnection(conn) {
    this.connections.push(conn);
    
  }
  addFreeSocket(sock) {
    this.freeSockets.push(sock);
    
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
    MovingConnection.getInstance().currentConnection = null;
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
      
      return;
    }
    const connection = this.getConnectionById(id);
    if (connection) {
      connection.removeWithouthDeletingDataInDB();
      
      return;
    }
    const socket = this.getFreeSocketById(id);
    if (socket) {
      socket.destroy(false);
      
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
      //   removeElementRequest(key)
      // );
      
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
    
  }
}
