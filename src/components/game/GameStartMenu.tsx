
import React from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

type GameStartMenuProps = {
  onStart: () => void;
};

const GameStartMenu: React.FC<GameStartMenuProps> = ({ onStart }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[url('https://images.unsplash.com/photo-1526125610013-5c1296e27f83?auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center">
      <div className="bg-black bg-opacity-70 p-10 rounded-lg text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-white mb-6 font-['Play'] tracking-wider">
          ТАКТИЧЕСКИЙ ШТУРМ
        </h1>
        
        <p className="text-gray-300 mb-8 text-lg font-['Roboto']">
          Докажите свои навыки в тактическом бою. Уничтожайте врагов, набирайте очки и выживайте как можно дольше!
        </p>
        
        <div className="mb-10">
          <Button 
            onClick={onStart}
            className="bg-red-600 hover:bg-red-700 text-white text-xl px-10 py-6 rounded-md shadow-lg border-none transition-transform hover:scale-105"
          >
            <Icon name="Target" className="w-6 h-6 mr-2" />
            НАЧАТЬ ИГРУ
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-6 text-left text-gray-300 font-['Roboto']">
          <div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center">
              <Icon name="Keyboard" className="w-5 h-5 mr-2 text-blue-400" />
              Управление
            </h3>
            <ul className="space-y-1 text-sm">
              <li>WASD - Перемещение</li>
              <li>МЫШЬ - Прицеливание</li>
              <li>ЛКМ - Стрельба</li>
              <li>ESC - Пауза</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center">
              <Icon name="Info" className="w-5 h-5 mr-2 text-blue-400" />
              Цель
            </h3>
            <p className="text-sm">
              Уничтожайте врагов до истечения времени. Движущиеся цели приносят больше очков.
            </p>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-4 left-0 right-0 text-center text-gray-500 text-xs">
        Управляйте движением с помощью клавиш WASD, целься мышью, стреляй левой кнопкой мыши
      </div>
    </div>
  );
};

export default GameStartMenu;
