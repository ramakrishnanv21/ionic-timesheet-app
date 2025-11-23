import { Component, inject } from '@angular/core';
import {
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  ModalController,
} from '@ionic/angular/standalone';
import { TotalAmountComponent } from '../total-amount/total-amount.component';
import { WorkingHoursComponent } from '../working-hours/working-hours.component';
import { EntryFormComponent } from '../entry-form/entry-form.component';
import { TimesheetService } from '../../services/timesheet.service';

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

  async openEntryForm() {
    const modal = await this.modalCtrl.create({
      component: EntryFormComponent,
    });
    modal.present();

    const response = await modal.onWillDismiss();

    if (response.role === 'confirm') {
      this.timesheetService.addTimesheet(response.data).subscribe((res) => {
        console.log('Timesheet added successfully', res);
      });
    }
  }
}
