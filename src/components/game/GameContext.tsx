
import React, { createContext, useContext, useState, useEffect } from 'react';

type Coordinates = {
  x: number;
  y: number;
};

type Enemy = {
  id: string;
  position: Coordinates;
  health: number;
  type: 'static' | 'moving';
};

type Player = {
  position: Coordinates;
  health: number;
  score: number;
  ammo: number;
  weapon: string;
};

type GameContextType = {
  player: Player;
  enemies: Enemy[];
  mousePosition: Coordinates;
  timeLeft: number;
  isGameOver: boolean;
  isPaused: boolean;
  updatePlayerPosition: (x: number, y: number) => void;
  updateMousePosition: (x: number, y: number) => void;
  shootWeapon: () => void;
  hitEnemy: (id: string) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  restartGame: () => void;
};

const defaultGameContext: GameContextType = {
  player: {
    position: { x: 50, y: 50 },
    health: 100,
    score: 0,
    ammo: 30,
    weapon: 'rifle',
  },
  enemies: [],
  mousePosition: { x: 0, y: 0 },
  timeLeft: 60,
  isGameOver: false,
  isPaused: false,
  updatePlayerPosition: () => {},
  updateMousePosition: () => {},
  shootWeapon: () => {},
  hitEnemy: () => {},
  pauseGame: () => {},
  resumeGame: () => {},
  restartGame: () => {},
};

const GameContext = createContext<GameContextType>(defaultGameContext);

export const useGameContext = () => useContext(GameContext);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [player, setPlayer] = useState<Player>(defaultGameContext.player);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [mousePosition, setMousePosition] = useState<Coordinates>({ x: 0, y: 0 });
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Инициализация врагов
  useEffect(() => {
    generateEnemies();
  }, []);

  // Игровой таймер
  useEffect(() => {
    if (isPaused || isGameOver) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          setIsGameOver(true);
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, isGameOver]);

  // Движение врагов
  useEffect(() => {
    if (isPaused || isGameOver) return;

    const enemyMovement = setInterval(() => {
      setEnemies((prevEnemies) => 
        prevEnemies.map((enemy) => {
          if (enemy.type === 'static') return enemy;
          
          // Случайное движение для динамических врагов
          const newX = enemy.position.x + (Math.random() * 10 - 5);
          const newY = enemy.position.y + (Math.random() * 10 - 5);
          
          // Ограничиваем движение в пределах поля
          const boundedX = Math.min(Math.max(newX, 5), 95);
          const boundedY = Math.min(Math.max(newY, 5), 95);
          
          return {
            ...enemy,
            position: { x: boundedX, y: boundedY }
          };
        })
      );
    }, 500);

    return () => clearInterval(enemyMovement);
  }, [enemies, isPaused, isGameOver]);

  const generateEnemies = () => {
    const newEnemies: Enemy[] = [];
    
    // Создаем несколько статичных врагов
    for (let i = 0; i < 5; i++) {
      newEnemies.push({
        id: `static-${i}`,
        position: {
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10
        },
        health: 100,
        type: 'static'
      });
    }
    
    // Создаем несколько двигающихся врагов
    for (let i = 0; i < 3; i++) {
      newEnemies.push({
        id: `moving-${i}`,
        position: {
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10
        },
        health: 75,
        type: 'moving'
      });
    }
    
    setEnemies(newEnemies);
  };

  const updatePlayerPosition = (x: number, y: number) => {
    setPlayer(prev => ({
      ...prev,
      position: { x, y }
    }));
  };

  const updateMousePosition = (x: number, y: number) => {
    setMousePosition({ x, y });
  };

  const shootWeapon = () => {
    if (player.ammo <= 0 || isGameOver || isPaused) return;
    
    setPlayer(prev => ({
      ...prev,
      ammo: prev.ammo - 1
    }));

    // Логика попадания по врагам будет обрабатываться в компоненте GameField
  };

  const hitEnemy = (id: string) => {
    setEnemies(prev => 
      prev.map(enemy => {
        if (enemy.id === id) {
          const newHealth = enemy.health - 25;
          
          // Если враг уничтожен, добавляем очки
          if (newHealth <= 0) {
            setPlayer(prevPlayer => ({
              ...prevPlayer,
              score: prevPlayer.score + (enemy.type === 'moving' ? 20 : 10)
            }));
            
            // Заменяем уничтоженного врага новым через 2 секунды
            setTimeout(() => {
              setEnemies(currentEnemies => [
                ...currentEnemies.filter(e => e.id !== enemy.id),
                {
                  id: `${enemy.type}-${Date.now()}`,
                  position: {
                    x: Math.random() * 80 + 10,
                    y: Math.random() * 80 + 10
                  },
                  health: enemy.type === 'moving' ? 75 : 100,
                  type: enemy.type
                }
              ]);
            }, 2000);
            
            return { ...enemy, health: 0 };
          }
          
          return { ...enemy, health: newHealth };
        }
        return enemy;
      })
    );
  };

  const pauseGame = () => setIsPaused(true);
  const resumeGame = () => setIsPaused(false);
  
  const restartGame = () => {
    setPlayer(defaultGameContext.player);
    generateEnemies();
    setTimeLeft(60);
    setIsGameOver(false);
    setIsPaused(false);
  };

  return (
    <GameContext.Provider value={{
      player,
      enemies,
      mousePosition,
      timeLeft,
      isGameOver,
      isPaused,
      updatePlayerPosition,
      updateMousePosition,
      shootWeapon,
      hitEnemy,
      pauseGame,
      resumeGame,
      restartGame
    }}>
      {children}
    </GameContext.Provider>
  );
};
