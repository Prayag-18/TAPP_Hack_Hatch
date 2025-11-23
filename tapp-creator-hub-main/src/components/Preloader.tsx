import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import tappLogo from '@/assets/tapp-logo.png';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader = ({ onComplete }: PreloaderProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        gsap.to('.preloader', {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.inOut',
          onComplete: () => {
            onComplete();
          },
        });
      }, 300);
    }
  }, [progress, onComplete]);

  return (
    <div className="preloader fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <img 
        src={tappLogo} 
        alt="TAPP Logo" 
        className="w-48 mb-12 animate-pulse-glow"
      />
      
      <div className="w-64 h-1 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-300 ease-out glow-blue"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <p className="mt-4 text-muted-foreground text-sm">{progress}%</p>
    </div>
  );
};

export default Preloader;
