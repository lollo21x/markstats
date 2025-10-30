import React from 'react';
import { X, Settings } from 'lucide-react';

interface SettingsModalProps {
   isOpen: boolean;
   onClose: () => void;
   currentTheme: string;
   onThemeChange: (theme: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
   isOpen,
   onClose,
   currentTheme,
   onThemeChange
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" style={{ maxWidth: '500px', width: '90%', maxHeight: '80vh', overflow: 'auto', padding: '1.5rem' }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Settings size={20} />
            Impostazioni
          </h2>
          <button onClick={onClose} className="btn btn-icon btn-secondary">
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {/* Theme Settings */}
          <div className="form-group">
            <label className="form-label">Tema</label>
            <div className="flex gap-2">
              <button
                onClick={() => onThemeChange('light')}
                className={`btn btn-medium flex-1 ${currentTheme === 'light' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderWidth: currentTheme === 'light' ? '2px' : '1px' }}
              >
                Chiaro
              </button>
              <button
                onClick={() => onThemeChange('dark')}
                className={`btn btn-medium flex-1 ${currentTheme === 'dark' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderWidth: currentTheme === 'dark' ? '2px' : '1px' }}
              >
                Scuro
              </button>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};