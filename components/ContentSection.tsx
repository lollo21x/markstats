import React from 'react';
import { ChevronRight } from 'lucide-react';
import { subjects } from '../src/types';

interface ContentSectionProps {
  onSubjectSelect: (subject: string) => void;
}

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const lightenColor = (hex: string, percent: number) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const { r, g, b } = rgb;
  const newR = Math.min(255, Math.floor(r + (255 - r) * percent / 100));
  const newG = Math.min(255, Math.floor(g + (255 - g) * percent / 100));
  const newB = Math.min(255, Math.floor(b + (255 - b) * percent / 100));
  return `rgb(${newR}, ${newG}, ${newB})`;
};



export const ContentSection: React.FC<ContentSectionProps> = ({ onSubjectSelect }) => {
  return (
    <div className="card">
      <h3 className="card-title mb-6">Contenuti per materia</h3>
      <div className="grid grid-cols-auto-fit gap-4">
        {subjects.map(subj => {
          const gradient = `linear-gradient(to bottom right, ${subj.color}, ${lightenColor(subj.color, 30)})`;

          return (
            <div
              key={subj.name}
              onClick={() => onSubjectSelect(subj.name)}
              className="cursor-pointer"
              style={{
                background: gradient,
                borderRadius: '16px',
                padding: '1.5rem',
                color: 'white',
                border: '1px solid transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <h4 style={{ fontSize: '1rem', margin: 0, fontWeight: 600 }}>
                {subj.name}
              </h4>
              <ChevronRight size={20} style={{ color: 'white' }} />
            </div>
          );
        })}
      </div>
    </div>
  );
};