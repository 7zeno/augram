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
    
    this.postService.addComment(postId, text).pipe(
      tap(() => {
        this.posts$ = this.postService.getPosts();
      }),
      catchError((err) => {
        console.error('Failed to add comment', err);
        return of(null);
      })
    ).subscribe();
  }

  logout(): void {
    this.authService.logout();
  }
}