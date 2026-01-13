import React, { useState } from 'react';
import { Shirt, RefreshCw, AlertCircle, MapPin, Camera } from 'lucide-react';
import Input from './components/Input';
import GenderPicker from './components/GenderPicker';
import { Gender, UserInput, GenerationState } from './types';
import { generatePersonaImage } from './services/geminiService';

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<UserInput>({
    city: '',
    age: 1,
    gender: null,
  });

  const [generation, setGeneration] = useState<GenerationState>({
    imageUrl: null,
    isLoading: false,
    error: null,
  });

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(prev => ({ ...prev, city: e.target.value }));
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setUserInput(prev => ({ ...prev, age: isNaN(val) ? 1 : Math.max(1, val) }));
  };

  const handleGenderSelect = (gender: Gender) => {
    setUserInput(prev => ({ ...prev, gender }));
  };

  const handleGenerate = async () => {
    if (!userInput.city || !userInput.gender) {
      setGeneration(prev => ({ ...prev, error: "Please tell us your city and gender." }));
      return;
    }

    setGeneration({ imageUrl: null, isLoading: true, error: null });

    try {
      const imageUrl = await generatePersonaImage(
        userInput.city,
        userInput.age,
        userInput.gender
      );
      setGeneration({ imageUrl, isLoading: false, error: null });
    } catch (err: any) {
      setGeneration({
        imageUrl: null,
        isLoading: false,
        error: err.message || "Failed to curate your look. Try again.",
      });
    }
  };

  const reset = () => {
    setGeneration({ imageUrl: null, isLoading: false, error: null });
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10 md:py-16">
      <header className="max-w-md w-full text-center mb-10 space-y-0.5">
        <h1 className="fashion-title text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 flex items-center justify-center gap-2 uppercase tracking-tighter whitespace-nowrap">
          <Shirt className="w-7 h-7 sm:w-8 sm:h-8 text-rose-500 shrink-0" />
          Outfit of The Day
        </h1>
        <p className="artistic-tagline text-rose-500 text-xl md:text-2xl leading-none">
          Generate Your Unique OOTD
        </p>
      </header>

      <main className="max-w-md w-full glass-card rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/40">
        <div className="p-8 md:p-10 space-y-8">
          {!generation.imageUrl && !generation.isLoading && (
            <>
              <div className="space-y-5">
                <Input
                  label="Which city are you in?"
                  type="text"
                  value={userInput.city}
                  onChange={handleCityChange}
                  placeholder="Paris, Milan, Seoul..."
                />
                <Input
                  label="Age"
                  type="number"
                  value={userInput.age}
                  onChange={handleAgeChange}
                  min={1}
                />
                <GenderPicker
                  selected={userInput.gender}
                  onSelect={handleGenderSelect}
                />
              </div>

              {generation.error && (
                <div className="flex items-center gap-2 text-sm text-rose-600 bg-rose-50 p-4 rounded-2xl border border-rose-100">
                  <AlertCircle size={16} />
                  <span>{generation.error}</span>
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={!userInput.city || !userInput.gender}
                className="w-full bg-slate-900 hover:bg-black disabled:bg-slate-300 text-white font-bold py-5 rounded-[1.5rem] shadow-xl transition-all duration-300 transform active:scale-[0.97] flex items-center justify-center gap-3 tracking-wide"
              >
                <Camera size={20} />
                Generate OOTD
              </button>
            </>
          )}

          {generation.isLoading && (
            <div className="flex flex-col items-center justify-center py-16 space-y-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-slate-100 border-t-rose-500 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shirt className="w-8 h-8 text-slate-800 animate-pulse" />
                </div>
              </div>
              <div className="text-center">
                <p className="fashion-title text-2xl font-bold text-slate-800">Curating Style...</p>
                <p className="text-sm text-slate-500 tracking-wide mt-2">Designing the perfect look for {userInput.city}</p>
              </div>
            </div>
          )}

          {generation.imageUrl && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="relative group overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-black/5">
                <img
                  src={generation.imageUrl}
                  alt="AI Curated OOTD"
                  className="w-full aspect-[3/4] object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <div className="px-3 py-1.5 bg-black/80 backdrop-blur-md rounded-full flex items-center gap-2 text-white border border-white/20">
                    <MapPin size={12} className="text-rose-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{userInput.city}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={reset}
                  className="w-full bg-slate-900 hover:bg-black text-white font-bold py-5 rounded-[1.5rem] shadow-xl transition-all duration-300 flex items-center justify-center gap-3 tracking-wide"
                >
                  <RefreshCw className="w-5 h-5" />
                  Try New Style
                </button>
                <p className="text-[10px] text-center text-slate-400 uppercase tracking-[0.2em] font-medium italic">
                  AI Fashion Studio • Powered by Gemini
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-12 text-center text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">
        <p>Fashion Beyond Boundaries &copy; 2025</p>
      </footer>
    </div>
  );
};

export default App;
