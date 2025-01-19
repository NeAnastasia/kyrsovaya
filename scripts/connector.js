import { Connection } from "./connection.js";
import { MovingConnection } from "./movingConnection.js";
import { View } from "./view.js";
import { ArrowType } from "./enum/ArrowType.js";
import { FreeSocket } from "./socket.js";
import { BaseOperationsURL } from "./consts/baseUrl.js";
import { EdgeEndType } from "./enum/EdgeEndType.js";
import { OperationType } from "./enum/OperationType.js";
import { WebSocketConnection } from "./webSocket/webSocket.js";

export class Connector {
  static singleton = new Connector();
  constructor() {
    this.currentSocket = null;
  }
  reconnect(socket) {
    if (
      MovingConnection.singleton.currentConnection.outPoint !== null &&
      this.currentSocket === null
    ) {
      this.currentSocket = socket;
      this.reconnectAssociation(
        MovingConnection.singleton.currentConnection.outPoint,
        MovingConnection.singleton.currentConnection.outPoint.connectionParent
      );
    } else {
      console.log("recconecting is right");
      this.#reconnectSockets(socket);
    }
    MovingConnection.singleton.deleteCurrentConnection();
    View.singleton.resetAftermathOfMovingConnection();
  }
  reconnectAssociation(point, targetConnection) {
    const oldConnection = MovingConnection.singleton.currentConnection;
    let conn = new Connection(
      this.currentSocket,
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
    if (oldConnection.outSock === this.currentSocket) {
      conn.reverseArrowHeads();
      conn.spanIn.textContent = oldConnection.spanOut.textContent;
      conn.spanOut.textContent = oldConnection.spanIn.textContent;
    }
    if (oldConnection.isArrowsReversed) {
      conn.unswapArrowHeads();
    }
    targetConnection.connectedConnections.push(conn);
    this.#connect(conn);
  }
  #reconnectSockets(sock) {
    console.log("reconnectSockets", sock, this.currentSocket);
    let conn;
    const oldConnection = MovingConnection.singleton.currentConnection;
    if (this.currentSocket === oldConnection.inSock) {
      conn = new Connection(
        this.currentSocket,
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
        this.currentSocket,
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
    this.#connect(conn);
  }
  connectAssociation(point, targetConnection) {
    if (this.currentSocket instanceof FreeSocket) {
      View.singleton.showAlertForConnectingFreeSocketAndPoint();
      this.currentSocket = null;
      return false;
    } else {
      const conn = new Connection(
        this.currentSocket,
        null,
        point,
        ArrowType.None,
        ArrowType.None,
        true
      );
      targetConnection.connectedConnections.push(conn);
      this.#connect(conn);
      return conn;
    }
  }
  connectSockets(sock) {
    if (
      this.currentSocket instanceof FreeSocket &&
      sock instanceof FreeSocket
    ) {
      View.singleton.showAlertForConnectingTwoFreeSockets();
      this.currentSocket = null;
      sock.checkIfNeedsToBeDeleted();
      return false;
    } else {
      const conn = new Connection(this.currentSocket, sock);
      sock.addConnection(conn);
      this.#connect(conn);
      return conn;
    }
  }
  #connect(conn) {
    this.currentSocket.addConnection(conn);
    View.singleton.connections.push(conn);
    this.currentSocket = null;
    const selection = window.getSelection();
    selection.removeAllRanges();
  }

  reconnectFromThisUser(socket) {
    if (
      MovingConnection.singleton.currentConnection.outPoint !== null &&
      this.currentSocket === null
    ) {
      const oldConnection = MovingConnection.singleton.currentConnection;
      if (oldConnection.outSock === this.currentSocket) {
        this.reconnectEdgeToEdge(
          oldConnection.id,
          EdgeEndType.Source,
          MovingConnection.singleton.currentConnection.outPoint.connectionParent
            .id,
          MovingConnection.singleton.currentConnection.outPoint
        );
      } else if (oldConnection.inSock === this.currentSocket) {
        this.reconnectEdgeToEdge(
          oldConnection.id,
          EdgeEndType.Target,
          MovingConnection.singleton.currentConnection.outPoint.connectionParent
            .id,
          MovingConnection.singleton.currentConnection.outPoint
        );
      }
      this.reconnect(socket);
    } else {
      const oldConnection = MovingConnection.singleton.currentConnection;
      if (this.currentSocket === oldConnection.inSock) {
        if (socket instanceof FreeSocket) {
          this.reconnectEdgeToSocket(
            oldConnection.id,
            EdgeEndType.Target,
            socket.id
          );
        } else {
          this.reconnectEdgeToNode(
            oldConnection.id,
            EdgeEndType.Target,
            socket.parent.id,
            socket.getAbsolutePosition()
          );
        }
        this.reconnect(socket);
      } else {
        if (socket instanceof FreeSocket) {
          this.reconnectEdgeToSocket(
            oldConnection.id,
            EdgeEndType.Source,
            socket.id
          );
        } else {
          this.reconnectEdgeToNode(
            oldConnection.id,
            EdgeEndType.Source,
            socket.parent.id,
            socket.getAbsolutePosition()
          );
        }
        this.reconnect(socket);
        if (oldConnection.inSock instanceof FreeSocket) {
          oldConnection.inSock.destroyWithRemovingFromDB();
        } else {
          oldConnection.outSock.destroyWithRemovingFromDB();
        }
      }
    }
    this.reconnect(socket);
  }

  connectAssotionAsThisUser(point, targetConnection) {
    const connection = this.connectAssociation(point, targetConnection);
    if (connection !== false) {
      this.addEdge(connection, OperationType.AddEdgeToEdge);
    }
  }

  connectSocketsAsThisUser(sock) {
    const connection = this.connectSockets(sock);
    if (connection !== false) {
      if (
        connection.inSock instanceof FreeSocket ||
        connection.outSock instanceof FreeSocket
      ) {
        this.addEdge(connection, OperationType.AddEdgeToSocket);
      } else {
        this.addEdge(connection, OperationType.AddEdgeToNode);
      }
    }
  }

  reconnectFromAnotherUser(json, operationType) {
    let socket = null;
    const connection = View.singleton.getConnectionById(json.edgeId);
    MovingConnection.singleton.currentConnection = connection;
    switch (operationType) {
      case OperationType.ConnectEdgeToSocket:
        socket = View.getFreeSocketById(json.freeSocketId);
        if (json.edgeEndType === EdgeEndType.Target) {
          this.currentSocket = connection.inSock;
        } else {
          this.currentSocket = connection.outSock;
        }
        this.reconnect(socket);
        break;
      case OperationType.ConnectEdgeToNode:
        const node = View.singleton.getNodeById(json.nodeId);
        socket = node.getSocketByPosition(
          json.connectionPosition.x,
          json.connectionPosition.y
        );
        if (json.edgeEndType === EdgeEndType.Target) {
          this.currentSocket = connection.inSock;
        } else {
          this.currentSocket = connection.outSock;
        }
        this.reconnect(socket);
        break;
      case OperationType.ConnectEdgeToEdge:
        const targetConnection = View.singleton.getConnectionById(
          json.targetEdgeId
        );
        this.reconnectAssociation(
          new Point(json.connectionPosition.x, json.connectionPosition.y),
          targetConnection
        );
        break;
    }
    window.dispatchEvent(new Event("viewupdate"));
  }

  addEdge(connection, operationType) {
    const diagramId = window.location.hash.split("/").pop();
    let url;
    const timestamp = Date.now();
    WebSocketConnection.singleton.sentRequests.push({
      timestamp: timestamp,
      operation: operationType,
    });
    if (operationType === OperationType.AddEdgeToEdge) {
      url =
        BaseOperationsURL + "/v1/diagram/" + diagramId + "/edge/add/to_edge";
    } else if (operationType === OperationType.AddEdgeToNode) {
      url =
        BaseOperationsURL + "/v1/diagram/" + diagramId + "/edge/add/to_node";
    } else {
      url =
        BaseOperationsURL + "/v1/diagram/" + diagramId + "/edge/add/to_socket";
    }
    $.ajax({
      url: url,
      method: "POST",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      data: JSON.stringify(connection.toJSON()),
      success: (response) => {
        console.log("Add edge to node: ", response);
        WebSocketConnection.singleton.removeRequest(
          timestamp,
          operationType,
          response.operationId,
          connection
        );
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.error("Adding edge to node failed:", textStatus, errorThrown);
      },
    });
  }

  reconnectEdgeToNode(
    edge_id,
    edge_end,
    target_node_id,
    target_connection_position
  ) {
    //done
    const timestamp = Date.now();
    WebSocketConnection.singleton.sentRequests.push({
      timestamp: timestamp,
      operation: OperationType.ConnectEdgeToNode,
    });
    const diagramId = window.location.hash.split("/").pop();
    $.ajax({
      url:
        BaseOperationsURL +
        "/v1/diagram/" +
        diagramId +
        "/edge/connect/to_node",
      method: "POST",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      data: JSON.stringify({
        edge_id: edge_id,
        edge_end: edge_end,
        target_node_id: target_node_id,
        target_connection_position: {
          x: target_connection_position.x,
          y: target_connection_position.y,
        },
      }),
      success: (response) => {
        console.log("Reconnect edge to node: ", response);
        WebSocketConnection.singleton.removeRequest(
          timestamp,
          OperationType.ConnectEdgeToNode,
          response.operationId,
          this
        );
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.error(
          "Reconnecting edge to node failed:",
          textStatus,
          errorThrown
        );
      },
    });
  }

  //   ### Connect Edge to Edge (requires JWT token)
  // POST {{base_url}}/v1/diagram/{{diagram_id}}/edge/connect/to_edge
  // Content-Type: application/json
  // Authorization: Bearer {{token}}

  // {
  //   "edge_id": "45e6a994-068f-4877-90bb-ea20e2ff135f",
  //   "edge_end": "target",
  //   "target_edge_id": "7438452a-d426-4c63-96c7-ad730156b93d",
  //   "position": {
  //     "x": 4000,
  //     "y": 20
  //   }
  // }
  reconnectEdgeToEdge(edge_id, edge_end, target_edge_id, position) {
    const timestamp = Date.now();
    WebSocketConnection.singleton.sentRequests.push({
      timestamp: timestamp,
      operation: OperationType.ConnectEdgeToEdge,
    });
    const diagramId = window.location.hash.split("/").pop();
    $.ajax({
      url:
        BaseOperationsURL +
        "/v1/diagram/" +
        diagramId +
        "/edge/connect/to_edge",
      method: "POST",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      data: JSON.stringify({
        edge_id: edge_id,
        edge_end: edge_end,
        target_edge_id: target_edge_id,
        position: {
          x: position.x,
          y: position.y,
        },
      }),
      success: (response) => {
        console.log("reconnectEdgeToEdge: ", response);
        WebSocketConnection.singleton.removeRequest(
          timestamp,
          OperationType.ConnectEdgeToEdge,
          response.operationId,
          this
        );
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.error("Adding edge to node failed:", textStatus, errorThrown);
      },
    });
  }

  //   ### Connect Edge to Socket (requires JWT token)
  // POST {{base_url}}/v1/diagram/{{diagram_id}}/edge/connect/to_socket
  // Content-Type: application/json
  // Authorization: Bearer {{token}}

  // {
  //   "edge_id": "45b9e1b8-5b6c-4d5f-a6a1-7d2e4c9e1b32",
  //   "edge_end": "source",
  //   "target_free_socket_id": "e723e7be-c46d-402f-a8d1-5a616ad28d24"
  // }
  reconnectEdgeToSocket(edge_id, edge_end, target_free_socket_id) {
    const timestamp = Date.now();
    WebSocketConnection.singleton.sentRequests.push({
      timestamp: timestamp,
      operation: OperationType.ConnectEdgeToSocket,
    });
    const diagramId = window.location.hash.split("/").pop();
    $.ajax({
      url:
        BaseOperationsURL +
        "/v1/diagram/" +
        diagramId +
        "/edge/connect/to_socket",
      method: "POST",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      data: JSON.stringify({
        edge_id: edge_id,
        edge_end: edge_end,
        target_free_socket_id: target_free_socket_id,
      }),
      success: (response) => {
        console.log("reconnectEdgeToSocket: ", response);
        WebSocketConnection.singleton.removeRequest(
          timestamp,
          OperationType.ConnectEdgeToSocket,
          response.operationId,
          this
        );
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.error("Adding edge to node failed:", textStatus, errorThrown);
      },
    });
  }
}
