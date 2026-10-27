
export type SleepRecommendation = {
  id: string;
  sleepHours: number;
  bedtime: Date;
  label: string;
};

export type SleepCalculationInput = {
  wakeUpTime: Date;
  sleepOnsetMinutes?: number;
};

export type SleepCalculationResult = {
  recommendations: SleepRecommendation[];
  wakeUpTime: Date;
  sleepOnsetMinutes: number;
};

export type SleepValidationError =
  | "INVALID_WAKE_TIME"
  | "INVALID_SLEEP_ONSET"
  | "WAKE_TIME_IN_PAST";
