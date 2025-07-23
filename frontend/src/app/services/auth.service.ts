
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../models/user.model'; // We will create this model interface next

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // IMPORTANT: Replace with your deployed Render URL in production
  private apiUrl = 'https://augram-backend.onrender.com/api'; // Use your Codespace URL for testing

  private authStatusListener = new BehaviorSubject<boolean>(this.hasToken());
  private user$ = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  // --- Core API Calls ---

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData).pipe(
      tap((res: any) => this.setSession(res.token))
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((res: any) => this.setSession(res.token))
    );
  }

  // Fetches the profile of the currently logged-in user
  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/auth/me`).pipe(
      tap(user => this.user$.next(user))
    );
  }

  // --- Session Management ---

  private setSession(token: string): void {
    localStorage.setItem('auth_token', token);
    this.authStatusListener.next(true);
    this.getUserProfile().subscribe(); // Fetch user profile after login/register
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
