import { useState, useEffect, useCallback } from 'react';
import { GameState, Direction, Ghost } from './types';
import { Level, Empty } from './level';

const PACMAN_SPEED = 1 / 8;
const GHOST_SPEED = 1 / 9;

class Pacman {
  x: number;
  y: number;
  direction: Direction;
  nextDirection: Direction;
  speed: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.direction = 'right';
    this.nextDirection = 'right';
    this.speed = PACMAN_SPEED;
  }

  update(level: Level, onEatFood: (food: any) => void) {
    if (this.nextDirection && this.canTurn(level, this.nextDirection)) {
      this.direction = this.nextDirection;
    }

    const { dx, dy } = this.getDelta();
    if (this.canMove(level, this.direction)) {
      this.x += dx * this.speed;
      this.y += dy * this.speed;
    }

    // Handle teleport
    if (this.x < 0) this.x = level.width - 1;
    if (this.x >= level.width) this.x = 0;

    const gridX = Math.floor(this.x);
    const gridY = Math.floor(this.y);
    const cell = level.get(gridX, gridY);

    if (cell && cell.constructor.name === 'Food') {
      onEatFood(cell);
      level.grid[gridY][gridX] = new Empty(gridX, gridY);
    }
  }

  canMove(level: Level, direction: Direction) {
    const { dx, dy } = this.getDelta(direction);
    const nextX = this.x + dx * this.speed;
    const nextY = this.y + dy * this.speed;
    const gridX = Math.floor(nextX + (dx > 0 ? 0.9 : 0));
    const gridY = Math.floor(nextY + (dy > 0 ? 0.9 : 0));
    const cell = level.get(gridX, gridY);
    return !cell || cell.constructor.name !== 'Wall';
  }

  canTurn(level: Level, direction: Direction) {
    if (this.x % 1 === 0 && this.y % 1 === 0) {
        return this.canMove(level, direction);
    }
    return false;
  }

  getDelta(dir: Direction = this.direction) {
    switch (dir) {
      case 'up': return { dx: 0, dy: -1 };
      case 'down': return { dx: 0, dy: 1 };
      case 'left': return { dx: -1, dy: 0 };
      case 'right': return { dx: 1, dy: 0 };
      default: return { dx: 0, dy: 0 };
    }
  }
}

class GhostCharacter implements Ghost {
    x: number;
    y: number;
    color: string;
    direction: Direction;
    mode: 'chase' | 'scatter' | 'frightened' | 'eaten';
    speed: number;
    isBlinking: boolean = false;

    constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.direction = 'up';
        this.mode = 'scatter';
        this.speed = GHOST_SPEED;
    }

    update(level: Level, pacman: Pacman) {
        // Basic random movement for now
        if (Math.random() > 0.95 || !this.canMove(level, this.direction)) {
            const directions: Direction[] = ['up', 'down', 'left', 'right'];
            this.direction = directions[Math.floor(Math.random() * directions.length)];
        }
        
        const { dx, dy } = this.getDelta();
        if (this.canMove(level, this.direction)) {
            this.x += dx * this.speed;
            this.y += dy * this.speed;
        }
    }

    canMove(level: Level, direction: Direction) {
        const { dx, dy } = this.getDelta(direction);
        const nextX = this.x + dx * this.speed;
        const nextY = this.y + dy * this.speed;
        const gridX = Math.floor(nextX + (dx > 0 ? 0.9 : 0));
        const gridY = Math.floor(nextY + (dy > 0 ? 0.9 : 0));
        const cell = level.get(gridX, gridY);
        return !cell || cell.constructor.name !== 'Wall';
    }
    
    getDelta(dir: Direction = this.direction) {
        switch (dir) {
            case 'up': return { dx: 0, dy: -1 };
            case 'down': return { dx: 0, dy: 1 };
            case 'left': return { dx: -1, dy: 0 };
            case 'right': return { dx: 1, dy: 0 };
            default: return { dx: 0, dy: 0 };
        }
    }
}

export const usePacmanGame = () => {
  const [gameStatus, setGameStatus] = useState<'loading' | 'idle' | 'playing' | 'paused' | 'won' | 'lost'>('loading');

  const startGame = () => {
    setGameStatus('playing');
  };

  const togglePause = () => {
    setGameStatus(prev => prev === 'playing' ? 'paused' : 'playing');
  };
  const [level] = useState(new Level(19, 15));
  const [pacman] = useState(new Pacman(9, 11));
  const [ghosts] = useState([
    new GhostCharacter(8, 7, 'red'),
    new GhostCharacter(9, 7, 'pink'),
    new GhostCharacter(10, 7, 'cyan'),
    new GhostCharacter(11, 7, 'orange'),
  ]);
  const [gameState, setGameState] = useState<Omit<GameState, 'level'>>({
    score: 0,
    lives: 3,
    gameStatus: 'loading',
    animationFrame: 0,
    pacman: { x: pacman.x, y: pacman.y, direction: pacman.direction, nextDirection: pacman.nextDirection },
    ghosts: ghosts.map(g => ({ ...g })),
  });

  // Обновляем gameStatus в gameState при изменении локального gameStatus
  useEffect(() => {
    setGameState(prev => ({
      ...prev,
      gameStatus
    }));
  }, [gameStatus]);

  const resetGame = () => {
    // Сбрасываем состояние игры к начальному
    setGameState(prev => ({
      ...prev,
      score: 0,
      lives: 3,
      gameStatus: 'loading',
      pacman: { x: 9, y: 11, direction: 'right', nextDirection: 'right' },
      ghosts: [
        { ...ghosts[0], x: 8, y: 7, direction: 'up' },
        { ...ghosts[1], x: 9, y: 7, direction: 'up' },
        { ...ghosts[2], x: 10, y: 7, direction: 'up' },
        { ...ghosts[3], x: 11, y: 7, direction: 'up' },
      ],
    }));

    // Пересоздаем уровень (еду)
    const newLevel = new Level(19, 15);
    // Обновляем ссылку на уровень
    (level as any).grid = newLevel.grid;
    (level as any).foodCount = newLevel.foodCount;

    setGameStatus('loading');
  };

  const handleEatFood = useCallback((food: any) => {
    setGameState(prev => ({
      ...prev,
      score: prev.score + (food.type === 'superfood' ? 50 : 10),
    }));
    level.foodCount--;
  }, [level]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let newDirection: Direction = null;
      if (e.key === 'ArrowUp') newDirection = 'up';
      if (e.key === 'ArrowDown') newDirection = 'down';
      if (e.key === 'ArrowLeft') newDirection = 'left';
      if (e.key === 'ArrowRight') newDirection = 'right';
      if (newDirection) {
        pacman.nextDirection = newDirection;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pacman]);

  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const gameLoop = () => {
      pacman.update(level, handleEatFood);
      ghosts.forEach(ghost => ghost.update(level, pacman));

      setGameState(prev => ({
        ...prev,
        pacman: { x: pacman.x, y: pacman.y, direction: pacman.direction, nextDirection: pacman.nextDirection },
        ghosts: ghosts.map(g => ({ ...g })),
        gameStatus, // Убедимся, что gameStatus также обновляется в gameState
        animationFrame: Math.floor(Date.now() / 200) % 2
      }));
    };

    const intervalId = setInterval(gameLoop, 1000 / 60);
    return () => clearInterval(intervalId);
  }, [pacman, ghosts, level, handleEatFood, gameStatus]);

  return { ...gameState, level, startGame, togglePause, resetGame };
};
