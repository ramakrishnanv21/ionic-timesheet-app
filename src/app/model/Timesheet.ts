export interface Timesheet {
  id?: string;
  workDate: string;
  startTime: string;
  endTime: string;
}

export interface TimesheetResponse {
  status: 'success' | 'failed';
  message: string;
  data: Timesheet[];
}

export interface TotalHoursResponse {
  status: 'success' | 'failed';
  message: string;
  data: {
    totalHours: number;
  };
}
