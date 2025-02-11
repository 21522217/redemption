import { db } from "../config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  runTransaction,
  Timestamp,
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

export async function toggleRepost(postId: string, userId: string) {
  if (!postId) {
    throw new Error("Invalid postId: It must be a non-empty string.");
  }

  if (!userId) {
    throw new Error("Invalid userId: It must be a non-empty string.");
  }

  const repostDoc = doc(db, "reposts", `${userId}_${postId}`);
  const postDoc = doc(db, "posts", postId);

  try {
    await runTransaction(db, async (transaction) => {
      const repostSnap = await transaction.get(repostDoc);
      const postSnap = await transaction.get(postDoc);

      if (!postSnap.exists()) {
        throw new Error("Post does not exist");
      }

      if (!repostSnap.exists()) {
        transaction.set(repostDoc, {
          userId,
          originalPostId: postId,
          createdAt: Timestamp.now(),
        });
        transaction.update(postDoc, { repostsCount: increment(1) });
      } else {
        transaction.delete(repostDoc);
        transaction.update(postDoc, { repostsCount: increment(-1) });
      }
    });
  } catch (error) {
    console.error("Error toggling repost: ", error);
    throw error;
  }
}

export async function isReposted(
  postId: string,
  userId: string
): Promise<boolean> {
  if (!postId) {
    throw new Error("Invalid postId: It must be a non-empty string.");
  }

  if (!userId) {
    throw new Error("Invalid userId: It must be a non-empty string.");
  }

  const repostDoc = doc(db, "reposts", `${userId}_${postId}`);

  try {
    const repostSnap = await getDoc(repostDoc);
    return repostSnap.exists();
  } catch (error) {
    console.error("Error checking repost status: ", error);
    throw error;
  }
}
