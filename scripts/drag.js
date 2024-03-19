let drag;
let dragHandle;
const lastPosition = {};

setupDraggable();

function setupDraggable(){
  dragHandle = document.querySelector('#diagramm-element');
  dragHandle.addEventListener('mousedown', dragStart);
  dragHandle.addEventListener('mouseup', dragEnd);
  dragHandle.addEventListener('mouseout', dragEnd);
}

function dragStart(event){
  drag = getDraggableAncestor(event.target);
  lastPosition.left = event.target.clientX;
  lastPosition.top = event.target.clientY;
  dragHandle.classList.add('dragging');
  dragHandle.addEventListener('mousemove', dragMove);
}

function dragMove(event){
  const dragElRect = drag.getBoundingClientRect();
  const newLeft = dragElRect.left + event.clientX - lastPosition.left;
  const newTop = dragElRect.top + event.clientY - lastPosition.top;
  drag.style.setProperty('left', `${newLeft}px`);
  drag.style.setProperty('top', `${newTop}px`);
  lastPosition.left = event.clientX;
  lastPosition.top = event.clientY;
  window.getSelection().removeAllRanges();
}

function getDraggableAncestor(element){
  if (element.getAttribute('data-draggable')) return element;
  return getDraggableAncestor(element.parentElement);
}

function dragEnd(){
  dragHandle.classList.remove('dragging');
  dragHandle.removeEventListener('mousemove',dragMove);
  drag = null;
}