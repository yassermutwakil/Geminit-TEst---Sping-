import React, { useState, useEffect, useMemo } from 'react';
import type { Prize } from '../types';

interface CardGameProps {
  prizes: Prize[];
  onPrizeSelect: (prize: Prize) => void;
}

const Card: React.FC<{
  prize: Prize | null;
  isSelected: boolean;
  isRevealed: boolean;
  isFaded: boolean;
  onClick: () => void;
  animationDelay: string;
}> = ({ prize, isSelected, isRevealed, isFaded, onClick, animationDelay }) => {
  
  const cardClasses = [
    'relative',
    'w-32', 'h-48',
    'md:w-36', 'md:h-56',
    'cursor-pointer',
    'transition-all', 'duration-500', 'ease-in-out',
    'card-container',
    isRevealed && isSelected ? 'is-flipped' : '',
    isSelected ? 'z-10' : 'z-0',
    isFaded ? 'opacity-0 scale-50' : 'opacity-100',
  ].join(' ');

  const cardContainerStyle: React.CSSProperties = {
      animation: !isSelected ? `float 6s ease-in-out infinite` : 'none',
      animationDelay: animationDelay,
      transform: isSelected ? 'scale(1.5) translateZ(0)' : 'scale(1) translateZ(0)',
  };

  return (
    <div className={cardClasses} style={cardContainerStyle} onClick={onClick}>
      <div className="card-inner">
        <div className="card-front absolute w-full h-full rounded-lg bg-green-800 border-2 border-green-600 shadow-lg flex items-center justify-center p-4 overflow-hidden">
            <div className="text-4xl font-extrabold text-green-500/50">W&C</div>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"></div>
        </div>
        <div className="card-back absolute w-full h-full rounded-lg shadow-2xl flex flex-col items-center justify-center text-center p-2" style={{ background: prize?.color ?? '#cccccc' }}>
            {prize && (
                <>
                    <span className="text-5xl mb-2">{prize.emoji}</span>
                    <span className="font-bold text-gray-800 text-md leading-tight">{prize.name}</span>
                </>
            )}
        </div>
      </div>
    </div>
  );
};


const CardGame: React.FC<CardGameProps> = ({ prizes, onPrizeSelect }) => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [winningPrize, setWinningPrize] = useState<Prize | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    // Pre-determine the winning prize based on weight, just like the wheel
    const totalWeight = prizes.reduce((sum, prize) => sum + prize.weight, 0);
    let randomWeight = Math.random() * totalWeight;
    const determinedWinningPrize = prizes.find(prize => {
      randomWeight -= prize.weight;
      return randomWeight <= 0;
    }) || prizes[0];
    setWinningPrize(determinedWinningPrize);
  }, [prizes]);
  
  const cardIndices = useMemo(() => {
    const indices = Array.from({ length: 9 }, (_, i) => i);
    // Shuffle indices for random layout
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  }, []);

  const handleCardClick = (index: number) => {
    if (selectedCard !== null || !winningPrize) return;

    setSelectedCard(index);

    setTimeout(() => {
      setIsRevealed(true);
    }, 700);

    setTimeout(() => {
      onPrizeSelect(winningPrize);
    }, 3000);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center text-center p-4">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 animate-pulse">Choose Your Destiny!</h2>
      <p className="text-lg md:text-xl text-green-200 mb-10">Pick a card to reveal your prize.</p>
      
      <div className="grid grid-cols-3 gap-4 md:gap-8">
        {cardIndices.map((cardId, i) => (
          <Card
            key={cardId}
            prize={winningPrize}
            isSelected={selectedCard === cardId}
            isRevealed={isRevealed}
            isFaded={selectedCard !== null && selectedCard !== cardId}
            onClick={() => handleCardClick(cardId)}
            animationDelay={`${i * 0.15}s`}
          />
        ))}
      </div>
    </div>
  );
};

export default CardGame;