import { BaseOperationsURL } from "../../consts/baseUrl";
import { OperationType } from "../../enum/OperationType";
import { WebSocketConnection } from "../webSocket/webSocket";

export const updateTextOfElementRequest = (node_id, field_type, text, node) => {
    const timestamp = Date.now()
    WebSocketConnection.getInstance().addRequest(
        timestamp,
        OperationType.UpdateNodeText
      );
    //done
    const id = window.location.hash.split("/").pop();
    $.ajax({
      url: BaseOperationsURL + "/api/v1/diagrams/" + id + "/node/text",
      method: "PATCH",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      data: JSON.stringify({
        node_id: node_id,
        field_type: field_type,
        text: text,
      }),
      success: (response) => {
        console.log("Update text: ", response);
        WebSocketConnection.getInstance().removeRequest(
          timestamp,
          OperationType.UpdateNodeText,
          response.operationId,
          node
        );
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.error("Updating text failed:", textStatus, errorThrown);
      },
    });
  }

export const scaleElementRequest = (node_id, width, height, node) => {
    //done
    const timestamp = Date.now()
    WebSocketConnection.getInstance().addRequest(
        timestamp,
        OperationType.Scale
      );
    const id = window.location.hash.split("/").pop();
    $.ajax({
      url: BaseOperationsURL + "/api/v1/diagrams/" + id + "/node/scale",
      method: "PATCH",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      data: JSON.stringify({
        node_id: node_id,
        new_size: {
          width: width,
          height: height,
        },
      }),
      success: (response) => {
        console.log("Scale element: ", response);
        WebSocketConnection.getInstance().removeRequest(
          timestamp,
          OperationType.Scale,
          response.operationId,
          node
        );
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.error("Updating scale failed:", textStatus, errorThrown);
      },
    });
  }
 export const addElementRequest = (json) => {
    const timestamp = Date.now()
    WebSocketConnection.getInstance().addRequest(
        timestamp,
        OperationType.AddNode
      );
    //done
    const id = window.location.hash.split("/").pop();
    $.ajax({
      url: BaseOperationsURL + "/v1/diagram/" + id + "/node/add",
      method: "POST",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      data: JSON.stringify(json),
      success: (response) => {
        console.log("Add element", response);
        WebSocketConnection.getInstance().removeRequest(timestamp, OperationType.AddNode, response.operationId, node)
        //location.reload();
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.error("Adding element failed:", textStatus, errorThrown);
      },
    });
  }