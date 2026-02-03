# 🚀 UnMute Vercel 배포 가이드 (GitHub Desktop 사용)

이 가이드는 GitHub Desktop과 Vercel 웹사이트를 사용해서 가장 쉽게 배포하는 방법을 설명합니다.

---

## 📋 준비물

- ✅ GitHub 계정 (`tiffpark0000`)
- ✅ UnMute 프로젝트 코드 (이미 GitHub에 업로드됨!)
- ⏳ Vercel 계정 (만들 예정)

---

## 🎯 전체 과정 요약

1. **GitHub 저장소 확인** (이미 완료! ✅)
2. **Vercel 계정 만들기** (2분)
3. **GitHub 저장소를 Vercel에 연결** (3분)
4. **환경 변수 설정** (5분)
5. **배포 완료!** (자동 배포, 2분)

**총 소요 시간: 약 12분** ⏱️

---

## 📝 단계 1: GitHub 저장소 확인

### ✅ 이미 완료!

프로젝트가 이미 GitHub에 업로드되어 있습니다:

**저장소 주소**: https://github.com/tiffpark0000/UnMute

브라우저에서 위 링크를 열어서 코드가 제대로 업로드되었는지 확인하세요!

---

## 📝 단계 2: Vercel 계정 만들기

### 2-1. Vercel 웹사이트 접속

1. 브라우저에서 이 링크 열기:
   
   👉 **https://vercel.com/signup**

2. 회원가입 화면이 나타납니다.

### 2-2. GitHub 계정으로 로그인

1. **"Continue with GitHub"** 버튼 클릭

   ![Continue with GitHub 버튼 - 검은색 버튼]

2. GitHub 로그인 화면이 나타나면:
   - **Username or email**: `tiffpark0000` 입력
   - **Password**: GitHub 비밀번호 입력
   - **Sign in** 클릭

3. **"Authorize Vercel"** 화면이 나타나면:
   - 맨 아래 **"Authorize Vercel"** 버튼 클릭
   - (이것은 Vercel이 GitHub 저장소를 읽을 수 있도록 허용하는 것입니다)

4. ✅ **완료!** Vercel 대시보드로 이동됩니다.

---

## 📝 단계 3: 프로젝트 Import (가장 중요!)

### 3-1. 새 프로젝트 만들기

1. Vercel 대시보드 화면에서:
   - 오른쪽 상단 **"Add New..."** 버튼 클릭
   - 드롭다운 메뉴에서 **"Project"** 선택

2. **"Import Git Repository"** 화면이 나타납니다.

### 3-2. UnMute 저장소 선택

1. 화면을 아래로 스크롤하면 GitHub 저장소 목록이 보입니다.

2. **`UnMute`** 저장소를 찾습니다.
   
   ```
   📁 tiffpark0000/UnMute
   ```

3. 저장소 오른쪽에 **"Import"** 버튼 클릭!

   > 💡 **Tip**: 만약 `UnMute` 저장소가 보이지 않으면:
   > - **"Adjust GitHub App Permissions"** 링크 클릭
   > - Vercel에 접근 권한을 추가로 부여

### 3-3. 프로젝트 설정

**"Configure Project"** 화면이 나타납니다.

#### 📌 기본 설정

다음 설정들은 **그대로 두세요** (자동으로 감지됨):

- **Project Name**: `unmute` (또는 원하는 이름으로 변경 가능)
- **Framework Preset**: `Next.js` ✅ (자동 감지)
- **Root Directory**: `./` (그대로)
- **Build Command**: `npm run build` (그대로)
- **Output Directory**: `.next` (그대로)

#### ⚙️ 환경 변수 설정 (중요!)

화면을 아래로 스크롤하면 **"Environment Variables"** 섹션이 있습니다.

1. **"Environment Variables"** 클릭해서 펼치기

2. 다음 **7개의 환경 변수**를 하나씩 추가:

---

**변수 1:**
```
Name: NEXT_PUBLIC_FIREBASE_API_KEY
Value: AIzaSyCiPOtHH08XRMK6SFfhxV06oMAEDAXRteI
```
- Name 입력 후 Tab 키 → Value 입력 → Enter

**변수 2:**
```
Name: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
Value: capstone-project-6cd46.firebaseapp.com
```

**변수 3:**
```
Name: NEXT_PUBLIC_FIREBASE_PROJECT_ID
Value: capstone-project-6cd46
```

**변수 4:**
```
Name: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
Value: capstone-project-6cd46.firebasestorage.app
```

**변수 5:**
```
Name: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
Value: 521221469536
```

**변수 6:**
```
Name: NEXT_PUBLIC_FIREBASE_APP_ID
Value: 1:521221469536:web:0438d6af9779d208a95a05
```

