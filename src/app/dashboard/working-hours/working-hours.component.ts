import { DatePipe } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonNote,
  IonIcon,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-working-hours',
  templateUrl: './working-hours.component.html',
  styleUrls: ['./working-hours.component.scss'],
  imports: [
    IonNote,
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonCard,
    IonCardHeader,
    DatePipe,
    IonIcon,
  ],
})
export class WorkingHoursComponent implements OnInit {
  hours = input.required<string>();
  month = input<string>('');
  constructor() { }

  ngOnInit() { }
}
