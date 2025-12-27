
export interface Activity {
  id: string;
  type: 'walking' | 'running' | 'cycling' | 'other';
  startTime: number;
  endTime: number;
  steps: number;
  distance: number; // in meters
  calories: number;
  path: { lat: number; lng: number }[];
}

export interface Goal {
  id: string;
  title: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  category: 'steps' | 'calories' | 'distance' | 'duration';
  deadline: string;
}

export interface UserStats {
  todaySteps: number;
  todayCalories: number;
  todayDistance: number;
  weeklyProgress: { day: string; steps: number }[];
}

// AICoachResponse defines the structure of the AI's feedback on user fitness performance
export interface AICoachResponse {
  insight: string;
  recommendations: string[];
  status: 'motivating' | 'caution' | 'praising';
}
