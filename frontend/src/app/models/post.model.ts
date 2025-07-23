import { User } from './user.model'; // We can reuse the User model

// This interface defines the shape of a Post object
export interface Post {
  _id: string;
  textContent: string;
  imageUrl?: string;
  author: Pick<User, '_id' | 'username' | 'profilePicture'>; // Use a subset of the User model
  likes: string[];
  comments: any[]; // You can define a Comment model later
  createdAt: string;
  updatedAt:string;
}

