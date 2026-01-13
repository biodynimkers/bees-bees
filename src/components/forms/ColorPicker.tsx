'use client';

interface ColorPickerProps {
  pollenColors: Array<{ species: string[]; hex: string }>;
  selectedColors: string[];
  onColorToggle: (hex: string) => void;
  maxColors: number;
}

export default function ColorPicker({
  pollenColors,
  selectedColors,
  onColorToggle,
  maxColors,
}: ColorPickerProps) {
  const isSelected = (hex: string) => selectedColors.includes(hex);
  const isDisabled = (hex: string) =>
    !isSelected(hex) && selectedColors.length >= maxColors;

  return (
    <div className="color-picker">
      <div className="color-picker__grid">
        {pollenColors.map((colorData, index) => (
          <button
            key={index}
            type="button"
            className={`color-picker__color ${
              isSelected(colorData.hex) ? 'color-picker__color--selected' : ''
            } ${
              isDisabled(colorData.hex) ? 'color-picker__color--disabled' : ''
            }`}
            style={{ backgroundColor: colorData.hex }}
            onClick={() => !isDisabled(colorData.hex) && onColorToggle(colorData.hex)}
            disabled={isDisabled(colorData.hex)}
            aria-label={`Kleur ${colorData.hex}`}
          >
            {isSelected(colorData.hex) && (
              <span className="color-picker__checkmark">✓</span>
            )}
          </button>
        ))}
      </div>
      
      <p className="color-picker__help">
        Selecteer maximaal {maxColors} kleuren. 
        Geselecteerd: {selectedColors.length}/{maxColors}
      </p>
    </div>
  );
}