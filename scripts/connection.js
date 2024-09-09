import { ArrowType } from "./enum/ArrowType.js";
import { ArrowsMenu } from "./arrowsMenu.js";
import { Connector } from "./connector.js";
import { View } from "./view.js";

export class Connection {
  static idCon = 0;
  constructor(
    inSock,
    outSock,
    arrowTypeStart = ArrowType.None,
    arrowTypeEnd = ArrowType.None,
    isDashed = false,
    textCenter = "",
    textEnd = "",
    textStart = "",
    id = "",
    color = "#000000"
  ) {
    if (id !== "") {
      this.idCon = parseInt(id.replace("connection-", ""), 10);
    }
    this.id = id === "" ? id : "connection-" + Connection.idCon;
    this.color = color;
    Connection.idCon++;
    this.isDashed = isDashed;
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
    this.spanIn.textContent = textStart;
    $(this.spanIn).appendTo("#view-area")[0];
    this.spanOut = document.createElement("span");
    this.spanOut.style.position = "absolute";
    this.spanOut.style.left = outSock.getAbsolutePosition()[0] + "px";
    this.spanOut.style.top = outSock.getAbsolutePosition()[1] + "px";
    this.spanOut.textContent = textEnd;
    $(this.spanOut).appendTo("#view-area")[0];
    this.spanCenter = document.createElement("span");
    this.spanCenter.style.position = "absolute";
    this.spanCenter.style.left =
      (inSock.getAbsolutePosition()[0] + outSock.getAbsolutePosition()[0]) / 2 +
      "px";
    this.spanCenter.style.top =
      (inSock.getAbsolutePosition()[1] + outSock.getAbsolutePosition()[1]) / 2 +
      "px";
    this.spanCenter.textContent = textCenter;
    $(this.spanCenter).appendTo("#view-area")[0];
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
      <line x1="0" y1="0" x2="0" y2="0" stroke-width="2" marker-end="" marker-start="" stroke-dasharray=""/>
      <line x1="0" y1="0" x2="0" y2="0" stroke-width="20" class="arrow"/>
        </svg>`
    ).appendTo("#view-area")[0];
    $(this.el).attr("id", this.id);
    this.lineEl = $(this.el).find("line")[0];
    this.lineClickEl = $(this.el).find("line")[1];
    this.markerELStart = $(this.el).find("marker")[0];
    $(this.markerELStart).attr("id", `arrowhead-${this.id}-start`);
    this.markerELEnd = $(this.el).find("marker")[1];
    $(this.markerELEnd).attr("id", `arrowhead-${this.id}-end`);
    $(this.lineEl).attr("marker-end", `url(#arrowhead-${this.id}-end)`);
    $(this.lineEl).attr("marker-start", `url(#arrowhead-${this.id}-start)`);
    this.lineClickEl.addEventListener("click", (e) => {
      e.stopPropagation();
      const r = View.singleton.el.getBoundingClientRect();
      if (document.getElementById("menu")) {
        var events = $._data(document.getElementById("menu"), "events");
        if (events) {
          $.each(events, function (evName, e) {
            if (evName == "blur") {
              $("#menu").off("blur");
              return false;
            }
          });
        }
      }

      ArrowsMenu.singleton.appearing(
        this,
        e.clientX - r.left,
        e.clientY - r.top
      );
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
  reverseArrowHeads() {
    var previous = this.arrowTypeStart;
    this.arrowTypeStart = this.arrowTypeEnd;
    this.arrowTypeEnd = previous;
    switch (this.arrowTypeStart) {
      case ArrowType.DefaultEnd:
        this.arrowTypeStart = ArrowType.DefaultStart;
        break;
      case ArrowType.FilledEnd:
        this.arrowTypeStart = ArrowType.FilledStart;
        break;
      case ArrowType.HollowEnd:
        this.arrowTypeStart = ArrowType.HollowStart;
        break;
    }
    switch (this.arrowTypeEnd) {
      case ArrowType.DefaultStart:
        this.arrowTypeEnd = ArrowType.DefaultEnd;
        break;
      case ArrowType.FilledStart:
        this.arrowTypeEnd = ArrowType.FilledEnd;
        break;
      case ArrowType.HollowStart:
        this.arrowTypeEnd = ArrowType.HollowEnd;
        break;
    }
    this.update();
  }
  changeColorArrowHead() {
    if (this.arrowTypeStart === ArrowType.DefaultStart) {
      $(this.el).find(
        "#arrowhead-" + this.id + "-start polyline"
      )[0].style.stroke = this.color;
    } else if (this.arrowTypeStart !== ArrowType.None) {
      $(this.el).find(
        "#arrowhead-" + this.id + "-start polygon"
      )[0].style.stroke = this.color;
      if (
        this.arrowTypeStart === ArrowType.FilledStart ||
        this.arrowTypeStart === ArrowType.Rhombus
      ) {
        $(this.el).find(
          "#arrowhead-" + this.id + "-start polygon"
        )[0].style.fill = this.color;
      }
    }
    if (this.arrowTypeEnd === ArrowType.DefaultEnd) {
      $(this.el).find(
        "#arrowhead-" + this.id + "-end polyline"
      )[0].style.stroke = this.color;
    } else if (this.arrowTypeEnd !== ArrowType.None) {
      $(this.el).find(
        "#arrowhead-" + this.id + "-end polygon"
      )[0].style.stroke = this.color;
      if (
        this.arrowTypeEnd === ArrowType.FilledEnd ||
        this.arrowTypeEnd === ArrowType.Rhombus
      ) {
        $(this.el).find(
          "#arrowhead-" + this.id + "-end polygon"
        )[0].style.fill = this.color;
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
    this.spanCenter.style.left =
      (this.inSock.getAbsolutePosition()[0] +
        this.outSock.getAbsolutePosition()[0]) /
        2 +
      "px";
    this.spanCenter.style.top =
      (this.inSock.getAbsolutePosition()[1] +
        this.outSock.getAbsolutePosition()[1]) /
        2 +
      "px";
    const inSockPos = this.inSock.getAbsolutePosition();
    const outSockPos = this.outSock.getAbsolutePosition();
    $(this.lineEl).attr("x1", `${inSockPos[0]}`);
    $(this.lineEl).attr("y1", `${inSockPos[1]}`);
    $(this.lineEl).attr("x2", `${outSockPos[0]}`);
    $(this.lineEl).attr("y2", `${outSockPos[1]}`);
    $(this.lineClickEl).attr("x1", `${inSockPos[0]}`);
    $(this.lineClickEl).attr("y1", `${inSockPos[1]}`);
    $(this.lineClickEl).attr("x2", `${outSockPos[0]}`);
    $(this.lineClickEl).attr("y2", `${outSockPos[1]}`);
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
    this.changeColorArrowHead();
  }

  toJSON() {
    return {
      id: this.id,
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
      textCenter: this.spanCenter.textContent,
      textEnd: this.spanOut.textContent,
      textStart: this.spanIn.textContent,
      color: this.color,
    };
  }
  static fromJSON(json) {
    const n1 = getNode(parseInt(json.inSock.id.replace("node-", ""), 10));
    const n2 = getNode(parseInt(json.outSock.id.replace("node-", ""), 10));
    const inSock = n1.sockets[json.inSock.type];
    const outSock = n2.sockets[json.outSock.type];
    const conn = new Connection(
      inSock,
      outSock,
      json.arrowTypeStart,
      json.arrowTypeEnd,
      json.isDashed,
      json.textCenter,
      json.textEnd,
      json.textStart,
      json.id,
      json.color
    );
    inSock.addConnection(conn);
    outSock.addConnection(conn);
    View.singleton.addConnection(conn);
    return conn;
  }
}
