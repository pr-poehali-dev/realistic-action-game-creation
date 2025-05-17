
import React from 'react';
import { useGameContext } from './GameContext';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const GameHUD: React.FC = () => {
  const { 
    player, 
    timeLeft, 
    isPaused, 
    isGameOver,
    pauseGame,
    resumeGame,
    restartGame
  } = useGameContext();

  // Форматирование времени в формат мм:сс
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Верхняя панель с информацией */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-black bg-opacity-50 font-['Play']">
        <div className="flex items-center gap-4">
          {/* Здоровье */}
          <div className="flex items-center text-white">
            <Icon name="Heart" className="w-5 h-5 text-red-500 mr-1" />
            <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden mr-1">
              <div 
                className="h-full bg-red-500 transition-all duration-300" 
                style={{ width: `${player.health}%` }}
              />
            </div>
            <span className="text-sm">{player.health}</span>
          </div>

          {/* Патроны */}
          <div className="flex items-center text-white">
            <Icon name="Crosshair" className="w-5 h-5 text-yellow-500 mr-1" />
            <span className="text-sm">{player.ammo}</span>
          </div>
        </div>

        {/* Таймер и счет */}
        <div className="flex items-center gap-4">
          <div className="flex items-center text-white">
            <Icon name="Medal" className="w-5 h-5 text-yellow-500 mr-1" />
            <span className="text-sm font-bold">{player.score}</span>
          </div>
          
          <div className="flex items-center text-white">
            <Icon name="Clock" className="w-5 h-5 text-blue-400 mr-1" />
            <span className="text-sm font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Кнопки управления (пауза/продолжить/перезапуск) */}
      <div className="absolute top-4 right-4 pointer-events-auto">
        {!isGameOver ? (
          isPaused ? (
            <Button onClick={resumeGame} variant="outline" size="sm" className="bg-green-600 hover:bg-green-700 text-white border-none">
              <Icon name="Play" className="w-4 h-4 mr-1" />
              Продолжить
            </Button>
          ) : (
            <Button onClick={pauseGame} variant="outline" size="sm" className="bg-gray-700 hover:bg-gray-800 text-white border-none">
              <Icon name="Pause" className="w-4 h-4 mr-1" />
              Пауза
            </Button>
          )
        ) : (
          <Button onClick={restartGame} variant="outline" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white border-none">
            <Icon name="RefreshCw" className="w-4 h-4 mr-1" />
            Начать заново
          </Button>
        )}
      </div>

      {/* Оверлей для конца игры */}
      {isGameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 pointer-events-auto">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-2 font-['Play']">ИГРА ОКОНЧЕНА</h2>
            <p className="text-xl text-gray-300 mb-6 font-['Play']">Ваш счёт: {player.score}</p>
            
            <Button onClick={restartGame} className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg border-none">
              <Icon name="Redo2" className="w-5 h-5 mr-2" />
              Играть снова
            </Button>
          </div>
        </div>
      )}

      {/* Оверлей для паузы */}
      {isPaused && !isGameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 pointer-events-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6 font-['Play']">ПАУЗА</h2>
            <Button onClick={resumeGame} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 text-lg border-none mb-4">
              <Icon name="Play" className="w-5 h-5 mr-2" />
              Продолжить
            </Button>
            <Button onClick={restartGame} variant="outline" className="bg-transparent hover:bg-gray-800 text-white border-white border-2 px-6 py-2 text-lg">
              <Icon name="RefreshCw" className="w-5 h-5 mr-2" />
              Начать заново
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameHUD;
