import { Component, OnInit, inject, signal } from '@angular/core';
import {
	IonLabel,
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
	LoadingController,
	ToastController,
} from '@ionic/angular/standalone';
import { TimesheetService } from '../../services/timesheet.service';
import { Timesheet, TimesheetResponse } from '../../model/Timesheet';
import { DatePipe } from '@angular/common';
import { EntryFormComponent } from '../entry-form/entry-form.component';
import { addIcons } from 'ionicons';
import { createOutline, trashOutline } from 'ionicons/icons';
import { MonthFilterComponent } from '../../shared/month-filter/month-filter.component';
import { Router } from '@angular/router';

@Component({
	selector: 'app-timesheet',
	templateUrl: './timesheet.component.html',
	styleUrls: ['./timesheet.component.scss'],
	standalone: true,
	imports: [
		IonLabel,
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
		MonthFilterComponent
	]
})
export class TimesheetComponent implements OnInit {
	private timesheetService = inject(TimesheetService);
	private modalCtrl = inject(ModalController);
	private alertCtrl = inject(AlertController);
	private router = inject(Router);
	private loadingController = inject(LoadingController);
	private toastController = inject(ToastController);
	timesheets = signal<Timesheet[]>([]);
	loading = signal<boolean>(false);
	error = signal<string | null>(null);
	selectedMonth = signal<string>(new Date().toISOString());

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

		const selectedDate = new Date(this.selectedMonth());
		const year = selectedDate.getFullYear();
		const month = selectedDate.getMonth() + 1; // API expects 1-based month

		console.log(`Fetching timesheets for ${year}-${month}...`);

		this.timesheetService.listTimesheets(year, month).subscribe({
			next: (response: TimesheetResponse) => {
				const data = response.data;
				// Sort by date descending
				const sortedData = data.sort((a, b) => new Date(b.workDate).getTime() - new Date(a.workDate).getTime());
				this.timesheets.set(sortedData);
				this.loading.set(false);
			},
			error: (err) => {
				console.error('Failed to load timesheets', err);
				this.error.set(err.error?.message || 'Failed to load timesheets. Please try again.');
				this.loading.set(false);
			},
		});
	}

	onMonthChange(month: string) {
		this.selectedMonth.set(month);
		this.loadTimesheets();
	}

	async editTimesheet(timesheet: Timesheet, slidingItem: IonItemSliding) {
		const modal = await this.modalCtrl.create({
			component: EntryFormComponent,
			componentProps: {
				timesheetData: timesheet,
			},
		});
		modal.present();

		const response = await modal.onWillDismiss();
		slidingItem.close();
		if (response.role === 'confirm') {
			const loadingEl = await this.loadingController.create({
				keyboardClose: true,
				message: 'Updating timesheet...',
			});
			await loadingEl.present();

			this.timesheetService.updateTimesheet(response.data).subscribe({
				next: async (res: TimesheetResponse) => {
					await loadingEl.dismiss();
					const toastEl = await this.toastController.create({
						message: res.message || 'Timesheet updae successfully.',
						duration: 2000,
						color: 'success',
					});
					await toastEl.present();
					if (res.status === 'success') {
						this.router.navigate(['/dashboard']);
					}
				},
				error: async (err) => {
					await loadingEl.dismiss();
					const toastEl = await this.toastController.create({
						message: err.error?.message || 'Failed to update timesheet. Please try again.',
						duration: 2000,
						color: 'danger',
					});
					await toastEl.present();
				},
			});
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
						this.timesheetService.deleteTimesheet(timesheet.id!).subscribe({
							next: async () => {
								console.log('Deleted timesheet:', timesheet);
								const toast = await this.toastController.create({
									message: 'Timesheet deleted successfully',
									duration: 2000,
									color: 'success',
									position: 'bottom'
								});
								await toast.present();
								this.loadTimesheets();
							},
							error: async (err) => {
								console.error('Failed to delete timesheet', err);
								const toast = await this.toastController.create({
									message: err.error?.message || 'Failed to delete timesheet. Please try again.',
									duration: 2000,
									color: 'danger',
									position: 'bottom'
								});
								await toast.present();
							}
						});
					},
				},
			],
		});

		await alert.present();
	}
	calculateDuration(startTime: string, endTime: string): { hours: string, minutes: string } {
		const start = new Date(`2000-01-01T${startTime}`);
		const end = new Date(`2000-01-01T${endTime}`);
		let diff = end.getTime() - start.getTime();

		if (diff < 0) {
			// Handle overnight shifts if necessary, or assume same day
			diff += 24 * 60 * 60 * 1000;
		}

		const hours = Math.floor(diff / (1000 * 60 * 60));
		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

		const hoursStr = hours.toString().padStart(2, '0');
		const minutesStr = minutes.toString().padStart(2, '0');

		return { hours: hoursStr, minutes: minutesStr };
	}

	getWeekNumber(dateString: string): number {
		const date = new Date(dateString);
		const startOfYear = new Date(date.getFullYear(), 0, 1);
		const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
		return Math.ceil((dayOfYear + startOfYear.getDay() + 1) / 7);
	}
}
