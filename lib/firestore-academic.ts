// Firestore 시간표 및 할일 관리
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

// 시간표 이벤트 타입
export interface TimetableEvent {
  id: string;
  userId: string;
  title: string;
  day: string; // 'Monday', 'Tuesday', etc.
  startTime: string; // '09:00'
  endTime: string; // '10:00'
  subject?: string;
  room?: string;
  color?: string;
  createdAt: Timestamp;
}

// To-do 아이템 타입
export interface TodoItem {
  id: string;
  userId: string;
  title: string;
  description?: string;
  dueDate?: Timestamp;
  linkedEventId?: string; // 시간표 이벤트와 연결
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Timestamp;
}

// ==================== 시간표 이벤트 추가 ====================
export const addTimetableEvent = async (eventData: Omit<TimetableEvent, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const event = {
      ...eventData,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'timetable'), event);
    console.log('✅ 시간표 이벤트 추가 완료:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ 시간표 이벤트 추가 실패:', error);
    throw error;
  }
};

// ==================== 시간표 이벤트 가져오기 ====================
export const getTimetableEvents = async (userId: string): Promise<TimetableEvent[]> => {
  try {
    const eventsRef = collection(db, 'timetable');
    const q = query(eventsRef, where('userId', '==', userId), orderBy('startTime', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const events: TimetableEvent[] = [];
    querySnapshot.forEach((doc) => {
      events.push({
        id: doc.id,
        ...doc.data(),
      } as TimetableEvent);
    });

    return events;
  } catch (error) {
    console.error('❌ 시간표 가져오기 실패:', error);
    throw error;
  }
};

// ==================== 시간표 이벤트 삭제 ====================
export const deleteTimetableEvent = async (eventId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'timetable', eventId));
    console.log('✅ 시간표 이벤트 삭제 완료');
  } catch (error) {
    console.error('❌ 시간표 이벤트 삭제 실패:', error);
    throw error;
  }
};

// ==================== To-do 아이템 추가 ====================
export const addTodoItem = async (todoData: Omit<TodoItem, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const todo = {
      ...todoData,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'todos'), todo);
    console.log('✅ To-do 아이템 추가 완료:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ To-do 아이템 추가 실패:', error);
    throw error;
  }
};

// ==================== To-do 아이템 가져오기 ====================
export const getTodoItems = async (userId: string): Promise<TodoItem[]> => {
  try {
    const todosRef = collection(db, 'todos');
    const q = query(todosRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const todos: TodoItem[] = [];
    querySnapshot.forEach((doc) => {
      todos.push({
        id: doc.id,
        ...doc.data(),
      } as TodoItem);
    });

    return todos;
  } catch (error) {
    console.error('❌ To-do 가져오기 실패:', error);
    throw error;
  }
};

// ==================== To-do 완료 상태 토글 ====================
export const toggleTodoComplete = async (todoId: string, completed: boolean): Promise<void> => {
  try {
    const todoRef = doc(db, 'todos', todoId);
    await updateDoc(todoRef, { completed });
    console.log('✅ To-do 상태 업데이트 완료');
  } catch (error) {
    console.error('❌ To-do 상태 업데이트 실패:', error);
    throw error;
  }
};

// ==================== To-do 아이템 삭제 ====================
export const deleteTodoItem = async (todoId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'todos', todoId));
    console.log('✅ To-do 아이템 삭제 완료');
  } catch (error) {
    console.error('❌ To-do 아이템 삭제 실패:', error);
    throw error;
  }
};

// ==================== To-do 아이템 수정 ====================
export const updateTodoItem = async (todoId: string, updates: Partial<TodoItem>): Promise<void> => {
  try {
    const todoRef = doc(db, 'todos', todoId);
    await updateDoc(todoRef, updates);
    console.log('✅ To-do 아이템 수정 완료');
  } catch (error) {
    console.error('❌ To-do 아이템 수정 실패:', error);
    throw error;
  }
};




