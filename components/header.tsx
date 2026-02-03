"use client"

import { Button } from "@/components/ui/button"
import { Bell, Menu, User, MessageSquare, Calendar, BookOpen, LogOut, Shield } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { AuthModal } from "@/components/auth-modal"
import { onAuthStateChange, logOut, getUserProfile, UserProfile } from "@/lib/firebase-auth"
import type { User as FirebaseUser } from "firebase/auth"

export function Header() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Firebase 인증 상태 감지
    const unsubscribe = onAuthStateChange(async (user) => {
      console.log('Header - 인증 상태:', user?.email || '로그아웃')
      setCurrentUser(user)
      
      // 사용자 프로필 가져오기 (role 확인용)
      if (user) {
        const profile = await getUserProfile(user.uid)
        setUserProfile(profile)
        console.log('Header - 사용자 역할:', profile?.role)
      } else {
        setUserProfile(null)
      }
    })

    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await logOut()
      setCurrentUser(null)
    } catch (error) {
      console.error('로그아웃 실패:', error)
    }
  }

  const handleAuthSuccess = () => {
    // Firebase onAuthStateChange가 자동으로 처리
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-card/98 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/sja-logo.png" 
                  alt="St. Johnsbury Academy Jeju" 
                  className="w-16 h-16 object-contain group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    // Fallback to SVG if PNG doesn't exist
                    e.currentTarget.src = '/sja-logo.svg';
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors" style={{ fontWeight: 700 }}>
                  UnMute
                </span>
                <span className="text-xs text-muted-foreground -mt-1">Student Support Platform</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              href="/anonymous-board"
              className="flex items-center gap-2 text-base font-medium text-foreground/70 hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full pb-1"
            >
              <MessageSquare className="h-4 w-4" />
              Anonymous Bulletin Board
            </Link>
            <Link
              href="/free-board"
              className="flex items-center gap-2 text-base font-medium text-foreground/70 hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full pb-1"
            >
              <MessageSquare className="h-4 w-4" />
              Free Bulletin Board
            </Link>
            <Link
              href="/academic-hub"
              className="flex items-center gap-2 text-base font-medium text-foreground/70 hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full pb-1"
            >
              <Calendar className="h-4 w-4" />
              Academic Hub
            </Link>
            <Link
              href="/tutoring"
              className="flex items-center gap-2 text-base font-medium text-foreground/70 hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full pb-1"
            >
              <BookOpen className="h-4 w-4" />
              Tutoring
            </Link>
            <Link
              href="/counseling"
              className="flex items-center gap-2 text-base font-medium text-foreground/70 hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full pb-1"
            >
              <Calendar className="h-4 w-4" />
              Counseling
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
              <Bell className="h-5 w-5" />
            </Button>
            {currentUser && isClient ? (
              <div className="hidden md:flex items-center gap-3">
                {/* 관리자 페이지 버튼 - 관리자만 표시 */}
                {userProfile?.role === 'admin' && (
                  <Link href="/admin">
                    <Button 
                      variant="outline"
                      size="default"
                      className="gap-2 border-2 border-amber-500 text-amber-600 hover:bg-amber-50 hover:text-amber-700 font-semibold shadow-sm"
                      title="관리자 페이지"
                    >
                      <Shield className="h-4 w-4" />
                      Admin
                    </Button>
                  </Link>
                )}
                
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    userProfile?.role === 'admin' ? 'bg-amber-500' : 'bg-primary'
                  }`}>
                    {userProfile?.role === 'admin' ? '👑' : 
                     (currentUser.displayName?.charAt(0)?.toUpperCase() || currentUser.email?.charAt(0)?.toUpperCase() || 'U')}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
                    </span>
                    {userProfile?.role === 'admin' && (
                      <span className="text-xs text-amber-600 font-semibold">관리자</span>
                    )}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleLogout}
                  className="hover:bg-destructive/10 hover:text-destructive"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : isClient && (
            <div className="hidden md:flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="default" 
                  className="font-medium hover:bg-primary/10 hover:text-primary"
                  onClick={() => setShowAuthModal(true)}
                >
                  Login
              </Button>
                <Button 
                  size="default" 
                  className="font-medium bg-primary hover:bg-primary/90 text-white shadow-md"
                  onClick={() => setShowAuthModal(true)}
                >
                  Sign Up
              </Button>
            </div>
            )}
            <Button variant="ghost" size="icon" className="md:hidden hover:bg-primary/10 hover:text-primary">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        open={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </header>
  )
}
