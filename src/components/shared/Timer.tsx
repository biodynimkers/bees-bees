import { useState, useRef } from 'react';
import { useEffect } from 'react';

const seconds = 30;
export default function Timer() {
  const [time, setTime] = useState(seconds);
  const [isRunning, setIsRunning] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!isRunning) return;

    const intervalId = setInterval(() => {
      setTime(prev => {
        // Check hier of tijd op is
        if (prev <= 1) {
          // Speel pieptoon
          if (audioContextRef.current) {
            const ctx = audioContextRef.current;
            const oscillator = ctx.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.value = 880;
            oscillator.connect(ctx.destination);
            oscillator.start();
            setTimeout(() => oscillator.stop(), 300);
          }

          setIsRunning(false); // Stop de timer
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning]);

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
