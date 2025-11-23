import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, Users, Shield, Zap, Heart } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-7xl md:text-8xl font-light mb-6 glow-text">
            Welcome to TAPP
          </h1>
          <p className="text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto">
            The Creator & Brand Collaboration Platform
          </p>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Connect creators with brands, fund innovative projects, and unlock data-driven insights—all in one privacy-first platform.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              onClick={() => navigate('/login')}
              className="neo-button px-8 py-6 text-lg"
            >
              Get Started
            </Button>
            <Button
              onClick={() => navigate('/community')}
              variant="outline"
              className="px-8 py-6 text-lg border-primary/50 hover:bg-primary/10"
            >
              Explore Creators
            </Button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-light text-center mb-16 glow-text">
            Why Choose TAPP?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass rounded-xl p-8 hover:scale-105 transition-transform">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Sparkles className="text-primary" size={24} />
              </div>
              <h3 className="text-2xl font-light mb-3">AI-Powered Insights</h3>
              <p className="text-muted-foreground">
                Analyze audience sentiment, extract themes, and get content suggestions powered by advanced AI.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass rounded-xl p-8 hover:scale-105 transition-transform">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                <TrendingUp className="text-secondary" size={24} />
              </div>
              <h3 className="text-2xl font-light mb-3">Project Crowdfunding</h3>
              <p className="text-muted-foreground">
                Launch creative projects and get funded by your audience. Share revenue with your supporters.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass rounded-xl p-8 hover:scale-105 transition-transform">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <Users className="text-accent" size={24} />
              </div>
              <h3 className="text-2xl font-light mb-3">Creator Discovery</h3>
              <p className="text-muted-foreground">
                Find the perfect creators for your brand with advanced filters and compatibility scoring.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass rounded-xl p-8 hover:scale-105 transition-transform">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Shield className="text-primary" size={24} />
              </div>
              <h3 className="text-2xl font-light mb-3">Privacy First</h3>
              <p className="text-muted-foreground">
                Your data stays yours. We process insights without storing raw content or personal information.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="glass rounded-xl p-8 hover:scale-105 transition-transform">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                <Zap className="text-secondary" size={24} />
              </div>
              <h3 className="text-2xl font-light mb-3">Real-Time Analytics</h3>
              <p className="text-muted-foreground">
                Track channel performance, video metrics, and audience engagement in real-time.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="glass rounded-xl p-8 hover:scale-105 transition-transform">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <Heart className="text-accent" size={24} />
              </div>
              <h3 className="text-2xl font-light mb-3">Community Driven</h3>
              <p className="text-muted-foreground">
                Built for creators, by creators. Join a thriving community of content makers and supporters.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-5xl font-light text-primary mb-2">1000+</p>
              <p className="text-muted-foreground">Active Creators</p>
            </div>
            <div>
              <p className="text-5xl font-light text-secondary mb-2">₹2M+</p>
              <p className="text-muted-foreground">Projects Funded</p>
            </div>
            <div>
              <p className="text-5xl font-light text-accent mb-2">500+</p>
              <p className="text-muted-foreground">Brand Partnerships</p>
            </div>
            <div>
              <p className="text-5xl font-light text-primary mb-2">95%</p>
              <p className="text-muted-foreground">Success Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-light mb-6 glow-text">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of creators and brands already using TAPP to collaborate, create, and grow.
          </p>
          <Button
            onClick={() => navigate('/login')}
            className="neo-button px-12 py-6 text-xl"
          >
            Join TAPP Today
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
