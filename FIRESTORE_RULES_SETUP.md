# 🔥 Firestore Security Rules Setup

## ⚠️ 문제: "Failed to save post" 오류

게시글을 작성할 때 이 오류가 발생하는 이유는 **Firestore 보안 규칙**이 설정되지 않았거나, 쓰기 권한이 없기 때문입니다.

---

## 📋 **해결 방법: Firebase Console에서 보안 규칙 설정**

### 1️⃣ **Firebase Console 접속**
1. https://console.firebase.google.com/ 접속
2. 프로젝트 선택: **capstone-project-6cd46**

### 2️⃣ **Firestore Database로 이동**
1. 왼쪽 메뉴에서 **"Firestore Database"** 클릭
2. 상단 탭에서 **"규칙(Rules)"** 클릭

### 3️⃣ **보안 규칙 복사 & 붙여넣기**

현재 보안 규칙을 **삭제**하고, 아래 규칙을 **복사해서 붙여넣으세요**:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // 사용자 프로필 - 자신의 프로필만 읽기/쓰기 가능, 관리자는 모든 프로필 읽기 가능
    match /users/{userId} {
      allow read: if request.auth != null && 
                     (request.auth.uid == userId || 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 게시글 (posts) - 로그인한 사용자만 작성 가능
    match /posts/{postId} {
      // 읽기 권한
      allow read: if request.auth != null && (
        // 관리자는 모든 글 읽기 가능
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' ||
        // Public 글은 누구나 읽기 가능
        resource.data.isPrivate == false ||
        // Private 글은 작성자만 읽기 가능
        resource.data.authorId == request.auth.uid
      );
      
      // 쓰기 권한 (생성)
      allow create: if request.auth != null && 
                       request.resource.data.authorId == request.auth.uid &&
                       // 차단되지 않은 사용자만 작성 가능
                       (!exists(/databases/$(database)/documents/users/$(request.auth.uid)) ||
                        !get(/databases/$(database)/documents/users/$(request.auth.uid)).data.blocked);
      
      // 업데이트 권한 (수정)
      allow update: if request.auth != null && 
                       resource.data.authorId == request.auth.uid;
      
      // 삭제 권한
      allow delete: if request.auth != null && (
        // 작성자 본인
        resource.data.authorId == request.auth.uid ||
        // 관리자
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
      );
    }
    
    // 시간표 (timetable) - 본인 것만 읽기/쓰기 가능
    match /timetable/{eventId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && 
                               resource.data.userId == request.auth.uid;
    }
    
    // To-do 리스트 (todos) - 본인 것만 읽기/쓰기 가능
    match /todos/{todoId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && 
                               resource.data.userId == request.auth.uid;
    }
  }
}
```

### 4️⃣ **게시 버튼 클릭**
1. 우측 상단의 **"게시(Publish)"** 버튼 클릭
2. 확인 메시지가 나오면 **"확인"** 클릭

---

## ✅ **확인 방법**

### 1. 웹사이트에서 테스트
1. **http://localhost:3000** 접속
2. 로그인
3. 익명 게시판으로 이동
4. "Write a Post" 버튼 클릭
5. 글 작성 후 제출
6. ✅ "Post created successfully!" 메시지가 나타나야 함

### 2. Firebase Console에서 확인
1. Firebase Console → Firestore Database → **"데이터(Data)"** 탭
2. `posts` 컬렉션에 새로운 문서가 추가되었는지 확인

---

## 🔍 **문제가 계속되면?**

### 브라우저 콘솔 확인
1. **F12** 또는 **Cmd + Option + I** (Mac) 눌러서 개발자 도구 열기
2. **Console** 탭 확인
3. 빨간색 오류 메시지 확인
4. 오류 메시지를 알려주세요!

### 자주 발생하는 오류:

#### 1. `@firebase/firestore: Firestore (10.x.x): PERMISSION_DENIED`
→ **해결**: 위의 보안 규칙을 정확히 복사해서 붙여넣으세요

#### 2. `Firebase: Error (auth/network-request-failed)`
→ **해결**: 인터넷 연결 확인

#### 3. `undefined is not an object (evaluating 'auth.currentUser.uid')`
→ **해결**: 로그아웃 후 다시 로그인

---

## 📌 **중요!**

보안 규칙을 설정하면:
- ✅ 로그인한 사용자만 게시글 작성 가능
- ✅ 차단된 사용자는 글 작성 불가
- ✅ 관리자는 모든 글 조회/삭제 가능
- ✅ Private 글은 작성자와 관리자만 볼 수 있음
- ✅ 사용자는 자신의 글만 수정 가능

---

**이 규칙을 설정하면 바로 작동합니다!** 🎉




