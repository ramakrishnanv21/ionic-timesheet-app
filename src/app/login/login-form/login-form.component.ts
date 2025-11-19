import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonInput,
  LoadingController,
  ToastController,
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { UserResponse } from '../../model/user';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  imports: [
    RouterLink,
    IonGrid,
    IonButton,
    CommonModule,
    ReactiveFormsModule,
    IonRow,
    IonCol,
    IonItem,
    IonInput,
  ],
})
export class LoginFormComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private loadingController = inject(LoadingController);
  private toastController = inject(ToastController);
  private formBuilder = inject(FormBuilder);
  loginForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  constructor() {}

  ngOnInit() {}

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    const { username, password } = this.loginForm.value;
    if (username && password) {
      this.authService
        .login(username, password)
        .subscribe((response: UserResponse) => {
          console.log('response', response);
          if (response.status === 'success' && response?.token) {
            this.authService.authenticated(response.token);
          }
          this.loadingController
            .create({ keyboardClose: true, message: 'Logging in...' })
            .then((loadingEl) => {
              loadingEl.present();
              setTimeout(() => {
                loadingEl.dismiss();
                this.toastController
                  .create({
                    message:
                      response.status === 'success'
                        ? response.message
                        : 'Login failed. Please try again.',
                    duration: 2000,
                    color: response.status === 'success' ? 'success' : 'danger',
                  })
                  .then((toastEl) => {
                    toastEl.present();
                    if (response) {
                      this.router.navigate(['/dashboard']);
                    }
                  });
              }, 1500);
            });
        });
    }
  }
}
