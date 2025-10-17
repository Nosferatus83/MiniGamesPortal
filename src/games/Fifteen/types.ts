export interface Tile {
  id: number;
  value: number | null;
  isEmpty: boolean;
}

export interface GameState {
  board: (number | null)[];
  moves: number;
  time: number;
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
}