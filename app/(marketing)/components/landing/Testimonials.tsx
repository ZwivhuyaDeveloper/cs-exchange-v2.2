"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Day Trader",
    avatar: "AJ",
    content: "SwapFlow has completely transformed my trading experience. The UI is intuitive, the swaps are lightning-fast, and the fees are the lowest I've found anywhere.",
  },
  {
    name: "Sarah Williams",
    role: "Portfolio Manager",
    avatar: "SW",
    content: "The analytics tools provided by SwapFlow give me insights that I couldn't get anywhere else. It's been invaluable for optimizing my portfolio's performance.",
  },
  {
    name: "Michael Chen",
    role: "Crypto Enthusiast",
    avatar: "MC",
    content: "I've tried many swap platforms, but none come close to the speed and reliability of SwapFlow. The cross-chain capabilities are a game-changer.",
  },
  {
    name: "Jessica Morgan",
    role: "Financial Advisor",
    avatar: "JM",
    content: "My clients love the transparency and security that SwapFlow provides. It's become my go-to recommendation for anyone looking to enter the crypto space.",
  },
  {
    name: "David Patel",
    role: "DeFi Developer",
    avatar: "DP",
    content: "The API is incredibly well-documented and flexible. I was able to integrate SwapFlow into my DApp with minimal effort, and my users love it.",
  },
  {
    name: "Emma Rodriguez",
    role: "Institutional Investor",
    avatar: "ER",
    content: "The enterprise features of SwapFlow meet all our compliance requirements while providing the best rates in the market. Excellent service all around.",
  },
];

export function Testimonials() {
  const [animationReady, setAnimationReady] = useState(false);

  useEffect(() => {
    setAnimationReady(true);
  }, []);

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]" />
        <div className="absolute -top-48 -right-48 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px]" />
      </div>
      
      <div className="relative w-full px-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${animationReady ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : 'opacity-0'}`}>
            What Our Users Say
          </h2>
          <p className={`text-xl text-muted-foreground ${animationReady ? 'animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150' : 'opacity-0'}`}>
            Join thousands of satisfied traders who have made SwapFlow their platform of choice.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className={cn(
                "backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-colors border-white/10",
                "overflow-hidden relative",
                animationReady ? 'animate-in fade-in slide-in-from-bottom-8 duration-700' : 'opacity-0'
              )}
              style={{ animationDelay: `${100 * index}ms` }}
            >
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-purple-500/50 mb-4" />
                <p className="text-md mb-6">{testimonial.content}</p>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarFallback className="bg-gradient-to-r from-purple-600/30 to-cyan-600/30">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                
                {/* Decorative element */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-purple-600/20 to-cyan-600/20 rounded-full blur-xl" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}