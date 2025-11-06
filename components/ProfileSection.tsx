import React, { useState } from 'react';

interface ProfileSectionProps {
  user: any;
  displayName: string;
  setDisplayName: (name: string) => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ user, displayName, setDisplayName }) => {
  const [isEditing, setIsEditing] = useState(false);



  return (
    <div className="flex flex-col gap-6">
      {/* Display Name */}
      <div className="form-group">
        <h4 className="text-md font-medium mb-2">Nome completo</h4>
        {isEditing ? (
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="input"
          />
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-base">{displayName || 'No name set'}</span>
            <button onClick={() => setIsEditing(true)} className="btn btn-small btn-secondary">
              Modifica
            </button>
          </div>
        )}
      </div>
    </div>
  );
};