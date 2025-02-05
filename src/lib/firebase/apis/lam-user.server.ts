"server-only";

import { db } from "../config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { User } from "@/types/user";

/**
 * Lấy danh sách user suggestions (tất cả user trừ current user)
 * @param currentUserId ID của user hiện tại
 * @returns Danh sách các user được đề xuất
 */
export async function getUserSuggestions(currentUserId: string) {
  const usersRef = collection(db, "users");
  const usersSnap = await getDocs(usersRef);

  const users = usersSnap.docs
    .map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as User)
    )
    .filter((user) => user.id !== currentUserId); // Lọc bỏ current user

  return users;
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
 * Tìm kiếm users theo tên
 * @param searchTerm Từ khóa tìm kiếm
 * @param currentUserId ID của user hiện tại
 * @returns Danh sách users phù hợp với từ khóa
 */
export async function searchUsers(searchTerm: string, currentUserId: string) {
  const usersRef = collection(db, "users");
  const usersSnap = await getDocs(usersRef);

  const searchTermLower = searchTerm.toLowerCase();

  const users = usersSnap.docs
    .map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as User)
    )
    .filter((user) => {
      // Bỏ qua current user
      if (user.id === currentUserId) return false;

      // Search theo firstName + lastName hoặc username
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const username = user.username.toLowerCase();

      return (
        fullName.includes(searchTermLower) || username.includes(searchTermLower)
      );
    });

  return users;
}
