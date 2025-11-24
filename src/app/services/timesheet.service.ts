import { Inject, inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Timesheet, TimesheetResponse } from '../model/Timesheet';

@Injectable({
    providedIn: 'root',
})
export class TimesheetService {
    private http = inject(HttpClient);

    constructor(@Inject('API_URL') private apiUrl: string) { }

    addTimesheet(timesheet: Timesheet): Observable<TimesheetResponse> {
        return this.http.post<TimesheetResponse>(`${this.apiUrl}/api/timesheets`, timesheet);
    }

    updateTimesheet(timesheet: Timesheet): Observable<Timesheet> {
        return this.http.put<Timesheet>(`${this.apiUrl}/api/timesheets`, timesheet);
    }

    listTimesheets(year: number, month: number): Observable<Timesheet[]> {
        const params = { year: year.toString(), month: month.toString() };
        return this.http.get<Timesheet[]>(`${this.apiUrl}/api/timesheets`, { params });
    }

    deleteTimesheet(timesheetId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/api/timesheets/${timesheetId}`);
    }
}
