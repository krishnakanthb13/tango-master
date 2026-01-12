import React from 'react';
import { X, Trophy, Battery, BatteryMedium, BatteryFull } from 'lucide-react';
import { Difficulty } from '../types';

interface GeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (difficulty: Difficulty) => void;
}

const GeneratorModal: React.FC<GeneratorModalProps> = ({
    isOpen,
    onClose,
    onGenerate,
}) => {
    if (!isOpen) return null;

    const modes = [
        {
            level: 'Easy',
            icon: Battery,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20',
            hover: 'hover:border-emerald-500',
            desc: 'Perfect for beginners. More clues and constraints.'
        },
        {
            level: 'Medium',
            icon: BatteryMedium,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20',
            hover: 'hover:border-amber-500',
            desc: 'A balanced challenge. Fewer clues.'
        },
        {
            level: 'Hard',
            icon: BatteryFull,
            color: 'text-rose-400',
            bg: 'bg-rose-500/10',
            border: 'border-rose-500/20',
            hover: 'hover:border-rose-500',
            desc: 'For experts only. Minimal guidance.'
        }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg flex flex-col animate-in zoom-in-95 duration-200"
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-indigo-400" />
                        <h2 className="text-xl font-bold text-white">New Game</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded-lg"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <p className="text-slate-400 mb-4">Select a difficulty level to generate a new random puzzle.</p>

                    {modes.map((m) => {
                        const Icon = m.icon;
                        return (
                            <button
                                key={m.level}
                                onClick={() => onGenerate(m.level as Difficulty)}
                                className={`w-full flex items-center gap-4 p-4 rounded-xl border ${m.border} ${m.bg} ${m.hover} transition-all group text-left`}
                            >
                                <div className={`p-3 rounded-lg bg-slate-900 ${m.color}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className={`font-bold text-lg ${m.color}`}>{m.level}</h3>
                                    <p className="text-sm text-slate-400">{m.desc}</p>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default GeneratorModal;
