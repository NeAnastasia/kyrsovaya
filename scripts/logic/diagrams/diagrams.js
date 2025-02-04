import { getAllDiagrams, postNewDiagram } from "../../api/http/diagramsApiRequests.js";

export const defineElementsForAllDiagrams = () => {
  getAllDiagrams();
  const createButton = document.getElementById("createButton");
  createButton.addEventListener("click", createDiagram);
}

export const createDiagram = () => {
  const textInput = document.getElementById("textInput");
  const errorMessage = document.getElementById("errorMessage");

  const diagramName = textInput.value.trim();

  if (diagramName === "") {
    errorMessage.innerHTML = "Введите название диаграммы";
    return;
  }

  postNewDiagram(diagramName);
}
