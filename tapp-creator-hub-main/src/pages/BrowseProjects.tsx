import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, TrendingUp } from 'lucide-react';
import { apiClient } from '@/lib/api';

const BrowseProjects = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('LIVE');
    const [sortBy, setSortBy] = useState('recent');
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [investAmount, setInvestAmount] = useState('');
    const [showInvestModal, setShowInvestModal] = useState(false);

    useEffect(() => {
        loadProjects();
    }, [statusFilter, sortBy]);

    const loadProjects = async () => {
        try {
            setIsLoading(true);
            const data = await apiClient.getPublicProjects({
                status: statusFilter,
                sort_by: sortBy,
                limit: 50
            });
            setProjects(data);
        } catch (err) {
            console.error('Failed to load projects:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInvest = async () => {
        if (!selectedProject || !investAmount) return;

        const amount = parseFloat(investAmount);
        if (amount < selectedProject.min_investment) {
            alert(`Minimum investment is $${selectedProject.min_investment}`);
            return;
        }

        try {
            await apiClient.investInProject(selectedProject._id, amount);
            alert('Investment successful!');
            setShowInvestModal(false);
            setInvestAmount('');
            loadProjects();
        } catch (err) {
            console.error('Investment failed:', err);
            alert('Investment failed. Please try again.');
        }
    };

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-5xl font-light mb-4 glow-text">Browse Projects</h1>
                    <p className="text-muted-foreground text-lg">
                        Discover and invest in creative projects from talented creators
                    </p>
                </div>

                {/* Search & Filters */}
                <div className="glass rounded-xl p-6 mb-8">
                    <div className="grid md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                                <Input
                                    placeholder="Search projects..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 bg-muted/50 border-border"
                                />
                            </div>
                        </div>
                        <div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2"
                            >
                                <option value="LIVE">Live Projects</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="">All Status</option>
                            </select>
                        </div>
                        <div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2"
                            >
                                <option value="recent">Most Recent</option>
                                <option value="goal_amount">Funding Goal</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Projects Grid */}
                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="text-muted-foreground mt-4">Loading projects...</p>
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="text-center py-12 glass rounded-xl">
                        <p className="text-muted-foreground text-lg">No projects found</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProjects.map((project) => (
                            <div key={project._id} className="glass rounded-xl p-6 hover:scale-105 transition-transform">
                                {/* Creator Info */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm">
                                        {project.creator_name?.charAt(0) || 'C'}
                                    </div>
                                    <div>
                                        <p className="font-medium">{project.creator_name || 'Creator'}</p>
                                        <p className="text-xs text-muted-foreground">Creator</p>
                                    </div>
                                </div>

                                {/* Project Info */}
                                <h3 className="text-xl font-light mb-2">{project.title}</h3>
                                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                                    {project.description}
                                </p>

                                {/* Progress */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span>${project.total_invested?.toLocaleString() || 0} raised</span>
                                        <span className="text-muted-foreground">{project.funding_percentage || 0}%</span>
                                    </div>
                                    <div className="w-full bg-muted/50 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
                                            style={{ width: `${Math.min(project.funding_percentage || 0, 100)}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Goal: ${project.goal_amount?.toLocaleString()}
                                    </p>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                                    <div className="bg-muted/50 rounded-lg p-2">
                                        <p className="text-muted-foreground text-xs">Min Investment</p>
                                        <p className="font-medium">${project.min_investment}</p>
                                    </div>
                                    <div className="bg-muted/50 rounded-lg p-2">
                                        <p className="text-muted-foreground text-xs">Projected ROI</p>
                                        <p className="font-medium text-green-400">{project.projected_roi}%</p>
                                    </div>
                                </div>

                                {/* CTA */}
                                <Button
                                    className="w-full neo-button"
                                    onClick={() => {
                                        setSelectedProject(project);
                                        setShowInvestModal(true);
                                    }}
                                >
                                    <TrendingUp size={16} className="mr-2" />
                                    Invest Now
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Investment Modal */}
                {showInvestModal && selectedProject && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="glass rounded-xl p-8 max-w-md w-full">
                            <h2 className="text-2xl font-light mb-4">Invest in {selectedProject.title}</h2>

                            <div className="mb-6">
                                <p className="text-sm text-muted-foreground mb-2">
                                    Min: ${selectedProject.min_investment} • Projected ROI: {selectedProject.projected_roi}%
                                </p>

                                <label className="block text-sm font-medium mb-2">Investment Amount ($)</label>
                                <Input
                                    type="number"
                                    value={investAmount}
                                    onChange={(e) => setInvestAmount(e.target.value)}
                                    placeholder={`Min $${selectedProject.min_investment}`}
                                    className="bg-muted/50 border-border"
                                />

                                {investAmount && parseFloat(investAmount) > 0 && (
                                    <div className="mt-4 bg-muted/50 rounded-lg p-4">
                                        <p className="text-sm text-muted-foreground mb-1">Expected Return</p>
                                        <p className="text-2xl font-light text-green-400">
                                            ${(parseFloat(investAmount) * (1 + selectedProject.projected_roi / 100)).toFixed(2)}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Based on {selectedProject.projected_roi}% ROI
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    onClick={handleInvest}
                                    className="flex-1 neo-button"
                                    disabled={!investAmount || parseFloat(investAmount) < selectedProject.min_investment}
                                >
                                    Confirm Investment
                                </Button>
                                <Button
                                    onClick={() => {
                                        setShowInvestModal(false);
                                        setInvestAmount('');
                                    }}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrowseProjects;
