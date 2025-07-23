import { Component, Input } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';

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
    
    // FIX: Using explicit types in the subscribe callbacks
    this.postService.addReply(this.postId, this.comment._id, this.replyText).subscribe(
      (updatedPost: Post) => { // Success callback
        window.location.reload();
      },
      (err: any) => { // Error callback
        console.error('Failed to add reply', err);
      }
    );

    this.replyText = '';
    this.showReplyForm = false;
  }
}