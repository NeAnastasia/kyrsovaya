import { ArrowType } from "./enum/ArrowType.js";
import { Menu } from "./menu.js";
import { Connector } from "./connector.js";
import { View } from "./view.js";

export class Connection {
  static idCon = 0;
  constructor(
    inSock,
    outSock,
    arrowTypeStart = ArrowType.None,
    arrowTypeEnd = ArrowType.DefaultEnd,
    isDashed = false
  ) {
    this.id = Connection.idCon;
    this.color = "#000000";
    Connection.idCon++;
    this.inSock = inSock;
    this.outSock = outSock;
    this.parrowTypeStart = arrowTypeStart;
    this.arrowTypeStart = arrowTypeStart;
    this.parrowTypeEnd = arrowTypeEnd;
    this.arrowTypeEnd = arrowTypeEnd;
    this.spanIn = document.createElement("span");
    this.spanIn.style.position = "absolute";
    this.spanIn.style.left = inSock.getAbsolutePosition()[0] + "px";
    this.spanIn.style.top = inSock.getAbsolutePosition()[1] + "px";
    this.spanOut = document.createElement("span");
    this.spanOut.style.position = "absolute";
    this.spanOut.style.left = outSock.getAbsolutePosition()[0] + "px";
    this.spanOut.style.top = outSock.getAbsolutePosition()[1] + "px";
    this.spanCenter = document.createElement("span");
    this.spanCenter.style.position = "absolute";
    this.spanCenter.style.left = (inSock.getAbsolutePosition()[0] + outSock.getAbsolutePosition()[0])/2 + "px";
    this.spanCenter.style.top = (inSock.getAbsolutePosition()[1] + outSock.getAbsolutePosition()[1])/2 + "px";
    this.el = $(
      `<svg class="node-connection">
        <defs>
        <marker id="" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">` +
        this.arrowTypeStart +
        `</marker>
        <marker id="" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">` +
        this.arrowTypeEnd +
        `</marker>
      </defs>
      <line x1="0" y1="0" x2="0" y2="0" stroke-width="2" marker-end="" marker-start="" stroke-dasharray="" class="arrow"/>
        </svg>`
    ).appendTo("#view-area")[0];
    this.lineEl = $(this.el).find("line")[0];
    this.markerELStart = $(this.el).find("marker")[0];
    $(this.markerELStart).attr("id", `arrowhead-${this.id}-start`);
    this.markerELEnd = $(this.el).find("marker")[1];
    $(this.markerELEnd).attr("id", `arrowhead-${this.id}-end`);
    $(this.lineEl).attr("marker-end", `url(#arrowhead-${this.id}-end)`);
    $(this.lineEl).attr("marker-start", `url(#arrowhead-${this.id}-start)`);
    this.lineEl.addEventListener("click", (e) => {
      e.stopPropagation();
      const r = View.singleton.el.getBoundingClientRect();
      console.log(View.singleton.el);
      console.log(r);
      Menu.singleton.appearing(this, e.clientX - r.left, e.clientY - r.top);
    });
    this.changeColor(this.color);
    this.update();
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
  changeArrowHeadEnd(type) {
    this.arrowTypeEnd = type;
    this.update();
  }
  changeArrowHeadStart(type) {
    this.arrowTypeStart = type;
    this.update();
  }
  changeColorArrowHead(color) {
    if ($(this.el).find("polyline")[0] !== undefined) {
      $(this.el).find("polyline")[0].style.stroke = color;
    } else if ($(this.el).find("polygon")[0] !== undefined) {
      $(this.el).find("polygon")[0].style.stroke = color;
      if (
        this.arrowTypeStart == ArrowType.FilledStart ||
        this.arrowTypeStart == ArrowType.Rhombus
      ) {
        $(this.el).find("polygon")[0].style.fill = color;
      }
    }
    if ($(this.el).find("polyline")[1] !== undefined) {
      $(this.el).find("polyline")[1].style.stroke = color;
    } else if ($(this.el).find("polygon")[1] !== undefined) {
      $(this.el).find("polygon")[1].style.stroke = color;
      if (
        this.arrowTypeEnd == ArrowType.FilledEnd ||
        this.arrowTypeEnd == ArrowType.Rhombus
      ) {
        $(this.el).find("polygon")[1].style.fill = color;
      }
    }
  }
  changeColor(color) {
    this.color = color;
    $(this.el).find("line")[0].style.stroke = this.color;
    this.update();
  }
  update() {
    this.spanIn.style.left = this.inSock.getAbsolutePosition()[0] + "px";
    this.spanIn.style.top = this.inSock.getAbsolutePosition()[1] + "px";
    this.spanOut.style.left = this.outSock.getAbsolutePosition()[0] + "px";
    this.spanOut.style.top = this.outSock.getAbsolutePosition()[1] + "px";
    this.spanCenter.style.left = (this.inSock.getAbsolutePosition()[0] + this.outSock.getAbsolutePosition()[0])/2 + "px";
    this.spanCenter.style.top = (this.inSock.getAbsolutePosition()[1] + this.outSock.getAbsolutePosition()[1])/2 + "px";
    this.changeColorArrowHead(this.color);
    const inSockPos = this.inSock.getAbsolutePosition();
    const outSockPos = this.outSock.getAbsolutePosition();
    $(this.lineEl).attr("x1", `${inSockPos[0]}`);
    $(this.lineEl).attr("y1", `${inSockPos[1]}`);
    $(this.lineEl).attr("x2", `${outSockPos[0]}`);
    $(this.lineEl).attr("y2", `${outSockPos[1]}`);
    if (this.arrowTypeEnd != this.parrowTypeEnd) {
      $(this.el).find("marker")[1].innerHTML = this.arrowTypeEnd;
      this.parrowTypeEnd = this.arrowTypeEnd;
    }
    if (this.arrowTypeStart != this.parrowTypeStart) {
      $(this.el).find("marker")[0].innerHTML = this.arrowTypeStart;
      this.parrowTypeStart = this.arrowTypeStart;
    }
    if (this.arrowTypeEnd == ArrowType.DefaultEnd) {
      $(this.markerELEnd).attr("refX", `10`);
    } else {
      $(this.markerELEnd).attr("refX", `0`);
    }
    if (this.arrowTypeStart != ArrowType.DefaultStart) {
      $(this.markerELStart).attr("refX", `10`);
    } else {
      $(this.markerELStart).attr("refX", `0`);
    }
  }
  toJSON() {
    return {
      inSock: {
        type: this.inSock.type,
        id: this.inSock.parent.id,
      },
      outSock: {
        type: this.outSock.type,
        id: this.outSock.parent.id,
      },
      arrowTypeEnd: this.arrowTypeEnd,
      arrowTypeStart: this.arrowTypeStart,
    };
  }
  static fromJSON(json) {
    const n1 = getNode(json.inSock.id);
    const n2 = getNode(json.outSock.id);
    const inSock = n1.sockets[json.inSock.type];
    const outSock = n2.sockets[json.outSock.type];
    const conn = new Connection(
      inSock,
      outSock,
      json.arrowTypeStart,
      json.arrowTypeEnd
    );
    inSock.addConnection(conn);
    outSock.addConnection(conn);
    View.singleton.addConnection(conn);
    return conn;
  }
}
