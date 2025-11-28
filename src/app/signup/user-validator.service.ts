import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { catchError, map, Observable, of, switchMap, timer } from 'rxjs';

@Injectable()
export class UserValidationService {
  private http = inject(HttpClient);

  constructor(@Inject('API_URL') private apiUrl: string) { }

  checkEmail(): AsyncValidatorFn {
    const debounceMs = 500;
    return (
      control: AbstractControl
    ): Observable<{ emailTaken: boolean } | null> => {
      if (!control.value) {
        return of(null);
      }

      return timer(debounceMs).pipe(
        switchMap(() =>
          this.http
            .post<{ available: boolean }>(
              `${this.apiUrl}/users/checkEmail`,
              { email: control.value }
            )
            .pipe(
              map((res) => (res.available ? null : { emailTaken: true })),
              catchError(() => of({ emailTaken: true }))
            )
        )
      );
    };
  }

  checkUsername(): AsyncValidatorFn {
    const debounceMs = 500;
    return (
      control: AbstractControl
    ): Observable<{ usernameTaken: boolean } | null> => {
      if (!control.value) {
        return of(null);
      }

      return timer(debounceMs).pipe(
        switchMap(() =>
          this.http
            .post<{ available: boolean }>(
              `${this.apiUrl}/users/checkUsername`,
              { username: control.value }
            )
            .pipe(
              map((res) => (res.available ? null : { usernameTaken: true })),
              catchError(() => of({ usernameTaken: true }))
            )
        )
      );
    };
  }

  passwordMatchValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirm_password')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordsMismatch: true };
    }
    return null;
  };
}
