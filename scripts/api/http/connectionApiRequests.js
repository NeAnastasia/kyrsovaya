import { BaseOperationsURL } from "../../consts/baseUrl.js";
import { OperationType } from "../../enum/OperationType.js";
import { WebSocketConnection } from "../webSocket/webSocket.js";

const connectionDataURL =
  BaseOperationsURL +
  "/api/v1/diagrams/" +
  window.location.hash.split("/").pop();

const connectionURL =
  BaseOperationsURL +
  "/v1/diagram/" +
  window.location.hash.split("/").pop() +
  "/edge";

export const patchTextOfEdge = (field_type, edge_id, text, edge) => {
  const timestamp = Date.now();
  WebSocketConnection.getInstance().addRequest(
    timestamp,
    OperationType.UpdateEdgeText
  );
  $.ajax({
    url: connectionDataURL + "/edge/text",
    method: "PATCH",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    data: JSON.stringify({
      edge_id: edge_id,
      field_type: field_type,
      text: text,
    }),
    success: (response) => {
      console.log("Update text of edge: ", response);
      WebSocketConnection.getInstance().removeRequest(
        timestamp,
        OperationType.UpdateEdgeText,
        response.operationId,
        edge
      );
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.error("Updating text of edge:", textStatus, errorThrown);
    },
  });
};

export const patchReversingArrowHeads = (edge_id, edge) => {
  //done
  const timestamp = Date.now();
  WebSocketConnection.getInstance().addRequest(
    timestamp,
    OperationType.ReverseEdgeArrows
  );
  $.ajax({
    url: connectionDataURL + "/edge/reverse_arrows",
    method: "PATCH",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    data: JSON.stringify({
      edge_id: edge_id,
    }),
    success: (response) => {
      console.log("Reversing arrowheads: ", response);
      WebSocketConnection.getInstance().removeRequest(
        timestamp,
        OperationType.ReverseEdgeArrows,
        response.operationId,
        edge
      );
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.error("Updating reverse arrowheads:", textStatus, errorThrown);
    },
  });
};

export const patchUpdatingArrowOfEdge = (edge_id, edge_end, new_arrow_type, edge) => {
  //done
  const timestamp = Date.now();
  WebSocketConnection.getInstance().addRequest(
    timestamp,
    OperationType.UpdateArrow
  );
  $.ajax({
    url: connectionDataURL + "/edge/arrow",
    method: "PATCH",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    data: JSON.stringify({
      edge_id: edge_id,
      edge_end: edge_end,
      new_arrow_type: new_arrow_type,
    }),
    success: (response) => {
      console.log("Update arrow of edge: ", response);
      WebSocketConnection.getInstance().removeRequest(
        timestamp,
        OperationType.UpdateArrow,
        response.operationId,
        edge
      );
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.error("Updating arrow of edge:", textStatus, errorThrown);
    },
  });
};

export const patchUpdatingColorOfEdge = (element_id, color, edge) => {
  //done
  const timestamp = Date.now();
  WebSocketConnection.getInstance().addRequest(
    timestamp,
    OperationType.ChangeColor
  );
  $.ajax({
    url: connectionDataURL + "/element/color",
    method: "PATCH",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    data: JSON.stringify({
      element_id: element_id,
      color: color,
    }),
    success: (response) => {
      console.log("Update update color of edge: ", response);
      WebSocketConnection.getInstance().removeRequest(
        timestamp,
        OperationType.ChangeColor,
        response.operationId,
        edge
      );
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.error("Updating color of edge:", textStatus, errorThrown);
    },
  });
};

export const patchUpdatingLineTypeOfEdge = (edge_id, isDashed, edge) => {
  //done
  const timestamp = Date.now();
  WebSocketConnection.getInstance().addRequest(
    timestamp,
    OperationType.UpdateEdgeStyle
  );
  const line_style = isDashed ? "dashed" : "solid";
  $.ajax({
    url: connectionDataURL + "/edge/line",
    method: "PATCH",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    data: JSON.stringify({
      edge_id: edge_id,
      new_line_style: line_style,
    }),
    success: (response) => {
      console.log("Update line type of edge: ", response);
      WebSocketConnection.getInstance().removeRequest(
        timestamp,
        OperationType.UpdateEdgeStyle,
        response.operationId,
        edge
      );
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.error("Updating line type of edge:", textStatus, errorThrown);
    },
  });
};

