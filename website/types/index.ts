export interface ItineraryItem {
  time: string;
  activity: string;
  details?: string;
  icon?: string;
  address?: string;
  hours?: string;
  warning?: string;
  mustTry?: boolean;
  backup?: string;
}

export interface DayItinerary {
  id: number;
  date: string;
  day: string;
  weekday: string; // intentionally hardcoded, not computed from date
  title: string;
  items: ItineraryItem[];
}

export interface FoodEntry {
  id: string;
  name: string;         // original Vietnamese name
  chineseName: string;
  category: string;
  mustEat?: boolean;
  day?: string;
  address: string;
  hours?: string;
  priceRange?: string;
  details: string;
  icon?: string;
  notes?: string;
}

export interface SpaEntry {
  id: string;
  name: string;
  services: string[];
  priceRange: string;
  duration: string;
  address: string;
  bookingNote?: string;
  backup?: string;
}

export interface TipSection {
  title: string;
  icon: string;
  items: string[];
}

export interface BudgetRow {
  category: string;
  dailyEstimate: string;
}

export interface TipsData {
  warnings: TipSection[];
  packingList: string[];
  apps: { name: string; description: string }[];
  transport: string[];
  budget: BudgetRow[];
  accommodation: { date: string; hotel: string }[];
}
