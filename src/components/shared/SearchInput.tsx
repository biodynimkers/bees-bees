'use client';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Zoeken...',
  className = 'form__input',
}: SearchInputProps) {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`${className} search-input-with-clear`}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="clear-button"
          aria-label="Zoekterm wissen"
        >
          ×
        </button>
      )}
    </div>
  );
}
