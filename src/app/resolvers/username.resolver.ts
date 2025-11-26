import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { JwtService } from '../services/jwt.service';

export const usernameResolver: ResolveFn<string | null> = (route, state) => {
    const jwtService = inject(JwtService);
    return jwtService.getUsernameFromToken();
};
