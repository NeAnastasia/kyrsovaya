import { Node } from "./node.js";
import { View } from "./view.js";
import { Selection } from "./selection.js";
import { ContextMenu, ContextItem } from "./context.js";
import { ArrowType } from "./enum/ArrowType.js";
import { Authentication } from "./auth.js";
import { renderPage } from "./navigation.js";

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
  renderPage("register");
  const auth = new Authentication();
  console.log("mew");
  // window.contextMenu = new ContextMenu();
  // view.fromJSON({
  //   nodes: [
  //     {
  //       id: "node-0",
  //       type: "class",
  //       position: { x: 504, y: 350 },
  //       text: "test1",
  //       content1: "+ 2dx",
  //       content2: "+ ",
  //     },
  //     {
  //       id: "node-1",
  //       type: "rhombus",
  //       position: { x: 605.5, y: 90 },
  //       text: "text",
  //     },
  //   ],
  //   connections: [
  //     {
  //       id: "connection-0",
  //       inSock: {
  //         type: "down",
  //         id: "node-1",
  //       },
  //       outSock: {
  //         type: "up",
  //         id: "node-0",
  //       },
  //       outPoint: null,
  //       isDashed: false,
  //       arrowTypeEnd: ArrowType.DefaultEnd,
  //       arrowTypeStart: ArrowType.None,
  //       color: "#f91a1a",
  //       textStart: "1..*",
  //     },
  //   ],
  // });
  // window.addEventListener("viewupdate", (e) => {
  //   console.log("Что-то изменилось");
  //   const data = view.toJSON();
  // });
});
