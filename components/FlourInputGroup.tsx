import React from 'react';
import { FlourInput } from '../types';

interface FlourInputGroupProps {
  index: number;
  data: FlourInput;
  onChange: (index: number, field: 'w' | 'grams', value: string) => void;
}

export const FlourInputGroup: React.FC<FlourInputGroupProps> = ({ index, data, onChange }) => {
  return (
    <div className="bg-stone-50/50 p-4 rounded-xl border border-stone-200 shadow-sm focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:border-amber-500/50 transition-all duration-300">
      <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-3">
        Farina {index + 1}
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor={`w-${index}`} className="block text-xs font-semibold text-stone-600 mb-1">
            Forza (W)
          </label>
          <div className="relative">
            <input
              type="number"
              id={`w-${index}`}
              min="0"
              value={data.w}
              onChange={(e) => onChange(index, 'w', e.target.value)}
              className="block w-full rounded-lg border-stone-300 py-2.5 pl-3 pr-8 text-stone-900 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm bg-white"
              placeholder="300"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-stone-400 text-xs font-bold">W</span>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor={`g-${index}`} className="block text-xs font-semibold text-stone-600 mb-1">
            Quantità
          </label>
          <div className="relative">
            <input
              type="number"
              id={`g-${index}`}
              min="0"
              value={data.grams}
              onChange={(e) => onChange(index, 'grams', e.target.value)}
              className="block w-full rounded-lg border-stone-300 py-2.5 pl-3 pr-8 text-stone-900 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm bg-white"
              placeholder="100"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-stone-400 text-xs font-bold">g</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};