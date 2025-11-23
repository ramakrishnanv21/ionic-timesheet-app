import { Component, input, OnInit, output } from '@angular/core';
import {
  IonCard,
  IonButton,
  IonIcon,
  IonDatetime,
} from '@ionic/angular/standalone';
import { IonDatetimeCustomEvent, DatetimeChangeEventDetail } from '@ionic/core';

@Component({
  selector: 'app-date-time',
  templateUrl: './date-time.component.html',
  styleUrls: ['./date-time.component.scss'],
  imports: [IonDatetime, IonIcon, IonButton, IonCard],
})
export class DateTimeComponent implements OnInit {
  defaultValue = input.required<string>();
  togglePicker = output();
  onDateChange = output<string>();
  constructor() {}

  ngOnInit() {}

  onClose() {
    this.togglePicker.emit();
  }

  onChangeDate(event: IonDatetimeCustomEvent<DatetimeChangeEventDetail>) {
    this.onDateChange.emit(event.detail.value as string);
  }
}
