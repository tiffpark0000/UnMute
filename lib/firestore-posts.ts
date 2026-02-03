// Firestore 게시글 관리
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { notifyNewPost } from './firestore-notifications';

// 게시글 타입
export interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  authorId: string;
  authorName: string;
  isAnonymous: boolean;
  isPrivate: boolean;
  isContentHidden?: boolean; // Private 글의 내용이 숨겨진 경우
  boardType: 'anonymous' | 'free';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  viewCount: number;
  commentCount: number;
}

// ==================== 게시글 작성 ====================
export const createPost = async (postData: {
  title: string;
  content: string;
  category: string;
  authorId: string;
  authorName: string;
  isAnonymous: boolean;
  isPrivate: boolean;
  boardType: 'anonymous' | 'free';
}): Promise<string> => {
  try {
    console.log('📝 게시글 작성 중...', postData);
    
    const post = {
      ...postData,
      authorName: postData.isAnonymous ? 'Anonymous' : postData.authorName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      viewCount: 0,
      commentCount: 0,
    };

    const docRef = await addDoc(collection(db, 'posts'), post);
    console.log('✅ 게시글 작성 완료:', docRef.id);
    
    // 관리자에게 알림 전송
    try {
      await notifyNewPost(
        docRef.id,
        postData.boardType,
        postData.isAnonymous ? 'Anonymous User' : postData.authorName,
        postData.title
      );
    } catch (error) {
      console.error('알림 전송 실패:', error);
      // 알림 실패해도 게시글 작성은 성공으로 처리
    }
    
    return docRef.id;
  } catch (error) {
    console.error('❌ 게시글 작성 실패:', error);
    throw error;
  }
};

// ==================== 게시글 목록 가져오기 ====================
export const getPosts = async (
  boardType: 'anonymous' | 'free',
  userId?: string,
  isAdmin: boolean = false
): Promise<Post[]> => {
  try {
    console.log(`📋 ${boardType} 게시판 불러오는 중... (관리자: ${isAdmin})`);
    
    const postsRef = collection(db, 'posts');
    let q;

    // 모든 사용자가 모든 게시글을 볼 수 있음 (Private 여부는 나중에 필터링)
    q = query(
      postsRef,
      where('boardType', '==', boardType),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const posts: Post[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Private 글인 경우
      if (data.isPrivate) {
        // 관리자거나 작성자인 경우에만 전체 내용 제공
        if (isAdmin || data.authorId === userId) {
          posts.push({
            id: doc.id,
            ...data,
          } as Post);
        } else {
          // 일반 사용자는 제목만 보이고 내용은 숨김
          posts.push({
            id: doc.id,
            ...data,
            content: '🔒 This is a private post. Only the author and admin can view the content.',
            isContentHidden: true, // 추가 플래그
          } as Post);
        }
      } else {
        // Public 글은 모두에게 공개
        posts.push({
          id: doc.id,
          ...data,
        } as Post);
      }
    });

    console.log(`✅ ${posts.length}개의 게시글을 불러왔습니다.`);
    return posts;
  } catch (error) {
    console.error('❌ 게시글 불러오기 실패:', error);
    throw error;
  }
};

// ==================== 게시글 수정 ====================
export const updatePost = async (
  postId: string,
  updates: {
    title?: string;
    content?: string;
    category?: string;
  }
): Promise<void> => {
  try {
    console.log('✏️ 게시글 수정 중...', postId);
    
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    console.log('✅ 게시글 수정 완료');
  } catch (error) {
    console.error('❌ 게시글 수정 실패:', error);
    throw error;
  }
};

// ==================== 게시글 삭제 ====================
export const deletePost = async (postId: string): Promise<void> => {
  try {
    console.log('🗑️ 게시글 삭제 중...', postId);
    
    const postRef = doc(db, 'posts', postId);
    await deleteDoc(postRef);

    console.log('✅ 게시글 삭제 완료');
  } catch (error) {
    console.error('❌ 게시글 삭제 실패:', error);
    throw error;
  }
};

// ==================== 게시글 조회수 증가 ====================
export const incrementViewCount = async (postId: string): Promise<void> => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);
    
    if (postSnap.exists()) {
      const currentViews = postSnap.data().viewCount || 0;
      await updateDoc(postRef, {
        viewCount: currentViews + 1,
      });
    }
  } catch (error) {
    console.error('❌ 조회수 증가 실패:', error);
  }
};

// ==================== 단일 게시글 가져오기 ====================
export const getPost = async (postId: string): Promise<Post | null> => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);
    
    if (postSnap.exists()) {
      return {
        id: postSnap.id,
        ...postSnap.data(),
      } as Post;
    }
    
    return null;
  } catch (error) {
    console.error('❌ 게시글 가져오기 실패:', error);
    return null;
  }
};

