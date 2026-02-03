// Simple authentication system
// In production, this should use a real database like Supabase, Firebase, or PostgreSQL

export interface User {
  id: string
  email: string
  name: string
  nickname: string
  password: string // In production, this should be hashed
  createdAt: string
  grade?: string
  gender?: string
  interests?: string[]
}

// Get all users from localStorage
export function getUsers(): User[] {
  if (typeof window === 'undefined') return []
  const users = localStorage.getItem('unmute_users')
  return users ? JSON.parse(users) : []
}

// Save users to localStorage
function saveUsers(users: User[]) {
  localStorage.setItem('unmute_users', JSON.stringify(users))
}

// Register new user
export function registerUser(userData: Omit<User, 'id' | 'createdAt'>): { success: boolean; message: string; user?: User } {
  const users = getUsers()
  
  // Check if email already exists
  if (users.find(u => u.email === userData.email)) {
    return { success: false, message: 'Email already registered' }
  }
  
  // Check if nickname already exists
  if (users.find(u => u.nickname === userData.nickname)) {
    return { success: false, message: 'Nickname already taken' }
  }
  
  // Create new user
  const newUser: User = {
    ...userData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  }
  
  users.push(newUser)
  saveUsers(users)
  
  return { success: true, message: 'Registration successful', user: newUser }
}

// Login user
export function loginUser(email: string, password: string): { success: boolean; message: string; user?: User } {
  const users = getUsers()
  const user = users.find(u => u.email === email && u.password === password)
  
  if (!user) {
    return { success: false, message: 'Invalid email or password' }
  }
  
  // Save current user session
  localStorage.setItem('unmute_current_user', JSON.stringify(user))
  
  return { success: true, message: 'Login successful', user }
}

// Logout user
export function logoutUser() {
  localStorage.removeItem('unmute_current_user')
}

// Get current user
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null
  const user = localStorage.getItem('unmute_current_user')
  return user ? JSON.parse(user) : null
}

// Check if user is logged in
export function isLoggedIn(): boolean {
  return getCurrentUser() !== null
}










