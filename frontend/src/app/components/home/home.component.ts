import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';
import { User } from '../../models/user.model';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

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
    
    // FIX: Using a more robust .pipe() pattern for the subscription
    this.postService.addComment(postId, text).pipe(
      tap(() => {
        // Success logic: refetch the posts to show the new comment
        this.posts$ = this.postService.getPosts();
      }),
      catchError((err) => {
        // Error logic
        console.error('Failed to add comment', err);
        return of(null); // Return a new observable to complete the stream
      })
    ).subscribe();
  }

  logout(): void {
    this.authService.logout();
  }
}