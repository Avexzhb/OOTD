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

// --- Components ---
const Input: React.FC<{
  label: string;
  type: 'text' | 'number';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  min?: number;
}> = ({ label, type, value, onChange, placeholder, min }) => (
  <div className="flex flex-col space-y-1 w-full">
    <label className="text-sm font-semibold text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      min={min}
      placeholder={placeholder}
      className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all duration-200 bg-white text-black"
    />
  </div>
);

const GenderPicker: React.FC<{
  selected: Gender | null;
  onSelect: (gender: Gender) => void;
}> = ({ selected, onSelect }) => (
  <div className="flex flex-col space-y-1 w-full">
    <label className="text-sm font-semibold text-gray-700">Gender</label>
    <div className="grid grid-cols-2 gap-4">
      {[
        { id: Gender.MALE, label: 'Male', icon: User },
        { id: Gender.FEMALE, label: 'Female', icon: UserCircle },
      ].map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
            selected === id
              ? 'border-rose-500 bg-rose-50 text-rose-600'
              : 'border-gray-100 bg-white text-gray-400 hover:border-rose-200'
          }`}
        >
          <Icon size={32} />
          <span className="mt-2 font-medium">{label}</span>
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
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
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
      setGeneration(prev => ({ ...prev, error: "Please provide your city and gender." }));
      return;
    }

    setGeneration({ imageUrl: null, isLoading: true, error: null });

    try {
      const imageUrl = await generatePersonaImage(userInput.city, userInput.age, userInput.gender);
      setGeneration({ imageUrl, isLoading: false, error: null });
    } catch (err: any) {
      const errMsg = err.message || "Failed to generate your look.";
      setGeneration({ imageUrl: null, isLoading: false, error: errMsg });
      if (errMsg.toLowerCase().includes("not found")) setHasKey(false);
    }
  };

  if (hasKey === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full glass-card rounded-[2.5rem] p-10 text-center space-y-8 shadow-2xl border border-white">
          <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto">
            <Key className="w-10 h-10 text-rose-500" />
          </div>
          <div className="space-y-2">
            <h2 className="fashion-title text-3xl font-bold text-slate-900">Premium AI Fashion</h2>
            <p className="text-slate-500 text-sm">To access high-quality fashion visuals, please connect your API key from a paid project.</p>
          </div>
          <button
            onClick={handleOpenKeySelector}
            className="w-full bg-slate-900 hover:bg-black text-white font-bold py-5 rounded-[1.5rem] shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
          >
            Connect API Key
          </button>
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-medium text-rose-500 hover:underline">
            Billing Documentation <ExternalLink size={12} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10 md:py-16">
      <header className="max-w-md w-full text-center mb-10 space-y-1">
        <h1 className="fashion-title text-3xl md:text-4xl font-black text-slate-900 flex items-center justify-center gap-2 uppercase tracking-tighter">
          <Shirt className="w-8 h-8 text-rose-500" />
          OOTD Generator
        </h1>
        <p className="artistic-tagline text-rose-500 text-2xl">Your daily style companion</p>
      </header>

      <main className="max-w-md w-full glass-card rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/40">
        <div className="p-8 md:p-10 space-y-8">
          {!generation.imageUrl && !generation.isLoading ? (
            <div className="space-y-6">
              <Input
                label="City"
                type="text"
                value={userInput.city}
                onChange={e => setUserInput({ ...userInput, city: e.target.value })}
                placeholder="e.g. Tokyo, London, NYC"
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
              {generation.error && (
                <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100">
                  <AlertCircle size={14} />
                  <span>{generation.error}</span>
                </div>
              )}
              <button
                onClick={handleGenerate}
                disabled={!userInput.city || !userInput.gender}
                className="w-full bg-slate-900 hover:bg-black disabled:bg-slate-300 text-white font-bold py-5 rounded-[1.5rem] shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                <Camera size={20} />
                Generate Look
              </button>
            </div>
          ) : generation.isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-8">
              <div className="w-20 h-20 rounded-full border-4 border-slate-100 border-t-rose-500 animate-spin" />
              <div className="text-center">
                <p className="fashion-title text-xl font-bold text-slate-800 tracking-wide">Designing Your Style...</p>
                <p className="text-xs text-slate-500 mt-2 uppercase tracking-widest">Powered by Gemini 3 Pro</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-700">
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl bg-slate-200">
                <img src={generation.imageUrl!} alt="OOTD" className="w-full aspect-[3/4] object-cover" />
                <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full flex items-center gap-2 text-white border border-white/10">
                  <MapPin size={10} className="text-rose-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{userInput.city}</span>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <button onClick={() => setGeneration({ imageUrl: null, isLoading: false, error: null })} className="w-full bg-slate-900 hover:bg-black text-white font-bold py-5 rounded-[1.5rem] shadow-xl flex items-center justify-center gap-3">
                  <RefreshCw className="w-5 h-5" />
                  New Style
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-12 text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em] space-y-4">
        <p>&copy; 2025 AI Fashion Studio</p>
        <button onClick={() => window.aistudio.openSelectKey().then(() => setHasKey(true))} className="hover:text-rose-500 underline transition-colors">
          Settings
        </button>
      </footer>
    </div>
  );
};

export default App;