**변수 7:**
```
Name: NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
Value: G-GB7XW92DYN
```

---

3. 모든 환경 변수를 추가했으면:
   - 화면 맨 아래 **"Deploy"** 버튼 클릭! 🚀

---

## 📝 단계 4: 배포 진행 중

### 4-1. 배포 과정

**"Deploy"** 버튼을 클릭하면:

1. **"Building"** 화면이 나타납니다
   - 화면에서 실시간으로 빌드 로그를 볼 수 있습니다
   - 🔄 로딩 스피너가 돌아갑니다

2. 약 **2-3분** 소요됩니다 ⏱️

3. 빌드 중 화면에 보이는 것:
   ```
   ▲ Vercel
   🔨 Building...
   📦 Installing dependencies...
   🏗️ Building application...
   ✅ Build completed!
   🚀 Deploying...
   ```

### 4-2. 배포 완료!

배포가 완료되면:

1. **축하 화면**이 나타납니다! 🎉
   
   ```
   🎊 Congratulations!
   Your project has been deployed!
   ```

2. **웹사이트 URL**이 표시됩니다:
   
   ```
   🌐 https://unmute.vercel.app
   ```
   
   또는
   
   ```
   🌐 https://unmute-xxx.vercel.app
   ```

3. 버튼들:
   - **"Visit"** - 웹사이트 바로 열기
   - **"Continue to Dashboard"** - Vercel 대시보드로 이동

---

## 📝 단계 5: Firebase 설정

### 5-1. Vercel 도메인 복사

배포 완료 화면에서 **도메인 주소**를 복사하세요!

예: `unmute.vercel.app`

### 5-2. Firebase에 도메인 추가

Google 로그인이 작동하도록 Firebase에 Vercel 도메인을 추가해야 합니다!

1. **Firebase Console** 열기:
   
   👉 **https://console.firebase.google.com**

2. **프로젝트 선택**:
   - `capstone-project-6cd46` 클릭

3. 왼쪽 메뉴에서 **"Authentication"** 클릭

4. 상단 탭에서 **"Settings"** 클릭

5. 아래로 스크롤 → **"Authorized domains"** 섹션 찾기

6. **"Add domain"** 버튼 클릭

7. Vercel 도메인 입력:
   ```
   unmute.vercel.app
   ```
   (또는 본인이 받은 도메인)

8. **"Add"** 버튼 클릭

✅ **완료!**

---

## 🎉 배포 완료!

### 🌐 웹사이트 확인

브라우저에서 Vercel 도메인을 열어보세요:

👉 **https://unmute.vercel.app** (또는 본인의 도메인)

### ✅ 테스트 항목

웹사이트가 제대로 작동하는지 확인:

1. ✅ 홈페이지가 로드되는가?
2. ✅ Google 로그인이 되는가?
3. ✅ 익명 게시판이 작동하는가?
4. ✅ 자유 게시판이 작동하는가?
5. ✅ Academic Hub가 작동하는가?
6. ✅ 관리자 계정으로 로그인 시 "Admin" 버튼이 보이는가?

모두 ✅라면 **성공!** 🎊

---

## 🔄 코드 수정 후 자동 배포

### GitHub Desktop 사용 (선택사항)

코드를 수정한 후:

1. **GitHub Desktop 설치** (아직 없다면):
   - https://desktop.github.com
   - 다운로드 후 설치
   - GitHub 계정으로 로그인

2. **로컬 저장소 추가**:
   - File → Add Local Repository
   - `/Users/tiffany_mac_pro/Desktop/Capstone project/UnMute` 선택
   - Add Repository

3. **변경사항 커밋**:
   - 좌측에 변경된 파일 목록 표시됨
   - 아래 "Summary" 입력: `Update: 변경 내용 설명`
   - **"Commit to main"** 버튼 클릭

4. **Push to origin**:
   - 상단 **"Push origin"** 버튼 클릭

5. **자동 배포**:
   - Vercel이 자동으로 감지해서 재배포합니다! 🚀
   - 약 2분 후 웹사이트에 변경사항 반영됨

---

### 터미널 사용 (이미 사용 중)

코드 수정 후:

```bash
cd "/Users/tiffany_mac_pro/Desktop/Capstone project/UnMute"
git add .
git commit -m "Update: 변경 내용 설명"
git push origin main
```

→ Vercel이 자동으로 재배포! ✅

---

## 🎓 학생들에게 공유하기

배포가 완료되면 학생들에게 이렇게 안내하세요:

---

### 📢 UnMute 플랫폼 오픈 안내

**UnMute 플랫폼에 오신 것을 환영합니다!**

🌐 **웹사이트 주소**:
```
https://unmute.vercel.app
```
(또는 커스텀 도메인)

