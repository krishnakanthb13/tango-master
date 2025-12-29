import React, { useState, useRef } from 'react';
import { Camera, RefreshCw, Play, RotateCcw, AlertCircle, CheckCircle2, Sun, Moon, History as HistoryIcon } from 'lucide-react';
import Grid from './components/Grid';
import HistoryModal from './components/HistoryModal';

import { GridState, CellValue, ConstraintType, HistoryItem } from './types';
import { createEmptyGrid, solveTango } from './services/solver';
import { parseGridFromImage } from './services/geminiService';

const App: React.FC = () => {
  const [grid, setGrid] = useState<GridState>(createEmptyGrid());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSolved, setIsSolved] = useState(false);
  const [solveDuration, setSolveDuration] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('tango_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [showHistory, setShowHistory] = useState(false);
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
    setSolveDuration(null);

    // Use setTimeout to allow UI to render loading state
    setTimeout(() => {
      // Start timer here to exclude the 100ms delay
      const startTime = performance.now();
      try {
        const solution = solveTango(grid);
        const endTime = performance.now();
        const duration = endTime - startTime;

        if (solution) {
          setGrid(solution);
          setIsSolved(true);
          setSolveDuration(duration);

          // Save to history
          const historyItem: HistoryItem = {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            duration: duration,
            grid: solution
          };
          const newHistory = [historyItem, ...history].slice(0, 50); // Keep last 50
          setHistory(newHistory);
          localStorage.setItem('tango_history', JSON.stringify(newHistory));
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
    if (window.confirm("Are you sure you want to reset the grid? All current progress will be lost.")) {
      setGrid(createEmptyGrid());
      setIsSolved(false);
      setError(null);
      setSolveDuration(null);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your solve history?")) {
      setHistory([]);
      localStorage.removeItem('tango_history');
    }
  };

  const loadHistoryItem = (item: HistoryItem) => {
    if (window.confirm("Loading this board will replace your current grid. Are you sure?")) {
      setGrid(item.grid);
      setIsSolved(true);
      setSolveDuration(item.duration);
      setError(null);
      setShowHistory(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };



  const formatDuration = (ms: number) => {
    if (ms < 1) {
      const micros = Math.round(ms * 1000);
      return `${ms.toFixed(3)} ms (${micros} microseconds)`;
    }
    return `${ms.toFixed(3)} ms`;
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
    <div className="min-h-screen bg-tango-bg flex flex-col items-center justify-center py-6 px-4 sm:px-6 md:px-8 font-sans text-slate-200">
      <header className="mb-4 text-center space-y-1">
        <div className="flex items-center justify-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 bg-tango-sun blur-lg opacity-20 rounded-full"></div>
            <Sun className="w-8 h-8 text-tango-sun relative z-10" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Tango <span className="text-tango-moon">Master</span>
          </h1>
          <div className="relative">
            <div className="absolute inset-0 bg-tango-moon blur-lg opacity-20 rounded-full"></div>
            <Moon className="w-8 h-8 text-tango-moon relative z-10" />
          </div>
          <button
            onClick={() => setShowHistory(true)}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800/50 rounded-full transition-all"
            title="View History"
          >
            <HistoryIcon className="w-6 h-6" />
          </button>
        </div>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Draw your puzzle below or upload a screenshot to solve it instantly using Gemini AI.
        </p>

      </header>

      <main className="w-full max-w-2xl flex flex-col items-center gap-6">
        {/* Actions Bar */}
        <div className="flex flex-col items-center gap-2 w-full">
          <div className="flex flex-wrap items-center justify-center gap-3 w-full">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold shadow-lg shadow-indigo-900/20 transition-all transform hover:scale-105 text-sm"
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
              className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold shadow-lg shadow-emerald-900/20 transition-all transform hover:scale-105 text-sm"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Solve Puzzle</span>
            </button>


            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-5 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold shadow-lg transition-all text-sm"
            >
              <RotateCcw className="w-4 h-4" />
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

        {isSolved && !error && solveDuration !== null && (
          <div className="w-full bg-emerald-500/10 border border-emerald-500/50 text-emerald-200 px-4 py-2 rounded-lg flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2 text-sm">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <p>
              <span className="font-semibold">Solved</span> in {formatDuration(solveDuration)}
            </p>
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

      <HistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        history={history}
        onLoadItem={loadHistoryItem}
        onClearHistory={handleClearHistory}
        formatDuration={formatDuration}
      />
    </div>


  );
};

export default App;