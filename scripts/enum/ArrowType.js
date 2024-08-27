export const ArrowType = {
  None: "",
  DefaultEnd: '<polyline points="0 0, 10 3.5, 0 7" fill="none" stroke="#000"/>',
  FilledEnd: '<polygon points="0 0, 10 3.5, 0 7"/>',
  HollowEnd: '<polygon points="0 0, 10 3.5, 0 7" fill="none" stroke="#000"/>',
  DefaultStart:
    '<polyline points="10 0, 0 3.5, 10 7" fill="none" stroke="#000"/>',
  FilledStart: '<polygon points="10 0, 10 7, 0 3.5"/>',
  HollowStart: '<polygon points="10 0, 10 7, 0 3.5" fill="none" stroke="#000"/>',
  RhombusHollow:
    '<polygon points="0 3.5, 5 0, 10 3.5, 5 7" fill="none" stroke="#000"/>',
  Rhombus: '<polygon points="0 3.5, 5 0, 10 3.5, 5 7"/>',
};
