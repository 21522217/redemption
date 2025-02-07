import { db } from "../config";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { Post } from "@/types/post";
import { User } from "@/types/user";

export async function getUserReposts(
  userId: string
): Promise<Array<Post & { user: User }>> {
  try {
    const repostsRef = collection(db, "reposts");
    const q = query(repostsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const originalPostIds = querySnapshot.docs.map(
      (doc) => doc.data().originalPostId
    );

    if (originalPostIds.length === 0) {
      return [];
    }

    const postsRef = collection(db, "posts");
    const postsQuery = query(postsRef, where("id", "in", originalPostIds));
    const postsSnapshot = await getDocs(postsQuery);

    const postsWithUsers = await Promise.all(
      postsSnapshot.docs.map(async (postDoc) => {
        const post = postDoc.data() as Post;
        const userRef = doc(db, "users", post.userId);
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
          throw new Error(`User not found for post ${post.id}`);
        }
        const user = userDoc.data() as User;
        return { ...post, user };
      })
    );

    return postsWithUsers;
  } catch (error) {
    console.error("Error fetching reposts:", error);
    throw new Error("Failed to fetch reposts.");
  }
}

export async function createRepost(postId: string, userId: string) {
  try {
    const repostRef = doc(collection(db, "reposts"));
    await setDoc(repostRef, {
      id: repostRef.id,
      originalPostId: postId,
      userId,
      createdAt: Timestamp.now(),
    });

    const postRef = doc(db, "posts", postId);
    const postDoc = await getDoc(postRef);
    if (postDoc.exists()) {
      const currentRepostsCount = postDoc.data().repostsCount || 0;
      await updateDoc(postRef, { repostsCount: currentRepostsCount + 1 });
    }
  } catch (error) {
    console.error("Error creating repost:", error);
    throw new Error("Failed to create repost.");
  }
}

export async function deleteRepost(originalPostId: string, userId: string) {
  try {
    const repostsRef = collection(db, "reposts");
    const q = query(
      repostsRef,
      where("originalPostId", "==", originalPostId),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const repostDoc = querySnapshot.docs[0];
      await deleteDoc(repostDoc.ref);

      const postRef = doc(db, "posts", originalPostId);
      const postDoc = await getDoc(postRef);
      if (postDoc.exists()) {
        const currentRepostsCount = postDoc.data().repostsCount || 0;
        const newRepostsCount = Math.max(currentRepostsCount - 1, 0);
        await updateDoc(postRef, { repostsCount: newRepostsCount });
      }
    } else {
      console.warn("No repost found to delete for the given user and post.");
    }
  } catch (error) {
    console.error("Error deleting repost:", error);
    throw new Error("Failed to delete repost.");
  }
}
