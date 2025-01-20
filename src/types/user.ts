export interface User {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    bio: string;
    followers: number;
    isVerified: boolean;
  }
  
  export interface SearchSuggestions {
    users: User[];
  }