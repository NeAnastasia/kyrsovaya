export class Connection {
  constructor(inSock, outSock) {
    this.inSock = inSock;
    this.outSock = outSock;
    console.log(this.inSock);
    console.log(this.outSock);
    this.el = $(`
        <svg xmlns="http://www.w3.org/2000/svg"class="node-connection">
        <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" />
        </marker>
      </defs>
      <line x1="" y1="" x2="" y2="" stroke-width="1" stroke="#000"  marker-end="url(#arrowhead)" />
        </svg>
        `).appendTo("#view-area")[0];
    this.lineEl = $(this.el).find("line")[0];
    this.markerEL = $(this.el).find("marker")[0];
    this.update();
  }
  destroy() {
    this.inSock.removeConnection(this);
    this.outSock.removeConnection(this);
  }
  update() {
    const inSockPos = this.inSock.getAbsolutePosition();
    const outSockPos = this.outSock.getAbsolutePosition();
    $(this.lineEl).attr("x1", `${inSockPos[0]}`);
    $(this.lineEl).attr("y1", `${inSockPos[1]}`);
    $(this.lineEl).attr("x2", `${outSockPos[0]}`);
    $(this.lineEl).attr("y2", `${outSockPos[1]}`);
  }
}
