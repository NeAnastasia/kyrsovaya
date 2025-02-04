import { BaseStorageURL } from "../../consts/baseUrl.js";
import { renderPage } from "../../rendering/router.js";
import { View } from "../../elements/view.js";
import { WebSocketConnection } from "../webSocket/webSocket.js";

export const getAllDiagrams = () => {
  const infoContainer = document.getElementById("Diagrams");
  const errorMessage = document.getElementById("errorMessage");
  return $.ajax({
    url: BaseStorageURL + "/diagrams",
    type: "GET",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    success: (response) => {
      if (response.length === 0) {
        infoContainer.innerHTML = `<div class="no-diagrams-container">
          Диаграмм не найдено, создайте новую
          </div>`;
      } else {
        const diagramItems = response
          .map(
            (item) => `
            <div class="diagram-info-container">
              <div class="diagram-info-title">${item.name}</div>
              <button class="diagram-enter-button diagram-info-button" data-id="${item.id}">
                <i class="fas fa-sign-in-alt"></i>
              </button>
              <button class="diagram-info-button" data-id="${item.id}">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
        `
          )
          .join("");
        infoContainer.innerHTML = diagramItems;

        $(".diagram-enter-button").each((index, element) => {
          const button = $(element);
          button.on("click", () => {
            const id = button.data("id");
            if (id !== undefined) {
              window.location.hash = "#diagram/" + id;
            } else {
              console.error("ID is undefined");
            }
          });
        });
      }
    },
    error: (jqXHR, textStatus, errorThrown) => {
      errorMessage.innerHTML =
        "Не удалось загрузить диаграммы, попробуйте снова";
      console.error("Get all diagrams failed:", textStatus, errorThrown);
    },
  });
};

export const postNewDiagram = (diagramName) => {
  const errorMessage = document.getElementById("errorMessage");
  return $.ajax({
    url: BaseStorageURL + "/diagrams",
    type: "POST",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    data: JSON.stringify({
      diagramName: diagramName,
    }),
    success: (response, textStatus, jqXHR) => {
      if (jqXHR.status === 200) {
        getAllDiagrams();
      }
    },
    error: (jqXHR, textStatus, errorThrown) => {
      errorMessage.innerHTML = "Не удалось создать диаграмму";
      console.error("Post diagram failed:", textStatus, errorThrown);
    },
  });
};

export const getDiagram = (id, isAtStart = false) => {
  return $.ajax({
    url: BaseStorageURL + "/diagrams/" + id,
    type: "GET",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    success: (response) => {
      console.log("Get diagram: ", response);
      View.getInstance().JSONInfo = response;
      if (isAtStart) {
        renderPage(true);
      } else {
        View.getInstance().fromJSON();
      }
      WebSocketConnection.getInstance().connect();
    },
    error: (jqXHR, textStatus, errorThrown) => {
      errorMessage.innerHTML = "Не удалось получить диаграмму";
      console.error("Get diagram failed:", textStatus, errorThrown);
    },
  });
};
