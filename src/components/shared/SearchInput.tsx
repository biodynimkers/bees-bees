'use client';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Zoeken...',
}: SearchInputProps) {
  return (
    <div className="filter-group">
      <label className="filter-group__label">Zoeken</label>
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="form__input"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="search-input__clear"
            aria-label="Zoekterm wissen"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
