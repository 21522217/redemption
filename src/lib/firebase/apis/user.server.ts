"server-only";

import { db } from "../config";
import { 
  doc, 
  setDoc,
  getDoc,
  collection,
  getDocs,
  Firestore, 
} from "firebase/firestore";
import { User } from "@/types/user";
import { Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

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

export async function fetchCurrentUser(): Promise<User> {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("User not authenticated.");
  }

  const userDoc = await getDoc(doc(db, "users", currentUser.uid));

  if (!userDoc.exists()) {
    throw new Error(`User with ID ${currentUser.uid} not found.`);
  }

  const userData = userDoc.data();

  return {
    id: currentUser.uid,
    username: "",
    firstName: "",
    lastName: "",
    profilePicture: "",
    email: "",
    bio: "",
    followers: 0,
    isVerified: false,
    passwordHash: "",
    createdAt: 0,
    updatedAt: 0,
    ...userData, 
  } as User;
}