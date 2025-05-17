
import React, { useEffect, useRef, useState } from 'react';
import { useGameContext } from './GameContext';
import PlayerCharacter from './PlayerCharacter';
import Enemy from './Enemy';
import Bullet from './Bullet';

type Bullet = {
  id: string;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  progress: number;
};

const GameField: React.FC = () => {
  const { 
    player, 
    enemies, 
    mousePosition, 
    updatePlayerPosition, 
    updateMousePosition,
    shootWeapon,
    hitEnemy,
    isGameOver,
    isPaused
  } = useGameContext();
  
  const fieldRef = useRef<HTMLDivElement>(null);
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const animationRef = useRef<number | null>(null);

  // Настройка обработчиков клавиатуры
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver || isPaused) return;
      
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(key)) {
        setKeysPressed(prev => {
          const newKeys = new Set(prev);
          newKeys.add(key);
          return newKeys;
        });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(key)) {
        setKeysPressed(prev => {
          const newKeys = new Set(prev);
          newKeys.delete(key);
          return newKeys;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isGameOver, isPaused]);

  // Обработчик движения мыши
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!fieldRef.current || isGameOver || isPaused) return;
      
      const rect = fieldRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      updateMousePosition(x, y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [updateMousePosition, isGameOver, isPaused]);

  // Обработчик клика мыши (стрельба)
  useEffect(() => {
    const handleMouseClick = () => {
      if (isGameOver || isPaused) return;
      
      shootWeapon();
      
      // Создаем новую пулю
      const newBullet = {
        id: `bullet-${Date.now()}`,
        startX: player.position.x,
        startY: player.position.y,
        targetX: mousePosition.x,
        targetY: mousePosition.y,
        progress: 0
      };
      
      setBullets(prev => [...prev, newBullet]);
    };

    window.addEventListener('click', handleMouseClick);
    
    return () => {
      window.removeEventListener('click', handleMouseClick);
    };
  }, [player.position, mousePosition, shootWeapon, isGameOver, isPaused]);

  // Игровой цикл
  useEffect(() => {
    if (isGameOver || isPaused) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const gameLoop = () => {
      // Обработка движения игрока
      if (keysPressed.size > 0) {
        let newX = player.position.x;
        let newY = player.position.y;
        const moveSpeed = 1;

        if (keysPressed.has('w')) newY = Math.max(0, newY - moveSpeed);
        if (keysPressed.has('s')) newY = Math.min(100, newY + moveSpeed);
        if (keysPressed.has('a')) newX = Math.max(0, newX - moveSpeed);
        if (keysPressed.has('d')) newX = Math.min(100, newX + moveSpeed);

        updatePlayerPosition(newX, newY);
      }

      // Обновление позиций пуль и проверка попаданий
      setBullets(prev => 
        prev.filter(bullet => {
          // Увеличиваем прогресс пули
          const newProgress = bullet.progress + 5;
          
          // Если пуля достигла конца траектории, удаляем ее
          if (newProgress >= 100) return false;
          
          // Текущая позиция пули
          const currentX = bullet.startX + (bullet.targetX - bullet.startX) * (newProgress / 100);
          const currentY = bullet.startY + (bullet.targetY - bullet.startY) * (newProgress / 100);
          
          // Проверка попаданий по врагам
          for (const enemy of enemies) {
            if (enemy.health <= 0) continue; // Пропускаем уже уничтоженных врагов
            
            // Проверяем расстояние от пули до врага
            const dx = enemy.position.x - currentX;
            const dy = enemy.position.y - currentY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Если расстояние меньше размера врага, засчитываем попадание
            if (distance < 4) {
              hitEnemy(enemy.id);
              return false; // Пуля исчезает при попадании
            }
          }
          
          // Обновляем прогресс пули
          return { ...bullet, progress: newProgress };
        })
      );

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [
    keysPressed, 
    player.position, 
    updatePlayerPosition, 
    enemies, 
    hitEnemy, 
    isGameOver,
    isPaused
  ]);

  return (
    <div 
      ref={fieldRef}
      className="w-full h-screen bg-[#242424] relative overflow-hidden"
      style={{ cursor: 'crosshair' }}
    >
      {/* Игровое поле */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519666336592-e225a99dcd2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center opacity-20"></div>
      
      {/* Визуальная сетка для тактического поля */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      {/* Персонаж игрока */}
      <PlayerCharacter />
      
      {/* Враги */}
      {enemies.map((enemy) => (
        <Enemy key={enemy.id} enemy={enemy} />
      ))}
      
      {/* Пули */}
      {bullets.map((bullet) => (
        <Bullet 
          key={bullet.id}
          startX={bullet.startX}
          startY={bullet.startY}
          targetX={bullet.targetX}
          targetY={bullet.targetY}
          progress={bullet.progress}
        />
      ))}
      
      {/* Линия прицеливания */}
      <div 
        className="absolute pointer-events-none"
        style={{
          left: `${player.position.x}%`,
          top: `${player.position.y}%`,
          width: '1px',
          height: '1px'
        }}
      >
        <div 
          className="absolute h-[1px] bg-red-500 opacity-50 origin-left"
          style={{
            width: '100px',
            transform: `rotate(${Math.atan2(
              mousePosition.y - player.position.y,
              mousePosition.x - player.position.x
            ) * (180 / Math.PI)}deg)`
          }}
        />
      </div>
      
      {/* Наложение эффекта при паузе или окончании игры */}
      {(isPaused || isGameOver) && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-white text-2xl font-bold">
            {isPaused ? "ПАУЗА" : "ИГРА ОКОНЧЕНА"}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameField;
