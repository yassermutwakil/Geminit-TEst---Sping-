import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { Prize } from '../types';

declare var QRious: any;
declare var html2canvas: any;

interface TicketModalProps {
  name: string;
  email: string;
  prize: Prize;
  onPlayAgain: () => void;
}

const useCountdown = (expiryTimestamp: number) => {
  const [timeLeft, setTimeLeft] = useState(expiryTimestamp - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeLeft = expiryTimestamp - Date.now();
      if (newTimeLeft <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
      } else {
        setTimeLeft(newTimeLeft);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryTimestamp]);

  const hours = Math.floor((timeLeft / (1000 * 60 * 60)));
  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return { hours, minutes, seconds, timeLeft };
};

const TicketModal: React.FC<TicketModalProps> = ({ name, email, prize, onPlayAgain }) => {
  const expiryTimestamp = useMemo(() => Date.now() + 48 * 60 * 60 * 1000, []);
  const { hours, minutes, seconds, timeLeft } = useCountdown(expiryTimestamp);
  const ticketRef = useRef<HTMLDivElement>(null);
  
  const today = new Date().toISOString().split('T')[0];
  const uniquePart = btoa(`${name}|${email}|${today}`).substring(0, 8).toUpperCase();
  const sanitizedName = name.trim().replace(/\s+/g, '');
  const prizeCode = `${prize.codePrefix}-${uniquePart}-${sanitizedName}`;


  useEffect(() => {
    const canvasElement = document.getElementById('qr-canvas');
    if (canvasElement && typeof QRious !== 'undefined') {
        new QRious({
            element: canvasElement,
            value: prizeCode,
            size: 100,
            background: 'transparent',
            foreground: '#047857', // green-700
        });
    }
  }, [prizeCode]);

  const handleDownload = () => {
    if (ticketRef.current && typeof html2canvas !== 'undefined') {
      html2canvas(ticketRef.current, {
          backgroundColor: '#065f46', // Corresponds to green-800
          useCORS: true,
          scale: 2, // Higher resolution
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = `WorkCo_Ticket_${prizeCode}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-20 p-4">
      <div className="w-full max-w-sm mx-auto text-white modal-pop-animation">
        <h2 className="text-center text-4xl font-bold text-white mb-2">Mabrook, {name}!</h2>
        <div 
          ref={ticketRef}
          className="relative bg-gradient-to-br from-green-700 to-green-800 p-6 rounded-2xl shadow-2xl border border-green-600"
          id="ticket"
        >
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-8 h-8 rounded-full bg-green-900"></div>
          <div className="absolute top-1/2 -translate-y-1/2 -right-4 w-8 h-8 rounded-full bg-green-900"></div>
          
          <div className="text-center">
            <p className="text-lg text-green-200">You've won:</p>
            <p className="text-3xl font-bold">{prize.emoji} {prize.name} 🎁</p>
          </div>
          
          <div className="border-t-2 border-dashed border-green-600/50 my-4"></div>
          
          <div className="flex justify-between items-center space-x-4">
            <div className="text-left space-y-2 flex-1">
              <div>
                <p className="text-xs uppercase font-semibold text-green-300">Prize Code</p>
                <p className="font-mono text-lg font-bold bg-green-900/50 px-2 py-1 rounded break-all">{prizeCode}</p>
              </div>
              <div>
                <p className="text-xs uppercase font-semibold text-green-300">Email</p>
                <p className="font-sans text-sm break-all">{email}</p>
              </div>
              <div>
                <p className="text-xs uppercase font-semibold text-green-300">Date</p>
                <p className="font-sans text-sm">{today}</p>
              </div>
            </div>
            <div className="flex-shrink-0 bg-white/80 p-1 rounded-lg">
                <canvas id="qr-canvas"></canvas>
            </div>
          </div>
          
          <div className="border-t-2 border-dashed border-green-600/50 my-4"></div>

          <div className="text-center font-bold text-xl md:text-2xl pulse-animation">
            {timeLeft > 0 ? (
                `⏳ Expires in ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`
            ) : (
                'Ticket Expired'
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-center text-green-200 max-w-sm mx-auto p-2 rounded-lg bg-green-900/50">
        <p className="font-semibold text-sm mb-2">
          To redeem your prize, please download this ticket and present it to the cashier at your nearest Work&Co branch. This ticket is valid for one-time use only.
        </p>
        <p className="font-semibold text-sm" dir="rtl">
          للحصول على جائزتك، يرجى تحميل هذه التذكرة وتقديمها للكاشير في أقرب فرع لـ Work&Co. هذه التذكرة صالحة للاستخدام مرة واحدة فقط.
        </p>
      </div>

      <div className="flex items-center justify-center flex-wrap gap-4 mt-6">
        <button
          onClick={handleDownload}
          className="bg-white text-green-800 font-bold py-3 px-6 rounded-full hover:bg-green-100 transition-colors duration-300"
        >
          Download Ticket
        </button>
        <a
          href="https://wandco.co"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-800/50 text-white font-bold py-3 px-6 rounded-full hover:bg-gray-700 transition-colors duration-300"
        >
          Visit wandco.co
        </a>
        <button
          onClick={onPlayAgain}
          className="bg-yellow-500 text-black font-bold py-3 px-6 rounded-full hover:bg-yellow-400 transition-colors duration-300"
        >
          Play Again?
        </button>
      </div>
    </div>
  );
};

export default TicketModal;