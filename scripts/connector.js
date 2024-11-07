import { Connection } from "./connection.js";
import { MovingConnection } from "./movingConnection.js";
import { View } from "./view.js";
import { ArrowType } from "./enum/ArrowType.js";
import { FreeSocket } from "./socket.js";

export class Connector {
  static singleton = new Connector();
  constructor() {
    this.currentSocket = null;
  }
  reconnect(socket) {
    if (MovingConnection.singleton.currentConnection.outPoint !== null) {
      this.currentSocket = socket;
      this.reconnectAssociation(
        MovingConnection.singleton.currentConnection.outPoint,
        MovingConnection.singleton.currentConnection.outPoint.connectionParent
      );
      MovingConnection.singleton.deleteCurrentConnection();
    } else {
      this.#reconnectSockets(socket);
      MovingConnection.singleton.deleteCurrentConnection();
    }
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
    } else {
      const conn = new Connection(this.currentSocket, sock);
      sock.addConnection(conn);
      this.#connect(conn);
    }
  }
  #connect(conn) {
    this.currentSocket.addConnection(conn);
    View.singleton.connections.push(conn);
    this.currentSocket = null;
    const selection = window.getSelection();
    selection.removeAllRanges();
  }
}
