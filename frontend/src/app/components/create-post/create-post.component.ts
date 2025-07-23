import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent {
  postForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private router: Router
  ) {
    this.postForm = this.fb.group({
      textContent: ['', [Validators.required, Validators.maxLength(2000)]]
    });
  }

  onSubmit(): void {
    if (this.postForm.invalid) {
      return;
    }

    this.postService.createPost(this.postForm.value).subscribe({
      next: () => {
        // On success, navigate back to the home feed
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.errorMessage = 'Could not create post. Please try again.';
        console.error(err);
      }
    });
  }
}
