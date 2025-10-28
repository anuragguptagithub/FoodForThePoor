
import React, { useState, useMemo } from 'react';
import type { FoodItem } from './types';
import FoodCard from './components/FoodCard';
import AddFoodForm from './components/AddFoodForm';
import { PlusIcon, SearchIcon, LightbulbIcon } from './components/Icons';
import { generateMealIdea } from './services/geminiService';
import MealIdeaModal from './components/MealIdeaModal';

const initialFoodItems: FoodItem[] = [
    {
        id: '1',
        name: 'Leftover Roasted Chicken',
        description: 'Half a roasted chicken, perfectly seasoned. Great for salads or sandwiches.',
        quantity: 'Approx. 2 lbs',
        pickupTime: 'Today by 8 PM',
        restaurant: 'The Corner Bistro',
        image: 'https://picsum.photos/seed/chicken/400/300',
        isClaimed: false,
    },
    {
        id: '2',
        name: 'Steamed Vegetable Medley',
        description: 'Broccoli, carrots, and bell peppers. Healthy and ready to eat.',
        quantity: 'Family-size container',
        pickupTime: 'Today by 8 PM',
        restaurant: 'The Corner Bistro',
        image: 'https://picsum.photos/seed/veggies/400/300',
        isClaimed: false,
    },
    {
        id: '3',
        name: 'Sourdough Bread Loaves',
        description: 'Freshly baked sourdough from this morning. A bit past its prime for sale, but perfect for toast.',
        quantity: '5 loaves',
        pickupTime: 'Today by 6 PM',
        restaurant: 'Artisan Bakes',
        image: 'https://picsum.photos/seed/bread/400/300',
        isClaimed: true,
    },
    {
        id: '4',
        name: 'Tomato Basil Soup',
        description: 'A large batch of our signature tomato basil soup.',
        quantity: '2 gallons',
        pickupTime: 'Today by 9 PM',
        restaurant: 'Soup & Co.',
        image: 'https://picsum.photos/seed/soup/400/300',
        isClaimed: false,
    }
];


const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'find' | 'post'>('find');
  const [foodItems, setFoodItems] = useState<FoodItem[]>(initialFoodItems);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mealIdea, setMealIdea] = useState<string | null>(null);
  const [isLoadingMeal, setIsLoadingMeal] = useState(false);

  const handleAddItem = (newItem: Omit<FoodItem, 'id' | 'isClaimed' | 'restaurant'>) => {
    const item: FoodItem = {
      ...newItem,
      id: new Date().toISOString(),
      isClaimed: false,
      restaurant: "My Restaurant", // Mock restaurant name
    };
    setFoodItems([item, ...foodItems]);
    setActiveView('find');
  };

  const handleClaimItem = (id: string) => {
    setFoodItems(foodItems.map(item =>
      item.id === id ? { ...item, isClaimed: true } : item
    ));
    // Also unselect if claimed
    const newSelected = new Set(selectedItemIds);
    newSelected.delete(id);
    setSelectedItemIds(newSelected);
  };

  const handleSelectItem = (id: string, isSelected: boolean) => {
    const newSelected = new Set(selectedItemIds);
    if (isSelected) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedItemIds(newSelected);
  };

  const handleGetMealIdea = async () => {
      if (selectedItemIds.size === 0) {
          alert('Please select at least one food item to generate a meal idea.');
          return;
      }
      setIsModalOpen(true);
      setIsLoadingMeal(true);
      setMealIdea(null);

      const selectedItems = foodItems.filter(item => selectedItemIds.has(item.id));
      const itemNames = selectedItems.map(item => item.name);

      const idea = await generateMealIdea(itemNames);
      setMealIdea(idea);
      setIsLoadingMeal(false);
  }

  const selectedItemsForModal = useMemo(() => {
    return foodItems
        .filter(item => selectedItemIds.has(item.id))
        .map(item => item.name);
  }, [selectedItemIds, foodItems]);
  
  const availableItems = foodItems.filter(item => !item.isClaimed);
  const claimedItems = foodItems.filter(item => item.isClaimed);

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-emerald-600">NourishNet</h1>
            <div className="flex items-center space-x-2">
                 <button 
                    onClick={() => setActiveView('find')}
                    className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors ${activeView === 'find' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                >
                    <SearchIcon className="w-5 h-5"/> Find Food
                </button>
                 <button 
                    onClick={() => setActiveView('post')}
                    className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors ${activeView === 'post' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                >
                    <PlusIcon className="w-5 h-5"/> Post Food
                </button>
            </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        {activeView === 'find' ? (
          <div>
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-800">Available for Pickup</h2>
                <button
                    onClick={handleGetMealIdea}
                    disabled={selectedItemIds.size === 0}
                    className="w-full sm:w-auto flex justify-center items-center gap-2 px-4 py-2 bg-yellow-400 text-yellow-900 rounded-md hover:bg-yellow-500 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                    <LightbulbIcon className="w-5 h-5"/>
                    Get Meal Idea
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableItems.map(item => (
                <FoodCard 
                    key={item.id} 
                    item={item} 
                    view="find" 
                    onClaim={handleClaimItem}
                    onSelect={handleSelectItem}
                    isSelected={selectedItemIds.has(item.id)}
                />
              ))}
            </div>
            {claimedItems.length > 0 && (
                <>
                    <h2 className="text-2xl font-bold text-slate-800 mt-12 mb-6">Recently Claimed</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {claimedItems.map(item => (
                            <FoodCard 
                                key={item.id} 
                                item={item} 
                                view="find" 
                                onClaim={handleClaimItem}
                                onSelect={() => {}}
                                isSelected={false}
                            />
                        ))}
                    </div>
                </>
            )}
          </div>
        ) : (
          <AddFoodForm onAddItem={handleAddItem} />
        )}
      </main>
      <MealIdeaModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mealIdea={mealIdea}
        isLoading={isLoadingMeal}
        selectedItems={selectedItemsForModal}
      />
    </div>
  );
};

export default App;
