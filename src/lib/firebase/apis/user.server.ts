"server-only";

import { db } from "../config";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { User } from "@/types/user";
import { Timestamp } from "firebase/firestore";

export async function createUserDocument(uid: string, params: Partial<User>) {
  const userRef = doc(db, "users", uid);

  const userData: User = {
    id: uid, 
    username: params.username ?? "", 
    firstName: params.firstName ?? "",
    lastName: params.lastName ?? "",
    profilePicture: params.profilePicture ?? "https://github.com/shadcn.png",
    email: params.email ?? "",
    bio: params.bio ?? "",
    followers: params.followers ?? 0,
    isVerified: params.isVerified ?? false,
    passwordHash: "", 
    createdAt: Timestamp.now().toMillis(),
    updatedAt: Timestamp.now().toMillis(),
  };

  await setDoc(userRef, userData);

  return userRef;
}

export async function isPostOwner(postId: string, userId: string): Promise<boolean> {
  const postRef = doc(db, "posts", postId);
  const postDoc = await getDoc(postRef);

  return postDoc.exists() && postDoc.data().ownerId === userId;
}
