"server only";

import { db } from "../config";
import {
  collection,
  addDoc,
  doc,
  Timestamp,
  increment,
  deleteDoc,
  getDocs,
  query,
  where,
  runTransaction,
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

  await runTransaction(db, async (transaction) => {
    const followRef = collection(db, "follows");
    await addDoc(followRef, followData);

    const followingUserRef = doc(db, "users", followingId);
    transaction.update(followingUserRef, {
      followers: increment(1),
    });
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

  await runTransaction(db, async (transaction) => {
    await deleteDoc(followDoc.ref);

    const followingUserRef = doc(db, "users", followingId);
    transaction.update(followingUserRef, {
      followers: increment(-1),
    });
  });
}

export async function checkIfFollowing(
  followerId: string,
  followingId: string
): Promise<boolean> {
  const followQuery = collection(db, "follows");
  const followSnapshot = await getDocs(
    query(
      followQuery,
      where("followerId", "==", followerId),
      where("followingId", "==", followingId)
    )
  );
  return followSnapshot.docs.some((doc) => doc.exists());
}
export async function getFollowers(userId: string) {
  const followersRef = collection(db, "follows");
  const q = query(followersRef, where("followingId", "==", userId));
  const followersSnapshot = await getDocs(q);
  const followerIds = followersSnapshot.docs.map((doc) => doc.data().followerId);

  const usersRef = collection(db, "users");
  const usersQuery = query(usersRef, where("id", "in", followerIds));
  const usersSnapshot = await getDocs(usersQuery);

  return usersSnapshot.docs.map((doc) => doc.data());
}
