"use server";

import { db } from "@/lib/firebase/config";
import {
  collection,
  addDoc,
  Timestamp,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { Comment } from "@/types/comment";
import { User } from "@/types/user";

export async function createComment(
  comment: Omit<Comment, "id" | "createdAt" | "updatedAt">
): Promise<void> {
  if (!comment.userId)
    throw new Error("Missing required comment field: userId");
  if (!comment.postId)
    throw new Error("Missing required comment field: postId");
  if (!comment.content)
    throw new Error("Missing required comment field: content");

  const timestamp = Timestamp.now();

  try {
    const commentRef = await addDoc(collection(db, "comments"), {
      ...comment,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    const commentId = commentRef.id;

    await updateDoc(doc(db, "comments", commentId), { id: commentId });
  } catch (error) {
    console.error("Error creating comment:", error);
    throw new Error("Failed to create comment");
  }
}

export async function getPostComments(postId: string): Promise<Comment[]> {
  if (!postId) {
    throw new Error("Invalid postId: It must be a non-empty string.");
  }

  const commentsQuery = query(
    collection(db, "comments"),
    where("postId", "==", postId)
  );

  try {
    const commentsSnapshot = await getDocs(commentsQuery);
    return commentsSnapshot.docs.map((doc) => doc.data() as Comment);
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new Error("Failed to fetch comments");
  }
}

export async function fetchCommentsWithUsers(
  postId: string
): Promise<Array<Comment & { user: User }>> {
  if (!postId) {
    throw new Error("Invalid postId: It must be a non-empty string.");
  }

  const commentsQuery = query(
    collection(db, "comments"),
    where("postId", "==", postId)
  );
  const commentsSnapshot = await getDocs(commentsQuery);

  const commentsWithUsers: Array<Comment & { user: User }> = [];

  for (const commentDoc of commentsSnapshot.docs) {
    const commentData = commentDoc.data() as Comment;

    if (!commentData.userId) {
      console.error("Invalid userId in comment:", commentData);
      continue;
    }

    const userDoc = await getDoc(doc(db, "users", commentData.userId));

    if (!userDoc.exists()) {
      console.warn(`User not found for comment ${commentDoc.id}`);
      continue;
    }

    const userData = userDoc.data() as User;

    commentsWithUsers.push({
      ...commentData,
      user: userData,
    });
  }

  commentsWithUsers.sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      return (b.createdAt as Timestamp).seconds - (a.createdAt as Timestamp).seconds;
    }
    return 0;
  });
  return commentsWithUsers.map(comment => ({
    ...comment,
    createdAt: comment.createdAt ? (comment.createdAt as Timestamp).toDate() : undefined,
    updatedAt: comment.updatedAt ? (comment.updatedAt as Timestamp).toDate() : undefined,
  }));
}
