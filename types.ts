export enum CellValue {
  EMPTY = 'EMPTY',
  SUN = 'SUN',
  MOON = 'MOON',
}

export enum ConstraintType {
  NONE = 'NONE',
  EQUAL = 'EQUAL',
  OPPOSITE = 'OPPOSITE',
}

export interface GridState {
  cells: CellValue[][];
  hConstraints: ConstraintType[][]; // Horizontal constraints (between columns)
  vConstraints: ConstraintType[][]; // Vertical constraints (between rows)
}

export type GridSize = 6; // Standard Tango size is 6x6

export interface SolverResult {
  solved: boolean;
  grid?: GridState;
  error?: string;
}