import { useState, useEffect, useCallback } from 'react';
import { Paddle, Ball, Brick, checkBallCollision } from './Arkanoid/types';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 10;
const PADDLE_Y = GAME_HEIGHT - 30;
const BALL_RADIUS = 8;
const BRICK_ROWS = 5;
const BRICK_COLUMNS = 9;
const BRICK_WIDTH = 75;
const BRICK_HEIGHT = 20;
const BRICK_PADDING = 10;
const BRICK_OFFSET_TOP = 60;
const BRICK_OFFSET_LEFT = 30;

const useArkanoidGame = () => {
  // Инициализация состояния платформы
  const [paddle, setPaddle] = useState<Paddle>({
    x: (GAME_WIDTH - PADDLE_WIDTH) / 2,
    y: PADDLE_Y,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
  });

  // Инициализация состояния мяча
  const [ball, setBall] = useState<Ball>({
    x: GAME_WIDTH / 2,
    y: PADDLE_Y - BALL_RADIUS,
    radius: BALL_RADIUS,
    speed: { x: 4.5/200, y: -4.5/200 }, // Увеличиваем начальную скорость для лучшей динамики
  });

  // Инициализация состояния блоков
  const [bricks, setBricks] = useState<Brick[][]>(() => {
    const bricksArray: Brick[][] = [];
    for (let row = 0; row < BRICK_ROWS; row++) {
      bricksArray[row] = [];
      for (let col = 0; col < BRICK_COLUMNS; col++) {
        const brickX = col * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT;
        const brickY = row * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP;
        bricksArray[row][col] = {
          x: brickX,
          y: brickY,
          width: BRICK_WIDTH,
          height: BRICK_HEIGHT,
          status: 1, // Активный блок
        };
      }
    }
    return bricksArray;
  });

  // Инициализация состояния игры
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'paused' | 'game-over'>('idle');

  // Состояние для отслеживания нажатых клавиш
  const [leftKeyPressed, setLeftKeyPressed] = useState(false);
  const [rightKeyPressed, setRightKeyPressed] = useState(false);

  // Обновление позиции платформы при движении мыши
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = document.getElementById('arkanoid-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const relativeX = e.clientX - canvas.getBoundingClientRect().left;
    if (relativeX > 0 && relativeX < GAME_WIDTH) {
      setPaddle(prev => ({
        ...prev,
        x: Math.max(0, Math.min(relativeX - PADDLE_WIDTH / 2, GAME_WIDTH - PADDLE_WIDTH)),
      }));
    }
  }, []);

  // Обработчик нажатия клавиш
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setLeftKeyPressed(true);
    } else if (e.key === 'ArrowRight') {
      setRightKeyPressed(true);
    } else if (e.key === ' ') {
      e.preventDefault(); // Предотвращаем прокрутку страницы при нажатии пробела
      setGameStatus(prev => prev === 'playing' ? 'paused' : 'playing');
    }
  }, []);

  // Обработчик отпускания клавиш
  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setLeftKeyPressed(false);
    } else if (e.key === 'ArrowRight') {
      setRightKeyPressed(false);
    }
  }, []);

  // Обработка столкновений мяча с блоками
  const handleBrickCollision = useCallback(() => {
    setBricks(prevBricks => {
      const newBricks = [...prevBricks];
      let collisionOccurred = false;
      let collisionDirection: 'horizontal' | 'vertical' | null = null;

      for (let row = 0; row < newBricks.length; row++) {
        for (let col = 0; col < newBricks[row].length; col++) {
          const brick = newBricks[row][col];
          if (brick.status === 1) {
            if (checkBallCollision(ball, brick)) {
              newBricks[row][col] = { ...brick, status: 0 }; // Разрушаем блок
              collisionOccurred = true;
              
              // Определяем направление столкновения для корректного отскока
              // Вычисляем центральные точки для определения направления
              const ballCenterX = ball.x;
              const ballCenterY = ball.y;
              const brickCenterX = brick.x + brick.width / 2;
              const brickCenterY = brick.y + brick.height / 2;
              
              // Определяем, с какой стороны произошло столкновение
              const dx = ballCenterX - brickCenterX;
              const dy = ballCenterY - brickCenterY;
              
              // Сравниваем абсолютные значения для определения основного направления
              if (Math.abs(dx) > Math.abs(dy)) {
                collisionDirection = 'horizontal'; // Столкновение по горизонтали
              } else {
                collisionDirection = 'vertical'; // Столкновение по вертикали
              }
            }
          }
        }
      }

      if (collisionOccurred) {
        setBall(prev => {
          const newSpeed = { ...prev.speed };
          
          // Меняем направление в зависимости от стороны столкновения
          if (collisionDirection === 'horizontal') {
            newSpeed.x = -newSpeed.x;
          } else if (collisionDirection === 'vertical') {
            newSpeed.y = -newSpeed.y;
          }
          
          return { ...prev, speed: newSpeed };
        }); // Меняем направление мяча в зависимости от направления столкновения
      }

      return newBricks;
    });
  }, [ball]);

  // Обновление игрового состояния
  const updateGame = useCallback(() => {
    // Обновляем позицию платформы при нажатии клавиш
    setPaddle(prevPaddle => {
      let newX = prevPaddle.x;
      const speed = 0.08 / 1.5; // Скорость движения платформы (уменьшена в 1.5 раза)
      
      if (leftKeyPressed && newX > 0) {
        newX = Math.max(0, newX - speed);
      }
      if (rightKeyPressed && newX < GAME_WIDTH - PADDLE_WIDTH) {
        newX = Math.min(GAME_WIDTH - PADDLE_WIDTH, newX + speed);
      }
      
      return { ...prevPaddle, x: newX };
    });

    setBall(prevBall => {
      let newBall = { ...prevBall };

      // Обновляем позицию мяча
      newBall.x += newBall.speed.x;
      newBall.y += newBall.speed.y;

      // Отскок от стен
      if (newBall.x + newBall.speed.x > GAME_WIDTH - newBall.radius) {
        newBall.x = GAME_WIDTH - newBall.radius; // Корректируем позицию, чтобы мяч не застревал за границей
        newBall.speed = { ...newBall.speed, x: -Math.abs(newBall.speed.x) }; // Отскок влево
      } else if (newBall.x + newBall.speed.x < newBall.radius) {
        newBall.x = newBall.radius; // Корректируем позицию
        newBall.speed = { ...newBall.speed, x: Math.abs(newBall.speed.x) }; // Отскок вправо
      }

      // Отскок от верхней стенки
      if (newBall.y + newBall.speed.y < newBall.radius) {
        newBall.y = newBall.radius; // Корректируем позицию
        newBall.speed = { ...newBall.speed, y: Math.abs(newBall.speed.y) }; // Отскок вниз
      }
      // Проверка столкновения с платформой
      else if (
        newBall.y + newBall.speed.y > PADDLE_Y - newBall.radius &&
        newBall.x > paddle.x &&
        newBall.x < paddle.x + paddle.width &&
        newBall.y - newBall.radius < PADDLE_Y &&
        newBall.y + newBall.speed.y - newBall.radius < PADDLE_Y
      ) {
        // Расчет отскока от платформы с учетом точки удара
        const hitPosition = (newBall.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2); // От -1 до 1
        const maxAngle = Math.PI / 3; // Максимальный угол отклонения (60 градусов)
        const angle = hitPosition * maxAngle;
        
        // Сохраняем скорость и меняем направление с учетом угла
        const speed = Math.sqrt(newBall.speed.x * newBall.speed.x + newBall.speed.y * newBall.speed.y);
        newBall.speed = {
          x: speed * Math.sin(angle),
          y: -speed * Math.cos(angle) // Направление всегда вверх, но с углом
        };
      }
      // Проверка выхода мяча за нижнюю границу (потеря жизни)
      else if (newBall.y + newBall.speed.y > GAME_HEIGHT - newBall.radius) {
        // Сброс мяча в начальную позицию
        newBall = {
          x: GAME_WIDTH / 2,
          y: PADDLE_Y - BALL_RADIUS,
          radius: BALL_RADIUS,
          speed: { x: 4.5/200, y: -4.5/200 }, // Увеличиваем начальную скорость для лучшей динамики
        };
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setGameStatus('game-over'); // Устанавливаем статус "game-over" при окончании жизней
          }
          return newLives;
        }); // Уменьшаем жизни при потере мяча
      }

      return newBall;
    });

    // Проверяем столкновения с блоками
    handleBrickCollision();
    
    // Проверяем, остались ли живые блоки
    const hasActiveBricks = bricks.some(row => row.some(brick => brick.status === 1));
    if (!hasActiveBricks && gameStatus === 'playing') {
      setGameStatus('game-over'); // Устанавливаем статус "game-over" при победе (все блоки разрушены)
      setScore(prev => prev + 100 * lives); // Добавляем бонус за оставшиеся жизни
    }
  }, [paddle.x, paddle.width, handleBrickCollision, bricks, gameStatus, lives, leftKeyPressed, rightKeyPressed]);

  // Игровой цикл
  useEffect(() => {
    let animationFrameId: number;

    const gameLoop = () => {
      if (gameStatus === 'playing') {
        updateGame();
      }
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [updateGame, gameStatus]);

  // Функции управления игрой
  const startGame = () => {
    setGameStatus('playing');
    setScore(0);
    setLives(3);
    // Сбрасываем мяч в начальное положение при начале игры
    setBall({
      x: GAME_WIDTH / 2,
      y: PADDLE_Y - BALL_RADIUS,
      radius: BALL_RADIUS,
      speed: { x: 4.5/200, y: -4.5/200 }, // Увеличиваем начальную скорость для лучшей динамики
    });
  };

  const resetGame = () => {
    setPaddle({
      x: (GAME_WIDTH - PADDLE_WIDTH) / 2,
      y: PADDLE_Y,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
    });
    setBall({
      x: GAME_WIDTH / 2,
      y: PADDLE_Y - BALL_RADIUS,
      radius: BALL_RADIUS,
      speed: { x: 4.5/200, y: -4.5/200 }, // Увеличиваем начальную скорость для лучшей динамики
    });
    setBricks(() => {
      const bricksArray: Brick[][] = [];
      for (let row = 0; row < BRICK_ROWS; row++) {
        bricksArray[row] = [];
        for (let col = 0; col < BRICK_COLUMNS; col++) {
          const brickX = col * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT;
          const brickY = row * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP;
          bricksArray[row][col] = {
            x: brickX,
            y: brickY,
            width: BRICK_WIDTH,
            height: BRICK_HEIGHT,
            status: 1, // Активный блок
          };
        }
      }
      return bricksArray;
    });
    setScore(0);
    setLives(3);
    setGameStatus('idle');
  };

  const togglePause = () => {
    setGameStatus(prev => prev === 'playing' ? 'paused' : 'playing');
  };

  // Добавляем обработчики клавиатуры
  useEffect(() => {
    const handleKeyDownWrapper = (e: KeyboardEvent) => handleKeyDown(e);
    const handleKeyUpWrapper = (e: KeyboardEvent) => handleKeyUp(e);
    
    window.addEventListener('keydown', handleKeyDownWrapper);
    window.addEventListener('keyup', handleKeyUpWrapper);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDownWrapper);
      window.removeEventListener('keyup', handleKeyUpWrapper);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Добавляем обработчик движения мыши
  useEffect(() => {
    const canvas = document.getElementById('arkanoid-canvas') as HTMLCanvasElement;
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove);
      return () => {
        canvas.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [handleMouseMove]);

  return { paddle, ball, bricks, score, lives, gameStatus, startGame, resetGame, togglePause };
};

export default useArkanoidGame;