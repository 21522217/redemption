"server-only";

import { db } from "../config";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  orderBy,
} from "firebase/firestore";
import { User } from "@/types/user";

export async function getUserSuggestions(page: number, currentUserId?: string) {
  const usersPerPage = 2;
  const usersRef = collection(db, "users");
  const usersSnap = await getDocs(usersRef);

  let users = usersSnap.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as User)
  );

  // Filter out the current user
  if (currentUserId) {
    users = users.filter((user) => user.id !== currentUserId);
  }

  const startIndex = (page - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;

  return users.slice(startIndex, endIndex);
}

export async function getAllUserSuggestions(
  page: number,
  currentUserId?: string
) {
  try {
    const usersPerPage = 10;
    const usersRef = collection(db, "users");

    // Fetch all users ordered by followers count
    const usersSnap = await getDocs(
      query(usersRef, orderBy("followers", "desc"))
    );

    let users = usersSnap.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as User)
    );

    if (currentUserId) {
      // Filter out the current user
      users = users.filter((user) => user.id !== currentUserId);

      // Fetch the list of users already followed by the current user
      const followsSnap = await getDocs(
        query(
          collection(db, "follows"),
          where("followerId", "==", currentUserId)
        )
      );
      const followedUserIds = new Set(
        followsSnap.docs.map((doc) => doc.data().followingId)
      );

      // Filter out users that are already followed
      users = users.filter((user) => !followedUserIds.has(user.id));
    }

    // Calculate pagination indices
    const startIndex = (page - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;

    // Return the paginated users
    return users.slice(startIndex, endIndex);
  } catch (error) {
    console.error("Error fetching user suggestions:", error);
    throw new Error("Failed to fetch user suggestions");
  }
}

/**
 * Kiểm tra xem user A có follow user B không
 * @param followerId ID của user thực hiện follow
 * @param followingId ID của user được follow
 * @returns true nếu A follow B, false nếu chưa
 */
export async function isFollowing(
  followerId: string,
  followingId: string
): Promise<boolean> {
  const followsRef = collection(db, "follows");
  const q = query(
    followsRef,
    where("followerId", "==", followerId),
    where("followingId", "==", followingId)
  );

  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

/**
 * Tìm kiếm users theo tên với phân trang
 * @param page Số trang hiện tại
 * @param searchTerm Từ khóa tìm kiếm
 * @param currentUserId ID của user hiện tại
 * @returns Danh sách users phù hợp với từ khóa trong trang hiện tại
 */
export async function searchUsers(
  page: number,
  searchTerm: string,
  currentUserId?: string
) {
  const usersPerPage = 10;
  const usersRef = collection(db, "users");
  const usersSnap = await getDocs(usersRef);

  const searchTermLower = searchTerm.toLowerCase();

  const filteredUsers = usersSnap.docs
    .map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as User)
    )
    .filter((user) => {
      // Chỉ lọc currentUser nếu có currentUserId
      if (currentUserId && user.id === currentUserId) return false;

      // Search theo firstName + lastName hoặc username
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const username = user.username.toLowerCase();

      return (
        fullName.includes(searchTermLower) || username.includes(searchTermLower)
      );
    });

  // Tính toán chỉ số bắt đầu và kết thúc cho phân trang
  const startIndex = (page - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;

  // Trả về danh sách users đã phân trang
  return filteredUsers.slice(startIndex, endIndex);
}

export async function getProfileCompletion(userId: string) {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    throw new Error("User not found");
  }

  const userData = userDoc.data() as User;

  const postsRef = collection(db, "posts");
  const postsQuery = query(postsRef, where("userId", "==", userId));
  const postsSnap = await getDocs(postsQuery);
  const hasPost = !postsSnap.empty;

  const followsRef = collection(db, "follows");
  const followsQuery = query(followsRef, where("userId", "==", userId));
  const followsSnap = await getDocs(followsQuery);
  const followingCount = followsSnap.size;

  return {
    hasPost,
    hasBio: Boolean(userData.bio),
    hasAvatar: userData.profilePicture !== "https://github.com/shadcn.png",
    hasEnoughFollowing: followingCount >= 3,
    followingCount: followingCount,
    totalTasks: 4,
    completedTasks: [
      hasPost,
      Boolean(userData.bio),
      userData.profilePicture !== "https://github.com/shadcn.png",
      followingCount >= 10,
    ].filter(Boolean).length,
  };
}
