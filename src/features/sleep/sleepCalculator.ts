import type { SleepRecommendation } from "./sleepTypes";


export function calculateBedtimes(
  wakeUpTime: Date,
  sleepOnsetMinutes = 15,
): SleepRecommendation[] {
  const durations = [10, 9, 8, 7];

  return durations.map((sleepHours) => {
    const bedtime = new Date(wakeUpTime);

    bedtime.setMinutes(
      bedtime.getMinutes() - sleepOnsetMinutes,
    );

    bedtime.setHours(
      bedtime.getHours() - sleepHours,
    );

    return {
      id: `${sleepHours}-hours`,
      sleepHours,
      bedtime,
      label:
        sleepHours === 8
          ? "Recommended"
          : `${sleepHours} hours`,
    };
  });
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDuration(hours: number): string {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round(
    (hours - wholeHours) * 60,
  );

  if (minutes === 0) {
    return `${wholeHours}h sleep`;
  }

  return `${wholeHours}h ${minutes}m sleep`;
}
