import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonMenu,
  IonButtons,
  IonMenuButton,
  IonItem,
  IonLabel,
  IonGrid,
  IonCol,
  IonButton,
  ToastController,
} from '@ionic/angular/standalone';
import { JwtService } from '../services/jwt.service';
import { Router, RouterLink } from '@angular/router';
import { TotalAmountComponent } from './total-amount/total-amount.component';
import { WorkingHoursComponent } from './working-hours/working-hours.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    IonLabel,
    IonItem,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonMenu,
    IonMenuButton,
    RouterLink,
    TotalAmountComponent,
    WorkingHoursComponent,
    IonGrid,
    IonCol,
    IonButton,
  ],
  providers: [JwtService, AuthService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardPage implements OnInit {
  private jwtService = inject(JwtService);
  private authService = inject(AuthService);
  private toastController = inject(ToastController);
  private router = inject(Router);
  username = signal<string | null>(null);
  constructor() {}

  ngOnInit() {
    this.username.set(this.jwtService.getUsernameFromToken());
  }

  onLogout() {
    this.authService.logout();
    this.toastController
      .create({
        message: `${this.username()} has been successfully logout!!`,
        duration: 2000,
        color: 'success',
      })
      .then((toastEl) => {
        toastEl.present();
        this.router.navigateByUrl('/login');
      });
  }
}
