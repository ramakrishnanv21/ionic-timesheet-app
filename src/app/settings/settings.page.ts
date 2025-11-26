import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSpinner,
  ToastController,
  IonNote,
  IonItemGroup,
} from '@ionic/angular/standalone';
import { UserService } from '../services/user.service';
import { JwtService } from '../services/jwt.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    ReactiveFormsModule,
    IonButtons,
    IonBackButton,
    IonNote,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonSpinner,
    DatePipe,
    IonItemGroup,
  ],
})
export class SettingsPage implements OnInit {
  private userId = signal<string>('');
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private jwtService = inject(JwtService);
  private toastController = inject(ToastController);
  lastUpdated = signal<Date | null>(null);
  settingsForm!: FormGroup;
  isLoading = false;
  isSubmitting = false;

  constructor() {
    this.settingsForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      hourlyRate: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    this.isLoading = true;
    this.userId.set(this.jwtService.getUserId() as string);
    console.log(this.userId());
    if (!this.userId()) {
      this.isLoading = false;
      return;
    }
    this.userService.getCurrentUser(this.userId()).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status === 'success' && response.data) {
          if (response.data.updatedAt) {
            this.lastUpdated.set(new Date(response.data.updatedAt));
          }
          this.settingsForm.patchValue({
            username: response.data.username,
            email: response.data.email,
            hourlyRate: response.data.hourlyRate || '',
          });
        }
      },
      error: async (error) => {
        this.isLoading = false;
        await this.showToast('Failed to load user data', 'danger');
        console.error('Error loading user data:', error);
      },
    });
  }

  async onSubmit() {
    if (this.settingsForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.settingsForm.controls).forEach(key => {
        this.settingsForm.get(key)?.markAsTouched();
      });
      await this.showToast('Please fill in all required fields correctly', 'warning');
      return;
    }

    this.isSubmitting = true;
    const formData = this.settingsForm.value;

    this.userService.updateUser(this.userId(), formData).subscribe({
      next: async (response) => {
        this.isSubmitting = false;
        if (response.status === 'success') {
          await this.showToast('Profile updated successfully!', 'success');
        } else {
          await this.showToast(response.message || 'Update failed', 'danger');
        }
      },
      error: async (error) => {
        this.isSubmitting = false;
        await this.showToast('Failed to update profile', 'danger');
        console.error('Error updating user:', error);
      },
    });
  }

  private async showToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top',
    });
    await toast.present();
  }

  // Helper methods for validation display
  isFieldInvalid(fieldName: string): boolean {
    const field = this.settingsForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.settingsForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (field?.hasError('minLength')) {
      return 'Username must be at least 3 characters';
    }
    if (field?.hasError('min')) {
      return 'Hourly rate must be a positive number';
    }
    return '';
  }
}
