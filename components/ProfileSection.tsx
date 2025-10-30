import React, { useState } from 'react';
import { User, Camera } from 'lucide-react';
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, storage } from '../src/services/firebase';

interface ProfileSectionProps {
  user: any;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ user }) => {
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isEditing, setIsEditing] = useState(false);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (user && file) {
      try {
        const storageRef = ref(storage, `profile_pictures/${user.uid}/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        await updateProfile(user, { photoURL: downloadURL });
        alert('Immagine del profilo aggiornata con successo!');
      } catch (error) {
        console.error('Error uploading photo:', error);
        alert('Errore durante il caricamento della foto.');
      }
    }
  };

  const handleSaveName = async () => {
    if (user && displayName !== user.displayName) {
      try {
        await updateProfile(user, { displayName: displayName });
        alert('Nome visualizzato aggiornato con successo!');
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating display name:', error);
        alert("Errore durante l'aggiornamento del nome visualizzato.");
      }
    } else {
      setIsEditing(false);
    }
  };

  return (
    <div className="card mb-6">
      <h3 className="card-title flex items-center gap-2">
        <User size={20} />
        Impostazioni profilo
      </h3>

      <div className="flex flex-col gap-6">
        {/* Profile Photo */}
        <div className="flex items-center gap-4">
           <div className="relative">
             <input
               type="file"
               accept="image/*"
               onChange={handlePhotoUpload}
               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
               id="photo-upload"
             />
             <label htmlFor="photo-upload" className="w-20 h-20 rounded-full border-2 border-accent flex items-center justify-center overflow-hidden cursor-pointer hover:border-accent-green transition-colors">
               {user?.photoURL ? (
                 <img
                   src={user.photoURL}
                   alt="Profile"
                   className="w-full h-full object-cover"
                 />
               ) : (
                 <Camera size={32} color="var(--accent)" />
               )}
             </label>
           </div>
          <div className="flex-1">
             <p className="m-0 text-sm text-secondary">
               Foto profilo
             </p>
            <p className="my-1 text-xs text-secondary">
              Clicca sull'icona fotocamera per aggiornare la foto
            </p>
          </div>
        </div>

        {/* Display Name */}
        <div className="form-group">
          <label className="form-label">Nome completo</label>
          {isEditing ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="input flex-1"
              />
              <button onClick={handleSaveName} className="btn btn-medium" style={{ backgroundColor: 'var(--accent-green)', color: 'white' }}>
                Salva
              </button>
              <button onClick={() => setIsEditing(false)} className="btn btn-secondary btn-medium">
                Annulla
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-base">{displayName || 'No name set'}</span>
              <button onClick={() => setIsEditing(true)} className="btn btn-small btn-secondary">
                Modifica
              </button>
            </div>
          )}
        </div>



        {/* Account Info */}
        <div className="card">
          <h4 className="card-subtitle mb-2">Informazioni account</h4>
          <div className="text-sm">
            <p className="my-1"><strong>Email:</strong> {user?.email}</p>
            <p className="my-1"><strong>Account:</strong> Doot Inc.</p>
          </div>
        </div>
      </div>
    </div>
  );
};