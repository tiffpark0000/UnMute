"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Lock, Globe, User, UserX, X } from "lucide-react"
import { useState, useEffect } from "react"
import { createPost, updatePost, Post } from "@/lib/firestore-posts"
import { auth } from "@/lib/firebase"
import { getUserProfile } from "@/lib/firebase-auth"
import { isUserBlocked } from "@/lib/firestore-admin"

interface PostFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: () => void
  editPost?: Post | null
  boardType: 'anonymous' | 'free'
}

export function PostFormModal({ open, onClose, onSubmit, editPost, boardType }: PostFormModalProps) {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [content, setContent] = useState("")
  const [isAnonymous, setIsAnonymous] = useState("anonymous")
  const [visibility, setVisibility] = useState("private")
  const [submitting, setSubmitting] = useState(false)

  // 수정 모드일 때 기존 데이터 로드
  useEffect(() => {
    if (editPost) {
      setTitle(editPost.title)
      setCategory(editPost.category)
      setContent(editPost.content)
      setIsAnonymous(editPost.isAnonymous ? "anonymous" : "named")
      setVisibility(editPost.isPrivate ? "private" : "public")
    } else {
      // 새 글 작성 모드일 때 초기화
      setTitle("")
      setCategory("")
      setContent("")
      setIsAnonymous("anonymous")
      setVisibility("private")
    }
  }, [editPost, open])

  const categories = boardType === 'anonymous' 
    ? [
        "Academic Stress",
        "Friendship",
        "Family Issues",
        "Self-Esteem",
        "Bullying",
        "Anxiety",
        "Depression",
        "Peer Pressure",
        "Identity",
        "Relationship Issues",
        "Other"
      ]
    : [
        "Events & Activities",
        "Food & Dining",
        "Study Groups",
        "Recommendations",
        "Lost & Found",
        "School Life",
        "Clubs & Sports",
        "Other"
      ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!auth.currentUser) {
      alert('Please log in to continue.')
      return
    }

    try {
      setSubmitting(true)

      // Check if user is blocked
      const blocked = await isUserBlocked(auth.currentUser.uid)
      if (blocked) {
        alert('⚠️ Your account has been blocked. You cannot create posts.')
        return
      }

      if (editPost) {
        // Edit mode
        await updatePost(editPost.id, {
          title,
          content,
          category,
        })
        alert('Post updated successfully!')
      } else {
        // Create new post
        const userProfile = await getUserProfile(auth.currentUser.uid)
        
        await createPost({
          title,
          content,
          category,
          authorId: auth.currentUser.uid,
          authorName: userProfile?.nickname || userProfile?.displayName || 'Anonymous',
          isAnonymous: boardType === 'free' ? false : (isAnonymous === "anonymous"), // Free board always shows real name
          isPrivate: boardType === 'free' ? false : (visibility === "private"), // Free board always public
          boardType,
        })
        alert('Post created successfully!')
      }

      // Reset and close
      onSubmit()
      onClose()
    } catch (error) {
      console.error('Failed to submit post:', error)
      alert('Failed to save post. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {editPost ? 'Edit Your Post' : 'Share Your Concern'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-semibold">
              Title
            </Label>
            <Input
              id="title"
              placeholder="Give your post a title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-base h-12"
              required
            />
          </div>

          {/* Category Select */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-base font-semibold">
              Category
            </Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Select a category..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat} className="text-base">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content Textarea */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-base font-semibold">
              Your Concern
            </Label>
            <Textarea
              id="content"
              placeholder="Start typing... Share what's on your mind. Remember, this is a safe space."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] text-base resize-none"
              required
            />
            <p className="text-sm text-muted-foreground">
              {content.length} characters
            </p>
          </div>

          {/* Options Section - 수정 모드일 때는 숨김, 자유게시판일 때도 숨김 */}
          {!editPost && boardType === 'anonymous' && (
            <div className="pt-4 border-t space-y-6">
              <h3 className="text-lg font-semibold text-foreground">
                Privacy Options
              </h3>

            {/* Anonymous Option */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                How would you like to post?
              </Label>
              <RadioGroup value={isAnonymous} onValueChange={setIsAnonymous}>
                <div className="flex items-center space-x-3 p-3 rounded-lg border-2 hover:border-primary/50 transition-colors cursor-pointer">
                  <RadioGroupItem value="anonymous" id="modal-anonymous" />
                  <Label htmlFor="modal-anonymous" className="flex items-center gap-3 cursor-pointer flex-1">
                    <UserX className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Post Anonymously</div>
                      <div className="text-sm text-muted-foreground">
                        Your identity will remain completely hidden
                      </div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border-2 hover:border-primary/50 transition-colors cursor-pointer">
                  <RadioGroupItem value="named" id="modal-named" />
                  <Label htmlFor="modal-named" className="flex items-center gap-3 cursor-pointer flex-1">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Post with Your Name/Nickname</div>
                      <div className="text-sm text-muted-foreground">
                        Others will see your username
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Visibility Option */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                Who can see this post?
              </Label>
              <RadioGroup value={visibility} onValueChange={setVisibility}>
                <div className="flex items-center space-x-3 p-3 rounded-lg border-2 hover:border-primary/50 transition-colors cursor-pointer">
                  <RadioGroupItem value="private" id="modal-private" />
                  <Label htmlFor="modal-private" className="flex items-center gap-3 cursor-pointer flex-1">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Private (Admin Only)</div>
                      <div className="text-sm text-muted-foreground">
                        Only you and the admin can see and comment
                      </div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border-2 hover:border-primary/50 transition-colors cursor-pointer">
                  <RadioGroupItem value="public" id="modal-public" />
                  <Label htmlFor="modal-public" className="flex items-center gap-3 cursor-pointer flex-1">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Public</div>
                      <div className="text-sm text-muted-foreground">
                        Everyone can see and add supportive comments
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              size="lg"
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold h-12"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : editPost ? 'Update Post' : 'Post Your Concern'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="px-8 h-12"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

