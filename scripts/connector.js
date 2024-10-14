import { Connection } from "./connection.js";
import { MovingConnection } from "./movingConnection.js";
import { View } from "./view.js";

export class Connector {
  static singleton = new Connector();
  constructor() {
    this.currentSocket = null;
  }
  reconnectAssotiation(point, targetConnection) {
    let conn;
    const oldConnection = MovingConnection.singleton.currentConnection;
    if (oldConnection.inSock !== null) {
      console.log("nen");
      console.log(oldConnection);
      conn = new Connection(
        this.currentSocket,
        null,
        point,
        oldConnection.arrowTypeStart,
        oldConnection.arrowTypeEnd,
        oldConnection.isDashed,
        oldConnection.textCenter,
        oldConnection.textEnd,
        oldConnection.textStart,
        oldConnection.id,
        oldConnection.color
      );
    } else if (oldConnection.outSock !== null) {
      console.log("arr");
      conn = new Connection(
        null,
        this.currentSocket,
        point,
        oldConnection.arrowTypeStart,
        oldConnection.arrowTypeEnd,
        oldConnection.isDashed,
        oldConnection.textCenter,
        oldConnection.textEnd,
        oldConnection.textStart,
        oldConnection.id,
        oldConnection.color
      );
    }
    // arrowTypeStart = ArrowType.None,
    // arrowTypeEnd = ArrowType.DefaultEnd,
    // isDashed = false,
    // textCenter = "",
    // textEnd = "",
    // textStart = "",
    // id = "",
    // color = "#000000"
    console.log(conn);
    targetConnection.connectedConnections.push(conn);
    this.connect(conn);
  }
  connectAssociation(point, targetConnection) {
    console.log("associated");
    const conn = new Connection(this.currentSocket, null, point);
    targetConnection.connectedConnections.push(conn);
    this.connect(conn);
  }
  connectSockets(sock) {
    const conn = new Connection(this.currentSocket, sock);
    sock.addConnection(conn);
    this.connect(conn);
  }
  connect(conn) {
    this.currentSocket.addConnection(conn);
    View.singleton.connections.push(conn);
    this.currentSocket = null;
  }
}
