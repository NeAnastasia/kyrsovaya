import { Connection } from "./connection.js";
import { View } from "./view.js";

export class Connector{
    static singleton = new Connector();
    constructor(){
        this.currentSocket = null;
    }
    connect(sock){
        const conn = new Connection(this.currentSocket, sock)
        this.currentSocket.addConnection(conn)
        sock.addConnection(conn)
        
        this.currentSocket.update();
        sock.update();
        View.singleton.connections.push(conn)

        this.currentSocket = null;
    }
}