"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Eye } from "lucide-react"
import { useEffect, useState } from "react"

export function MobileShowcase() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      if (scrollPosition > 300) {
        setIsVisible(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const anonymousWorries = [
    {
      id: 1,
      content: "I'm so stressed about school exams lately. I'm worried I won't meet my parents' expectations. I can't even sleep well at night... What should I do?",
      category: "Academic Stress",
      likes: 23,
      comments: 15,
      views: 142,
      time: "5 min ago"
    },
    {
      id: 2,
      content: "It's really hard for me to hang out with friends. I don't know what to say in conversations and I'm becoming more isolated. Please tell me how to make friends ㅠㅠ",
      category: "Friendship",
      likes: 45,
      comments: 28,
      views: 267,
      time: "1 hour ago"
    },
    {
      id: 3,
      content: "I can't keep up with math class. Everyone else seems to understand, but I don't, so I'm even afraid to ask questions. What should I do?",
      category: "Learning Issues",
      likes: 34,
      comments: 19,
      views: 198,
      time: "2 hours ago"
    }
  ]

  return (
    <div className="py-16 bg-gradient-to-b from-secondary/30 to-accent/20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/15 text-primary hover:bg-primary/25 border-primary/20">
            💚 Real Stories
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            You Don't Have to Face It Alone
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Share your concerns anonymously and safely, and find comfort with fellow students
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* 핸드폰 목업 섹션 */}
          <div 
            className={`relative transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            <div className="relative mx-auto max-w-[320px]">
              {/* 핸드폰 프레임 */}
              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-[3rem] p-3 shadow-2xl border-8 border-gray-800">
                {/* 노치 */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl z-10"></div>
                
                {/* 스크린 */}
                <div className="bg-white rounded-[2.3rem] overflow-hidden h-[600px] relative">
                  {/* 앱 헤더 */}
                  <div className="bg-primary text-white p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        💚
                      </div>
                      <span className="font-bold text-lg">UnMute</span>
                    </div>
                    <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                      익명
                    </div>
                  </div>

                  {/* 고민 카드 */}
                  <div className="p-4 space-y-3 overflow-y-auto h-[520px] bg-gray-50">
                    {anonymousWorries.map((worry, index) => (
                      <div
                        key={worry.id}
                        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-fade-in"
                        style={{ animationDelay: `${index * 0.2}s` }}
                      >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-primary/30 to-primary/50 rounded-full"></div>
                        <span className="text-xs font-medium text-gray-600">Anonymous</span>
                          <span className="text-xs text-gray-400">• {worry.time}</span>
                          <Badge className="ml-auto text-[10px] h-5 bg-primary/10 text-primary">
                            {worry.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed mb-3 line-clamp-3">
                          {worry.content}
                        </p>
                        <div className="flex items-center gap-3 text-[10px] text-gray-500">
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {worry.likes}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {worry.comments}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {worry.views}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 장식 요소 */}
              <div className="absolute -z-10 top-1/4 -left-8 w-24 h-24 bg-primary/30 rounded-full blur-2xl"></div>
              <div className="absolute -z-10 bottom-1/4 -right-8 w-32 h-32 bg-accent/40 rounded-full blur-3xl"></div>
            </div>
          </div>

          {/* 익명 고민 상세 섹션 */}
          <div 
            className={`space-y-6 transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            <Card className="p-6 border-2 hover:border-primary/40 transition-all hover:shadow-xl bg-card/95 backdrop-blur">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/50 to-primary/70 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🤫</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-foreground">Anonymous Student</span>
                    <Badge className="text-xs bg-[#B88B7F]/15 text-[#B88B7F] border-[#B88B7F]/20">Academic</Badge>
                    <span className="text-xs text-muted-foreground ml-auto">5 min ago</span>
                  </div>
                  <p className="text-foreground leading-relaxed mb-4">
                    I'm so stressed about school exams lately. I'm worried I won't meet my parents' expectations. I can't even sleep well at night... What should I do? Anyone else dealing with this?
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                      <Heart className="h-4 w-4" />
                      <span>23</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                      <MessageCircle className="h-4 w-4" />
                      <span>15 comments</span>
                    </button>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>142</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 댓글 미리보기 */}
              <div className="mt-4 pt-4 border-t border-border space-y-3">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary/50 to-primary/70 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground">Anonymous</span>
                      <span className="text-xs text-muted-foreground">Just now</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      I'm dealing with the same thing! Let's stay strong together 💪
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center border-2 hover:border-primary/30 transition-all">
                <div className="text-2xl font-bold text-primary mb-1">100%</div>
                <div className="text-xs text-muted-foreground">Anonymous</div>
              </Card>
              <Card className="p-4 text-center border-2 hover:border-primary/30 transition-all">
                <div className="text-2xl font-bold text-primary mb-1">24/7</div>
                <div className="text-xs text-muted-foreground">Anytime</div>
              </Card>
              <Card className="p-4 text-center border-2 hover:border-primary/30 transition-all">
                <div className="text-2xl font-bold text-primary mb-1">Safe</div>
                <div className="text-xs text-muted-foreground">Secure Space</div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}

