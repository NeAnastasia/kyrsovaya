import { BaseOperationsURL } from "../../consts/baseUrl";
import { OperationType } from "../../enum/OperationType";
import { WebSocketConnection } from "../webSocket/webSocket";

export const addSocketRequest = (position, isReconnection = false, socket) => {
    const timestamp = Date.now();
    WebSocketConnection.getInstance().addRequest(
        timestamp,
        OperationType.AddSocket
      );
    //done
    const diagramId = window.location.hash.split("/").pop();
    $.ajax({
      url: BaseOperationsURL + "/v1/diagram/" + diagramId + "/socket/add",
      method: "POST",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      data: JSON.stringify({
        position: {
          x: position.x,
          y: position.y,
        },
      }),
      success: (response) => {
        console.log("Add socket", response);
        WebSocketConnection.getInstance().removeRequest(
          timestamp,
          OperationType.AddSocket,
          response.operationId,
          socket,
          isReconnection
        );
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.error("Adding socket failed:", textStatus, errorThrown);
        return false;
      },
    });
  }