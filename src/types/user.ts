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

