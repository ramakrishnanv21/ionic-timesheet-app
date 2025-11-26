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

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss'],
  imports: [IonMenu, IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, RouterLink]
})
export class SidebarMenuComponent implements OnInit {
  private jwtService = inject(JwtService);
  private menuController = inject(MenuController);
  username = signal<string | null>(null);

  constructor() { }

  ngOnInit() {
    this.username.set(this.jwtService.getUsernameFromToken());
  }

  async closeMenu() {
    await this.menuController.close();
  }

}
