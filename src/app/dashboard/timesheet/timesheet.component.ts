import { Component } from '@angular/core';
import { IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  standalone: true,
  imports: [IonGrid, IonRow, IonCol],
})
export class TimesheetComponent {}
