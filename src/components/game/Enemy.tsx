
import React from 'react';
import { useGameContext } from './GameContext';

type EnemyProps = {
  enemy: {
    id: string;
    position: { x: number; y: number };
    health: number;
    type: 'static' | 'moving';
  };
};

const Enemy: React.FC<EnemyProps> = ({ enemy }) => {
  // Если здоровье врага 0, показываем анимацию уничтожения
  if (enemy.health <= 0) {
    return (
      <div
        className="absolute w-8 h-8 transform -translate-x-1/2 -translate-y-1/2 animate-[explosion_0.5s_ease-out_forwards]"
        style={{
          left: `${enemy.position.x}%`,
          top: `${enemy.position.y}%`,
        }}
      >
        <div className="absolute inset-0 bg-orange-500 rounded-full opacity-75 animate-ping"></div>
        <div className="absolute inset-0 bg-red-600 rounded-full animate-[fade-out_0.5s_ease-out_forwards]"></div>
      </div>
    );
  }

  // Определяем цвет врага в зависимости от его типа
  const enemyColor = enemy.type === 'static' ? 'bg-red-600' : 'bg-orange-500';
  const enemyBorder = enemy.type === 'static' ? 'border-red-700' : 'border-orange-600';

  return (
    <div
      className="absolute w-8 h-8 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
      style={{
        left: `${enemy.position.x}%`,
        top: `${enemy.position.y}%`,
      }}
    >
      {/* Тело врага */}
      <div className={`absolute inset-0 ${enemyColor} rounded-full border-2 ${enemyBorder} shadow-inner`}></div>
      
      {/* Индикатор здоровья */}
      <div 
        className="absolute w-8 h-1 bg-gray-800 -top-3 left-0 rounded-full overflow-hidden"
      >
        <div 
          className="h-full bg-green-500 transition-all duration-300" 
          style={{ width: `${enemy.health}%` }}
        ></div>
      </div>
      
      {/* Пульсация для движущихся врагов */}
      {enemy.type === 'moving' && (
        <div className="absolute inset-0 bg-orange-400 rounded-full opacity-30 animate-pulse"></div>
      )}
    </div>
  );
};

export default Enemy;
