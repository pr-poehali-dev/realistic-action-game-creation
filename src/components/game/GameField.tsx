
import React, { useEffect, useRef } from 'react';
import { useGameContext } from './GameContext';
import PlayerCharacter from './PlayerCharacter';
import Enemy from './Enemy';
import Bullet from './Bullet';

const GameField: React.FC = () => {
  const { 
    player, 
    enemies, 
    updatePlayerPosition, 
    updateMousePosition,
    shootWeapon,
    isPaused,
    isGameOver
  } = useGameContext();
  
  const gameFieldRef = useRef<HTMLDivElement>(null);
  const keysPressed = useRef<Record<string, boolean>>({});
  const bullets = useRef<Array<{id: string, x: number, y: number, angle: number}>>([]);
  const [bulletsList, setBulletsList] = React.useState<Array<{id: string, x: number, y: number, angle: number}>>([]);
  
  // Обработка нажатия клавиш
  useEffect(() => {
    if (isPaused || isGameOver) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true;
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Движение игрока по нажатию клавиш
    const moveInterval = setInterval(() => {
      if (isPaused || isGameOver) return;
      
      let newX = player.position.x;
      let newY = player.position.y;
      const speed = 0.5;
      
      if (keysPressed.current['w'] || keysPressed.current['arrowup']) {
        newY = Math.max(5, newY - speed);
      }
      if (keysPressed.current['s'] || keysPressed.current['arrowdown']) {
        newY = Math.min(95, newY + speed);
      }
      if (keysPressed.current['a'] || keysPressed.current['arrowleft']) {
        newX = Math.max(5, newX - speed);
      }
      if (keysPressed.current['d'] || keysPressed.current['arrowright']) {
        newX = Math.min(95, newX + speed);
      }
      
      if (newX !== player.position.x || newY !== player.position.y) {
        updatePlayerPosition(newX, newY);
      }
    }, 16); // 60fps
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(moveInterval);
    };
  }, [player.position, updatePlayerPosition, isPaused, isGameOver]);
  
  // Обработка движения мыши
  useEffect(() => {
    if (isPaused || isGameOver) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!gameFieldRef.current) return;
      
      const rect = gameFieldRef.current.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
      const mouseY = ((e.clientY - rect.top) / rect.height) * 100;
      
      updateMousePosition(mouseX, mouseY);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [updateMousePosition, isPaused, isGameOver]);
  
  // Обработка клика мыши (стрельба)
  useEffect(() => {
    if (isPaused || isGameOver) return;
    
    const handleMouseClick = () => {
      if (player.ammo <= 0) return;
      
      shootWeapon();
      
      // Вычисляем угол между игроком и курсором мыши
      const gameField = gameFieldRef.current;
      if (!gameField) return;
      
      const rect = gameField.getBoundingClientRect();
      const mouseX = ((event.clientX - rect.left) / rect.width) * 100;
      const mouseY = ((event.clientY - rect.top) / rect.height) * 100;
      
      const dx = mouseX - player.position.x;
      const dy = mouseY - player.position.y;
      const angle = Math.atan2(dy, dx);
      
      // Добавляем новую пулю
      const newBullet = {
        id: `bullet-${Date.now()}-${Math.random()}`,
        x: player.position.x,
        y: player.position.y,
        angle: angle
      };
      
      bullets.current = [...bullets.current, newBullet];
      setBulletsList(bullets.current);
    };
    
    window.addEventListener('click', handleMouseClick);
    
    return () => {
      window.removeEventListener('click', handleMouseClick);
    };
  }, [player, shootWeapon, bullets, isPaused, isGameOver]);
  
  // Анимация движения пуль
  useEffect(() => {
    if (isPaused || isGameOver) return;
    
    const bulletSpeed = 2;
    
    const bulletInterval = setInterval(() => {
      if (bullets.current.length === 0) return;
      
      bullets.current = bullets.current.map(bullet => {
        const vx = Math.cos(bullet.angle) * bulletSpeed;
        const vy = Math.sin(bullet.angle) * bulletSpeed;
        
        return {
          ...bullet,
          x: bullet.x + vx,
          y: bullet.y + vy
        };
      }).filter(bullet => {
        // Удаляем пули, которые вышли за границы поля
        return bullet.x >= 0 && bullet.x <= 100 && bullet.y >= 0 && bullet.y <= 100;
      });
      
      setBulletsList([...bullets.current]);
    }, 16);
    
    return () => {
      clearInterval(bulletInterval);
    };
  }, [bullets, isPaused, isGameOver]);
  
  return (
    <div 
      ref={gameFieldRef} 
      className="relative w-full h-screen bg-[#242424] bg-grid-pattern bg-grid-size overflow-hidden cursor-crosshair"
    >
      {/* Игрок */}
      <PlayerCharacter x={player.position.x} y={player.position.y} />
      
      {/* Враги */}
      {enemies.map((enemy) => (
        enemy.health > 0 && (
          <Enemy 
            key={enemy.id}
            id={enemy.id}
            x={enemy.position.x}
            y={enemy.position.y}
            health={enemy.health}
            type={enemy.type}
            bullets={bulletsList}
          />
        )
      ))}
      
      {/* Пули */}
      {bulletsList.map((bullet) => (
        <Bullet
          key={bullet.id}
          x={bullet.x}
          y={bullet.y}
          angle={bullet.angle}
        />
      ))}
    </div>
  );
};

export default GameField;
