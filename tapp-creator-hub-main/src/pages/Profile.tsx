import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAPI';
import { LogOut, Edit2, X, TrendingUp, Users, Video, Eye, Globe } from 'lucide-react';
import { apiClient } from '@/lib/api';

const Profile = () => {
  const navigate = useNavigate();
  const { creatorId } = useParams();
  const { getMe, logout } = useAuth();

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    primary_genre: '',
    region: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeProjects: 0,
    totalInvestors: 0,
    completionRate: 0
  });

  useEffect(() => {
    loadUserProfile();
    loadStats();
  }, [creatorId]);

  const loadUserProfile = async () => {
    try {
      const userData = await getMe();
      setUser(userData);

      if (!creatorId) {
        setIsOwnProfile(true);
        const creator: any = await apiClient.getMyCreatorProfile();
        setProfile(creator);
        setFormData({
          display_name: creator.display_name || '',
          bio: creator.bio || '',
          primary_genre: creator.primary_genre || '',
          region: creator.region || '',
        });
      } else {
        setIsOwnProfile(false);
        const creator = await apiClient.getCreatorProfile(creatorId);
        setProfile(creator);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
      // If it's own profile and failed (likely 404), allow creating one
      if (!creatorId) {
        setIsOwnProfile(true);
        setProfile({
          display_name: user?.email?.split('@')[0] || 'New Creator',
          bio: '',
          primary_genre: '',
          region: '',
        });
        setFormData({
          display_name: user?.email?.split('@')[0] || 'New Creator',
          bio: '',
          primary_genre: '',
          region: '',
        });
        setEditMode(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      let targetCreatorId = creatorId;

      if (!targetCreatorId) {
        const creator: any = await apiClient.getMyCreatorProfile();
        targetCreatorId = creator._id;
      }

      if (!targetCreatorId) return;

      const allProjects = await apiClient.listProjects({});
      const creatorProjects = allProjects.filter((p: any) => p.creator_id === targetCreatorId);

      const activeProjects = creatorProjects.filter((p: any) =>
        p.status === 'LIVE' || p.status === 'ACTIVE'
      ).length;

      const completedProjects = creatorProjects.filter((p: any) =>
        p.status === 'COMPLETED'
      ).length;

      const allInvestments: any = await apiClient.getMyInvestments();
      const projectIds = creatorProjects.map((p: any) => p._id);
      const creatorInvestments = Array.isArray(allInvestments)
        ? allInvestments.filter((inv: any) => projectIds.includes(inv.project_id))
        : [];

      const totalRevenue = creatorInvestments.reduce((sum: number, inv: any) =>
        sum + (inv.amount || 0), 0
      );

      const totalInvestors = new Set(creatorInvestments.map((inv: any) => inv.investor_id)).size;

      setStats({
        totalRevenue,
        activeProjects,
        totalInvestors,
        completionRate: creatorProjects.length > 0 ? Math.round((completedProjects / creatorProjects.length) * 100) : 0
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await apiClient.updateCreatorProfile(formData);
      setProfile({ ...profile, ...formData });
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to save profile:', err);
      alert('Failed to save profile');
    }
  };

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 px-4 ${activeTab === 'overview' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-4 px-4 ${activeTab === 'analytics' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
          >
            Analytics
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="glass rounded-xl p-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl font-light mb-4">
                  {profile.display_name?.charAt(0).toUpperCase()}
                </div>

                <h2 className="text-3xl font-light mb-2">{profile.display_name}</h2>
                <p className="text-muted-foreground mb-1">{user?.email}</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {profile.primary_genre} • {profile.region}
                </p>
                <p className="text-muted-foreground mb-6">{profile.bio}</p>

                <div className="flex gap-4 w-full">
                  {isOwnProfile && !editMode && (
                    <Button onClick={() => setEditMode(true)} className="flex-1">
                      <Edit2 size={16} className="mr-2" />
                      Edit Profile
                    </Button>
                  )}
                  {isOwnProfile && (
                    <Button variant="outline" onClick={handleLogout} className="flex-1">
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Stats & Editor */}
            <div className="lg:col-span-2 space-y-6">
              {editMode && isOwnProfile && (
                <div className="glass rounded-xl p-6">
                  <h2 className="text-2xl font-light mb-6">Edit Profile</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Display Name</label>
                      <Input
                        value={formData.display_name}
                        onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                        className="bg-muted/50 border-border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Bio</label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="w-full bg-muted/50 border border-border rounded-lg p-3"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Primary Genre</label>
                        <Input
                          value={formData.primary_genre}
                          onChange={(e) => setFormData({ ...formData, primary_genre: e.target.value })}
                          className="bg-muted/50 border-border"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Region</label>
                        <Input
                          value={formData.region}
                          onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                          className="bg-muted/50 border-border"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Button onClick={handleSaveProfile} className="neo-button flex-1">
                        Save Changes
                      </Button>
                      <Button onClick={() => setEditMode(false)} variant="outline" className="flex-1">
                        <X size={16} className="mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="glass rounded-xl p-6">
                <h2 className="text-2xl font-light mb-6">Statistics</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-muted-foreground text-sm mb-1">Total Revenue</p>
                    <p className="text-3xl font-light text-primary">₹{stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-muted-foreground text-sm mb-1">Active Projects</p>
                    <p className="text-3xl font-light text-secondary">{stats.activeProjects}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-muted-foreground text-sm mb-1">Total Investors</p>
                    <p className="text-3xl font-light text-accent">{stats.totalInvestors}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-muted-foreground text-sm mb-1">Completion Rate</p>
                    <p className="text-3xl font-light">{stats.completionRate}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Channel Overview */}
            <div className="glass rounded-xl p-6">
              <h2 className="text-2xl font-light mb-6">Channel Overview</h2>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="text-primary" size={20} />
                    <p className="text-sm text-muted-foreground">Subscribers</p>
                  </div>
                  <p className="text-3xl font-light">{profile.subscribers?.toLocaleString() || 0}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Video className="text-secondary" size={20} />
                    <p className="text-sm text-muted-foreground">Total Videos</p>
                  </div>
                  <p className="text-3xl font-light">{profile.total_videos || 0}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="text-accent" size={20} />
                    <p className="text-sm text-muted-foreground">Total Views</p>
                  </div>
                  <p className="text-3xl font-light">{profile.total_views?.toLocaleString() || 0}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="text-green-400" size={20} />
                    <p className="text-sm text-muted-foreground">Ad Revenue</p>
                  </div>
                  <p className="text-3xl font-light">₹{profile.ad_revenue?.toLocaleString() || 0}</p>
                </div>
              </div>
            </div>

            {/* Engagement Metrics */}
            <div className="glass rounded-xl p-6">
              <h2 className="text-2xl font-light mb-6">Engagement Metrics</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Engagement Rate</p>
                  <p className="text-3xl font-light text-primary">{profile.engagement_rate || 0}%</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Subscriber Growth</p>
                  <p className="text-3xl font-light text-green-400">+{profile.subscriber_growth_rate || 0}%</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Posting Frequency</p>
                  <p className="text-3xl font-light">{profile.posting_frequency || 0}/week</p>
                </div>
              </div>
            </div>

            {/* Performance */}
            <div className="glass rounded-xl p-6">
              <h2 className="text-2xl font-light mb-6">Performance</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Trend</p>
                  <p className="text-2xl font-light capitalize">{profile.performance_trend || 'stable'}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Top Genre</p>
                  <p className="text-2xl font-light">{profile.top_performing_genre || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Demographics */}
            {profile.audience_demographics && (
              <div className="glass rounded-xl p-6">
                <h2 className="text-2xl font-light mb-6">Audience Demographics</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Age Groups */}
                  {profile.audience_demographics.age_groups && (
                    <div>
                      <h3 className="text-lg font-light mb-4">Age Distribution</h3>
                      <div className="space-y-2">
                        {Object.entries(profile.audience_demographics.age_groups).map(([age, percent]: any) => (
                          <div key={age}>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{age}</span>
                              <span>{percent}%</span>
                            </div>
                            <div className="w-full bg-muted/50 rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${percent}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Gender & Countries */}
                  <div className="space-y-6">
                    {profile.audience_demographics.gender && (
                      <div>
                        <h3 className="text-lg font-light mb-4">Gender Split</h3>
                        <div className="space-y-2">
                          {Object.entries(profile.audience_demographics.gender).map(([gender, percent]: any) => (
                            <div key={gender} className="flex justify-between">
                              <span className="capitalize">{gender}</span>
                              <span className="text-primary">{percent}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {profile.audience_demographics.top_countries && (
                      <div>
                        <h3 className="text-lg font-light mb-4">Top Countries</h3>
                        <div className="flex flex-wrap gap-2">
                          {profile.audience_demographics.top_countries.map((country: string) => (
                            <span key={country} className="px-3 py-1 bg-muted/50 rounded-full text-sm flex items-center gap-2">
                              <Globe size={14} />
                              {country}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
