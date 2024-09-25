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
  creatingPath() {
    const inSockPos = this.inSock.getAbsolutePosition();
    const outSockPos = this.outSock.getAbsolutePosition();
    const inSockParent = this.inSock.parent;
    const outSockParent = this.outSock.parent;

    if(this.inSock.isUp()) {
      if(this.outSock.isUp()){
        this.definitionUpUp(inSockPos, outSockPos, inSockParent, outSockParent);
      } else if (this.outSock.isRight()) {
        this.definitionUpRight(inSockPos, outSockPos, inSockParent, outSockParent);
      } else if (this.outSock.isLeft()) {
        this.definitionUpLeft(inSockPos, outSockPos, inSockParent, outSockParent);
      } else if (this.outSock.isDown()) {
        this.definitionUpDown(inSockPos, outSockPos, inSockParent, outSockParent);
      }
    } else if (this.inSock.isRight()) {
      if(this.outSock.isUp()){
        this.definitionUpRight(outSockPos, inSockPos, outSockParent, inSockParent);
      } else if (this.outSock.isRight()) {
        this.definitionRightRight(outSockPos, inSockPos, outSockParent, inSockParent);
      } else if (this.outSock.isLeft()) {
        this.definitionRightLeft(inSockPos, outSockPos, inSockParent, outSockParent);
      } else if (this.outSock.isDown()) {
        this.definitionDownRight(outSockPos, inSockPos, outSockParent, inSockParent)
      }
    } else if (this.inSock.isLeft()) {
      if(this.outSock.isUp()){
        this.definitionUpLeft(outSockPos, inSockPos, outSockParent, inSockParent);
      } else if (this.outSock.isRight()) {
        this.definitionRightLeft(outSockPos, inSockPos, outSockParent, inSockParent);
      } else if (this.outSock.isLeft()) {
        
      } else if (this.outSock.isDown()) {
        
      }
    } else if (this.inSock.isDown()) {
      if(this.outSock.isUp()){
        this.definitionUpDown(outSockPos, inSockPos, outSockParent, inSockParent);
      } else if (this.outSock.isRight()) {
        this.definitionDownRight(inSockPos, outSockPos, inSockParent, outSockParent)
      } else if (this.outSock.isLeft()) {
        
      } else if (this.outSock.isDown()) {
        
      }
    }
  }
  definitionUpUp(sock1Pos, sock2Pos, sock1Parent, sock2Parent) {
    if ((sock2Parent.getAcrossXPosition() + this.arrowIndent) < sock1Pos[0] || ((sock2Parent.pos[0] - this.arrowIndent) > sock1Pos[0])){
      //out of node
      this.arrowLines = 
        `<line x1="` + sock1Pos[0] + `" y1="` + sock1Pos[1] + `" x2="` + sock1Pos[0] + `" y2="`;
      if (sock1Pos[1] > sock2Pos[1]) {
        //outSock + arrowIndent
        this.arrowLines += (sock2Pos[1] - this.arrowIndent) + `" stroke-width="2" marker-start="" stroke-dasharray=""/>
        <line x1="` + sock1Pos[0] + `" y1="` + (sock2Pos[1] - this.arrowIndent) + `" x2="` + sock2Pos[0] +`" y2="` + (sock2Pos[1] - this.arrowIndent) + `" stroke-width="2" stroke-dasharray=""/>
        <line x1="` + sock2Pos[0]  + `" y1="` + (sock2Pos[1] - this.arrowIndent);
      } else {
        //inSock + arrowIndent
        this.arrowLines += (sock1Pos[1] - this.arrowIndent) + `" stroke-width="2" marker-start="" stroke-dasharray=""/>
        <line x1="` + sock1Pos[0] + `" y1="` + (sock1Pos[1] - this.arrowIndent) + `" x2="` + sock2Pos[0] +`" y2="` + (sock1Pos[1] - this.arrowIndent) + `" stroke-width="2" stroke-dasharray=""/>
        <line x1="` + sock2Pos[0]  + `" y1="` + (sock1Pos[1] - this.arrowIndent);
      }
      this.arrowLines += `" x2="` + sock2Pos[0] +`" y2="` + sock2Pos[1] + `" stroke-width="2" marker-end="" stroke-dasharray=""/>`;
    } else {
      //in node
      if (sock2Pos[1] > sock1Pos[1]) {
        this.envelopeArrowUpUp(sock1Pos, sock2Pos, sock1Parent);
      } else {
        this.envelopeArrowUpUp(sock2Pos, sock1Pos, sock2Parent);
      }
    }
  }
  envelopeArrowUpUp(sock1Pos, sock2Pos, sock1Parent) {
      const halfGapY = Math.abs(sock2Pos[1] - sock1Parent.getAcrossYPosition()) / 2;
      this.arrowLines = 
        `<line x1="` + sock1Pos[0] + `" y1="` + sock1Pos[1] + `" x2="` + sock1Pos[0] + `" y2="` + (sock1Pos[1] - this.arrowIndent) + `" stroke-width="2" marker-start="" stroke-dasharray=""/>
        <line x1="` + sock1Pos[0] + `" y1="` + (sock1Pos[1] - this.arrowIndent) + `" x2="`
        if(sock1Parent.pos[0] + ((sock1Parent.getAcrossXPosition() - sock1Parent.pos[0]) / 2) > sock2Pos[0]) {
          this.arrowLines += (sock1Parent.pos[0] - this.arrowIndent) +`" y2="` + (sock1Pos[1] - this.arrowIndent) + `" stroke-width="2" stroke-dasharray=""/>
          <line x1="` + (sock1Parent.pos[0] - this.arrowIndent) + `" y1="` + (sock1Pos[1] - this.arrowIndent) + `" x2="` + (sock1Parent.pos[0] - this.arrowIndent) +`" y2="` + (sock1Parent.getAcrossYPosition() + halfGapY) + `" stroke-width="2" stroke-dasharray=""/>
          <line x1="` + (sock1Parent.pos[0] - this.arrowIndent) + `" y1="` + (sock1Parent.getAcrossYPosition() + halfGapY);
        } else {
          this.arrowLines += (sock1Parent.getAcrossXPosition() + this.arrowIndent) +`" y2="` + (sock1Pos[1] - this.arrowIndent) + `" stroke-width="2" stroke-dasharray=""/>
          <line x1="` + (sock1Parent.getAcrossXPosition() + this.arrowIndent) + `" y1="` + (sock1Pos[1] - this.arrowIndent) + `" x2="` + (sock1Parent.getAcrossXPosition() + this.arrowIndent) +`" y2="` + (sock1Parent.getAcrossYPosition() + halfGapY) + `" stroke-width="2" stroke-dasharray=""/>
          <line x1="` + (sock1Parent.getAcrossXPosition() + this.arrowIndent) + `" y1="` + (sock1Parent.getAcrossYPosition() + halfGapY);
        }
        this.arrowLines += `" x2="` + sock2Pos[0] +`" y2="` + (sock1Parent.getAcrossYPosition() + halfGapY) + `" stroke-width="2" stroke-dasharray=""/>
        <line x1="` + sock2Pos[0]  + `" y1="` + (sock1Parent.getAcrossYPosition() + halfGapY) + `" x2="` + sock2Pos[0] +`" y2="` + sock2Pos[1] + `" stroke-width="2" marker-end="" stroke-dasharray=""/>`
  }
  definitionUpRight(sock1Pos, sock2Pos, sock1Parent, sock2Parent) { 
    if((sock1Pos[1] + this.arrowIndent) > sock2Pos[1]) {
      //Higher
    if(sock1Parent.pos[0] + ((sock1Parent.getAcrossXPosition() - sock1Parent.pos[0]) / 2) > sock2Pos[0]) {
      //Left
      this.oneAngleArrowY(sock1Pos, sock2Pos);
    } else {
      //Right
      const halfGapX = Math.abs(sock1Parent.getAcrossXPosition() - sock2Parent.pos[0]) / 2;
      const halfGapY = Math.abs(sock1Pos[1] - sock2Parent.getAcrossYPosition()) / 2;
      this.envelopeArrowUpDownToRightLeft(sock1Pos, sock2Pos, ((sock2Parent.getAcrossYPosition() + this.arrowIndent) < sock1Pos[1]), 
      (sock2Parent.getAcrossYPosition() + this.arrowIndent), -1, 1, (sock1Parent.getAcrossXPosition() + halfGapX), (sock1Pos[1] - halfGapY))
    } 
    } else {
      //Lower
      if(sock1Parent.pos[0] + ((sock1Parent.getAcrossXPosition() - sock1Parent.pos[0]) / 2) > sock2Pos[0]) {
        //Left
        const halfGapX = Math.abs(sock1Parent.pos[0] - sock2Pos[0]) / 2;
        const halfGapY = Math.abs(sock1Parent.getAcrossYPosition() - sock2Parent.pos[1]) / 2;
        this.inBetweenArrowUpDownToRightLeft(sock1Pos, sock2Pos, (sock2Pos[0] + this.arrowIndent > sock1Parent.pos[0] - this.arrowIndent), 
        (sock1Parent.pos[0] - this.arrowIndent), 1, -1, (sock1Parent.pos[0] - halfGapX), (sock1Parent.getAcrossYPosition() + halfGapY))
      } else {
        //Right
          this.envelopeArrowDownUpToRightLeft(sock1Pos, sock2Pos, sock1Parent, sock2Parent, (sock2Pos[0] < sock1Parent.getAcrossXPosition() - this.arrowIndent), 
          (sock1Parent.getAcrossXPosition() + this.arrowIndent), 1);
      }
  }
}
  definitionUpLeft(sock1Pos, sock2Pos, sock1Parent, sock2Parent) { 
    if((sock1Pos[1] + this.arrowIndent) > sock2Pos[1]) {
      //Higher
    if(sock1Parent.pos[0] + ((sock1Parent.getAcrossXPosition() - sock1Parent.pos[0]) / 2) > sock2Pos[0]) {
      //Left
      const halfGapX = Math.abs(sock2Parent.getAcrossXPosition() - sock1Parent.pos[0]) / 2;
      const halfGapY = Math.abs(sock1Pos[1] - sock2Parent.getAcrossYPosition()) / 2;
      this.envelopeArrowUpDownToRightLeft(sock1Pos, sock2Pos, ((sock2Parent.getAcrossYPosition() + this.arrowIndent) < sock1Pos[1]), 
      (sock2Parent.getAcrossYPosition() + this.arrowIndent), -1, -1, (sock1Parent.pos[0] - halfGapX), (sock1Pos[1] - halfGapY))
    } else {
      //Right
      this.oneAngleArrowY(sock1Pos, sock2Pos);}
    } else {
      //Lower
      if(sock1Parent.pos[0] + ((sock1Parent.getAcrossXPosition() - sock1Parent.pos[0]) / 2) > sock2Pos[0]) {
        //Left
        this.envelopeArrowDownUpToRightLeft(sock1Pos, sock2Pos, sock1Parent, sock2Parent, (sock2Pos[0] > sock1Parent.pos[0] - this.arrowIndent), 
        (sock1Parent.pos[0] - this.arrowIndent), -1);
        } else {
        //Right
        const halfGapX = Math.abs(sock2Pos[0] - sock1Parent.getAcrossXPosition()) / 2;
        const halfGapY = Math.abs(sock1Parent.getAcrossYPosition() - sock2Parent.pos[1]) / 2;
        this.inBetweenArrowUpDownToRightLeft(sock1Pos, sock2Pos, (sock2Pos[0] - this.arrowIndent < sock1Parent.getAcrossXPosition() + this.arrowIndent), 
        (sock1Parent.getAcrossXPosition() + this.arrowIndent), -1, -1, (sock1Parent.getAcrossXPosition() + halfGapX), (sock1Parent.getAcrossYPosition() + halfGapY))
      }
    }
   
  }
  oneAngleArrowY(inSockPos, outSockPos) {
    this.arrowLines = 
        `<line x1="` + inSockPos[0] + `" y1="` + inSockPos[1] + `" x2="` + inSockPos[0] + `" y2="` + outSockPos[1] + `" stroke-width="2" marker-start="" stroke-dasharray=""/>
        <line x1="` + inSockPos[0]  + `" y1="` + outSockPos[1] + `" x2="` + outSockPos[0] +`" y2="` + outSockPos[1] + `" stroke-width="2" marker-end="" stroke-dasharray=""/>`
  }
  envelopeArrowUpDownToRightLeft(sock1Pos, sock2Pos, isOutOfNode, sock2YIndent, indent1Sign, indent2Sign, inBetweenX, inBetweenY)  {
    if (isOutOfNode) {
      //out of node  
      this.arrowLines = 
      `<line x1="` + sock1Pos[0] + `" y1="` + sock1Pos[1] + `" x2="` + sock1Pos[0] + `" y2="` + inBetweenY + `" stroke-width="2" marker-start="" stroke-dasharray=""/>
      <line x1="` + sock1Pos[0] + `" y1="` + inBetweenY + `" x2="` + (sock2Pos[0] + (indent2Sign * this.arrowIndent)) +`" y2="` + inBetweenY + `" stroke-width="2" stroke-dasharray=""/>
      <line x1="` + (sock2Pos[0] + (indent2Sign * this.arrowIndent)) + `" y1="` + inBetweenY;
    } else {
      //behind
      this.arrowLines = 
      `<line x1="` + sock1Pos[0] + `" y1="` + sock1Pos[1] + `" x2="` + sock1Pos[0] + `" y2="` + (sock1Pos[1] + (indent1Sign * this.arrowIndent)) + `" stroke-width="2" marker-start="" stroke-dasharray=""/>
      <line x1="` + sock1Pos[0] + `" y1="` + (sock1Pos[1] + (indent1Sign * this.arrowIndent)) + `" x2="` + inBetweenX +`" y2="` + (sock1Pos[1] + (indent1Sign * this.arrowIndent)) + `" stroke-width="2" stroke-dasharray=""/>
      <line x1="` + inBetweenX + `" y1="` + (sock1Pos[1] + (indent1Sign * this.arrowIndent)) + `" x2="` + inBetweenX +`" y2="` + sock2YIndent + `" stroke-width="2" stroke-dasharray=""/>
      <line x1="` + inBetweenX + `" y1="` + sock2YIndent + `" x2="` + (sock2Pos[0] + (indent2Sign * this.arrowIndent)) +`" y2="` + sock2YIndent + `" stroke-width="2" stroke-dasharray=""/>
      <line x1="` + (sock2Pos[0] + (indent2Sign * this.arrowIndent)) + `" y1="` + sock2YIndent;
    } 
    this.arrowLines += `" x2="` + (sock2Pos[0] + (indent2Sign * this.arrowIndent)) +`" y2="` + sock2Pos[1] + `" stroke-width="2" stroke-dasharray=""/>
    <line x1="` + (sock2Pos[0] + (indent2Sign * this.arrowIndent))  + `" y1="` + sock2Pos[1] + `" x2="` + sock2Pos[0] +`" y2="` + sock2Pos[1] + `" stroke-width="2" marker-end="" stroke-dasharray=""/>`;
  }
  inBetweenArrowUpDownToRightLeft(sock1Pos, sock2Pos, isUnderNode, inNodeIndentX, outIndentSign, inIndentSign, xWithGap, yWithGap) {
    this.arrowLines = `<line x1="` + sock1Pos[0] + `" y1="` + sock1Pos[1] + `" x2="` + sock1Pos[0] + `" y2="` + (sock1Pos[1] + (inIndentSign * this.arrowIndent)) + `" stroke-width="2" marker-start="" stroke-dasharray=""/>
    <line x1="` + sock1Pos[0] + `" y1="` + (sock1Pos[1] + (inIndentSign * this.arrowIndent)) + `" x2="`;
    if(isUnderNode) {
    //Under node
      this.arrowLines += inNodeIndentX + `" y2="` + (sock1Pos[1] + (inIndentSign * this.arrowIndent)) + `" stroke-width="2" stroke-dasharray=""/>
      <line x1="` + inNodeIndentX + `" y1="` + (sock1Pos[1] + (inIndentSign * this.arrowIndent)) + `" x2="` + inNodeIndentX +`" y2="` + yWithGap + `" stroke-width="2" stroke-dasharray=""/>
      <line x1="` + inNodeIndentX + `" y1="` + yWithGap + `" x2="` + (sock2Pos[0] + (outIndentSign * this.arrowIndent)) +`" y2="` + yWithGap + `" stroke-width="2" stroke-dasharray=""/>
      <line x1="` + (sock2Pos[0] + (outIndentSign * this.arrowIndent)) + `" y1="` + yWithGap + `" x2="` + (sock2Pos[0] + (outIndentSign * this.arrowIndent)) +`" y2="` + sock2Pos[1] + `" stroke-width="2" stroke-dasharray=""/>
      <line x1="` + (sock2Pos[0] + (outIndentSign * this.arrowIndent)); 
    } else {
      //Out of node
      this.arrowLines += xWithGap + `" y2="` + (sock1Pos[1] + (inIndentSign * this.arrowIndent)) + `" stroke-width="2" stroke-dasharray=""/>
      <line x1="` + xWithGap + `" y1="` + (sock1Pos[1] + (inIndentSign * this.arrowIndent)) + `" x2="` + xWithGap +`" y2="` + sock2Pos[1] + `" stroke-width="2" stroke-dasharray=""/>
      <line x1="` + xWithGap; 
    }
    this.arrowLines += `" y1="` + sock2Pos[1] + `" x2="` + sock2Pos[0] +`" y2="` + sock2Pos[1] + `" stroke-width="2" marker-end="" stroke-dasharray=""/>`;
  } 
  envelopeArrowDownUpToRightLeft(sock1Pos, sock2Pos, sock1Parent, sock2Parent, isInNode, nodeParentIndentX, indentSign) {
    this.arrowLines = `<line x1="` + sock1Pos[0] + `" y1="` + sock1Pos[1] + `" x2="` + sock1Pos[0] + `" y2="`;
    if ((sock2Parent.pos[1] - this.arrowIndent) < (sock1Parent.pos[1] - this.arrowIndent)){        
      this.arrowLines += (sock2Parent.pos[1] - this.arrowIndent) + `" stroke-width="2" marker-start="" stroke-dasharray=""/>
      <line x1="` + sock1Pos[0] + `" y1="` + (sock2Parent.pos[1] - this.arrowIndent) + `" x2="`;
    } else {
      this.arrowLines += (sock1Pos[1] - this.arrowIndent) + `" stroke-width="2" marker-start="" stroke-dasharray=""/>
      <line x1="` + sock1Pos[0] + `" y1="` + (sock1Pos[1] - this.arrowIndent) + `" x2="`;
    }
    if(isInNode) {
      //Under node
      this.arrowLines += nodeParentIndentX + `" y2="` + (sock1Pos[1] - this.arrowIndent) + `" stroke-width="2" marker-start="" stroke-dasharray=""/>
      <line x1="` + nodeParentIndentX + `" y1="` + (sock1Pos[1] - this.arrowIndent) + `" x2="` + nodeParentIndentX + `" y2="` + sock2Pos[1] + `" stroke-width="2" stroke-dasharray=""/>
      <line x1="` + nodeParentIndentX;
    } else {
      //Out of node
      this.arrowLines += (sock2Pos[0] + (indentSign * this.arrowIndent)) + `" y2="`;
      if ((sock2Parent.pos[1] - this.arrowIndent) < (sock1Parent.pos[1] - this.arrowIndent)){
        this.arrowLines += (sock2Parent.pos[1] - this.arrowIndent) + `" stroke-width="2" marker-start="" stroke-dasharray=""/>
        <line x1="` + (sock2Pos[0] + (indentSign * this.arrowIndent)) + `" y1="` + (sock2Parent.pos[1] - this.arrowIndent);
      } else {
        this.arrowLines += (sock1Pos[1] - this.arrowIndent) + `" stroke-width="2" marker-start="" stroke-dasharray=""/>
        <line x1="` + (sock2Pos[0] + (indentSign * this.arrowIndent)) + `" y1="` + (sock1Pos[1] - this.arrowIndent);
      }
        this.arrowLines += `" x2="` + (sock2Pos[0] + (indentSign * this.arrowIndent)) + `" y2="` + sock2Pos[1] + `" stroke-width="2" stroke-dasharray=""/>
        <line x1="` + (sock2Pos[0] + (indentSign * this.arrowIndent));
    }
      this.arrowLines += `" y1="` + sock2Pos[1] + `" x2="` + sock2Pos[0] +`" y2="` + sock2Pos[1] + `" stroke-width="2" marker-end="" stroke-dasharray=""/>`;
  }
  definitionUpDown(inSockPos, outSockPos, inSockParent, outSockParent) {
    if((inSockPos[1] - this.arrowIndent) > (outSockPos[1] + this.arrowIndent)) {
      //Higher
      const halfGapY = Math.abs(outSockPos[1] - inSockPos[1]) / 2;
      this.arrowLines = 
      `<line x1="` + inSockPos[0] + `" y1="` + inSockPos[1] + `" x2="` + inSockPos[0] + `" y2="` + (inSockPos[1] - halfGapY) + `" stroke-width="2" marker-start="" stroke-dasharray=""/>
      <line x1="` + inSockPos[0] + `" y1="` + (inSockPos[1] - halfGapY) + `" x2="` + outSockPos[0] +`" y2="` + (inSockPos[1] - halfGapY) + `" stroke-width="2" stroke-dasharray=""/>
      <line x1="` + outSockPos[0] + `" y1="` + (inSockPos[1] - halfGapY) + `" x2="` + outSockPos[0] +`" y2="` + outSockPos[1] + `" stroke-width="2" marker-end="" stroke-dasharray=""/>`;
    } else {
      //Lower
      if(inSockParent.pos[0] + ((inSockParent.getAcrossXPosition() - inSockParent.pos[0]) / 2) > outSockPos[0]) {
        //Left
        const halfGapX = Math.abs((outSockParent.getAcrossXPosition() - inSockParent.pos[0])/2)
        this.inBetweenLowerArrowUpDown(inSockPos, outSockPos, inSockParent, outSockParent, (inSockParent.pos[0] - halfGapX), 
        (inSockParent.pos[0] - this.arrowIndent), (outSockParent.getAcrossXPosition() + this.arrowIndent));
      } else {
        //Right
        const halfGapX = Math.abs((outSockParent.pos[0] - inSockParent.getAcrossXPosition())/2)
        this.inBetweenLowerArrowUpDown(inSockPos, outSockPos, inSockParent, outSockParent, (inSockParent.getAcrossXPosition() + halfGapX), 
        (inSockParent.getAcrossXPosition() + this.arrowIndent), (outSockParent.pos[0] - this.arrowIndent));
      }
    }
  }
  inBetweenLowerArrowUpDown(inSockPos, outSockPos, inSockParent, outSockParent, inBetweenX, node1IndentX, node2IndentX) {
    this.arrowLines = 
    `<line x1="` + inSockPos[0] + `" y1="` + inSockPos[1] + `" x2="` + inSockPos[0] + `" y2="` + (inSockPos[1] - this.arrowIndent) + `" stroke-width="2" marker-start="" stroke-dasharray=""/>
    <line x1="` + inSockPos[0] + `" y1="` + (inSockPos[1] - this.arrowIndent) + `" x2="`;
    if((outSockParent.getAcrossXPosition() + this.arrowIndent) < (inSockParent.pos[0] - this.arrowIndent) || (outSockParent.pos[0] - this.arrowIndent) > (inSockParent.getAcrossXPosition() + this.arrowIndent)){
      this.arrowLines += inBetweenX +`" y2="` + (inSockPos[1] - this.arrowIndent) + `" stroke-width="2" stroke-dasharray=""/>
      <line x1="` + inBetweenX + `" y1="` + (inSockPos[1] - this.arrowIndent) + `" x2="` + inBetweenX +`" y2="` + (outSockPos[1] + this.arrowIndent) + `" stroke-width="2" stroke-dasharray=""/>
      <line x1="` + inBetweenX;
    } else {
      const halfGapY = Math.abs(outSockParent.pos[1] - inSockParent.getAcrossYPosition()) / 2;
      this.arrowLines += node1IndentX +`" y2="` + (inSockPos[1] - this.arrowIndent) + `" stroke-width="2" stroke-dasharray=""/>
      <line x1="` + node1IndentX + `" y1="` + (inSockPos[1] - this.arrowIndent) + `" x2="` + node1IndentX +`" y2="` + (inSockParent.getAcrossYPosition() + halfGapY) + `" stroke-width="2" stroke-dasharray=""/>
      <line x1="` + node1IndentX + `" y1="` + (inSockParent.getAcrossYPosition() + halfGapY) + `" x2="` + node2IndentX +`" y2="` + (inSockParent.getAcrossYPosition() + halfGapY) + `" stroke-width="2" stroke-dasharray=""/>
      <line x1="` + node2IndentX + `" y1="` + (inSockParent.getAcrossYPosition() + halfGapY) + `" x2="` + node2IndentX +`" y2="` + (outSockPos[1] + this.arrowIndent) + `" stroke-width="2" stroke-dasharray=""/>
      <line x1="` + node2IndentX;
    }
    this.arrowLines += `" y1="` + (outSockPos[1] + this.arrowIndent) + `" x2="` + outSockPos[0] +`" y2="` + (outSockPos[1] + this.arrowIndent) + `" stroke-width="2" stroke-dasharray=""/>
    <line x1="` + outSockPos[0]  + `" y1="` + (outSockPos[1] + this.arrowIndent) + `" x2="` + outSockPos[0] +`" y2="` + outSockPos[1] + `" stroke-width="2" marker-end="" stroke-dasharray=""/>`;
  }
  definitionRightRight(sock1Pos, sock2Pos, sock1Parent, sock2Parent) {
    if ((sock2Parent.getAcrossYPosition() + this.arrowIndent) < sock1Pos[1] || (sock2Parent.pos[1] - this.arrowIndent) > sock1Pos[1]) {
      //out of node
      this.arrowLines = `<line x1="` + sock1Pos[0] + `" y1="` + sock1Pos[1] + `" x2="`;
        if(sock1Pos[0] > sock2Pos[0]){
          //sock1 + arrowIndent
          this.arrowLines += (sock1Pos[0]  + this.arrowIndent) + `" y2="` + sock1Pos[1] + `" stroke-width="2" marker-start="" stroke-dasharray=""/>
          <line x1="` + (sock1Pos[0] + this.arrowIndent) + `" y1="` + sock1Pos[1] + `" x2="` + (sock1Pos[0] + this.arrowIndent) +`" y2="` + sock2Pos[1] + `" stroke-width="2" stroke-dasharray=""/>
          <line x1="` + (sock1Pos[0] + this.arrowIndent);
        } else {
          //sock2 + arrowIndent
          this.arrowLines += (sock2Pos[0]  + this.arrowIndent) + `" y2="` + sock1Pos[1] + `" stroke-width="2" marker-start="" stroke-dasharray=""/>
          <line x1="` + (sock2Pos[0] + this.arrowIndent) + `" y1="` + sock1Pos[1] + `" x2="` + (sock2Pos[0] + this.arrowIndent) +`" y2="` + sock2Pos[1] + `" stroke-width="2" stroke-dasharray=""/>
          <line x1="` + (sock2Pos[0] + this.arrowIndent);
        }
        this.arrowLines += `" y1="` + sock2Pos[1] + `" x2="` + sock2Pos[0] +`" y2="` + sock2Pos[1] + `" stroke-width="2" marker-end="" stroke-dasharray=""/>`;
    } else {
      //"in" node
      if(sock1Pos[0] > sock2Pos[0]){ 
        // Right
        if (this.isSockPosHigherHalfOfTheNode(sock2Pos, sock1Parent)) {
          //higher
          this.envelopeArrowRightRight(sock1Pos, sock2Pos, sock1Parent, (sock1Parent.pos[1] - this.arrowIndent));
        } else {
          //lower
          this.envelopeArrowRightRight(sock1Pos, sock2Pos, sock1Parent, (sock1Parent.getAcrossYPosition() + this.arrowIndent));
        }
      } else {
        // Left
        if (this.isSockPosHigherHalfOfTheNode(sock2Pos, sock1Parent)) {
          //higher
          this.envelopeArrowRightRight(sock2Pos, sock1Pos, sock2Parent, (sock2Parent.pos[1] - this.arrowIndent));
        } else {
          //lower
          this.envelopeArrowRightRight(sock2Pos, sock1Pos, sock2Parent, (sock2Parent.getAcrossYPosition() + this.arrowIndent));
        }
      }
    }
  }
  envelopeArrowRightRight(sock1Pos, sock2Pos, sock1Parent, sockIndentY) {
    const halfGapX = Math.abs(sock1Parent.pos[0] - sock2Pos[0]) / 2;
    this.arrowLines = `<line x1="` + sock1Pos[0] + `" y1="` + sock1Pos[1] + `" x2="` + (sock1Pos[0]  + this.arrowIndent) + `" y2="` + sock1Pos[1] + `" stroke-width="2" marker-start="" stroke-dasharray=""/>
    <line x1="` + (sock1Pos[0] + this.arrowIndent) + `" y1="` + sock1Pos[1] + `" x2="` + (sock1Pos[0] + this.arrowIndent) +`" y2="` + sockIndentY + `" stroke-width="2" stroke-dasharray=""/>
    <line x1="` + (sock1Pos[0] + this.arrowIndent) + `" y1="` + sockIndentY + `" x2="` + (sock1Parent.pos[0] - halfGapX) +`" y2="` + sockIndentY + `" stroke-width="2" marker-end="" stroke-dasharray=""/>
    <line x1="` + (sock1Parent.pos[0] - halfGapX) + `" y1="` + sockIndentY + `" x2="` + (sock1Parent.pos[0] - halfGapX) +`" y2="` + sock2Pos[1] + `" stroke-width="2" marker-end="" stroke-dasharray=""/>
    <line x1="` + (sock1Parent.pos[0] - halfGapX) + `" y1="` + sock2Pos[1] + `" x2="` + sock2Pos[0] +`" y2="` + sock2Pos[1] + `" stroke-width="2" marker-end="" stroke-dasharray=""/>`;
  }
  definitionRightLeft(sock1Pos, sock2Pos, sock1Parent, sock2Parent) {
    if((sock1Pos[0] + this.arrowIndent) > (sock2Pos[0] - this.arrowIndent)) {
      //lefter
      if((sock2Parent.getAcrossYPosition() + this.arrowIndent) < (sock1Parent.pos[1] - this.arrowIndent)){
        //higher, out of node
        const halfGapY = Math.abs(sock2Parent.getAcrossYPosition() - sock1Parent.pos[1]) / 2;
        this.twoSidedArrowRightLeft(sock1Pos, sock2Pos, (sock1Parent.pos[1] - halfGapY))
      } else {
        if (this.isSockPosHigherHalfOfTheNode(sock2Pos, sock1Parent)) {
          this.twoSidedEnvelopArrowRightLeft(sock1Pos, sock2Pos, sock1Parent, sock2Parent, (sock1Parent.pos[1] - this.arrowIndent), (sock2Parent.getAcrossYPosition() + this.arrowIndent));
        } else if ((sock1Parent.getAcrossYPosition() + this.arrowIndent) < (sock2Parent.pos[1] - this.arrowIndent)) {
          //lower, out of node
          const halfGapY = Math.abs(sock1Parent.getAcrossYPosition() - sock2Parent.pos[1]) / 2;
          this.twoSidedArrowRightLeft(sock1Pos, sock2Pos, (sock1Parent.getAcrossYPosition() + halfGapY))
        } else {
          this.twoSidedEnvelopArrowRightLeft(sock1Pos, sock2Pos, sock1Parent, sock2Parent, (sock1Parent.getAcrossYPosition() + this.arrowIndent), (sock2Parent.pos[1] - this.arrowIndent));
        }
      }
    } else {
      //righter
      this.inBetweenArrowRightLeft(sock1Pos, sock2Pos);
    }
  }
  inBetweenArrowRightLeft(sock1Pos, sock2Pos) {
    const halfGapX = Math.abs(sock2Pos[0] - sock1Pos[0]) / 2;
    this.arrowLines = `<line x1="` + sock1Pos[0] + `" y1="` + sock1Pos[1] + `" x2="` + (sock1Pos[0]  + halfGapX) + `" y2="` + sock1Pos[1] + `" stroke-width="2" marker-start="" stroke-dasharray=""/>
    <line x1="` + (sock1Pos[0]  + halfGapX) + `" y1="` + sock1Pos[1] + `" x2="` + (sock1Pos[0]  + halfGapX) +`" y2="` + sock2Pos[1] + `" stroke-width="2" stroke-dasharray=""/>
    <line x1="` + (sock1Pos[0]  + halfGapX) + `" y1="` + sock2Pos[1] + `" x2="` + sock2Pos[0] +`" y2="` + sock2Pos[1] + `" stroke-width="2" marker-end="" stroke-dasharray=""/>`;
  }
  twoSidedArrowRightLeft(sock1Pos, sock2Pos, gapY) {
    this.arrowLines = `<line x1="` + sock1Pos[0] + `" y1="` + sock1Pos[1] + `" x2="` + (sock1Pos[0]  + this.arrowIndent) + `" y2="` + sock1Pos[1] + `" stroke-width="2" marker-start="" stroke-dasharray=""/>
    <line x1="` + (sock1Pos[0]  + this.arrowIndent) + `" y1="` + sock1Pos[1] + `" x2="` + (sock1Pos[0]  + this.arrowIndent) +`" y2="` + gapY + `" stroke-width="2" stroke-dasharray=""/>
    <line x1="` + (sock1Pos[0]  + this.arrowIndent) + `" y1="` + gapY + `" x2="` + (sock2Pos[0] - this.arrowIndent) +`" y2="` + gapY + `" stroke-width="2" stroke-dasharray=""/>
    <line x1="` + (sock2Pos[0] - this.arrowIndent) + `" y1="` + gapY + `" x2="` + (sock2Pos[0] - this.arrowIndent) +`" y2="` + sock2Pos[1] + `" stroke-width="2" stroke-dasharray=""/>
    <line x1="` + (sock2Pos[0] - this.arrowIndent) + `" y1="` + sock2Pos[1] + `" x2="` + sock2Pos[0] +`" y2="` + sock2Pos[1] + `" stroke-width="2" marker-end="" stroke-dasharray=""/>`;
  }
  twoSidedEnvelopArrowRightLeft(sock1Pos, sock2Pos, sock1Parent, sock2Parent, arrowIndent1Sock, arrowIndent2Sock) {
    const halfGapX = Math.abs(sock2Parent.getAcrossXPosition() - sock1Parent.pos[0]) / 2;
    this.arrowLines = `<line x1="` + sock1Pos[0] + `" y1="` + sock1Pos[1] + `" x2="` + (sock1Pos[0]  + this.arrowIndent) + `" y2="` + sock1Pos[1] + `" stroke-width="2" marker-start="" stroke-dasharray=""/>
    <line x1="` + (sock1Pos[0]  + this.arrowIndent) + `" y1="` + sock1Pos[1] + `" x2="` + (sock1Pos[0]  + this.arrowIndent) +`" y2="` + arrowIndent1Sock + `" stroke-width="2" stroke-dasharray=""/>
    <line x1="` + (sock1Pos[0]  + this.arrowIndent) + `" y1="` + arrowIndent1Sock + `" x2="` + (sock1Parent.pos[0] - halfGapX) +`" y2="` + arrowIndent1Sock + `" stroke-width="2" stroke-dasharray=""/>
    <line x1="` + (sock1Parent.pos[0] - halfGapX) + `" y1="` + arrowIndent1Sock + `" x2="` + (sock1Parent.pos[0] - halfGapX) +`" y2="` + arrowIndent2Sock + `" stroke-width="2" stroke-dasharray=""/>
    <line x1="` + (sock1Parent.pos[0] - halfGapX) + `" y1="` + arrowIndent2Sock + `" x2="` + (sock2Pos[0] - this.arrowIndent) +`" y2="` + arrowIndent2Sock + `" stroke-width="2" stroke-dasharray=""/>
    <line x1="` + (sock2Pos[0] - this.arrowIndent) + `" y1="` + arrowIndent2Sock + `" x2="` + (sock2Pos[0] - this.arrowIndent) +`" y2="` + sock2Pos[1] + `" stroke-width="2" stroke-dasharray=""/>
    <line x1="` + (sock2Pos[0] - this.arrowIndent) + `" y1="` + sock2Pos[1] + `" x2="` + sock2Pos[0] +`" y2="` + sock2Pos[1] + `" stroke-width="2" marker-end="" stroke-dasharray=""/>`;
  }
  definitionDownRight(sock1Pos, sock2Pos, sock1Parent, sock2Parent) { 
    if((sock1Pos[1] - this.arrowIndent) > sock2Pos[1]) {
      //Higher
    if(sock1Parent.pos[0] + ((sock1Parent.getAcrossXPosition() - sock1Parent.pos[0]) / 2) > sock2Pos[0]) {
      //Left
      const halfGapX = Math.abs(sock1Parent.pos[0] - sock2Pos[0]) / 2;
      const halfGapY = Math.abs(sock2Parent.getAcrossYPosition() - sock1Parent.pos[1]) / 2;
      this.inBetweenArrowUpDownToRightLeft(sock1Pos, sock2Pos, (sock2Pos[0] + this.arrowIndent > sock1Parent.pos[0] - this.arrowIndent), 
      (sock1Parent.pos[0] - this.arrowIndent), 1, 1, (sock1Parent.pos[0] - halfGapX), (sock1Parent.pos[1] - halfGapY)) 
    } else {
      //Right
      //HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      this.envelopeArrowDownUpToRightLeft(sock1Pos, sock2Pos, sock1Parent, sock2Parent, (sock2Pos[0] < sock1Parent.getAcrossXPosition() - this.arrowIndent), 
      (sock1Parent.getAcrossXPosition() + this.arrowIndent), 1);
    } 
    } else {
      //Lower
      if(sock1Parent.pos[0] + ((sock1Parent.getAcrossXPosition() - sock1Parent.pos[0]) / 2) > sock2Pos[0]) {
        //Left
        this.oneAngleArrowY(sock1Pos, sock2Pos);
      } else {
        //Right
        const halfGapX = Math.abs(sock1Parent.getAcrossXPosition() - sock2Parent.pos[0]) / 2;
        const halfGapY = Math.abs(sock1Pos[1] - sock2Parent.pos[1]) / 2;
        this.envelopeArrowUpDownToRightLeft(sock1Pos, sock2Pos, ((sock2Parent.pos[1] - this.arrowIndent) > sock1Pos[1]),
        (sock2Parent.pos[1] - this.arrowIndent), 1, 1, (sock1Parent.getAcrossXPosition() + halfGapX), (sock1Pos[1] + halfGapY))
      }
    }
  }
  // oneAngleArrowX(sock1Pos, sock2Pos) {
  //   this.arrowLines = 
  //       `<line x1="` + sock1Pos[0] + `" y1="` + sock1Pos[1] + `" x2="` + sock2Pos[0] + `" y2="` + sock1Pos[1] + `" stroke-width="2" marker-start="" stroke-dasharray=""/>
  //       <line x1="` + sock2Pos[0]  + `" y1="` + sock1Pos[1] + `" x2="` + sock2Pos[0] +`" y2="` + sock2Pos[1] + `" stroke-width="2" marker-end="" stroke-dasharray=""/>`
  // }
  isSockPosHigherHalfOfTheNode(sock2Pos, sock1Parent) {
    return sock2Pos[1] < (sock1Parent.pos[1] + ((sock1Parent.getAcrossYPosition() - sock1Parent.pos[1])/2))
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
