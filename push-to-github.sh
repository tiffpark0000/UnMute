#!/bin/bash

# UnMute GitHub 강제 푸시 스크립트
# 이 스크립트는 코드를 GitHub에 강제로 업로드합니다.

echo "🚀 UnMute GitHub 업로드 스크립트"
echo "=================================="
echo ""

# 현재 디렉토리 확인
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "📂 작업 디렉토리: $SCRIPT_DIR"
echo ""

# Git 사용자 정보 설정 (처음 한 번만 필요)
echo "⚙️  Git 사용자 정보 설정..."
git config user.name "tiffpark0000" 2>/dev/null
git config user.email "tiffpark0000@gmail.com" 2>/dev/null
echo "✅ 완료"
echo ""

# 변경사항 확인
echo "📊 변경된 파일 확인 중..."
git status --short
echo ""

# 모든 변경사항 추가
echo "📦 변경사항 추가 중..."
git add .
echo "✅ 완료"
echo ""

# 커밋
echo "💾 커밋 생성 중..."
COMMIT_MSG="Update: $(date '+%Y-%m-%d %H:%M:%S')"
git commit -m "$COMMIT_MSG" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ 커밋 완료: $COMMIT_MSG"
else
    echo "ℹ️  변경사항이 없거나 이미 커밋됨"
fi
echo ""

# GitHub Personal Access Token 입력
echo "🔑 GitHub 인증이 필요합니다"
echo ""
echo "Personal Access Token이 없으면 먼저 생성하세요:"
echo "👉 https://github.com/settings/tokens/new"
echo ""
echo "설정:"
echo "  - Note: UnMute Project"
echo "  - Expiration: 90 days"
echo "  - Scopes: repo (전체 체크)"
echo ""
read -sp "GitHub Personal Access Token을 입력하세요: " TOKEN
echo ""
echo ""

if [ -z "$TOKEN" ]; then
    echo "❌ 토큰이 입력되지 않았습니다."
    exit 1
fi

# Remote URL 설정 (토큰 포함)
echo "🔗 GitHub 저장소 연결 중..."
git remote remove origin 2>/dev/null
git remote add origin https://${TOKEN}@github.com/tiffpark0000/UnMute.git
echo "✅ 완료"
echo ""

# 강제 푸시
echo "⬆️  GitHub에 강제 푸시 중..."
git push -u origin main --force

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ========================================="
    echo "✅ 성공! GitHub에 업로드되었습니다! 🎉"
    echo "✅ ========================================="
    echo ""
    echo "🌐 저장소 확인: https://github.com/tiffpark0000/UnMute"
    echo ""
else
    echo ""
    echo "❌ ========================================="
    echo "❌ 업로드 실패"
    echo "❌ ========================================="
    echo ""
    echo "가능한 원인:"
    echo "  1. Personal Access Token이 잘못됨"
    echo "  2. 토큰에 'repo' 권한이 없음"
    echo "  3. 네트워크 연결 문제"
    echo ""
    echo "다시 시도하려면 스크립트를 재실행하세요."
    exit 1
fi

# 토큰 제거 (보안)
echo "🔒 보안: 토큰 정보 제거 중..."
git remote remove origin 2>/dev/null
git remote add origin https://github.com/tiffpark0000/UnMute.git
echo "✅ 완료"
echo ""

echo "🎯 다음 단계:"
echo "  1. GitHub에서 저장소 확인"
echo "  2. Vercel에서 배포하기"
echo "  3. Firebase 승인된 도메인에 Vercel URL 추가"
echo ""
echo "💡 팁: 다음에 업로드할 때도 이 스크립트를 실행하세요!"
echo ""

