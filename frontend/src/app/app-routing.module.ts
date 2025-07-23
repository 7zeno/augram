import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { AuthGuard } from './auth/auth.guard'; // Import AuthGuard
import { GuestGuard } from './auth/guest.guard'; // Import GuestGuard

const routes: Routes = [
  // These routes are protected by AuthGuard (must be logged in)
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'create-post', component: CreatePostComponent, canActivate: [AuthGuard] },

  // These routes are protected by GuestGuard (must be logged out)
  { path: 'login', component: LoginComponent, canActivate: [GuestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [GuestGuard] },
  
  // Wildcard route to redirect unknown URLs to the homepage
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }