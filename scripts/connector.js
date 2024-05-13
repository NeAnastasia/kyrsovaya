import { Connection } from "./connection.js";

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

        this.currentSocket = null;
    }
}