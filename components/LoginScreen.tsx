import React from 'react';
import type { Prize } from '../types';

interface LoginScreenProps {
  prizes: Prize[];
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  onStart: () => void;
}

const PrizeCard: React.FC<{ prize: Prize }> = ({ prize }) => (
    <div 
        className="w-28 h-40 rounded-lg shadow-xl transition-transform duration-300 hover:scale-110"
        style={{
            background: prize.color,
        }}
    >
        <div className="flex flex-col items-center justify-center h-full text-gray-800 p-2 text-center">
            <span className="text-4xl mb-2">{prize.emoji}</span>
            <span className="font-bold text-sm leading-tight">{prize.name}</span>
        </div>
    </div>
);


const LoginScreen: React.FC<LoginScreenProps> = ({ prizes, name, setName, email, setEmail, onStart }) => {
  const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canStart = name.trim().length > 0 && isEmailValid(email);

  return (
    <div className="w-full flex flex-col items-center justify-center text-center">
        <div className="w-full flex flex-row flex-wrap items-center justify-center gap-4 mb-10">
            {prizes.map((prize) => (
                <PrizeCard key={prize.codePrefix} prize={prize} />
            ))}
        </div>
        
      <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">Work&Co</h1>
      <p className="text-xl md:text-2xl font-semibold text-green-200 mb-6">Saudi National Day Offer</p>
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">Pick a Card & Win 🎉</h2>

      <div className="w-full max-w-sm space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full px-4 py-3 bg-green-800/80 border-2 border-green-600 rounded-lg text-white placeholder-green-300 focus:outline-none focus:border-white transition-colors"
          aria-label="Name"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-4 py-3 bg-green-800/80 border-2 border-green-600 rounded-lg text-white placeholder-green-300 focus:outline-none focus:border-white transition-colors"
          aria-label="Email"
        />
      </div>
      <button
        onClick={onStart}
        disabled={!canStart}
        className="w-full max-w-sm mt-8 py-3 px-6 bg-white text-green-800 font-bold text-lg rounded-lg transition-all duration-300 ease-in-out disabled:bg-gray-500 disabled:text-gray-300 disabled:cursor-not-allowed hover:enabled:bg-green-100 hover:enabled:scale-105"
      >
        Let's Play
      </button>
    </div>
  );
};

export default LoginScreen;