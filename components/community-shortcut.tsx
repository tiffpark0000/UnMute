"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, TrendingUp, Heart, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"

export function CommunityShortcut() {
  const boards = [
    {
      id: "free",
      name: "자유게시판",
      icon: MessageCircle,
      color: "text-[#6B8E7F]",
      bgColor: "bg-[#6B8E7F]/10",
      description: "자유롭게 이야기해요",
      count: "1,234"
    },
    {
      id: "worry",
      name: "고민상담",
      icon: Heart,
      color: "text-[#B88B7F]",
      bgColor: "bg-[#B88B7F]/10",
      description: "함께 고민을 나눠요",
      count: "856"
    },
    {
      id: "trending",
      name: "실시간 인기",
      icon: TrendingUp,
      color: "text-[#D4A574]",
      bgColor: "bg-[#D4A574]/10",
      description: "지금 핫한 글",
      count: "342"
    },
    {
      id: "anonymous",
      name: "익명 비밀톡",
      icon: Sparkles,
      color: "text-[#9B8E7F]",
      bgColor: "bg-[#9B8E7F]/10",
      description: "아무도 모르게",
      count: "567"
    }
  ]

  return (
    <Card className="p-6 shadow-md border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-1">
            커뮤니티 바로가기
          </h2>
          <p className="text-sm text-muted-foreground">
            학우들과 소통하는 공간
          </p>
        </div>
        <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10" asChild>
          <Link href="/boards">
            전체보기
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {boards.map((board) => (
          <Link
            key={board.id}
            href={`/board/${board.id}`}
            className="group"
          >
            <Card className="p-4 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer border-2 hover:border-primary/40 bg-card">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-xl ${board.bgColor}`}>
                  <board.icon className={`h-5 w-5 ${board.color}`} />
                </div>
                <div className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  {board.count}개
                </div>
              </div>
              <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                {board.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {board.description}
              </p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-6 p-4 bg-accent/50 rounded-xl border border-primary/15">
        <div className="flex items-center gap-2 text-sm">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-foreground font-medium">
            오늘도 따뜻한 이야기들이 가득합니다 💬
          </span>
        </div>
      </div>
    </Card>
  )
}

