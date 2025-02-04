import { Connection } from "../../elements/connection.js";
import { Connector } from "../../logic/connection/connector.js";
import { EdgeEndType } from "../../enum/EdgeEndType.js";
import { EdgeFieldType } from "../../enum/EdgeFieldType.js";
import { NodeFieldType } from "../../enum/NodeFieldType.js";
import { OperationType } from "../../enum/OperationType.js";
import { Point } from "../../utils/point.js";
import { FreeSocket } from "../../elements/socket.js";
import { View } from "../../elements/view.js";

export class WebSocketConnection {
  static #instance;
  constructor() {
    if (WebSocketConnection.#instance) {
      throw new Error(
        "Use WebSocketConnection.getInstance() to get the singleton instance."
      );
    }
    WebSocketConnection.#instance = this;
    this.sentRequests = [];
    this.queueForThisClientWithOperationId = [];
    this.entireQueue = [];
    this.webSocket = null;
  }

  static getInstance() {
    if (!WebSocketConnection.#instance) {
      WebSocketConnection.#instance = new WebSocketConnection();
    }
    return WebSocketConnection.#instance;
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

  addRequest(timestamp, operationType) {
    this.sentRequests.push({
      timestamp: timestamp,
      operation: operationType,
    });
  }

  removeRequest(
    timestamp,
    operationType,
    operationId,
    object,
    isReconnection = false
  ) {
    this.sentRequests = this.sentRequests.filter((request) => {
      return !(
        request.timestamp === timestamp && request.operation === operationType
      );
    });
    const foundData = this.entireQueue.find(
      (item) => item.operationId === operationId
    );
    object.isReconnection = isReconnection;
    if (foundData === -1 || foundData === undefined) {
      this.queueForThisClientWithOperationId.push({
        operationId: operationId,
        element: object,
      });
      console.log("It wasn't found");
    } else {
      this.completeTheOperationOfUser(foundData.events[0], object);
    }
  }

  completeTheOperationOfUser(eventData, object) {
    console.log("Completing Operation...");
    if (eventData.event_type === OperationType.AddNode) {
      object.id = eventData.payload.Node.Id;
    } else if (eventData.event_type === OperationType.AddSocket) {
      object.id = eventData.payload.Socket.Id;
      if (object.isReconnection) {
        Connector.getInstance().reconnectFromThisUser(object);
      } else {
        Connector.getInstance().connectSocketsAsThisUser(object);
      }
    } else if (
      eventData.event_type === OperationType.AddEdgeToEdge ||
      eventData.event_type === OperationType.AddEdgeToNode ||
      eventData.event_type === OperationType.AddEdgeToSocket
    ) {
      object.setId(eventData.payload.edge.Id);
    }
  }

  doAnotherUserAction(dataOfEvent) {
    console.log("Doing another user action...");
    switch (dataOfEvent.event_type) {
      case OperationType.AddNode:
        Node.fromJSONofAnotherUser(dataOfEvent.payload.Node);
        break;
      case OperationType.AddSocket:
        FreeSocket.fromJSONofAnotherUser(dataOfEvent.payload.Socket);
        break;
      case OperationType.AddEdgeToNode:
        Connection.fromJSONofAnotherUser(
          dataOfEvent.payload.edge,
          dataOfEvent.event_type
        );
        break;
      case OperationType.AddEdgeToEdge:
        Connection.fromJSONofAnotherUser(
          dataOfEvent.payload.edge,
          dataOfEvent.event_type
        );
        break;
      case OperationType.AddEdgeToSocket:
        Connection.fromJSONofAnotherUser(
          dataOfEvent.payload.edge,
          dataOfEvent.event_type
        );
        break;
      case OperationType.AddSocket:
        FreeSocket.fromJSONofAnotherUser(dataOfEvent.payload.Socket);
        break;
      case OperationType.ConnectEdgeToNode:
        Connector.getInstance().reconnectFromAnotherUser(
          dataOfEvent.payload,
          dataOfEvent.event_type
        );
        break;
      case OperationType.ConnectEdgeToEdge:
        Connector.getInstance().reconnectFromAnotherUser(
          dataOfEvent.payload,
          dataOfEvent.event_type
        );
        break;
      case OperationType.ConnectEdgeToSocket:
        Connector.getInstance().reconnectFromAnotherUser(
          dataOfEvent.payload,
          dataOfEvent.event_type
        );
        break;
      case OperationType.ConnectEdgeToFreeSpace:
        console.log(
          "Это не должно было вызваться, как вы сюда попали? На будущее."
        );
        break;
      case OperationType.RemoveElement:
        View.getInstance().removeElementById(dataOfEvent.payload.elementId);
        break;
      case OperationType.ChangeColor:
        const coloredEdge = View.getInstance().getConnectionById(
          dataOfEvent.payload.elementId
        );
        coloredEdge.changeColor(dataOfEvent.payload.color);
        break;
      case OperationType.Move:
        const movingNode = View.getInstance().getNodeById(
          dataOfEvent.payload.elementId
        );
        if (movingNode === null) {
          const movingSocket = View.getInstance().getFreeSocketById(
            dataOfEvent.payload.elementId
          );
          movingSocket.changePosition(
            new Point(
              dataOfEvent.payload.newPosition.x,
              dataOfEvent.payload.newPosition.y
            )
          );
        } else {
          movingNode.position = new Point(
            dataOfEvent.payload.newPosition.x,
            dataOfEvent.payload.newPosition.y
          );
          movingNode.update();
        }

        break;
      case OperationType.Scale:
        const scaledNode = View.getInstance().getNodeById(
          dataOfEvent.payload.elementId
        );
        scaledNode.scaleNode(
          dataOfEvent.payload.size.width,
          dataOfEvent.payload.size.height
        );
        scaledNode.update();
        break;
      case OperationType.UpdateArrow:
        const updatedArrowEdge = View.getInstance().getConnectionById(
          dataOfEvent.payload.edgeId
        );
        if (dataOfEvent.payload.edgeEndType === EdgeEndType.Target) {
          updatedArrowEdge.changeArrowHeadEndType(
            dataOfEvent.payload.arrowType
          );
        } else {
          updatedArrowEdge.changeArrowHeadStartType(
            dataOfEvent.payload.arrowType
          );
        }
        break;
      case OperationType.ReverseEdgeArrows:
        const reversedArrowsEdge = View.getInstance().getConnectionById(
          dataOfEvent.payload.edgeId
        );
        reversedArrowsEdge.reverseArrowHeads();
        break;
      case OperationType.UpdateEdgeStyle:
        const updatedStyleEdge = View.getInstance().getConnectionById(
          dataOfEvent.payload.edgeId
        );
        updatedStyleEdge.updateLineBasedOnLineType(
          dataOfEvent.payload.lineStyle
        );
        break;
      case OperationType.UpdateEdgeText:
        const updatedTextEdge = View.getInstance().getConnectionById(
          dataOfEvent.payload.edgeId
        );
        switch (dataOfEvent.payload.edgeFieldType) {
          case EdgeFieldType.Start:
            updatedTextEdge.spanIn.textContent = dataOfEvent.payload.text;
            break;
          case EdgeFieldType.Center:
            updatedTextEdge.spanCenter.textContent = dataOfEvent.payload.text;
            break;
          case EdgeFieldType.End:
            updatedTextEdge.spanOut.textContent = dataOfEvent.payload.text;
            break;
        }
        break;
      case OperationType.UpdateNodeText:
        const updatedNode = View.getInstance().getNodeById(
          dataOfEvent.payload.nodeId
        );
        if (dataOfEvent.payload.nodeFieldType === NodeFieldType.Label) {
          updatedNode.name = dataOfEvent.payload.text;
        } else if (
          dataOfEvent.payload.nodeFieldType === NodeFieldType.Content1
        ) {
          updatedNode.textContent1 = dataOfEvent.payload.text;
        } else if (
          dataOfEvent.payload.nodeFieldType === NodeFieldType.Content21
        ) {
          updatedNode.textContent2 = dataOfEvent.payload.text;
        }
        updatedNode.update();

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
        data.events.forEach((event) => {
          this.doAnotherUserAction(event);
        });
      } else {
        data.events.forEach((event) => {
          this.completeTheOperationOfUser(event, foundData.element);
        });
      }
    }
  }

  onClose(event) {
    console.log("Соединение закрыто", event.reason);
  }
}
