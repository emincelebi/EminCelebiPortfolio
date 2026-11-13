import React from 'react';

interface SnakeGameProps {
  score: number;
  gameOver: boolean;
  renderBoard: () => React.ReactNode;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ score, gameOver, renderBoard }) => (
  <div className="flex flex-col items-center justify-center h-full space-y-2">
    <div className="flex items-center justify-between w-full max-w-md px-2 text-[#43D9C3] font-bold">
      <span>🐍 RETRO SNAKE</span>
      <span>SKOR: {score}</span>
    </div>
    <div className="p-3 rounded-xl bg-[#10141D] border border-[#43D9C3]/40 text-[#43D9C3] font-mono text-xs">
      {renderBoard()}
    </div>
    {gameOver ? (
      <div className="text-center space-y-1">
        <div className="text-rose-400 font-bold">💥 OYUN BİTTİ! Skor: {score}</div>
        <div className="text-zinc-400 text-[11px]">Tekrar: <span className="text-[#43D9C3]">restart</span> • Çıkış: <span className="text-[#43D9C3]">exit</span></div>
      </div>
    ) : (
      <div className="text-zinc-400 text-[11px]">Yön tuşları (↑ ↓ ← →) ile yönetin • Çıkış: <span className="text-[#43D9C3]">exit</span></div>
    )}
  </div>
);

interface InvadersGameProps {
  score: number;
  gameOver: boolean;
  renderBoard: () => React.ReactNode;
}

export const InvadersGame: React.FC<InvadersGameProps> = ({ score, gameOver, renderBoard }) => (
  <div className="flex flex-col items-center justify-center h-full space-y-2">
    <div className="flex items-center justify-between w-full max-w-md px-2 text-[#43D9C3] font-bold">
      <span>👾 SPACE BUG INVADERS</span>
      <span>SKOR: {score}</span>
    </div>
    <div className="p-3 rounded-xl bg-[#10141D] border border-[#43D9C3]/40 text-[#43D9C3] font-mono text-xs">
      {renderBoard()}
    </div>
    {gameOver ? (
      <div className="text-center space-y-1">
        <div className="text-rose-400 font-bold">💥 BUGLAR SİSTEMİ ELE GEÇİRDİ! Skor: {score}</div>
        <div className="text-zinc-400 text-[11px]">Tekrar: <span className="text-[#43D9C3]">restart</span> • Çıkış: <span className="text-[#43D9C3]">exit</span></div>
      </div>
    ) : (
      <div className="text-zinc-400 text-[11px]">← → ile hareket et • SPACE ile ateş et • Çıkış: <span className="text-[#43D9C3]">exit</span></div>
    )}
  </div>
);

interface TicTacToeProps {
  board: string[];
  turn: 'X' | 'O';
  winner: string | null;
  onCellClick: (idx: number) => void;
}

export const TicTacToeGame: React.FC<TicTacToeProps> = ({ board, turn, winner, onCellClick }) => (
  <div className="flex flex-col items-center justify-center h-full space-y-3">
    <div className="flex items-center justify-between w-full max-w-xs px-2 text-[#43D9C3] font-bold text-xs">
      <span>❌ TIC-TAC-TOE (XOX)</span>
      <span>{winner ? 'BİTTİ' : `Sıra: ${turn}`}</span>
    </div>
    <div className="grid grid-cols-3 gap-2 bg-[#10141D] p-3 rounded-xl border border-[#43D9C3]/40">
      {board.map((val, idx) => (
        <button
          key={idx}
          onClick={() => onCellClick(idx)}
          className="w-12 h-12 rounded-lg bg-white/5 hover:bg-[#43D9C3]/20 flex items-center justify-center font-bold text-base text-[#43D9C3] transition-colors cursor-pointer"
        >
          {val}
        </button>
      ))}
    </div>
    {winner ? (
      <div className="text-center space-y-1">
        <div className="text-amber-400 font-bold">
          {winner === 'DRAW' ? '🤝 BERABERE!' : `🎉 KAZANAN: ${winner}`}
        </div>
        <div className="text-zinc-400 text-[11px]">Tekrar: <span className="text-[#43D9C3]">restart</span> • Çıkış: <span className="text-[#43D9C3]">exit</span></div>
      </div>
    ) : (
      <div className="text-zinc-400 text-[11px]">Kutulara tıklayarak hamle yap • Çıkış: <span className="text-[#43D9C3]">exit</span></div>
    )}
  </div>
);