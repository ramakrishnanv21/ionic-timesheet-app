import {
  Component,
  OnInit,
  ViewChild,
  CUSTOM_ELEMENTS_SCHEMA,
  signal,
  inject,
  computed,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';
import {
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

enum Time {
  START = 'startTime',
  END = 'endTime',
}

@Component({
  selector: 'app-add-entry-form',
  templateUrl: './add-entry-form.component.html',
  styleUrls: ['./add-entry-form.component.scss'],
  imports: [
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
  ],
})
export class AddEntryFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly modalCtrl = inject(ModalController);

  @ViewChild('dateModal') dateModal?: IonModal;

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
    AddEntryFormComponent.computeDefaultTime()
  );
  private readonly endDefaultTimeSignal = signal<string>(
    AddEntryFormComponent.computeDefaultTime(2)
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
      // Handle overnight shifts or invalid ranges if necessary
      // For now, assuming same day, so if end < start, it might be invalid or next day.
      // Let's treat it as next day if end < start? Or just return 00:00?
      // The requirement says "on this date", implying single day.
      // Let's just return 00:00 if negative for now to be safe, or maybe it's a mistake.
      return '00:00';
    }

    const hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    const minutes = Math.floor(diff / 1000 / 60);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  entryForm!: FormGroup;

  constructor() {}

  ngOnInit() {
    this.entryForm = this.fb.group({
      workDate: [this.getTodayDate(), Validators.required],
      startTime: [this.startDefaultTime, Validators.required],
      endTime: [this.endDefaultTime, Validators.required],
    });
  }

  private getTodayDate(): string {
    return new Date().toISOString();
  }

  onSubmit() {
    console.log(this.entryForm.value);
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
    return this.modalCtrl.dismiss(this.entryForm.value, 'confirm');
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
