import React, { useState, useEffect } from 'react';
import { Shirt, RefreshCw, AlertCircle, MapPin, Camera, Key, ExternalLink, User, UserCircle } from 'lucide-react';
import { generatePersonaImage } from './services/geminiService';

// --- Types ---
export enum Gender {
  MALE = 'male',
  FEMALE = 'female'
}

export interface UserInput {
  city: string;
  age: number;
  gender: Gender | null;
}

export interface GenerationState {
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

// --- Sub-components ---
const Input: React.FC<{
  label: string;
  type: 'text' | 'number';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  min?: number;
}> = ({ label, type, value, onChange, placeholder, min }) => (
  <div className="flex flex-col space-y-1.5 w-full">
    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      min={min}
      placeholder={placeholder}
      className="px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm text-slate-900 shadow-sm"
    />
  </div>
);

const GenderPicker: React.FC<{
  selected: Gender | null;
  onSelect: (gender: Gender) => void;
}> = ({ selected, onSelect }) => (
  <div className="flex flex-col space-y-1.5 w-full">
    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Gender Identity</label>
    <div className="grid grid-cols-2 gap-3">
      {[
        { id: Gender.MALE, label: 'Male', icon: User },
        { id: Gender.FEMALE, label: 'Female', icon: UserCircle },
      ].map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ${
            selected === id
              ? 'border-rose-500 bg-rose-50 text-rose-600 shadow-inner scale-[0.98]'
              : 'border-slate-100 bg-white text-slate-400 hover:border-rose-200 hover:bg-rose-50/30'
          }`}
        >
          <Icon size={28} />
          <span className="mt-2 text-xs font-bold uppercase tracking-widest">{label}</span>
        </button>
      ))}
    </div>
  </div>
);

// --- Main App ---
const App: React.FC = () => {
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const [userInput, setUserInput] = useState<UserInput>({ city: '', age: 1, gender: null });
  const [generation, setGeneration] = useState<GenerationState>({ imageUrl: null, isLoading: false, error: null });

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        try {
          const selected = await window.aistudio.hasSelectedApiKey();
          setHasKey(selected);
        } catch (e) {
          console.error("Failed to check API key status", e);
        }
      }
    };
    checkKey();
  }, []);

  const handleOpenKeySelector = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  const handleGenerate = async () => {
    if (!userInput.city || !userInput.gender) {
      setGeneration(prev => ({ ...prev, error: "Please fill in all fields to proceed." }));
      return;
    }

    setGeneration({ imageUrl: null, isLoading: true, error: null });

    try {
      const imageUrl = await generatePersonaImage(userInput.city, userInput.age, userInput.gender);
      setGeneration({ imageUrl, isLoading: false, error: null });
    } catch (err: any) {
      const errMsg = err.message || "Something went wrong. Please try again.";
      setGeneration({ imageUrl: null, isLoading: false, error: errMsg });
      // If the error suggests key issues, prompt for key selection
      if (errMsg.toLowerCase().includes("not found") || errMsg.toLowerCase().includes("api key")) {
        setHasKey(false);
      }
    }
  };

  if (hasKey === false) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-[#f8f9fa]">
        <div className="max-w-md w-full glass-card rounded-[3rem] p-12 text-center space-y-10 shadow-2xl border border-white">
          <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto ring-8 ring-rose-50/50">
            <Key className="w-10 h-10 text-rose-500" />
          </div>
          <div className="space-y-3">
            <h2 className="fashion-title text-3xl font-black text-slate-900 leading-tight">Secure Access Required</h2>
            <p className="text-slate-500 text-sm leading-relaxed px-4">To generate high-fidelity style visuals, please link your paid Gemini API key.</p>
          </div>
          <div className="space-y-4">
            <button
              onClick={handleOpenKeySelector}
              className="w-full bg-slate-900 hover:bg-black text-white font-black py-6 rounded-[2rem] shadow-xl transition-all duration-300 transform active:scale-[0.98] tracking-widest text-xs uppercase"
            >
              Link API Key
            </button>
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 hover:text-rose-600 transition-colors"
            >
              Billing Guide <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-12 md:py-20">
      <header className="max-w-md w-full text-center mb-12 space-y-2">
        <h1 className="fashion-title text-4xl font-black text-slate-900 flex items-center justify-center gap-3 uppercase tracking-tighter">
          <Shirt className="w-10 h-10 text-rose-500" />
          OOTD Studio
        </h1>
        <p className="artistic-tagline text-rose-500 text-3xl">Curated by AI</p>
      </header>

      <main className="max-w-md w-full glass-card rounded-[3rem] shadow-2xl overflow-hidden border border-white/40">
        <div className="p-10 md:p-12 space-y-10">
          {!generation.imageUrl && !generation.isLoading ? (
            <div className="space-y-8">
              <div className="space-y-6">
                <Input
                  label="Location"
                  type="text"
                  value={userInput.city}
                  onChange={e => setUserInput({ ...userInput, city: e.target.value })}
                  placeholder="Paris, Tokyo, Milan..."
                />
                <Input
                  label="Age"
                  type="number"
                  min={1}
                  value={userInput.age}
                  onChange={e => setUserInput({ ...userInput, age: parseInt(e.target.value) || 1 })}
                />
                <GenderPicker
                  selected={userInput.gender}
                  onSelect={gender => setUserInput({ ...userInput, gender })}
                />
              </div>

              {generation.error && (
                <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 p-5 rounded-2xl border border-rose-100">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{generation.error}</span>
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={!userInput.city || !userInput.gender}
                className="w-full bg-slate-900 hover:bg-black disabled:bg-slate-200 disabled:text-slate-400 text-white font-black py-6 rounded-[2rem] shadow-xl transition-all duration-300 flex items-center justify-center gap-4 tracking-widest text-xs uppercase transform active:scale-[0.98]"
              >
                <Camera size={20} />
                Generate Lookbook
              </button>
            </div>
          ) : generation.isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-10">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-slate-100 border-t-rose-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <Shirt className="w-8 h-8 text-slate-300 animate-pulse" />
                </div>
              </div>
              <div className="text-center space-y-3">
                <p className="fashion-title text-2xl font-black text-slate-900 tracking-wide">Designing Style...</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-[0.4em] font-black">Gemini 3 Pro Engine</p>
              </div>
            </div>
          ) : (
            <div className="space-y-10 animate-in fade-in zoom-in-95 duration-1000">
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-100 ring-1 ring-black/5">
                <img src={generation.imageUrl!} alt="Fashion Generation" className="w-full aspect-[3/4] object-cover" />
                <div className="absolute bottom-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl flex items-center gap-2 text-slate-900 shadow-xl">
                  <MapPin size={12} className="text-rose-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{userInput.city}</span>
                </div>
              </div>
              <button 
                onClick={() => setGeneration({ imageUrl: null, isLoading: false, error: null })} 
                className="w-full bg-slate-900 hover:bg-black text-white font-black py-6 rounded-[2rem] shadow-xl flex items-center justify-center gap-4 tracking-widest text-xs uppercase transition-all duration-300"
              >
                <RefreshCw size={18} />
                New Inspiration
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-16 text-center space-y-4">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em]">&copy; 2025 OOTD STUDIO</p>
        <button 
          onClick={() => window.aistudio.openSelectKey().then(() => setHasKey(true))} 
          className="text-slate-300 hover:text-rose-500 text-[9px] font-black uppercase tracking-[0.3em] transition-colors"
        >
          Key Settings
        </button>
      </footer>
    </div>
  );
};

export default App;
