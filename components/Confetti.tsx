
import React, { useMemo } from 'react';

const ConfettiPiece: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div className="confetti" style={style}></div>
);

const Confetti: React.FC = () => {
  const confettiPieces = useMemo(() => {
    const pieces = [];
    const colors = ['#ffffff', '#ffdd55', '#ff7aa0'];
    for (let i = 0; i < 120; i++) {
      pieces.push({
        id: i,
        style: {
          left: `${Math.random() * 100}vw`,
          backgroundColor: colors[Math.floor(Math.random() * colors.length)],
          animationDelay: `${Math.random() * 5}s`,
          transform: `rotate(${Math.random() * 360}deg)`,
          width: `${Math.floor(Math.random() * 8) + 8}px`,
          height: `${Math.floor(Math.random() * 8) + 8}px`,
          opacity: Math.random() * 0.5 + 0.5,
        },
      });
    }
    return pieces;
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50 overflow-hidden">
      {confettiPieces.map(piece => (
        <ConfettiPiece key={piece.id} style={piece.style} />
      ))}
    </div>
  );
};

export default React.memo(Confetti);
