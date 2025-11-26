import { ApplicationConfig } from '@angular/core';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
  withComponentInputBinding,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  closeCircleOutline,
  closeOutline,
  heart,
  home,
  logOutOutline,
  person,
} from 'ionicons/icons';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';


addIcons({
  heart,
  home,
  person,
  logOutOutline,
  closeCircleOutline,
  closeOutline,
  calendarOutline
});

const db_password = 'Rama@3214';

import { authInterceptor } from './interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      withComponentInputBinding()
    ),
    { provide: 'APP_NAME', useValue: 'TIMESHEET' },
    { provide: 'API_URL', useValue: `http://localhost:8001` },
  ],
};
