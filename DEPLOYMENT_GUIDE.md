# 🚀 UnMute 웹사이트 배포 가이드

이 가이드는 UnMute 웹사이트를 Vercel을 통해 배포하고, 학생들이 접속할 수 있도록 설정하는 방법을 설명합니다.

---

## 📋 목차

1. [배포 전 준비사항](#1-배포-전-준비사항)
2. [방법 1: Vercel 웹사이트에서 배포 (추천)](#2-방법-1-vercel-웹사이트에서-배포-추천)
3. [방법 2: 터미널에서 배포](#3-방법-2-터미널에서-배포)
4. [환경 변수 설정](#4-환경-변수-설정)
5. [커스텀 도메인 연결 (선택사항)](#5-커스텀-도메인-연결-선택사항)
6. [문제 해결](#6-문제-해결)

---

## 1. 배포 전 준비사항

### ✅ 필요한 것들

- [x] Vercel 계정 (무료)
- [x] Firebase 프로젝트 (이미 설정됨)
- [x] 프로젝트 코드 (UnMute 폴더)
- [ ] GitHub 계정 (방법 1 사용 시 필요)

### 🔥 Firebase 설정 확인

배포하기 전에 Firebase Console에서 다음을 확인하세요:

1. **Firebase Console**: https://console.firebase.google.com
2. **프로젝트 선택**: `capstone-project-6cd46`
3. **Authentication** → **Sign-in method** → **Google** 활성화 확인
4. **Firestore Database** → **Rules** 확인:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자 프로필 (읽기는 모두, 쓰기는 본인만)
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 게시글 (읽기는 모두, 쓰기는 인증된 사용자)
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (resource.data.authorId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // 시간표 (본인 것만 읽기/쓰기)
    match /timetable/{eventId} {
      allow read: if true;
      allow write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // 할 일 (본인 것만 읽기/쓰기)
    match /todos/{todoId} {
      allow read: if true;
      allow write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // 알림 (관리자만 읽기)
    match /notifications/{notificationId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow create: if request.auth != null;
    }
  }
}
```

5. **승인된 도메인 추가** (배포 후):
   - Authentication → Settings → Authorized domains
   - Vercel에서 받은 도메인 추가 (예: `unmute.vercel.app`)

---

## 2. 방법 1: Vercel 웹사이트에서 배포 (추천)

이 방법이 가장 쉽고 빠릅니다! ⭐️

### 📝 단계 1: GitHub에 코드 업로드

#### 1-1. GitHub 계정 만들기 (없는 경우)
- https://github.com/signup
- 이메일 주소 입력 → 인증

#### 1-2. 새 저장소 만들기
1. GitHub에 로그인
2. 오른쪽 상단 **"+"** → **"New repository"**
3. 저장소 이름: `UnMute`
4. **Private** 선택 (학생들만 접속하도록)
5. **Create repository** 클릭

#### 1-3. 코드 업로드
터미널을 열고:

```bash
# UnMute 폴더로 이동
cd "/Users/tiffany_mac_pro/Desktop/Capstone project/UnMute"

# Git 초기화 (이미 되어있을 수 있음)
git init

# 모든 파일 추가
git add .

# 첫 커밋
git commit -m "Initial commit: UnMute website"

# GitHub 저장소 연결 (GitHub에서 복사한 URL 사용)
git remote add origin https://github.com/YOUR_USERNAME/UnMute.git

# GitHub에 업로드
git branch -M main
git push -u origin main
```

> **참고**: `YOUR_USERNAME`을 본인의 GitHub 사용자 이름으로 바꾸세요!

---

### 📝 단계 2: Vercel 계정 만들기

1. **Vercel 웹사이트 접속**: https://vercel.com/signup
2. **"Continue with GitHub"** 클릭
3. GitHub 계정으로 로그인
4. Vercel이 GitHub 접근 권한 요청 → **승인**

---

### 📝 단계 3: 프로젝트 배포

1. Vercel 대시보드에서 **"Add New..."** → **"Project"**
2. **"Import Git Repository"** 섹션에서 `UnMute` 저장소 선택
3. **"Import"** 클릭
4. 프로젝트 설정:
   - **Project Name**: `unmute` (또는 원하는 이름)
   - **Framework Preset**: `Next.js` (자동 감지됨)
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `npm run build` (기본값)
   - **Output Directory**: `.next` (기본값)

5. **"Deploy"** 클릭!

⏳ **배포 진행 중...** (약 2-3분 소요)

✅ **배포 완료!** 

축하합니다! 🎉 URL이 생성되었습니다:
- 예: `https://unmute.vercel.app`
- 또는: `https://unmute-xxxx.vercel.app`

---

### 📝 단계 4: 환경 변수 설정

**중요!** Firebase가 작동하려면 환경 변수를 추가해야 합니다.

1. Vercel 프로젝트 페이지에서 **"Settings"** 클릭
2. 왼쪽 메뉴에서 **"Environment Variables"** 클릭
3. 다음 환경 변수들을 **하나씩** 추가:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyCiPOtHH08XRMK6SFfhxV06oMAEDAXRteI` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `capstone-project-6cd46.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `capstone-project-6cd46` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `capstone-project-6cd46.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `521221469536` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:521221469536:web:0438d6af9779d208a95a05` |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | `G-GB7XW92DYN` |

4. 각 변수 추가 후 **"Save"** 클릭
5. 모든 환경 변수 추가 완료 후:
   - **"Deployments"** 탭으로 이동
   - 가장 최근 배포의 **"..."** 메뉴 → **"Redeploy"**
   - **"Redeploy"** 버튼 클릭

⏳ **재배포 중...** (약 1-2분 소요)

✅ **완료!** 이제 Firebase가 정상 작동합니다!

---

### 📝 단계 5: Firebase에 도메인 추가

1. **Firebase Console**: https://console.firebase.google.com
2. **프로젝트 선택**: `capstone-project-6cd46`
3. **Authentication** → **Settings** → **Authorized domains**
4. **"Add domain"** 클릭
5. Vercel에서 받은 도메인 입력:
   - 예: `unmute.vercel.app`
6. **"Add"** 클릭

✅ **완료!** 이제 학생들이 접속할 수 있습니다!

---

## 3. 방법 2: 터미널에서 배포

GitHub 없이 바로 배포하는 방법입니다.

### 📝 단계 1: Vercel CLI 로그인

터미널을 열고:

```bash
# UnMute 폴더로 이동
cd "/Users/tiffany_mac_pro/Desktop/Capstone project/UnMute"

# Vercel 로그인
npx vercel login
```

이메일 주소 입력 → 받은 이메일에서 인증 링크 클릭

---

### 📝 단계 2: 배포

```bash
npx vercel --prod
```

다음 질문들에 답변:
- **Set up and deploy?** → `Y` (엔터)
- **Which scope?** → 엔터 (기본값)
- **Link to existing project?** → `N` (새 프로젝트)
- **What's your project's name?** → `unmute` 입력
- **In which directory is your code located?** → 엔터 (기본값)
- **Want to override the settings?** → `N` (엔터)

⏳ **배포 중...** (약 2-3분 소요)

✅ **배포 완료!** URL이 출력됩니다!

---

### 📝 단계 3: 환경 변수 설정

Vercel 웹사이트에서 환경 변수를 추가해야 합니다:

1. https://vercel.com/dashboard
2. 프로젝트 선택 (`unmute`)
3. **Settings** → **Environment Variables**
4. [위의 환경 변수 표](#단계-4-환경-변수-설정) 참고하여 추가
5. **Deployments** → 최근 배포 → **Redeploy**

---

## 4. 환경 변수 설정

환경 변수는 Firebase 설정 정보를 안전하게 보관하는 방법입니다.

### 🔐 필수 환경 변수

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCiPOtHH08XRMK6SFfhxV06oMAEDAXRteI
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=capstone-project-6cd46.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=capstone-project-6cd46
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=capstone-project-6cd46.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=521221469536
NEXT_PUBLIC_FIREBASE_APP_ID=1:521221469536:web:0438d6af9779d208a95a05
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-GB7XW92DYN
```

### 📝 Vercel에서 환경 변수 추가 방법

1. Vercel 대시보드 → 프로젝트 선택
2. **Settings** → **Environment Variables**
3. **Name**: 환경 변수 이름 입력
4. **Value**: 값 입력
5. **Environment**: `Production`, `Preview`, `Development` 모두 체크
6. **Save** 클릭
7. 모든 변수 추가 후 → **Deployments** → **Redeploy**

---

## 5. 커스텀 도메인 연결 (선택사항)

`www.unmute.com` 같은 커스텀 도메인을 원하시나요?

### 📝 단계 1: 도메인 구매

추천 도메인 등록업체:

1. **Cloudflare** (가장 저렴 + 추천)
   - https://www.cloudflare.com/products/registrar/
   - 약 $9.77/년
   - DNS 관리 무료

2. **GoDaddy** (유명)
   - https://www.godaddy.com
   - 약 $11.99/년

3. **Namecheap**
   - https://www.namecheap.com
   - 약 $12.98/년

4. **가비아** (한국 서비스)
   - https://www.gabia.com
   - 약 ₩15,000/년

### 📝 단계 2: Vercel에 도메인 추가

1. Vercel 대시보드 → 프로젝트 선택
2. **Settings** → **Domains**
3. 도메인 입력:
   - `unmute.com` (또는 구매한 도메인)
4. **Add** 클릭
5. DNS 설정 안내가 나타남 (복사해두기)

### 📝 단계 3: DNS 설정

도메인 등록업체 사이트에서:

1. DNS 관리 페이지로 이동
2. 다음 레코드 추가:

**A 레코드:**
```
Type: A
Name: @ (또는 비워두기)
Value: 76.76.21.21
TTL: 자동 (또는 3600)
```

**CNAME 레코드:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 자동 (또는 3600)
```

3. **저장** 클릭

⏳ **DNS 전파 대기...** (최대 24-48시간, 보통 1-2시간)

✅ **완료!** 이제 `www.unmute.com`으로 접속 가능합니다!

### 📝 단계 4: Firebase에 새 도메인 추가

1. Firebase Console → Authentication → Settings
2. **Authorized domains**에 커스텀 도메인 추가:
   - `unmute.com`
   - `www.unmute.com`

---

## 6. 문제 해결

### ❓ "Missing or insufficient permissions" 오류

**원인**: Firestore 보안 규칙 문제

**해결**:
1. Firebase Console → Firestore Database → Rules
2. 위의 [Firebase 설정 확인](#firebase-설정-확인) 섹션의 규칙으로 업데이트
3. **게시** 클릭

---

### ❓ "Firebase not initialized" 오류

**원인**: 환경 변수가 설정되지 않음

**해결**:
1. Vercel → Settings → Environment Variables
2. 모든 `NEXT_PUBLIC_FIREBASE_*` 변수 확인
3. 누락된 변수 추가
4. **Redeploy** 실행

---

### ❓ "The query requires an index" 오류

**원인**: Firestore 복합 인덱스 필요

**해결**:
1. 오류 메시지의 링크 클릭 (자동으로 인덱스 생성 페이지로 이동)
2. 또는 Firebase Console → Firestore Database → Indexes
3. **Add Index** 클릭:
   - Collection ID: `posts`
   - Fields:
     - `boardType` (Ascending)
     - `createdAt` (Descending)
4. **Create** 클릭
5. ⏳ 인덱스 생성 대기 (1-5분)

---

### ❓ Google 로그인이 작동하지 않음

**원인**: Firebase 승인된 도메인에 Vercel URL이 없음

**해결**:
1. Firebase Console → Authentication → Settings
2. **Authorized domains** 탭
3. Vercel 도메인 추가:
   - `unmute.vercel.app` (또는 본인의 Vercel URL)
4. **Add** 클릭

---

### ❓ 코드를 수정했는데 웹사이트에 반영이 안 됨

**원인**: GitHub에 푸시하지 않았거나, Vercel이 자동 배포하지 않음

**해결**:

#### 방법 1 (자동 배포):
```bash
cd "/Users/tiffany_mac_pro/Desktop/Capstone project/UnMute"
git add .
git commit -m "Update: 변경 내용 설명"
git push origin main
```
→ Vercel이 자동으로 배포합니다!

#### 방법 2 (수동 배포):
1. Vercel 대시보드 → Deployments
2. 최근 배포의 **"..."** → **"Redeploy"**

---

### ❓ 배포는 성공했는데 페이지가 흰 화면만 나옴

**원인**: 빌드 오류 또는 환경 변수 문제

**해결**:
1. Vercel → Deployments → 최근 배포 클릭
2. **"Build Logs"** 확인 → 오류 찾기
3. **"Function Logs"** 확인 → 런타임 오류 찾기
4. 브라우저 콘솔 확인 (F12 → Console 탭)

---

## 📊 배포 후 체크리스트

배포 완료 후 다음 항목들을 확인하세요:

- [ ] 웹사이트가 정상적으로 로드됨
- [ ] Google 로그인이 작동함
- [ ] 관리자 계정(`s20011656@sjajeju.kr`)으로 로그인 시 "Admin" 버튼이 보임
- [ ] 익명 게시판에서 글 작성 및 조회 가능
- [ ] 자유 게시판에서 글 작성 및 조회 가능
- [ ] Academic Hub에서 시간표 및 할 일 추가 가능
- [ ] 홈 화면의 통계가 실제 데이터로 표시됨
- [ ] 관리자 페이지에서 사용자 및 게시글 관리 가능

---

## 🎓 학생들에게 공유하기

배포가 완료되면 학생들에게 다음과 같이 안내하세요:

```
📢 UnMute 웹사이트 오픈!

UnMute 플랫폼에 오신 것을 환영합니다!

🌐 접속 링크: https://unmute.vercel.app
(또는 커스텀 도메인: www.unmute.com)

✅ 사용 방법:
1. Google 계정으로 로그인 (학교 이메일 또는 개인 Gmail)
2. 익명 게시판: 고민이나 어려움을 익명으로 공유
3. 자유 게시판: 자유로운 주제로 소통
4. Academic Hub: 시간표 및 할 일 관리

💡 문의사항이 있으면 관리자에게 연락주세요!
```

---

## 📞 도움이 필요하신가요?

### 유용한 링크

- **Vercel 문서**: https://vercel.com/docs
- **Next.js 문서**: https://nextjs.org/docs
- **Firebase 문서**: https://firebase.google.com/docs
- **Vercel 대시보드**: https://vercel.com/dashboard
- **Firebase Console**: https://console.firebase.google.com

### 관리자 정보

- **관리자 이메일**: s20011656@sjajeju.kr
- **관리자 기능**: 
  - 모든 게시글 관리 (비공개 게시글 포함)
  - 사용자 차단/삭제
  - 게시글 강제 삭제
  - 실시간 알림 수신

---

## 🎉 축하합니다!

UnMute 웹사이트 배포가 완료되었습니다! 🚀

학생들이 안전하고 자유롭게 소통할 수 있는 플랫폼을 만드셨습니다.

**행운을 빕니다!** 💙

