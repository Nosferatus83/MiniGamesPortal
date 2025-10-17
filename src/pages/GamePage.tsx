import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FifteenGame from '../games/Fifteen/FifteenGame';
import SnakeGame from '../games/Snake/SnakeGame';
import PacmanGame from '../games/Pacman/PacmanGame';
import ArkanoidGame from '../games/ArkanoidGame';

const GamePage: React.FC = () => {
  const { gameName } = useParams<{ gameName: string }>();
  const navigate = useNavigate();

  const renderGame = () => {
    switch (gameName) {
      case 'fifteen':
        return <FifteenGame />;
      case 'snake':
        return <SnakeGame />;
      case 'pacman':
        return <PacmanGame />;
      case 'arkanoid':
        return <ArkanoidGame />;
      default:
        return <div>Игра не найдена</div>;
    }
  };

  return (
    <div className="h-full bg-gray-50 overflow-y-hidden">
      <div className="container mx-auto px-4 py-8 flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-blue-500 hover:text-blue-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            На главную
          </button>
          <h1 className="text-2xl font-bold text-gray-800 capitalize">{gameName}</h1>
        </div>
        
        <div className="flex justify-center">
          {renderGame()}
        </div>
      </div>
    </div>
  );
};

export default GamePage;