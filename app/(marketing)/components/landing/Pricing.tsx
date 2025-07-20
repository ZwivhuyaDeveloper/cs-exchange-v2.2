"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const tiers = [
  {
    name: "Free",
    description: "Essential features for new crypto traders",
    price: 0,
    features: [
      "Basic swap functionality",
      "Standard market rates",
      "0.5% swap fee",
      "Basic portfolio tracking",
      "Email support",
    ],
    popular: false,
    gradientFrom: "from-gray-600",
    gradientTo: "to-gray-400",
    buttonVariant: "outline" as const,
  },
  {
    name: "Pro",
    description: "Advanced features for serious traders",
    price: 19,
    features: [
      "All Free features",
      "Priority routing for better rates",
      "0.2% swap fee",
      "Advanced portfolio analytics",
      "Priority email support",
      "Cross-chain swaps",
    ],
    popular: true,
    gradientFrom: "from-purple-600",
    gradientTo: "to-cyan-600",
    buttonVariant: "default" as const,
  },
  {
    name: "Enterprise",
    description: "Custom solutions for high-volume traders",
    price: 99,
    features: [
      "All Pro features",
      "Premium routing for best rates",
      "0.1% swap fee",
      "Comprehensive analytics dashboard",
      "Dedicated account manager",
      "Advanced API access",
      "Custom integrations",
    ],
    popular: false,
    gradientFrom: "from-cyan-600",
    gradientTo: "to-blue-800",
    buttonVariant: "outline" as const,
  },
];

export function Pricing() {
  const [animationReady, setAnimationReady] = useState(false);

  useEffect(() => {
    setAnimationReady(true);
  }, []);

  return (
    <section className="py-20 md:py-32 relative overflow-hidden" id="pricing">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        <div className="absolute top-0 left-0 -right-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
        <div className="absolute bottom-0 left-0 -right-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
      </div>
      
      <div className="relative w-full px-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${animationReady ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : 'opacity-0'}`}>
            Choose Your Plan
          </h2>
          <p className={`text-xl text-muted-foreground ${animationReady ? 'animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150' : 'opacity-0'}`}>
            Select the perfect plan for your trading needs. Upgrade or downgrade anytime.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <div 
              key={index}
              className={cn(
                "relative rounded-2xl border backdrop-blur-sm",
                "transition-all duration-300 hover:shadow-xl",
                tier.popular ? "border-purple-500/50 shadow-lg" : "border-white/10",
                animationReady ? 'animate-in fade-in slide-in-from-bottom-8 duration-700' : 'opacity-0'
              )}
              style={{ animationDelay: `${150 * index}ms` }}
            >
              {tier.popular && (
                <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 text-center py-1 text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <div className="p-8">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-muted-foreground">{tier.description}</p>
                </div>
                
                <div className="mb-8">
                  <div className="flex items-end">
                    <span className="text-5xl font-bold">${tier.price}</span>
                    {tier.price > 0 && (
                      <span className="text-lg text-muted-foreground ml-2">/month</span>
                    )}
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant={tier.buttonVariant}
                  className={cn(
                    "w-full",
                    tier.popular && "bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                  )}
                >
                  {tier.price === 0 ? "Start for Free" : "Subscribe Now"}
                </Button>
              </div>
              
              {/* Background gradient */}
              <div className={`absolute inset-0 -z-10 rounded-xl opacity-20 blur-2xl bg-gradient-to-br ${tier.gradientFrom} ${tier.gradientTo}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}