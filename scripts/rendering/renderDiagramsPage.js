export function renderDiagramsPage() {
  return `<div id="Diagrams" class="diagrams-container">
    </div>
    <div id="errorMessage" class="error"></div>
      <div class="new-diagrams-container">
        <input type="text" id="textInput" placeholder="Введите название" class="text-input">
        <button id="createButton" class="create-button">Создать</button>
    </div>`;
}
