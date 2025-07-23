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
    
    this.postService.addComment(postId, text).subscribe(
      () => { // next callback
        // For now, we reload to see the new comment.
        // A better approach would be state management (e.g., NgRx, Akita).
        this.posts$ = this.postService.getPosts();
      },
      (err) => { // error callback
        console.error('Failed to add comment', err);
      }
    );
  }

  logout(): void {
    this.authService.logout();
  }
}
