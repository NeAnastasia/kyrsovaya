function writingInside(e) {
    e.target.contentEditable = true;
    e.target.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.target.contentEditable = false;
        }
      });
}