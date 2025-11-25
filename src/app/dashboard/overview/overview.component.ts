import { Component, inject, OnInit, signal } from '@angular/core';
import {
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  ModalController,
  LoadingController,
  ToastController,
  IonCard,
} from '@ionic/angular/standalone';
import { TotalAmountComponent } from '../total-amount/total-amount.component';
import { WorkingHoursComponent } from '../working-hours/working-hours.component';
import { EntryFormComponent } from '../entry-form/entry-form.component';
import { TimesheetService } from '../../services/timesheet.service';
import { TimesheetResponse, TotalHoursResponse } from '../../model/Timesheet';

import { MonthFilterComponent } from '../../shared/month-filter/month-filter.component';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  standalone: true,
  imports: [
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    TotalAmountComponent,
    WorkingHoursComponent,
    MonthFilterComponent,
    IonCard,
  ],
})
export class OverviewComponent implements OnInit {
  private modalCtrl = inject(ModalController);
  private timesheetService = inject(TimesheetService);
  private loadingController = inject(LoadingController);
  private toastController = inject(ToastController);

  totalHours = signal<string>('');
  selectedMonth = signal<string>(new Date().toISOString());

  ngOnInit() {
    this.loadTotalHours();
  }

  loadTotalHours() {
    const date = new Date(this.selectedMonth());
    this.timesheetService.getTotalHours(date.getFullYear(), date.getMonth() + 1).subscribe((response: TotalHoursResponse) => {
      const totalHours = response.data.totalHours;
      const hours = Math.floor(totalHours);
      const minutes = Math.round((totalHours - hours) * 60);
      const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
      this.totalHours.set(`${hours} hours ${formattedMinutes} mins`);
    });
  }

  onMonthChange(month: string) {
    this.selectedMonth.set(month);
    this.loadTotalHours();
  }

  async openEntryForm() {
    const modal = await this.modalCtrl.create({
      component: EntryFormComponent,
    });
    modal.present();

    const response = await modal.onWillDismiss();

    if (response.role === 'confirm') {
      const loadingEl = await this.loadingController.create({
        keyboardClose: true,
        message: 'Adding timesheet...',
      });
      await loadingEl.present();

      this.timesheetService.addTimesheet(response.data).subscribe({
        next: async (res: TimesheetResponse) => {
          console.log('Timesheet added successfully', res);
          await loadingEl.dismiss();
          const toastEl = await this.toastController.create({
            message: res.message || 'Timesheet added successfully.',
            duration: 2000,
            color: 'success',
          });
          await toastEl.present();
          // Assuming TimesheetResponse includes a 'status' to confirm success from the backend
          if (res.status === 'success') {
            this.loadTotalHours();
            // If `this.router` is used, ensure it's injected: private router = inject(Router);
            // this.router.navigate(['/dashboard']);
          }
        },
        error: async (err) => {
          console.error('Failed to add timesheet', err);
          await loadingEl.dismiss();
          const toastEl = await this.toastController.create({
            message: err.error?.message || 'Failed to add timesheet. Please try again.',
            duration: 2000,
            color: 'danger',
          });
          await toastEl.present();
        },
      });
    }
  }
}
