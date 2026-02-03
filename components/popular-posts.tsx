import { Card } from "@/components/ui/card"
import { Flame } from "lucide-react"

const hotPosts = [
  { id: 1, title: "내일 축제 라인업 미쳤다!!!", comments: 156 },
  { id: 2, title: "교수님이 과제 기한 연장해주셨어요", comments: 89 },
  { id: 3, title: "학교 앞 새로 생긴 카페 가봤어요", comments: 67 },
  { id: 4, title: "도서관 자리 앉기 꿀팁", comments: 52 },
  { id: 5, title: "이번 학기 수강신청 후기", comments: 43 },
]

const boards = [
  { name: "자유게시판", count: 234 },
  { name: "익명게시판", count: 567 },
  { name: "정보게시판", count: 123 },
  { name: "질문게시판", count: 89 },
  { name: "동아리", count: 45 },
]

export function PopularPosts() {
  return (
    <div className="space-y-4 sticky top-24">
      <Card className="p-5 border-2 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-primary/15 rounded-lg">
          <Flame className="h-5 w-5 text-primary" />
          </div>
          <h2 className="font-bold text-foreground">실시간 인기글</h2>
        </div>

        <div className="space-y-2">
          {hotPosts.map((post, index) => (
            <div
              key={post.id}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-2 text-pretty text-foreground">{post.title}</p>
                <span className="text-xs text-muted-foreground">댓글 {post.comments}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5 border-2 shadow-md">
        <h2 className="font-bold mb-4 text-foreground">게시판 목록</h2>

        <div className="space-y-1">
          {boards.map((board) => (
            <div
              key={board.name}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer group"
            >
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{board.name}</span>
              <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">{board.count}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
