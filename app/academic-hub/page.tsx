"use client"

import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, BookOpen, CheckCircle, Plus, Trash2, Edit } from "lucide-react"
import { useState, useEffect } from "react"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import {
  getTimetableEvents,
  addTimetableEvent,
  deleteTimetableEvent,
  getTodoItems,
  addTodoItem,
  toggleTodoComplete,
  deleteTodoItem,
  TimetableEvent,
  TodoItem
} from "@/lib/firestore-academic"
import { Timestamp } from "firebase/firestore"

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const COLORS = ['#8B7355', '#D4A574', '#9CA986', '#B88B7F', '#7FA99C']

export default function AcademicHubPage() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [timetableEvents, setTimetableEvents] = useState<TimetableEvent[]>([])
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // 시간표 폼 상태
  const [eventTitle, setEventTitle] = useState("")
  const [eventDay, setEventDay] = useState("")
  const [eventStartTime, setEventStartTime] = useState("")
  const [eventEndTime, setEventEndTime] = useState("")
  const [eventSubject, setEventSubject] = useState("")
  const [eventRoom, setEventRoom] = useState("")
  const [eventColor, setEventColor] = useState(COLORS[0])

  // To-do 폼 상태
  const [todoTitle, setTodoTitle] = useState("")
  const [todoDescription, setTodoDescription] = useState("")
  const [todoDueDate, setTodoDueDate] = useState("")
  const [todoPriority, setTodoPriority] = useState<'low' | 'medium' | 'high'>('medium')

  // 사용자 인증 상태
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid)
      } else {
        setCurrentUserId(null)
      }
    })
    return () => unsubscribe()
  }, [])

  // 데이터 로드
  const loadData = async () => {
    if (!currentUserId) return
    
    try {
      setLoading(true)
      const [events, todoItems] = await Promise.all([
        getTimetableEvents(currentUserId),
        getTodoItems(currentUserId)
      ])
      setTimetableEvents(events)
      setTodos(todoItems)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currentUserId) {
      loadData()
    }
  }, [currentUserId])

  // 시간표 이벤트 추가
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUserId) return

    try {
      await addTimetableEvent({
        userId: currentUserId,
        title: eventTitle,
        day: eventDay,
        startTime: eventStartTime,
        endTime: eventEndTime,
        subject: eventSubject,
        room: eventRoom,
        color: eventColor,
      })
      
      // 폼 초기화
      setEventTitle("")
      setEventDay("")
      setEventStartTime("")
      setEventEndTime("")
      setEventSubject("")
      setEventRoom("")
      setEventColor(COLORS[0])
      setIsEventModalOpen(false)
      
      loadData()
      alert('Event added successfully!')
    } catch (error) {
      console.error('Failed to add event:', error)
      alert('Failed to add event. Please try again.')
    }
  }

  // 시간표 이벤트 삭제
  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Delete this event?')) return
    
    try {
      await deleteTimetableEvent(eventId)
      loadData()
    } catch (error) {
      console.error('Failed to delete event:', error)
    }
  }

  // To-do 추가
  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUserId) return

    try {
      await addTodoItem({
        userId: currentUserId,
        title: todoTitle,
        description: todoDescription,
        dueDate: todoDueDate ? Timestamp.fromDate(new Date(todoDueDate)) : undefined,
        completed: false,
        priority: todoPriority,
      })
      
      // 폼 초기화
      setTodoTitle("")
      setTodoDescription("")
      setTodoDueDate("")
      setTodoPriority('medium')
      setIsTodoModalOpen(false)
      
      loadData()
      alert('To-do added successfully!')
    } catch (error) {
      console.error('Failed to add todo:', error)
      alert('Failed to add to-do. Please try again.')
    }
  }

  // To-do 완료 토글
  const handleToggleTodo = async (todoId: string, completed: boolean) => {
    try {
      await toggleTodoComplete(todoId, !completed)
      loadData()
    } catch (error) {
      console.error('Failed to toggle todo:', error)
    }
  }

  // To-do 삭제
  const handleDeleteTodo = async (todoId: string) => {
    if (!confirm('Delete this to-do?')) return
    
    try {
      await deleteTodoItem(todoId)
      loadData()
    } catch (error) {
      console.error('Failed to delete todo:', error)
    }
  }

  // 요일별 시간표 이벤트 필터링
  const getEventsForDay = (day: string) => {
    return timetableEvents.filter(event => event.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  // 우선순위 색상
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'low': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-8 max-w-7xl">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/30 rounded-xl">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Academic Hub</h1>
              <p className="text-muted-foreground mt-1">
                Manage your timetable and to-dos in one place
              </p>
            </div>
          </div>
        </div>

        {!currentUserId ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">Please log in to access your Academic Hub.</p>
          </Card>
        ) : loading ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">Loading...</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 시간표 */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Clock className="h-6 w-6 text-primary" />
                    Weekly Timetable
                  </h2>
                  <Button
                    onClick={() => setIsEventModalOpen(true)}
                    className="bg-primary hover:bg-primary/90 gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Event
                  </Button>
                </div>

                <div className="space-y-4">
                  {DAYS.map((day) => (
                    <div key={day} className="border-2 rounded-lg p-4">
                      <h3 className="font-bold text-lg mb-3 text-primary">{day}</h3>
                      <div className="space-y-2">
                        {getEventsForDay(day).length === 0 ? (
                          <p className="text-sm text-muted-foreground italic">No classes scheduled</p>
                        ) : (
                          getEventsForDay(day).map((event) => (
                            <div
                              key={event.id}
                              className="flex items-center justify-between p-3 rounded-lg border-2"
                              style={{ borderLeftWidth: '4px', borderLeftColor: event.color }}
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold">{event.title}</span>
                                  {event.subject && (
                                    <Badge className="bg-primary/10 text-primary">{event.subject}</Badge>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground flex items-center gap-4">
                                  <span>{event.startTime} - {event.endTime}</span>
                                  {event.room && <span>Room: {event.room}</span>}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteEvent(event.id)}
                                className="hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* To-do 리스트 */}
            <div>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    To-Do List
                  </h2>
                  <Button
                    onClick={() => setIsTodoModalOpen(true)}
                    size="sm"
                    className="bg-primary hover:bg-primary/90 gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>

                <div className="space-y-3">
                  {todos.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No to-dos yet</p>
                  ) : (
                    todos.map((todo) => (
                      <div
                        key={todo.id}
                        className={`p-3 rounded-lg border-2 ${todo.completed ? 'bg-gray-50 opacity-60' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => handleToggleTodo(todo.id, todo.completed)}
                            className="mt-1"
                          >
                            <CheckCircle
                              className={`h-5 w-5 ${todo.completed ? 'text-green-600 fill-green-100' : 'text-gray-400'}`}
                            />
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`font-medium ${todo.completed ? 'line-through' : ''}`}>
                                {todo.title}
                              </span>
                              <Badge className={getPriorityColor(todo.priority)} variant="outline">
                                {todo.priority}
                              </Badge>
                            </div>
                            {todo.description && (
                              <p className="text-sm text-muted-foreground mb-1">{todo.description}</p>
                            )}
                            {todo.dueDate && (
                              <p className="text-xs text-muted-foreground">
                                Due: {todo.dueDate.toDate().toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTodo(todo.id)}
                            className="hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>

      {/* 시간표 이벤트 추가 모달 */}
      <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Timetable Event</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddEvent} className="space-y-4">
            <div>
              <Label htmlFor="event-title">Class/Event Title *</Label>
              <Input
                id="event-title"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="e.g., Math Class"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event-day">Day *</Label>
                <Select value={eventDay} onValueChange={setEventDay} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS.map((day) => (
                      <SelectItem key={day} value={day}>{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="event-subject">Subject</Label>
                <Input
                  id="event-subject"
                  value={eventSubject}
                  onChange={(e) => setEventSubject(e.target.value)}
                  placeholder="e.g., Mathematics"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event-start">Start Time *</Label>
                <Input
                  id="event-start"
                  type="time"
                  value={eventStartTime}
                  onChange={(e) => setEventStartTime(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="event-end">End Time *</Label>
                <Input
                  id="event-end"
                  type="time"
                  value={eventEndTime}
                  onChange={(e) => setEventEndTime(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event-room">Room</Label>
                <Input
                  id="event-room"
                  value={eventRoom}
                  onChange={(e) => setEventRoom(e.target.value)}
                  placeholder="e.g., 3-A"
                />
              </div>
              <div>
                <Label htmlFor="event-color">Color</Label>
                <Select value={eventColor} onValueChange={setEventColor}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COLORS.map((color) => (
                      <SelectItem key={color} value={color}>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
                          {color}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                Add Event
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsEventModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* To-do 추가 모달 */}
      <Dialog open={isTodoModalOpen} onOpenChange={setIsTodoModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add To-Do</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddTodo} className="space-y-4">
            <div>
              <Label htmlFor="todo-title">Title *</Label>
              <Input
                id="todo-title"
                value={todoTitle}
                onChange={(e) => setTodoTitle(e.target.value)}
                placeholder="e.g., Finish homework"
                required
              />
            </div>
            <div>
              <Label htmlFor="todo-description">Description</Label>
              <Textarea
                id="todo-description"
                value={todoDescription}
                onChange={(e) => setTodoDescription(e.target.value)}
                placeholder="Add details..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="todo-due">Due Date</Label>
                <Input
                  id="todo-due"
                  type="date"
                  value={todoDueDate}
                  onChange={(e) => setTodoDueDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="todo-priority">Priority</Label>
                <Select value={todoPriority} onValueChange={(val: any) => setTodoPriority(val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                Add To-Do
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsTodoModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

