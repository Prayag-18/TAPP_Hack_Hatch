import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { MessageSquare, Sparkles, Loader2 } from 'lucide-react';
import { useAIInsights } from '@/hooks/useAPI';

const demographicsData = [
  { name: '18-24', value: 30 },
  { name: '25-34', value: 45 },
  { name: '35-44', value: 15 },
  { name: '45+', value: 10 },
];

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--neon-pink))'];

const Feedback = () => {
  const [isAiMode, setIsAiMode] = useState(false);
  const [filterType, setFilterType] = useState('popular');
  const [prompt, setPrompt] = useState('');
  const [videos, setVideos] = useState<any[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobResult, setJobResult] = useState<any>(null);
  const [isPolling, setIsPolling] = useState(false);

  const { createJob, getJobStatus, isLoading, error } = useAIInsights();

  useEffect(() => {
    loadVideos();
  }, []);

  useEffect(() => {
    if (jobId && isPolling) {
      const interval = setInterval(async () => {
        try {
          const job = await getJobStatus(jobId);
          if (job.status === 'COMPLETED') {
            setJobResult(job.result);
            setIsPolling(false);
          } else if (job.status === 'FAILED') {
            setIsPolling(false);
            alert('AI job failed');
          }
        } catch (err) {
          console.error('Failed to poll job:', err);
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [jobId, isPolling]);

  const loadVideos = async () => {
    try {
      const response = await fetch('http://localhost:8000/ai/available-videos', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setVideos(data.videos || []);
      }
    } catch (err) {
      console.error('Failed to load videos:', err);
    }
  };

  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      alert('Please enter a question');
      return;
    }

    try {
      const job = await createJob({
        query: prompt,
        selection_mode: 'AUTO_TOP_N',
        video_ids: selectedVideos.length > 0 ? selectedVideos : undefined,
        top_n: 5
      });

      setJobId(job._id);
      setIsPolling(true);
      setJobResult(null);
      alert('AI analysis started! Results will appear below...');
    } catch (err) {
      console.error('Failed to create AI job:', err);
      alert('Failed to start AI analysis');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-5xl font-light glow-text">Feedback & Intelligence Hub</h1>

          <div className="flex items-center gap-4 glass rounded-full px-6 py-3">
            <span className={!isAiMode ? 'text-primary font-medium' : 'text-muted-foreground'}>
              Analytics
            </span>
            <Switch checked={isAiMode} onCheckedChange={setIsAiMode} />
            <span className={isAiMode ? 'text-secondary font-medium' : 'text-muted-foreground'}>
              AI Assistant
            </span>
          </div>
        </div>

        {!isAiMode ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass rounded-xl p-6">
              <h2 className="text-2xl font-light mb-6">Audience Demographics</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={demographicsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {demographicsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="glass rounded-xl p-6">
              <h2 className="text-2xl font-light mb-6">Engagement Trends</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={[
                  { day: 'Mon', engagement: 65 },
                  { day: 'Tue', engagement: 72 },
                  { day: 'Wed', engagement: 68 },
                  { day: 'Thu', engagement: 80 },
                  { day: 'Fri', engagement: 85 },
                  { day: 'Sat', engagement: 90 },
                  { day: 'Sun', engagement: 78 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))'
                    }}
                  />
                  <Line type="monotone" dataKey="engagement" stroke="hsl(var(--accent))" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-glow">
            <form onSubmit={handlePromptSubmit} className="glass rounded-2xl p-6">
              <h2 className="text-2xl font-light mb-4 flex items-center gap-2">
                <Sparkles className="text-secondary" />
                AI Content Analysis
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Question</label>
                  <Input
                    type="text"
                    placeholder="e.g., 'Why did my last 3 videos underperform?' or 'What content do viewers want?'"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="bg-muted/50 border-border"
                  />
                </div>

                {videos.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Videos (optional)</label>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                      {videos.map((video) => (
                        <label key={video.id} className="flex items-center gap-2 p-2 bg-muted/30 rounded cursor-pointer hover:bg-muted/50">
                          <input
                            type="checkbox"
                            checked={selectedVideos.includes(video.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedVideos([...selectedVideos, video.id]);
                              } else {
                                setSelectedVideos(selectedVideos.filter(id => id !== video.id));
                              }
                            }}
                          />
                          <span className="text-sm truncate">{video.title}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <Button type="submit" className="neo-button w-full" disabled={isLoading || isPolling}>
                  {isLoading || isPolling ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isPolling ? 'Analyzing...' : 'Starting...'}
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Analyze with AI
                    </>
                  )}
                </Button>
              </div>
            </form>

            {jobResult && (
              <div className="glass rounded-xl p-6">
                <h2 className="text-2xl font-light mb-6 flex items-center gap-2">
                  <MessageSquare className="text-primary" />
                  AI Analysis Results
                </h2>

                <div className="space-y-6">
                  {jobResult.sentiment && (
                    <div>
                      <h3 className="text-lg font-medium mb-3">Sentiment Analysis</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-green-500/20 rounded-lg p-4 text-center">
                          <p className="text-2xl font-bold text-green-400">{jobResult.sentiment.positive}%</p>
                          <p className="text-sm text-muted-foreground">Positive</p>
                        </div>
                        <div className="bg-blue-500/20 rounded-lg p-4 text-center">
                          <p className="text-2xl font-bold text-blue-400">{jobResult.sentiment.neutral}%</p>
                          <p className="text-sm text-muted-foreground">Neutral</p>
                        </div>
                        <div className="bg-red-500/20 rounded-lg p-4 text-center">
                          <p className="text-2xl font-bold text-red-400">{jobResult.sentiment.negative}%</p>
                          <p className="text-sm text-muted-foreground">Negative</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {jobResult.themes && jobResult.themes.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-3">Key Themes</h3>
                      <div className="flex flex-wrap gap-2">
                        {jobResult.themes.map((theme: string, idx: number) => (
                          <span key={idx} className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm">
                            {theme}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {jobResult.summary && (
                    <div>
                      <h3 className="text-lg font-medium mb-3">Summary</h3>
                      <p className="text-muted-foreground bg-muted/30 p-4 rounded-lg">
                        {jobResult.summary}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-200">
                {error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;
