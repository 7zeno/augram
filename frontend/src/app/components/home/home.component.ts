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
  currentUser$!: Observable<User | null>;

  constructor(
    private authService: AuthService,
    private postService: PostService
  ) { }

  ngOnInit(): void {
    this.posts$ = this.postService.getPosts();
    this.currentUser$ = this.authService.getCurrentUser();
  }

  addComment(postId: string, text: string) {
    if (!text.trim()) return;
    
    // FIX: Using explicit types in the subscribe callbacks
    this.postService.addComment(postId, text).subscribe(
      (response: any) => { // Success callback
        this.posts$ = this.postService.getPosts();
      },
      (err: any) => { // Error callback
        console.error('Failed to add comment', err);
      }
    );
  }

  logout(): void {
    this.authService.logout();
  }
}