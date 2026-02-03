/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // 개발 서버 설정 - 네트워크 인터페이스 오류 방지
  devIndicators: {
    buildActivity: false,
  },
}

export default nextConfig
