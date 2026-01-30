'use client';

interface ColorPickerProps {
  pollenColors: Array<{
    species: string[];
    hex: string;
    isNoPollenOption?: boolean;
  }>;
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
        {pollenColors.map((colorData, index) => {
          const isNoPollenOption = colorData.isNoPollenOption;

          return (
            <button
              key={index}
              type="button"
              className={`color-picker__color ${
                isSelected(colorData.hex) ? 'color-picker__color--selected' : ''
              } ${
                isDisabled(colorData.hex) ? 'color-picker__color--disabled' : ''
              } ${isNoPollenOption ? 'color-picker__color--no-pollen' : ''}`}
              style={{ backgroundColor: colorData.hex }}
              onClick={
                () => !isDisabled(colorData.hex) && onColorToggle(colorData.hex) // !sisDisabled returns false if disabled
              }
              disabled={isDisabled(colorData.hex)}
              aria-label={
                isNoPollenOption
                  ? 'Geen stuifmeel zichtbaar'
                  : `Kleur ${colorData.hex}`
              }
              title={colorData.species.join(', ')}
            >
              {isNoPollenOption && (
                <span className="color-picker__no-pollen-text">Geen</span>
              )}
            </button>
          );
        })}
      </div>

      <p className="color-picker__help">
        Selecteer maximaal {maxColors} kleuren of kies 'Geen' indien geen
        stuifmeel zichtbaar is. Geselecteerd: {selectedColors.length}/
        {maxColors}
      </p>
    </div>
  );
}
