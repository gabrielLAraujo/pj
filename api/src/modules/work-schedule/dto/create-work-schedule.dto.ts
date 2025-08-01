export class CreateWorkScheduleDto {
  startDate: Date;
  endDate: Date;
  days: {
    monday?: { enabled: boolean; startTime: string; endTime: string };
    tuesday?: { enabled: boolean; startTime: string; endTime: string };
    wednesday?: { enabled: boolean; startTime: string; endTime: string };
    thursday?: { enabled: boolean; startTime: string; endTime: string };
    friday?: { enabled: boolean; startTime: string; endTime: string };
    saturday?: { enabled: boolean; startTime: string; endTime: string };
    sunday?: { enabled: boolean; startTime: string; endTime: string };
  };
}
