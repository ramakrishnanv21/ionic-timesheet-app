import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  ModalController,
  LoadingController,
  ToastController,
  IonCard,
  IonNote,
} from '@ionic/angular/standalone';
import { TotalAmountComponent } from '../total-amount/total-amount.component';
import { WorkingHoursComponent } from '../working-hours/working-hours.component';
import { EntryFormComponent } from '../entry-form/entry-form.component';
import { TimesheetService } from '../../services/timesheet.service';
import { TimesheetResponse, TotalHoursResponse } from '../../model/Timesheet';
import { SettingsService } from '../../services/settings.service';

import { MonthFilterComponent } from '../../shared/month-filter/month-filter.component';
import { RouterLink } from '@angular/router';

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
    IonNote,
    RouterLink
  ],
})
export class OverviewComponent implements OnInit {
  private modalCtrl = inject(ModalController);
  private timesheetService = inject(TimesheetService);
  private loadingController = inject(LoadingController);
  private toastController = inject(ToastController);
  private settingsService = inject(SettingsService);

  totalHours = signal<string>('');
  totalHoursNumeric = signal<number>(0); // Store total hours as a number
  selectedMonth = signal<string>(new Date().toISOString());
  hourlyRate = this.settingsService.getHourlyRate();

  // Computed signal for total amount (total hours * hourly rate)
  totalAmount = computed(() => {
    const amount = this.totalHoursNumeric() * this.hourlyRate();
    return amount.toFixed(2);
  });

  ngOnInit() {
    this.loadTotalHours();
  }

  loadTotalHours() {
    const date = new Date(this.selectedMonth());
    this.timesheetService.getTotalHours(date.getFullYear(), date.getMonth() + 1).subscribe((response: TotalHoursResponse) => {
      const totalHours = response.data.totalHours;
      // Store numeric value for calculations
      this.totalHoursNumeric.set(totalHours);

      // Format for display
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
