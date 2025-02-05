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
} from "firebase/firestore";
import { Comment } from "@/types/comment";

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

  try {
    const commentsQuery = query(
      collection(db, "comments"),
      where("postId", "==", postId)
    );
    const commentsSnapshot = await getDocs(commentsQuery);

    return commentsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        postId: data.postId,
        content: data.content,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new Error("Failed to fetch comments");
  }
}
