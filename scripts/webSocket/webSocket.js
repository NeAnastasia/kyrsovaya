import { OperationType } from "../enum/OperationType.js";

export class WebSocketConnection {
  static singleton = new WebSocketConnection();
  constructor() {
    this.sentRequests = [];
    this.queueForThisClientWithOperationId = [];
    this.entireQueue = [];
    this.webSocket = null;
  }

  connect() {
    this.webSocket = new WebSocket(
      `ws://localhost:8087/ws?diagramId=${window.location.hash
        .split("/")
        .pop()}&token=${localStorage.getItem("token")}`
    );
    this.webSocket.onopen = this.onOpen.bind(this);
    this.webSocket.onerror = this.onError.bind(this);
    this.webSocket.onclose = this.onClose.bind(this);
    this.webSocket.onmessage = this.onMessage.bind(this);
  }

  removeRequest(timestamp, operationType, operationId, object) {
    this.sentRequests = this.sentRequests.filter((request) => {
      return !(
        request.timestamp === timestamp && request.operation === operationType
      );
    });
    const foundData = this.entireQueue.find(
      (item) => item.operationId === operationId
    );
    if (foundData === -1 || foundData === undefined) {
      this.queueForThisClientWithOperationId.push({
        operationId: operationId,
        element: object,
      });
      console.log("It wasn't found");
    } else {
      console.log(this.entireQueue);
      this.completeTheOperationOfUser(foundData, object);
    }
  }

  completeTheOperationOfUser(data, object) {
    console.log("Completing Operation...");
    if (data.events[0].event_type === OperationType.AddNode) {
      object.element.id = data.events[0].payload.Node.Id;
    } else if (
      data.events[0].event_type === OperationType.AddEdgeToEdge ||
      data.events[0].event_type === OperationType.AddEdgeToNode ||
      data.events[0].event_type === OperationType.AddEdgeToSocket
    ) {
      object.element.id = data.events[0].payload.edge.Id;
    }
  }

  // AddNode: "AddNode",

  // AddEdgeToNode: "AddEdgeToNode",
  // AddEdgeToEdge: "AddEdgeToEdge",
  // AddEdgeToSocket: "AddEdgeToSocket",
  // AddEdgeToFreeSpace: "AddEdgeToFreeSpace",

  // ConnectEdgeToNode: "ConnectEdgeToNode",
  // ConnectEdgeToEdge: "ConnectEdgeToEdge",
  // ConnectEdgeToSocket: "ConnectEdgeToSocket",
  // ConnectEdgeToFreeSpace: "ConnectEdgeToFreeSpace",

  // RemoveElement: "RemoveElement",

  // ChangeColor: "ChangeColor",

  // Move: "Move",
  // Scale: "Scale",

  // UpdateArrow: "UpdateArrow",
  // ReverseEdgeArrows: "ReverseEdgeArrows",
  // UpdateEdgeStyle: "UpdateEdgeStyle",

  // UpdateEdgeText: "UpdateEdgeText",
  // UpdateNodeText: "UpdateNodeText",
  doAnotherUserAction(dataOfEvent) {
    console.log("Doing another user action...");
    switch (dataOfEvent) {
      case OperationType.AddNode:
        Node.fromJSONofAnotherUser(dataOfEvent.payload.Node)
        break;
      case OperationType.AddEdgeToNode:
        break;
      case OperationType.AddEdgeToEdge:
        break;
      case OperationType.AddEdgeToSocket:
        break;
      case OperationType.AddEdgeToFreeSpace:
        break;
      case OperationType.ConnectEdgeToNode:
        break;
      case OperationType.ConnectEdgeToEdge:
        break;
      case OperationType.ConnectEdgeToSocket:
        break;
      case OperationType.ConnectEdgeToFreeSpace:
        break;
      case OperationType.RemoveElement:
        break;
      case OperationType.ChangeColor:
        break;
      case OperationType.Move:
        break;
      case OperationType.Scale:
        break;
      case OperationType.UpdateArrow:
        break;
      case OperationType.ReverseEdgeArrows:
        break;
      case OperationType.UpdateEdgeStyle:
        break;
      case OperationType.UpdateEdgeText:
        break;
      case OperationType.UpdateNodeText:
        break;
    }
  }

  onOpen(event) {
    console.log("Соединение установлено");
  }

  onError(error) {
    console.error("Ошибка WebSocket:", error);
  }

  onMessage(event) {
    const data = JSON.parse(event.data);
    console.log("Received message:", data);
    const websocketDate = new Date(data.timestamp);
    const websocketTimeInMillis = websocketDate.getTime();

    let conditionMet = false;
    this.sentRequests.forEach((element) => {
      const timeDifference = Math.abs(
        websocketTimeInMillis - element.timestamp
      );

      if (timeDifference <= 25) {
        console.log("In entire queue");
        this.entireQueue.push(data);
        conditionMet = true;
        return;
      }
    });
    if (!conditionMet) {
      const foundData = this.queueForThisClientWithOperationId.find(
        (item) => item.operationId === data.operationId
      );
      if (foundData === -1 || foundData === undefined) {
        //do the action
      } else {
        this.completeTheOperationOfUser(data, foundData);
      }
    }
  }

  onClose(event) {
    console.log("Соединение закрыто", event.reason);
  }
}
