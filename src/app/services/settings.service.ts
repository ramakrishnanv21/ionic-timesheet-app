import { Injectable, signal, inject } from '@angular/core';
import { JwtService } from './jwt.service';

/**
 * Service to manage user settings across the application.
 * Uses signals for reactive state management.
 */
@Injectable({
    providedIn: 'root',
})
export class SettingsService {
    private jwtService = inject(JwtService);

    // Signal to hold the current hourly rate, initialized from token if available
    private hourlyRateSignal = signal<number>(this.jwtService.getHourlyRate() || 0);

    /**
     * Gets the current hourly rate as a signal
     */
    getHourlyRate() {
        return this.hourlyRateSignal.asReadonly();
    }

    /**
     * Updates the hourly rate
     * @param rate - The new hourly rate
     */
    setHourlyRate(rate: number) {
        this.hourlyRateSignal.set(rate);
    }
}
