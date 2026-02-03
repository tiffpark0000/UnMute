// Firestore 알림 관리
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  limit
} from 'firebase/firestore';
import { db } from './firebase';

// 알림 타입
export interface Notification {
  id: string;
  type: 'new_post' | 'new_user' | 'report' | 'system';
  title: string;
  message: string;
  postId?: string;
  userId?: string;
  boardType?: 'anonymous' | 'free';
  read: boolean;
  createdAt: Timestamp;
}

// ==================== 알림 생성 ====================
export const createNotification = async (notificationData: Omit<Notification, 'id' | 'createdAt' | 'read'>): Promise<string> => {
  try {
    const notification = {
      ...notificationData,
      read: false,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'notifications'), notification);
    console.log('✅ 알림 생성 완료:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ 알림 생성 실패:', error);
    throw error;
  }
};

// ==================== 알림 목록 가져오기 ====================
export const getNotifications = async (limitCount: number = 50): Promise<Notification[]> => {
  try {
    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const notifications: Notification[] = [];
    
    querySnapshot.forEach((doc) => {
      notifications.push({
        id: doc.id,
        ...doc.data(),
      } as Notification);
    });

    return notifications;
  } catch (error) {
    console.error('❌ 알림 불러오기 실패:', error);
    throw error;
  }
};

// ==================== 읽지 않은 알림 수 ====================
export const getUnreadNotificationCount = async (): Promise<number> => {
  try {
    const notificationsRef = collection(db, 'notifications');
    const q = query(notificationsRef, where('read', '==', false));
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('❌ 읽지 않은 알림 수 확인 실패:', error);
    return 0;
  }
};

// ==================== 알림 읽음 처리 ====================
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, { read: true });
    console.log('✅ 알림 읽음 처리 완료');
  } catch (error) {
    console.error('❌ 알림 읽음 처리 실패:', error);
    throw error;
  }
};

// ==================== 모든 알림 읽음 처리 ====================
export const markAllNotificationsAsRead = async (): Promise<void> => {
  try {
    const notificationsRef = collection(db, 'notifications');
    const q = query(notificationsRef, where('read', '==', false));
    const querySnapshot = await getDocs(q);
    
    const updatePromises = querySnapshot.docs.map((doc) => 
      updateDoc(doc.ref, { read: true })
    );
    
    await Promise.all(updatePromises);
    console.log('✅ 모든 알림 읽음 처리 완료');
  } catch (error) {
    console.error('❌ 모든 알림 읽음 처리 실패:', error);
    throw error;
  }
};

// ==================== 게시글 작성 알림 생성 ====================
export const notifyNewPost = async (
  postId: string,
  boardType: 'anonymous' | 'free',
  authorName: string,
  title: string
): Promise<void> => {
  try {
    await createNotification({
      type: 'new_post',
      title: 'New Post',
      message: `${authorName} posted "${title}" on ${boardType === 'anonymous' ? 'Anonymous' : 'Free'} Board`,
      postId,
      boardType,
    });
  } catch (error) {
    console.error('❌ 게시글 알림 생성 실패:', error);
  }
};