### ✨ 사용 방법

1. **로그인**
   - Google 계정으로 로그인 (학교 이메일 또는 개인 Gmail)

2. **익명 게시판**
   - 고민이나 어려움을 익명으로 공유
   - 비공개/공개 선택 가능

3. **자유 게시판**
   - 자유로운 주제로 소통
   - 실명으로 게시

4. **Academic Hub**
   - 시간표 관리
   - 할 일 목록 작성

### 💡 문의사항

문의사항이 있으면 관리자에게 연락주세요!

**관리자 이메일**: s20011656@sjajeju.kr

---

---

## 🛠️ 문제 해결

### ❓ 웹사이트가 열리지 않아요

1. 배포가 완료되었는지 확인:
   - Vercel 대시보드 → Deployments 탭
   - 최근 배포 상태가 "Ready"인지 확인

2. 도메인 주소를 정확히 입력했는지 확인:
   - `https://` 포함해서 입력
   - 오타 확인

### ❓ Google 로그인이 안 돼요

1. Firebase Authorized domains 확인:
   - Firebase Console → Authentication → Settings
   - Authorized domains에 Vercel 도메인이 추가되었는지 확인

2. 환경 변수 확인:
   - Vercel 대시보드 → Settings → Environment Variables
   - 7개 변수가 모두 추가되었는지 확인

### ❓ 환경 변수를 빠뜨렸어요

1. Vercel 대시보드 → 프로젝트 선택
2. **Settings** 탭 클릭
3. 왼쪽 메뉴 **"Environment Variables"** 클릭
4. 누락된 변수 추가
5. **Deployments** 탭 → 최근 배포 → **"Redeploy"**

### ❓ 코드를 수정했는데 웹사이트에 반영이 안 돼요

1. GitHub에 코드를 푸시했는지 확인:
   ```bash
   git push origin main
   ```

2. Vercel이 자동으로 배포했는지 확인:
   - Vercel 대시보드 → Deployments
   - 최근 배포 상태 확인

3. 수동으로 재배포:
   - Vercel 대시보드 → Deployments
   - 최근 배포 → **"..."** 메뉴 → **"Redeploy"**

---

## 📊 Vercel 대시보드 사용법

### 대시보드 접속

👉 **https://vercel.com/dashboard**

### 주요 기능

1. **Overview**
   - 프로젝트 상태 확인
   - 웹사이트 URL 표시
   - 최근 배포 내역

2. **Deployments**
   - 모든 배포 내역 확인
   - 각 배포의 상태 (Ready, Building, Error)
   - 재배포 기능

3. **Settings**
   - **General**: 프로젝트 이름 변경, 삭제
   - **Domains**: 커스텀 도메인 연결
   - **Environment Variables**: 환경 변수 관리
   - **Git**: GitHub 연결 설정

4. **Analytics** (선택사항)
   - 방문자 수 확인
   - 페이지 조회수 확인

---

## 💰 비용

### Vercel 무료 플랜

- ✅ **무료**
- ✅ 개인 프로젝트 무제한
- ✅ 자동 배포
- ✅ SSL 인증서 무료
- ✅ 글로벌 CDN

### Hobby 플랜 (현재 무료로 충분!)

프로젝트가 커지면:
- **Pro 플랜**: $20/월 (팀 협업, 더 많은 기능)

하지만 학교 프로젝트로는 **무료 플랜**으로 충분합니다! ✅

---

## 🎯 요약

### ✅ 완료한 것들

1. ✅ GitHub에 코드 업로드
2. ✅ Vercel 계정 만들기
3. ✅ GitHub 저장소를 Vercel에 연결
4. ✅ 환경 변수 설정
5. ✅ 배포 완료!
6. ✅ Firebase에 도메인 추가

### 🌐 최종 결과

**웹사이트 주소**: https://unmute.vercel.app

학생들이 언제 어디서나 접속할 수 있습니다! 🎉

---

## 📞 도움이 필요하신가요?

### 유용한 링크

- **Vercel 문서**: https://vercel.com/docs
- **Vercel 대시보드**: https://vercel.com/dashboard
- **GitHub 저장소**: https://github.com/tiffpark0000/UnMute
- **Firebase Console**: https://console.firebase.google.com

### 관리자 정보

- **학교 이메일**: s20011656@sjajeju.kr (관리자)
- **개인 이메일**: tiffpark0000@gmail.com (관리자)

---

## 🎉 축하합니다!

UnMute 플랫폼 배포가 완료되었습니다! 🚀

학생들이 안전하고 자유롭게 소통할 수 있는 플랫폼을 성공적으로 만드셨습니다!

**행운을 빕니다!** 💙✨

