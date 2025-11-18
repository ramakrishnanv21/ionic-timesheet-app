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
  IonNote,
  LoadingController,
  ToastController
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { SignupData } from '../../model/user';
import { UserValidationService } from '../user-validator.service';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss'],
  imports: [IonNote,  
    RouterLink,
    IonGrid,
    IonButton,
    CommonModule,
    ReactiveFormsModule,
    IonRow,
    IonCol,
    IonItem,
    IonInput
  ],
  providers: [UserValidationService]
})
export class SignupFormComponent  implements OnInit {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private userValidationService = inject(UserValidationService);
  private loadingController = inject(LoadingController);
  private toastController = inject(ToastController);

  signupForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email], [this.userValidationService.checkEmail()]],
    username: ['', Validators.required, this.userValidationService.checkUsername()],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirm_password: ['', [Validators.required, Validators.minLength(6)]],
  },
  { validators: this.userValidationService.passwordMatchValidator }
);
  constructor() {}

  ngOnInit() {}

  onSubmit() {
    if (this.signupForm.invalid) {
      return;
    }
    const { email, username, password } = this.signupForm.value;
    if( email && username && password ) {
      this.authService.signup({ email, username, password }).subscribe((success) => {
        this.loadingController
          .create({ keyboardClose: true, message: 'Registering ...' })
          .then(loadingEl => {
            loadingEl.present();
            setTimeout(() => {
              loadingEl.dismiss();
              this.toastController.create({
                message: success ? 'Registration successful!' : 'Registration failed. Please try again.',
                duration: 2000,
                color: success ? 'success' : 'danger'
              }).then(toastEl => {
                toastEl.present();
                if (success) {
                  this.router.navigate(['/login']);
                }
              });
            }, 1500);
          });
      });
    }
  }

}
