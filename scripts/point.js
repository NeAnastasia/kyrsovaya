export class Point {
  constructor(x, y, connectionParent) {
    this.x = x;
    this.y = y;
    this.connectionParent = connectionParent;
  }
  findNewPositionReturnIsHorizontal() {
    let closestPoint = null;
    let minDistance = Infinity;
    let closestLine;

    $(this.connectionParent.lineEls).each((i, line) => {
      const x1 = parseFloat(line.getAttribute("x1"));
      const y1 = parseFloat(line.getAttribute("y1"));
      const x2 = parseFloat(line.getAttribute("x2"));
      const y2 = parseFloat(line.getAttribute("y2"));

      let closestX, closestY;

      if (y1 === y2) {
        closestX = this.x;
        closestY = y1;

        if (closestX < Math.min(x1, x2)) {
          closestX = Math.min(x1, x2);
        }
        if (closestX > Math.max(x1, x2)) {
          closestX = Math.max(x1, x2);
        }
      } else {
        closestX = x1;
        closestY = this.y;

        if (closestY < Math.min(y1, y2)) {
          closestY = Math.min(y1, y2);
        }
        if (closestY > Math.max(y1, y2)) {
          closestY = Math.max(y1, y2);
        }
      }

      const distance = Math.sqrt(
        Math.pow(this.x - closestX, 2) + Math.pow(this.y - closestY, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = { x: closestX, y: closestY };
        closestLine = line;
      }
    });
    this.x = closestPoint.x;
    this.y = closestPoint.y;
    return $(closestLine).attr("y1") === $(closestLine).attr("y2");
  }
}
