export class Forecast {
  id: string;
  workScheduleId: string;
  month: number; // 1-12
  year: number;
  totalWorkDays: number;
  totalWorkHours: number;
  workDays: WorkDayForecast[];
  createdAt: Date;
  updatedAt: Date;
  monthlyGains: number;
  projectId?: string;
  hourlyRate?: number;
}

export class WorkDayForecast {
  date: string; // YYYY-MM-DD
  dayOfWeek: number; // 0-6
  dayName: string; // Segunda, Terça, etc.
  isWorkDay: boolean;
  startTime: string;
  endTime: string;
  workHours: number;
  isHoliday: boolean;
  holidayName?: string;
  dailyGains: number;
}
