import { Component, Input } from '@angular/core';
import { PostService } from '../../services/post.service';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent {
  @Input() comment: any;
  @Input() postId!: string;
  showReplyForm = false;
  replyText = '';

  constructor(private postService: PostService) {}

  submitReply() {
    if (!this.replyText.trim()) return;
    
    this.postService.addReply(this.postId, this.comment._id, this.replyText).pipe(
      tap(() => {
        window.location.reload();
      }),
      catchError((err) => {
        console.error('Failed to add reply', err);
        return of(null);
      })
    ).subscribe();

    this.replyText = '';
    this.showReplyForm = false;
  }
}