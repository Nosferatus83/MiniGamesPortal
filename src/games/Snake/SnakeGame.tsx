import React from 'react';
import { useSnakeGame } from './useSnakeGame';
import Button from '../../components/Button';

const SnakeGame: React.FC = () => {
  const {
    snake,
    food,
    gameStatus,
    score,
    startGame,
    togglePause,
    resetGame,
    changeDirection,
    BOARD_SIZE
  } = useSnakeGame();

  // Рендер игрового поля
  const renderBoard = () => {
    const board = [];
    
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        const isSnake = snake.some(segment => segment.x === x && segment.y === y);
        const isHead = snake[0] && snake[0].x === x && snake[0].y === y;
        const isFood = food.x === x && food.y === y;
        
        let cellClass = 'w-4 h-4 border border-gray-800';
        
        if (isHead) {
          cellClass += ' bg-green-700'; // Голова змейки
        } else if (isSnake) {
          cellClass += ' bg-green-500'; // Тело змейки
        } else if (isFood) {
          cellClass += ' bg-red-500 rounded-full'; // Еда
        } else {
          cellClass += ' bg-gray-100';
        }
        
        board.push(
          <div
            key={`${x}-${y}`}
            className={cellClass}
          />
        );
      }
    }
    
    return board;
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-200 p-4 overflow-y-hidden">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Змейка</h1>
        
        {/* Счет */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold">Счет: <span className="text-green-600">{score}</span></div>
          <div className="text-lg">
            Статус: 
            <span className={`ml-2 px-2 py-1 rounded ${gameStatus === 'playing' ? 'bg-green-200 text-green-800' : 
              gameStatus === 'paused' ? 'bg-yellow-200 text-yellow-800' : 
              gameStatus === 'game-over' ? 'bg-red-200 text-red-800' : 
              'bg-blue-200 text-blue-800'}`}>
              {gameStatus === 'playing' ? 'Игра' : 
               gameStatus === 'paused' ? 'Пауза' : 
               gameStatus === 'game-over' ? 'Конец игры' : 
               'Ожидание'}
            </span>
          </div>
        </div>
        
        {/* Игровое поле */}
        <div 
          className="grid mx-auto border-2 border-gray-800 rounded overflow-hidden"
          style={{ 
            gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
            width: 'fit-content'
          }}
        >
          {renderBoard()}
        </div>
        
        {/* Управление */}
        <div className="mt-6 flex flex-col items-center">
          {/* Кнопки управления для мобильных устройств */}
          <div className="mb-6">
            <div className="flex justify-center mb-2">
              <Button
                onClick={() => changeDirection('UP')}
                className="w-16 h-16 flex items-center justify-center bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-lg shadow"
              >
                ↑
              </Button>
            </div>
            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => changeDirection('LEFT')}
                className="w-16 h-16 flex items-center justify-center bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-lg shadow"
              >
                ←
              </Button>
              <Button
                onClick={() => changeDirection('DOWN')}
                className="w-16 h-16 flex items-center justify-center bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-lg shadow"
              >
                ↓
              </Button>
              <Button
                onClick={() => changeDirection('RIGHT')}
                className="w-16 h-16 flex items-center justify-center bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-lg shadow"
              >
                →
              </Button>
            </div>
          </div>
          
          {/* Кнопки действий */}
          <div className="flex space-x-4">
            {gameStatus === 'idle' || gameStatus === 'game-over' ? (
              <Button
                onClick={startGame}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow"
              >
                {gameStatus === 'game-over' ? 'Играть снова' : 'Начать игру'}
              </Button>
            ) : (
              <Button
                onClick={togglePause}
                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg shadow"
              >
                {gameStatus === 'paused' ? 'Продолжить' : 'Пауза'}
              </Button>
            )}
            
            <Button
              onClick={resetGame}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow"
            >
              Сброс
            </Button>
          </div>
          
          {/* Экран окончания игры */}
          {gameStatus === 'game-over' && (
            <div className="mt-6 p-4 bg-red-100 border-2 border-red-300 rounded-lg text-center">
              <h2 className="text-2xl font-bold text-red-800">Игра окончена!</h2>
              <p className="text-xl mt-2">Ваш счет: <span className="font-bold text-red-600">{score}</span></p>
              <Button 
                onClick={startGame}
                className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow"
              >
                Играть снова
              </Button>
            </div>
          )}
          
          {/* Инструкции */}
          <div className="mt-6 text-sm text-gray-600 text-center">
            <p>Используйте стрелки на клавиатуре для управления</p>
            <p>Нажмите Пробел для паузы/возобновления</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;