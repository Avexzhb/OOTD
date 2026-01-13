
import React from 'react';
import { User, UserCircle } from 'lucide-react';
import { Gender } from '../types';

interface GenderPickerProps {
  selected: Gender | null;
  onSelect: (gender: Gender) => void;
}

const GenderPicker: React.FC<GenderPickerProps> = ({ selected, onSelect }) => {
  return (
    <div className="flex flex-col space-y-1 w-full">
      <label className="text-sm font-semibold text-gray-700">Gender</label>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onSelect(Gender.MALE)}
          className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
            selected === Gender.MALE
              ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
              : 'border-gray-100 bg-white text-gray-400 hover:border-indigo-200'
          }`}
        >
          <User size={32} />
          <span className="mt-2 font-medium">Male</span>
        </button>
        <button
          onClick={() => onSelect(Gender.FEMALE)}
          className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
            selected === Gender.FEMALE
              ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
              : 'border-gray-100 bg-white text-gray-400 hover:border-indigo-200'
          }`}
        >
          <UserCircle size={32} />
          <span className="mt-2 font-medium">Female</span>
        </button>
      </div>
    </div>
  );
};

export default GenderPicker;
