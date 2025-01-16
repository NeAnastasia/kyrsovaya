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
      this.#reconnectSockets(socket);
    }
    MovingConnection.singleton.deleteCurrentConnection();
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
      this.reconnectEdgeToEdge(
        conn.id,
        EdgeEndType.Source,
        targetConnection.id,
        point
      );
    } else if (oldConnection.inSock === this.currentSocket) {
      this.reconnectEdgeToEdge(
        conn.id,
        EdgeEndType.Target,
        targetConnection.id,
        point
      );
    }
    if (oldConnection.isArrowsReversed) {
      conn.unswapArrowHeads();
    }
    targetConnection.connectedConnections.push(conn);
    this.#connect(conn);
  }
  #reconnectSockets(sock) {
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
      this.reconnectEdgeToNode(
        conn.id,
        "target",
        sock.parent.id,
        sock.getAbsolutePosition()
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
      this.reconnectEdgeToNode(
        conn.id,
        EdgeEndType.Source,
        sock.parent.id,
        sock.getAbsolutePosition()
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
      this.addEdge(conn, OperationType.AddEdgeToEdge, conn);
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
    } else {
      const conn = new Connection(this.currentSocket, sock);
      sock.addConnection(conn);
      this.#connect(conn);
      this.addEdge(conn, OperationType.AddEdgeToNode, conn);
    }
  }
  #connect(conn) {
    this.currentSocket.addConnection(conn);
    View.singleton.connections.push(conn);
    this.currentSocket = null;
    const selection = window.getSelection();
    selection.removeAllRanges();
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
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.error("Adding edge to node failed:", textStatus, errorThrown);
      },
    });
  }
}
