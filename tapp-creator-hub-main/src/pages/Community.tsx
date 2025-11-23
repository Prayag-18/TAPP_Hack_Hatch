import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, MapPin, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDiscoverCreators } from '@/hooks/useAPI';

interface Creator {
  _id: string;
  id: string;
  display_name: string;
  bio: string;
  primary_genre: string;
  region: string;
  avatar_url?: string;
  subscribers?: number;
  engagement_rate?: number;
}

const Community = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [genre, setGenre] = useState('');
  const [region, setRegion] = useState('');
  const [creators, setCreators] = useState<Creator[]>([]);
  const [sortBy, setSortBy] = useState('relevance');
  const { discover, isLoading, error } = useDiscoverCreators();

  useEffect(() => {
    // Load initial creators
    loadCreators();
  }, []);

  const loadCreators = async () => {
    try {
      const params: any = {
        skip: 0,
        limit: 20,
      };
      if (genre) params.genre = genre;
      if (region) params.region = region;
      if (sortBy) params.sort_by = sortBy;
      if (searchQuery) params.search = searchQuery; // Add search query

      console.log('Searching with params:', params);
      const result = await discover(params);
      setCreators(Array.isArray(result) ? result : result?.data || []);
    } catch (err) {
      console.error('Failed to load creators:', err);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await loadCreators();
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-light mb-6 glow-text">
            Discover Creators on TAPP
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Find and connect with talented creators across all platforms
          </p>

          <form onSubmit={handleSearch} className="max-w-4xl mx-auto space-y-4">
            <div className="glass rounded-2xl p-2 flex items-center gap-2 glow-blue">
              <Search className="ml-4 text-primary" size={24} />
              <Input
                type="text"
                placeholder="Search by name, genre, or region..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-0 text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button type="submit" className="neo-button px-8" disabled={isLoading}>
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass rounded-lg p-3">
                <label className="text-sm text-muted-foreground">Genre</label>
                <Input
                  type="text"
                  placeholder="e.g., Tech, Music, Gaming"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="mt-2 bg-transparent border-0 focus-visible:ring-0"
                />
              </div>
              <div className="glass rounded-lg p-3">
                <label className="text-sm text-muted-foreground">Region</label>
                <Input
                  type="text"
                  placeholder="e.g., USA, UK, India"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="mt-2 bg-transparent border-0 focus-visible:ring-0"
                />
              </div>
              <div className="glass rounded-lg p-3">
                <label className="text-sm text-muted-foreground">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="mt-2 w-full bg-transparent border-0 focus-visible:ring-0 text-foreground"
                >
                  <option value="relevance">Relevance</option>
                  <option value="subscribers">Subscribers</option>
                  <option value="engagement">Engagement</option>
                  <option value="compatibility">Compatibility</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-8 text-red-200">
            {error}
          </div>
        )}

        {creators.length > 0 && (
          <div className="max-w-4xl mx-auto space-y-4">
            <h2 className="text-2xl font-light mb-6">
              Results ({creators.length} creators)
            </h2>
            {creators.map((creator) => (
              <div
                key={creator.id}
                className="glass rounded-xl p-6 hover:scale-[1.02] transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-6">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-24 h-24 rounded-full flex items-center justify-center text-5xl bg-gradient-to-br from-primary/50 to-secondary/50 border-2 border-primary"
                    >
                      {creator.avatar_url ? (
                        <img
                          src={creator.avatar_url}
                          alt={creator.display_name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        '👤'
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {creator.display_name}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {creator.bio}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {creator.primary_genre && (
                        <div className="flex items-center gap-2">
                          <Music size={16} />
                          {creator.primary_genre}
                        </div>
                      )}
                      {creator.region && (
                        <div className="flex items-center gap-2">
                          <MapPin size={16} />
                          {creator.region}
                        </div>
                      )}
                      {creator.subscribers && (
                        <div className="flex items-center gap-2">
                          <TrendingUp size={16} />
                          {creator.subscribers.toLocaleString()} subscribers
                        </div>
                      )}
                      {creator.engagement_rate && (
                        <div className="flex items-center gap-2">
                          📊 {creator.engagement_rate.toFixed(2)}% engagement
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex-shrink-0">
                    <Button
                      className="neo-button"
                      onClick={() => navigate(`/profile/${creator._id}`)}
                    >
                      View Profile
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && creators.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No creators found. Try adjusting your search filters.
            </p>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
            <p className="text-muted-foreground mt-4">Loading creators...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;
