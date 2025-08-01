import React, { useState, useEffect } from 'react';
import { workLogsAPI, projectsAPI } from '../services/api';
import { WorkLog, Project, CreateWorkLogDto } from '../types';

const WorkLogs: React.FC = () => {
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingLog, setEditingLog] = useState<WorkLog | null>(null);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [monthlyReport, setMonthlyReport] = useState<any>(null);
  const [showReports, setShowReports] = useState<boolean>(false);
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    hoursWorked: '',
    description: '',
    projectId: '',
    userId: 'default-user-id'
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [selectedProject]);

  useEffect(() => {
    if (showReports) {
      fetchMonthlyReport();
    }
  }, [selectedYear, selectedMonth, showReports]);

  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);
      const params = selectedProject ? { projectId: selectedProject } : {};
      const [workLogsResponse, projectsResponse] = await Promise.all([
        workLogsAPI.getAll(params),
        projectsAPI.getAll()
      ]);
      setWorkLogs(workLogsResponse.data);
      setProjects(projectsResponse.data);
    } catch (err) {
      setError('Failed to fetch data');
      console.error('WorkLogs error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyReport = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await workLogsAPI.getMonthlyReport({
        userId: 'default-user-id',
        year: selectedYear,
        month: selectedMonth
      });
      setMonthlyReport(response.data);
    } catch (err) {
      setError('Failed to fetch monthly report');
      console.error('Monthly report error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async (): Promise<void> => {
    try {
      setExportLoading(true);
      const response = await workLogsAPI.exportToExcel({
        userId: 'default-user-id',
        year: selectedYear,
        month: selectedMonth
      });
      
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `work-logs-${selectedYear}-${selectedMonth.toString().padStart(2, '0')}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to export Excel file');
      console.error('Excel export error:', err);
    } finally {
      setExportLoading(false);
    }
  };

  const handleExportPdf = async (): Promise<void> => {
    try {
      setExportLoading(true);
      const response = await workLogsAPI.exportToPdf({
        userId: 'default-user-id',
        year: selectedYear,
        month: selectedMonth
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `work-logs-${selectedYear}-${selectedMonth.toString().padStart(2, '0')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to export PDF file');
      console.error('PDF export error:', err);
    } finally {
      setExportLoading(false);
    }
  };

  const calculateHours = (startTime: string, endTime: string): number => {
    if (!startTime || !endTime) return 0;
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diffMs = end.getTime() - start.getTime();
    return Math.max(0, diffMs / (1000 * 60 * 60));
  };

  const handleTimeChange = (field: string, value: string): void => {
    const newFormData = { ...formData, [field]: value };
    
    if (field === 'startTime' || field === 'endTime') {
      const hours = calculateHours(newFormData.startTime, newFormData.endTime);
      newFormData.hoursWorked = hours.toFixed(2);
    }
    
    setFormData(newFormData);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        startTime: formData.date + 'T' + formData.startTime + ':00Z',
        endTime: formData.date + 'T' + formData.endTime + ':00Z',
        hoursWorked: parseFloat(formData.hoursWorked)
      };
      
      if (editingLog) {
        await workLogsAPI.update(editingLog.id, submitData);
      } else {
        await workLogsAPI.create(submitData);
      }
      await fetchData();
      resetForm();
    } catch (err) {
      setError('Failed to save work log');
      console.error('Save work log error:', err);
    }
  };

  const handleEdit = (log: WorkLog): void => {
    setEditingLog(log);
    const startTime = new Date(log.startTime);
    const endTime = new Date(log.endTime);
    
    setFormData({
      date: log.date.split('T')[0],
      startTime: startTime.toTimeString().slice(0, 5),
      endTime: endTime.toTimeString().slice(0, 5),
      hoursWorked: log.hoursWorked.toString(),
      description: log.description,
      projectId: log.projectId,
      userId: log.userId
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this work log?')) {
      try {
        await workLogsAPI.delete(id);
        await fetchData();
      } catch (err) {
        setError('Failed to delete work log');
        console.error('Delete work log error:', err);
      }
    }
  };

  const resetForm = (): void => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      startTime: '',
      endTime: '',
      hoursWorked: '',
      description: '',
      projectId: '',
      userId: 'default-user-id'
    });
    setEditingLog(null);
    setShowForm(false);
  };

  const getProjectName = (projectId: string): string => {
    const project = projects.find((p: Project) => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  const calculateEarnings = (log: WorkLog): number => {
     const project = projects.find((p: Project) => p.id === log.projectId);
     if (!project) return 0;
     return Number(log.hoursWorked) * Number(project.hourlyRate);
   };

  if (loading) {
    return <div className="loading">Loading work logs...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Work Logs</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className="btn" 
            onClick={() => setShowReports(!showReports)}
          >
            {showReports ? 'Hide Reports' : 'Show Reports'}
          </button>
          <button 
            className="btn btn-success" 
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Log Work'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>Filters</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Filter by Project</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <option value="">All Projects</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Monthly Reports */}
      {showReports && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>Monthly Reports & Export</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '1rem', alignItems: 'end' }}>
            <div className="form-group">
              <label>Year</label>
              <input
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                min="2020"
                max="2030"
              />
            </div>
            <div className="form-group">
              <label>Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                className="btn btn-success"
                onClick={handleExportExcel}
                disabled={exportLoading}
              >
                {exportLoading ? 'Exporting...' : 'Export Excel'}
              </button>
              <button
                className="btn btn-success"
                onClick={handleExportPdf}
                disabled={exportLoading}
              >
                {exportLoading ? 'Exporting...' : 'Export PDF'}
              </button>
            </div>
          </div>
          
          {monthlyReport && (
            <div style={{ marginTop: '2rem' }}>
              <h4>Report Summary for {selectedMonth}/{selectedYear}</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="card">
                  <h5>Total Hours</h5>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{monthlyReport.summary?.totalHours || 0}h</p>
                </div>
                <div className="card">
                  <h5>Total Earnings</h5>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>${monthlyReport.summary?.totalEarnings || 0}</p>
                </div>
                <div className="card">
                  <h5>Projects Worked</h5>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{monthlyReport.projects?.length || 0}</p>
                </div>
              </div>
              
              {monthlyReport.projects && monthlyReport.projects.length > 0 && (
                <div>
                  <h5>Projects Breakdown</h5>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Project</th>
                        <th>Hours</th>
                        <th>Earnings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyReport.projects.map((project: any, index: number) => (
                        <tr key={index}>
                          <td>{project.projectName}</td>
                          <td>{project.totalHours}h</td>
                          <td>${project.totalEarnings}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {error && <div className="error">{error}</div>}

      {showForm && (
        <div className="card">
          <h2>{editingLog ? 'Edit Work Log' : 'Log New Work'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Start Time</label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleTimeChange('startTime', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Time</label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleTimeChange('endTime', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Hours Worked</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.hoursWorked}
                  onChange={(e) => setFormData({ ...formData, hoursWorked: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Project</label>
              <select
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                required
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What did you work on?"
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-success">
                {editingLog ? 'Update' : 'Save'} Work Log
              </button>
              <button type="button" className="btn" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h2>Work History</h2>
        {workLogs.length === 0 ? (
          <p>No work logs found. Start tracking your time!</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Project</th>
                <th>Hours</th>
                <th>Earnings</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {workLogs
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((log) => (
                <tr key={log.id}>
                  <td>{new Date(log.date).toLocaleDateString()}</td>
                  <td>{getProjectName(log.projectId)}</td>
                  <td>{log.hoursWorked}h</td>
                  <td>${calculateEarnings(log).toFixed(2)}</td>
                  <td>{log.description}</td>
                  <td>
                    <button 
                      className="btn" 
                      onClick={() => handleEdit(log)}
                      style={{ marginRight: '0.5rem' }}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => handleDelete(log.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default WorkLogs;