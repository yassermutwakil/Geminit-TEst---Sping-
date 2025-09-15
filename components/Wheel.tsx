import React, { useState, useMemo } from 'react';
import type { Prize } from '../types';

interface WheelProps {
  prizes: Prize[];
  onSpinEnd: (prize: Prize) => void;
}

const Wheel: React.FC<WheelProps> = ({ prizes, onSpinEnd }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const wheelVars = useMemo(() => {
    const numPrizes = prizes.length;
    const degreesPerPrize = 360 / numPrizes;
    const prizeColors = prizes.map(p => p.color);
    const conicGradient = `conic-gradient(from 0deg, ${prizeColors.map((color, i) => `${color} ${(i) * degreesPerPrize}deg ${(i + 1) * degreesPerPrize}deg`).join(', ')})`;
    return { numPrizes, degreesPerPrize, conicGradient };
  }, [prizes]);
  
  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    const totalWeight = prizes.reduce((sum, prize) => sum + prize.weight, 0);
    let randomWeight = Math.random() * totalWeight;
    
    const winningPrizeIndex = prizes.findIndex(prize => {
      randomWeight -= prize.weight;
      return randomWeight <= 0;
    });

    const winningPrize = prizes[winningPrizeIndex];

    const baseSpins = 5;
    const randomOffset = (Math.random() - 0.5) * (wheelVars.degreesPerPrize * 0.8);
    const targetRotation = (baseSpins * 360) + (360 - (winningPrizeIndex * wheelVars.degreesPerPrize)) - (wheelVars.degreesPerPrize / 2) + randomOffset;
    
    setRotation(prev => prev + targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      onSpinEnd(winningPrize);
    }, 4200); // Must match animation duration
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-10">
      <div className="relative w-[320px] h-[320px] md:w-[400px] md:h-[400px] flex items-center justify-center">
        <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-black z-20" style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.5))' }}></div>
        <div 
          className="relative w-full h-full rounded-full border-8 border-gray-700 shadow-2xl transition-transform duration-[4200ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] overflow-hidden"
          style={{ 
            background: wheelVars.conicGradient,
            transform: `rotate(${rotation}deg)` 
          }}
        >
          {prizes.map((prize, i) => {
            const angle = i * wheelVars.degreesPerPrize + wheelVars.degreesPerPrize / 2;
            return (
              <div
                key={i}
                className="absolute w-full h-1/2 top-0 left-0 origin-bottom-center pointer-events-none"
                style={{ transform: `rotate(${angle}deg)` }}
              >
                <div className="text-center font-extrabold text-gray-800 text-base md:text-lg -translate-y-6 md:-translate-y-8">
                  <div className="text-2xl md:text-3xl">{prize.emoji}</div>
                  <div className="px-1 leading-tight tracking-tighter">
                    {prize.name}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <button
          onClick={handleSpin}
          disabled={isSpinning}
          className="absolute w-20 h-20 md:w-24 md:h-24 bg-black text-white font-bold text-xl rounded-full border-4 border-gray-600 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-800 z-10 hover:bg-gray-800 transition-colors"
        >
          SPIN
        </button>
      </div>
    </div>
  );
};

export default Wheel;