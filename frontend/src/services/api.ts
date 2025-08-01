import axios, { AxiosResponse } from 'axios';
import {
  Project,
  CreateProjectDto,
  WorkLog,
  CreateWorkLogDto,
  Task,
  CreateTaskDto,
  User,
  CreateUserDto,
  Forecast,
  GenerateForecastDto,
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Projects API
export const projectsAPI = {
  getAll: (): Promise<AxiosResponse<Project[]>> => api.get('/projects'),
  getById: (id: string): Promise<AxiosResponse<Project>> => api.get(`/projects/${id}`),
  create: (data: CreateProjectDto): Promise<AxiosResponse<Project>> => api.post('/projects', data),
  update: (id: string, data: Partial<CreateProjectDto>): Promise<AxiosResponse<Project>> => api.patch(`/projects/${id}`, data),
  delete: (id: string): Promise<AxiosResponse<void>> => api.delete(`/projects/${id}`),
};

// Work Logs API
export const workLogsAPI = {
  getAll: (params: Record<string, any> = {}): Promise<AxiosResponse<WorkLog[]>> => api.get('/work-logs', { params }),
  getById: (id: string): Promise<AxiosResponse<WorkLog>> => api.get(`/work-logs/${id}`),
  create: (data: CreateWorkLogDto): Promise<AxiosResponse<WorkLog>> => api.post('/work-logs', data),
  update: (id: string, data: Partial<CreateWorkLogDto>): Promise<AxiosResponse<WorkLog>> => api.patch(`/work-logs/${id}`, data),
  delete: (id: string): Promise<AxiosResponse<void>> => api.delete(`/work-logs/${id}`),
  getProjectSummary: (projectId: string): Promise<AxiosResponse<any>> => api.get(`/work-logs/project/${projectId}/summary`),
  getMonthlyReport: (params: { userId: string; year: number; month: number }): Promise<AxiosResponse<any>> => 
    api.get('/work-logs/reports/monthly', { params }),
  exportToExcel: (params: { userId: string; year: number; month: number }): Promise<AxiosResponse<Blob>> => 
    api.get('/work-logs/reports/export/excel', { params, responseType: 'blob' }),
  exportToPdf: (params: { userId: string; year: number; month: number }): Promise<AxiosResponse<Blob>> => 
    api.get('/work-logs/reports/export/pdf', { params, responseType: 'blob' }),
};

// Tasks API
export const tasksAPI = {
  getAll: (params: Record<string, any> = {}): Promise<AxiosResponse<Task[]>> => api.get('/tasks', { params }),
  getById: (id: string): Promise<AxiosResponse<Task>> => api.get(`/tasks/${id}`),
  getByStatus: (status: string): Promise<AxiosResponse<Task[]>> => api.get(`/tasks/by-status/${status}`),
  create: (data: CreateTaskDto): Promise<AxiosResponse<Task>> => api.post('/tasks', data),
  update: (id: string, data: Partial<CreateTaskDto>): Promise<AxiosResponse<Task>> => api.patch(`/tasks/${id}`, data),
  updateActualHours: (id: string, actualHours: number): Promise<AxiosResponse<Task>> => api.patch(`/tasks/${id}/actual-hours`, { actualHours }),
  delete: (id: string): Promise<AxiosResponse<void>> => api.delete(`/tasks/${id}`),
};

// Users API
export const usersAPI = {
  create: (data: CreateUserDto): Promise<AxiosResponse<User>> => api.post('/user/create', data),
  getById: (id: string): Promise<AxiosResponse<User>> => api.get(`/user/${id}`),
};

// Forecast API
export const forecastAPI = {
  generate: (data: GenerateForecastDto): Promise<AxiosResponse<Forecast>> => api.post('/forecast/generate', data),
  getByWorkSchedule: (workScheduleId: string): Promise<AxiosResponse<Forecast[]>> => api.get(`/forecast/work-schedule/${workScheduleId}`),
};

export default api;