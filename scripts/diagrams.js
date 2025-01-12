import { BaseStorageURL } from "./consts/baseUrl.js";
import { renderPage } from "./router.js";
import { View } from "./view.js";

export class Diagrams {
  static singleton = new Diagrams();

  defineElements() {
    this.getAllDiagrams();
    const createButton = document.getElementById("createButton");
    createButton.addEventListener("click", () => {
      this.createDiagram();
    });
    this.infoContainer = document.getElementById("Diagrams");
  }

  createDiagram() {
    const textInput = document.getElementById("textInput");
    const accessOptions = document.querySelectorAll('input[name="access"]');
    const errorMessage = document.getElementById("errorMessage");

    const diagramName = textInput.value.trim();
    let accessLvl = "";
    accessOptions.forEach((option) => {
      if (option.checked) {
        accessLvl = option.value;
      }
    });

    if (diagramName === "") {
      errorMessage.innerHTML = "Введите название диаграммы";
      return;
    }

    this.postNewDiagram(diagramName, accessLvl);
  }

  getAllDiagrams() {
    $.ajax({
      url: BaseStorageURL + "/diagrams",
      type: "GET",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      success: (response) => {
        if (response.length === 0) {
          this.infoContainer.innerHTML = `<div class="no-diagrams-container">
          Диаграмм не найдено, создайте новую
          </div>`;
        } else {
          console.log(response);
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
          this.infoContainer.innerHTML = diagramItems;

          $(".diagram-enter-button").each((index, element) => {
            const button = $(element);
            button.on("click", () => {
              const id = button.data("id"); 
              if (id !== undefined) {
                this.getDiagram(id);
              } else {
                console.error("ID is undefined");
              }
            });
          });
        }
      },
      error: (jqXHR, textStatus, errorThrown) => {
        this.errorMessage.innerHTML =
          "Не удалось загрузить диаграммы, попробуйте снова";
        console.error("Get all diagrams failed:", textStatus, errorThrown);
      },
    });
  }

  postNewDiagram(diagramName, accessLvl) {
    $.ajax({
      url: BaseStorageURL + "/diagrams",
      type: "POST",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      data: JSON.stringify({
        diagramName: diagramName,
        AccessLevel: accessLvl,
      }),
      success: (response, textStatus, jqXHR) => {
        if (jqXHR.status === 200) {
          this.getAllDiagrams();
        }
      },
      error: (jqXHR, textStatus, errorThrown) => {
        this.errorMessage.innerHTML = "Не удалось создать диаграмму";
        console.error("Post diagram failed:", textStatus, errorThrown);
      },
    });
  }

  getDiagram(id, isAtStart = false) {
    $.ajax({
      url: BaseStorageURL + "/diagrams/" + id,
      type: "GET",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      success: (response) => {
        window.location.hash = "#diagram/" + id;
        View.singleton.JSONInfo = response;
        if(isAtStart) {
          renderPage(true);
        }
        console.log("Get diagram: ", response);
      },
      error: (jqXHR, textStatus, errorThrown) => {
        this.errorMessage.innerHTML = "Не удалось получить диаграмму";
        console.error("Get diagram failed:", textStatus, errorThrown);
      },
    });
  }
}
