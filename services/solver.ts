import { CellValue, ConstraintType, GridState, GridSize } from '../types';

const SIZE: GridSize = 6;

// Helper to clone state
const cloneGrid = (grid: GridState): GridState => ({
  cells: grid.cells.map(row => [...row]),
  hConstraints: grid.hConstraints.map(row => [...row]),
  vConstraints: grid.vConstraints.map(row => [...row]),
});

// Check if placing a value at (r, c) is valid according to Tango rules
const isValid = (grid: GridState, r: number, c: number, value: CellValue): boolean => {
  const { cells, hConstraints, vConstraints } = grid;

  // 1. No more than 2 of same type next to each other
  // Horizontal check
  if (c >= 2) {
    if (cells[r][c - 1] === value && cells[r][c - 2] === value) return false;
  }
  if (c < SIZE - 2) {
    if (cells[r][c + 1] === value && cells[r][c + 2] === value) return false;
  }
  if (c >= 1 && c < SIZE - 1) {
    if (cells[r][c - 1] === value && cells[r][c + 1] === value) return false;
  }

  // Vertical check
  if (r >= 2) {
    if (cells[r - 1][c] === value && cells[r - 2][c] === value) return false;
  }
  if (r < SIZE - 2) {
    if (cells[r + 1][c] === value && cells[r + 2][c] === value) return false;
  }
  if (r >= 1 && r < SIZE - 1) {
    if (cells[r - 1][c] === value && cells[r + 1][c] === value) return false;
  }

  // 2. Constraints check
  // Horizontal Constraint (Left)
  if (c > 0) {
    const constraint = hConstraints[r][c - 1];
    const leftVal = cells[r][c - 1];
    if (leftVal !== CellValue.EMPTY) {
      if (constraint === ConstraintType.EQUAL && leftVal !== value) return false;
      if (constraint === ConstraintType.OPPOSITE && leftVal === value) return false;
    }
  }
  // Horizontal Constraint (Right) - usually checked when filling right neighbor, but good for lookahead if implementing forward checking
  // Vertical Constraint (Top)
  if (r > 0) {
    const constraint = vConstraints[r - 1][c];
    const topVal = cells[r - 1][c];
    if (topVal !== CellValue.EMPTY) {
      if (constraint === ConstraintType.EQUAL && topVal !== value) return false;
      if (constraint === ConstraintType.OPPOSITE && topVal === value) return false;
    }
  }

  // 3. Row/Col Balance (Max 3 of each type in 6x6)
  let rowSun = 0, rowMoon = 0;
  for (let i = 0; i < SIZE; i++) {
    const cell = (i === c) ? value : cells[r][i];
    if (cell === CellValue.SUN) rowSun++;
    if (cell === CellValue.MOON) rowMoon++;
  }
  if (rowSun > SIZE / 2 || rowMoon > SIZE / 2) return false;

  let colSun = 0, colMoon = 0;
  for (let i = 0; i < SIZE; i++) {
    const cell = (i === r) ? value : cells[i][c];
    if (cell === CellValue.SUN) colSun++;
    if (cell === CellValue.MOON) colMoon++;
  }
  if (colSun > SIZE / 2 || colMoon > SIZE / 2) return false;

  return true;
};

const solveRecursive = (grid: GridState, idx: number): boolean => {
  if (idx === SIZE * SIZE) {
    return true; // Solved
  }

  const r = Math.floor(idx / SIZE);
  const c = idx % SIZE;

  // If cell is already filled, move to next
  if (grid.cells[r][c] !== CellValue.EMPTY) {
    // Validate existing cell just in case the initial state was bad
    if (!isValid(grid, r, c, grid.cells[r][c])) return false;
    return solveRecursive(grid, idx + 1);
  }

  // Try SUN
  if (isValid(grid, r, c, CellValue.SUN)) {
    grid.cells[r][c] = CellValue.SUN;
    if (solveRecursive(grid, idx + 1)) return true;
    grid.cells[r][c] = CellValue.EMPTY; // Backtrack
  }

  // Try MOON
  if (isValid(grid, r, c, CellValue.MOON)) {
    grid.cells[r][c] = CellValue.MOON;
    if (solveRecursive(grid, idx + 1)) return true;
    grid.cells[r][c] = CellValue.EMPTY; // Backtrack
  }

  return false;
};

export const solveTango = (initialGrid: GridState): GridState | null => {
  const workingGrid = cloneGrid(initialGrid);
  const success = solveRecursive(workingGrid, 0);
  return success ? workingGrid : null;
};

export const createEmptyGrid = (): GridState => ({
  cells: Array(6).fill(null).map(() => Array(6).fill(CellValue.EMPTY)),
  hConstraints: Array(6).fill(null).map(() => Array(5).fill(ConstraintType.NONE)),
  vConstraints: Array(5).fill(null).map(() => Array(6).fill(ConstraintType.NONE)),
});