import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonTitle,
  IonToolbar,
  IonMenu,
  MenuController,
} from '@ionic/angular/standalone';
import { JwtService } from '../../services/jwt.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss'],
  imports: [IonMenu, IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, RouterLink]
})
export class SidebarMenuComponent implements OnInit {
  private jwtService = inject(JwtService);
  private menuController = inject(MenuController);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastController = inject(ToastController);

  username = signal<string | null>(null);

  constructor() { }

  ngOnInit() {
    this.username.set(this.jwtService.getUsernameFromToken());
  }

  async closeMenu() {
    await this.menuController.close();
  }

  async logout() {
    this.authService.logout();
    await this.menuController.close();

    const toast = await this.toastController.create({
      message: 'Successfully logged out',
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();

    this.router.navigate(['/login']);
  }

}
