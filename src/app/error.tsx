'use client'; // Error components must be Client Components

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }; // The 'digest' property is added by Next.js for more detailed error information
  reset: () => void;
}) {
  return (
    <div>
      <h2>Er ging iets mis!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Opnieuw proberen</button>
    </div>
  );
}
