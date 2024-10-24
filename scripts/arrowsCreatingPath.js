export class ArrowsCreatingPath {
  static singleton = new ArrowsCreatingPath();
  #arrowLines;
  #arrowIndent;
  #isDashed;

  constructor() {
    this.#arrowLines = [];
    this.#arrowIndent = 20;
    this.#isDashed = false;
  }
  #createSVGLine(obj) {
    let el = document.createElementNS("http://www.w3.org/2000/svg", "line");
    this.#setAttributesForElement(el, obj);
    el.setAttribute("stroke-width", 2);
    if (this.#isDashed) {
      el.setAttribute("stroke-dasharray", 6);
    } else {
      el.setAttribute("stroke-dasharray", 0);
    }
    return el;
  }
  #setAttributesForElement(el, obj) {
    for (let prop in obj) {
      el.setAttribute(prop, obj[prop]);
    }
  }
  #setArrow0StartEndEnd(id) {
    $(this.#arrowLines[0]).attr("marker-start", `url(#arrowhead-${id}-start)`);
    $(this.#arrowLines[this.#arrowLines.length - 1]).attr(
      "marker-end",
      `url(#arrowhead-${id}-end)`
    );
  }
  #setArrow0EndEndStart(id) {
    $(this.#arrowLines[0]).attr("marker-start", `url(#arrowhead-${id}-end)`);
    $(this.#arrowLines[this.#arrowLines.length - 1]).attr(
      "marker-end",
      `url(#arrowhead-${id}-start)`
    );
  }
  creatingPathForSocketAndPoint(inSock, point, isDashed, id, isHorizontal) {
    this.#isDashed = isDashed;
    const pointX = point.x;
    const pointY = point.y;
    const inSockPos = inSock.getAbsolutePosition();
    const inSockParent = inSock.parent;
    this.#arrowLines = [];

    if (inSock.isUp()) {
      this.#definitionForUp(
        inSockPos,
        inSockParent,
        pointX,
        pointY,
        isHorizontal
      );
      this.#setArrow0StartEndEnd(id);
    } else if (inSock.isRight()) {
      this.#definitionForRight(
        inSockPos,
        inSockParent,
        pointX,
        pointY,
        isHorizontal
      );
      this.#setArrow0StartEndEnd(id);
    } else if (inSock.isLeft()) {
      this.#definitionForLeft(
        inSockPos,
        inSockParent,
        pointX,
        pointY,
        isHorizontal
      );
      this.#setArrow0StartEndEnd(id);
    } else if (inSock.isDown()) {
      this.#definitionForDown(
        inSockPos,
        inSockParent,
        pointX,
        pointY,
        isHorizontal
      );
      this.#setArrow0StartEndEnd(id);
    }

    return this.#arrowLines;
  }
  #definitionForUp(sock1Pos, sock1Parent, pointX, pointY, isHorizontal) {
    if (isHorizontal) {
      if (sock1Pos[1] > pointY) {
        if (sock1Pos[0] === pointX) {
          this.straightLine(sock1Pos, pointX, pointY);
        } else {
          this.inBetweenLineFromUpDownToUpDown(sock1Pos, pointX, pointY, -1);
        }
      } else {
        if (
          pointX < sock1Parent.pos[0] - this.#arrowIndent ||
          pointX > sock1Parent.getAcrossXPosition() + this.#arrowIndent
        ) {
          this.#envelopeLineFromUpDown(sock1Pos, pointX, pointY, -1);
        } else if (
          pointX < sock1Parent.getAcrossXPosition() + this.#arrowIndent &&
          pointX >
            sock1Parent.pos[0] +
              (sock1Parent.getAcrossXPosition() - sock1Parent.pos[0]) / 2
        ) {
          this.#envelopeCurvedLineFromUpDown(
            sock1Pos,
            pointX,
            pointY,
            sock1Parent.getAcrossYPosition(),
            sock1Parent.getAcrossXPosition() + this.#arrowIndent,
            1,
            -1
          );
        } else {
          this.#envelopeCurvedLineFromUpDown(
            sock1Pos,
            pointX,
            pointY,
            sock1Parent.getAcrossYPosition(),
            sock1Parent.pos[0] - this.#arrowIndent,
            1,
            -1
          );
        }
      }
    } else {
      if (pointY < sock1Pos[1] - this.#arrowIndent) {
        this.#oneAngleArrow(sock1Pos, [pointX, pointY]);
      } else {
        if (pointX > sock1Pos[0]) {
          const halfGapX =
            Math.abs(sock1Parent.getAcrossXPosition() - pointX) / 2;
          this.#inBetweenLineFromUpDownToRightLeft(
            sock1Pos,
            pointX,
            pointY,
            -1,
            sock1Parent.getAcrossXPosition() + halfGapX
          );
        } else {
          const halfGapX = Math.abs(pointX - sock1Parent.pos[0]) / 2;
          this.#inBetweenLineFromUpDownToRightLeft(
            sock1Pos,
            pointX,
            pointY,
            -1,
            sock1Parent.pos[0] - halfGapX
          );
        }
      }
    }
  }
  straightLine(sock1Pos, pointX, pointY) {
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0],
        y1: sock1Pos[1],
        x2: pointX,
        y2: pointY,
      })
    );
  }
  inBetweenLineFromUpDownToUpDown(sock1Pos, pointX, pointY, gapSign) {
    const halfGapY = Math.abs(pointY - sock1Pos[1]) / 2;
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0],
        y1: sock1Pos[1],
        x2: sock1Pos[0],
        y2: sock1Pos[1] + gapSign * halfGapY,
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0],
        y1: sock1Pos[1] + gapSign * halfGapY,
        x2: pointX,
        y2: sock1Pos[1] + gapSign * halfGapY,
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: pointX,
        y1: sock1Pos[1] + gapSign * halfGapY,
        x2: pointX,
        y2: pointY,
      })
    );
  }
  #envelopeCurvedLineFromUpDown(
    sock1Pos,
    pointX,
    pointY,
    parentAcrossY,
    sideX,
    gapSign,
    indentSign
  ) {
    const halfGapY = Math.abs(parentAcrossY - pointY) / 2;
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0],
        y1: sock1Pos[1],
        x2: sock1Pos[0],
        y2: sock1Pos[1] + indentSign * this.#arrowIndent,
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0],
        y1: sock1Pos[1] + indentSign * this.#arrowIndent,
        x2: sideX,
        y2: sock1Pos[1] + indentSign * this.#arrowIndent,
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sideX,
        y1: sock1Pos[1] + indentSign * this.#arrowIndent,
        x2: sideX,
        y2: parentAcrossY + gapSign * halfGapY,
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sideX,
        y1: parentAcrossY + gapSign * halfGapY,
        x2: pointX,
        y2: parentAcrossY + gapSign * halfGapY,
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: pointX,
        y1: parentAcrossY + gapSign * halfGapY,
        x2: pointX,
        y2: pointY,
      })
    );
  }
  #envelopeLineFromUpDown(sock1Pos, pointX, pointY, indentSign) {
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0],
        y1: sock1Pos[1],
        x2: sock1Pos[0],
        y2: sock1Pos[1] + indentSign * this.#arrowIndent,
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0],
        y1: sock1Pos[1] + indentSign * this.#arrowIndent,
        x2: pointX,
        y2: sock1Pos[1] + indentSign * this.#arrowIndent,
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: pointX,
        y1: sock1Pos[1] + indentSign * this.#arrowIndent,
        x2: pointX,
        y2: pointY,
      })
    );
  }
  #inBetweenLineFromUpDownToRightLeft(
    sock1Pos,
    pointX,
    pointY,
    indentSign,
    gapX
  ) {
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0],
        y1: sock1Pos[1],
        x2: sock1Pos[0],
        y2: sock1Pos[1] + indentSign * this.#arrowIndent,
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0],
        y1: sock1Pos[1] + indentSign * this.#arrowIndent,
        x2: gapX,
        y2: sock1Pos[1] + indentSign * this.#arrowIndent,
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: gapX,
        y1: sock1Pos[1] + indentSign * this.#arrowIndent,
        x2: gapX,
        y2: pointY,
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: gapX,
        y1: pointY,
        x2: pointX,
        y2: pointY,
      })
    );
  }
  #definitionForDown(sock1Pos, sock1Parent, pointX, pointY, isHorizontal) {
    if (isHorizontal) {
      if (sock1Pos[1] < pointY) {
        if (sock1Pos[0] === pointX) {
          this.straightLine(sock1Pos, pointX, pointY);
        } else {
          this.inBetweenLineFromUpDownToUpDown(sock1Pos, pointX, pointY, 1);
        }
      } else {
        if (
          pointX > sock1Parent.getAcrossXPosition() + this.#arrowIndent ||
          pointX < sock1Parent.pos[0] - this.#arrowIndent
        ) {
          this.#envelopeLineFromUpDown(sock1Pos, pointX, pointY, 1);
        } else if (
          pointX > sock1Parent.pos[0] - this.#arrowIndent &&
          pointX <
            sock1Parent.pos[0] +
              (sock1Parent.getAcrossXPosition() - sock1Parent.pos[0]) / 2
        ) {
          this.#envelopeCurvedLineFromUpDown(
            sock1Pos,
            pointX,
            pointY,
            sock1Parent.pos[1],
            sock1Parent.pos[0] - this.#arrowIndent,
            -1,
            1
          );
        } else {
          this.#envelopeCurvedLineFromUpDown(
            sock1Pos,
            pointX,
            pointY,
            sock1Parent.pos[1],
            sock1Parent.getAcrossXPosition() + this.#arrowIndent,
            -1,
            1
          );
        }
      }
    } else {
      if (pointY > sock1Pos[1] + this.#arrowIndent) {
        this.#oneAngleArrow(sock1Pos, [pointX, pointY]);
      } else {
        if (pointX > sock1Pos[0]) {
          const halfGapX =
            Math.abs(sock1Parent.getAcrossXPosition() - pointX) / 2;
          this.#inBetweenLineFromUpDownToRightLeft(
            sock1Pos,
            pointX,
            pointY,
            1,
            sock1Parent.getAcrossXPosition() + halfGapX
          );
        } else {
          const halfGapX = Math.abs(sock1Parent.pos[0] - pointX) / 2;
          this.#inBetweenLineFromUpDownToRightLeft(
            sock1Pos,
            pointX,
            pointY,
            1,
            sock1Parent.pos[0] - halfGapX
          );
        }
      }
    }
  }
  #definitionForRight(sock1Pos, sock1Parent, pointX, pointY, isHorizontal) {
    if (isHorizontal) {
      if (pointX > sock1Pos[0] + this.#arrowIndent) {
        this.#oneAngleArrowX(sock1Pos, [pointX, pointY]);
      } else {
        if (pointY > sock1Pos[1]) {
          const halfGapY =
            Math.abs(pointY - sock1Parent.getAcrossYPosition()) / 2;
          this.#inBetweenLineFromRightLeftToUpDown(
            sock1Pos,
            pointX,
            pointY,
            sock1Parent.getAcrossYPosition() + halfGapY,
            1
          );
        } else {
          const halfGapY = Math.abs(sock1Parent.pos[1] - pointY) / 2;
          this.#inBetweenLineFromRightLeftToUpDown(
            sock1Pos,
            pointX,
            pointY,
            sock1Parent.pos[1] - halfGapY,
            1
          );
        }
      }
    } else {
      if (pointX > sock1Pos[0]) {
        if (pointY === sock1Pos[1]) {
          this.straightLine(sock1Pos, pointX, pointY);
        } else {
          this.#inBetweenLineFromRightLeftToRightLeft(
            sock1Pos,
            pointX,
            pointY,
            1
          );
        }
      } else {
        if (
          pointY < sock1Parent.pos[1] - this.#arrowIndent ||
          pointY > sock1Parent.getAcrossYPosition() + this.#arrowIndent
        ) {
          this.#envelopeLineFromRightLeftToRightLeft(
            sock1Pos,
            pointX,
            pointY,
            1
          );
        } else if (
          pointY < sock1Parent.getAcrossYPosition() + this.#arrowIndent &&
          pointY >
            sock1Parent.pos[1] +
              (sock1Parent.getAcrossYPosition() - sock1Parent.pos[1]) / 2
        ) {
          this.#envelopeArrowRightLeftToRightLeft(
            sock1Pos,
            pointX,
            pointY,
            sock1Parent.pos[0],
            sock1Parent.getAcrossYPosition() + this.#arrowIndent,
            -1,
            1
          );
        } else {
          this.#envelopeArrowRightLeftToRightLeft(
            sock1Pos,
            pointX,
            pointY,
            sock1Parent.pos[0],
            sock1Parent.pos[1] - this.#arrowIndent,
            -1,
            1
          );
        }
      }
    }
  }
  #inBetweenLineFromRightLeftToUpDown(
    sock1Pos,
    pointX,
    pointY,
    halfY,
    indentSign
  ) {
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0],
        y1: sock1Pos[1],
        x2: sock1Pos[0] + indentSign * this.#arrowIndent,
        y2: sock1Pos[1],
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0] + indentSign * this.#arrowIndent,
        y1: sock1Pos[1],
        x2: sock1Pos[0] + indentSign * this.#arrowIndent,
        y2: halfY,
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0] + indentSign * this.#arrowIndent,
        y1: halfY,
        x2: pointX,
        y2: halfY,
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: pointX,
        y1: halfY,
        x2: pointX,
        y2: pointY,
      })
    );
  }
  #inBetweenLineFromRightLeftToRightLeft(sock1Pos, pointX, pointY, sideSign) {
    const halfGapX = Math.abs(sock1Pos[0] - pointX) / 2;
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0],
        y1: sock1Pos[1],
        x2: sock1Pos[0] + sideSign * halfGapX,
        y2: sock1Pos[1],
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0] + sideSign * halfGapX,
        y1: sock1Pos[1],
        x2: sock1Pos[0] + sideSign * halfGapX,
        y2: pointY,
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0] + sideSign * halfGapX,
        y1: pointY,
        x2: pointX,
        y2: pointY,
      })
    );
  }
  #envelopeArrowRightLeftToRightLeft(
    sock1Pos,
    pointX,
    pointY,
    parentX,
    sideY,
    gapSign,
    indentSign
  ) {
    const halfGapX = Math.abs(parentX - pointX) / 2;
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0],
        y1: sock1Pos[1],
        x2: sock1Pos[0] + indentSign * this.#arrowIndent,
        y2: sock1Pos[1],
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0] + indentSign * this.#arrowIndent,
        y1: sock1Pos[1],
        x2: sock1Pos[0] + indentSign * this.#arrowIndent,
        y2: sideY,
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0] + indentSign * this.#arrowIndent,
        y1: sideY,
        x2: parentX + gapSign * halfGapX,
        y2: sideY,
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: parentX + gapSign * halfGapX,
        y1: sideY,
        x2: parentX + gapSign * halfGapX,
        y2: pointY,
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: parentX + gapSign * halfGapX,
        y1: pointY,
        x2: pointX,
        y2: pointY,
      })
    );
  }
  #envelopeLineFromRightLeftToRightLeft(sock1Pos, pointX, pointY, indentSign) {
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0],
        y1: sock1Pos[1],
        x2: sock1Pos[0] + indentSign * this.#arrowIndent,
        y2: sock1Pos[1],
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0] + indentSign * this.#arrowIndent,
        y1: sock1Pos[1],
        x2: sock1Pos[0] + indentSign * this.#arrowIndent,
        y2: pointY,
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0] + indentSign * this.#arrowIndent,
        y1: pointY,
        x2: pointX,
        y2: pointY,
      })
    );
  }
  #definitionForLeft(sock1Pos, sock1Parent, pointX, pointY, isHorizontal) {
    if (isHorizontal) {
      if (pointX < sock1Pos[0] - this.#arrowIndent) {
        this.#oneAngleArrowX(sock1Pos, [pointX, pointY]);
      } else {
        if (pointY < sock1Pos[1]) {
          const halfGapY = Math.abs(sock1Parent.pos[1] - pointY) / 2;
          this.#inBetweenLineFromRightLeftToUpDown(
            sock1Pos,
            pointX,
            pointY,
            sock1Parent.pos[1] - halfGapY,
            -1
          );
        } else {
          const halfGapY =
            Math.abs(pointY - sock1Parent.getAcrossYPosition()) / 2;
          this.#inBetweenLineFromRightLeftToUpDown(
            sock1Pos,
            pointX,
            pointY,
            sock1Parent.getAcrossYPosition() + halfGapY,
            -1
          );
        }
      }
    } else {
      if (pointX < sock1Pos[0]) {
        if (pointY === sock1Pos[1]) {
          this.straightLine(sock1Pos, pointX, pointY);
        } else {
          this.#inBetweenLineFromRightLeftToRightLeft(
            sock1Pos,
            pointX,
            pointY,
            -1
          );
        }
      } else {
        if (
          pointY < sock1Parent.pos[1] - this.#arrowIndent ||
          pointY > sock1Parent.getAcrossYPosition() + this.#arrowIndent
        ) {
          this.#envelopeLineFromRightLeftToRightLeft(
            sock1Pos,
            pointX,
            pointY,
            -1
          );
        } else if (
          pointY < sock1Parent.getAcrossYPosition() + this.#arrowIndent &&
          pointY >
            sock1Parent.pos[1] +
              (sock1Parent.getAcrossYPosition() - sock1Parent.pos[1]) / 2
        ) {
          this.#envelopeArrowRightLeftToRightLeft(
            sock1Pos,
            pointX,
            pointY,
            sock1Parent.getAcrossXPosition(),
            sock1Parent.getAcrossYPosition() + this.#arrowIndent,
            1,
            -1
          );
        } else {
          this.#envelopeArrowRightLeftToRightLeft(
            sock1Pos,
            pointX,
            pointY,
            sock1Parent.getAcrossXPosition(),
            sock1Parent.pos[1] - this.#arrowIndent,
            1,
            -1
          );
        }
      }
    }
  }
  #oneAngleArrowX(sock1Pos, sock2Pos) {
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0],
        y1: sock1Pos[1],
        x2: sock2Pos[0],
        y2: sock1Pos[1],
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock2Pos[0],
        y1: sock1Pos[1],
        x2: sock2Pos[0],
        y2: sock2Pos[1],
      })
    );
  }

  creatingPathForSockets(inSock, outSock, isDashed, id) {
    this.#isDashed = isDashed;
    const inSockPos = inSock.getAbsolutePosition();
    const outSockPos = outSock.getAbsolutePosition();
    const inSockParent = inSock.parent;
    const outSockParent = outSock.parent;
    this.#arrowLines = [];

    if (inSock.isUp()) {
      if (outSock.isUp()) {
        this.#definitionUpUp(
          inSockPos,
          outSockPos,
          inSockParent,
          outSockParent
        );
      } else if (outSock.isRight()) {
        this.#definitionUpRight(
          inSockPos,
          outSockPos,
          inSockParent,
          outSockParent
        );
        this.#setArrow0StartEndEnd(id);
      } else if (outSock.isLeft()) {
        this.#definitionUpLeft(
          inSockPos,
          outSockPos,
          inSockParent,
          outSockParent
        );
        this.#setArrow0StartEndEnd(id);
      } else if (outSock.isDown()) {
        this.#definitionUpDown(
          inSockPos,
          outSockPos,
          inSockParent,
          outSockParent
        );
        this.#setArrow0StartEndEnd(id);
      }
    } else if (inSock.isRight()) {
      if (outSock.isUp()) {
        this.#definitionUpRight(
          outSockPos,
          inSockPos,
          outSockParent,
          inSockParent
        );
        this.#setArrow0EndEndStart(id);
      } else if (outSock.isRight()) {
        this.definitionRightRight(
          outSockPos,
          inSockPos,
          outSockParent,
          inSockParent
        );
        this.#setArrow0EndEndStart(id);
      } else if (outSock.isLeft()) {
        this.#definitionRightLeft(
          inSockPos,
          outSockPos,
          inSockParent,
          outSockParent
        );
        this.#setArrow0StartEndEnd(id);
      } else if (outSock.isDown()) {
        this.#definitionDownRight(
          outSockPos,
          inSockPos,
          outSockParent,
          inSockParent
        );
        this.#setArrow0EndEndStart(id);
      }
    } else if (inSock.isLeft()) {
      if (outSock.isUp()) {
        this.#definitionUpLeft(
          outSockPos,
          inSockPos,
          outSockParent,
          inSockParent
        );
        this.#setArrow0EndEndStart(id);
      } else if (outSock.isRight()) {
        this.#definitionRightLeft(
          outSockPos,
          inSockPos,
          outSockParent,
          inSockParent
        );
        this.#setArrow0EndEndStart(id);
      } else if (outSock.isLeft()) {
        this.#definitionLeftLeft(
          inSockPos,
          outSockPos,
          inSockParent,
          outSockParent
        );
        this.#setArrow0StartEndEnd(id);
      } else if (outSock.isDown()) {
        this.#definitionDownLeft(
          outSockPos,
          inSockPos,
          outSockParent,
          inSockParent
        );
        this.#setArrow0EndEndStart(id);
      }
    } else if (inSock.isDown()) {
      if (outSock.isUp()) {
        this.#definitionUpDown(
          outSockPos,
          inSockPos,
          outSockParent,
          inSockParent
        );
        this.#setArrow0EndEndStart(id);
      } else if (outSock.isRight()) {
        this.#definitionDownRight(
          inSockPos,
          outSockPos,
          inSockParent,
          outSockParent
        );
        this.#setArrow0StartEndEnd(id);
      } else if (outSock.isLeft()) {
        this.#definitionDownLeft(
          inSockPos,
          outSockPos,
          inSockParent,
          outSockParent
        );
        this.#setArrow0StartEndEnd(id);
      } else if (outSock.isDown()) {
        this.#definitionDownDown(
          inSockPos,
          outSockPos,
          inSockParent,
          outSockParent
        );
        this.#setArrow0StartEndEnd(id);
      }
    }

    return this.#arrowLines;
  }
  #definitionUpUp(sock1Pos, sock2Pos, sock1Parent, sock2Parent) {
    if (
      sock2Parent.getAcrossXPosition() + this.#arrowIndent < sock1Pos[0] ||
      sock2Parent.pos[0] - this.#arrowIndent > sock1Pos[0]
    ) {
      //out of node
      this.straightArrowUpUpOrDownDown(
        sock1Pos,
        sock2Pos,
        sock1Pos[1] > sock2Pos[1],
        -1
      );
    } else {
      //in node
      if (sock2Pos[1] > sock1Pos[1]) {
        const halfGapY =
          Math.abs(sock2Pos[1] - sock1Parent.getAcrossYPosition()) / 2;
        this.#envelopeCurvedArrowUpUpOrDownDown(
          sock1Pos,
          sock2Pos,
          sock1Parent,
          -1,
          sock1Parent.getAcrossYPosition() + halfGapY
        );
      } else {
        const halfGapY =
          Math.abs(sock1Pos[1] - sock2Parent.getAcrossYPosition()) / 2;
        this.#envelopeCurvedArrowUpUpOrDownDown(
          sock2Pos,
          sock1Pos,
          sock2Parent,
          -1,
          sock2Parent.getAcrossYPosition() + halfGapY
        );
      }
    }
  }
  straightArrowUpUpOrDownDown(sock1Pos, sock2Pos, isHigher, indentSign) {
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0],
        y1: sock1Pos[1],
        x2: sock1Pos[0],
      })
    );
    if (isHigher) {
      //sock2 + arrowIndent
      this.#setAttributesForElement(
        this.#arrowLines[this.#arrowLines.length - 1],
        { y2: sock2Pos[1] + indentSign * this.#arrowIndent }
      );
      this.#arrowLines.push(
        this.#createSVGLine({
          x1: sock1Pos[0],
          y1: sock2Pos[1] + indentSign * this.#arrowIndent,
          x2: sock2Pos[0],
          y2: sock2Pos[1] + indentSign * this.#arrowIndent,
        })
      );
      this.#arrowLines.push(
        this.#createSVGLine({
          y1: sock2Pos[1] + indentSign * this.#arrowIndent,
        })
      );
    } else {
      //sock1 + arrowIndent
      this.#setAttributesForElement(
        this.#arrowLines[this.#arrowLines.length - 1],
        { y2: sock1Pos[1] + indentSign * this.#arrowIndent }
      );
      this.#arrowLines.push(
        this.#createSVGLine({
          x1: sock1Pos[0],
          y1: sock1Pos[1] + indentSign * this.#arrowIndent,
          x2: sock2Pos[0],
          y2: sock1Pos[1] + indentSign * this.#arrowIndent,
        })
      );
      this.#arrowLines.push(
        this.#createSVGLine({
          y1: sock1Pos[1] + indentSign * this.#arrowIndent,
        })
      );
    }
    this.#setAttributesForElement(
      this.#arrowLines[this.#arrowLines.length - 1],
      {
        x1: sock2Pos[0],
        x2: sock2Pos[0],
        y2: sock2Pos[1],
      }
    );
  }
  #envelopeCurvedArrowUpUpOrDownDown(
    sock1Pos,
    sock2Pos,
    sock1Parent,
    indentSign,
    gapY
  ) {
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0],
        y1: sock1Pos[1],
        x2: sock1Pos[0],
        y2: sock1Pos[1] + indentSign * this.#arrowIndent,
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0],
        y1: sock1Pos[1] + indentSign * this.#arrowIndent,
        y2: sock1Pos[1] + indentSign * this.#arrowIndent,
      })
    );
    if (this.#isSockPosLefterHalfOfTheNode(sock2Pos, sock1Parent)) {
      this.#setAttributesForElement(
        this.#arrowLines[this.#arrowLines.length - 1],
        { x2: sock1Parent.pos[0] - this.#arrowIndent }
      );
      this.#arrowLines.push(
        this.#createSVGLine({
          x1: sock1Parent.pos[0] - this.#arrowIndent,
          y1: sock1Pos[1] + indentSign * this.#arrowIndent,
          x2: sock1Parent.pos[0] - this.#arrowIndent,
          y2: gapY,
        })
      );
      this.#arrowLines.push(
        this.#createSVGLine({
          x1: sock1Parent.pos[0] - this.#arrowIndent,
        })
      );
    } else {
      this.#setAttributesForElement(
        this.#arrowLines[this.#arrowLines.length - 1],
        { x2: sock1Parent.getAcrossXPosition() + this.#arrowIndent }
      );
      this.#arrowLines.push(
        this.#createSVGLine({
          x1: sock1Parent.getAcrossXPosition() + this.#arrowIndent,
          y1: sock1Pos[1] + indentSign * this.#arrowIndent,
          x2: sock1Parent.getAcrossXPosition() + this.#arrowIndent,
          y2: gapY,
        })
      );
      this.#arrowLines.push(
        this.#createSVGLine({
          x1: sock1Parent.getAcrossXPosition() + this.#arrowIndent,
        })
      );
    }
    this.#setAttributesForElement(
      this.#arrowLines[this.#arrowLines.length - 1],
      {
        y1: gapY,
        x2: sock2Pos[0],
        y2: gapY,
      }
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock2Pos[0],
        y1: gapY,
        x2: sock2Pos[0],
        y2: sock2Pos[1],
      })
    );
  }
  #definitionUpRight(sock1Pos, sock2Pos, sock1Parent, sock2Parent) {
    if (sock1Pos[1] + this.#arrowIndent > sock2Pos[1] + this.#arrowIndent) {
      //Higher
      if (this.#isSockPosLefterHalfOfTheNode(sock2Pos, sock1Parent)) {
        //Left
        this.#oneAngleArrow(sock1Pos, sock2Pos);
      } else {
        //Right
        const halfGapX =
          Math.abs(sock1Parent.getAcrossXPosition() - sock2Parent.pos[0]) / 2;
        const halfGapY =
          Math.abs(sock1Pos[1] - sock2Parent.getAcrossYPosition()) / 2;
        this.#envelopeArrowUpDownToRightLeft(
          sock1Pos,
          sock2Pos,
          sock2Parent.getAcrossYPosition() + this.#arrowIndent < sock1Pos[1],
          sock2Parent.getAcrossYPosition() + this.#arrowIndent,
          -1,
          1,
          sock1Parent.getAcrossXPosition() + halfGapX,
          sock1Pos[1] - halfGapY
        );
      }
    } else {
      //Lower
      if (this.#isSockPosLefterHalfOfTheNode(sock2Pos, sock1Parent)) {
        //Left
        const halfGapX = Math.abs(sock1Parent.pos[0] - sock2Pos[0]) / 2;
        const halfGapY =
          Math.abs(sock1Parent.getAcrossYPosition() - sock2Parent.pos[1]) / 2;
        this.#inBetweenArrowUpDownToRightLeft(
          sock1Pos,
          sock2Pos,
          sock2Pos[0] + this.#arrowIndent >
            sock1Parent.pos[0] - this.#arrowIndent,
          sock1Parent.pos[0] - this.#arrowIndent,
          1,
          -1,
          sock1Parent.pos[0] - halfGapX,
          sock1Parent.getAcrossYPosition() + halfGapY
        );
      } else {
        //Right
        this.#envelopeArrowDownUpToRightLeft(
          sock1Pos,
          sock2Pos,
          sock2Parent.pos[1] - this.#arrowIndent <
            sock1Parent.pos[1] - this.#arrowIndent,
          sock2Parent.pos[1] - this.#arrowIndent,
          -1,
          sock2Pos[0] < sock1Parent.getAcrossXPosition() - this.#arrowIndent,
          sock1Parent.getAcrossXPosition() + this.#arrowIndent,
          1
        );
      }
    }
  }
  #definitionUpLeft(sock1Pos, sock2Pos, sock1Parent, sock2Parent) {
    if (sock1Pos[1] + this.#arrowIndent > sock2Pos[1] + this.#arrowIndent) {
      //Higher
      if (this.#isSockPosLefterHalfOfTheNode(sock2Pos, sock1Parent)) {
        //Left
        const halfGapX =
          Math.abs(sock2Parent.getAcrossXPosition() - sock1Parent.pos[0]) / 2;
        const halfGapY =
          Math.abs(sock1Pos[1] - sock2Parent.getAcrossYPosition()) / 2;
        this.#envelopeArrowUpDownToRightLeft(
          sock1Pos,
          sock2Pos,
          sock2Parent.getAcrossYPosition() + this.#arrowIndent < sock1Pos[1],
          sock2Parent.getAcrossYPosition() + this.#arrowIndent,
          -1,
          -1,
          sock1Parent.pos[0] - halfGapX,
          sock1Pos[1] - halfGapY
        );
      } else {
        //Right
        this.#oneAngleArrow(sock1Pos, sock2Pos);
      }
    } else {
      //Lower
      if (this.#isSockPosLefterHalfOfTheNode(sock2Pos, sock1Parent)) {
        //Left
        this.#envelopeArrowDownUpToRightLeft(
          sock1Pos,
          sock2Pos,
          sock2Parent.pos[1] - this.#arrowIndent <
            sock1Parent.pos[1] - this.#arrowIndent,
          sock2Parent.pos[1] - this.#arrowIndent,
          -1,
          sock2Pos[0] > sock1Parent.pos[0] - this.#arrowIndent,
          sock1Parent.pos[0] - this.#arrowIndent,
          -1
        );
      } else {
        //Right
        const halfGapX =
          Math.abs(sock2Pos[0] - sock1Parent.getAcrossXPosition()) / 2;
        const halfGapY =
          Math.abs(sock1Parent.getAcrossYPosition() - sock2Parent.pos[1]) / 2;
        this.#inBetweenArrowUpDownToRightLeft(
          sock1Pos,
          sock2Pos,
          sock2Pos[0] - this.#arrowIndent <
            sock1Parent.getAcrossXPosition() + this.#arrowIndent,
          sock1Parent.getAcrossXPosition() + this.#arrowIndent,
          -1,
          -1,
          sock1Parent.getAcrossXPosition() + halfGapX,
          sock1Parent.getAcrossYPosition() + halfGapY
        );
      }
    }
  }
  #oneAngleArrow(sock1Pos, sock2Pos) {
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0],
        y1: sock1Pos[1],
        x2: sock1Pos[0],
        y2: sock2Pos[1],
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0],
        y1: sock2Pos[1],
        x2: sock2Pos[0],
        y2: sock2Pos[1],
      })
    );
  }
  #envelopeArrowUpDownToRightLeft(
    sock1Pos,
    sock2Pos,
    isOutOfNode,
    sock2YIndent,
    indent1Sign,
    indent2Sign,
    inBetweenX,
    inBetweenY
  ) {
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0],
        y1: sock1Pos[1],
        x2: sock1Pos[0],
      })
    );

    if (isOutOfNode) {
      //out of node
      this.#setAttributesForElement(
        this.#arrowLines[this.#arrowLines.length - 1],
        { y2: inBetweenY }
      );
      this.#arrowLines.push(
        this.#createSVGLine({
          x1: sock1Pos[0],
          y1: inBetweenY,
          x2: sock2Pos[0] + indent2Sign * this.#arrowIndent,
          y2: inBetweenY,
        })
      );
      this.#arrowLines.push(
        this.#createSVGLine({
          y1: inBetweenY,
        })
      );
    } else {
      //behind
      this.#setAttributesForElement(
        this.#arrowLines[this.#arrowLines.length - 1],
        { y2: sock1Pos[1] + indent1Sign * this.#arrowIndent }
      );
      this.#arrowLines.push(
        this.#createSVGLine({
          x1: sock1Pos[0],
          y1: sock1Pos[1] + indent1Sign * this.#arrowIndent,
          x2: inBetweenX,
          y2: sock1Pos[1] + indent1Sign * this.#arrowIndent,
        })
      );
      this.#arrowLines.push(
        this.#createSVGLine({
          x1: inBetweenX,
          y1: sock1Pos[1] + indent1Sign * this.#arrowIndent,
          x2: inBetweenX,
          y2: sock2YIndent,
        })
      );
      this.#arrowLines.push(
        this.#createSVGLine({
          x1: inBetweenX,
          y1: sock2YIndent,
          x2: sock2Pos[0] + indent2Sign * this.#arrowIndent,
          y2: sock2YIndent,
        })
      );
      this.#arrowLines.push(
        this.#createSVGLine({
          y1: sock2YIndent,
        })
      );
    }
    this.#setAttributesForElement(
      this.#arrowLines[this.#arrowLines.length - 1],
      {
        x1: sock2Pos[0] + indent2Sign * this.#arrowIndent,
        x2: sock2Pos[0] + indent2Sign * this.#arrowIndent,
        y2: sock2Pos[1],
      }
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock2Pos[0] + indent2Sign * this.#arrowIndent,
        y1: sock2Pos[1],
        x2: sock2Pos[0],
        y2: sock2Pos[1],
      })
    );
  }
  #inBetweenArrowUpDownToRightLeft(
    sock1Pos,
    sock2Pos,
    isUnderNode,
    inNodeIndentX,
    indent2Sign,
    indent1Sign,
    xWithGap,
    yWithGap
  ) {
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0],
        y1: sock1Pos[1],
        x2: sock1Pos[0],
        y2: sock1Pos[1] + indent1Sign * this.#arrowIndent,
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0],
        y1: sock1Pos[1] + indent1Sign * this.#arrowIndent,
        y2: sock1Pos[1] + indent1Sign * this.#arrowIndent,
      })
    );
    if (isUnderNode) {
      //Under node
      this.#setAttributesForElement(
        this.#arrowLines[this.#arrowLines.length - 1],
        { x2: inNodeIndentX }
      );
      this.#arrowLines.push(
        this.#createSVGLine({
          x1: inNodeIndentX,
          y1: sock1Pos[1] + indent1Sign * this.#arrowIndent,
          x2: inNodeIndentX,
          y2: yWithGap,
        })
      );
      this.#arrowLines.push(
        this.#createSVGLine({
          x1: inNodeIndentX,
          y1: yWithGap,
          x2: sock2Pos[0] + indent2Sign * this.#arrowIndent,
          y2: yWithGap,
        })
      );
      this.#arrowLines.push(
        this.#createSVGLine({
          x1: sock2Pos[0] + indent2Sign * this.#arrowIndent,
          y1: yWithGap,
          x2: sock2Pos[0] + indent2Sign * this.#arrowIndent,
          y2: sock2Pos[1],
        })
      );
      this.#arrowLines.push(
        this.#createSVGLine({
          x1: sock2Pos[0] + indent2Sign * this.#arrowIndent,
        })
      );
    } else {
      //Out of node
      this.#setAttributesForElement(
        this.#arrowLines[this.#arrowLines.length - 1],
        { x2: xWithGap }
      );
      this.#arrowLines.push(
        this.#createSVGLine({
          x1: xWithGap,
          y1: sock1Pos[1] + indent1Sign * this.#arrowIndent,
          x2: xWithGap,
          y2: sock2Pos[1],
        })
      );
      this.#arrowLines.push(this.#createSVGLine({ x1: xWithGap }));
    }
    this.#setAttributesForElement(
      this.#arrowLines[this.#arrowLines.length - 1],
      {
        y1: sock2Pos[1],
        x2: sock2Pos[0],
        y2: sock2Pos[1],
      }
    );
  }
  #envelopeArrowDownUpToRightLeft(
    sock1Pos,
    sock2Pos,
    isBehindNode,
    sock2ParentPosWithIndent,
    indent1Sign,
    isInNode,
    nodeParentIndentX,
    indent2Sign
  ) {
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0],
        y1: sock1Pos[1],
        x2: sock1Pos[0],
      })
    );
    if (isBehindNode) {
      this.#setAttributesForElement(
        this.#arrowLines[this.#arrowLines.length - 1],
        { y2: sock2ParentPosWithIndent }
      );
      this.#arrowLines.push(
        this.#createSVGLine({
          x1: sock1Pos[0],
          y1: sock2ParentPosWithIndent,
        })
      );
    } else {
      this.#setAttributesForElement(
        this.#arrowLines[this.#arrowLines.length - 1],
        { y2: sock1Pos[1] + indent1Sign * this.#arrowIndent }
      );
      this.#arrowLines.push(
        this.#createSVGLine({
          x1: sock1Pos[0],
          y1: sock1Pos[1] + indent1Sign * this.#arrowIndent,
        })
      );
    }
    if (isInNode) {
      //Under node
      this.#setAttributesForElement(
        this.#arrowLines[this.#arrowLines.length - 1],
        {
          x2: nodeParentIndentX,
          y2: sock1Pos[1] + indent1Sign * this.#arrowIndent,
        }
      );
      this.#arrowLines.push(
        this.#createSVGLine({
          x1: nodeParentIndentX,
          y1: sock1Pos[1] + indent1Sign * this.#arrowIndent,
          x2: nodeParentIndentX,
          y2: sock2Pos[1],
        })
      );
      this.#arrowLines.push(this.#createSVGLine({ x1: nodeParentIndentX }));
    } else {
      //Out of node
      this.#setAttributesForElement(
        this.#arrowLines[this.#arrowLines.length - 1],
        { x2: sock2Pos[0] + indent2Sign * this.#arrowIndent }
      );
      if (isBehindNode) {
        this.#setAttributesForElement(
          this.#arrowLines[this.#arrowLines.length - 1],
          { y2: sock2ParentPosWithIndent }
        );
        this.#arrowLines.push(
          this.#createSVGLine({
            y1: sock2ParentPosWithIndent,
          })
        );
      } else {
        this.#setAttributesForElement(
          this.#arrowLines[this.#arrowLines.length - 1],
          { y2: sock1Pos[1] + indent1Sign * this.#arrowIndent }
        );
        this.#arrowLines.push(
          this.#createSVGLine({
            y1: sock1Pos[1] + indent1Sign * this.#arrowIndent,
          })
        );
      }
      this.#setAttributesForElement(
        this.#arrowLines[this.#arrowLines.length - 1],
        {
          x1: sock2Pos[0] + indent2Sign * this.#arrowIndent,
          x2: sock2Pos[0] + indent2Sign * this.#arrowIndent,
          y2: sock2Pos[1],
        }
      );
      this.#arrowLines.push(
        this.#createSVGLine({
          x1: sock2Pos[0] + indent2Sign * this.#arrowIndent,
        })
      );
    }
    this.#setAttributesForElement(
      this.#arrowLines[this.#arrowLines.length - 1],
      {
        y1: sock2Pos[1],
        x2: sock2Pos[0],
        y2: sock2Pos[1],
      }
    );
  }
  #definitionUpDown(sock1Pos, sock2Pos, sock1Parent, sock2Parent) {
    if (sock1Pos[1] - this.#arrowIndent > sock2Pos[1] + this.#arrowIndent) {
      //Higher
      const halfGapY = Math.abs(sock2Pos[1] - sock1Pos[1]) / 2;
      this.#arrowLines.push(
        this.#createSVGLine({
          x1: sock1Pos[0],
          y1: sock1Pos[1],
          x2: sock1Pos[0],
          y2: sock1Pos[1] - halfGapY,
        })
      );
      this.#arrowLines.push(
        this.#createSVGLine({
          x1: sock1Pos[0],
          y1: sock1Pos[1] - halfGapY,
          x2: sock2Pos[0],
          y2: sock1Pos[1] - halfGapY,
        })
      );
      this.#arrowLines.push(
        this.#createSVGLine({
          x1: sock2Pos[0],
          y1: sock1Pos[1] - halfGapY,
          x2: sock2Pos[0],
          y2: sock2Pos[1],
        })
      );
    } else {
      //Lower
      if (
        sock1Parent.pos[0] +
          (sock1Parent.getAcrossXPosition() - sock1Parent.pos[0]) / 2 >
        sock2Pos[0]
      ) {
        //Left
        const halfGapX = Math.abs(
          (sock2Parent.getAcrossXPosition() - sock1Parent.pos[0]) / 2
        );
        this.#inBetweenLowerArrowUpDown(
          sock1Pos,
          sock2Pos,
          sock1Parent,
          sock2Parent,
          sock1Parent.pos[0] - halfGapX,
          sock1Parent.pos[0] - this.#arrowIndent,
          sock2Parent.getAcrossXPosition() + this.#arrowIndent
        );
      } else {
        //Right
        const halfGapX = Math.abs(
          (sock2Parent.pos[0] - sock1Parent.getAcrossXPosition()) / 2
        );
        this.#inBetweenLowerArrowUpDown(
          sock1Pos,
          sock2Pos,
          sock1Parent,
          sock2Parent,
          sock1Parent.getAcrossXPosition() + halfGapX,
          sock1Parent.getAcrossXPosition() + this.#arrowIndent,
          sock2Parent.pos[0] - this.#arrowIndent
        );
      }
    }
  }
  #inBetweenLowerArrowUpDown(
    sock1Pos,
    sock2Pos,
    sock1Parent,
    sock2Parent,
    inBetweenX,
    node1IndentX,
    node2IndentX
  ) {
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0],
        y1: sock1Pos[1],
        x2: sock1Pos[0],
        y2: sock1Pos[1] - this.#arrowIndent,
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0],
        y1: sock1Pos[1] - this.#arrowIndent,
        y2: sock1Pos[1] - this.#arrowIndent,
      })
    );
    if (
      sock2Parent.getAcrossXPosition() + this.#arrowIndent <
        sock1Parent.pos[0] - this.#arrowIndent ||
      sock2Parent.pos[0] - this.#arrowIndent >
        sock1Parent.getAcrossXPosition() + this.#arrowIndent
    ) {
      this.#setAttributesForElement(
        this.#arrowLines[this.#arrowLines.length - 1],
        { x2: inBetweenX }
      );
      this.#arrowLines.push(
        this.#createSVGLine({
          x1: inBetweenX,
          y1: sock1Pos[1] - this.#arrowIndent,
          x2: inBetweenX,
          y2: sock2Pos[1] + this.#arrowIndent,
        })
      );
      this.#arrowLines.push(
        this.#createSVGLine({
          x1: inBetweenX,
        })
      );
    } else {
      const halfGapY =
        Math.abs(sock2Parent.pos[1] - sock1Parent.getAcrossYPosition()) / 2;
      this.#setAttributesForElement(
        this.#arrowLines[this.#arrowLines.length - 1],
        { x2: node1IndentX }
      );
      this.#arrowLines.push(
        this.#createSVGLine({
          x1: node1IndentX,
          y1: sock1Pos[1] - this.#arrowIndent,
          x2: node1IndentX,
          y2: sock1Parent.getAcrossYPosition() + halfGapY,
        })
      );
      this.#arrowLines.push(
        this.#createSVGLine({
          x1: node1IndentX,
          y1: sock1Parent.getAcrossYPosition() + halfGapY,
          x2: node2IndentX,
          y2: sock1Parent.getAcrossYPosition() + halfGapY,
        })
      );
      this.#arrowLines.push(
        this.#createSVGLine({
          x1: node2IndentX,
          y1: sock1Parent.getAcrossYPosition() + halfGapY,
          x2: node2IndentX,
          y2: sock2Pos[1] + this.#arrowIndent,
        })
      );
      this.#arrowLines.push(
        this.#createSVGLine({
          x1: node2IndentX,
        })
      );
    }
    this.#setAttributesForElement(
      this.#arrowLines[this.#arrowLines.length - 1],
      {
        y1: sock2Pos[1] + this.#arrowIndent,
        x2: sock2Pos[0],
        y2: sock2Pos[1] + this.#arrowIndent,
      }
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock2Pos[0],
        y1: sock2Pos[1] + this.#arrowIndent,
        x2: sock2Pos[0],
        y2: sock2Pos[1],
      })
    );
  }
  definitionRightRight(sock1Pos, sock2Pos, sock1Parent, sock2Parent) {
    if (
      sock2Parent.getAcrossYPosition() + this.#arrowIndent < sock1Pos[1] ||
      sock2Parent.pos[1] - this.#arrowIndent > sock1Pos[1]
    ) {
      //out of node
      this.#straightArrowRightRightOrLeftLeft(
        sock1Pos,
        sock2Pos,
        sock1Pos[0] > sock2Pos[0],
        1
      );
    } else {
      //"in" node
      if (sock1Pos[0] > sock2Pos[0]) {
        // Right
        const halfGapX = Math.abs(sock1Parent.pos[0] - sock2Pos[0]) / 2;
        if (this.#isSockPosHigherHalfOfTheNode(sock2Pos, sock1Parent)) {
          //higher
          this.#envelopeArrowRightRightOrLeftLeft(
            sock1Pos,
            sock2Pos,
            sock1Parent.pos[1] - this.#arrowIndent,
            1,
            sock1Parent.pos[0] - halfGapX
          );
        } else {
          //lower
          this.#envelopeArrowRightRightOrLeftLeft(
            sock1Pos,
            sock2Pos,
            sock1Parent.getAcrossYPosition() + this.#arrowIndent,
            1,
            sock1Parent.pos[0] - halfGapX
          );
        }
      } else {
        // Left
        const halfGapX = Math.abs(sock2Parent.pos[0] - sock1Pos[0]) / 2;
        if (this.#isSockPosHigherHalfOfTheNode(sock2Pos, sock1Parent)) {
          //higher
          this.#envelopeArrowRightRightOrLeftLeft(
            sock2Pos,
            sock1Pos,
            sock2Parent.pos[1] - this.#arrowIndent,
            1,
            sock2Parent.pos[0] - halfGapX
          );
        } else {
          //lower
          this.#envelopeArrowRightRightOrLeftLeft(
            sock2Pos,
            sock1Pos,
            sock2Parent.getAcrossYPosition() + this.#arrowIndent,
            1,
            sock2Parent.pos[0] - halfGapX
          );
        }
      }
    }
  }
  #straightArrowRightRightOrLeftLeft(
    sock1Pos,
    sock2Pos,
    isRighter,
    indentSign
  ) {
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0],
        y1: sock1Pos[1],
        y2: sock1Pos[1],
      })
    );
    if (isRighter) {
      //righter
      //sock1 + arrowIndent
      this.#setAttributesForElement(
        this.#arrowLines[this.#arrowLines.length - 1],
        { x2: sock1Pos[0] + indentSign * this.#arrowIndent }
      );
      this.#arrowLines.push(
        this.#createSVGLine({
          x1: sock1Pos[0] + indentSign * this.#arrowIndent,
          y1: sock1Pos[1],
          x2: sock1Pos[0] + indentSign * this.#arrowIndent,
          y2: sock2Pos[1],
        })
      );
      this.#arrowLines.push(
        this.#createSVGLine({
          x1: sock1Pos[0] + indentSign * this.#arrowIndent,
        })
      );
    } else {
      //lefter
      //sock2 + arrowIndent
      this.#setAttributesForElement(
        this.#arrowLines[this.#arrowLines.length - 1],
        { x2: sock2Pos[0] + indentSign * this.#arrowIndent }
      );
      this.#arrowLines.push(
        this.#createSVGLine({
          x1: sock2Pos[0] + indentSign * this.#arrowIndent,
          y1: sock1Pos[1],
          x2: sock2Pos[0] + indentSign * this.#arrowIndent,
          y2: sock2Pos[1],
        })
      );
      this.#arrowLines.push(
        this.#createSVGLine({
          x1: sock2Pos[0] + indentSign * this.#arrowIndent,
        })
      );
    }
    this.#setAttributesForElement(
      this.#arrowLines[this.#arrowLines.length - 1],
      {
        y1: sock2Pos[1],
        x2: sock2Pos[0],
        y2: sock2Pos[1],
      }
    );
  }
  #envelopeArrowRightRightOrLeftLeft(
    sock1Pos,
    sock2Pos,
    sockIndentY,
    indentSign,
    gapX
  ) {
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0],
        y1: sock1Pos[1],
        x2: sock1Pos[0] + indentSign * this.#arrowIndent,
        y2: sock1Pos[1],
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0] + indentSign * this.#arrowIndent,
        y1: sock1Pos[1],
        x2: sock1Pos[0] + indentSign * this.#arrowIndent,
        y2: sockIndentY,
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0] + indentSign * this.#arrowIndent,
        y1: sockIndentY,
        x2: gapX,
        y2: sockIndentY,
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: gapX,
        y1: sockIndentY,
        x2: gapX,
        y2: sock2Pos[1],
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: gapX,
        y1: sock2Pos[1],
        x2: sock2Pos[0],
        y2: sock2Pos[1],
      })
    );
  }
  #definitionRightLeft(sock1Pos, sock2Pos, sock1Parent, sock2Parent) {
    if (sock1Pos[0] + this.#arrowIndent > sock2Pos[0] - this.#arrowIndent) {
      //lefter
      if (
        sock2Parent.getAcrossYPosition() + this.#arrowIndent <
        sock1Parent.pos[1] - this.#arrowIndent
      ) {
        //higher, out of node
        const halfGapY =
          Math.abs(sock2Parent.getAcrossYPosition() - sock1Parent.pos[1]) / 2;
        this.twoSidedArrowRightLeft(
          sock1Pos,
          sock2Pos,
          sock1Parent.pos[1] - halfGapY
        );
      } else {
        if (this.#isSockPosHigherHalfOfTheNode(sock2Pos, sock1Parent)) {
          this.#twoSidedEnvelopArrowRightLeft(
            sock1Pos,
            sock2Pos,
            sock1Parent,
            sock2Parent,
            sock1Parent.pos[1] - this.#arrowIndent,
            sock2Parent.getAcrossYPosition() + this.#arrowIndent
          );
        } else if (
          sock1Parent.getAcrossYPosition() + this.#arrowIndent <
          sock2Parent.pos[1] - this.#arrowIndent
        ) {
          //lower, out of node
          const halfGapY =
            Math.abs(sock1Parent.getAcrossYPosition() - sock2Parent.pos[1]) / 2;
          this.twoSidedArrowRightLeft(
            sock1Pos,
            sock2Pos,
            sock1Parent.getAcrossYPosition() + halfGapY
          );
        } else {
          this.#twoSidedEnvelopArrowRightLeft(
            sock1Pos,
            sock2Pos,
            sock1Parent,
            sock2Parent,
            sock1Parent.getAcrossYPosition() + this.#arrowIndent,
            sock2Parent.pos[1] - this.#arrowIndent
          );
        }
      }
    } else {
      //righter
      this.#inBetweenArrowRightLeft(sock1Pos, sock2Pos);
    }
  }
  #inBetweenArrowRightLeft(sock1Pos, sock2Pos) {
    const halfGapX = Math.abs(sock2Pos[0] - sock1Pos[0]) / 2;
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0],
        y1: sock1Pos[1],
        x2: sock1Pos[0] + halfGapX,
        y2: sock1Pos[1],
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0] + halfGapX,
        y1: sock1Pos[1],
        x2: sock1Pos[0] + halfGapX,
        y2: sock2Pos[1],
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0] + halfGapX,
        y1: sock2Pos[1],
        x2: sock2Pos[0],
        y2: sock2Pos[1],
      })
    );
  }
  twoSidedArrowRightLeft(sock1Pos, sock2Pos, gapY) {
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0],
        y1: sock1Pos[1],
        x2: sock1Pos[0] + this.#arrowIndent,
        y2: sock1Pos[1],
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0] + this.#arrowIndent,
        y1: sock1Pos[1],
        x2: sock1Pos[0] + this.#arrowIndent,
        y2: gapY,
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0] + this.#arrowIndent,
        y1: gapY,
        x2: sock2Pos[0] - this.#arrowIndent,
        y2: gapY,
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock2Pos[0] - this.#arrowIndent,
        y1: gapY,
        x2: sock2Pos[0] - this.#arrowIndent,
        y2: sock2Pos[1],
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock2Pos[0] - this.#arrowIndent,
        y1: sock2Pos[1],
        x2: sock2Pos[0],
        y2: sock2Pos[1],
      })
    );
  }
  #twoSidedEnvelopArrowRightLeft(
    sock1Pos,
    sock2Pos,
    sock1Parent,
    sock2Parent,
    arrowIndent1Sock,
    arrowIndent2Sock
  ) {
    const halfGapX =
      Math.abs(sock2Parent.getAcrossXPosition() - sock1Parent.pos[0]) / 2;
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0],
        y1: sock1Pos[1],
        x2: sock1Pos[0] + this.#arrowIndent,
        y2: sock1Pos[1],
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0] + this.#arrowIndent,
        y1: sock1Pos[1],
        x2: sock1Pos[0] + this.#arrowIndent,
        y2: arrowIndent1Sock,
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0] + this.#arrowIndent,
        y1: sock1Pos[1],
        x2: sock1Pos[0] + this.#arrowIndent,
        y2: arrowIndent1Sock,
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Pos[0] + this.#arrowIndent,
        y1: arrowIndent1Sock,
        x2: sock1Parent.pos[0] - halfGapX,
        y2: arrowIndent1Sock,
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Parent.pos[0] - halfGapX,
        y1: arrowIndent1Sock,
        x2: sock1Parent.pos[0] - halfGapX,
        y2: arrowIndent2Sock,
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock1Parent.pos[0] - halfGapX,
        y1: arrowIndent2Sock,
        x2: sock2Pos[0] - this.#arrowIndent,
        y2: arrowIndent2Sock,
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock2Pos[0] - this.#arrowIndent,
        y1: arrowIndent2Sock,
        x2: sock2Pos[0] - this.#arrowIndent,
        y2: sock2Pos[1],
      })
    );
    this.#arrowLines.push(
      this.#createSVGLine({
        x1: sock2Pos[0] - this.#arrowIndent,
        y1: sock2Pos[1],
        x2: sock2Pos[0],
        y2: sock2Pos[1],
      })
    );
  }
  #definitionDownRight(sock1Pos, sock2Pos, sock1Parent, sock2Parent) {
    if (sock1Pos[1] - this.#arrowIndent > sock2Pos[1] - this.#arrowIndent) {
      //Higher
      if (this.#isSockPosLefterHalfOfTheNode(sock2Pos, sock1Parent)) {
        //Left
        const halfGapX = Math.abs(sock1Parent.pos[0] - sock2Pos[0]) / 2;
        const halfGapY =
          Math.abs(sock2Parent.getAcrossYPosition() - sock1Parent.pos[1]) / 2;
        this.#inBetweenArrowUpDownToRightLeft(
          sock1Pos,
          sock2Pos,
          sock2Pos[0] + this.#arrowIndent >
            sock1Parent.pos[0] - this.#arrowIndent,
          sock1Parent.pos[0] - this.#arrowIndent,
          1,
          1,
          sock1Parent.pos[0] - halfGapX,
          sock1Parent.pos[1] - halfGapY
        );
      } else {
        //Right
        this.#envelopeArrowDownUpToRightLeft(
          sock1Pos,
          sock2Pos,
          sock2Parent.getAcrossYPosition() + this.#arrowIndent >
            sock1Parent.getAcrossYPosition() + this.#arrowIndent,
          sock2Parent.getAcrossYPosition() + this.#arrowIndent,
          1,
          sock2Pos[0] < sock1Parent.getAcrossXPosition() + this.#arrowIndent,
          sock1Parent.getAcrossXPosition() + this.#arrowIndent,
          1
        );
      }
    } else {
      //Lower
      if (this.#isSockPosLefterHalfOfTheNode(sock2Pos, sock1Parent)) {
        //Left
        this.#oneAngleArrow(sock1Pos, sock2Pos);
      } else {
        //Right
        const halfGapX =
          Math.abs(sock1Parent.getAcrossXPosition() - sock2Parent.pos[0]) / 2;
        const halfGapY = Math.abs(sock1Pos[1] - sock2Parent.pos[1]) / 2;
        this.#envelopeArrowUpDownToRightLeft(
          sock1Pos,
          sock2Pos,
          sock2Parent.pos[1] - this.#arrowIndent > sock1Pos[1],
          sock2Parent.pos[1] - this.#arrowIndent,
          1,
          1,
          sock1Parent.getAcrossXPosition() + halfGapX,
          sock1Pos[1] + halfGapY
        );
      }
    }
  }
  #definitionDownLeft(sock1Pos, sock2Pos, sock1Parent, sock2Parent) {
    if (sock1Pos[1] - this.#arrowIndent > sock2Pos[1] - this.#arrowIndent) {
      //Higher
      if (this.#isSockPosLefterHalfOfTheNode(sock2Pos, sock1Parent)) {
        //Left
        this.#envelopeArrowDownUpToRightLeft(
          sock1Pos,
          sock2Pos,
          sock2Parent.getAcrossYPosition() + this.#arrowIndent >
            sock1Parent.getAcrossYPosition() + this.#arrowIndent,
          sock2Parent.getAcrossYPosition() + this.#arrowIndent,
          1,
          sock2Pos[0] > sock1Parent.pos[0] - this.#arrowIndent,
          sock1Pos[0] + this.#arrowIndent,
          -1
        );
      } else {
        //Right
        const halfGapX =
          Math.abs(sock1Parent.getAcrossXPosition() - sock2Parent.pos[0]) / 2;
        const halfGapY =
          Math.abs(sock2Parent.getAcrossYPosition() - sock1Parent.pos[1]) / 2;
        this.#inBetweenArrowUpDownToRightLeft(
          sock1Pos,
          sock2Pos,
          sock2Pos[0] - this.#arrowIndent <
            sock1Parent.getAcrossXPosition() + this.#arrowIndent,
          sock1Parent.getAcrossXPosition() + this.#arrowIndent,
          -1,
          1,
          sock1Parent.getAcrossXPosition() + halfGapX,
          sock1Parent.pos[1] - halfGapY
        );
      }
    } else {
      //Lower
      if (this.#isSockPosLefterHalfOfTheNode(sock2Pos, sock1Parent)) {
        //Left
        const halfGapX =
          Math.abs(sock2Parent.getAcrossXPosition() - sock1Parent.pos[0]) / 2;
        const halfGapY = Math.abs(sock1Pos[1] - sock2Parent.pos[1]) / 2;
        this.#envelopeArrowUpDownToRightLeft(
          sock1Pos,
          sock2Pos,
          sock2Parent.pos[1] - this.#arrowIndent > sock1Pos[1],
          sock2Parent.pos[1] - this.#arrowIndent,
          1,
          -1,
          sock1Parent.pos[0] - halfGapX,
          sock1Pos[1] + halfGapY
        );
      } else {
        //Right
        this.#oneAngleArrow(sock1Pos, sock2Pos);
      }
    }
  }
  #definitionDownDown(sock1Pos, sock2Pos, sock1Parent, sock2Parent) {
    if (
      sock2Parent.getAcrossXPosition() + this.#arrowIndent < sock1Pos[0] ||
      sock2Parent.pos[0] - this.#arrowIndent > sock1Pos[0]
    ) {
      //out of node
      this.straightArrowUpUpOrDownDown(
        sock1Pos,
        sock2Pos,
        sock1Pos[1] < sock2Pos[1],
        1
      );
    } else {
      //in node
      if (sock2Pos[1] < sock1Pos[1]) {
        const halfGapY = Math.abs(sock2Pos[1] - sock1Parent.pos[1]) / 2;
        this.#envelopeCurvedArrowUpUpOrDownDown(
          sock1Pos,
          sock2Pos,
          sock1Parent,
          1,
          sock1Parent.pos[1] - halfGapY
        );
      } else {
        const halfGapY = Math.abs(sock1Pos[1] - sock2Parent.pos[1]) / 2;
        this.#envelopeCurvedArrowUpUpOrDownDown(
          sock2Pos,
          sock1Pos,
          sock2Parent,
          1,
          sock2Parent.pos[1] - halfGapY
        );
      }
    }
  }
  #definitionLeftLeft(sock1Pos, sock2Pos, sock1Parent, sock2Parent) {
    if (
      sock2Parent.getAcrossYPosition() + this.#arrowIndent < sock1Pos[1] ||
      sock2Parent.pos[1] - this.#arrowIndent > sock1Pos[1]
    ) {
      //out of node
      this.#straightArrowRightRightOrLeftLeft(
        sock1Pos,
        sock2Pos,
        sock1Pos[0] < sock2Pos[0],
        -1
      );
    } else {
      //"in" node
      if (sock1Pos[0] < sock2Pos[0]) {
        // Right
        const halfGapX =
          Math.abs(sock1Parent.getAcrossXPosition() - sock2Pos[0]) / 2;
        if (this.#isSockPosHigherHalfOfTheNode(sock2Pos, sock1Parent)) {
          //higher
          this.#envelopeArrowRightRightOrLeftLeft(
            sock1Pos,
            sock2Pos,
            sock1Parent.pos[1] - this.#arrowIndent,
            -1,
            sock1Parent.getAcrossXPosition() + halfGapX
          );
        } else {
          //lower
          this.#envelopeArrowRightRightOrLeftLeft(
            sock1Pos,
            sock2Pos,
            sock1Parent.getAcrossYPosition() + this.#arrowIndent,
            -1,
            sock1Parent.getAcrossXPosition() + halfGapX
          );
        }
      } else {
        // Left
        const halfGapX =
          Math.abs(sock2Parent.getAcrossXPosition() - sock1Pos[0]) / 2;
        if (this.#isSockPosHigherHalfOfTheNode(sock2Pos, sock1Parent)) {
          //higher
          this.#envelopeArrowRightRightOrLeftLeft(
            sock2Pos,
            sock1Pos,
            sock2Parent.pos[1] - this.#arrowIndent,
            -1,
            sock2Parent.getAcrossXPosition() + halfGapX
          );
        } else {
          //lower
          this.#envelopeArrowRightRightOrLeftLeft(
            sock2Pos,
            sock1Pos,
            sock2Parent.getAcrossYPosition() + this.#arrowIndent,
            -1,
            sock2Parent.getAcrossXPosition() + halfGapX
          );
        }
      }
    }
  }
  #isSockPosHigherHalfOfTheNode(sock2Pos, sock1Parent) {
    return (
      sock2Pos[1] <
      sock1Parent.pos[1] +
        (sock1Parent.getAcrossYPosition() - sock1Parent.pos[1]) / 2
    );
  }
  #isSockPosLefterHalfOfTheNode(sock2Pos, sock1Parent) {
    return (
      sock2Pos[0] <
      sock1Parent.pos[0] +
        (sock1Parent.getAcrossXPosition() - sock1Parent.pos[0]) / 2
    );
  }
}
