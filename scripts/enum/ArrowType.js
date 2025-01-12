export const ArrowType = {
  None: "none",
  DefaultEnd: "defaultEnd",
  FilledEnd: "filledEnd",
  HollowEnd: "hollowEnd",
  DefaultStart: "defaultStart",
  FilledStart: "filledStart",
  HollowStart: "hollowStart",
  RhombusHollow: "rhombusHollow",
  Rhombus: "rhombus",
};

// Словарь с SVG-строками
export const ArrowSVG = {
  [ArrowType.None]: "",
  [ArrowType.DefaultEnd]: '<polyline points="0 0, 10 3.5, 0 7" fill="none" stroke="#000"/>',
  [ArrowType.FilledEnd]: '<polygon points="0 0, 10 3.5, 0 7"/>',
  [ArrowType.HollowEnd]: '<polygon points="0 0, 10 3.5, 0 7" fill="none" stroke="#000"/>',
  [ArrowType.DefaultStart]: '<polyline points="10 0, 0 3.5, 10 7" fill="none" stroke="#000"/>',
  [ArrowType.FilledStart]: '<polygon points="10 0, 10 7, 0 3.5"/>',
  [ArrowType.HollowStart]: '<polygon points="10 0, 10 7, 0 3.5" fill="none" stroke="#000"/>',
  [ArrowType.RhombusHollow]: '<polygon points="0 3.5, 5 0, 10 3.5, 5 7" fill="none" stroke="#000"/>',
  [ArrowType.Rhombus]: '<polygon points="0 3.5, 5 0, 10 3.5, 5 7"/>',
};
