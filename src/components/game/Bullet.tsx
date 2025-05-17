
import React from 'react';

interface BulletProps {
  x: number;
  y: number;
  angle: number;
}

const Bullet: React.FC<BulletProps> = ({ x, y, angle }) => {
  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: '6px',
        height: '6px',
        boxShadow: '0 0 3px 1px rgba(255, 215, 0, 0.5)',
      }}
    />
  );
};

export default Bullet;
