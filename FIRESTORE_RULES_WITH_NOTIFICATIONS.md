# 🔥 Updated Firestore Security Rules

## 📋 **완전한 보안 규칙 (알림 포함)**

Firebase Console → Firestore Database → 규칙(Rules)에 이 규칙을 복사하세요:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Posts collection
    match /posts/{postId} {
      allow read: if request.auth != null;
      
      allow create: if request.auth != null && 
                       request.resource.data.authorId == request.auth.uid;
      
      allow update: if request.auth != null && 
                       resource.data.authorId == request.auth.uid;
      
      allow delete: if request.auth != null && (
        resource.data.authorId == request.auth.uid ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
      );
    }
    
    // Notifications collection (관리자만 읽기 가능)
    match /notifications/{notificationId} {
      allow read: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow write: if request.auth != null; // 시스템이 알림 생성 가능
    }
    
    // Timetable collection
    match /timetable/{eventId} {
      allow read, write: if request.auth != null && 
                            request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && 
                               resource.data.userId == request.auth.uid;
    }
    
    // Todos collection
    match /todos/{todoId} {
      allow read, write: if request.auth != null && 
                            request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && 
                               resource.data.userId == request.auth.uid;
    }
  }
}
```

## ✅ **업데이트 후 색인 추가**

알림 기능을 위한 색인도 필요합니다. 브라우저 콘솔에 오류가 나타나면 링크를 클릭하여 색인을 생성하세요!

또는 수동으로:
- Collection ID: `notifications`
- Fields:
  - `read` - Ascending
  - `createdAt` - Descending

---

## 🎉 **완료되는 기능:**

1. ✅ 게시글 작성 시 관리자에게 자동 알림
2. ✅ Admin Dashboard에 실시간 알림 표시
3. ✅ 알림 읽음/안 읽음 상태 관리
4. ✅ "Mark All as Read" 버튼
5. ✅ 관리 메뉴 버튼 클릭 → 해당 탭으로 이동
6. ✅ 실시간 통계 업데이트
7. ✅ 차단된 사용자는 글 작성 불가

**이 규칙을 적용하세요!** 🚀




