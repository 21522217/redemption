"server only";

import { db } from "../config";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
  increment,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export async function createFollow(followerId: string, followingId: string) {
  if (!followerId || !followingId) {
    throw new Error(
      "Invalid followerId or followingId: They must be non-empty strings."
    );
  }

  const timestamp = Timestamp.now();
  const followData = {
    followerId,
    followingId,
    createdAt: timestamp,
  };
  await addDoc(collection(db, "follows"), followData);

  const followingUserRef = doc(db, "users", followingId);
  await updateDoc(followingUserRef, {
    followers: increment(1),
  });
}

export async function deleteFollow(followerId: string, followingId: string) {
  if (!followerId || !followingId) {
    throw new Error(
      "Invalid followerId or followingId: They must be non-empty strings."
    );
  }

  const followQuery = collection(db, "follows");
  const followSnapshot = await getDocs(
    query(
      followQuery,
      where("followerId", "==", followerId),
      where("followingId", "==", followingId)
    )
  );

  if (followSnapshot.empty) {
    throw new Error("Follow relationship not found.");
  }

  const followDoc = followSnapshot.docs[0];
  await deleteDoc(followDoc.ref);

  const followingUserRef = doc(db, "users", followingId);
  await updateDoc(followingUserRef, {
    followers: increment(-1),
  });
}

export async function isFollowing(followerId: string, followingId: string): Promise<boolean> {
  const followQuery = collection(db, "follows");
  const followSnapshot = await getDocs(
    query(
      followQuery,
      where("followerId", "==", followerId),
      where("followingId", "==", followingId)
    )
  );
  return followSnapshot.docs.some(doc => doc.exists());
}
