import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
  signal,
  effect,
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
  IonButton,
  ToastController,
  IonSegment,
  IonSegmentButton,
} from '@ionic/angular/standalone';
import { JwtService } from '../services/jwt.service';
import { Router, RouterLink, RouterOutlet, NavigationEnd } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { filter } from 'rxjs';
import { TimesheetService } from '../services/timesheet.service';
import { SidebarMenuComponent } from '../layout/sidebar-menu/sidebar-menu.component';

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
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonMenuButton,
    RouterLink,
    RouterOutlet,
    IonButton,
    IonSegment,
    IonSegmentButton,
    SidebarMenuComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardPage implements OnInit {
  private jwtService = inject(JwtService);
  private authService = inject(AuthService);
  private toastController = inject(ToastController);
  private timesheetService = inject(TimesheetService);

  private router = inject(Router);
  username = signal<string | null>(null);
  activeTab = 'overview';

  constructor() {
    // Subscribe to router events to update active tab
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const url = this.router.url;
      if (url.includes('/timesheet')) {
        this.activeTab = 'timesheet';
      } else {
        this.activeTab = 'overview';
      }
    });
  }

  ngOnInit() {
    this.username.set(this.jwtService.getUsernameFromToken());
    // Set initial active tab based on current route
    const url = this.router.url;
    if (url.includes('/timesheet')) {
      this.activeTab = 'timesheet';
    } else {
      this.activeTab = 'overview';
    }
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
