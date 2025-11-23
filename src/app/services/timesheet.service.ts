import { Inject, inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Timesheet } from '../model/Timesheet';

@Injectable({
  providedIn: 'root',
})
export class TimesheetService {
  private http = inject(HttpClient);

  constructor(@Inject('API_URL') private apiUrl: string) {}

  addTimesheet(timesheet: Timesheet): Observable<Timesheet> {
    return this.http.post<Timesheet>(`${this.apiUrl}/api/timesheets`, timesheet);
  }

  updateTimesheet(timesheet: Timesheet): Observable<Timesheet> {
    return this.http.put<Timesheet>(`${this.apiUrl}/api/timesheets`, timesheet);
  }

  listTimesheets(): Observable<Timesheet[]> {
    return this.http.get<Timesheet[]>(`${this.apiUrl}/api/timesheets`);
  }
}
