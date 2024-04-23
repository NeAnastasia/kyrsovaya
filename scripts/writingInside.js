function writingInside(id) {
    var element = document.getElementById(id);
    console.log(element, id);
    element.contentEditable = true;
    element.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            element.contentEditable = false;
        }
      });
}