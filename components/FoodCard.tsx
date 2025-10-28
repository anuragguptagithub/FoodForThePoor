
import React from 'react';
import type { FoodItem } from '../types';

interface FoodCardProps {
  item: FoodItem;
  view: 'find' | 'post';
  onClaim: (id: string) => void;
  onSelect: (id: string, isSelected: boolean) => void;
  isSelected: boolean;
}

const FoodCard: React.FC<FoodCardProps> = ({ item, view, onClaim, onSelect, isSelected }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${item.isClaimed ? 'opacity-50' : 'hover:shadow-xl'}`}>
      {item.image && <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />}
      <div className="p-4">
        <h3 className="text-xl font-bold text-slate-800">{item.name}</h3>
        <p className="text-sm text-slate-500 mb-2">{item.restaurant}</p>
        <p className="text-slate-600 mb-2">{item.description}</p>
        <div className="flex justify-between text-sm text-slate-700 mb-4">
          <span>Quantity: <strong>{item.quantity}</strong></span>
          <span>Pickup: <strong>{item.pickupTime}</strong></span>
        </div>

        {view === 'find' && (
          <div className="flex items-center justify-between">
            <button
              onClick={() => onClaim(item.id)}
              disabled={item.isClaimed}
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              {item.isClaimed ? 'Claimed' : 'Claim Food'}
            </button>
            {!item.isClaimed && (
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id={`select-${item.id}`}
                        checked={isSelected}
                        onChange={(e) => onSelect(item.id, e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <label htmlFor={`select-${item.id}`} className="ml-2 text-sm text-gray-600">For Meal Idea</label>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodCard;
