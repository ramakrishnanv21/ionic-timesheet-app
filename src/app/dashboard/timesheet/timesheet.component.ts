import { Component, OnInit, inject, signal } from '@angular/core';
import {
	IonList,
	IonItem,
	IonNote,
	IonSpinner,
	IonItemSliding,
	IonItemOptions,
	IonItemOption,
	IonIcon,
	IonCard,
	ModalController,
	AlertController,
} from '@ionic/angular/standalone';
import { TimesheetService } from '../../services/timesheet.service';
import { Timesheet } from '../../model/Timesheet';
import { DatePipe } from '@angular/common';
import { EntryFormComponent } from '../entry-form/entry-form.component';
import { addIcons } from 'ionicons';
import { createOutline, trashOutline } from 'ionicons/icons';

@Component({
	selector: 'app-timesheet',
	templateUrl: './timesheet.component.html',
	styleUrls: ['./timesheet.component.scss'],
	standalone: true,
	imports: [
		IonList,
		IonItem,
		IonNote,
		IonSpinner,
		IonItemSliding,
		IonItemOptions,
		IonItemOption,
		IonIcon,
		IonCard,
		DatePipe,
	]
})
export class TimesheetComponent implements OnInit {
	private timesheetService = inject(TimesheetService);
	private modalCtrl = inject(ModalController);
	private alertCtrl = inject(AlertController);

	timesheets = signal<Timesheet[]>([]);
	loading = signal<boolean>(false);
	error = signal<string | null>(null);

	constructor() {
		addIcons({ createOutline, trashOutline });
	}

	ngOnInit() {
		console.log('TimesheetComponent initialized - loading timesheets');
		this.loadTimesheets();
	}

	loadTimesheets() {
		this.loading.set(true);
		this.error.set(null);
		console.log('Fetching timesheets from API...');

		this.timesheetService.listTimesheets().subscribe({
			next: (data) => {
				console.log('Timesheets received:', data);
				this.timesheets.set(data);
				this.loading.set(false);
			},
			error: (err) => {
				console.error('Failed to load timesheets', err);
				this.error.set(err.error?.message || 'Failed to load timesheets. Please try again.');
				this.loading.set(false);
			},
		});
	}

	async editTimesheet(timesheet: Timesheet) {
		const modal = await this.modalCtrl.create({
			component: EntryFormComponent,
			componentProps: {
				timesheetData: timesheet,
			},
		});
		modal.present();

		const response = await modal.onWillDismiss();
		if (response.role === 'confirm') {
			// Reload timesheets to see updates
			this.loadTimesheets();
		}
	}

	async deleteTimesheet(timesheet: Timesheet) {
		const alert = await this.alertCtrl.create({
			header: 'Confirm Delete',
			message: `Are you sure you want to delete the timesheet for ${timesheet.workDate}?`,
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
				},
				{
					text: 'Delete',
					role: 'destructive',
					handler: () => {
						// TODO: Call delete API
						console.log('Delete timesheet:', timesheet);
						this.loadTimesheets();
					},
				},
			],
		});

		await alert.present();
	}
}
