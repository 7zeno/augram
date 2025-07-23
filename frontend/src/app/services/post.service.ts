import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'https://augram-backend.onrender.com/api/posts';

  constructor(private http: HttpClient) { }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  createPost(postData: { textContent: string, imageUrl?: string }): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, postData);
  }

  // FIX: Changed return type from Observable<Post> to Observable<any> to match backend
  addComment(postId: string, text: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/comment/${postId}`, { text });
  }

  addReply(postId: string, commentId: string, text: string): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/comment/${postId}/${commentId}/reply`, { text });
  }
}