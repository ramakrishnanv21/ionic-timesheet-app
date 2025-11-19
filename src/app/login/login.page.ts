import { Component, inject, Inject, OnInit } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonFooter,
  IonIcon,
  IonToolbar,
  IonTitle,
} from '@ionic/angular/standalone';
import { LoginFormComponent } from './login-form/login-form.component';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonTitle,
    IonToolbar,
    IonIcon,
    IonFooter,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonContent,
    IonHeader,
    LoginFormComponent,
  ],
})
export class LoginPage implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor(@Inject('APP_NAME') public appName: string) {}

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigateByUrl('/dashboard');
    }
  }
}
