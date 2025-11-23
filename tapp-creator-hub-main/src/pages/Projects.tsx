import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Folder, CheckCircle, DollarSign, Users, Plus } from 'lucide-react';
import { useProjects, useAuth } from '@/hooks/useAPI';

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  goal_amount: number;
  total_invested: number;
  projected_roi: number;
  creator_id: string;
}

const Projects = () => {
  const { createProject, listProjects, publishProject, investInProject, isLoading, error } = useProjects();
  const { getMe } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal_amount: 0,
    min_investment: 100,
    projected_roi: 150,
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const user = await getMe();
      setUserId(user.id);

      // Get all projects
      const data = await listProjects({});
      console.log('All projects loaded:', data);

      // Handle both array and object with data property
      let allProjects = [];
      if (Array.isArray(data)) {
        allProjects = data;
      } else if (data && typeof data === 'object' && 'data' in data) {
        allProjects = (data as any).data || [];
      }

      // Get user's creator profile to filter projects
      const creatorResponse = await fetch('http://localhost:8000/creators/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (creatorResponse.ok) {
        const creator = await creatorResponse.json();
        // Filter to show only this user's projects
        const userProjects = allProjects.filter((p: any) => p.creator_id === creator._id);
        console.log(`Setting ${userProjects.length} projects for creator ${creator._id}`);
        setProjects(userProjects);
      } else {
        // No creator profile, show empty
        console.log('No creator profile, showing empty projects');
        setProjects([]);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
      setProjects([]);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await createProject(formData);
      console.log('Project created:', result);

      // Reset form
      setFormData({
        title: '',
        description: '',
        goal_amount: 0,
        min_investment: 100,
        projected_roi: 150,
      });
      setShowCreateForm(false);

      // Reload projects list
      await loadProjects();

      alert('Project created successfully!');
    } catch (err) {
      console.error('Failed to create project:', err);
      alert('Failed to create project. Please try again.');
    }
  };

  const handlePublishProject = async (projectId: string) => {
    try {
      await publishProject(projectId);
      await loadProjects();
    } catch (err) {
      console.error('Failed to publish project:', err);
    }
  };

  const currentProjects = projects.filter(p => p.status === 'ACTIVE' || p.status === 'DRAFT' || p.status === 'LIVE');
  const completedProjects = projects.filter(p => p.status === 'COMPLETED');

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-5xl font-light glow-text">Projects Dashboard</h1>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="neo-button flex items-center gap-2"
          >
            <Plus size={20} />
            New Project
          </Button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-8 text-red-200">
            {error}
          </div>
        )}

        {showCreateForm && (
          <div className="glass rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-semibold mb-6">Create New Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Project Title</label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Documentary Series"
                  required
                  className="bg-muted/50 border-border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your project..."
                  required
                  className="w-full bg-muted/50 border border-border rounded-lg p-3 text-foreground"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Goal Amount ($)</label>
                  <Input
                    type="number"
                    value={formData.goal_amount}
                    onChange={(e) => setFormData({ ...formData, goal_amount: Number(e.target.value) })}
                    placeholder="10000"
                    required
                    className="bg-muted/50 border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Min Investment ($)</label>
                  <Input
                    type="number"
                    value={formData.min_investment}
                    onChange={(e) => setFormData({ ...formData, min_investment: Number(e.target.value) })}
                    placeholder="100"
                    className="bg-muted/50 border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Projected ROI (%)</label>
                  <Input
                    type="number"
                    value={formData.projected_roi}
                    onChange={(e) => setFormData({ ...formData, projected_roi: Number(e.target.value) })}
                    placeholder="150"
                    className="bg-muted/50 border-border"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <Button type="submit" className="neo-button" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create Project'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Folder className="text-primary" size={28} />
              <h2 className="text-2xl font-light">Active Projects</h2>
            </div>
            {isLoading ? (
              <p className="text-muted-foreground">Loading projects...</p>
            ) : currentProjects.length > 0 ? (
              <div className="space-y-4">
                {currentProjects.map(project => (
                  <div key={project.id} className="bg-muted/50 rounded-lg p-4 hover:bg-muted/80 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-lg">{project.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full ${project.status === 'ACTIVE'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-blue-500/20 text-blue-400'
                        }`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div className="flex items-center gap-1">
                        <DollarSign size={14} className="text-primary" />
                        ${project.total_invested.toLocaleString()} / ${project.goal_amount.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        📊 {project.projected_roi}% ROI
                      </div>
                    </div>
                    {project.status === 'DRAFT' && (
                      <Button
                        size="sm"
                        className="w-full neo-button text-xs"
                        onClick={() => handlePublishProject(project.id)}
                      >
                        Publish Project
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No active projects yet.</p>
            )}
          </div>

          <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="text-green-500" size={28} />
              <h2 className="text-2xl font-light">Completed Projects</h2>
            </div>
            {completedProjects.length > 0 ? (
              <div className="space-y-4">
                {completedProjects.map(project => (
                  <div key={project.id} className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-lg">{project.title}</p>
                        <p className="text-sm text-muted-foreground">Raised: ${project.total_invested.toLocaleString()}</p>
                      </div>
                      <span className="text-xs bg-gray-500/20 text-gray-400 px-3 py-1 rounded-full">
                        Completed
                      </span>
                    </div>
                    <p className="text-sm text-green-400">✓ Project completed successfully</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No completed projects yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
