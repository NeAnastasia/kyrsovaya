import { ArrowType } from "./enum/ArrowType.js";
import { ArrowsMenu } from "./arrowsMenu.js";
import { Connector } from "./connector.js";
import { View } from "./view.js";
import { ArrowsCreatingPath } from "./arrowsCreatingPath.js";
import { Point } from "./point.js";
import { MovingConnection } from "./movingConnection.js";

export class Connection {
  static idCon = 0;
  constructor(
    inSock,
    outSock = null,
    outPoint = null,
    arrowTypeStart = ArrowType.None,
    arrowTypeEnd = ArrowType.DefaultEnd,
    isDashed = false,
    textCenter = "",
    textEnd = "",
    textStart = "",
    id = "",
    color = "#000000"
  ) {
    if (id !== "") {
      Connection.idCon = parseInt(id.replace("connection-", ""), 10);
    }
    this.id = id === "" ? "connection-" + Connection.idCon : id;
    this.color = color;
    Connection.idCon++;
    this.isArrowsReversed = false;
    this.arrowLines = [];
    this.connectedConnections = [];
    this.isDashed = isDashed;
    this.inSock = inSock;
    this.outSock = outSock;
    this.outPoint = outPoint;
    this.parrowTypeStart = arrowTypeStart;
    this.arrowTypeStart = arrowTypeStart;
    this.parrowTypeEnd = arrowTypeEnd;
    this.arrowTypeEnd = arrowTypeEnd;
    this.spanIn = document.createElement("span");
    $(this.spanIn).addClass("cardinal-number");
    this.spanIn.textContent = textStart;
    $(this.spanIn).appendTo("#view-area")[0];
    this.spanOut = document.createElement("span");
    $(this.spanOut).addClass("cardinal-number");
    this.spanOut.textContent = textEnd;
    $(this.spanOut).appendTo("#view-area")[0];
    this.spanCenter = document.createElement("span");
    $(this.spanCenter).addClass("cardinal-number");
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
      <line> </line>
      <line class="arrow"> </line>
      </svg>`
    ).appendTo("#view-area")[0];
    $(this.el).attr("id", this.id);
    this.lineEls = $(this.el).find("line").not(".arrow");
    this.markerELStart = $(this.el).find("marker")[0];
    $(this.markerELStart).attr("id", `arrowhead-${this.id}-start`);
    this.markerELEnd = $(this.el).find("marker")[1];
    $(this.markerELEnd).attr("id", `arrowhead-${this.id}-end`);
    this.lineClickEls = $(this.el).find(".arrow");
    this.inClick = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    $(this.inClick).attr("r", "6").addClass("arrow-edge-click");
    $(this.inClick).appendTo(this.el)[0];
    this.outClick = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    $(this.outClick).attr("r", "6").addClass("arrow-edge-click");
    $(this.outClick).appendTo(this.el)[0];
    $(".arrow-edge-click").on("mousedown", (e) => {
      if (!View.singleton.connectionIsMoving) {
        $(".node-text-content, .cardinal-number, .node-text").addClass(
          "no-select"
        );
        View.singleton.connectionIsMoving = true;
        MovingConnection.singleton.currentConnection = this;
        if (e.target === this.outClick && this.inSock !== null) {
          Connector.singleton.currentSocket = this.inSock;
        } else if (e.target === this.inClick && this.outSock !== null) {
          Connector.singleton.currentSocket = this.outSock;
        }
      }
    });
    this.update();
  }
  destroy() {
    $(this.el).remove();
    $(this.spanIn).remove();
    $(this.spanOut).remove();
    $(this.spanCenter).remove();
    this.inSock.removeConnection(this);
    if (this.outSock !== null) {
      this.outSock.removeConnection(this);
    }
  }
  updateLine(isDashed) {
    this.isDashed = isDashed;
    if (this.isDashed) {
      for (var i = 0; i < this.lineEls.length; i++) {
        $(this.lineEls[i]).attr("stroke-dasharray", 6);
      }
    } else {
      for (var i = 0; i < this.lineEls.length; i++) {
        $(this.lineEls[i]).attr("stroke-dasharray", 0);
      }
    }
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
    if (this.arrowTypeEnd !== ArrowType.None) {
      if (
        this.arrowTypeEnd === ArrowType.DefaultStart ||
        this.arrowTypeEnd === ArrowType.DefaultEnd
      ) {
        $(this.el).find(
          "#arrowhead-" + this.id + "-end polyline"
        )[0].style.stroke = this.color;
      } else if (
        this.arrowTypeEnd === ArrowType.FilledStart ||
        this.arrowTypeEnd === ArrowType.FilledEnd ||
        this.arrowTypeEnd === ArrowType.Rhombus
      ) {
        $(this.el).find(
          "#arrowhead-" + this.id + "-end polygon"
        )[0].style.fill = this.color;
      } else {
        $(this.el).find(
          "#arrowhead-" + this.id + "-end polygon"
        )[0].style.stroke = this.color;
      }
    }
    if (this.arrowTypeStart !== ArrowType.None) {
      if (
        this.arrowTypeStart === ArrowType.DefaultStart ||
        this.arrowTypeStart === ArrowType.DefaultEnd
      ) {
        $(this.el).find(
          "#arrowhead-" + this.id + "-start polyline"
        )[0].style.stroke = this.color;
      } else if (
        this.arrowTypeStart === ArrowType.FilledStart ||
        this.arrowTypeStart === ArrowType.FilledEnd ||
        this.arrowTypeStart === ArrowType.Rhombus
      ) {
        $(this.el).find(
          "#arrowhead-" + this.id + "-start polygon"
        )[0].style.fill = this.color;
      } else {
        $(this.el).find(
          "#arrowhead-" + this.id + "-start polygon"
        )[0].style.stroke = this.color;
      }
    }
  }
  changeColor(color) {
    this.color = color;
    $(this.lineEls).css("stroke", this.color);
    this.changeColorArrowHead();
  }
  swapArrowHeads() {
    switch (this.arrowTypeEnd) {
      case ArrowType.DefaultEnd:
        this.arrowTypeEnd = ArrowType.DefaultStart;
        break;
      case ArrowType.FilledEnd:
        this.arrowTypeEnd = ArrowType.FilledStart;
        break;
      case ArrowType.HollowEnd:
        this.arrowTypeEnd = ArrowType.HollowStart;
        break;
    }
    switch (this.arrowTypeStart) {
      case ArrowType.DefaultStart:
        this.arrowTypeStart = ArrowType.DefaultEnd;
        break;
      case ArrowType.FilledStart:
        this.arrowTypeStart = ArrowType.FilledEnd;
        break;
      case ArrowType.HollowStart:
        this.arrowTypeStart = ArrowType.HollowEnd;
        break;
    }
  }
  unswapArrowHeads() {
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
    this.update();
  }
  changeLengthOfLineInSakeOfArrowHead() {
    const line = this.arrowLines[this.arrowLines.length - 1];
    if ($(line).attr("y1") === $(line).attr("y2")) {
      if ($(line).attr("x1") < $(line).attr("x2")) {
        $(line).attr("x2", parseFloat($(line).attr("x2")) - 20);
      } else {
        $(line).attr("x2", parseFloat($(line).attr("x2")) + 20);
      }
    } else {
      if ($(line).attr("y1") < $(line).attr("y2")) {
        $(line).attr("y2", parseFloat($(line).attr("y2")) - 20);
      } else {
        $(line).attr("y2", parseFloat($(line).attr("y2")) + 20);
      }
    }
  }
  checkIfArrowsNeedToBeChanged() {
    if (this.arrowTypeEnd != this.parrowTypeEnd) {
      $(this.el).find("marker")[1].innerHTML = this.arrowTypeEnd;
      this.parrowTypeEnd = this.arrowTypeEnd;
    }
    if (this.arrowTypeStart != this.parrowTypeStart) {
      $(this.el).find("marker")[0].innerHTML = this.arrowTypeStart;
      this.parrowTypeStart = this.arrowTypeStart;
    }
    if (this.isArrowsReversed) {
      if (this.arrowTypeEnd != ArrowType.DefaultStart) {
        $(this.markerELEnd).attr("refX", `10`);
      } else {
        $(this.markerELEnd).attr("refX", `0`);
      }
      if (this.arrowTypeStart == ArrowType.DefaultEnd) {
        $(this.markerELStart).attr("refX", `10`);
      } else {
        $(this.markerELStart).attr("refX", `0`);
      }
    } else {
      if (
        this.arrowTypeEnd == ArrowType.DefaultEnd ||
        this.arrowTypeEnd === ArrowType.None
      ) {
        $(this.markerELEnd).attr("refX", `10`);
      } else {
        if (this.outPoint !== null) {
          this.changeLengthOfLineInSakeOfArrowHead();
          $(this.markerELEnd).attr("refX", `0`);
        } else {
          $(this.markerELEnd).attr("refX", `0`);
        }
      }
      if (this.arrowTypeStart != ArrowType.DefaultStart) {
        $(this.markerELStart).attr("refX", `10`);
      } else {
        $(this.markerELStart).attr("refX", `0`);
      }
    }
  }
  addClickEventToLines() {
    $(this.lineClickEls).on("mouseup", (e) => {
      if (View.singleton.connectionIsMoving) {
        if (
          MovingConnection.singleton.checkIfConnectionIsConnectingToItself(
            this.lineEls[$(this.lineClickEls).index(e.target)]
          )
        ) {
          View.singleton.showAlertForConnectingConnectionToItself();
          Connector.singleton.currentSocket = null;
          MovingConnection.singleton.currentConnection = null;
        } else {
          if (
            MovingConnection.singleton.checkIfCurrentConnectionIsSockPointConnection() &&
            Connector.singleton.currentSocket === null
          ) {
            View.singleton.showAlertForConnectingSockPointConnectionToConnectionBySock();
            MovingConnection.singleton.currentConnection = null;
          } else {
            const point = new Point(
              e.pageX - View.singleton.pos[0],
              e.pageY - View.singleton.pos[1],
              this
            );
            point.findNewPositionReturnIsHorizontal();
            if (this.outPoint === point) {
              View.singleton.connectionIsMoving = false;
              MovingConnection.singleton.currentConnection = null;
              Connector.singleton.currentSocket = null;
            } else {
              Connector.singleton.reconnectAssociation(point, this);
              MovingConnection.singleton.deleteCurrentConnection();
            }
          }
        }
      }
    });
    $(this.lineClickEls).click((e) => {
      e.stopPropagation();
      if (Connector.singleton.currentSocket !== null) {
        const point = new Point(
          e.pageX - View.singleton.pos[0],
          e.pageY - View.singleton.pos[1],
          this
        );
        Connector.singleton.connectAssociation(point, this);
      } else {
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
      }
    });
  }
  checkIfClickLineNeedsToBeShorter() {
    let line = this.lineClickEls[this.lineClickEls.length - 1];
    if ($(line).attr("y1") === $(line).attr("y2")) {
      if ($(line).attr("x1") > $(line).attr("x2")) {
        $(line).attr("x2", parseFloat($(line).attr("x2")) + 7);
      } else {
        $(line).attr("x2", parseFloat($(line).attr("x2")) - 7);
      }
    } else {
      if ($(line).attr("y1") > $(line).attr("y2")) {
        $(line).attr("y2", parseFloat($(line).attr("y2")) + 7);
      } else {
        $(line).attr("y2", parseFloat($(line).attr("y2")) - 7);
      }
    }
    line = this.lineClickEls[0];
    if ($(line).attr("y1") === $(line).attr("y2")) {
      if ($(line).attr("x1") > $(line).attr("x2")) {
        $(line).attr("x1", parseFloat($(line).attr("x1")) - 7);
      } else {
        $(line).attr("x1", parseFloat($(line).attr("x1")) + 7);
      }
    } else {
      if ($(line).attr("y1") > $(line).attr("y2")) {
        $(line).attr("y1", parseFloat($(line).attr("y1")) - 7);
      } else {
        $(line).attr("y1", parseFloat($(line).attr("y1")) + 7);
      }
    }
  }
  definePosAdditionalElements() {
    this.spanIn.style.left = this.inSock.getAbsolutePosition()[0] + "px";
    this.spanIn.style.top = this.inSock.getAbsolutePosition()[1] + "px";
    $(this.inClick).attr("cx", this.inSock.getAbsolutePosition()[0]);
    $(this.inClick).attr("cy", this.inSock.getAbsolutePosition()[1]);
    if (this.outSock !== null) {
      this.spanOut.style.left = this.outSock.getAbsolutePosition()[0] + "px";
      this.spanOut.style.top = this.outSock.getAbsolutePosition()[1] + "px";
      $(this.outClick).attr("cx", this.outSock.getAbsolutePosition()[0]);
      $(this.outClick).attr("cy", this.outSock.getAbsolutePosition()[1]);
    } else {
      this.spanOut.style.left = this.outPoint.x + "px";
      this.spanOut.style.top = this.outPoint.y + "px";
      $(this.outClick).attr("cx", this.outPoint.x);
      $(this.outClick).attr("cy", this.outPoint.y);
    }
    if (this.arrowLines.length === 2) {
      this.spanCenter.style.left = $(this.arrowLines[0]).attr("x2") + "px";
      this.spanCenter.style.top = $(this.arrowLines[0]).attr("y2") + "px";
    } else {
      const index = Math.floor(this.arrowLines.length / 2);
      this.spanCenter.style.left =
        (parseFloat($(this.arrowLines[index]).attr("x2")) +
          parseFloat($(this.arrowLines[index]).attr("x1"))) /
          2 +
        "px";
      this.spanCenter.style.top =
        (parseFloat($(this.arrowLines[index]).attr("y2")) +
          parseFloat($(this.arrowLines[index]).attr("y1"))) /
          2 +
        "px";
    }
  }
  update() {
    if (this.outSock !== null) {
      this.arrowLines = ArrowsCreatingPath.singleton.creatingPathForSockets(
        this.inSock,
        this.outSock,
        this.isDashed,
        this.id
      );
    } else {
      let isHorizontal = this.outPoint.findNewPositionReturnIsHorizontal();
      this.arrowLines =
        ArrowsCreatingPath.singleton.creatingPathForSocketAndPoint(
          this.inSock,
          this.outPoint,
          this.isDashed,
          this.id,
          isHorizontal
        );
    }
    if (
      $(this.arrowLines[0]).attr("marker-start") ===
      `url(#arrowhead-${this.id}-end)`
    ) {
      this.isArrowsReversed = true;
      this.swapArrowHeads();
    }
    this.definePosAdditionalElements();
    $(this.lineEls).remove();
    $(this.lineClickEls).remove();
    this.checkIfArrowsNeedToBeChanged();
    for (var i = 0; i < this.arrowLines.length; i++) {
      $(this.el).append(this.arrowLines[i]);
      const clickLine = $(this.arrowLines[i])
        .clone()
        .addClass("arrow")
        .css("stroke", this.color);
      if (clickLine.attr("marker-start") !== undefined) {
        clickLine.attr("marker-start", "");
      }
      if (clickLine.attr("marker-end") !== undefined) {
        clickLine.attr("marker-end", "");
      }
      $(this.el).append(clickLine);
    }
    this.lineClickEls = $(this.el).find(".arrow");
    this.lineEls = $(this.el).find("line").not(".arrow");
    this.checkIfClickLineNeedsToBeShorter();
    this.changeColor(this.color);
    this.addClickEventToLines();
    if (this.connectedConnections.length !== 0) {
      $(this.connectedConnections).each((i, conn) => {
        conn.update();
      });
    }
    this.arrowLines = [];
  }
  toJSON() {
    const toJSONClass = {
      id: this.id,
      inSock: {
        type: this.inSock.type,
        id: this.inSock.parent.id,
      },
      arrowTypeEnd: this.arrowTypeEnd,
      arrowTypeStart: this.arrowTypeStart,
      textCenter: this.spanCenter.textContent,
      textEnd: this.spanOut.textContent,
      textStart: this.spanIn.textContent,
      color: this.color,
    };
    if (this.outSock !== null) {
      toJSONClass.outSock = {
        type: this.outSock.type,
        id: this.outSock.parent.id,
      };
      toJSONClass.outPoint = null;
    } else {
      toJSONClass.outSock = null;
      toJSONClass.outPoint = {
        pos: [this.outPoint.x, this.outPoint.y],
        parentId: [this.outPoint.connectionParent.id],
      };
    }
    return toJSONClass;
  }
  static fromJSON(json) {
    const n1 = getNode(parseFloat(json.inSock.id.replace("node-", ""), 10));
    var outSock = null;
    var point = null;
    var foundConnection = null;
    if (json.outSock !== null) {
      const n2 = getNode(parseFloat(json.outSock.id.replace("node-", ""), 10));
      outSock = n2.sockets[json.outSock.type];
    }
    if (json.outPoint !== null) {
      const targetId = json.outPoint.parentId;
      foundConnection = View.singleton.connections.find(
        (connection) => connection.id === targetId
      );
      point = new Point(json.outPoint.x, json.outPoint.y, foundConnection);
    }
    const inSock = n1.sockets[json.inSock.type];
    const conn = new Connection(
      inSock,
      outSock,
      point,
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
    if (json.outSock !== null) {
      outSock.addConnection(conn);
    }
    if (point !== null) {
      foundConnection.connectedConnections.push(conn);
    }
    View.singleton.addConnection(conn);
    return conn;
  }
}