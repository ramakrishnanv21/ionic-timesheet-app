export interface Timesheet {
  _id?: string;
  workDate: string;
  startTime: string;
  endTime: string;
}

export interface TimesheetResponse {
  status: 'success' | 'failed';
  message: string;
}
