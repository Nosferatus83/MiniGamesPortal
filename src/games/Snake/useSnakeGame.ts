import { useState, useEffect, useRef, useCallback } from 'react';

// Типы для координат
type Position = {
  x: number;
  y: number;
};

// Состояние игры
type GameStatus = 'idle' | 'playing' | 'paused' | 'game-over';

// Направления движения
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const BOARD_SIZE = 20; // Размер игрового поля 20x20
const INITIAL_SPEED = 150; // Начальная скорость в миллисекундах
const SPEED_INCREMENT = 2; // Увеличение скорости при поедании еды

export const useSnakeGame = () => {
  // Состояние змейки (массив координат)
  const [snake, setSnake] = useState<Position[]>([
    { x: 10, y: 10 }, // Голова змейки
    { x: 10, y: 11 },
    { x: 10, y: 12 }, // Хвост
  ]);
  
  // Позиция еды
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  
  // Направление движения
  const [direction, setDirection] = useState<Direction>('UP');
  const [nextDirection, setNextDirection] = useState<Direction>('UP');
  
  // Состояние игры
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  
  // Счет
  const [score, setScore] = useState(0);
  
  // Скорость игры
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  // Ref для доступа к состоянию в колбэках
  const directionRef = useRef(direction);
  const gameStatusRef = useRef(gameStatus);
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);
  
  // Обновляем ref при изменении состояния
  useEffect(() => {
    directionRef.current = direction;
    gameStatusRef.current = gameStatus;
    snakeRef.current = snake;
    foodRef.current = food;
  }, [direction, gameStatus, snake, food]);

  // Генерация новой позиции для еды
  const generateFood = useCallback((): Position => {
    let newFood: Position;
    let overlapping: boolean;
    
    do {
      overlapping = false;
      newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE),
      };
      
      // Проверяем, не пересекается ли еда с змейкой
      for (const segment of snakeRef.current) {
        if (segment.x === newFood.x && segment.y === newFood.y) {
          overlapping = true;
          break;
        }
      }
    } while (overlapping);
    
    return newFood;
  }, []);

  // Инициализация новой еды
  useEffect(() => {
    if (gameStatus === 'playing') {
      setFood(generateFood());
    }
  }, [gameStatus, generateFood]);

  // Обработка нажатий клавиш
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStatusRef.current === 'game-over' && e.key === ' ') {
        // Перезапуск игры при нажатии пробела после проигрыша
        resetGame();
        return;
      }
      
      if (e.key === ' ') {
        // Пауза/возобновление при нажатии пробела
        togglePause();
        return;
      }
      
      if (gameStatusRef.current !== 'playing') return;
      
      // Обработка направлений
      switch (e.key) {
        case 'ArrowUp':
          if (directionRef.current !== 'DOWN') setNextDirection('UP');
          break;
        case 'ArrowDown':
          if (directionRef.current !== 'UP') setNextDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (directionRef.current !== 'RIGHT') setNextDirection('LEFT');
          break;
        case 'ArrowRight':
          if (directionRef.current !== 'LEFT') setNextDirection('RIGHT');
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Основной игровой цикл
  useEffect(() => {
    if (gameStatus !== 'playing') return;
    
    const moveSnake = () => {
      setDirection(nextDirection);
      setSnake(prevSnake => {
        const head = { ...prevSnake[0] };
        
        // Обновляем позицию головы в зависимости от направления
        switch (nextDirection) {
          case 'UP':
            head.y -= 1;
            break;
          case 'DOWN':
            head.y += 1;
            break;
          case 'LEFT':
            head.x -= 1;
            break;
          case 'RIGHT':
            head.x += 1;
            break;
        }
        
        // Проверка столкновения со стенами
        if (
          head.x < 0 || 
          head.x >= BOARD_SIZE || 
          head.y < 0 || 
          head.y >= BOARD_SIZE
        ) {
          setGameStatus('game-over');
          return prevSnake;
        }
        
        // Проверка столкновения с хвостом
        for (let i = 0; i < prevSnake.length; i++) {
          if (head.x === prevSnake[i].x && head.y === prevSnake[i].y) {
            setGameStatus('game-over');
            return prevSnake;
          }
        }
        
        const newSnake = [head, ...prevSnake];
        
        // Проверка поедания еды
        if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
          // Увеличиваем счет
          setScore(prev => prev + 10);
          
          // Увеличиваем скорость
          setSpeed(prev => Math.max(prev - SPEED_INCREMENT, 50)); // Ограничиваем минимальную скорость до 50мс
          
          // Генерируем новую еду
          setFood(generateFood());
        } else {
          // Удаляем последний сегмент, если не съели еду
          newSnake.pop();
        }
        
        return newSnake;
      });
    };
    
    const gameInterval = setInterval(moveSnake, speed);
    return () => clearInterval(gameInterval);
  }, [gameStatus, nextDirection, speed, generateFood]);

  // Функция запуска игры
  const startGame = () => {
    if (gameStatus === 'idle' || gameStatus === 'game-over') {
      resetGame();
    }
    setGameStatus('playing');
  };

  // Функция паузы/возобновления
  const togglePause = () => {
    if (gameStatus === 'playing') {
      setGameStatus('paused');
    } else if (gameStatus === 'paused') {
      setGameStatus('playing');
    }
  };

  // Функция перезапуска игры
  const resetGame = () => {
    setSnake([
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
    ]);
    setDirection('UP');
    setNextDirection('UP');
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setFood(generateFood());
  };

  // Функция для мобильного управления
  const changeDirection = (newDirection: Direction) => {
    if (gameStatus !== 'playing') return;
    
    // Проверяем, чтобы новое направление не было противоположным текущему
    if (
      (newDirection === 'UP' && directionRef.current !== 'DOWN') ||
      (newDirection === 'DOWN' && directionRef.current !== 'UP') ||
      (newDirection === 'LEFT' && directionRef.current !== 'RIGHT') ||
      (newDirection === 'RIGHT' && directionRef.current !== 'LEFT')
    ) {
      setNextDirection(newDirection);
    }
  };

  return {
    snake,
    food,
    direction,
    gameStatus,
    score,
    speed,
    startGame,
    togglePause,
    resetGame,
    changeDirection,
    BOARD_SIZE
  };
};