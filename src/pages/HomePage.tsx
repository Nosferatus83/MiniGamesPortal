import React from 'react';
import { Link } from 'react-router-dom';
import { FaGamepad, FaDragon, FaGhost, FaBaseballBall } from 'react-icons/fa';

const HomePage: React.FC = () => {
  const games = [
    {
      id: 'fifteen',
      title: 'Пятнашки',
      iconComponent: () => <FaGamepad className="text-4xl text-blue-500" />,
      path: '/game/fifteen'
    },
    {
      id: 'snake',
      title: 'Змейка',
      iconComponent: () => <FaDragon className="text-4xl" style={{ color: '#84cc16' }} />,
      path: '/game/snake'
    },
    {
      id: 'pacman',
      title: 'Pac-Man',
      iconComponent: () => <FaGhost className="text-4xl text-yellow-500" />,
      path: '/game/pacman'
    },
    {
      id: 'arkanoid',
      title: 'Arkanoid',
      iconComponent: () => <FaBaseballBall className="text-4xl text-red-500" />,
      path: '/game/arkanoid'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">
        Добро пожаловать в Мини-Игровой Портал
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {games.map((game) => (
          <Link
            key={game.id}
            to={game.path}
            className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-lg border border-gray-200"
          >
            <div className="mb-4">
              {game.iconComponent()}
            </div>
            <h2 className="text-xl font-semibold text-gray-800 text-center">
              {game.title}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;