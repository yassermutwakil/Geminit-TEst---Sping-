import type { Prize } from './types';

export const PRIZES: Prize[] = [
  {
    name: 'SND Package',
    emoji: '🧩',
    color: '#ffdd55', // Yellow
    codePrefix: 'WCOSND-SNDP',
    weight: 40,
  },
  {
    name: 'Free Day Pass',
    emoji: '🎟️',
    color: '#ff7aa0', // Pink
    codePrefix: 'WCOSND-DAYP',
    weight: 15,
  },
  {
    name: '4h Quiet Zone',
    emoji: '🤫',
    color: '#7abaff', // Blue
    codePrefix: 'WCOSND-QZ4',
    weight: 15,
  },
  {
    name: '1h Free',
    emoji: '⏱️',
    color: '#8be68b', // Green
    codePrefix: 'WCOSND-1H',
    weight: 15,
  },
  {
    name: 'Free Coffee',
    emoji: '☕',
    color: '#9b7bff', // Purple
    codePrefix: 'WCOSND-CFE',
    weight: 15,
  },
];