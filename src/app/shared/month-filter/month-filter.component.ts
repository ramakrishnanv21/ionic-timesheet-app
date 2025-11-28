import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	IonItem,
	IonLabel,
	IonDatetime,
	IonModal,
	IonList,
	IonInput,
	IonHeader,
	IonToolbar,
	IonButtons,
	IonButton,
	IonContent
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
		IonModal,
		IonList,
		IonInput,
		IonHeader,
		IonToolbar,
		IonButtons,
		IonButton,
		IonContent,
		FormsModule,
		CommonModule
	]
})
export class MonthFilterComponent {
	@Input() selectedMonth: string = new Date().toISOString();
	@Output() monthChange = new EventEmitter<string>();

	get formattedMonth(): string {
		if (!this.selectedMonth) return '';
		const date = new Date(this.selectedMonth);
		return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
	}

	confirm(datetime: IonDatetime, modal: IonModal) {
		const value = datetime.value;
		if (value) {
			const dateStr = Array.isArray(value) ? value[0] : value;
			this.selectedMonth = dateStr;
			this.monthChange.emit(this.selectedMonth);
		}
		modal.dismiss();
	}

	cancel(modal: IonModal) {
		modal.dismiss();
	}

	onDateChange(event: any) {
		// Optional: Update local state immediately if desired, 
		// but for "Done" button logic, we usually wait for confirm.
		// Keeping this empty or removing it is fine if we rely on 'confirm'.
	}
}
