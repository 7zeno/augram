import { Component, Input } from '@angular/core';
import { PostService } from '../../services/post.service';

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
    
    // FIX: Using the older, multi-argument syntax for .subscribe()
    this.postService.addReply(this.postId, this.comment._id, this.replyText).subscribe(
      (updatedPost) => { // Success callback
        // For now, we reload the page to see the new change.
        window.location.reload();
      },
      (err) => { // Error callback
        console.error('Failed to add reply', err);
      }
    );

    this.replyText = '';
    this.showReplyForm = false;
  }
}
