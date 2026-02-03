"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PenSquare } from "lucide-react"

export function QuickWrite() {
  return (
    <Card className="p-5 hover:shadow-lg transition-all border-2 hover:border-primary/30">
      <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-colors text-left">
        <div className="flex-shrink-0 w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center">
          <PenSquare className="h-5 w-5 text-primary" />
        </div>
        <span className="text-muted-foreground font-medium">무슨 생각을 하고 계신가요?</span>
      </button>

      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
        <Button variant="ghost" size="sm" className="text-sm hover:bg-primary/10 hover:text-primary">
          익명 게시판
        </Button>
        <Button variant="ghost" size="sm" className="text-sm hover:bg-primary/10 hover:text-primary">
          자유게시판
        </Button>
        <Button variant="ghost" size="sm" className="text-sm hover:bg-primary/10 hover:text-primary">
          정보게시판
        </Button>
      </div>
    </Card>
  )
}
