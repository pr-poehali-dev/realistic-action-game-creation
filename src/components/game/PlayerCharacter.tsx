
import React from 'react';
import { useGameContext } from './GameContext';

const PlayerCharacter: React.FC = () => {
  const { player, mousePosition } = useGameContext();
  
  // Вычисляем угол поворота игрока для направления оружия
  const angle = Math.atan2(
    mousePosition.y - player.position.y,
    mousePosition.x - player.position.x
  ) * (180 / Math.PI);

  return (
    <div 
      className="absolute w-8 h-8 transform -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${player.position.x}%`,
        top: `${player.position.y}%`,
      }}
    >
      {/* Тело персонажа */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute inset-0 bg-blue-600 rounded-full border-2 border-blue-700 shadow-inner z-10"></div>
        
        {/* Индикатор здоровья */}
        <div 
          className="absolute w-8 h-1 bg-red-800 -top-3 left-0 rounded-full overflow-hidden"
        >
          <div 
            className="h-full bg-red-500" 
            style={{ width: `${player.health}%` }}
          ></div>
        </div>
      </div>
      
      {/* Оружие */}
      <div 
        className="absolute top-1/2 left-1/2 h-2 w-8 bg-gray-700 rounded-sm origin-left z-20"
        style={{
          transform: `translate(-50%, -50%) rotate(${angle}deg)`,
        }}
      >
        <div className="absolute right-0 w-1 h-2 bg-gray-900"></div>
      </div>
    </div>
  );
};

export default PlayerCharacter;
