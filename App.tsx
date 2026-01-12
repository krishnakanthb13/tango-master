import React, { useState, useRef } from 'react';
import { Camera, RefreshCw, Play, RotateCcw, AlertCircle, CheckCircle, Sun, Moon, History as HistoryIcon, Trophy, Sparkles, Loader2, Wand2, HelpCircle, Upload, Info } from 'lucide-react';
import Grid from './components/Grid';
import HistoryModal from './components/HistoryModal';
import GeneratorModal from './components/GeneratorModal';

import { GridState, CellValue, ConstraintType, HistoryItem, Difficulty } from './types';
import { createEmptyGrid, solveTango } from './services/solver';
import { parseGridFromImage } from './services/geminiService';
import { generateBoard } from './services/generator';

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
  const [showGenerator, setShowGenerator] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isBoardSolvable, setIsBoardSolvable] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toggle Dark Mode class on document
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Dynamic Solvability Check
  React.useEffect(() => {
    // Basic solver is fast enough for 6x6 on every change
    const solution = solveTango(grid);
    setIsBoardSolvable(!!solution);
  }, [grid]);



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

  const handleHint = () => {
    setIsLoading(true);
    setTimeout(() => {
      try {
        const solution = solveTango(grid);
        if (solution) {
          // Find first difference/empty and fill it
          for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 6; c++) {
              if (grid.cells[r][c] === CellValue.EMPTY) {
                setGrid(prev => {
                  const newCells = prev.cells.map(row => [...row]);
                  newCells[r][c] = solution.cells[r][c];
                  return { ...prev, cells: newCells };
                });
                return;
              }
            }
          }
          alert("All cells are already filled!");
        } else {
          alert("This puzzle seems unsolvable.");
        }
      } finally {
        setIsLoading(false);
      }
    }, 50);
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

  const handleHistoryEntryDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Delete this entry?")) {
      const newHistory = history.filter(item => item.id !== id);
      setHistory(newHistory);
      localStorage.setItem('tango_history', JSON.stringify(newHistory));
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

  const handleGenerate = (difficulty: Difficulty) => {
    const newBoard = generateBoard(difficulty);
    setGrid(newBoard);
    setIsSolved(false);
    setSolveDuration(null);
    setError(null);
    setShowGenerator(false);
  }



  const formatDuration = (ms: number) => {
    if (ms < 0.001) return "< 1 μs";
    if (ms < 1) return `${Math.round(ms * 1000)} μs`;
    if (ms < 1000) return `${ms.toFixed(2)} ms`;
    return `${(ms / 1000).toFixed(3)} s`;
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center py-8 px-4 font-sans transition-colors duration-200 relative">

      {/* Top Right Controls */}
      <div className="absolute right-4 top-4 flex gap-2 z-10">
        <button
          onClick={() => setShowHistory(true)}
          className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          title="View History"
        >
          <HistoryIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* Header */}
      <header className="relative backdrop-blur-md bg-white/30 dark:bg-slate-900/30 border border-white/20 dark:border-white/10 shadow-xl rounded-2xl p-6 mb-6 text-center max-w-2xl w-full mx-auto">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex -space-x-1">
              <Sun className="w-8 h-8 text-amber-500 fill-amber-500" />
              <Moon className="w-8 h-8 text-blue-500 fill-blue-500" />
            </div>
            <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100">
              Tango <span className="text-blue-500 dark:text-blue-400">Master</span>
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Draw your puzzle or upload a screenshot to solve it instantly.
          </p>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-4 w-full max-w-6xl justify-center items-start">

        {/* Left Column: Grid */}
        <div className="flex-1 w-full flex flex-col items-center max-w-[500px] mx-auto lg:mx-0">

          {/* Error / Status Message */}
          {error && (
            <div className="w-full mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 px-4 py-3 rounded-lg flex items-center gap-3 animate-in fade-in">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {isSolved && !error && solveDuration !== null && (
            <div className="w-full mb-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-lg flex items-center justify-center gap-2 animate-in fade-in text-sm">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <p>
                <span className="font-semibold">Solved</span> in {formatDuration(solveDuration)}
              </p>
            </div>
          )}

          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 z-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl">
                <RefreshCw className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                <p className="text-xl font-bold text-slate-800 dark:text-white animate-pulse">Analyzing...</p>
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
        </div>

        {/* Right Column: Controls */}
        <div className="w-full max-w-[500px] lg:max-w-none lg:w-96 flex flex-col gap-4 mx-auto lg:mx-0">

          {/* Actions Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-200">
            <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Play className="w-5 h-5" /> Game Controls
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleSolve}
                disabled={isLoading || isSolved}
                className={`col-span-2 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all shadow-sm active:scale-[0.98]
                  ${isSolved
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white hover:shadow'
                  }`}
              >
                {isSolved ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Solved</span>
                  </>
                ) : (
                  <>
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                    <span>{isLoading ? 'Solving...' : 'Auto Solve'}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowGenerator(true)}
                className="flex items-center justify-center gap-2 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/40 dark:hover:bg-purple-900/60 text-purple-800 dark:text-purple-200 py-3 px-4 rounded-lg font-medium transition-colors border border-purple-200 dark:border-purple-800/50 active:scale-[0.98]"
              >
                <Sparkles className="w-5 h-5" /> New
              </button>

              <button
                onClick={handleClear}
                className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 py-3 px-4 rounded-lg font-medium transition-colors border border-slate-200 dark:border-slate-700 active:scale-[0.98]"
              >
                <RotateCcw className="w-5 h-5" /> Reset
              </button>
            </div>

            {/* Hint Button (Standardized placement) */}
            <button
              onClick={handleHint}
              disabled={isLoading || isSolved}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/40 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-200 py-3 px-4 rounded-lg font-medium transition-colors border border-amber-200 dark:border-amber-800/50 shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              <HelpCircle className="w-5 h-5" /> Hint
            </button>

            {/* Status Display standardized below hint */}
            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center animate-in fade-in">
              {!isBoardSolvable ? (
                <span className="text-orange-600 dark:text-orange-400 text-sm font-medium flex items-center justify-center gap-2">
                  <Info className="w-4 h-4" /> Board Layout is Unsolvable
                </span>
              ) : isSolved ? (
                <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Solved
                </span>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Board is valid
                </span>
              )}
            </div>

            <div className="relative group mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className={`
                  flex items-center justify-center gap-3 w-full border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 cursor-pointer
                  hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all
                  ${isLoading ? 'opacity-50 pointer-events-none' : ''}
                `}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-600 dark:text-indigo-400" />
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Thinking...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400" />
                    <div className="text-center">
                      <span className="block text-slate-700 dark:text-slate-200 font-medium">Upload Screenshot</span>
                      <span className="block text-slate-400 dark:text-slate-500 text-xs mt-1 flex items-center justify-center gap-1">
                        <Sparkles className="w-3 h-3 text-indigo-500" />
                        Gemini 3 Flash (Thinking)
                      </span>
                    </div>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Legend Card */}
          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-xl text-sm text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Controls</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="font-bold text-amber-500">Sun/Moon</span>: Click cell to toggle.
              </li>
              <li className="flex items-center gap-2">
                <span className="font-bold text-slate-500">= / x</span>: Click borders to toggle constraints.
              </li>
            </ul>
            <p className="text-xs mt-2 italic opacity-75">Tip: Crop screenshots to just the grid.</p>
          </div>

        </div>
      </div>

      <HistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        history={history}
        onLoadItem={loadHistoryItem}
        onClearHistory={handleClearHistory}
        onDeleteEntry={handleHistoryEntryDelete}
        formatDuration={formatDuration}
      />

      <GeneratorModal
        isOpen={showGenerator}
        onClose={() => setShowGenerator(false)}
        onGenerate={handleGenerate}
      />

      {/* Footer */}
      <footer className="mt-8 mb-6 text-center space-y-6 max-w-2xl mx-auto px-4">
        <div className="bg-white/50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center justify-center gap-2">
            How to Play
          </h3>
          <ul className="text-slate-600 dark:text-slate-400 text-sm space-y-1">
            <li>Place Sun/Moon so no more than 2 similar items are adjacent.</li>
            <li>Equal numbers of Sun/Moon in each row/column.</li>
            <li>Respect = (equal) and x (opposite) constraints.</li>
          </ul>
        </div>
        <div className="text-slate-400 dark:text-slate-500 text-xs font-medium animate-pulse">
          Built with 🧠 and ☕ by Krishna Kanth B
        </div>
      </footer>

    </div>
  );
};

export default App;