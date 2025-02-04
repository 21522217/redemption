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
) {
  const timestamp = Timestamp.now();
  const commentWithTimestamps = {
    ...comment,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const commentRef = await addDoc(
    collection(db, "comments"),
    commentWithTimestamps
  );
  const commentId = commentRef.id;

  await updateDoc(doc(db, "comments", commentId), { id: commentId });

  return commentId;
}

export async function getPostComments(postId: string) {
  const commentsRef = collection(db, "comments");
  const commentsQuery = query(commentsRef, where("postId", "==", postId));
  const commentsSnapshot = await getDocs(commentsQuery);
  return commentsSnapshot.docs.map((doc) => doc.data());
}
