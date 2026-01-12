import { CellValue, ConstraintType, GridState, Difficulty, GridSize } from '../types';
import { isValid, createEmptyGrid } from './solver';

const SIZE: GridSize = 6;

// Helper to clone state (duplicated to avoid circular dep or excessive exports)
const cloneGrid = (grid: GridState): GridState => ({
    cells: grid.cells.map(row => [...row]),
    hConstraints: grid.hConstraints.map(row => [...row]),
    vConstraints: grid.vConstraints.map(row => [...row]),
});

const shuffle = <T>(array: T[]): T[] => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}

const generateSolutionRecursive = (grid: GridState, idx: number): boolean => {
    if (idx === SIZE * SIZE) {
        return true; // Solved
    }

    const r = Math.floor(idx / SIZE);
    const c = idx % SIZE;

    // Randomize SUN/MOON order
    const candidates = shuffle([CellValue.SUN, CellValue.MOON]);

    for (const val of candidates) {
        if (isValid(grid, r, c, val)) {
            grid.cells[r][c] = val;
            if (generateSolutionRecursive(grid, idx + 1)) return true;
            grid.cells[r][c] = CellValue.EMPTY; // Backtrack
        }
    }

    return false;
};

export const generateBoard = (difficulty: Difficulty): GridState => {
    // 1. Generate full grid
    let fullGrid = createEmptyGrid();
    // Keep trying until we find a valid full grid (should be fast)
    while (!generateSolutionRecursive(fullGrid, 0)) {
        fullGrid = createEmptyGrid();
    }

    // 2. Config based on Difficulty
    const puzzle = cloneGrid(fullGrid);

    let cellKeepProb = 0.5;
    let constraintProb = 0.2;

    switch (difficulty) {
        case 'Easy':
            cellKeepProb = 0.55;
            constraintProb = 0.40;
            break;
        case 'Medium':
            cellKeepProb = 0.40;
            constraintProb = 0.30;
            break;
        case 'Hard':
            cellKeepProb = 0.25;
            constraintProb = 0.20;
            break;
    }

    // 3. Remove cells
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            if (Math.random() > cellKeepProb) {
                puzzle.cells[r][c] = CellValue.EMPTY;
            }
        }
    }

    // 4. Add Constraints (derived from fullGrid)
    // Horizontal
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE - 1; c++) {
            if (Math.random() < constraintProb) {
                const left = fullGrid.cells[r][c];
                const right = fullGrid.cells[r][c + 1];
                if (left === right) puzzle.hConstraints[r][c] = ConstraintType.EQUAL;
                else puzzle.hConstraints[r][c] = ConstraintType.OPPOSITE;
            } else {
                puzzle.hConstraints[r][c] = ConstraintType.NONE;
            }
        }
    }
    // Vertical
    for (let r = 0; r < SIZE - 1; r++) {
        for (let c = 0; c < SIZE; c++) {
            if (Math.random() < constraintProb) {
                const top = fullGrid.cells[r][c];
                const bottom = fullGrid.cells[r + 1][c];
                if (top === bottom) puzzle.vConstraints[r][c] = ConstraintType.EQUAL;
                else puzzle.vConstraints[r][c] = ConstraintType.OPPOSITE;
            } else {
                puzzle.vConstraints[r][c] = ConstraintType.NONE;
            }
        }
    }

    // Ensure all constraints in the puzzle are actually valid for the puzzle's own cells 
    // (They are valid for the solution, so they are valid for the puzzle)

    return puzzle;
}
