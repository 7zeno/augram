import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  posts$!: Observable<Post[]>;
  currentUser$!: Observable<User | null>; // To hold the current user's data

  constructor(
    private authService: AuthService,
    private postService: PostService
  ) { }

  ngOnInit(): void {
    this.posts$ = this.postService.getPosts();
    this.currentUser$ = this.authService.getCurrentUser(); // Get user data from AuthService
  }

  logout(): void {
    this.authService.logout();
  }
}