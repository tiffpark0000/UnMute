"use client"

import { Header } from "@/components/header"
import { StatsSection } from "@/components/stats-section"
import { SecuritySection } from "@/components/security-section"
import { MobileShowcase } from "@/components/mobile-showcase"
import { AuthModal } from "@/components/auth-modal"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, BookOpen, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { onAuthStateChange } from "@/lib/firebase-auth"
import type { User as FirebaseUser } from "firebase/auth"

export default function Home() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Firebase 인증 상태 감지
    const unsubscribe = onAuthStateChange((user) => {
      console.log('Page - 인증 상태:', user?.email || '로그아웃')
      setCurrentUser(user)
      
      // 로그인하지 않은 경우 인증 모달 표시
      if (!user) {
        const timer = setTimeout(() => {
          setShowAuthModal(true)
        }, 500)
        return () => clearTimeout(timer)
      }
    })

    return () => unsubscribe()
  }, [])

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-accent/20 via-background to-background pt-16 pb-12">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-sm font-medium text-primary">Exclusive Platform for SJA Jeju Students</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              You Don't Have to Face It Alone<br />
              <span className="text-primary">UnMute</span> Is Here for You
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Mental Health Counselling & Academic Tutoring<br />
              A safe space to share concerns anonymously and receive academic support
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-lg text-base px-8" asChild>
                <Link href="/anonymous-board">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Share Anonymously
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-primary/30 hover:bg-primary/10 text-base px-8" asChild>
                <Link href="/tutoring">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Request Tutoring
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="container mx-auto px-6 max-w-7xl -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/anonymous-board">
            <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 hover:border-primary/40 group">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#B88B7F]/15 rounded-xl group-hover:bg-[#B88B7F]/25 transition-colors">
                  <MessageSquare className="h-6 w-6 text-[#B88B7F]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    Anonymous Board
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Share your concerns and problems anonymously and safely
                  </p>
                  <div className="flex items-center text-primary text-sm font-medium">
                    Send Message
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/academic-hub">
            <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 hover:border-primary/40 group">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/15 rounded-xl group-hover:bg-primary/25 transition-colors">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    Academic Hub
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Manage your timetable and to-do list in one place
                  </p>
                  <div className="flex items-center text-primary text-sm font-medium">
                    View Schedule
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/tutoring">
            <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 hover:border-primary/40 group">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#D4A574]/15 rounded-xl group-hover:bg-[#D4A574]/25 transition-colors">
                  <BookOpen className="h-6 w-6 text-[#D4A574]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    Tutoring Session
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Get help with difficult subjects, online or in-person
                  </p>
                  <div className="flex items-center text-primary text-sm font-medium">
                    Book Tutoring
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/counseling">
            <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 hover:border-primary/40 group">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#6B8E7F]/15 rounded-xl group-hover:bg-[#6B8E7F]/25 transition-colors">
                  <Calendar className="h-6 w-6 text-[#6B8E7F]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    Counseling Booking
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    One-on-one in-person counseling with professional counselors
                  </p>
                  <div className="flex items-center text-primary text-sm font-medium">
                    Book Counseling
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 max-w-7xl mt-16">
        <StatsSection />
      </section>

      {/* Security Section */}
      <section className="container mx-auto px-6 max-w-7xl mt-16">
        <SecuritySection />
      </section>

      {/* Mobile Showcase - 실제 고민 예시 */}
      <MobileShowcase />

      {/* Call to Action */}
      <section className="bg-gradient-to-br from-primary/10 via-accent/20 to-secondary/30 py-16 mt-16">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Get Started Today
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Create a healthier and happier school life together with UnMute
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-lg">
              Sign Up Now
            </Button>
            <Button size="lg" variant="outline" className="border-2">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Auth Modal - Auto-popup for non-logged-in users */}
      <AuthModal 
        open={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  )
}
