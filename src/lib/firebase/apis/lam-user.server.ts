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

/**
 * Lấy danh sách user suggestions (tất cả user trừ current user)
 * Sắp xếp theo số lượng người theo dõi nhiều nhất
 * @param currentUserId ID của user hiện tại
 * @returns Danh sách các user được đề xuất
 */
export async function getUserSuggestions(currentUserId?: string) {
  const usersRef = collection(db, "users");
  const q = query(
    usersRef,
    where("id", "!=", currentUserId),
    orderBy("followers", "desc")
  );
  const usersSnap = await getDocs(q);

  const users = usersSnap.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as User)
  );

  return users;
}

export async function getAllUserSuggestions(
  page: number,
  currentUserId?: string
) {
  try {
    const usersPerPage = 10;
    const usersRef = collection(db, "users");
    
    const q = query(
      usersRef,
      orderBy("followers", "desc")
    );
    const usersSnap = await getDocs(q);

    let users = usersSnap.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as User)
    );

    if (currentUserId) {
      users = users.filter(user => user.id !== currentUserId);
    }

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
  // Fetch user information
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    throw new Error("User not found");
  }

  const userData = userDoc.data() as User;

  // Check the number of posts
  const postsRef = collection(db, "posts");
  const postsQuery = query(postsRef, where("userId", "==", userId));
  const postsSnap = await getDocs(postsQuery);
  const hasPost = !postsSnap.empty;

  // Check the number of followers using user.followers
  const followerCount = userData.followers || 0;

  return {
    hasPost,
    hasBio: Boolean(userData.bio),
    hasAvatar: userData.profilePicture !== "https://github.com/shadcn.png",
    hasEnoughFollowing: followerCount >= 10,
    followingCount: followerCount,
    totalTasks: 4,
    completedTasks: [
      hasPost,
      Boolean(userData.bio),
      userData.profilePicture !== "https://github.com/shadcn.png",
      followerCount >= 10,
    ].filter(Boolean).length,
  };
}
