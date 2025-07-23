
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authToken = this.authService.getToken();

    // If a token exists, clone the request and add the authorization header
    if (authToken) {
      const authReq = request.clone({
        headers: request.headers.set('x-auth-token', authToken)
      });
      return next.handle(authReq);
    }

    // If no token, pass the original request along
    return next.handle(request);
  }
}
