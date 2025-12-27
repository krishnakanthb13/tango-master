import React from 'react';
import { CellValue, ConstraintType, GridState } from '../types';
import { Sun, Moon, X, Equal } from 'lucide-react';

interface GridProps {
  grid: GridState;
  onCellClick: (r: number, c: number) => void;
  onHConstraintClick: (r: number, c: number) => void;
  onVConstraintClick: (r: number, c: number) => void;
  readOnly?: boolean;
}

const Grid: React.FC<GridProps> = ({ 
  grid, 
  onCellClick, 
  onHConstraintClick, 
  onVConstraintClick,
  readOnly = false
}) => {
  const { cells, hConstraints, vConstraints } = grid;

  const getCellContent = (val: CellValue) => {
    switch (val) {
      case CellValue.SUN:
        return <Sun className="w-8 h-8 text-tango-sun fill-tango-sun animate-in zoom-in duration-200" />;
      case CellValue.MOON:
        return <Moon className="w-8 h-8 text-tango-moon fill-tango-moon animate-in zoom-in duration-200" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col select-none p-4 bg-tango-cell rounded-xl shadow-2xl border border-tango-accent/30">
      {cells.map((row, r) => (
        <React.Fragment key={`row-${r}`}>
          {/* Cell Row */}
          <div className="flex items-center">
            {row.map((cell, c) => (
              <React.Fragment key={`cell-${r}-${c}`}>
                {/* The Cell */}
                <div 
                  onClick={() => !readOnly && onCellClick(r, c)}
                  className={`
                    w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center 
                    bg-tango-bg border border-tango-accent/50 rounded-md
                    cursor-pointer hover:bg-tango-accent/20 transition-colors
                    ${readOnly ? 'cursor-default' : ''}
                  `}
                >
                  {getCellContent(cell)}
                </div>

                {/* Horizontal Constraint (Right of cell, except last col) */}
                {c < 5 && (
                  <div 
                    onClick={() => !readOnly && onHConstraintClick(r, c)}
                    className={`
                      w-6 h-12 sm:w-8 sm:h-16 flex items-center justify-center 
                      cursor-pointer hover:opacity-100 opacity-80
                      ${readOnly ? 'cursor-default' : ''}
                    `}
                  >
                    {hConstraints[r][c] === ConstraintType.EQUAL && <Equal className="w-4 h-4 text-white font-bold" />}
                    {hConstraints[r][c] === ConstraintType.OPPOSITE && <X className="w-4 h-4 text-white/50" />}
                    {hConstraints[r][c] === ConstraintType.NONE && !readOnly && <div className="w-1 h-1 rounded-full bg-tango-accent/30 hover:bg-tango-accent" />}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Vertical Constraint Row (Below cell, except last row) */}
          {r < 5 && (
            <div className="flex items-center h-6 sm:h-8">
              {row.map((_, c) => (
                <React.Fragment key={`v-const-${r}-${c}`}>
                  {/* The Constraint Area */}
                  <div 
                    onClick={() => !readOnly && onVConstraintClick(r, c)}
                    className={`
                      w-12 sm:w-16 h-full flex items-center justify-center 
                      cursor-pointer hover:opacity-100 opacity-80
                      ${readOnly ? 'cursor-default' : ''}
                    `}
                  >
                     {vConstraints[r][c] === ConstraintType.EQUAL && <Equal className="w-4 h-4 text-white rotate-90" />}
                     {vConstraints[r][c] === ConstraintType.OPPOSITE && <X className="w-4 h-4 text-white/50" />}
                     {vConstraints[r][c] === ConstraintType.NONE && !readOnly && <div className="w-1 h-1 rounded-full bg-tango-accent/30 hover:bg-tango-accent" />}
                  </div>
                  {/* Spacer for the gap between horizontal cells */}
                  {c < 5 && <div className="w-6 sm:w-8 h-full" />}
                </React.Fragment>
              ))}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Grid;