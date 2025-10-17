export type Direction = 'up' | 'down' | 'left' | 'right' | null;

export interface Ghost {
  x: number;
  y: number;
  color: string;
  direction: Direction;
  mode: 'chase' | 'scatter' | 'frightened' | 'eaten';
  isBlinking: boolean;
}

export interface GameState {
  pacman: {
    x: number;
    y: number;
    direction: Direction;
    nextDirection: Direction;
  };
  ghosts: Ghost[];
  level: any; // Мы будем использовать класс Level, но для простоты оставим any
  score: number;
  lives: number;
  gameStatus: 'loading' | 'idle' | 'playing' | 'paused' | 'won' | 'lost';
  animationFrame: number;
}