import React from 'react';
import { X, Play, Trash2, Clock, Save } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    history: HistoryItem[];
    onLoadItem: (item: HistoryItem) => void;
    onClearHistory: () => void;
    formatDuration: (ms: number) => string;
}

const HistoryModal: React.FC<HistoryModalProps> = ({
    isOpen,
    onClose,
    history,
    onLoadItem,
    onClearHistory,
    formatDuration,
}) => {
    if (!isOpen) return null;

    const handleSaveLogs = () => {
        const header = "Tango Master Logs\n=================\n\n";
        const content = history.map((item, index) => {
            const { cells, hConstraints, vConstraints } = item.grid;
            let gridStr = "";

            for (let r = 0; r < 6; r++) {
                // Cells and H-Constraints
                let rowStr = "  ";
                for (let c = 0; c < 6; c++) {
                    const val = cells[r][c];
                    rowStr += val === 'SUN' ? 'S' : val === 'MOON' ? 'M' : '.';

                    if (c < 5) {
                        const constr = hConstraints[r][c];
                        rowStr += constr === 'EQUAL' ? ' = ' : constr === 'OPPOSITE' ? ' x ' : '   ';
                    }
                }
                gridStr += rowStr + "\n";

                // V-Constraints
                if (r < 5) {
                    let vRowStr = "  ";
                    for (let c = 0; c < 6; c++) {
                        const constr = vConstraints[r][c];
                        vRowStr += constr === 'EQUAL' ? '=' : constr === 'OPPOSITE' ? 'x' : ' ';

                        if (c < 5) {
                            vRowStr += '   ';
                        }
                    }
                    gridStr += vRowStr + "\n";
                }
            }

            return `Entry #${history.length - index}
Date: ${new Date(item.timestamp).toLocaleString()}
Duration: ${formatDuration(item.duration)}

${gridStr}
----------------------------------------`;
        }).join('\n\n');

        const blob = new Blob([header + content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'tango_master_logs.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-in zoom-in-95 duration-200"
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-indigo-400" />
                        <h2 className="text-xl font-bold text-white">Solve History</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded-lg"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {history.length === 0 ? (
                        <div className="text-center text-slate-500 py-12">
                            <p>No puzzles solved yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {history.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 flex items-center justify-between group hover:border-indigo-500/30 transition-all"
                                >
                                    <div className="flex flex-col gap-1">
                                        <span className="font-medium text-slate-200">
                                            {new Date(item.timestamp).toLocaleString()}
                                        </span>
                                        <span className="text-sm text-slate-500 font-mono">
                                            Time: <span className="text-emerald-400">{formatDuration(item.duration)}</span>
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => onLoadItem(item)}
                                        className="flex items-center gap-2 px-3 py-2 bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-md transition-all text-sm font-medium"
                                    >
                                        Load Board
                                        <Play className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {history.length > 0 && (
                    <div className="p-4 border-t border-slate-800 bg-slate-900/50 rounded-b-xl flex justify-end gap-3">
                        <button
                            onClick={handleSaveLogs}
                            className="flex items-center gap-2 px-4 py-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20 rounded-lg transition-colors text-sm font-medium"
                        >
                            <Save className="w-4 h-4" />
                            Save Logs
                        </button>
                        <button
                            onClick={onClearHistory}
                            className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium"
                        >
                            <Trash2 className="w-4 h-4" />
                            Clear All History
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryModal;
