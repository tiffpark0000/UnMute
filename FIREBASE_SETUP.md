# 🔥 Firebase 설정 완료!

## ✅ 현재 설정 상태

### Firebase 프로젝트 정보
- **프로젝트 이름**: capstone-project-6cd46
- **프로젝트 ID**: capstone-project-6cd46
- **Firebase Console**: https://console.firebase.google.com/project/capstone-project-6cd46

---

## 🎯 설정된 기능

### ✅ 1. Firebase Authentication (인증)
- **Google 로그인**: 활성화됨 ✓
- **이메일/비밀번호**: 활성화 가능

### ✅ 2. Firestore Database
- **컬렉션**: 
  - `users` - 사용자 프로필 저장
  - `anonymous_posts` - 익명게시판 (예정)
  - `free_posts` - 자유게시판 (예정)

### ✅ 3. 환경 변수 (.env.local)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCiPOtHH08XRMK6SFfhxV06oMAEDAXRteI
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=capstone-project-6cd46.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=capstone-project-6cd46
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=capstone-project-6cd46.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=521221469536
NEXT_PUBLIC_FIREBASE_APP_ID=1:521221469536:web:0438d6af9779d208a95a05
```

---

## 🚀 빠른 링크

### Firebase Console 바로가기
```
https://console.firebase.google.com/project/capstone-project-6cd46/overview
```

### Authentication 설정
```
https://console.firebase.google.com/project/capstone-project-6cd46/authentication/users
```

### Firestore Database
```
https://console.firebase.google.com/project/capstone-project-6cd46/firestore/data
```

---

## 📝 사용 방법

### Google 로그인 테스트
1. http://localhost:3000 접속
2. 로그인 모달에서 **"Continue with Google"** 클릭
3. Gmail 계정 선택
4. 권한 허용
5. 자동 로그인 완료!

### Firestore에서 사용자 확인
1. Firebase Console > Firestore Database
2. `users` 컬렉션 클릭
3. 로그인한 사용자 문서 확인

---

## 🔧 추가 설정 (선택사항)

### 이메일/비밀번호 인증 활성화
1. Firebase Console > Authentication
2. Sign-in method 탭
3. **"이메일/비밀번호"** 클릭
4. 사용 설정 토글 켬
5. 저장

### 승인된 도메인 추가 (배포 시)
1. Firebase Console > Authentication > Settings
2. **Authorized domains** 탭
3. 도메인 추가 (예: yourdomain.com)

---

## 📚 코드 위치

### Firebase 설정 파일
- `lib/firebase.ts` - Firebase 초기화
- `lib/firebase-auth.ts` - 인증 함수들

### 컴포넌트
- `components/auth-modal.tsx` - 로그인/회원가입 모달
- `components/header.tsx` - 사용자 상태 표시
- `app/page.tsx` - 홈 페이지

---

## ⚠️ 보안 규칙

### 현재 Firestore 규칙
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자만 읽기/쓰기 가능
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 게시글 - 로그인한 사용자만 접근
    match /{collection}/{document=**} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        request.auth.uid == resource.data.authorId;
    }
  }
}
```

---

## 🆘 문제 해결

### "auth/popup-blocked" 오류
- 브라우저 팝업 차단 해제
- 다른 브라우저로 시도

### "Module not found: firebase" 오류
```bash
npm install firebase@11.1.0 --legacy-peer-deps
```

### 환경 변수가 로드 안 됨
1. `.env.local` 파일이 프로젝트 루트에 있는지 확인
2. 서버 재시작: `npm run dev`

---

**마지막 업데이트**: 2026년 1월 7일  
**프로젝트**: UnMute - Student Support Platform  
**Firebase 버전**: 11.1.0





