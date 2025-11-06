import React, { useState, useEffect } from 'react';
import { X, Settings } from 'lucide-react';
import { useAuth } from '../src/hooks/useAuth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../src/services/firebase';

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
   const { user } = useAuth();
   const [name, setName] = useState('');
   const [surname, setSurname] = useState('');
   const [chatPreference, setChatPreference] = useState('');
   const [apiKey, setApiKey] = useState('');

   useEffect(() => {
     if (user) {
       const fetchData = async () => {
         const docRef = doc(db, 'users', user.uid);
         const docSnap = await getDoc(docRef);
         if (docSnap.exists()) {
           const data = docSnap.data();
           setName(data.name || '');
           setSurname(data.surname || '');
           setChatPreference(data.chatPreference || '');
           setApiKey(data.apiKey || '');
         }
         // Auto-fill name and surname from Google account
         if (user.displayName) {
           const [first, ...rest] = user.displayName.split(' ');
           setName(first);
           setSurname(rest.join(' '));
         }
       };
       fetchData();
     }
   }, [user]);

   const saveSettings = async () => {
     if (user) {
       await setDoc(doc(db, 'users', user.uid), {
         name,
         surname,
         chatPreference,
         apiKey
       }, { merge: true });
       alert('Impostazioni salvate!');
     }
   };

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

           {/* Personalization Settings */}
           <div className="form-group">
             <label className="form-label">Nome</label>
             <input
               type="text"
               value={name}
               onChange={(e) => setName(e.target.value)}
               className="form-input"
             />
           </div>
           <div className="form-group">
             <label className="form-label">Cognome</label>
             <input
               type="text"
               value={surname}
               onChange={(e) => setSurname(e.target.value)}
               className="form-input"
             />
           </div>
           <div className="form-group">
             <label className="form-label">Come vuoi chattare</label>
             <select
               value={chatPreference}
               onChange={(e) => setChatPreference(e.target.value)}
               className="form-input"
             >
               <option value="">Seleziona...</option>
               <option value="incoraggiante">Incoraggiante</option>
               <option value="genz">Gen Z</option>
               <option value="scherzoso">Scherzoso</option>
               <option value="pragmatico">Pragmatico</option>
               <option value="empatico">Empatico</option>
             </select>
           </div>

           {/* API Key Section */}
           <div className="form-group">
             <label className="form-label">Openrouter API Key</label>
             <input
               type="text"
               value={apiKey}
               onChange={(e) => setApiKey(e.target.value)}
               placeholder="sk-or-v1-..."
               className="form-input"
             />
           </div>

           <button onClick={saveSettings} className="btn btn-primary btn-medium flex items-center justify-center gap-2">
             <Settings size={16} />
             Salva Impostazioni
           </button>

         </div>
      </div>
    </div>
  );
};