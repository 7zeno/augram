// This interface defines the shape of a User object we expect from the API
export interface User {
  _id: string;
  rollNumber: string;
  username: string;
  profilePicture?: string;
  bio?: string;
  followers: string[]; // Array of User IDs
  following: string[]; // Array of User IDs
  createdAt: Date;
  updatedAt: Date;
}
