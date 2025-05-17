
import React, { useEffect, useState } from 'react';

type BulletProps = {
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  progress: number;
};

const Bullet: React.FC<BulletProps> = ({
  startX,
  startY,
  targetX,
  targetY,
  progress,
}) => {
  // Рассчитываем текущую позицию пули
  const currentX = startX + (targetX - startX) * (progress / 100);
  const currentY = startY + (targetY - startY) * (progress / 100);

  // Рассчитываем угол полета пули
  const angle = Math.atan2(targetY - startY, targetX - startX) * (180 / Math.PI);

  return (
    <div
      className="absolute w-3 h-1 bg-yellow-500 rounded-full shadow-[0_0_3px_1px_rgba(255,200,0,0.5)] z-20"
      style={{
        left: `${currentX}%`,
        top: `${currentY}%`,
        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
      }}
    >
      {/* Светящийся след пули */}
      <div className="absolute top-0 left-0 w-2 h-1 bg-yellow-300 rounded-full opacity-70"></div>
      <div className="absolute top-0 left-0 w-1 h-1 bg-white rounded-full opacity-90"></div>
    </div>
  );
};

export default Bullet;
