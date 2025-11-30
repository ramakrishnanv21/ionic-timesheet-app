import { DatePipe } from '@angular/common';
import {
  Component,
  OnInit,
  signal,
  inject,
  computed,
  Input,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';
import {
  IonNote,
  IonButton,
  IonCol,
  IonGrid,
  IonRow,
  IonInput,
  IonItem,
  IonHeader,
  IonToolbar,
  IonButtons,
  ModalController,
  IonContent,
  IonLabel,
  IonCard,
  IonCardContent,
  IonModal,
  IonDatetime,
  IonDatetimeButton,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { Timesheet } from '../../model/Timesheet';
import { IonDatetimeCustomEvent, DatetimeChangeEventDetail } from '@ionic/core';

enum Time {
  START = 'startTime',
  END = 'endTime',
}

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.scss'],
  imports: [
    IonNote,
    IonLabel,
    IonContent,
    IonButtons,
    IonToolbar,
    IonHeader,
    IonItem,
    IonGrid,
    IonRow,
    IonCol,
    IonInput,
    IonButton,
    ReactiveFormsModule,
    IonCard,
    IonCardContent,
    IonDatetime,
    IonModal,
    IonSelect,
    IonSelectOption,
    DatePipe,
  ],
})
export class EntryFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly modalCtrl = inject(ModalController);
  formButtonName = signal('Save');

  // Input for editing existing timesheet
  @Input() timesheetData: Timesheet | null = null;

  time = Time;

  private static computeDefaultTime(h: number = 0): string {
    const d = new Date();
    const roundedMinutes = Math.ceil(d.getMinutes() / 5) * 5;
    d.setMinutes(roundedMinutes);
    d.setHours(d.getHours() + h);

    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private readonly startDefaultTimeSignal = signal<string>(
    EntryFormComponent.computeDefaultTime()
  );
  private readonly endDefaultTimeSignal = signal<string>(
    EntryFormComponent.computeDefaultTime(2)
  );

  get startDefaultTime(): string {
    return this.startDefaultTimeSignal();
  }

  get endDefaultTime(): string {
    return this.endDefaultTimeSignal();
  }

  private readonly workDateSignal = signal<string>(this.getTodayDate());

  readonly formattedWorkDate = computed(() => {
    const dateValue = this.workDateSignal();
    if (!dateValue) return '';
    const date = new Date(dateValue);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  });

  private getTodayDate(): string {
    return this.toLocalISOString(new Date());
  }

  // Helper to get YYYY-MM-DDTHH:mm:ss in local time
  private toLocalISOString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  // Convert HH:mm to Local ISO string for ion-datetime
  private timeToISOString(time: string): string {
    if (!time) return this.toLocalISOString(new Date());
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    date.setSeconds(0);
    return this.toLocalISOString(date);
  }

  get startTimeISO(): string {
    const formValue = this.entryForm?.get('startTime')?.value;
    return formValue ? this.timeToISOString(formValue) : this.timeToISOString(this.startDefaultTime);
  }

  get endTimeISO(): string {
    const formValue = this.entryForm?.get('endTime')?.value;
    return formValue ? this.timeToISOString(formValue) : this.timeToISOString(this.endDefaultTime);
  }

  get startTimeDisplay(): string {
    return this.entryForm?.get('startTime')?.value || '';
  }

  get endTimeDisplay(): string {
    return this.entryForm?.get('endTime')?.value || '';
  }

  get workDateDisplay(): string {
    const dateVal = this.entryForm?.get('workDate')?.value;
    if (!dateVal) return '';
    return new Date(dateVal).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  readonly duration = computed(() => {
    const start = this.startDefaultTimeSignal();
    const end = this.endDefaultTimeSignal();
    return this.calculateDuration(start, end);
  });

  private calculateDuration(start: string, end: string): string {
    if (!start || !end) return '';

    const [startHours, startMinutes] = start.split(':').map(Number);
    const [endHours, endMinutes] = end.split(':').map(Number);

    const startDate = new Date(0, 0, 0, startHours, startMinutes);
    const endDate = new Date(0, 0, 0, endHours, endMinutes);

    let diff = endDate.getTime() - startDate.getTime();
    if (diff < 0) {
      diff += 24 * 60 * 60 * 1000;
    }

    const hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    const minutes = Math.floor(diff / 1000 / 60);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  entryForm!: FormGroup;

  constructor() { }

  ngOnInit() {
    const existingData = this.timesheetData;
    if (existingData) {
      this.formButtonName.set('Update');
      // Editing mode - populate with existing data
      const workDate = existingData.workDate.includes('T')
        ? existingData.workDate
        : new Date(existingData.workDate).toISOString();

      this.startDefaultTimeSignal.set(existingData.startTime);
      this.endDefaultTimeSignal.set(existingData.endTime);

      this.entryForm = this.fb.group({
        workDate: [workDate, Validators.required],
        startTime: [existingData.startTime, Validators.required],
        endTime: [existingData.endTime, Validators.required],
        breakTime: [existingData.breakTime || '00', Validators.required],
      });
    } else {
      // New entry mode - use defaults
      this.entryForm = this.fb.group({
        workDate: [this.getTodayDate(), Validators.required],
        startTime: [this.startDefaultTime, Validators.required],
        endTime: [this.endDefaultTime, Validators.required],
        breakTime: ['00', Validators.required],
      });
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirmWorkDate(datetime: IonDatetime, modal: IonModal) {
    const dateValue = datetime.value;
    if (dateValue) {
      // dateValue can be string or string[]
      const dateStr = Array.isArray(dateValue) ? dateValue[0] : dateValue;
      this.entryForm.patchValue({ workDate: dateStr });
      this.workDateSignal.set(dateStr);
    }
    modal.dismiss();
  }

  confirmStartTime(datetime: IonDatetime, modal: IonModal) {
    const timeValue = datetime.value;
    if (timeValue) {
      const timeStr = Array.isArray(timeValue) ? timeValue[0] : timeValue;
      let formattedTime = timeStr;

      // Handle ISO string vs HH:mm format
      if (timeStr.includes('T')) {
        const timePart = timeStr.split('T')[1];
        // Take first 5 chars (HH:mm)
        formattedTime = timePart.substring(0, 5);
      }

      this.startDefaultTimeSignal.set(formattedTime);
      this.entryForm.patchValue({ startTime: formattedTime });
    }
    modal.dismiss();
  }

  confirmEndTime(datetime: IonDatetime, modal: IonModal) {
    const timeValue = datetime.value;
    if (timeValue) {
      const timeStr = Array.isArray(timeValue) ? timeValue[0] : timeValue;
      let formattedTime = timeStr;

      // Handle ISO string vs HH:mm format
      if (timeStr.includes('T')) {
        const timePart = timeStr.split('T')[1];
        // Take first 5 chars (HH:mm)
        formattedTime = timePart.substring(0, 5);
      }

      this.endDefaultTimeSignal.set(formattedTime);
      this.entryForm.patchValue({ endTime: formattedTime });
    }
    modal.dismiss();
  }

  confirm() {
    const formValue = this.entryForm.value;
    const workDate = formValue.workDate;
    const dateOnly = workDate.split('T')[0];
    const payload = {
      ...formValue,
      workDate: dateOnly,
      id: this.timesheetData?.id,
    };
    return this.modalCtrl.dismiss(payload, 'confirm');
  }

}
