// Firestore 사용자 관리 (관리자용)
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  getDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { UserProfile } from './firebase-auth';

// ==================== 모든 사용자 목록 가져오기 (관리자용) ====================
export const getAllUsers = async (): Promise<UserProfile[]> => {
  try {
    console.log('👥 모든 사용자 불러오는 중...');
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const users: UserProfile[] = [];
    querySnapshot.forEach((doc) => {
      users.push({
        uid: doc.id,
        ...doc.data(),
      } as UserProfile);
    });

    console.log(`✅ ${users.length}명의 사용자를 불러왔습니다.`);
    return users;
  } catch (error) {
    console.error('❌ 사용자 목록 불러오기 실패:', error);
    throw error;
  }
};

// ==================== 사용자 차단/차단 해제 ====================
export const blockUser = async (uid: string, blocked: boolean): Promise<void> => {
  try {
    console.log(`${blocked ? '🚫' : '✅'} 사용자 ${blocked ? '차단' : '차단 해제'} 중...`, uid);
    
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      blocked,
      blockedAt: blocked ? new Date() : null,
    });

    console.log(`✅ 사용자 ${blocked ? '차단' : '차단 해제'} 완료`);
  } catch (error) {
    console.error(`❌ 사용자 ${blocked ? '차단' : '차단 해제'} 실패:`, error);
    throw error;
  }
};

// ==================== 사용자 계정 삭제 ====================
export const deleteUserAccount = async (uid: string): Promise<void> => {
  try {
    console.log('🗑️ 사용자 계정 삭제 중...', uid);
    
    // 1. 사용자의 모든 게시글 삭제
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, where('authorId', '==', uid));
    const postsSnapshot = await getDocs(q);
    
    const deletePromises = postsSnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    console.log(`✅ 사용자의 게시글 ${postsSnapshot.size}개 삭제 완료`);
    
    // 2. 사용자 프로필 삭제
    const userRef = doc(db, 'users', uid);
    await deleteDoc(userRef);
    
    console.log('✅ 사용자 계정 삭제 완료');
  } catch (error) {
    console.error('❌ 사용자 계정 삭제 실패:', error);
    throw error;
  }
};

// ==================== 사용자 차단 상태 확인 ====================
export const isUserBlocked = async (uid: string): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      return userData.blocked === true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ 사용자 차단 상태 확인 실패:', error);
    return false;
  }
};

// ==================== 사용자 게시글 통계 ====================
export const getUserPostsCount = async (uid: string): Promise<number> => {
  try {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, where('authorId', '==', uid));
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error('❌ 게시글 수 확인 실패:', error);
    return 0;
  }
};




