// Project types
export interface Project {
  id: string;
  name: string;
  description?: string;
  hourlyRate: number;
  currency: string;
  status: ProjectStatus;
  startDate?: string;
  endDate?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export enum ProjectStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  PAUSED = 'PAUSED',
  CANCELLED = 'CANCELLED'
}

export interface CreateProjectDto {
  name: string;
  description?: string;
  hourlyRate: number;
  currency: string;
  status: ProjectStatus;
  startDate?: string;
  endDate?: string;
  userId: string;
}

// Work Log types
export interface WorkLog {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  hoursWorked: number;
  description: string;
  taskId?: string;
  projectId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkLogDto {
  date: string;
  startTime: string;
  endTime: string;
  hoursWorked: number;
  description: string;
  taskId?: string;
  projectId: string;
  userId: string;
}

// Task types
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  estimatedHours?: number;
  actualHours?: number;
  projectId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  estimatedHours?: number;
  actualHours?: number;
  projectId: string;
  userId: string;
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
}

// Forecast types
export interface Forecast {
  id: string;
  workScheduleId: string;
  month: number;
  year: number;
  totalWorkDays: number;
  totalWorkHours: number;
  monthlyGains: number;
  projectId?: string;
  hourlyRate?: number;
  createdAt: string;
  updatedAt: string;
  workDays: WorkDayForecast[];
}

export interface WorkDayForecast {
  date: string;
  dayOfWeek: number;
  workHours: number;
}

export interface GenerateForecastDto {
  workScheduleId: string;
  month: number;
  year: number;
  projectId?: string;
  hourlyRate?: number;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

// Dashboard stats
export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalHours: number;
  totalEarnings: number;
  completedTasks: number;
  pendingTasks: number;
}

// Form data types
export interface ProjectFormData {
  name: string;
  description: string;
  hourlyRate: string;
  currency: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  userId: string;
}

export interface WorkLogFormData {
  date: string;
  startTime: string;
  endTime: string;
  hoursWorked: string;
  description: string;
  projectId: string;
  userId: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  estimatedHours: string;
  actualHours: string;
  projectId: string;
  userId: string;
}