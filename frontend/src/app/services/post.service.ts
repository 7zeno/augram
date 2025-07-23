import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model'; // We will create this model next

@Injectable({
  providedIn: 'root'
})
export class PostService {
  // Use the same API URL as your AuthService
  private apiUrl = 'https://augram-backend.onrender.com/api/posts'; // Make sure this is your live Render URL

  constructor(private http: HttpClient) { }

  /**
   * Fetches all posts for the main feed.
   */
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  /**
   * Creates a new post.
   * @param postData - An object containing the post's textContent and optional imageUrl.
   */
  createPost(postData: { textContent: string, imageUrl?: string }): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, postData);
  }
}

