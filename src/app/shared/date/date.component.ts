import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  IonItem,
  IonLabel,
  IonModal,
  IonDatetime,
  IonDatetimeButton,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
  standalone: true,
  imports: [
    IonItem,
    IonLabel,
    IonModal,
    IonDatetime,
    IonDatetimeButton,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateComponent),
      multi: true,
    },
  ],
})
export class DateComponent implements ControlValueAccessor {
  @Input() label: string = 'Date';
  @Input() dateId: string = 'datePickerId';
  @Output() dateChange = new EventEmitter<string>();

  value: string = new Date().toISOString();
  disabled: boolean = false;

  private onChange: (value: any) => void = () => { };
  private onTouched: () => void = () => { };

  // ControlValueAccessor methods
  writeValue(value: any): void {
    if (value) {
      this.value = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onDateSelected(event: any): void {
    const selectedDate = event.detail.value;
    this.value = selectedDate;
    this.onChange(selectedDate);
    this.onTouched();
    this.dateChange.emit(selectedDate);
  }
}
