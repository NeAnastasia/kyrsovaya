import { ArrowType, ArrowSVG } from "../enum/ArrowType.js";
import { ArrowsMenu } from "../components/arrowsMenu.js";
import { Connector } from "../logic/connection/connector.js";
import { View } from "./view.js";
import { ArrowsCreatingPath } from "../logic/connection/arrowsCreatingPath.js";
import { MovingConnection } from "../logic/connection/movingConnection.js";
import { FreeSocket, NodeSocket } from "./socket.js";
import { EdgeEndType } from "../enum/EdgeEndType.js";
import { BaseOperationsURL } from "../consts/baseUrl.js";
import { OperationType } from "../enum/OperationType.js";
import { getNavbarHeight } from "../utils/helpers.js";
import { WebSocketConnection } from "../api/webSocket/webSocket.js";
import {
  patchReversingArrowHeads,
  patchUpdatingArrowOfEdge,
  patchUpdatingLineTypeOfEdge,
} from "../api/http/connectionApiRequests.js";
import { removeElementRequest } from "../api/http/elementsApiRequests.js";

export class Connection {
  static idCon = 0;
  #arrowLines;
  #parrowTypeStart;
  #parrowTypeEnd;
  #el;
  #markerELStart;
  #markerELEnd;
  #lineClickEls;
  #inClick;
  #outClick;
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
    this.#arrowLines = [];
    this.connectedConnections = [];
    this.isDashed = isDashed;
    this.inSock = inSock;
    this.outSock = outSock;
    this.outPoint = outPoint;
    this.#parrowTypeStart = arrowTypeStart;
    this.arrowTypeStart = arrowTypeStart;
    this.#parrowTypeEnd = arrowTypeEnd;
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
    this.#el = $(
      `<svg class="node-connection">
        <defs>
        <marker id="" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">` +
        ArrowSVG[this.arrowTypeStart] +
        `</marker>
        <marker id="" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">` +
        ArrowSVG[this.arrowTypeEnd] +
        `</marker>
      </defs>
      <line> </line>
      <line class="arrow"> </line>
      </svg>`
    ).appendTo("#view-area")[0];
    $(this.#el).attr("id", this.id);
    this.lineEls = $(this.#el).find("line").not(".arrow");
    this.#markerELStart = $(this.#el).find("marker")[0];
    $(this.#markerELStart).attr("id", `arrowhead-${this.id}-start`);
    this.#markerELEnd = $(this.#el).find("marker")[1];
    $(this.#markerELEnd).attr("id", `arrowhead-${this.id}-end`);
    this.#lineClickEls = $(this.#el).find(".arrow");
    this.#inClick = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    $(this.#inClick).attr("r", "6").addClass("arrow-edge-click");
    $(this.#inClick).appendTo(this.#el)[0];
    this.#outClick = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    $(this.#outClick).attr("r", "6").addClass("arrow-edge-click");
    $(this.#outClick).appendTo(this.#el)[0];
    $(".arrow-edge-click").on("mousedown", (e) => {
      if (!View.getInstance().connectionIsMoving) {
        $(".node-text-content, .cardinal-number, .node-text").addClass(
          "no-select"
        );
        View.getInstance().connectionIsMoving = true;
        MovingConnection.getInstance().currentConnection = this;
        if (e.target === this.#outClick && this.inSock !== null) {
          Connector.getInstance().currentSocket = this.inSock;
        } else if (e.target === this.#inClick && this.outSock !== null) {
          Connector.getInstance().currentSocket = this.outSock;
        }
      }
    });
    $(this.#inClick).on("mouseenter", () => {
      if (!$(this.#inClick).hasClass("click-el-hidden")) {
        this.#lineClickEls.addClass("choosen");
      }
    });

    $(this.#inClick).on("mouseleave", () => {
      if (!$(this.#inClick).hasClass("click-el-hidden")) {
        this.#lineClickEls.removeClass("choosen");
      }
    });

    $(this.#outClick).on("mouseenter", () => {
      if (!$(this.#inClick).hasClass("click-el-hidden")) {
        this.#lineClickEls.addClass("choosen");
      }
    });

    $(this.#outClick).on("mouseleave", () => {
      if (!$(this.#inClick).hasClass("click-el-hidden")) {
        this.#lineClickEls.removeClass("choosen");
      }
    });
    this.update();
    View.getInstance().update();
  }
  getInSocket() {
    return this.inSock;
  }
  getOutSocket() {
    return this.outSock;
  }
  getOutPoint() {
    return this.outPoint;
  }
  setId(id) {
    this.id = id;
    $(this.#markerELStart).attr("id", `arrowhead-${id}-start`);
    $(this.#markerELEnd).attr("id", `arrowhead-${id}-end`);
    $(this.#el).attr("id", this.id);
    this.update();
  }
  destroy() {
    this.removeWithouthDeletingDataInDB();
    removeElementRequest(this.id, this);
  }
  removeWithouthDeletingDataInDB() {
    $(this.#inClick).off("mouseenter");
    $(this.#inClick).off("mouseleave");
    $(this.#outClick).off("mouseenter");
    $(this.#outClick).off("mouseleave");
    $(this.#lineClickEls).off("mouseup");
    $(this.#el).remove();
    $(this.spanIn).remove();
    $(this.spanOut).remove();
    $(this.spanCenter).remove();
    this.inSock.removeConnection(this);
    if (this.outSock !== null) {
      this.outSock.removeConnection(this);
    }
  }
  updateLineBasedOnLineType(lineType) {
    this.updateLine(lineType === "dashed" ? true : false);
  }
  updateLineWithUpdatingInDB(isDashed) {
    this.updateLine(isDashed);
    patchUpdatingLineTypeOfEdge(this.id, this.isDashed, this);
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
  changeArrowHeadEndWithRequestToDB(type) {
    patchUpdatingArrowOfEdge(this.id, EdgeEndType.Target, type, this);
    this.changeArrowHeadEndType(type);
  }
  changeArrowHeadEndType(type) {
    this.arrowTypeEnd = type;
    this.update();
  }
  changeArrowHeadStartWithRequestToDB(type) {
    patchUpdatingArrowOfEdge(this.id, EdgeEndType.Source, type, this);
    this.changeArrowHeadStartType(type);
  }
  changeArrowHeadStartType(type) {
    this.arrowTypeStart = type;
    this.update();
  }
  reverseArrowHeadsWithUpdatingInDB() {
    this.reverseArrowHeads();
    patchReversingArrowHeads(this.id, this);
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
  #changeColorArrowHead() {
    if (this.arrowTypeEnd !== ArrowType.None) {
      if (
        this.arrowTypeEnd === ArrowType.DefaultStart ||
        this.arrowTypeEnd === ArrowType.DefaultEnd
      ) {
        $(this.#el).find(
          "#arrowhead-" + this.id + "-end polyline"
        )[0].style.stroke = this.color;
      } else if (
        this.arrowTypeEnd === ArrowType.FilledStart ||
        this.arrowTypeEnd === ArrowType.FilledEnd ||
        this.arrowTypeEnd === ArrowType.Rhombus
      ) {
        $(this.#el).find(
          "#arrowhead-" + this.id + "-end polygon"
        )[0].style.fill = this.color;
      } else {
        $(this.#el).find(
          "#arrowhead-" + this.id + "-end polygon"
        )[0].style.stroke = this.color;
      }
    }
    if (this.arrowTypeStart !== ArrowType.None) {
      if (
        this.arrowTypeStart === ArrowType.DefaultStart ||
        this.arrowTypeStart === ArrowType.DefaultEnd
      ) {
        $(this.#el).find(
          "#arrowhead-" + this.id + "-start polyline"
        )[0].style.stroke = this.color;
      } else if (
        this.arrowTypeStart === ArrowType.FilledStart ||
        this.arrowTypeStart === ArrowType.FilledEnd ||
        this.arrowTypeStart === ArrowType.Rhombus
      ) {
        $(this.#el).find(
          "#arrowhead-" + this.id + "-start polygon"
        )[0].style.fill = this.color;
      } else {
        $(this.#el).find(
          "#arrowhead-" + this.id + "-start polygon"
        )[0].style.stroke = this.color;
      }
    }
  }
  changeColor(color) {
    this.color = color;
    $(this.lineEls).css("stroke", this.color);
    this.#changeColorArrowHead();
  }
  #swapArrowHeads() {
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
  #changeLengthOfLineInSakeOfArrowHead() {
    const line = this.#arrowLines[this.#arrowLines.length - 1];
    if ($(line).attr("y1") === $(line).attr("y2")) {
      if (parseFloat($(line).attr("x1")) < parseFloat($(line).attr("x2"))) {
        $(line).attr("x2", parseFloat($(line).attr("x2")) - 20);
      } else {
        $(line).attr("x2", parseFloat($(line).attr("x2")) + 20);
      }
    } else {
      if (parseFloat($(line).attr("y1")) < parseFloat($(line).attr("y2"))) {
        $(line).attr("y2", parseFloat($(line).attr("y2")) - 20);
      } else {
        $(line).attr("y2", parseFloat($(line).attr("y2")) + 20);
      }
    }
  }
  #checkIfArrowsNeedToBeChanged() {
    if (this.arrowTypeEnd != this.#parrowTypeEnd) {
      $(this.#el).find("marker")[1].innerHTML = ArrowSVG[this.arrowTypeEnd];
      this.#parrowTypeEnd = this.arrowTypeEnd;
    }
    if (this.arrowTypeStart != this.#parrowTypeStart) {
      $(this.#el).find("marker")[0].innerHTML = ArrowSVG[this.arrowTypeStart];
      this.#parrowTypeStart = this.arrowTypeStart;
    }
    if (this.isArrowsReversed) {
      if (this.arrowTypeEnd != ArrowType.DefaultStart) {
        $(this.#markerELEnd).attr("refX", `10`);
      } else {
        $(this.#markerELEnd).attr("refX", `0`);
      }
      if (this.arrowTypeStart == ArrowType.DefaultEnd) {
        $(this.#markerELStart).attr("refX", `10`);
      } else {
        $(this.#markerELStart).attr("refX", `0`);
      }
    } else {
      if (
        this.arrowTypeEnd == ArrowType.DefaultEnd ||
        this.arrowTypeEnd === ArrowType.None
      ) {
        $(this.#markerELEnd).attr("refX", `10`);
      } else {
        if (this.outPoint !== null) {
          this.#changeLengthOfLineInSakeOfArrowHead();
          $(this.#markerELEnd).attr("refX", `0`);
        } else {
          $(this.#markerELEnd).attr("refX", `0`);
        }
      }
      if (this.arrowTypeStart != ArrowType.DefaultStart) {
        $(this.#markerELStart).attr("refX", `10`);
      } else {
        $(this.#markerELStart).attr("refX", `0`);
      }
    }
  }
  #addClickEventToLines() {
    $(this.#lineClickEls).on("mouseup", (e) => {
      if (View.getInstance().connectionIsMoving) {
        if (
          MovingConnection.getInstance().checkIfConnectionIsConnectingToItself(
            this.lineEls[$(this.#lineClickEls).index(e.target)]
          )
        ) {
          View.getInstance().showAlertForConnectingConnectionToItself();
          Connector.getInstance().currentSocket = null;
          MovingConnection.getInstance().currentConnection = null;
        } else {
          if (
            MovingConnection.getInstance().currentConnection.outPoint !== null &&
            Connector.getInstance().currentSocket === null
          ) {
            View.getInstance().showAlertForConnectingSockPointConnectionToConnectionBySock();
            MovingConnection.getInstance().currentConnection = null;
          } else {
            const point = new ConnectingPoint(
              e.pageX - View.getInstance().position.x,
              e.pageY - View.getInstance().position.y - getNavbarHeight(),
              this
            );
            point.findNewPositionReturnIsHorizontal();
            if (this.outPoint === point) {
              View.getInstance().connectionIsMoving = false;
              MovingConnection.getInstance().currentConnection = null;
              Connector.getInstance().currentSocket = null;
            } else {
              Connector.getInstance().reconnectFromThisUser(
                MovingConnection.getInstance().currentConnection.inSock,
                point,
                this
              );
              //MovingConnection.getInstance().deleteCurrentConnection();
            }
          }
        }
      }
    });
    $(this.#lineClickEls).click((e) => {
      e.stopPropagation();
      if (Connector.getInstance().currentSocket !== null) {
        const point = new ConnectingPoint(
          e.pageX - View.getInstance().position.x,
          e.pageY - View.getInstance().position.y - getNavbarHeight(),
          this
        );
        Connector.getInstance().connectAssotionAsThisUser(point, this);
      } else {
        const r = View.getInstance().el.getBoundingClientRect();
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
        ArrowsMenu.getInstance().appearing(
          this,
          e.clientX - r.left,
          e.clientY - r.top
        );
      }
    });
  }
  #checkIfClickLineNeedsToBeShorter() {
    let line = this.#lineClickEls[this.#lineClickEls.length - 1];
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
    line = this.#lineClickEls[0];
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
  #definePosAdditionalElements() {
    if (this.inSock instanceof NodeSocket) {
      this.spanIn.style.left = this.inSock.getAbsolutePosition().x + "px";
      this.spanIn.style.top = this.inSock.getAbsolutePosition().y + "px";
      $(this.#inClick).attr("cx", this.inSock.getAbsolutePosition().x);
      $(this.#inClick).attr("cy", this.inSock.getAbsolutePosition().y);
    } else {
      this.spanIn.style.left = this.inSock.position.x + "px";
      this.spanIn.style.top = this.inSock.position.y + "px";
      $(this.#inClick).attr("cx", this.inSock.position.x);
      $(this.#inClick).attr("cy", this.inSock.position.y);
    }

    if (this.outSock !== null) {
      if (this.outSock instanceof NodeSocket) {
        this.spanOut.style.left = this.outSock.getAbsolutePosition().x + "px";
        this.spanOut.style.top = this.outSock.getAbsolutePosition().y + "px";
        $(this.#outClick).attr("cx", this.outSock.getAbsolutePosition().x);
        $(this.#outClick).attr("cy", this.outSock.getAbsolutePosition().y);
      } else {
        this.spanOut.style.left = this.outSock.position.x + "px";
        this.spanOut.style.top = this.outSock.position.y + "px";
        $(this.#outClick).attr("cx", this.outSock.position.x);
        $(this.#outClick).attr("cy", this.outSock.position.y);
      }
    } else {
      this.spanOut.style.left = this.outPoint.x + "px";
      this.spanOut.style.top = this.outPoint.y + "px";
      $(this.#outClick).attr("cx", this.outPoint.x);
      $(this.#outClick).attr("cy", this.outPoint.y);
    }
    if (this.#arrowLines.length === 2) {
      this.spanCenter.style.left = $(this.#arrowLines[0]).attr("x2") + "px";
      this.spanCenter.style.top = $(this.#arrowLines[0]).attr("y2") + "px";
    } else {
      const index = Math.floor(this.#arrowLines.length / 2);
      this.spanCenter.style.left =
        (parseFloat($(this.#arrowLines[index]).attr("x2")) +
          parseFloat($(this.#arrowLines[index]).attr("x1"))) /
          2 +
        "px";
      this.spanCenter.style.top =
        (parseFloat($(this.#arrowLines[index]).attr("y2")) +
          parseFloat($(this.#arrowLines[index]).attr("y1"))) /
          2 +
        "px";
    }
  }
  disableClickEndEls() {
    this.#lineClickEls.addClass("click-el-hidden");
    $(this.#inClick).addClass("click-el-hidden");
    $(this.#outClick).addClass("click-el-hidden");
  }
  enableClickEndEls() {
    this.#lineClickEls.removeClass("click-el-hidden");
    $(this.#inClick).removeClass("click-el-hidden");
    $(this.#outClick).removeClass("click-el-hidden");
  }
  compareLines(ce, array) {
    // Проверяем длину
    if (ce.length !== array.length) {
      return false;
    }

    // Сравниваем элементы
    for (let i = 0; i < ce.length; i++) {
      // Предполагаем, что line - это объект, который можно сравнить
      if (ce[i] !== array[i]) {
        return false;
      }
    }

    return true;
  }
  update() {
    if (this.outSock !== null) {
      this.#arrowLines = ArrowsCreatingPath.getInstance().creatingPathForSockets(
        this.inSock,
        this.outSock,
        this.isDashed,
        this.id
      );
    } else {
      let isHorizontal = this.outPoint.findNewPositionReturnIsHorizontal();
      this.#arrowLines =
        ArrowsCreatingPath.getInstance().creatingPathForSocketAndPoint(
          this.inSock,
          this.outPoint,
          this.isDashed,
          this.id,
          isHorizontal
        );
    }
    if (
      $(this.#arrowLines[0]).attr("marker-start") ===
      `url(#arrowhead-${this.id}-end)`
    ) {
      this.isArrowsReversed = true;
      this.#swapArrowHeads();
    }
    this.#checkIfArrowsNeedToBeChanged();
    this.#definePosAdditionalElements();

    $(this.lineEls).remove();
    $(this.#el).find(this.lineEls).remove();
    $(this.#lineClickEls).remove();
    $(this.#el).find(this.#lineClickEls).remove();
    for (var i = 0; i < this.#arrowLines.length; i++) {
      $(this.#el).append(this.#arrowLines[i]);
      const clickLine = $(this.#arrowLines[i])
        .clone()
        .addClass("arrow")
        .css("stroke", this.color)
        .attr("stroke-dasharray", 0);
      if (clickLine.attr("marker-start") !== undefined) {
        clickLine.attr("marker-start", "");
      }
      if (clickLine.attr("marker-end") !== undefined) {
        clickLine.attr("marker-end", "");
      }
      $(this.#el).append(clickLine);
    }
    // $(this.#el).appendTo(clickLine);
    $(this.#el).appendTo("#view-area")[0];
    this.#lineClickEls = $(this.#el).find(".arrow");
    this.lineEls = $(this.#el).find("line").not(".arrow");
    this.#checkIfClickLineNeedsToBeShorter();
    this.changeColor(this.color);
    this.#addClickEventToLines();
    this.#lineClickEls.on("mouseenter", () => {
      if (!$(this.#inClick).hasClass("click-el-hidden")) {
        this.#lineClickEls.addClass("choosen");
      }
    });

    this.#lineClickEls.on("mouseleave", () => {
      if (!$(this.#inClick).hasClass("click-el-hidden")) {
        this.#lineClickEls.removeClass("choosen");
      }
    });
    if (this.connectedConnections.length !== 0) {
      $(this.connectedConnections).each((i, conn) => {
        conn.update();
      });
    }
    this.#arrowLines = [];
  }

  // ### Add Edge to Free Space (requires JWT token)
  // POST {{base_url}}/v1/diagram/{{diagram_id}}/edge/add/to_free_space
  // Content-Type: application/json
  // Authorization: Bearer {{token}}

  // {
  //   "source_node_id": "4be70edf-4f70-44e5-abfa-20980f3b20b6",
  //   "source_connection_position": {
  //     "x": 0,
  //     "y": -1
  //   },
  //   "position": {
  //     "x": 250,
  //     "y": 300
  //   },
  //   "edge": {
  //     "color": "#00ff00",
  //     "arrowTypeSource": "None",
  //     "arrowTypeTarget": "Arrow",
  //     "lineStyle": "Dashed",
  //     "textStart": "Start",
  //     "textCenter": "Free Space",
  //     "textEnd": "End"
  //   }
  // }

  // toJSONConnectionWithNewFreeSocket() {
  //   const toJSONConnection = this.toJSON();
  //   toJSONConnection.position
  // }

  // toJSONConnectionWithExistingFreeSocket() {}

  toJSON() {
    let toJSONConnection = {
      edge: {
        color: this.color,
        arrowTypeSource: this.arrowTypeStart,
        arrowTypeTarget: this.arrowTypeEnd,
        lineStyle: this.isDashed ? "dashed" : "solid",
        textStart: this.spanIn.textContent,
        textCenter: this.spanCenter.textContent,
        textEnd: this.spanOut.textContent,
      },
    };
    if (this.outPoint !== null) {
      toJSONConnection = this.#toJSONAddSource(toJSONConnection, this.inSock);
      toJSONConnection.TargetId = this.outPoint.connectionParent.id;
      toJSONConnection.position = {
        x: this.outPoint.x,
        y: this.outPoint.y,
      };
    } else if (this.inSock instanceof FreeSocket) {
      toJSONConnection.target_free_socket_id = this.inSock.id;
      toJSONConnection = this.#toJSONAddSource(toJSONConnection, this.outSock);
    } else if (this.outSock instanceof FreeSocket) {
      toJSONConnection.target_free_socket_id = this.outSock.id;
      toJSONConnection = this.#toJSONAddSource(toJSONConnection, this.inSock);
    } else {
      toJSONConnection = this.#toJSONAddSource(toJSONConnection, this.inSock);
      toJSONConnection = this.#toJSONAddTarget(toJSONConnection, this.outSock);
      toJSONConnection.source_free_socket_id = null;
    }
    return toJSONConnection;
  }

  #toJSONAddSource(toJSONConnection, socket) {
    const sockPosition = socket.getAbsolutePosition();
    toJSONConnection.source_node_id = socket.parent.id;
    toJSONConnection.source_connection_position = {
      x: sockPosition.x,
      y: sockPosition.y,
    };
    return toJSONConnection;
  }

  #toJSONAddTarget(toJSONConnection, socket) {
    toJSONConnection.target_node_id = socket.parent.id;
    const sockPosition = socket.getAbsolutePosition();
    toJSONConnection.target_connection_position = {
      x: sockPosition.x,
      y: sockPosition.y,
    };
    return toJSONConnection;
  }

  // AddEdgeToNode: "AddEdgeToNode",
  // AddEdgeToEdge: "AddEdgeToEdge",
  // AddEdgeToSocket: "AddEdgeToSocket",
  // AddEdgeToFreeSpace: "AddEdgeToFreeSpace"

  static fromJSONofAnotherUser(json, operationType) {
    switch (operationType) {
      case OperationType.AddEdgeToSocket:
        Connection.fromJSONNodeToFreeSocket(json);
        break;
      case OperationType.AddEdgeToNode:
        Connection.fromJSONNodeToNode(json);
        break;
      case OperationType.AddEdgeToEdge:
        Connection.fromJSONNodeToEdge(json);
        break;
    }
  }

  static fromJSONNodeToFreeSocket(json) {
    const sourceNode = View.getInstance().getNodeById(
      json.SourceEnd.ConnectedElementId
    );
    const sourceSocket = sourceNode.getSocketByPosition(
      json.SourceEnd.x,
      json.SourceEnd.y
    );
    const targetSocket = View.getInstance().getFreeSocketById(
      json.TargetEnd.ConnectedElementId
    );
    const connection = Connection.fromJSON(json, sourceSocket, targetSocket);

    targetSocket.addConnection(connection);
  }

  static fromJSONNodeToNode(json) {
    const sourceNode = View.getInstance().getNodeById(
      json.SourceEnd.ConnectedElementId
    );
    const targetNode = View.getInstance().getNodeById(
      json.TargetEnd.ConnectedElementId
    );
    const sourceSocket = sourceNode.getSocketByPosition(
      json.SourceEnd.x,
      json.SourceEnd.y
    );
    const targetSocket = targetNode.getSocketByPosition(
      json.TargetEnd.x,
      json.TargetEnd.y
    );

    const connection = Connection.fromJSON(json, sourceSocket, targetSocket);

    targetSocket.addConnection(connection);
  }

  static fromJSONNodeToEdge(json) {
    let sourceNode, targetConnection, targetPoint, sourceSocket;
    sourceNode = View.getInstance().getNodeById(
      json.SourceEnd.ConnectedElementId
    );
    if (sourceNode !== null) {
      targetConnection = View.getInstance().getConnectionById(
        json.TargetEnd.ConnectedElementId
      );
      sourceSocket = sourceNode.getSocketByPosition(
        json.SourceEnd.x,
        json.SourceEnd.y
      );
      targetPoint = new ConnectingPoint(
        json.TargetEnd.x,
        json.TargetEnd.y,
        targetConnection
      );
    } else {
      sourceNode = View.getInstance().getNodeById(
        json.TargetEnd.ConnectedElementId
      );
      targetConnection = View.getInstance().getConnectionById(
        json.SourceEnd.ConnectedElementId
      );
      sourceSocket = sourceNode.getSocketByPosition(
        json.TargetEnd.x,
        json.TargetEnd.y
      );
      targetPoint = new ConnectingPoint(
        json.SourceEnd.x,
        json.SourceEnd.y,
        targetConnection
      );
    }

    const connection = Connection.fromJSON(
      json,
      sourceSocket,
      null,
      targetPoint
    );
    //sourceSocket.connecrions.push(connection)
    targetConnection.connectedConnections.push(connection);
  }

  static fromJSON(json, sourceSocket, targetSocket = null, targetPoint = null) {
    const connection = new Connection(
      sourceSocket,
      targetSocket,
      targetPoint,
      json.SourceEnd.ArrowType,
      json.TargetEnd.ArrowType,
      json.LineStyle === "dashed",
      json.Text,
      json.TargetEnd.Text,
      json.SourceEnd.Text,
      json.Id,
      json.Color
    );

    sourceSocket.addConnection(connection);
    View.getInstance().addConnection(connection);
    return connection;
  }
}
