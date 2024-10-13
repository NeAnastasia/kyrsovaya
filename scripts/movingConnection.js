import { View } from "./view.js";

export class MovingConnection {
  static singleton = new MovingConnection();
  constructor() {
    this.currentConnection = null;
  }
  checkIfConnectionIsConnectingToItself(targetLine) {
    return (
      this.currentConnection.lineEls.filter(function () {
        return (
          $(this).attr("x1") === $(targetLine).attr("x1") &&
          $(this).attr("x2") === $(targetLine).attr("x2") &&
          $(this).attr("y1") === $(targetLine).attr("y1") &&
          $(this).attr("y2") === $(targetLine).attr("y2")
        );
      }).length > 0
    );
  }
}
