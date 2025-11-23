import { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useAnalytics } from '@/hooks/useAPI';
import { useAuth } from '@/hooks/useAPI';

const Analytics = () => {
  const { getMe } = useAuth();
  const { getCreatorAnalytics, isLoading, error } = useAnalytics();
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const user = await getMe();
      setUserId(user.id);
      
      if (user.id) {
        const data = await getCreatorAnalytics(user.id);
        setAnalyticsData(data);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    }
  };

  // Default data if API fails
  const defaultViewsData = [
    { month: 'Jan', views: 45000 },
    { month: 'Feb', views: 52000 },
    { month: 'Mar', views: 61000 },
    { month: 'Apr', views: 58000 },
    { month: 'May', views: 70000 },
    { month: 'Jun', views: 82000 },
  ];

  const defaultSubscribersData = [
    { month: 'Jan', subs: 12000 },
    { month: 'Feb', subs: 15000 },
    { month: 'Mar', subs: 18500 },
    { month: 'Apr', subs: 21000 },
    { month: 'May', subs: 25000 },
    { month: 'Jun', subs: 30000 },
  ];

  const viewsData = analyticsData?.views_data || defaultViewsData;
  const subscribersData = analyticsData?.subscribers_data || defaultSubscribersData;

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-light mb-12 glow-text">Creator Analytics</h1>
        
        {error && (
          <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4 mb-8 text-yellow-200">
            {error} - Showing sample data
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground mt-4">Loading your analytics...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="glass rounded-xl p-6">
                <p className="text-muted-foreground mb-2">Total Subscribers</p>
                <p className="text-4xl font-light text-primary">
                  {analyticsData?.total_subscribers?.toLocaleString() || '30,000'}
                </p>
                {analyticsData?.subscriber_trend && (
                  <p className="text-sm text-green-500 mt-2">
                    📈 {analyticsData.subscriber_trend}% growth
                  </p>
                )}
              </div>
              <div className="glass rounded-xl p-6">
                <p className="text-muted-foreground mb-2">Total Views</p>
                <p className="text-4xl font-light text-secondary">
                  {analyticsData?.total_views?.toLocaleString() || '82,000'}
                </p>
                {analyticsData?.view_trend && (
                  <p className="text-sm text-green-500 mt-2">
                    📈 {analyticsData.view_trend}% growth
                  </p>
                )}
              </div>
              <div className="glass rounded-xl p-6">
                <p className="text-muted-foreground mb-2">Avg Engagement Rate</p>
                <p className="text-4xl font-light text-accent">
                  {analyticsData?.avg_engagement_rate?.toFixed(2) || '4.2'}%
                </p>
                {analyticsData?.total_videos && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {analyticsData.total_videos} videos
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass rounded-xl p-6">
                <h2 className="text-2xl font-light mb-6">Views Over Time</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={viewsData}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))' 
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="views" 
                      stroke="hsl(var(--primary))" 
                      fillOpacity={1} 
                      fill="url(#colorViews)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="glass rounded-xl p-6">
                <h2 className="text-2xl font-light mb-6">Subscriber Growth</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={subscribersData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))' 
                      }} 
                    />
                    <Bar dataKey="subs" fill="hsl(var(--secondary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {analyticsData?.videos && analyticsData.videos.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-light mb-6">Top Videos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {analyticsData.videos.slice(0, 6).map((video: any, idx: number) => (
                    <div key={idx} className="glass rounded-xl p-4 hover:scale-[1.02] transition-all">
                      <h3 className="font-semibold mb-2 line-clamp-2">{video.title}</h3>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>👁️ {video.views?.toLocaleString() || 0} views</p>
                        <p>❤️ {video.likes?.toLocaleString() || 0} likes</p>
                        <p>💬 {video.comments_count?.toLocaleString() || 0} comments</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;
