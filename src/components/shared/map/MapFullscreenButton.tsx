'use client';

interface MapFullscreenButtonProps {
  wrapperId: string;
}

export default function MapFullscreenButton({ wrapperId }: MapFullscreenButtonProps) {
  const handleFullscreen = () => {
    const wrapper = document.getElementById(wrapperId);
    
    if (wrapper) {
      if (!document.fullscreenElement) {
        wrapper.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  return (
    <button 
      className="map-fullscreen-btn"
      onClick={handleFullscreen}
      type="button"
    >
      Fullscreen
    </button>
  );
}
