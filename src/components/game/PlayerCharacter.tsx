
import React from 'react';
import { useGameContext } from './GameContext';

interface PlayerCharacterProps {
  x: number;
  y: number;
}

const PlayerCharacter: React.FC<PlayerCharacterProps> = ({ x, y }) => {
  const { mousePosition } = useGameContext();
  
  // Вычисляем угол поворота персонажа к курсору мыши
  const dx = mousePosition.x - x;
  const dy = mousePosition.y - y;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  
  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: '40px',
        height: '40px',
      }}
    >
      {/* Тело персонажа */}
      <div
        className="absolute rounded-full bg-blue-500 border-2 border-blue-600 z-10"
        style={{
          width: '24px',
          height: '24px',
        }}
      />
      
      {/* Оружие/ствол */}
      <div
        className="absolute bg-gray-700 rounded-sm transition-transform z-20"
        style={{
          width: '18px',
          height: '6px',
          transformOrigin: 'left center',
          transform: `translateX(8px) rotate(${angle}deg)`,
          left: '50%',
          top: '50%',
          marginTop: '-3px',
          marginLeft: '-6px',
        }}
      />
      
      {/* Линия прицеливания (необязательно) */}
      <div
        className="absolute bg-gray-500 opacity-20 rounded-full"
        style={{
          width: '2px',
          height: '2px',
          transformOrigin: 'center',
          transform: `rotate(${angle}deg)`,
          boxShadow: '0 0 20px 20px rgba(255,255,255,0.03)',
        }}
      />
    </div>
  );
};

export default PlayerCharacter;
