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
    arrowTypeEnd = ArrowType.DefaultEnd,
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
    this.arrowLines = `<line x1="0" y1="0" x2="0" y2="0" stroke-width="2" marker-end="" marker-start="" stroke-dasharray=""/>`;
    this.arrowIndent = 15;
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
    this.creatingPath();
    this.el = $(
      `<svg class="node-connection">
        <defs>
        <marker id="" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">` +
        this.arrowTypeStart +
        `</marker>
        <marker id="" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">` +
        this.arrowTypeEnd +
        `</marker>
      </defs>`
      + this.arrowLines +
        `</svg>`
        // <line x1="0" y1="0" x2="0" y2="0" stroke-width="2" marker-end="" marker-start="" stroke-dasharray=""/>
        // <line x1="0" y1="0" x2="0" y2="0" stroke-width="20" class="arrow"/>
    ).appendTo("#view-area")[0];
    $(this.el).attr("id", this.id);
    // this.lineEl = $(this.el).find("line")[0];
    // this.lineClickEl = $(this.el).find("line")[1];
    // this.markerELStart = $(this.el).find("marker")[0];
    // $(this.markerELStart).attr("id", `arrowhead-${this.id}-start`);
    // this.markerELEnd = $(this.el).find("marker")[1];
    // $(this.markerELEnd).attr("id", `arrowhead-${this.id}-end`);
    // $(this.lineEl).attr("marker-end", `url(#arrowhead-${this.id}-end)`);
    // $(this.lineEl).attr("marker-start", `url(#arrowhead-${this.id}-start)`);
    // this.lineClickEl.addEventListener("click", (e) => {
    //   e.stopPropagation();
    //   const r = View.singleton.el.getBoundingClientRect();
    //   if (document.getElementById("menu")) {
    //     var events = $._data(document.getElementById("menu"), "events");
    //     if (events) {
    //       $.each(events, function (evName, e) {
    //         if (evName == "blur") {
    //           $("#menu").off("blur");
    //           return false;
    //         }
    //       });
    //     }
    //   }
    //   ArrowsMenu.singleton.appearing(
    //     this,
    //     e.clientX - r.left,
    //     e.clientY - r.top
    //   );
    // });
    console.log(this.el);
    this.changeColor(this.color);
    //this.update();
  }
  creatingPath(){
    const inSockPos = this.inSock.getAbsolutePosition();
    const outSockPos = this.outSock.getAbsolutePosition();
    const inSockParent = this.inSock.parent;
    const outSockParent = this.outSock.parent;

    if(this.inSock.isUp()){
      if(this.outSock.isUp()){
        this.definitionInUpOutUp(inSockPos, outSockPos, inSockParent, outSockParent);
      } else if (this.outSock.isRight()) {
        this.definitionInUpOutRight(inSockPos, outSockPos, inSockParent, outSockParent);
      }
    }
  }
  definitionInUpOutUp(inSockPos, outSockPos, inSockParent, outSockParent){
    if (this.inSock.getAbsolutePosition()[0] < (this.outSock.parent.pos[0] + this.arrowIndent) || this.inSock.getAbsolutePosition()[0] >= (this.outSock.parent.getAcrossXPosition() + this.arrowIndent)){
      console.log("upup, out of node")
      if (this.inSock.getAbsolutePosition()[1] > this.outSock.getAbsolutePosition()[1]) {
        //outSock + arrowIndent
        this.arrowLines = 
        `<line x1="` + inSockPos[0] + `" y1="` + inSockPos[1] + `" x2="` + inSockPos[0] + `" y2="` + (outSockPos[1] - this.arrowIndent) + `" stroke-width="2" marker-start="" stroke-dasharray=""/>
        <line x1="` + inSockPos[0] + `" y1="` + (outSockPos[1] - this.arrowIndent) + `" x2="` + outSockPos[0] +`" y2="` + (outSockPos[1] - this.arrowIndent) + `" stroke-width="2" stroke-dasharray=""/>
        <line x1="` + outSockPos[0]  + `" y1="` + (outSockPos[1] - this.arrowIndent) + `" x2="` + outSockPos[0] +`" y2="` + outSockPos[1] + `" stroke-width="2" marker-end="" stroke-dasharray=""/>`
      } else {
        //inSock + arrowIndent
        this.arrowLines = 
        `<line x1="` + inSockPos[0] + `" y1="` + inSockPos[1] + `" x2="` + inSockPos[0] + `" y2="` + (inSockPos[1] - this.arrowIndent) + `" stroke-width="2" marker-start="" stroke-dasharray=""/>
        <line x1="` + inSockPos[0] + `" y1="` + (inSockPos[1] - this.arrowIndent) + `" x2="` + outSockPos[0] +`" y2="` + (inSockPos[1] - this.arrowIndent) + `" stroke-width="2" stroke-dasharray=""/>
        <line x1="` + outSockPos[0]  + `" y1="` + (inSockPos[1] - this.arrowIndent) + `" x2="` + outSockPos[0] +`" y2="` + outSockPos[1] + `" stroke-width="2" marker-end="" stroke-dasharray=""/>`
      }
    } else {
      console.log("upup, in node")
      const halfGapY = Math.abs(inSockPos[1] - outSockParent.getAcrossYPosition()) / 2;
      this.arrowLines = 
        `<line x1="` + inSockPos[0] + `" y1="` + inSockPos[1] + `" x2="` + inSockPos[0] + `" y2="` + (inSockPos[1] - halfGapY) + `" stroke-width="2" marker-start="" stroke-dasharray=""/>
        <line x1="` + inSockPos[0] + `" y1="` + (inSockPos[1] - halfGapY) + `" x2="`
        if(inSockParent.pos[0] < outSockParent.pos[0]) {
          this.arrowLines += (outSockParent.pos[0] - this.arrowIndent) +`" y2="` + (inSockPos[1] - halfGapY) + `" stroke-width="2" stroke-dasharray=""/>
          <line x1="` + (outSockParent.pos[0] - this.arrowIndent) + `" y1="` + (inSockPos[1] - halfGapY) + `" x2="` + (outSockParent.pos[0] - this.arrowIndent) +`" y2="` + (outSockPos[1] - this.arrowIndent) + `" stroke-width="2" stroke-dasharray=""/>
          <line x1="` + (outSockParent.pos[0] - this.arrowIndent) + `" y1="` + (outSockPos[1] - this.arrowIndent);
        } else {
          this.arrowLines += (outSockParent.getAcrossXPosition() + this.arrowIndent) +`" y2="` + (inSockPos[1] - halfGapY) + `" stroke-width="2" stroke-dasharray=""/>
          <line x1="` + (outSockParent.getAcrossXPosition() + this.arrowIndent) + `" y1="` + (inSockPos[1] - halfGapY) + `" x2="` + (outSockParent.getAcrossXPosition() + this.arrowIndent) +`" y2="` + (outSockPos[1] - this.arrowIndent) + `" stroke-width="2" stroke-dasharray=""/>
          <line x1="` + (outSockParent.getAcrossXPosition() + this.arrowIndent) + `" y1="` + (outSockPos[1] - this.arrowIndent);
        }
        this.arrowLines += `" x2="` + outSockPos[0] +`" y2="` + (outSockPos[1] - this.arrowIndent) + `" stroke-width="2" stroke-dasharray=""/>
        <line x1="` + outSockPos[0]  + `" y1="` + (outSockPos[1] - this.arrowIndent) + `" x2="` + outSockPos[0] +`" y2="` + outSockPos[1] + `" stroke-width="2" marker-end="" stroke-dasharray=""/>`
    }
  }
  definitionInUpOutRight(inSockPos, outSockPos, inSockParent, outSockParent){ 
    //Make right near node
    if((inSockPos[1] + this.arrowIndent) > outSockPos[1]) {
      //Higher
       if(inSockPos[0] > outSockPos[0]) {
        //Left
      this.oneAngleArrow(inSockPos, outSockPos);
    } else {
      //Right
      const halfGapY = Math.abs(inSockPos[1] - outSockParent.getAcrossYPosition()) / 2;
      this.arrowLines = 
        `<line x1="` + inSockPos[0] + `" y1="` + inSockPos[1] + `" x2="` + inSockPos[0] + `" y2="` + (inSockPos[1] - halfGapY) + `" stroke-width="2" marker-start="" stroke-dasharray=""/>
        <line x1="` + inSockPos[0] + `" y1="` + (inSockPos[1] - halfGapY) + `" x2="` + (outSockPos[0] + this.arrowIndent) +`" y2="` + (inSockPos[1] - halfGapY) + `" stroke-width="2" stroke-dasharray=""/>
        <line x1="` + (outSockPos[0] + this.arrowIndent) + `" y1="` + (inSockPos[1] - halfGapY) + `" x2="` + (outSockPos[0] + this.arrowIndent) +`" y2="` + outSockPos[1] + `" stroke-width="2" stroke-dasharray=""/>
        <line x1="` + (outSockPos[0] + this.arrowIndent)  + `" y1="` + outSockPos[1] + `" x2="` + outSockPos[0] +`" y2="` + outSockPos[1] + `" stroke-width="2" marker-end="" stroke-dasharray=""/>` 
    }
    } else {
      //Lower
      if(inSockPos[0] > outSockPos[0]) {
        this.arrowLines = `<line x1="` + inSockPos[0] + `" y1="` + inSockPos[1] + `" x2="` + inSockPos[0] + `" y2="` + (inSockPos[1] - this.arrowIndent) + `" stroke-width="2" marker-start="" stroke-dasharray=""/>
        <line x1="` + inSockPos[0] + `" y1="` + (inSockPos[1] - this.arrowIndent) + `" x2="`;
        //Left
        if(outSockPos[0] + this.arrowIndent > inSockParent.pos[0] - this.arrowIndent) {
        //Under node
        const halfGapY = Math.abs(inSockParent.getAcrossYPosition() - outSockParent.pos[1]) / 2;
          this.arrowLines += (inSockParent.pos[0] - this.arrowIndent) + `" y2="` + (inSockPos[1] - this.arrowIndent) + `" stroke-width="2" stroke-dasharray=""/>
          <line x1="` + (inSockParent.pos[0] - this.arrowIndent) + `" y1="` + (inSockPos[1] - this.arrowIndent) + `" x2="` + (inSockParent.pos[0] - this.arrowIndent) +`" y2="` + (inSockParent.getAcrossYPosition() + halfGapY) + `" stroke-width="2" stroke-dasharray=""/>
          <line x1="` + (inSockParent.pos[0] - this.arrowIndent) + `" y1="` + (inSockParent.getAcrossYPosition() + halfGapY) + `" x2="` + (outSockPos[0] + this.arrowIndent) +`" y2="` + (inSockParent.getAcrossYPosition() + halfGapY) + `" stroke-width="2" stroke-dasharray=""/>
          <line x1="` + (outSockPos[0] + this.arrowIndent) + `" y1="` + (inSockParent.getAcrossYPosition() + halfGapY) + `" x2="` + (outSockPos[0] + this.arrowIndent) +`" y2="` + outSockPos[1] + `" stroke-width="2" stroke-dasharray=""/>
          <line x1="` + (outSockPos[0] + this.arrowIndent); 
        } else {
          //Out of node
          const halfGapX = Math.abs(inSockParent.pos[0] - outSockPos[0]) / 2;
        this.arrowLines += (inSockParent.pos[0] - halfGapX) + `" y2="` + (inSockPos[1] - this.arrowIndent) + `" stroke-width="2" stroke-dasharray=""/>
          <line x1="` + (inSockParent.pos[0] - halfGapX) + `" y1="` + (inSockPos[1] - this.arrowIndent) + `" x2="` + (inSockParent.pos[0] - halfGapX) +`" y2="` + outSockPos[1] + `" stroke-width="2" stroke-dasharray=""/>
          <line x1="` + (inSockParent.pos[0] - halfGapX); 
        }
        } else {
        //Right
        //Make under node
        if ((outSockParent.pos[1] - this.arrowIndent) > inSockPos[1]){
          this.arrowLines = `<line x1="` + inSockPos[0] + `" y1="` + inSockPos[1] + `" x2="` + inSockPos[0] + `" y2="` + (inSockPos[1] - this.arrowIndent) + `" stroke-width="2" marker-start="" stroke-dasharray=""/>
          <line x1="` + inSockPos[0] + `" y1="` + (inSockPos[1] - this.arrowIndent) + `" x2="`;
          if(outSockPos[0] < inSockParent.getAcrossXPosition() - this.arrowIndent ) {
            //Under node
            this.arrowLines += (inSockParent.getAcrossXPosition() + this.arrowIndent) + `" y2="` + (inSockPos[1] - this.arrowIndent) + `" stroke-width="2" marker-start="" stroke-dasharray=""/>
            <line x1="` + (inSockParent.getAcrossXPosition() + this.arrowIndent) + `" y1="` + (inSockPos[1] - this.arrowIndent) + `" x2="` + (inSockParent.getAcrossXPosition() + this.arrowIndent) + `" y2="` + outSockPos[1] + `" stroke-width="2" stroke-dasharray=""/>
            <line x1="` + (inSockParent.getAcrossXPosition() + this.arrowIndent);
          } else {
            console.log("out");
            //Out of node
            this.arrowLines += (outSockPos[0] + this.arrowIndent) + `" y2="` + (inSockPos[1] - this.arrowIndent) + `" stroke-width="2" marker-start="" stroke-dasharray=""/>
            <line x1="` + (outSockPos[0] + this.arrowIndent) + `" y1="` + (inSockPos[1] - this.arrowIndent) + `" x2="` + (outSockPos[0] + this.arrowIndent) + `" y2="` + outSockPos[1] + `" stroke-width="2" stroke-dasharray=""/>
            <line x1="` + (outSockPos[0] + this.arrowIndent);
          }
        } else {

        }
      }
      this.arrowLines += `" y1="` + outSockPos[1] + `" x2="` + outSockPos[0] +`" y2="` + outSockPos[1] + `" stroke-width="2" marker-end="" stroke-dasharray=""/>`;
    }
   
  }
  oneAngleArrow(inSockPos, outSockPos) {
    this.arrowLines = 
        `<line x1="` + inSockPos[0] + `" y1="` + inSockPos[1] + `" x2="` + inSockPos[0] + `" y2="` + outSockPos[1] + `" stroke-width="2" marker-start="" stroke-dasharray=""/>
        <line x1="` + inSockPos[0]  + `" y1="` + outSockPos[1] + `" x2="` + outSockPos[0] +`" y2="` + outSockPos[1] + `" stroke-width="2" marker-end="" stroke-dasharray=""/>`
  }
  definitionUpRight(){
    
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
    $(this.el).find("line").css('stroke', this.color);
    //$('h1, h2, h3, h4, .contentheading, .title').css('color', 'red');
    this.update();
  }
  update() {
    this.spanIn.style.left = this.inSock.getAbsolutePosition()[0] + "px";
    this.spanIn.style.top = this.inSock.getAbsolutePosition()[1] + "px";
    this.spanOut.style.left = this.outSock.getAbsolutePosition()[0] + "px";
    this.spanOut.style.top = this.outSock.getAbsolutePosition()[1] + "px";
    // this.spanCenter.style.left =
    //   (this.inSock.getAbsolutePosition()[0] +
    //     this.outSock.getAbsolutePosition()[0]) /
    //     2 +
    //   "px";
    // this.spanCenter.style.top =
    //   (this.inSock.getAbsolutePosition()[1] +
    //     this.outSock.getAbsolutePosition()[1]) /
    //     2 +
    //   "px";
    // const inSockPos = this.inSock.getAbsolutePosition();
    // const outSockPos = this.outSock.getAbsolutePosition();
    // $(this.lineEl).attr("x1", `${inSockPos[0]}`);
    // $(this.lineEl).attr("y1", `${inSockPos[1]}`);
    // $(this.lineEl).attr("x2", `${outSockPos[0]}`);
    // $(this.lineEl).attr("y2", `${outSockPos[1]}`);
    // $(this.lineClickEl).attr("x1", `${inSockPos[0]}`);
    // $(this.lineClickEl).attr("y1", `${inSockPos[1]}`);
    // $(this.lineClickEl).attr("x2", `${outSockPos[0]}`);
    // $(this.lineClickEl).attr("y2", `${outSockPos[1]}`);
    // if (this.arrowTypeEnd != this.parrowTypeEnd) {
    //   $(this.el).find("marker")[1].innerHTML = this.arrowTypeEnd;
    //   this.parrowTypeEnd = this.arrowTypeEnd;
    // }
    // if (this.arrowTypeStart != this.parrowTypeStart) {
    //   $(this.el).find("marker")[0].innerHTML = this.arrowTypeStart;
    //   this.parrowTypeStart = this.arrowTypeStart;
    // }
    // if (this.arrowTypeEnd == ArrowType.DefaultEnd) {
    //   $(this.markerELEnd).attr("refX", `10`);
    // } else {
    //   $(this.markerELEnd).attr("refX", `0`);
    // }
    // if (this.arrowTypeStart != ArrowType.DefaultStart) {
    //   $(this.markerELStart).attr("refX", `10`);
    // } else {
    //   $(this.markerELStart).attr("refX", `0`);
    // }
    // this.changeColorArrowHead();
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
