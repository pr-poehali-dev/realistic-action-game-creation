
import React, { useEffect, useRef } from 'react';
import { useGameContext } from './GameContext';

interface EnemyProps {
  id: string;
  x: number;
  y: number;
  health: number;
  type: 'static' | 'moving';
  bullets: Array<{id: string, x: number, y: number, angle: number}>;
}

const Enemy: React.FC<EnemyProps> = ({ id, x, y, health, type, bullets }) => {
  const { hitEnemy } = useGameContext();
  const enemyRef = useRef<HTMLDivElement>(null);
  const [isHit, setIsHit] = useState(false);
  const [isDestroyed, setIsDestroyed] = useState(false);
  
  // Проверка столкновения пуль с врагом
  useEffect(() => {
    if (!enemyRef.current) return;
    
    const enemyRect = {
      x: x - 2, // 2% - половина ширины врага
      y: y - 2, // 2% - половина высоты врага
      width: 4,  // 4% от ширины поля
      height: 4  // 4% от высоты поля
    };
    
    for (const bullet of bullets) {
      // Проверяем, находится ли пуля внутри врага
      if (
        bullet.x >= enemyRect.x &&
        bullet.x <= enemyRect.x + enemyRect.width &&
        bullet.y >= enemyRect.y &&
        bullet.y <= enemyRect.y + enemyRect.height
      ) {
        // Пуля попала во врага
        hitEnemy(id);
        setIsHit(true);
        
        setTimeout(() => setIsHit(false), 200);
        break;
      }
    }
  }, [bullets, id, x, y, hitEnemy]);
  
  // Если здоровье врага равно 0, показываем анимацию уничтожения
  useEffect(() => {
    if (health <= 0 && !isDestroyed) {
      setIsDestroyed(true);
    }
  }, [health, isDestroyed]);
  
  if (isDestroyed) {
    return (
      <div 
        className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 animate-explosion"
        style={{ 
          left: `${x}%`,
          top: `${y}%`,
          width: '40px',
          height: '40px',
        }}
      />
    );
  }
  
  return (
    <div 
      ref={enemyRef}
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300
                ${type === 'static' ? 'bg-red-500' : 'bg-orange-500'} 
                ${isHit ? 'scale-110 opacity-70' : ''}`}
      style={{ 
        left: `${x}%`,
        top: `${y}%`,
        width: '32px',
        height: '32px',
        borderRadius: type === 'static' ? '2px' : '50%',
      }}
    >
      {/* Полоса здоровья */}
      <div className="absolute -top-3 left-0 w-full h-1 bg-gray-800">
        <div
          className="h-full bg-green-500"
          style={{ width: `${(health / (type === 'static' ? 100 : 75)) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default Enemy;
