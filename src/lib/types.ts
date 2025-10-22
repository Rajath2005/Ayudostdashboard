// Type definitions for AyuDost Dashboard

export type UserRole = 'Team Leader' | 'Backend' | 'AI/ML' | 'Frontend' | 'Stakeholder';

export type TaskStatus = 'Pending' | 'In Progress' | 'In Review' | 'Completed';

export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  skills: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  dueDate: string;
  module: string;
  subtasks: Subtask[];
  createdAt: string;
  updatedAt: string;
  dependencies?: string[];
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Activity {
  id: string;
  userId: string;
  action: string;
  taskId?: string;
  timestamp: string;
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  completed: boolean;
}
