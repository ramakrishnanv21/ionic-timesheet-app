import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonNote,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-total-amount',
  templateUrl: './total-amount.component.html',
  styleUrls: ['./total-amount.component.scss'],
  imports: [
    IonNote,
    CurrencyPipe,
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    DatePipe
  ],
})
export class TotalAmountComponent implements OnInit {
  amount = input.required<string>();
  month = input<string>('');
  constructor() { }

  ngOnInit() { }
}
