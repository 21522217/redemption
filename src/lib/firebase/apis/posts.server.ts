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
  runTransaction,
  increment,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export async function createPost(
  post: Omit<Post, "id" | "createdAt" | "updatedAt">
) {
  const timestamp = Timestamp.now();
  const postWithTimestamps = {
    ...post,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const postRef = await addDoc(collection(db, "posts"), postWithTimestamps);
  const postId = postRef.id;

  await updateDoc(doc(db, "posts", postId), { id: postId });

  return postId;
}

export async function fetchPostsWithUsers() {
  const postsCollection = collection(db, "posts");
  const postsSnapshot = await getDocs(postsCollection);

  const postsWithUsers: Array<Post & { user: User }> = [];

  for (const postDoc of postsSnapshot.docs) {
    const postData = postDoc.data() as Post;

    if (!postData.userId) {
      console.error("Invalid userId in post:", postData);
      continue;
    }

    const userDoc = await getDoc(doc(db, "users", postData.userId));

    if (!userDoc.exists()) {
      console.warn(`User not found for post ${postDoc.id}`);
      continue;
    }

    const userData = userDoc.data() as User;

    postsWithUsers.push({
      ...postData,
      user: userData,
    });
  }

  postsWithUsers.sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      return b.createdAt.seconds - a.createdAt.seconds;
    }
    return 0;
  });

  return postsWithUsers;
}

export async function getPostAndUserById(postId: string) {
  if (!postId) {
    throw new Error("Invalid postId: It must be a non-empty string.");
  }

  const postDoc = await getDoc(doc(db, "posts", postId));

  if (!postDoc.exists()) {
    throw new Error("Post does not exist");
  }

  const postData = postDoc.data() as Post;

  if (!postData.userId) {
    throw new Error("Invalid userId in post");
  }

  const userDoc = await getDoc(doc(db, "users", postData.userId));

  if (!userDoc.exists()) {
    throw new Error("User does not exist");
  }

  const userData = userDoc.data() as User;

  return {
    ...postData,
    user: userData,
  };
}

export async function toggleLikePost(postId: string, userId: string) {
  if (!postId) {
    throw new Error("Invalid postId: It must be a non-empty string.");
  }

  if (!userId) {
    throw new Error("Invalid userId: It must be a non-empty string.");
  }

  const likeDoc = doc(db, "liked_post", `${userId}_${postId}`);
  const postDoc = doc(db, "posts", postId);

  try {
    await runTransaction(db, async (transaction) => {
      const likeSnap = await transaction.get(likeDoc);
      const postSnap = await transaction.get(postDoc);

      if (!postSnap.exists()) {
        throw new Error("Post does not exist");
      }

      if (!likeSnap.exists()) {
        transaction.set(likeDoc, {
          userId,
          postId,
          createdAt: Timestamp.now(),
          isLiked: true,
        } as LikedPost);
        transaction.update(postDoc, { likesCount: increment(1) });
      } else {
        const likeData = likeSnap.data() as LikedPost;
        if (likeData.isLiked) {
          transaction.delete(likeDoc);
          transaction.update(postDoc, { likesCount: increment(-1) });
        } else {
          transaction.update(likeDoc, { isLiked: true });
          transaction.update(postDoc, { likesCount: increment(1) });
        }
      }
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

  return likeSnap.exists() && (likeSnap.data() as LikedPost).isLiked;
}

export async function fetchPostsByUser() {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("User not authenticated.");
  }

  const userId = currentUser.uid;
  console.log("userId", userId);
  
  const postsCollection = collection(db, "posts");
  const userPostsQuery = query(postsCollection, where("userId", "==", userId));
  const postsSnapshot = await getDocs(userPostsQuery);

  const postsWithUsers: Array<Post & { user: User }> = [];

  const userDoc = await getDoc(doc(db, "users", userId));

  if (!userDoc.exists()) {
    console.warn(`User not found for userId ${userId}`);
    return postsWithUsers;
  }

  const userData = userDoc.data() as User;

  for (const postDoc of postsSnapshot.docs) {
    const postData = postDoc.data() as Post;

    postsWithUsers.push({
      ...postData,
      user: userData,
    });
  }

  return postsWithUsers;
}