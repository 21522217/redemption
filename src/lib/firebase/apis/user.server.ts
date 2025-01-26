"server-only";

import { db } from "../config";
import { doc, setDoc } from "firebase/firestore";
import { UserCredential } from "firebase/auth";
import { CreateUser } from "../signup";

export async function createUserDocument(
  userCreds: UserCredential,
  params: CreateUser
) {
  const { uid } = userCreds.user;

  const userRef = doc(db, "users", uid);

  await setDoc(userRef, {
    ...params,
    createdAt: new Date(),
  });

  return userRef;
}
