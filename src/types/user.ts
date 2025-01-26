export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  role: string;
  authId: string;
  createdAt: number;
}

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  bio: string;
  followers: number;
  isVerified: boolean;
  passwordHash: string;
  createdAt: number;
  updatedAt: number;
}

export interface Post {
  id: string;
  userId: string;
  caption: string;
  contentURL: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface Comment {
  id: string;
  userId: string;
  postId: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface Like {
  id: string;
  userId: string;
  postId: string;
  createdAt: number;
  updatedAt: number;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: number;
  updatedAt: number;
}
