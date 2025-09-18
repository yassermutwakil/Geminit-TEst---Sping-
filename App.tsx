import React, { useState, useCallback } from 'react';
import type { Prize } from './types';
import { PRIZES } from './constants';
import LoginScreen from './components/LoginScreen';
import CardGame from './components/CardGame';
import TicketModal from './components/TicketModal';
import Confetti from './components/Confetti';

type View = 'login' | 'game' | 'ticket' | 'alreadySpun';

const App: React.FC = () => {
  const [view, setView] = useState<View>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);

  const getTodayDateString = () => new Date().toISOString().split('T')[0];

  const handleStart = useCallback(() => {
    const today = getTodayDateString();
    const storageKey = `spin:${email}:${today}`;
    if (localStorage.getItem(storageKey)) {
      setView('alreadySpun');
    } else {
      setView('game');
    }
  }, [email]);

  const handlePrizeSelect = (prize: Prize) => {
    const today = getTodayDateString();
    const storageKey = `spin:${email}:${today}`;
    localStorage.setItem(storageKey, 'true');
    setWonPrize(prize);
    setTimeout(() => setView('ticket'), 500); // Delay for better transition
  };

  const resetApp = () => {
    setName('');
    setEmail('');
    setWonPrize(null);
    setView('login');
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 font-sans bg-green-900 overflow-hidden">
      {view === 'login' && (
        <LoginScreen 
          prizes={PRIZES}
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          onStart={handleStart}
        />
      )}
      {view === 'game' && (
        <CardGame prizes={PRIZES} onPrizeSelect={handlePrizeSelect} />
      )}
      {view === 'ticket' && wonPrize && (
        <>
          <Confetti />
          <TicketModal 
            name={name} 
            email={email} 
            prize={wonPrize}
            onPlayAgain={() => setView('alreadySpun')}
          />
        </>
      )}
      {view === 'alreadySpun' && (
        <div className="text-center bg-green-800/50 backdrop-blur-sm p-8 rounded-lg shadow-2xl border border-green-700">
          <h2 className="text-3xl font-bold text-white mb-4">One Chance Per Day!</h2>
          <p className="text-xl text-green-200">You've played for today.</p>
          <p className="text-md mt-2 text-green-300">Please come back tomorrow for another chance to win.</p>
          <button
            onClick={resetApp}
            className="mt-6 bg-white text-green-800 font-bold py-2 px-6 rounded-full hover:bg-green-100 transition-colors duration-300"
          >
            Go Back
          </button>
        </div>
      )}
    </div>
  );
};

export default App;