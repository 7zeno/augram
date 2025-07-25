import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // IMPORTANT: Make sure this is your live Render URL
  private apiUrl = 'https://augram-backend.onrender.com/api';

  private authStatusListener = new BehaviorSubject<boolean>(this.hasToken());
  private user$ = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    // If a token exists on app startup, immediately try to fetch the user's profile.
    if (this.hasToken()) {
      this.getUserProfile().subscribe();
    }
  }

  // --- Core API Calls ---

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/register`, userData).pipe(
      tap(res => this.handleAuthSuccess(res.token))
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(res => this.handleAuthSuccess(res.token))
    );
  }

  // Fetches the profile of the currently logged-in user
  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/auth/me`).pipe(
      tap(user => this.user$.next(user)),
      catchError(error => {
        // If the token is invalid, log the user out
        this.logout();
        return of(); // Return an empty observable to prevent breaking the stream
      })
    );
  }

  // --- Session Management ---

  /**
   * This private method now handles the entire post-authentication flow,
   * including saving the token, fetching the user profile, and navigating.
   * This is the FIX for the navigation issue.
   */
  private handleAuthSuccess(token: string): void {
    localStorage.setItem('auth_token', token);
    this.authStatusListener.next(true);
    this.getUserProfile().subscribe(); // Fetch user profile
    this.router.navigate(['/']);      // Navigate to the homepage
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.authStatusListener.next(false);
    this.user$.next(null);
    this.router.navigate(['/login']);
  }

  // --- Helper Methods & Observables ---

  isLoggedIn(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }
  
  getCurrentUser(): Observable<User | null> {
    return this.user$.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('auth_token');
  }
}
