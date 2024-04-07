// const svg = document.getElementById('svg');
// let startX, startY, elementX, elementY, element;

// svg.addEventListener('mousedown', e => {
//     const className = e.target.getAttributeNS(null, 'class');
//     if (className.indexOf('draggable') >= 0) {
//         startX = e.offsetX;
//         startY = e.offsetY;
//         element = e.target;
//         elementX = +element.getAttributeNS(null, 'x');
//         elementY = +element.getAttributeNS(null, 'y');
//         svg.addEventListener('mousemove', onMouseMove);
//     }
//  });
//  onMouseMove = e => {
//     let x = e.offsetX;
//     let y = e.offsetY;
//     element.setAttributeNS(null, 'x', elementX + x - startX);
//     element.setAttributeNS(null, 'y', elementY + y - startY);
//  };
//  svg.addEventListener('mouseup', e => {
//     svg.removeEventListener('mousemove', onMouseMove);
//  });

function makeDraggable(evt) {
  var selectedElement, offset, transform;
  var svg = evt.target;
  svg.addEventListener("mousedown", startDrag);
  svg.addEventListener("mousemove", drag);
  svg.addEventListener("mouseup", endDrag);
  svg.addEventListener("mouseleave", endDrag);

  function getMousePosition(evt) {
    var CTM = svg.getScreenCTM();
    return {
      x: (evt.clientX - CTM.e) / CTM.a,
      y: (evt.clientY - CTM.f) / CTM.d,
    };
  }

  function startDrag(evt) {
    if (evt.target.classList.contains("draggable")) {
      selectedElement = evt.target;
      offset = getMousePosition(evt);
      // Get all the transforms currently on this element
      var transforms = selectedElement.transform.baseVal;
      // Ensure the first transform is a translate transform
      if (
        transforms.length === 0 ||
        transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE
      ) {
        // Create an transform that translates by (0, 0)
        var translate = svg.createSVGTransform();
        translate.setTranslate(0, 0);
        // Add the translation to the front of the transforms list
        selectedElement.transform.baseVal.insertItemBefore(translate, 0);
      }
      // Get initial translation amount
      transform = transforms.getItem(0);
      offset.x -= transform.matrix.e;
      offset.y -= transform.matrix.f;
    }
  }

  function drag(evt) {
    if (selectedElement) {
      evt.preventDefault();
      var coord = getMousePosition(evt);
      transform.setTranslate(coord.x - offset.x, coord.y - offset.y);
    }
  }

  function endDrag(evt) {
    selectedElement = null;
  }
}
