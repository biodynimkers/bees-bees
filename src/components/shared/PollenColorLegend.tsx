'use client';
import { useState } from 'react';
import { pollenColors } from '@/lib/pollenColors';

interface PollenColorLegendProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function PollenColorLegend({
  className,
  style,
}: PollenColorLegendProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={className} style={style}>
      <details
        open={isOpen}
        onToggle={e => setIsOpen((e.target as HTMLDetailsElement).open)}
        style={{
          backgroundColor: 'var(--color-background)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <summary
          style={{
            padding: 'var(--space-5)',
            cursor: 'pointer',
            backgroundColor: 'var(--color-gray-50)',
            borderBottom: isOpen ? '1px solid rgba(0, 0, 0, 0.1)' : 'none',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: 'var(--color-text)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            userSelect: 'none',
          }}
        >
          <span style={{ fontSize: '1.1rem' }}>🌸</span>
          Stuifmeelkleur legende
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              marginLeft: 'auto',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </summary>

        <div style={{ padding: 'var(--space-6)' }}>
          <div
            style={{
              display: 'grid',
              gap: 'var(--space-4)',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            }}
          >
            {pollenColors.map((colorData, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-3)',
                  backgroundColor: 'var(--color-gray-25)',
                  borderRadius: '6px',
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: colorData.hex,
                    border: '2px solid rgba(0, 0, 0, 0.1)',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--color-text)',
                    lineHeight: '1.4',
                  }}
                >
                  {colorData.species.join(', ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </details>
    </div>
  );
}
