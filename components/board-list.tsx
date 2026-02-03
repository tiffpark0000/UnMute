import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, ThumbsUp } from "lucide-react"

const posts = [
  {
    id: 1,
    board: "자유게시판",
    title: "오늘 학식 뭐가 맛있었어요?",
    content: "2층 학생식당 돈까스가 진짜 맛있더라구요 ㅎㅎ 다들 추천!",
    isAnonymous: true,
    likes: 24,
    comments: 8,
    time: "5분 전",
  },
  {
    id: 2,
    board: "정보게시판",
    title: "중간고사 범위 정리해둔 거 공유합니다",
    content: "데이터베이스 수업 시험 범위 정리했어요. 도움 되시길!",
    isAnonymous: false,
    nickname: "컴공21",
    likes: 56,
    comments: 12,
    time: "1시간 전",
  },
  {
    id: 3,
    board: "익명게시판",
    title: "솔직히 이번 학기 너무 힘들지 않나요",
    content: "과제도 많고 시험도 많고... 다들 화이팅해요 우리",
    isAnonymous: true,
    likes: 89,
    comments: 34,
    time: "2시간 전",
  },
  {
    id: 4,
    board: "동아리",
    title: "밴드 동아리 새 멤버 모집합니다!",
    content: "기타, 베이스, 드럼 하실 분 구해요~ 초보도 환영!",
    isAnonymous: false,
    nickname: "락스타",
    likes: 15,
    comments: 6,
    time: "3시간 전",
  },
  {
    id: 5,
    board: "질문게시판",
    title: "도서관 몇 시까지 하나요?",
    content: "평일 밤늦게까지 공부하려고 하는데 혹시 아시는 분 계신가요?",
    isAnonymous: true,
    likes: 7,
    comments: 15,
    time: "4시간 전",
  },
]

export function BoardList() {
  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <Card key={post.id} className="p-5 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/30 bg-card">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-11 h-11 rounded-full bg-gradient-to-br from-primary/30 to-primary/50 flex items-center justify-center text-sm font-bold text-white">
              {post.isAnonymous ? "익" : post.nickname?.charAt(0)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs bg-secondary/80 hover:bg-secondary">
                  {post.board}
                </Badge>
                <span className="text-xs text-muted-foreground">{post.time}</span>
              </div>

              <h3 className="font-bold text-balance leading-snug mb-2 text-foreground">{post.title}</h3>

              <p className="text-sm text-muted-foreground line-clamp-2 text-pretty leading-relaxed">{post.content}</p>

              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <button className="flex items-center gap-1 hover:text-primary transition-colors">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{post.likes}</span>
                </button>
                <button className="flex items-center gap-1 hover:text-primary transition-colors">
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments}</span>
                </button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
