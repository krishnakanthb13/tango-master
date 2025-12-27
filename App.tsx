import React, { useState, useRef } from 'react';
import { Camera, RefreshCw, Play, RotateCcw, AlertCircle, CheckCircle2, Sun, Moon } from 'lucide-react';
import Grid from './components/Grid';
import { GridState, CellValue, ConstraintType } from './types';
import { createEmptyGrid, solveTango } from './services/solver';
import { parseGridFromImage } from './services/geminiService';

const App: React.FC = () => {
  const [grid, setGrid] = useState<GridState>(createEmptyGrid());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSolved, setIsSolved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Interaction Handlers
  const handleCellClick = (r: number, c: number) => {
    if (isSolved) return;
    setGrid(prev => {
      const newCells = prev.cells.map(row => [...row]);
      const current = newCells[r][c];
      const next = current === CellValue.EMPTY ? CellValue.SUN 
                 : current === CellValue.SUN ? CellValue.MOON 
                 : CellValue.EMPTY;
      newCells[r][c] = next;
      return { ...prev, cells: newCells };
    });
  };

  const handleHConstraintClick = (r: number, c: number) => {
    if (isSolved) return;
    setGrid(prev => {
      const newH = prev.hConstraints.map(row => [...row]);
      const current = newH[r][c];
      const next = current === ConstraintType.NONE ? ConstraintType.EQUAL
                 : current === ConstraintType.EQUAL ? ConstraintType.OPPOSITE
                 : ConstraintType.NONE;
      newH[r][c] = next;
      return { ...prev, hConstraints: newH };
    });
  };

  const handleVConstraintClick = (r: number, c: number) => {
    if (isSolved) return;
    setGrid(prev => {
      const newV = prev.vConstraints.map(row => [...row]);
      const current = newV[r][c];
      const next = current === ConstraintType.NONE ? ConstraintType.EQUAL
                 : current === ConstraintType.EQUAL ? ConstraintType.OPPOSITE
                 : ConstraintType.NONE;
      newV[r][c] = next;
      return { ...prev, vConstraints: newV };
    });
  };

  const handleSolve = () => {
    setIsLoading(true);
    setError(null);
    // Use setTimeout to allow UI to render loading state
    setTimeout(() => {
      try {
        const solution = solveTango(grid);
        if (solution) {
          setGrid(solution);
          setIsSolved(true);
        } else {
          setError("No solution found! Please check your constraints.");
        }
      } catch (e) {
        setError("An unexpected error occurred during solving.");
      } finally {
        setIsLoading(false);
      }
    }, 100);
  };

  const handleClear = () => {
    setGrid(createEmptyGrid());
    setIsSolved(false);
    setError(null);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!process.env.API_KEY) {
      setError("API Key missing. Cannot use Vision.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64 = reader.result as string;
      // Remove data:image/...;base64, prefix
      const base64Data = base64.split(',')[1];

      try {
        const newGrid = await parseGridFromImage(base64Data);
        setGrid(newGrid);
        setIsSolved(false);
      } catch (err) {
        setError("Failed to process image. Try cropping the screenshot to just the grid.");
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      setError("Error reading file.");
      setIsLoading(false);
    };
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-tango-bg flex flex-col items-center justify-center p-4 font-sans text-slate-200">
      <header className="mb-8 text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-tango-sun blur-lg opacity-20 rounded-full"></div>
            <Sun className="w-10 h-10 text-tango-sun relative z-10" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Tango <span className="text-tango-moon">Master</span>
          </h1>
          <div className="relative">
            <div className="absolute inset-0 bg-tango-moon blur-lg opacity-20 rounded-full"></div>
            <Moon className="w-10 h-10 text-tango-moon relative z-10" />
          </div>
        </div>
        <p className="text-slate-400 max-w-md mx-auto">
          Draw your puzzle below or upload a screenshot to solve it instantly using Gemini AI.
        </p>
      </header>

      <main className="w-full max-w-2xl flex flex-col items-center gap-8">
        {/* Actions Bar */}
        <div className="flex flex-col items-center gap-2 w-full">
          <div className="flex flex-wrap items-center justify-center gap-4 w-full">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold shadow-lg shadow-indigo-900/20 transition-all transform hover:scale-105"
            >
              {isLoading ? <RefreshCw className="animate-spin w-5 h-5" /> : <Camera className="w-5 h-5" />}
              <span>Upload Screenshot</span>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept="image/*" 
              className="hidden" 
            />
            
            <button
              onClick={handleSolve}
              disabled={isLoading || isSolved}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold shadow-lg shadow-emerald-900/20 transition-all transform hover:scale-105"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Solve Puzzle</span>
            </button>

            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold shadow-lg transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Reset</span>
            </button>
          </div>
          <p className="text-xs text-slate-500 italic">
            Tip: For best results, crop the screenshot to just the grid area.
          </p>
        </div>

        {/* Error / Status Message */}
        {error && (
          <div className="w-full bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}
        
        {isSolved && !error && (
           <div className="w-full bg-emerald-500/10 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
           <CheckCircle2 className="w-5 h-5 shrink-0" />
           <p>Puzzle Solved!</p>
         </div>
        )}

        {/* The Grid */}
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 z-20 bg-tango-bg/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl">
              <RefreshCw className="w-12 h-12 text-tango-sun animate-spin mb-4" />
              <p className="text-xl font-bold text-white animate-pulse">Analyzing...</p>
            </div>
          )}
          <Grid 
            grid={grid}
            onCellClick={handleCellClick}
            onHConstraintClick={handleHConstraintClick}
            onVConstraintClick={handleVConstraintClick}
            readOnly={isLoading}
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-tango-sun">●</span> Click cell to toggle Sun/Moon
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">|</span> Click borders to toggle Constraints (=, x)
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;