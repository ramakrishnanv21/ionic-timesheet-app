import { Inject, inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserProfile {
    name?: string;
    username: string;
    email: string;
    hourlyRate?: number;
    updatedAt?: string;
}

export interface UserProfileResponse {
    status: 'success' | 'failed';
    message: string;
    data?: UserProfile;
}

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private http = inject(HttpClient);

    constructor(@Inject('API_URL') private apiUrl: string) { }

    getCurrentUser(userId: string): Observable<UserProfileResponse> {
        return this.http.get<UserProfileResponse>(`${this.apiUrl}/users/${userId}`);
    }

    updateUser(userId: string, userData: UserProfile): Observable<UserProfileResponse> {
        return this.http.put<UserProfileResponse>(`${this.apiUrl}/users/${userId}`, userData);
    }
}
