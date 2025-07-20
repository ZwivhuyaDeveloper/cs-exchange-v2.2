"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function CTA() {
  const [animationReady, setAnimationReady] = useState(false);

  useEffect(() => {
    setAnimationReady(true);
  }, []);

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-cyan-900/20" />
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/30 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/30 rounded-full blur-[100px]" />
      </div>
      
      <div className="relative w-full px-20">
        <div className="max-w-4xl mx-auto bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-2xl p-8 md:p-12 shadow-xl overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[60px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[60px]" />
          
          <div className="relative text-center space-y-6">
            <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold ${animationReady ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : 'opacity-0'}`}>
              Ready to Experience <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
                Next-Gen Crypto Trading?
              </span>
            </h2>
            
            <p className={`text-xl text-muted-foreground max-w-2xl mx-auto ${animationReady ? 'animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150' : 'opacity-0'}`}>
              Join thousands of traders already using SwapFlow to make faster, cheaper, and more secure cryptocurrency swaps.
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-4 justify-center pt-4 ${animationReady ? 'animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300' : 'opacity-0'}`}>
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
                <Link href="/dashboard/swap">
                  Start Swapping Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" asChild>
                <Link href="/pricing">
                  View Pricing Plans
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}