export const addEdge = (connection, operationType) => {
  let url;
  const timestamp = Date.now();
  WebSocketConnection.getInstance().addRequest(timestamp, operationType);
  if (operationType === OperationType.AddEdgeToEdge) {
    url = connectionURL + "/add/to_edge";
  } else if (operationType === OperationType.AddEdgeToNode) {
    url = connectionURL + "/add/to_node";
  } else {
    url = connectionURL + "/add/to_socket";
  }
  $.ajax({
    url: url,
    method: "POST",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    data: JSON.stringify(connection.toJSON()),
    success: (response) => {
      console.log("Add edge to node: ", response);
      WebSocketConnection.getInstance().removeRequest(
        timestamp,
        operationType,
        response.operationId,
        connection
      );
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.error("Adding edge to node failed:", textStatus, errorThrown);
    },
  });
};

export const reconnectEdgeToNode = (
  edge_id,
  edge_end,
  target_node_id,
  target_connection_position,
  edge
) => {
  //done
  const timestamp = Date.now();
  WebSocketConnection.getInstance().addRequest(
    timestamp,
    OperationType.ConnectEdgeToNode
  );
  $.ajax({
    url: connectionURL + "/connect/to_node",
    method: "POST",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    data: JSON.stringify({
      edge_id: edge_id,
      edge_end: edge_end,
      target_node_id: target_node_id,
      target_connection_position: {
        x: target_connection_position.x,
        y: target_connection_position.y,
      },
    }),
    success: (response) => {
      console.log("Reconnect edge to node: ", response);
      WebSocketConnection.getInstance().removeRequest(
        timestamp,
        OperationType.ConnectEdgeToNode,
        response.operationId,
        edge
      );
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.error(
        "Reconnecting edge to node failed:",
        textStatus,
        errorThrown
      );
    },
  });
};

export const reconnectEdgeToEdge = (
  edge_id,
  edge_end,
  target_edge_id,
  position,
  edge
) => {
  const timestamp = Date.now();
  WebSocketConnection.getInstance().addRequest(
    timestamp,
    OperationType.ConnectEdgeToEdge
  );
  $.ajax({
    url: connectionURL + "/connect/to_edge",
    method: "POST",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    data: JSON.stringify({
      edge_id: edge_id,
      edge_end: edge_end,
      target_edge_id: target_edge_id,
      position: {
        x: position.x,
        y: position.y,
      },
    }),
    success: (response) => {
      console.log("reconnectEdgeToEdge: ", response);
      WebSocketConnection.getInstance().removeRequest(
        timestamp,
        OperationType.ConnectEdgeToEdge,
        response.operationId,
        edge
      );
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.error(
        "Reconnecting edge to edge failed:",
        textStatus,
        errorThrown
      );
    },
  });
};

export const reconnectEdgeToSocket = (
  edge_id,
  edge_end,
  target_free_socket_id,
  edge
) => {
  const timestamp = Date.now();
  WebSocketConnection.getInstance().addRequest(
    timestamp,
    OperationType.ConnectEdgeToSocket
  );
  $.ajax({
    url: connectionURL + "/connect/to_socket",
    method: "POST",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    data: JSON.stringify({
      edge_id: edge_id,
      edge_end: edge_end,
      target_free_socket_id: target_free_socket_id,
    }),
    success: (response) => {
      console.log("reconnectEdgeToSocket: ", response);
      WebSocketConnection.getInstance().removeRequest(
        timestamp,
        OperationType.ConnectEdgeToSocket,
        response.operationId,
        edge
      );
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.error("reconnectEdgeToSocket failed:", textStatus, errorThrown);
    },
  });
};
