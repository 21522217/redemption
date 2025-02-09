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
  email: string;
  bio: string;
  followers: number;
  isVerified: boolean;
  passwordHash: string;
  createdAt: number;
  updatedAt: number;
}

export interface UserProfileUpdate{
  username: string;
  firstName: string;
  lastName: string;
  bio: string;
  profilePicture: string;
  showReplyTab?: boolean;
  showRepostTab?: boolean;
}


