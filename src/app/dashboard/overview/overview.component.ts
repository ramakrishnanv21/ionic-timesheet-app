import { Component, inject } from '@angular/core';
import {
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  ModalController,
  LoadingController,
  ToastController,
} from '@ionic/angular/standalone';
import { TotalAmountComponent } from '../total-amount/total-amount.component';
import { WorkingHoursComponent } from '../working-hours/working-hours.component';
import { EntryFormComponent } from '../entry-form/entry-form.component';
import { TimesheetService } from '../../services/timesheet.service';
import { TimesheetResponse } from '../../model/Timesheet';

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
  ],
})
export class OverviewComponent {
  private modalCtrl = inject(ModalController);
  private timesheetService = inject(TimesheetService);
  private loadingController = inject(LoadingController);
  private toastController = inject(ToastController);

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
