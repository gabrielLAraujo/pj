import React, { useState, useEffect } from 'react';
import { tasksAPI, projectsAPI } from '../services/api';
import { Task, Project, CreateTaskDto, TaskStatus, TaskPriority } from '../types';

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [formData, setFormData] = useState<CreateTaskDto>({
    title: '',
    description: '',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    estimatedHours: 0,
    actualHours: 0,
    projectId: '',
    userId: 'default-user-id'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);
      const [tasksResponse, projectsResponse] = await Promise.all([
        tasksAPI.getAll(),
        projectsAPI.getAll()
      ]);
      setTasks(tasksResponse.data);
      setProjects(projectsResponse.data);
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Tasks error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      const submitData: CreateTaskDto = {
        ...formData,
        estimatedHours: formData.estimatedHours ? Number(formData.estimatedHours) : 0,
        actualHours: formData.actualHours ? Number(formData.actualHours) : 0
      };
      
      if (editingTask) {
        await tasksAPI.update(editingTask.id, submitData);
      } else {
        await tasksAPI.create(submitData);
      }
      await fetchData();
      resetForm();
    } catch (err) {
      setError('Failed to save task');
      console.error('Save task error:', err);
    }
  };

  const handleEdit = (task: Task): void => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      estimatedHours: task.estimatedHours || 0,
      actualHours: task.actualHours || 0,
      projectId: task.projectId,
      userId: task.userId
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksAPI.delete(id);
        await fetchData();
      } catch (err) {
        setError('Failed to delete task');
        console.error('Delete task error:', err);
      }
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus): Promise<void> => {
    try {
      await tasksAPI.update(taskId, { status: newStatus });
      await fetchData();
    } catch (err) {
      setError('Failed to update task status');
      console.error('Update status error:', err);
    }
  };

  const resetForm = (): void => {
    setFormData({
      title: '',
      description: '',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      estimatedHours: 0,
      actualHours: 0,
      projectId: '',
      userId: 'default-user-id'
    });
    setEditingTask(null);
    setShowForm(false);
  };

  const getProjectName = (projectId: string): string => {
    const project = projects.find((p: Project) => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  const getStatusBadgeClass = (status: TaskStatus): string => {
    switch (status) {
      case TaskStatus.TODO: return 'status-badge status-paused';
      case TaskStatus.IN_PROGRESS: return 'status-badge status-active';
      case TaskStatus.COMPLETED: return 'status-badge status-completed';
      case TaskStatus.CANCELLED: return 'status-badge status-cancelled';
      default: return 'status-badge';
    }
  };

  const getPriorityBadgeClass = (priority: TaskPriority): string => {
    switch (priority) {
      case TaskPriority.LOW: return 'status-badge status-completed';
      case TaskPriority.MEDIUM: return 'status-badge status-active';
      case TaskPriority.HIGH: return 'status-badge status-paused';
      case TaskPriority.URGENT: return 'status-badge status-cancelled';
      default: return 'status-badge';
    }
  };

  const filteredTasks = filterStatus === 'ALL' 
    ? tasks 
    : tasks.filter((task: Task) => task.status === filterStatus);

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Tasks</h1>
        <button 
          className="btn btn-success" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'New Task'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {/* Filter */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label>Filter by Status:</label>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="ALL">All Tasks</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {showForm && (
        <div className="card">
          <h2>{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Task Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Task details..."
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                >
                  <option value={TaskStatus.TODO}>To Do</option>
                  <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                  <option value={TaskStatus.COMPLETED}>Completed</option>
                  <option value={TaskStatus.CANCELLED}>Cancelled</option>
                </select>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                >
                  <option value={TaskPriority.LOW}>Low</option>
                  <option value={TaskPriority.MEDIUM}>Medium</option>
                  <option value={TaskPriority.HIGH}>High</option>
                  <option value={TaskPriority.URGENT}>Urgent</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Estimated Hours</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData({ ...formData, estimatedHours: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div className="form-group">
                <label>Actual Hours</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.actualHours}
                  onChange={(e) => setFormData({ ...formData, actualHours: Number(e.target.value) })}
                  placeholder="0"
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
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-success">
                {editingTask ? 'Update' : 'Create'} Task
              </button>
              <button type="button" className="btn" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h2>Tasks ({filteredTasks.length})</h2>
        {filteredTasks.length === 0 ? (
          <p>No tasks found. Create your first task!</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Project</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Est. Hours</th>
                <th>Actual Hours</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => {
                const progress = task.estimatedHours && task.actualHours 
                  ? Math.min(100, (task.actualHours / task.estimatedHours) * 100)
                  : 0;
                
                return (
                  <tr key={task.id}>
                    <td>
                      <strong>{task.title}</strong>
                      {task.description && (
                        <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
                          {task.description.length > 50 
                            ? task.description.substring(0, 50) + '...' 
                            : task.description
                          }
                        </div>
                      )}
                    </td>
                    <td>{getProjectName(task.projectId)}</td>
                    <td>
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                        className={getStatusBadgeClass(task.status)}
                        style={{ border: 'none', background: 'transparent', color: 'inherit' }}
                      >
                        <option value={TaskStatus.TODO}>To Do</option>
                        <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                        <option value={TaskStatus.COMPLETED}>Completed</option>
                        <option value={TaskStatus.CANCELLED}>Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <span className={getPriorityBadgeClass(task.priority)}>
                        {task.priority}
                      </span>
                    </td>
                    <td>{task.estimatedHours || 'N/A'}h</td>
                    <td>{task.actualHours || 0}h</td>
                    <td>
                      {task.estimatedHours ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div 
                            style={{
                              width: '60px',
                              height: '8px',
                              backgroundColor: '#e0e0e0',
                              borderRadius: '4px',
                              overflow: 'hidden'
                            }}
                          >
                            <div 
                              style={{
                                width: `${Math.min(100, progress)}%`,
                                height: '100%',
                                backgroundColor: progress > 100 ? '#e74c3c' : '#27ae60',
                                transition: 'width 0.3s'
                              }}
                            />
                          </div>
                          <span style={{ fontSize: '0.875rem' }}>
                            {progress.toFixed(0)}%
                          </span>
                        </div>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td>
                      <button 
                        className="btn" 
                        onClick={() => handleEdit(task)}
                        style={{ marginRight: '0.5rem' }}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-danger" 
                        onClick={() => handleDelete(task.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Tasks;