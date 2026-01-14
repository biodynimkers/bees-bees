import { useState, useRef } from 'react';
import { useEffect } from 'react';

const seconds = 30;
export default function Timer() {
  const [time, setTime] = useState(seconds);
  const [isRunning, setIsRunning] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Aftelling effect
  useEffect(() => {
    if (countdown === null || countdown === 0) return;

    const timeoutId = setTimeout(() => {
      // Speel korte beep bij elke tel
      if (audioContextRef.current) {
        const ctx = audioContextRef.current;
        const oscillator = ctx.createOscillator(); //een oscillator is een object dat een herhalend signaal genereert, hier een geluidsgolf
        oscillator.type = 'sine';
        oscillator.frequency.value = countdown === 1 ? 1100 : 700; // Hogere toon bij laatste tel
        oscillator.connect(ctx.destination); // Connect to output
        oscillator.start();
        setTimeout(() => oscillator.stop(), 150);
      }

      if (countdown === 1) {
        // Start de timer na laatste tel
        setCountdown(null);
        setIsRunning(true);
      } else {
        setCountdown(countdown - 1);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [countdown]);

  // Timer effect
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
    setCountdown(3); // Start aftelling
  };

  return (
    <div
      className={`timer ${
        countdown !== null || isRunning ? 'timer--active' : ''
      }`}
    >
      <div
        className={`timer__display ${
          countdown !== null || isRunning ? 'timer__display--active' : ''
        }`}
      >
        {countdown !== null ? (
          <div className="timer__countdown">{countdown}</div>
        ) : time === 0 ? (
          <p className="timer__label">
            30 seconden voorbij – voer je waarneming in!
          </p>
        ) : (
          <>
            {/* <p className="timer__label">
              Observeer de bijen gedurende 30 seconden
            </p> */}
            <div className="timer__time">
              00:{time < 10 ? '0' : ''}
              {time}
            </div>
          </>
        )}
      </div>

      <button
        className="timer__button"
        onClick={handleClick}
        disabled={isRunning || countdown !== null}
      >
        {countdown !== null
          ? 'Klaar maken'
          : isRunning
          ? 'Timer loopt...'
          : time === 0
          ? 'Nieuwe poging'
          : 'Start timer'}
      </button>
    </div>
  );
}
