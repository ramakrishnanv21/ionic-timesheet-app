import {
  Component,
  OnInit,
  ViewChild,
  CUSTOM_ELEMENTS_SCHEMA,
  signal,
  inject,
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

  entryForm!: FormGroup;

  constructor() {}

  ngOnInit() {
    this.entryForm = this.fb.group({
      startTime: [this.startDefaultTime, Validators.required],
      endTime: [this.endDefaultTime, Validators.required],
    });
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
