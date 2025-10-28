
import React from 'react';
import { CloseIcon, SpinnerIcon } from './Icons';

interface MealIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealIdea: string | null;
  isLoading: boolean;
  selectedItems: string[];
}

const MealIdeaModal: React.FC<MealIdeaModalProps> = ({ isOpen, onClose, mealIdea, isLoading, selectedItems }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-slate-800">AI-Powered Meal Idea</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <div className="mb-4">
              <p className="font-semibold text-slate-700">Based on your selection:</p>
              <p className="text-slate-600 italic">{selectedItems.join(', ')}</p>
          </div>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48">
              <SpinnerIcon className="w-12 h-12 text-emerald-600" />
              <p className="mt-4 text-slate-600">Generating a delicious idea...</p>
            </div>
          ) : (
            <div className="prose max-w-none">
              {mealIdea?.split('\n').map((line, index) => {
                  if (line.startsWith('#')) {
                      const level = line.lastIndexOf('#') + 1;
                      const text = line.substring(level).trim();
                      return React.createElement(`h${level}`, { key: index, className: 'font-bold' }, text);
                  }
                  if (line.startsWith('* ')) {
                      return <li key={index} className="ml-4">{line.substring(2)}</li>;
                  }
                  return <p key={index}>{line}</p>;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealIdeaModal;
