import React, { useState, useEffect } from 'react';
import { initializeBoard, canMoveTile, checkWin, makeMove } from './helpers';
import { GameState } from './types';

const FifteenGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: initializeBoard(),
    moves: 0,
    time: 0,
    isPlaying: false,
    isPaused: false,
    isGameOver: false
  });

  // Таймер
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (gameState.isPlaying && !gameState.isPaused && !gameState.isGameOver) {
      interval = setInterval(() => {
        setGameState(prev => ({ ...prev, time: prev.time + 1 }));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState.isPlaying, gameState.isPaused, gameState.isGameOver]);

  // Обработка клика по плитке
  const handleTileClick = (index: number) => {
    if (gameState.isPaused || gameState.isGameOver) return;

    if (!gameState.isPlaying) {
      setGameState(prev => ({ ...prev, isPlaying: true }));
    }

    setGameState(prev => makeMove(prev, index));
  };

  // Начать новую игру
  const startNewGame = () => {
    setGameState({
      board: initializeBoard(),
      moves: 0,
      time: 0,
      isPlaying: false,
      isPaused: false,
      isGameOver: false
    });
  };

  // Пауза/Возобновление
  const togglePause = () => {
    if (!gameState.isPlaying || gameState.isGameOver) return;
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  // Форматирование времени (MM:SS)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const minsStr = mins < 10 ? `0${mins}` : mins.toString();
    const secsStr = secs < 10 ? `0${secs}` : secs.toString();
    return `${minsStr}:${secsStr}`;
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-200 p-4 overflow-y-hidden">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Пятнашки</h1>
      
      <div className="mb-6 flex space-x-4">
        <button
          onClick={startNewGame}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Начать заново
        </button>
        <button
          onClick={togglePause}
          disabled={!gameState.isPlaying || gameState.isGameOver}
          className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 ${
            !gameState.isPlaying || gameState.isGameOver
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-yellow-500 text-white hover:bg-yellow-600'
          }`}
        >
          {gameState.isPaused ? 'Возобновить' : 'Пауза'}
        </button>
      </div>

      <div className="mb-4 flex space-x-6">
        <div className="text-lg font-semibold text-gray-700">
          Ходы: <span className="text-blue-600">{gameState.moves}</span>
        </div>
        <div className="text-lg font-semibold text-gray-700">
          Время: <span className="text-green-600">{formatTime(gameState.time)}</span>
        </div>
      </div>

      {/* Игровое поле */}
      <div className="grid grid-cols-4 gap-2 mb-6 w-full max-w-md">
        {gameState.board.map((tile, index) => (
          <div
            key={index}
            className={`aspect-square flex items-center justify-center rounded-lg shadow-md ${
              tile === null
                ? 'bg-transparent'
                : canMoveTile(gameState.board, index)
                ? 'cursor-pointer bg-white hover:bg-blue-100 transform transition-transform hover:scale-105'
                : 'bg-white'
            }`}
          >
            {tile !== null && (
              <button
                onClick={() => handleTileClick(index)}
                disabled={gameState.isPaused || gameState.isGameOver}
                className={`w-full h-full flex items-center justify-center text-xl font-bold rounded-lg ${
                  canMoveTile(gameState.board, index) && !gameState.isPaused && !gameState.isGameOver
                    ? 'cursor-pointer'
                    : 'cursor-default'
                }`}
              >
                {tile}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Экран победы */}
      {gameState.isGameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-sm">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Поздравляем! Вы выиграли!</h2>
            <p className="text-lg mb-2">Ходов: <span className="font-semibold">{gameState.moves}</span></p>
            <p className="text-lg mb-6">Время: <span className="font-semibold">{formatTime(gameState.time)}</span></p>
            <button
              onClick={startNewGame}
              className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Играть снова
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default FifteenGame;