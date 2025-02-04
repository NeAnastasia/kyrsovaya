export class MovingConnection {
  static #instance;
  constructor() {
    if (MovingConnection.#instance) {
      throw new Error(
        "Use MovingConnection.getInstance() to get the singleton instance."
      );
    }
    MovingConnection.#instance = this;
    this.currentConnection = null;
  }
  static getInstance() {
    if (!MovingConnection.#instance) {
      MovingConnection.#instance = new MovingConnection();
    }
    return MovingConnection.#instance;
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
  deleteCurrentConnection() {
    this.currentConnection.removeWithouthDeletingDataInDB();
    this.currentConnection = null;
  }
}
