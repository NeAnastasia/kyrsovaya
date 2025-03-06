import { BaseOperationsURL } from "../../consts/baseUrl.js";
import { OperationType } from "../../enum/OperationType.js";
import { WebSocketConnection } from "../webSocket/webSocket.js";

const elementSecondPartURL =
  "/v1/diagrams/" + window.location.hash.split("/").pop() + "/element";

export const removeElementRequest = (id, element) => {
  //done
  const timestamp = Date.now();
  WebSocketConnection.getInstance().addRequest(timestamp, OperationType.RemoveElement);
  $.ajax({
    url: BaseOperationsURL + elementSecondPartURL + "/remove",
    method: "DELETE",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    data: JSON.stringify({ element_id: id }),
    success: (response) => {
      console.log("Deleting element", response);
      WebSocketConnection.getInstance().removeRequest(
        timestamp,
        OperationType.RemoveElement,
        response.operationId,
        element
      );
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.error("Removing element failed:", textStatus, errorThrown);
    },
  });
};

export const moveAnyElementRequest = (elementId, position, element) => {
  const timestamp = Date.now();
  WebSocketConnection.getInstance().addRequest(timestamp, OperationType.Move);
  $.ajax({
    url: BaseOperationsURL + "/api" + elementSecondPartURL + "/move",
    method: "PATCH",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    data: JSON.stringify({
      element_id: elementId,
      new_position: {
        x: position.x,
        y: position.y,
      },
    }),
    success: (response) => {
      console.log("Move element: ", response);
      WebSocketConnection.getInstance().removeRequest(
        timestamp,
        OperationType.Move,
        response.operationId,
        element
      );
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.error("Moving element failed:", textStatus, errorThrown);
    },
  });
};
