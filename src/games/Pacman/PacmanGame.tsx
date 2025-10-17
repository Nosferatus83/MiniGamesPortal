import React from 'react';
import { usePacmanGame } from './usePacmanGame';

// Вспомогательная функция для отображения ячейки уровня
const renderCell = (cell: any) => {
  if (!cell) return <div className="bg-gray-10 w-5 h-5"></div>;
  
  switch (cell.constructor.name) {
    case 'Wall':
      return <div className="bg-gray-800 w-5 h-5"></div>;
    case 'Food':
      if (cell.type === 'food') {
        return <div className="bg-gray-100 w-5 h-5 flex items-center justify-center"><div className="bg-yellow-300 rounded-full w-1 h-1"></div></div>;
      } else if (cell.type === 'superfood') {
        return <div className="bg-gray-100 w-5 h-5 flex items-center justify-center"><div className="bg-yellow-300 rounded-full w-3 h-3"></div></div>;
      }
      return <div className="bg-gray-100 w-5 h-5"></div>;
    case 'Empty':
      return <div className="bg-gray-100 w-5 h-5"></div>;
    default:
      return <div className="bg-gray-100 w-5 h-5"></div>;
  }
};

const PacmanGame: React.FC = () => {
  const { level, pacman, ghosts, score, lives, gameStatus, animationFrame, startGame, togglePause, resetGame } = usePacmanGame();

  const renderGameBoard = () => {
    // Убираем деструктуризацию gameState, так как теперь используем отдельные значения
    
    // Отображаем Pac-Man и призраков отдельно от уровня
    return (
      <div className="relative">
        <div className="grid gap-0 border-2 border-gray-800 relative w-full" style={{display: 'grid', gridTemplateColumns: `repeat(${level.width}, 1fr)`}}>
          {level.grid.map((row, rowIndex) => (
            <div key={rowIndex} className="flex w-full" style={{display: 'contents'}}>
              {row.map((cell, colIndex) => (
                <div key={`${rowIndex}-${colIndex}`} className="relative flex-shrink-0" style={{width: '30px', height: '30px'}}>
                  {renderCell(cell)}
                </div>
              ))}
            </div>
          ))}
          
          {/* Отображаем Pac-Man */}
          <div className="absolute" style={{left: `${pacman.x * 30}px`, top: `${pacman.y * 30}px`, width: '30px', height: '30px'}}>
            <div
              className={`w-5 h-5 bg-yellow-400 rounded-full z-10 ${
                animationFrame === 0
                  ? pacman.direction === 'right' ? 'clip-path-pacman-right'
                    : pacman.direction === 'left' ? 'clip-path-pacman-left'
                    : pacman.direction === 'up' ? 'clip-path-pacman-up'
                    : 'clip-path-pacman-down'
                  : 'clip-path-pacman-closed'
              }`}
            ></div>
          </div>
          
          {/* Добавляем CSS для анимации Pacman и призраков */}
          <style>{`
            .clip-path-pacman-right { clip-path: polygon(0 0, 100% 25%, 100% 75%, 0 100%, 50% 50%); }
            .clip-path-pacman-left { clip-path: polygon(100% 0, 0 25%, 0 75%, 100% 100%, 50% 50%); }
            .clip-path-pacman-up { clip-path: polygon(0 100%, 25% 0, 75% 0, 100% 100%, 50%); }
            .clip-path-pacman-down { clip-path: polygon(0 0, 25% 100%, 75% 100%, 100% 0, 50% 50%); }
            .clip-path-pacman-closed { clip-path: circle(50%); }
            
            .ghost-sway-left {
              transform: translateX(-1px);
              transition: transform 0.2s ease-in-out;
            }
            
            .ghost-sway-right {
              transform: translateX(1px);
              transition: transform 0.2s ease-in-out;
            }
          `}</style>
          
          {/* Отображаем призраков */}
          {ghosts.map((ghost, index) => (
            <div key={index} className="absolute" style={{left: `${ghost.x * 30}px`, top: `${ghost.y * 30}px`, width: '30px', height: '30px'}}>
              <div className={`w-5 h-5 bg-${ghost.color}-500 rounded-t-full z-10 ${
                animationFrame === 0 ? 'ghost-sway-left' : 'ghost-sway-right'
              }`}></div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-200 p-4 overflow-y-hidden">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Pacman</h1>
        
        <div className="mb-4 flex justify-between items-center">
          <div className="text-lg font-semibold text-gray-700">
            Очки: <span className="text-blue-600">{score}</span>
          </div>
          <div className="text-lg font-semibold text-gray-700">
            Жизни: <span className="text-red-600">{lives}</span>
          </div>
        </div>
        
        <div className="relative mb-4 flex justify-center w-full">
          {renderGameBoard()}
          
          {gameStatus === 'won' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white text-4xl font-bold">
              ПОБЕДА!
            </div>
          )}
          
          {gameStatus === 'lost' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white text-4xl font-bold">
              ИГРА ОКОНЧЕНА
            </div>
          )}
          
          
          {gameStatus === 'paused' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
              <button
                onClick={togglePause}
                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg shadow"
              >
                ПРОДОЛЖИТЬ
              </button>
            </div>
          )}
        </div>
        
        <div className="flex space-x-4 justify-center">
          {gameStatus !== 'playing' && (
            <button
              onClick={startGame}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow"
            >
              НАЧАТЬ ИГРУ
            </button>
          )}
          {gameStatus === 'playing' && (
            <button
              onClick={togglePause}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg shadow"
            >
              ПАУЗА
            </button>
          )}
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow"
          >
            СБРОС
          </button>
        </div>
        
        <div className="mt-4 text-sm text-gray-600 text-center">
          Используйте стрелки для управления
        </div>
      </div>
    </div>
  );
};

export default PacmanGame;