import React, { useEffect, useRef, useState } from 'react';
import useArkanoidGame from './useArkanoidGame';
import Button from '../components/Button';

const ArkanoidGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { paddle, ball, bricks, score, lives, gameStatus, startGame, resetGame, togglePause } = useArkanoidGame();
  const [gameStarted, setGameStarted] = useState(false);

  // Функция отрисовки
  const draw = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Очищаем canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем платформу
    ctx.fillStyle = '#10B981'; // green-500
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.strokeStyle = '#047857'; // green-700
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);

    // Рисуем мяч
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#EF4444'; // red-500
    ctx.fill();
    ctx.strokeStyle = '#B91C1C'; // red-700
    ctx.stroke();
    ctx.closePath();

    // Рисуем блоки
    bricks.forEach(row => {
      row.forEach(brick => {
        if (brick.status === 1) {
          ctx.beginPath();
          ctx.rect(brick.x, brick.y, brick.width, brick.height);
          // Используем разные цвета для разных строк кирпичей
          const rowColors = [
            '#3B82F6', // blue-500
            '#8B5CF6', // violet-500
            '#EC4899', // pink-500
            '#F59E0B', // amber-500
            '#10B981'  // green-500
          ];
          const colorIndex = row.indexOf(brick) % rowColors.length;
          ctx.fillStyle = rowColors[colorIndex];
          ctx.fill();
          ctx.strokeStyle = '#1E293B'; // slate-800
          ctx.stroke();
          ctx.closePath();
        }
      });
    });
  }, [paddle, ball, bricks]); // Зависимости: paddle, ball, bricks

  // Используем useEffect для вызова draw при изменении состояния игры
  useEffect(() => {
    draw();
  }, [paddle, ball, bricks, draw]);

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 p-4 overflow-y-hidden">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Арканоид</h1>
        
        <div className="mb-6 flex justify-between items-center">
          <div className="text-lg font-semibold text-gray-700">
            Счет: <span className="text-green-600">{score}</span>
          </div>
          <div className="text-lg font-semibold text-gray-700">
            Жизни: <span className="text-red-600">{lives}</span>
          </div>
          <div className="text-lg font-semibold text-gray-700">
            Статус:
            <span className={`ml-2 px-2 py-1 rounded ${
              gameStatus === 'playing' ? 'bg-green-200 text-green-800' :
              gameStatus === 'paused' ? 'bg-yellow-200 text-yellow-800' :
              'bg-red-200 text-red-800'
            }`}>
              {gameStatus === 'playing' ? 'Игра' : gameStatus === 'paused' ? 'Пауза' : 'Конец игры'}
            </span>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <canvas
            id="arkanoid-canvas"
            ref={canvasRef}
            width={800}
            height={600}
            className="border-2 border-gray-800 rounded-lg shadow-md bg-gray-100"
          />
        </div>

        <div className="flex justify-center space-x-4 mb-6">
          {!gameStarted ? (
            <Button
              onClick={() => {
                startGame();
                setGameStarted(true);
              }}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow"
            >
              Начать игру
            </Button>
          ) : (
            <>
              <Button
                onClick={togglePause}
                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg shadow"
              >
                {gameStatus === 'paused' ? 'Продолжить' : 'Пауза'}
              </Button>
              <Button
                onClick={resetGame}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow"
              >
                Сброс
              </Button>
            </>
          )}
          <Button
            onClick={() => {
              resetGame();
              setGameStarted(false);
            }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow"
          >
            Новая игра
          </Button>
        </div>

        {gameStatus === 'game-over' && (
          <div className="mt-6 p-4 bg-red-100 border-2 border-red-300 rounded-lg text-center shadow-md">
            <h2 className="text-2xl font-bold text-red-800">Игра окончена!</h2>
            <p className="text-xl mt-2">Ваш счет: <span className="font-bold text-red-600">{score}</span></p>
            <Button
              onClick={() => {
                resetGame();
                setGameStarted(true);
              }}
              className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow"
            >
              Играть снова
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArkanoidGame;