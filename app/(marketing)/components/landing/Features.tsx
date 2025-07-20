"use client";

import { useEffect, useState } from 'react';
import { CheckCircle, Zap, Shield, BarChart4, Globe, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    title: "Lightning Fast Swaps",
    description: "Execute trades in milliseconds with our optimized routing engines that find the best prices across multiple liquidity sources.",
    icon: Zap,
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    title: "Maximum Security",
    description: "Non-custodial architecture ensures your funds remain in your control at all times while providing industry-leading protection.",
    icon: Shield,
    gradient: "from-green-500 to-emerald-500",
  },
  {
    title: "Advanced Analytics",
    description: "Detailed insights into your trading history, portfolio performance, and market trends to make informed decisions.",
    icon: BarChart4,
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    title: "Global Coverage",
    description: "Support for hundreds of tokens across multiple blockchains with seamless cross-chain swapping capabilities.",
    icon: Globe,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Lowest Fees",
    description: "Save on every trade with our competitive fee structure and special rates for premium users.",
    icon: DollarSign,
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    title: "Guaranteed Success",
    description: "Smart order routing ensures your trades execute successfully even in volatile market conditions.",
    icon: CheckCircle,
    gradient: "from-red-500 to-pink-500",
  },
];

export function Features() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [animationReady, setAnimationReady] = useState(false);

  useEffect(() => {
    setAnimationReady(true);
    
    // Auto-rotate feature highlight
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 md:py-32 relative overflow-hidden" id="features">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>
      
      <div className="w-full relative px-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${animationReady ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : 'opacity-0'}`}>
            Advanced Features for Modern Traders
          </h2>
          <p className={`text-xl text-muted-foreground ${animationReady ? 'animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150' : 'opacity-0'}`}>
            Our platform combines cutting-edge technology with an intuitive interface to provide the best trading experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={cn(
                "relative group p-6 rounded-xl transition-all duration-300",
                "bg-white/[0.02] border border-white/10 backdrop-blur-sm hover:bg-white/[0.05]",
                {
                  "ring-2 ring-purple-500/50 shadow-lg": activeFeature === index,
                }
              )}
              style={{
                animationDelay: `${150 * index}ms`,
              }}
              onMouseEnter={() => setActiveFeature(index)}
              onClick={() => setActiveFeature(index)}
            >
              <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${feature.gradient} blur-[80px] -z-10`} />
              
              <div className={`inline-flex items-center justify-center rounded-xl p-2 mb-4 bg-gradient-to-br ${feature.gradient} bg-opacity-10`}>
                <feature.icon className="h-6 w-6" />
              </div>
              
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}