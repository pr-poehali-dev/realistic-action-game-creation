import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
// Удаляем импорт react-helmet, который отсутствует в проекте
import { Button } from "@/components/ui/button";
import GameField from "@/components/game/GameField";
import GameHUD from "@/components/game/GameHUD";
import GameStartMenu from "@/components/game/GameStartMenu";
import { GameProvider } from "@/components/game/GameContext";

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);

  // Устанавливаем заголовок страницы без использования react-helmet
  useEffect(() => {
    document.title = "Тактический Штурм | Реалистичная игра-боевик";
    // Добавляем шрифты напрямую в head
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Play:wght@400;700&family=Roboto:wght@400;500;700&display=swap";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const startGame = () => {
    setGameStarted(true);
  };

  return (
    <div className="min-h-screen bg-[#242424] flex flex-col">
      <GameProvider>
        <main className="flex-1 flex items-center justify-center relative overflow-hidden">
          {!gameStarted ? (
            <GameStartMenu onStart={startGame} />
          ) : (
            <div className="w-full h-full relative">
              <GameField />
              <GameHUD />
            </div>
          )}
        </main>
      </GameProvider>

      <footer className="py-2 text-center text-gray-500 text-xs">
        <p>
          © {new Date().getFullYear()} Тактический Штурм | Создано с помощью
          Поехали!
        </p>
      </footer>
    </div>
  );
};

export default Index;
