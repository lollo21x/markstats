import React, { useState, useEffect } from 'react';
import { User, LogOut, Settings, X, Home, BarChart3, FileText, Check } from 'lucide-react';
import { signOut, updateProfile } from 'firebase/auth';
import { auth } from './services/firebase';
import { useAuth } from './hooks/useAuth';
import { AuthModal } from '../components/AuthModal';

import { AverageDisplay } from '../components/AverageDisplay';
import { VoteForm } from '../components/VoteForm';
import { VoteList } from '../components/VoteList';
import { WillChat } from '../components/WillChat';
import { ProfileSection } from '../components/ProfileSection';
import { ContentSection } from '../components/ContentSection';
import { SubjectContent } from '../components/SubjectContent';
import { TopicContent } from '../components/TopicContent';

import { VoteChart } from '../components/VoteChart';
import { Vote, VoteType, Subject } from './types';
import { translations, LanguageCode } from '../utils/translations';
import { db } from './services/firebase';
import { collection, addDoc, deleteDoc, doc, query, orderBy, onSnapshot, serverTimestamp, setDoc, getDoc } from 'firebase/firestore';

const App: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light'); // Default bianco/nero (light theme)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAddVoteOpen, setIsAddVoteOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [activeSection, setActiveSection] = useState<'dashboard' | 'votes' | 'profile' | 'content'>('dashboard');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [language] = useState<LanguageCode>(() => (localStorage.getItem('language') || 'it') as LanguageCode);
  const [settingsName, setSettingsName] = useState('');
  const [settingsSurname, setSettingsSurname] = useState('');
  const [settingsChatPreference, setSettingsChatPreference] = useState('');
  const [settingsApiKey, setSettingsApiKey] = useState('');
  const [displayName, setDisplayName] = useState(user?.displayName || '');

  const t = translations[language];

  useEffect(() => {
    document.documentElement.classList.toggle('light-theme', theme === 'light');
    document.documentElement.classList.toggle('dark-theme', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    if (user) {
      const votesCollectionRef = collection(db, "users", user.uid, "votes");
      const q = query(votesCollectionRef, orderBy("date", "desc"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedVotes: Vote[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data() as Omit<Vote, 'id' | 'date'>,
          date: doc.data().date?.toDate().toISOString() || new Date().toISOString()
        }));
        setVotes(fetchedVotes);
      });

      return () => unsubscribe();
    } else {
      setVotes([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const fetchSettings = async () => {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSettingsName(data.name || '');
          setSettingsSurname(data.surname || '');
          setSettingsChatPreference(data.chatPreference || '');
          setSettingsApiKey(data.apiKey || '');
          setDisplayName(data.displayName || user?.displayName || '');
        }
        // Auto-fill name and surname from Google account
        if (user.displayName) {
          const [first, ...rest] = user.displayName.split(' ');
          setSettingsName(first);
          setSettingsSurname(rest.join(' '));
        }
      };
      fetchSettings();
    }
  }, [user]);



  useEffect(() => {
    if (isAddVoteOpen || isSettingsOpen || isProfileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAddVoteOpen, isSettingsOpen, isProfileOpen]);



  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-menu') && !target.closest('.btn-pill')) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);



  const addVote = async (voteData: { value: number; type: VoteType; subject: Subject; weight: number; includeInAverage: boolean }) => {
    if (!user) {
      alert("Devi essere loggato per aggiungere un voto.");
      return;
    }
    try {
      const newVote = {
        ...voteData,
        date: serverTimestamp() // Use Firestore server timestamp
      };
      await addDoc(collection(db, "users", user.uid, "votes"), newVote);
    } catch (error) {
      console.error("Error adding vote: ", error);
      alert("Errore nell'aggiunta del voto.");
    }
  };

  const deleteVote = async (id: string) => {
    if (!user) {
      alert("Devi essere loggato per eliminare un voto.");
      return;
    }
    try {
      await deleteDoc(doc(db, "users", user.uid, "votes", id));
    } catch (error) {
      console.error("Error deleting vote: ", error);
      alert("Errore nell'eliminazione del voto.");
    }
  };

  const navigateToTopic = (subject: string, topicId: string) => {
    setSelectedSubject(subject);
    setSelectedTopic(topicId);
    setActiveSection('content');
    window.scrollTo(0, 0);
  };

  // Deep Linking: Update URL when state changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeSection) params.set('section', activeSection);
    if (selectedSubject) params.set('subject', selectedSubject);
    if (selectedTopic) params.set('topic', selectedTopic);

    // Only update if params exist or we want to clear them (but usually we always have a section)
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }, [activeSection, selectedSubject, selectedTopic]);

  // Deep Linking: Read URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sectionParam = params.get('section');
    const subjectParam = params.get('subject');
    const topicParam = params.get('topic');

    if (sectionParam === 'dashboard' || sectionParam === 'votes' || sectionParam === 'profile' || sectionParam === 'content') {
      setActiveSection(sectionParam);
    }
    if (subjectParam) setSelectedSubject(subjectParam);
    if (topicParam) setSelectedTopic(topicParam);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const saveSettings = async () => {
    if (user) {
      await setDoc(doc(db, 'users', user.uid), {
        name: settingsName,
        surname: settingsSurname,
        chatPreference: settingsChatPreference,
        apiKey: settingsApiKey,
        displayName: displayName
      }, { merge: true });
      if (displayName !== user.displayName) {
        await updateProfile(user, { displayName: displayName });
      }
      setIsSettingsOpen(false);
      setIsProfileOpen(false);
    }
  };



  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <header className="app-header">
          <div className="logo-container">
            <h1>MarkStats</h1>
          </div>
        </header>
        <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 120px)' }}>
          <h2>Welcome to MarkStats</h2>
          <p>Please sign in with your Doot Inc. account to continue.</p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              border: 'none',
              background: 'var(--accent)',
              color: 'var(--bg)',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Sign In
          </button>
        </main>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <>
      {/* Modals */}
      {isAddVoteOpen && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setIsAddVoteOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, background: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', overflowY: 'auto' }}>
          <div className="modal-content" style={{ maxWidth: '500px', width: '100%', padding: '1.5rem', background: 'var(--surface)', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: 'none' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Aggiungi Voto</h2>
              <button onClick={() => setIsAddVoteOpen(false)} className="btn btn-icon btn-secondary">
                <X size={16} />
              </button>
            </div>
            <VoteForm onAddVote={(voteData) => { addVote(voteData); setIsAddVoteOpen(false); }} />
          </div>
        </div>
      )}

      {isSettingsOpen && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setIsSettingsOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '500px', width: '90%', maxHeight: '80vh', overflow: 'auto', padding: '1.5rem' }}>
            <div className="mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Settings size={20} />
                Impostazioni
              </h2>
            </div>

            <div className="flex flex-col gap-6">
              {/* Theme Settings */}
              <div className="form-group">
                <h3 className="text-lg font-semibold mb-4">Tema</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTheme('light')}
                    className={`btn btn-medium flex-1 ${theme === 'light' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ borderWidth: theme === 'light' ? '2px' : '1px' }}
                  >
                    Chiaro
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`btn btn-medium flex-1 ${theme === 'dark' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ borderWidth: theme === 'dark' ? '2px' : '1px' }}
                  >
                    Scuro
                  </button>
                </div>
              </div>

              {/* Will Settings */}
              <div className="form-group">
                <h3 className="text-lg font-semibold mb-4">Impostazioni Will</h3>
                <div className="flex flex-col gap-4">
                  <div className="form-group">
                    <h4 className="text-md font-medium mb-2">Nome</h4>
                    <input
                      type="text"
                      value={settingsName}
                      onChange={(e) => setSettingsName(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <h4 className="text-md font-medium mb-2">Cognome</h4>
                    <input
                      type="text"
                      value={settingsSurname}
                      onChange={(e) => setSettingsSurname(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <h4 className="text-md font-medium mb-2">Come vuoi chattare</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'incoraggiante', label: 'Incoraggiante' },
                        { value: 'genz', label: 'Gen Z' },
                        { value: 'scherzoso', label: 'Scherzoso' },
                        { value: 'pragmatico', label: 'Pragmatico' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setSettingsChatPreference(settingsChatPreference === option.value ? '' : option.value)}
                          className={`btn btn-medium ${settingsChatPreference === option.value ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ borderWidth: settingsChatPreference === option.value ? '2px' : '1px' }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <h4 className="text-md font-medium mb-2">Openrouter API Key</h4>
                    <input
                      type="text"
                      value={settingsApiKey}
                      onChange={(e) => setSettingsApiKey(e.target.value)}
                      placeholder="sk-or-v1-..."
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              <button onClick={saveSettings} className="btn btn-primary btn-medium flex items-center justify-center gap-2">
                <Check size={16} />
                Salva Impostazioni
              </button>
            </div>
          </div>
        </div>
      )}

      {isProfileOpen && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setIsProfileOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '500px', width: '90%', maxHeight: '80vh', overflow: 'auto', padding: '1.5rem' }}>
            <div className="mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <User size={20} />
                {t.profile}
              </h2>
            </div>
            <div className="flex flex-col gap-6">
              <ProfileSection user={user} displayName={displayName} setDisplayName={setDisplayName} />
              <div className="card">
                <h4 className="card-subtitle mb-2">Informazioni account</h4>
                <div className="text-sm">
                  <p className="my-1"><strong>Email:</strong> {user?.email}</p>
                  <p className="my-1"><strong>Account:</strong> Doot Inc.</p>
                </div>
              </div>
              <button onClick={saveSettings} className="btn btn-primary btn-medium flex items-center justify-center gap-2 w-full">
                <Check size={16} />
                Salva impostazioni
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <header className="app-header">
          <div className="logo-container" onClick={() => { setActiveSection('dashboard'); setSelectedSubject(null); setSelectedTopic(null); }}>
            <h1>MarkStats</h1>
          </div>
          <nav className="nav mx-4 desktop-nav">
            <button
              onClick={() => setActiveSection('dashboard')}
              className={`nav-tab ${activeSection === 'dashboard' ? 'active' : ''}`}
              style={{ borderWidth: activeSection === 'dashboard' ? '2px' : '1px' }}
            >
              {t.dashboard}
            </button>
            <button
              onClick={() => setActiveSection('votes')}
              className={`nav-tab ${activeSection === 'votes' ? 'active' : ''}`}
              style={{ borderWidth: activeSection === 'votes' ? '2px' : '1px' }}
            >
              Voti
            </button>
            <button
              onClick={() => setActiveSection('content')}
              className={`nav-tab ${activeSection === 'content' ? 'active' : ''}`}
              style={{ borderWidth: activeSection === 'content' ? '2px' : '1px' }}
            >
              {t.content}
            </button>
          </nav>
          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ display: 'none' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          </button>
          <div className="header-controls">
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="btn-pill"
                aria-label="User menu"
                style={{
                  padding: '8px 12px',
                  backgroundColor: 'var(--surface)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)'
                }}
              >
                <User size={14} />
                <span style={{ marginLeft: '8px', marginRight: '8px' }}>
                  {user.displayName || user.email?.split('@')[0] || 'User'}
                </span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="currentColor"
                  style={{
                    transform: isUserMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease'
                  }}
                >
                  <path d="M6 8L2 4h8l-4 4z" />
                </svg>
              </button>

              {isUserMenuOpen && (
                <div className="dropdown-menu">
                  <button
                    onClick={() => {
                      setIsProfileOpen(true);
                      setIsUserMenuOpen(false);
                    }}
                    className="dropdown-item"
                  >
                    <User size={16} />
                    {t.profile}
                  </button>
                  <button
                    onClick={() => {
                      setIsSettingsOpen(true);
                      setIsUserMenuOpen(false);
                    }}
                    className="dropdown-item"
                  >
                    <Settings size={16} />
                    {t.settings}
                  </button>
                  <div className="dropdown-divider"></div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsUserMenuOpen(false);
                    }}
                    className="dropdown-item danger"
                  >
                    <LogOut size={16} />
                    {t.logout}
                  </button>
                </div>
              )}


            </div>
          </div>
        </header>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => { setActiveSection('dashboard'); setIsMobileMenuOpen(false); }}
                className={`mobile-menu-item ${activeSection === 'dashboard' ? 'active' : ''}`}
              >
                {t.dashboard}
              </button>
              <button
                onClick={() => { setActiveSection('votes'); setIsMobileMenuOpen(false); }}
                className={`mobile-menu-item ${activeSection === 'votes' ? 'active' : ''}`}
              >
                Voti
              </button>
              <button
                onClick={() => { setActiveSection('content'); setIsMobileMenuOpen(false); }}
                className={`mobile-menu-item ${activeSection === 'content' ? 'active' : ''}`}
              >
                {t.content}
              </button>
            </div>
          </div>
        )}

        <main>
          {activeSection === 'dashboard' && (
            <>
              <VoteChart votes={votes} />
              <div className="mt-8">
                <AverageDisplay votes={votes} />
                <div className="mt-8">
                  <div className="card">
                    <h3 className="card-title">Argomenti recenti</h3>
                    <div className="cursor-pointer p-4 border border-border rounded-lg hover:bg-surface transition-colors mb-2" onClick={() => navigateToTopic('Storia', 'storia-assolutismo-rivoluzioni')}>
                      <span>Assolutismo, Rivoluzioni e Nuove Potenze Europee</span>
                    </div>
                    <div className="cursor-pointer p-4 border border-border rounded-lg hover:bg-surface transition-colors" onClick={() => navigateToTopic('Filosofia', 'filosofia-ellenistica')}>
                      <span>Filosofia ellenistica: epicureismo, stoicismo, scetticismo</span>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <WillChat votes={votes} />
                </div>
              </div>
            </>
          )}

          {activeSection === 'votes' && (
            <>
              <button
                onClick={() => setIsAddVoteOpen(true)}
                className="btn btn-primary inline-flex items-center gap-2 mb-6"
                style={{ marginLeft: 'auto', display: 'block', padding: '12px 20px', fontSize: '1.1rem', borderRadius: '16px' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
                Aggiungi Voto
              </button>
              <VoteChart votes={votes} />
              <div className="mt-8">
                <AverageDisplay votes={votes} />
              </div>
              <div className="mt-8">
                <VoteList votes={votes} onDeleteVote={deleteVote} />
              </div>
            </>
          )}

          {activeSection === 'content' && (
            <>
              {!selectedSubject ? (
                <ContentSection onSubjectSelect={setSelectedSubject} />
              ) : !selectedTopic ? (
                <SubjectContent
                  subject={selectedSubject as any}
                  onBack={() => setSelectedSubject(null)}
                  onTopicSelect={setSelectedTopic}
                />
              ) : (
                <TopicContent
                  topicId={selectedTopic}
                  onBack={() => setSelectedTopic(null)}
                  votes={votes}
                />
              )}
            </>
          )}
        </main>
        <footer className="sticky-footer">
          <p className="footer-text m-0">
            Creato da lollo21
          </p>
        </footer>

        {/* Mobile Bottom Navigation */}
        <nav className="mobile-bottom-nav">
          <div className="nav">
            <button
              onClick={() => setActiveSection('dashboard')}
              className={`mobile-nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            >
              <Home size={20} />
              <span>{t.dashboard}</span>
            </button>
            <button
              onClick={() => setActiveSection('votes')}
              className={`mobile-nav-item ${activeSection === 'votes' ? 'active' : ''}`}
            >
              <BarChart3 size={20} />
              <span>Voti</span>
            </button>
            <button
              onClick={() => setActiveSection('content')}
              className={`mobile-nav-item ${activeSection === 'content' ? 'active' : ''}`}
            >
              <FileText size={20} />
              <span>{t.content}</span>
            </button>
          </div>
        </nav>


      </div>
    </>
  );
};

export default App;
