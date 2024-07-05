import { ArrowType } from "./enum/ArrowType.js";
import { Menu } from "./menu.js";
import { Connector } from "./connector.js";
import { View } from "./view.js";

export class Connection {
    static idCon = 0;
    constructor(
        inSock,
        outSock,
        arrowType = ArrowType.Default,
        isDashed = false
    ) {
        this.id = Connection.idCon;
        Connection.idCon++;
        this.inSock = inSock;
        this.outSock = outSock;
        this.parrowType = arrowType;
        this.arrowType = arrowType;
        this.el = $(
            `<svg class="node-connection">
        <defs>
        <marker id="" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">` +
            this.arrowType +
            `</marker>
      </defs>
      <line x1="0" y1="0" x2="0" y2="0" stroke-width="1" stroke="#000" marker-end="" stroke-dasharray="" class="arrow"/>
        </svg>`
        ).appendTo("#view-area")[0];
        this.lineEl = $(this.el).find("line")[0];
        this.markerEL = $(this.el).find("marker")[0];
        $(this.markerEL).attr("id", `arrowhead-${this.id}`);
        $(this.lineEl).attr("marker-end", `url(#arrowhead-${this.id})`);
        this.lineEl.addEventListener("click", (e) => {
            e.stopPropagation()
            const r = View.singleton.el.getBoundingClientRect()
            console.log(View.singleton.el)
            console.log(r)
            Menu.singleton.appearing(this, e.clientX - r.left, e.clientY - r.top);
        });
        this.update();
        window.dispatchEvent(new CustomEvent("viewupdate"))
    }
    destroy() {
        $(this.el).remove();
        this.inSock.removeConnection(this);
        this.outSock.removeConnection(this);
    }
    updateLine(isDashed) {
        this.isDashed = isDashed;
        if (this.isDashed) {
            $(this.lineEl).attr("stroke-dasharray", 6);
        } else {
            $(this.lineEl).attr("stroke-dasharray", 0);
        }
        this.update();
    }
    changeArrowHead(type) {
        this.arrowType = type;
        this.update();
    }
    update() {
        const inSockPos = this.inSock.getAbsolutePosition();
        const outSockPos = this.outSock.getAbsolutePosition();
        $(this.lineEl).attr("x1", `${inSockPos[0]}`);
        $(this.lineEl).attr("y1", `${inSockPos[1]}`);
        $(this.lineEl).attr("x2", `${outSockPos[0]}`);
        $(this.lineEl).attr("y2", `${outSockPos[1]}`);
        if (this.arrowType != this.parrowType) {
            $(this.el).find("marker").html(this.arrowType);
            this.parrowType = this.arrowType;
        }
        if (this.arrowType == ArrowType.Default) {
            $(this.markerEL).attr("refX", `10`);
        } else {
            $(this.markerEL).attr("refX", `0`);
        }
    }
    toJSON() {
        return {
            inSock:{
                type:this.inSock.type,
                id:this.inSock.parent.id,
            },
            outSock:{
                type:this.outSock.type,
                id:this.outSock.parent.id,
            },
            arrowType: this.arrowType,
        }
    }
    static fromJSON(json){
        const n1 = getNode(json.inSock.id)
        const n2 = getNode(json.outSock.id)
        const inSock = n1.sockets[json.inSock.type]
        const outSock = n2.sockets[json.outSock.type]
        const conn = new Connection(inSock, outSock, json.arrowType)
        inSock.addConnection(conn);
        outSock.addConnection(conn);
        View.singleton.addConnection(conn)
        return conn
    }
}
