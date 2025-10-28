
export interface FoodItem {
  id: string;
  name: string;
  description: string;
  quantity: string;
  pickupTime: string;
  restaurant: string;
  image: string | null;
  isClaimed: boolean;
}
