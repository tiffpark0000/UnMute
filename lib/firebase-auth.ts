// Firebase 인증 서비스
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase';

// 사용자 프로필 타입
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  nickname?: string;
  grade?: string;
  gender?: string;
  interests?: string[];
  photoURL?: string;
  role?: 'admin' | 'user'; // 관리자 권한
  blocked?: boolean; // 차단 여부
  blockedAt?: any; // 차단 시간
  createdAt: any;
  lastLoginAt: any;
}

// 관리자 이메일 목록
const ADMIN_EMAILS = [
  's20011656@sjajeju.kr'       // 학교 이메일 (공식 관리자)
];

// 이메일이 관리자인지 확인
const isAdminEmail = (email: string): boolean => {
  return ADMIN_EMAILS.includes(email.toLowerCase());
};

// ==================== Google 로그인 ====================
export const signInWithGoogle = async () => {
  try {
    console.log('🔑 Google 로그인 시작...');
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log('✅ Google 로그인 성공:', user.email);

    // Firestore에 사용자 정보 저장 (처음 로그인인 경우)
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.log('📝 새 사용자 프로필 생성 중...');
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Anonymous',
        photoURL: user.photoURL || '',
        role: isAdminEmail(user.email || '') ? 'admin' : 'user', // 관리자 권한 자동 부여
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      };
      await setDoc(userRef, userProfile);
      console.log(userProfile.role === 'admin' ? '👑 관리자 프로필 생성 완료' : '✅ 사용자 프로필 생성 완료');
    } else {
      // 마지막 로그인 시간 업데이트 + 관리자 권한 확인
      const updateData: any = { 
        lastLoginAt: serverTimestamp() 
      };
      
      // 관리자 이메일인데 role이 없거나 user인 경우 admin으로 업데이트
      if (isAdminEmail(user.email || '')) {
        updateData.role = 'admin';
        console.log('👑 관리자 권한 부여');
      }
      
      await setDoc(userRef, updateData, { merge: true });
      console.log('✅ 로그인 시간 업데이트');
    }

    return user;
  } catch (error: any) {
    console.error('❌ Google 로그인 실패:', error);
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('로그인 창이 닫혔습니다.');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
    }
    throw error;
  }
};

// ==================== 이메일/비밀번호 회원가입 ====================
export const signUpWithEmail = async (
  email: string,
  password: string,
  userData: {
    name: string;
    nickname: string;
    grade: string;
    gender: string;
    interests: string[];
  }
) => {
  try {
    console.log('📝 이메일 회원가입 시작...');
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    // 프로필 업데이트
    await updateProfile(user, {
      displayName: userData.name,
    });

    // Firestore에 사용자 정보 저장
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: userData.name,
      nickname: userData.nickname,
      grade: userData.grade,
      gender: userData.gender,
      interests: userData.interests,
      role: isAdminEmail(user.email || '') ? 'admin' : 'user', // 관리자 권한 자동 부여
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);
    console.log(userProfile.role === 'admin' ? '👑 관리자 회원가입 완료:' : '✅ 회원가입 완료:', user.email);

    return user;
  } catch (error: any) {
    console.error('❌ 회원가입 실패:', error);
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('이미 사용 중인 이메일입니다.');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('비밀번호가 너무 약합니다. 최소 6자 이상 입력하세요.');
    }
    throw error;
  }
};

// ==================== 이메일/비밀번호 로그인 ====================
export const signInWithEmail = async (email: string, password: string) => {
  try {
    console.log('🔑 이메일 로그인 시작...');
    const result = await signInWithEmailAndPassword(auth, email, password);
    
    // 마지막 로그인 시간 업데이트
    await setDoc(doc(db, 'users', result.user.uid), {
      lastLoginAt: serverTimestamp()
    }, { merge: true });
    
    console.log('✅ 로그인 성공:', result.user.email);
    return result.user;
  } catch (error: any) {
    console.error('❌ 로그인 실패:', error);
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
    } else if (error.code === 'auth/invalid-credential') {
      throw new Error('잘못된 로그인 정보입니다.');
    }
    throw error;
  }
};

// ==================== 로그아웃 ====================
export const logOut = async () => {
  try {
    console.log('👋 로그아웃 중...');
    await signOut(auth);
    console.log('✅ 로그아웃 완료');
  } catch (error) {
    console.error('❌ 로그아웃 실패:', error);
    throw error;
  }
};

// ==================== 인증 상태 감지 ====================
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (user) => {
    console.log('👤 인증 상태 변경:', user ? user.email : '로그아웃 상태');
    callback(user);
  });
};

// ==================== 사용자 프로필 가져오기 ====================
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('프로필 가져오기 실패:', error);
    return null;
  }
};

// ==================== 사용자 프로필 업데이트 ====================
export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, data, { merge: true });
    console.log('✅ 프로필 업데이트 완료');
  } catch (error) {
    console.error('❌ 프로필 업데이트 실패:', error);
    throw error;
  }
};

