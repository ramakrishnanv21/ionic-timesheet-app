import { Component, Inject, OnInit } from '@angular/core';
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
  message: string | null = null;
  color: string | null = null;

  constructor(@Inject('APP_NAME') public appName: string) {}

  ngOnInit() {}

  onLoginStatus(response: { status: string; message: string }) {
    this.message = response.message;
    this.color = response.status === 'success' ? 'success' : 'danger';
    console.log('Login form submitted with values page:', response);
  }
}
