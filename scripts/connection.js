import { ArrowType } from "./enum/ArrowType.js";
import { Menu } from "./menu.js";

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
      console.log(e.clientX, " ", e.clientY)
      Menu.singleton.appearing(this, e.clientX, e.clientY);
    });
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
}
