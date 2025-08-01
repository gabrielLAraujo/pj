import React, { useState, useEffect } from 'react';
import { projectsAPI, workLogsAPI, tasksAPI } from '../services/api';
import { Project, WorkLog, Task, DashboardStats } from '../types';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    totalHours: 0,
    totalEarnings: 0,
    completedTasks: 0,
    pendingTasks: 0,
  });
  const [recentWorkLogs, setRecentWorkLogs] = useState<WorkLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Fetch projects
      const projectsResponse = await projectsAPI.getAll();
      const projects: Project[] = projectsResponse.data;
      
      // Fetch work logs
      const workLogsResponse = await workLogsAPI.getAll();
      const workLogs: WorkLog[] = workLogsResponse.data;
      
      // Fetch tasks
      const tasksResponse = await tasksAPI.getAll();
      const tasks: Task[] = tasksResponse.data;
      
      // Calculate stats
      const totalProjects = projects.length;
      const activeProjects = projects.filter((p: Project) => p.status === 'ACTIVE').length;
      const totalHours = workLogs.reduce((sum: number, log: WorkLog) => sum + log.hoursWorked, 0);
      const totalEarnings = workLogs.reduce((sum: number, log: WorkLog) => {
        const project = projects.find((p: Project) => p.id === log.projectId);
        return sum + (log.hoursWorked * (project?.hourlyRate || 0));
      }, 0);
      const completedTasks = tasks.filter((t: Task) => t.status === 'COMPLETED').length;
      const pendingTasks = tasks.filter((t: Task) => t.status !== 'COMPLETED').length;
      
      setStats({
        totalProjects,
        activeProjects,
        totalHours,
        totalEarnings,
        completedTasks,
        pendingTasks,
      });
      
      // Get recent work logs (last 5)
      const sortedWorkLogs = workLogs
        .sort((a: WorkLog, b: WorkLog) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
      setRecentWorkLogs(sortedWorkLogs);
      
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid">
        <div className="stat-card">
          <h3>{stats.totalProjects}</h3>
          <p>Total Projects</p>
        </div>
        <div className="stat-card">
          <h3>{stats.activeProjects}</h3>
          <p>Active Projects</p>
        </div>
        <div className="stat-card">
          <h3>{stats.totalHours.toFixed(1)}</h3>
          <p>Total Hours</p>
        </div>
        <div className="stat-card">
          <h3>${stats.totalEarnings.toFixed(2)}</h3>
          <p>Total Earnings</p>
        </div>
        <div className="stat-card">
          <h3>{stats.completedTasks}</h3>
          <p>Completed Tasks</p>
        </div>
        <div className="stat-card">
          <h3>{stats.pendingTasks}</h3>
          <p>Pending Tasks</p>
        </div>
      </div>

      {/* Recent Work Logs */}
      <div className="card">
        <h2>Recent Work Logs</h2>
        {recentWorkLogs.length === 0 ? (
          <p>No work logs found. Start tracking your time!</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Hours</th>
                <th>Description</th>
                <th>Project</th>
              </tr>
            </thead>
            <tbody>
              {recentWorkLogs.map((log) => (
                <tr key={log.id}>
                  <td>{new Date(log.date).toLocaleDateString()}</td>
                  <td>{log.hoursWorked}h</td>
                  <td>{log.description}</td>
                  <td>{log.projectId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;