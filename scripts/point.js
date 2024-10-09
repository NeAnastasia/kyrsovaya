export class Point {
  constructor(position) {
    this.x = position[0];
    this.y = position[1];
    this.positionOnLine = 0;
  }
  countPositionOnLine(linePosStart, linePosEnd, isHorizontal) {
    if (isHorizontal) {
      this.positionOnLine = Math.abs(
        (this.x - linePosStart[0]) / (linePosEnd[0] - linePosStart[0])
      );
    } else {
      this.positionOnLine = Math.abs(
        (this.y - linePosStart[1]) / (linePosEnd[1] - linePosStart[1])
      );
    }
  }
  findNewPosition(lines) {
    let closestXOnLine = null;
    let closestYOnLine = null;

    lines.forEach((line) => {
      const x1 = $(line).attr("x1");
      const x2 = $(line).attr("x2");
      const y1 = $(line).attr("y1");
      const y2 = $(line).attr("y2");

      const lineVectorX = x2 - x1;
      const lineVectorY = y2 - y1;

      const pointVectorX = this.x - x1;
      const pointVectorY = this.y - y1;

      const lineLengthSquared =
        Math.pow(lineVectorX, 2) + Math.pow(lineVectorY, 2);

      const t =
        (pointVectorX * lineVectorX + pointVectorY * lineVectorY) /
        lineLengthSquared;

      const clampedT = Math.max(0, Math.min(1, t));

      const nearestX = x1 + clampedT * lineVectorX;
      const nearestY = y1 + clampedT * lineVectorY;

      if (
        closestXOnLine === null ||
        closestXOnLine > nearestX ||
        closestYOnLine > nearestY
      ) {
        closestXOnLine = nearestX;
        closestYOnLine = nearestY;
      }
    });

    this.x = closestXOnLine;
    this.y = closestYOnLine;
  }
}
