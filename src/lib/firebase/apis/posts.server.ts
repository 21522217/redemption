"server only";

import { Post } from "@/types/post";
import { User } from "@/types/user";

import { db } from "../config";
import { collection, getDocs, doc, getDoc, addDoc } from "firebase/firestore";

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
