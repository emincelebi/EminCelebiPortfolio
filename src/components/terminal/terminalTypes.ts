import React from 'react';

export type GameType = 'menu' | 'hack' | 'snake' | 'invaders' | 'tictactoe';

export interface CommandHistory {
  command: string;
  output: React.ReactNode;
  type: 'info' | 'success' | 'error' | 'ascii';
}