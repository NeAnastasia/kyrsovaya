import { Connection } from "./connection.js";
import { View } from "./view.js";

export class Connector {
  static singleton = new Connector();
  constructor() {
    this.currentSocket = null;
  }
  connectAssociation(point, targetConnection) {
    console.log("associated")
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
