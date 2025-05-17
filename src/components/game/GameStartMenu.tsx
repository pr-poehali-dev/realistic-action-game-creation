
import React from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface GameStartMenuProps {
  onStart: () => void;
}

const GameStartMenu: React.FC<GameStartMenuProps> = ({ onStart }) => {
  return (
    <div className="w-full max-w-2xl p-8 bg-gray-900 bg-opacity-80 rounded-lg text-center font-['Play']">
      <h1 className="text-5xl font-bold text-white mb-4">ТАКТИЧЕСКИЙ ШТУРМ</h1>
      <p className="text-xl text-gray-300 mb-8">Выживи и уничтожь всех врагов!</p>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold text-yellow-400 mb-3">КАК ИГРАТЬ:</h2>
        <div className="grid grid-cols-2 gap-4 text-white text-sm">
          <div className="bg-gray-800 bg-opacity-70 p-3 rounded flex items-center gap-2">
            <span className="bg-gray-700 px-2 py-1 rounded font-bold">WASD</span>
            <span>Движение персонажа</span>
          </div>
          <div className="bg-gray-800 bg-opacity-70 p-3 rounded flex items-center gap-2">
            <span className="bg-gray-700 px-2 py-1 rounded font-bold">МЫШЬ</span>
            <span>Прицеливание</span>
          </div>
          <div className="bg-gray-800 bg-opacity-70 p-3 rounded flex items-center gap-2">
            <span className="bg-gray-700 px-2 py-1 rounded font-bold">ЛКМ</span>
            <span>Стрельба</span>
          </div>
          <div className="bg-gray-800 bg-opacity-70 p-3 rounded flex items-center gap-2">
            <span className="bg-gray-700 px-2 py-1 rounded font-bold">ESC</span>
            <span>Пауза</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <Button 
          onClick={onStart} 
          className="w-full py-6 text-xl font-bold bg-red-600 hover:bg-red-700 transition-all border-none"
        >
          <Icon name="Play" className="w-5 h-5 mr-2" />
          НАЧАТЬ ИГРУ
        </Button>
        
        <p className="text-sm text-gray-400">
          Уничтожайте врагов, получайте очки и следите за запасом патронов!
        </p>
      </div>
    </div>
  );
};

export default GameStartMenu;
