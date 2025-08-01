import React, { useState, useEffect } from 'react';
import { projectsAPI } from '../services/api';
import { Project, CreateProjectDto, ProjectStatus } from '../types';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<CreateProjectDto>({
    name: '',
    description: '',
    hourlyRate: 0,
    currency: 'USD',
    status: ProjectStatus.ACTIVE,
    startDate: '',
    endDate: '',
    userId: 'default-user-id' // In a real app, this would come from auth
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await projectsAPI.getAll();
      setProjects(response.data);
    } catch (err) {
      setError('Failed to fetch projects');
      console.error('Projects error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      const projectData: CreateProjectDto = {
        ...formData,
        hourlyRate: Number(formData.hourlyRate),
      };
      
      if (editingProject) {
        await projectsAPI.update(editingProject.id, projectData);
      } else {
        await projectsAPI.create(projectData);
      }
      await fetchProjects();
      resetForm();
    } catch (err) {
      setError('Failed to save project');
      console.error('Save project error:', err);
    }
  };

  const handleEdit = (project: Project): void => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description || '',
      hourlyRate: project.hourlyRate,
      currency: project.currency,
      status: project.status,
      startDate: project.startDate ? project.startDate.split('T')[0] : '',
      endDate: project.endDate ? project.endDate.split('T')[0] : '',
      userId: project.userId
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectsAPI.delete(id);
        await fetchProjects();
      } catch (err) {
        setError('Failed to delete project');
        console.error('Delete project error:', err);
      }
    }
  };

  const resetForm = (): void => {
    setFormData({
      name: '',
      description: '',
      hourlyRate: 0,
      currency: 'USD',
      status: ProjectStatus.ACTIVE,
      startDate: '',
      endDate: '',
      userId: 'default-user-id'
    });
    setEditingProject(null);
    setShowForm(false);
  };

  const getStatusBadgeClass = (status: ProjectStatus): string => {
    switch (status) {
      case ProjectStatus.ACTIVE: return 'status-badge status-active';
      case ProjectStatus.COMPLETED: return 'status-badge status-completed';
      case ProjectStatus.PAUSED: return 'status-badge status-paused';
      case ProjectStatus.CANCELLED: return 'status-badge status-cancelled';
      default: return 'status-badge';
    }
  };

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Projects</h1>
        <button 
          className="btn btn-success" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'New Project'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {showForm && (
        <div className="card">
          <h2>{editingProject ? 'Edit Project' : 'Create New Project'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Project Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Hourly Rate</label>
              <input
                type="number"
                step="0.01"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
                required
              />
            </div>
            <div className="form-group">
              <label>Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="BRL">BRL</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
              >
                <option value={ProjectStatus.ACTIVE}>Active</option>
                <option value={ProjectStatus.COMPLETED}>Completed</option>
                <option value={ProjectStatus.PAUSED}>Paused</option>
                <option value={ProjectStatus.CANCELLED}>Cancelled</option>
              </select>
            </div>
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-success">
                {editingProject ? 'Update' : 'Create'} Project
              </button>
              <button type="button" className="btn" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h2>All Projects</h2>
        {projects.length === 0 ? (
          <p>No projects found. Create your first project!</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Hourly Rate</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>{project.name}</td>
                  <td>{project.description || 'No description'}</td>
                  <td>{project.currency} {project.hourlyRate}/hr</td>
                  <td>
                    <span className={getStatusBadgeClass(project.status)}>
                      {project.status}
                    </span>
                  </td>
                  <td>
                    {project.startDate 
                      ? new Date(project.startDate).toLocaleDateString() 
                      : 'Not set'
                    }
                  </td>
                  <td>
                    <button 
                      className="btn" 
                      onClick={() => handleEdit(project)}
                      style={{ marginRight: '0.5rem' }}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => handleDelete(project.id)}
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

export default Projects;