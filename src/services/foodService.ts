
import { supabase } from '../../lib/supabase';

export type FoodPlace = {
  id: number;
  name: string;
  category: string;
  description: string | null;
  price: number;
  address: string;
  image_url: string | null;
  created_at: string;
};

export const getFoodPlaces = async (): Promise<FoodPlace[]> => {
  const { data, error } = await supabase
    .from('food_places')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
};
