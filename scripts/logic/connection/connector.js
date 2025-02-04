import { Connection } from "../../elements/connection.js";
import { MovingConnection } from "./movingConnection.js";
import { View } from "../../elements/view.js";
import { ArrowType } from "../../enum/ArrowType.js";
import { FreeSocket } from "../../elements/socket.js";
import { BaseOperationsURL } from "../../consts/baseUrl.js";
import { EdgeEndType } from "../../enum/EdgeEndType.js";
import { OperationType } from "../../enum/OperationType.js";
import { ConnectingPoint } from "./connectingPoint.js";
import { WebSocketConnection } from "../../api/webSocket/webSocket.js";
import {
  addEdge,
  reconnectEdgeToEdge,
  reconnectEdgeToNode,
  reconnectEdgeToSocket,
} from "../../api/http/connectionApiRequests.js";

export class Connector {
  static #instance;
  #currentSocket;

  constructor() {
    if (Connector.#instance) {
      throw new Error(
        "Use Connector.getInstance() to get the singleton instance."
      );
    }
    Connector.#instance = this;
    this.#currentSocket = null;
  }

  static getInstance() {
    if (!Connector.#instance) {
      Connector.#instance = new Connector();
    }
    return Connector.#instance;
  }
  set currentSocket(socket) {
    this.#currentSocket = socket;
  }
  get currentSocket() {
    return this.#currentSocket;
  }
  reconnect(socket, point = null, targetConnection = null) {
    if (point !== null && this.#currentSocket === socket) {
      this.reconnectAssociation(point, targetConnection);
    } else {
      this.#reconnectSockets(socket);
    }
    MovingConnection.getInstance().deleteCurrentConnection();
    View.getInstance().resetAftermathOfMovingConnection();
  }
  reconnectAssociation(point, targetConnection) {
    const oldConnection = MovingConnection.getInstance().currentConnection;
    let conn = new Connection(
      this.#currentSocket,
      null,
      point,
      oldConnection.arrowTypeStart,
      oldConnection.arrowTypeEnd,
      oldConnection.isDashed,
      oldConnection.spanCenter.textContent,
      oldConnection.spanOut.textContent,
      oldConnection.spanIn.textContent,
      oldConnection.id,
      oldConnection.color
    );
    if (oldConnection.outSock === this.#currentSocket) {
      conn.reverseArrowHeads();
      conn.spanIn.textContent = oldConnection.spanOut.textContent;
      conn.spanOut.textContent = oldConnection.spanIn.textContent;
    }
    if (oldConnection.isArrowsReversed) {
      conn.unswapArrowHeads();
    }

    targetConnection.connectedConnections =
      targetConnection.connectedConnections.filter(
        (connection) => connection !== oldConnection
      );
    targetConnection.connectedConnections.push(conn);

    this.#currentSocket.removeConnection(oldConnection);
    this.#currentSocket.connections.push(conn);

    View.getInstance().connections = View.getInstance().connections.filter(
      (connection) => connection !== oldConnection
    );
    View.getInstance().addConnection(conn);
    this.#connect(conn);
  }
  #reconnectSockets(sock) {
    let conn;
    const oldConnection = MovingConnection.getInstance().currentConnection;
    if (this.#currentSocket === oldConnection.inSock) {
      conn = new Connection(
        this.#currentSocket,
        sock,
        null,
        oldConnection.arrowTypeStart,
        oldConnection.arrowTypeEnd,
        oldConnection.isDashed,
        oldConnection.spanCenter.textContent,
        oldConnection.spanOut.textContent,
        oldConnection.spanIn.textContent,
        oldConnection.id,
        oldConnection.color
      );
    } else {
      conn = new Connection(
        sock,
        this.#currentSocket,
        null,
        oldConnection.arrowTypeStart,
        oldConnection.arrowTypeEnd,
        oldConnection.isDashed,
        oldConnection.spanCenter.textContent,
        oldConnection.spanOut.textContent,
        oldConnection.spanIn.textContent,
        oldConnection.id,
        oldConnection.color
      );
    }
    if (oldConnection.isArrowsReversed) {
      conn.unswapArrowHeads();
    }
    conn.connectedConnections = oldConnection.connectedConnections;
    $(conn.connectedConnections).each((i, connectedConn) => {
      connectedConn.outPoint.connectionParent = conn;
    });
    conn.update();
    sock.addConnection(conn);
    this.#currentSocket.addConnection(conn);
    this.#connect(conn);
  }
  connectAssociation(point, targetConnection) {
    if (this.#currentSocket instanceof FreeSocket) {
      View.getInstance().showAlertForConnectingFreeSocketAndPoint();
      this.#currentSocket = null;
      return false;
    } else {
      const conn = new Connection(
        this.#currentSocket,
        null,
        point,
        ArrowType.None,
        ArrowType.None,
        true
      );
      targetConnection.connectedConnections.push(conn);
      this.#currentSocket.addConnection(conn);
      this.#connect(conn);
      View.getInstance().addConnection(conn);
      return conn;
    }
  }
  connectSockets(sock) {
    if (
      this.#currentSocket instanceof FreeSocket &&
      sock instanceof FreeSocket
    ) {
      View.getInstance().showAlertForConnectingTwoFreeSockets();
      this.#currentSocket = null;
      sock.checkIfNeedsToBeDeleted();
      return false;
    } else {
      const conn = new Connection(this.#currentSocket, sock);
      sock.addConnection(conn);
      this.#currentSocket.addConnection(conn);
      this.#connect(conn);
      View.getInstance().addConnection(conn);
      return conn;
    }
  }
  #connect(conn) {
    this.#currentSocket = null;
    const selection = window.getSelection();
    selection.removeAllRanges();
  }

  reconnectFromThisUser(socket, point = null, targetConnection = null) {
    if (point !== null && this.#currentSocket === socket) {
      const oldConnection = MovingConnection.getInstance().currentConnection;
      if (oldConnection.outSock === this.#currentSocket) {
        reconnectEdgeToEdge(
          oldConnection.id,
          EdgeEndType.Source,
          targetConnection.id,
          point,
          oldConnection
        );
      } else if (oldConnection.inSock === this.#currentSocket) {
        reconnectEdgeToEdge(
          oldConnection.id,
          EdgeEndType.Target,
          targetConnection.id,
          point,
          oldConnection
        );
      }
      this.reconnect(socket, point, targetConnection);
    } else {
      const oldConnection = MovingConnection.getInstance().currentConnection;
      if (this.#currentSocket === oldConnection.inSock) {
        if (socket instanceof FreeSocket) {
          reconnectEdgeToSocket(
            oldConnection.id,
            EdgeEndType.Target,
            socket.id,
            oldConnection
          );
        } else {
          reconnectEdgeToNode(
            oldConnection.id,
            EdgeEndType.Target,
            socket.parent.id,
            socket.getAbsolutePosition(),
            oldConnection
          );
        }
        this.reconnect(socket);
      } else {
        if (socket instanceof FreeSocket) {
          reconnectEdgeToSocket(
            oldConnection.id,
            EdgeEndType.Source,
            socket.id,
            oldConnection
          );
        } else {
          reconnectEdgeToNode(
            oldConnection.id,
            EdgeEndType.Source,
            socket.parent.id,
            socket.getAbsolutePosition(),
            oldConnection
          );
        }
        this.reconnect(socket);
        if (oldConnection.inSock instanceof FreeSocket) {
          oldConnection.inSock.destroyWithRemovingFromDB();
        } else if (oldConnection.outSock instanceof FreeSocket) {
          oldConnection.outSock.destroyWithRemovingFromDB();
        }
      }
    }
  }

  connectAssotionAsThisUser(point, targetConnection) {
    const connection = this.connectAssociation(point, targetConnection);
    if (connection !== false) {
      addEdge(connection, OperationType.AddEdgeToEdge);
    }
  }

  connectSocketsAsThisUser(sock) {
    const connection = this.connectSockets(sock);
    if (connection !== false) {
      if (
        connection.inSock instanceof FreeSocket ||
        connection.outSock instanceof FreeSocket
      ) {
        addEdge(connection, OperationType.AddEdgeToSocket);
      } else {
        addEdge(connection, OperationType.AddEdgeToNode);
      }
    }
  }

  reconnectFromAnotherUser(json, operationType) {
    let socket = null;
    const connection = View.getInstance().getConnectionById(json.edgeId);
    MovingConnection.getInstance().currentConnection = connection;
    switch (operationType) {
      case OperationType.ConnectEdgeToSocket:
        socket = View.getInstance().getFreeSocketById(json.freeSocketId);
        if (json.edgeEndType === EdgeEndType.Target) {
          this.#currentSocket = connection.inSock;
        } else {
          this.#currentSocket = connection.outSock;
        }
        this.reconnect(socket);
        break;
      case OperationType.ConnectEdgeToNode:
        const node = View.getInstance().getNodeById(json.nodeId);
        socket = node.getSocketByPosition(
          json.connectionPosition.x,
          json.connectionPosition.y
        );
        if (json.edgeEndType === EdgeEndType.Target) {
          this.#currentSocket = connection.inSock;
        } else {
          this.#currentSocket = connection.outSock;
        }
        this.reconnect(socket);
        break;
      case OperationType.ConnectEdgeToEdge:
        const targetConnection = View.getInstance().getConnectionById(
          json.targetEdgeId
        );
        if (json.edgeEndType === EdgeEndType.Target) {
          this.#currentSocket = connection.inSock;
          this.reconnect(
            connection.inSock,
            new ConnectingPoint(
              json.position.x,
              json.position.y,
              targetConnection
            ),
            targetConnection
          );
        } else {
          this.reconnect(
            connection.outSock,
            new ConnectingPoint(
              json.position.x,
              json.position.y,
              targetConnection
            ),
            targetConnection
          );
          this.#currentSocket = connection.outSock;
        }
        break;
    }
    
  }
}
