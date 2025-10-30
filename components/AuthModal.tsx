import React, { useState } from 'react';
import { X, Eye, EyeOff, User as UserIcon } from 'lucide-react';
import { signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, googleProvider } from '../src/services/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`,
      });
      onClose();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" style={{ maxWidth: '420px', width: '90%', maxHeight: '85vh', overflow: 'auto', padding: '1.5rem' }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <UserIcon size={20} />
            {activeTab === 'login' ? 'Login' : 'Sign Up'}
          </h2>
          <button onClick={onClose} className="btn btn-icon btn-secondary">
            <X size={16} />
          </button>
        </div>

        <div className="flex bg-surface rounded-xl p-1 mb-6">
          <button
            className={`btn-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            className={`btn-tab ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        {activeTab === 'login' ? (
          <form onSubmit={handleEmailLogin} className="form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
             />
             <div className="input-group">
               <input
                 type={showPassword ? 'text' : 'password'}
                 placeholder="Password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="input input-with-icon"
                 required
               />
               <button
                 type="button"
                 onClick={() => setShowPassword(!showPassword)}
                 className="input-icon"
               >
                 {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
               </button>
             </div>
             <button type="submit" className="btn btn-primary btn-medium">
               Login
             </button>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="form">
             <input
               type="text"
               placeholder="Nome"
               value={firstName}
               onChange={(e) => setFirstName(e.target.value)}
               className="input"
               required
             />
             <input
               type="text"
               placeholder="Cognome"
               value={lastName}
               onChange={(e) => setLastName(e.target.value)}
               className="input"
               required
             />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
            />
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-with-icon"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="input-icon"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="input-group">
               <input
                 type={showPassword ? 'text' : 'password'}
                 placeholder="Conferma password"
                 value={confirmPassword}
                 onChange={(e) => setConfirmPassword(e.target.value)}
                 className="input input-with-icon"
                 required
               />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="input-icon"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button type="submit" className="btn btn-primary btn-medium">
              Sign Up
            </button>
          </form>
        )}

        <div className="flex items-center my-8">
          <div className="flex-1 h-px bg-border" />
          <span className="px-3 text-secondary text-sm">Or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <button onClick={handleGoogleLogin} className="btn btn-secondary btn-medium flex items-center justify-center gap-2 mb-4" style={{ width: '100%' }}>
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '16px', height: '16px' }} />
          Accedi con Google
        </button>
      </div>
    </div>
  );
};