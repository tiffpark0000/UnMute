"use client"

import { Header } from "@/components/header"
import { PostFormModal } from "@/components/post-form-modal"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Heart, Eye, Lock, PenSquare, Pencil, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { getPosts, deletePost, Post } from "@/lib/firestore-posts"
import { getUserProfile } from "@/lib/firebase-auth"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"

// Remove sample posts - now using Firestore!

export default function AnonymousBoardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)

  // 사용자 인증 상태 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUserId(user.uid)
        // 관리자 권한 확인
        const profile = await getUserProfile(user.uid)
        setIsAdmin(profile?.role === 'admin')
      } else {
        setCurrentUserId(null)
        setIsAdmin(false)
      }
    })

    return () => unsubscribe()
  }, [])

  // 게시글 불러오기
  const loadPosts = async () => {
    try {
      setLoading(true)
      const fetchedPosts = await getPosts('anonymous', currentUserId || undefined, isAdmin)
      setPosts(fetchedPosts)
    } catch (error) {
      console.error('Failed to load posts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currentUserId !== null) {
      loadPosts()
    }
  }, [currentUserId, isAdmin])

  // Delete post
  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      await deletePost(postId)
      setPosts(posts.filter(p => p.id !== postId))
      alert('Post deleted successfully.')
    } catch (error) {
      console.error('Failed to delete post:', error)
      alert('Failed to delete post. Please try again.')
    }
  }

  // 게시글 수정 모달 열기
  const handleEdit = (post: Post) => {
    setEditingPost(post)
    setIsModalOpen(true)
  }

  // 새 게시글 작성 후
  const handleNewPost = () => {
    setIsModalOpen(false)
    setEditingPost(null)
    loadPosts() // 게시글 목록 새로고침
  }

  // 시간 포맷 함수
  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return 'Just now'
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      const now = new Date()
      const diff = Math.floor((now.getTime() - date.getTime()) / 1000)

      if (diff < 60) return 'Just now'
      if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
      if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
      if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`
      return date.toLocaleDateString()
    } catch {
      return 'Just now'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Anonymous Bulletin Board</h1>
              <p className="text-muted-foreground mt-1">
                Share what's on your mind—no judgment, just support
              </p>
            </div>
          </div>

          {/* Write Post Button */}
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white shadow-lg gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <PenSquare className="h-5 w-5" />
            Write a Post
          </Button>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {loading ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">Loading posts...</p>
            </Card>
          ) : posts.length === 0 ? (
            <Card className="p-12 text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
            </Card>
          ) : (
            posts.map((post) => (
              <Card 
                key={post.id} 
                className="p-6 hover:shadow-lg transition-all border-2 hover:border-primary/30"
              >
                <div className="flex items-start gap-4">
                  {/* Author Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/50 flex items-center justify-center flex-shrink-0 text-white font-bold">
                    {post.isAnonymous ? "A" : post.authorName.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Post Header */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="font-semibold text-foreground">
                            {post.isAnonymous ? "Anonymous" : post.authorName}
                          </span>
                          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                            {post.category}
                          </Badge>
                          {post.isPrivate && (
                            <Badge variant="outline" className="gap-1">
                              <Lock className="h-3 w-3" />
                              Private
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground ml-auto">
                            {formatTimestamp(post.createdAt)}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">
                          {post.title}
                        </h3>
                      </div>
                    </div>

                    {/* Post Content */}
                    <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                      {post.content}
                    </p>

                    {/* Post Stats & Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          <span>{post.viewCount} views</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.commentCount} comments</span>
                        </div>
                      </div>

                      {/* Edit/Delete buttons for author or admin */}
                      {(currentUserId === post.authorId || isAdmin) && (
                        <div className="flex items-center gap-2">
                          {currentUserId === post.authorId && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-2 hover:bg-primary/10 hover:text-primary"
                              onClick={() => handleEdit(post)}
                            >
                              <Pencil className="h-4 w-4" />
                              Edit
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleDelete(post.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Info Card */}
        <Card className="mt-8 p-6 bg-accent/20 border-primary/20">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
              <MessageCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">
                Remember: You're Not Alone
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Whatever you're going through, sharing it is the first step. Our community and 
                professional counselors are here to support you. If your concern needs immediate 
                professional attention, we'll connect you with our school counselors right away.
              </p>
            </div>
          </div>
        </Card>
      </main>

      {/* Post Form Modal */}
      <PostFormModal 
        open={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false)
          setEditingPost(null)
        }}
        onSubmit={handleNewPost}
        editPost={editingPost}
        boardType="anonymous"
      />
    </div>
  )
}

// Remove sample posts - now using Firestore!

