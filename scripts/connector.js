import { Connection } from "./connection.js";
import { MovingConnection } from "./movingConnection.js";
import { View } from "./view.js";
import { ArrowType } from "./enum/ArrowType.js";
import { FreeSocket } from "./socket.js";
import { BaseOperationsURL } from "./consts/baseUrl.js";

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
      this.addEdgeToNode(conn);
    }
  }
  #connect(conn) {
    this.currentSocket.addConnection(conn);
    View.singleton.connections.push(conn);
    this.currentSocket = null;
    const selection = window.getSelection();
    selection.removeAllRanges();
  }

  // ### Add Edge connected to Node (requires JWT token)
  // POST {{base_url}}/v1/diagram/{{diagram_id}}/edge/add/to_node
  // Content-Type: application/json
  // Authorization: Bearer {{token}}

  // {
  //   "source_node_id": "0626e9ae-f106-41ec-a0dd-150939317841",
  //   "source_connection_position": {
  //     "x": 0,
  //     "y": -1
  //   },
  //   "source_free_socket_id": null,
  //   "target_node_id": "a68a8645-7eb7-4f46-ab07-2feae4554bae",
  //   "target_connection_position": {
  //     "x": 0,
  //     "y": 1
  //   },
  //   "edge": {
  //     "color": "#ff0000",
  //     "arrowTypeSource": "Default",
  //     "arrowTypeTarget": "None",
  //     "lineStyle": "Solid",
  //     "textStart": "Start",
  //     "textCenter": "Center",
  //     "textEnd": "End"
  //   }
  // }
  addEdgeToNode(connection) {
    const id = window.location.hash.split("/").pop();
    $.ajax({
      url: BaseOperationsURL + "/v1/diagram/" + id + "/edge/add/to_node",
      method: "POST",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      data: JSON.stringify(connection.toJSON()),
      success: (response) => {
        console.log("Add edge to node: ", response);
        console.log(connection.toJSON())
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.error("Adding edge to node failed:", textStatus, errorThrown);
      },
    });
  }
}
