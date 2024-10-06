import { Node } from "./node.js";
import { View } from "./view.js";
import { Selection } from "./selection.js";
import { ContextMenu, ContextItem } from "./context.js";
import { ArrowType } from "./enum/ArrowType.js";

!(function (items) {
  for (const key in items) {
    globalThis[key] = items[key];
  }
})({
  Node: Node,
  getNode: function (id) {
    return Node.nodes[id];
  },
  view: View.singleton,
  selection: Selection.singleton,
});

$(document).ready(function (e) {
  window.contextMenu = new ContextMenu();
  view.fromJSON({
    nodes: [
      {
        id: "node-0",
        type: "class",
        pos: [504, 350],
        text: "test1",
        content1: "+ 2dx",
        content2: "+ ",
      },
      {
        id: "node-1",
        type: "rhombus",
        pos: [605.5, 90],
        text: "text",
      },
    ],
    connections: [
      {
        id: "connection-0",
        inSock: {
          type: "down",
          id: "node-1",
        },
        outSock: {
          type: "up",
          id: "node-0",
        },
        isDashed: false,
        arrowTypeEnd: ArrowType.DefaultEnd,
        arrowTypeStart: ArrowType.None,
        color: "#f91a1a",
        textStart: "1..*",
      },
    ],
  });
  window.addEventListener("viewupdate", (e) => {
    console.log("Что-то изменилось");
    const data = view.toJSON();
  });
});
