"server only";

import { Post, LikedPost } from "@/types/post";
import { User } from "@/types/user";

import { db } from "../config";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  setDoc,
  runTransaction,
} from "firebase/firestore";

export async function createPost(post: Post) {
  const postDoc = await addDoc(collection(db, "posts"), post);
  return postDoc;
}

export async function fetchPostsWithUsers() {
  const postsCollection = collection(db, "posts");
  const postsSnapshot = await getDocs(postsCollection);

  const postsWithUsers: Array<Post & { user: User }> = [];

  for (const postDoc of postsSnapshot.docs) {
    const postData = postDoc.data() as Post;
    const userDoc = await getDoc(doc(db, "users", postData.userId.toString()));
    const userData = userDoc.data() as User;

    postsWithUsers.push({
      ...postData,
      user: userData,
    });
  }

  return postsWithUsers;
}

export async function toggleLikePost(postId: string, userId: string) {
  const likeDoc = doc(db, "liked_post", `${userId}_${postId}`);
  const postDoc = doc(db, "posts", postId);

  try {
    await runTransaction(db, async (transaction) => {
      const [likeSnap, postSnap] = await Promise.all([
        transaction.get(likeDoc),
        transaction.get(postDoc),
      ]);

      if (!postSnap.exists()) {
        throw new Error("Post does not exist");
      }

      const post = postSnap.data() as Post;
      let updatedLikesCount = post.likesCount;

      if (!likeSnap.exists()) {
        transaction.set(likeDoc, {
          userId,
          postId,
          createdAt: new Date(),
          isLiked: true,
        } as LikedPost);
        updatedLikesCount++;
      } else {
        const likeData = likeSnap.data() as LikedPost;
        const newIsLiked = !likeData.isLiked;

        transaction.update(likeDoc, { isLiked: newIsLiked });
        updatedLikesCount += newIsLiked ? 1 : -1;
      }

      transaction.update(postDoc, { likesCount: updatedLikesCount });
    });
  } catch (error) {
    console.error("Error toggling like: ", error);
    throw error;
  }
}

export async function isPostLiked(
  postId: string,
  userId: string
): Promise<boolean> {
  const likeDoc = doc(db, "liked_post", `${userId}_${postId}`);

  const likeSnap = await getDoc(likeDoc);

  if (likeSnap.exists()) {
    const likeData = likeSnap.data() as { isLiked: boolean };
    return likeData.isLiked;
  }

  return false;
}
