export class GenerateForecastDto {
  workScheduleId: string;
  month: number; // 1-12
  year: number;
  includeHolidays?: boolean;
}
