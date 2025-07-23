import { Component, Input } from '@angular/core';
import { Post } from '../../models/post.model';
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
    
    // FIX: Using the multi-argument syntax for .subscribe()
    this.postService.addReply(this.postId, this.comment._id, this.replyText).subscribe(
      (updatedPost) => { // next callback
        // Ideally, you would update the specific post in a state management service
        // For now, we can just reload the page to see the change.
        window.location.reload();
      },
      (err) => { // error callback
        console.error('Failed to add reply', err);
      }
    );

    this.replyText = '';
    this.showReplyForm = false;
  }
}