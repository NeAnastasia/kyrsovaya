import { Connection } from "./connection.js";
import { View } from "./view.js";

export class Connector {
  static singleton = new Connector();
  constructor() {
    this.currentSocket = null;
  }
  connectAssociation(point) {
    console.log("associated")
    const conn = new Connection(this.currentSocket, null, point);
    this.connect(conn);
  }
  connectSockets(sock) {
    const conn = new Connection(this.currentSocket, sock);
    sock.addConnection(conn);
    sock.update();
    this.connect(conn);
  }
  connect(conn) {
    this.currentSocket.addConnection(conn);
    this.currentSocket.update();
    View.singleton.connections.push(conn);
    this.currentSocket = null;
  }
}
