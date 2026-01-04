import { use, useState, useRef } from 'react';
import { useEffect } from 'react';
import { set } from 'zod';

export default function Timer() {
  let seconds = 30;
  const [time, setTime] = useState(seconds);
  const [isRunning, setIsRunning] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!isRunning) return;

    const intervalId = setInterval(() => {
      setTime(prev => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning, seconds]);

  useEffect(() => {
    if (time === 0 && isRunning) {
      console.log('Piep - timer afgelopen!');

      // Pieptoon afspelen
      if (audioContextRef.current) {
        const ctx = audioContextRef.current;
        const oscillator = ctx.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.value = 880;
        oscillator.connect(ctx.destination);
        oscillator.start();
        setTimeout(() => {
          oscillator.stop();
        }, 300);
      }

      // Stop de timer
      setIsRunning(false);
    }
  }, [time, isRunning]);

  const handleClick = () => {
    // Initialiseer AudioContext bij eerste klik
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
    setTime(seconds);
    setIsRunning(true);
  };

  return (
    <>
      <h2></h2>
      <div
        style={{
          color: isRunning ? 'var(--color-accent)' : 'var(--color-text-light)',

          fontFamily: 'var(--font-mono)',
          marginBottom: 'var(--space-8)',
        }}
      >
        {time === 0 ? (
          <p>
            30 seconden voorbij – controleer je waarden en tik op ‘Observatie
            toevoegen’
          </p>
        ) : (
          <>
            <p>
              {' '}
              Observeer 30 seconden en vul ondertussen de velden in <br />
            </p>
            <p style={{ fontSize: '2rem', fontWeight: '600' }}>
              {' '}
              00:{time < 10 ? '0' : ''}
              {time}
            </p>
          </>
        )}
      </div>

      <button onClick={handleClick} disabled={isRunning}>
        {isRunning
          ? 'Observatie loopt...'
          : time === 0
          ? 'Nieuwe observatie'
          : 'Start observatie'}
      </button>
    </>
  );
}
