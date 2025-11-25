import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	IonItem,
	IonLabel,
	IonDatetime,
	IonDatetimeButton,
	IonModal,
	IonList
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'app-month-filter',
	templateUrl: './month-filter.component.html',
	standalone: true,
	imports: [
		IonItem,
		IonLabel,
		IonDatetime,
		IonDatetimeButton,
		IonModal,
		IonList,
		FormsModule,
		CommonModule
	]
})
export class MonthFilterComponent {
	@Input() selectedMonth: string = new Date().toISOString();
	@Output() monthChange = new EventEmitter<string>();

	onDateChange(event: any) {
		this.selectedMonth = event.detail.value;
		this.monthChange.emit(this.selectedMonth);
	}
}
