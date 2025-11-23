import { DatePipe } from '@angular/common';
import {
  Component,
  OnInit,
  ViewChild,
  CUSTOM_ELEMENTS_SCHEMA,
  signal,
  inject,
  computed,
  input,
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
} from '@ionic/angular/standalone';
import { DateTimeComponent } from 'src/app/shared/date-time/date-time.component';
import { Timesheet } from '../../model/Timesheet';

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
    DateTimeComponent,
    IonDatetime,
    IonDatetimeButton,
    IonModal,
    DatePipe,
  ],
})
export class EntryFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly modalCtrl = inject(ModalController);

  @ViewChild('dateModal') dateModal?: IonModal;

  // Input for editing existing timesheet
  timesheetData = input<Timesheet | null>(null);

  time = Time;
  showStartPicker = false;
  showEndPicker = false;

  private static computeDefaultTime(h: number = 0): string {
    const d = new Date();
    const hours = String(d.getHours() + h).padStart(2, '0');
    const rounded = Math.ceil(d.getMinutes() / 5) * 5;
    const minutes = rounded === 60 ? '00' : String(rounded).padStart(2, '0');
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
      return '00:00';
    }

    const hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    const minutes = Math.floor(diff / 1000 / 60);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  entryForm!: FormGroup;

  constructor() { }

  ngOnInit() {
    const existingData = this.timesheetData();

    if (existingData) {
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
      });
    } else {
      // New entry mode - use defaults
      this.entryForm = this.fb.group({
        workDate: [this.getTodayDate(), Validators.required],
        startTime: [this.startDefaultTime, Validators.required],
        endTime: [this.endDefaultTime, Validators.required],
      });
    }
  }

  private getTodayDate(): string {
    return new Date().toISOString();
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  togglePicker(time: Time) {
    if (time === this.time.START) {
      this.showEndPicker = false;
      this.showStartPicker = !this.showStartPicker;
    } else {
      this.showStartPicker = false;
      this.showEndPicker = !this.showEndPicker;
    }
  }

  confirm() {
    const formValue = this.entryForm.value;
    const workDate = formValue.workDate;
    const dateOnly = workDate.split('T')[0];
    const payload = {
      ...formValue,
      workDate: dateOnly,
      _id: this.timesheetData()?._id, // Include _id if editing
    };
    return this.modalCtrl.dismiss(payload, 'confirm');
  }

  onDateChange(time: string, field: Time) {
    this.entryForm.patchValue({ [field]: time });
    this.togglePicker(field);

    if (field === this.time.START) {
      this.startDefaultTimeSignal.set(time);
    } else {
      this.endDefaultTimeSignal.set(time);
    }
  }
}
