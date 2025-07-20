"use client";

import { useEffect, useState } from 'react';
import { Wallet, Repeat, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

const steps = [
  {
    title: "Connect Your Wallet",
    description: "Link your favorite crypto wallet to access your funds. We support MetaMask, WalletConnect, Coinbase Wallet, and more.",
    icon: Wallet,
  },
  {
    title: "Choose Your Tokens",
    description: "Select the tokens you want to swap from and to. Our platform supports hundreds of tokens across multiple blockchains.",
    icon: Repeat,
  },
  {
    title: "Execute the Swap",
    description: "Confirm the transaction in your wallet and our system will execute the swap at the best available rate instantly.",
    icon: ArrowUpRight,
  },
];

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const [animationReady, setAnimationReady] = useState(false);

  useEffect(() => {
    setAnimationReady(true);
    
    // Auto-rotate steps
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 md:py-32 relative overflow-hidden ">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-purple-500/30 rounded-full blur-[80px]" />
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-cyan-500/30 rounded-full blur-[80px]" />
      </div>
      
      <div className="relative w-full px-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${animationReady ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : 'opacity-0'}`}>
            How SwapFlow Works
          </h2>
          <p className={`text-xl text-muted-foreground ${animationReady ? 'animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150' : 'opacity-0'}`}>
            Swapping crypto has never been easier. Complete your first trade in minutes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`flex gap-4 p-6 rounded-xl border transition-all duration-500 cursor-pointer ${
                  activeStep === index 
                    ? "border-purple-500/50 bg-white/[0.03] shadow-lg" 
                    : "border-white/10 hover:border-white/20"
                }`}
                onClick={() => setActiveStep(index)}
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
                  activeStep === index 
                    ? "bg-gradient-to-r from-purple-600 to-cyan-600" 
                    : "bg-white/5"
                }`}>
                  <step.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Interactive illustration */}
          <div className="relative h-[500px] rounded-2xl p-1 border border-white/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 backdrop-blur-sm rounded-2xl" />
            <div className="absolute inset-0 bg-grid-white/[0.02]" />
            
            <div className="relative h-full rounded-xl overflow-hidden flex items-center justify-center">
              {/* Step 1 - Connect Wallet */}
              <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${activeStep === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 max-w-md">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-white/10 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                      <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-2">
                        <span className="text-blue-500 font-bold">M</span>
                      </div>
                      <span className="text-sm">MetaMask</span>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                      <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-2">
                        <span className="text-blue-500 font-bold">WC</span>
                      </div>
                      <span className="text-sm">WalletConnect</span>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                      <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-2">
                        <span className="text-blue-500 font-bold">CB</span>
                      </div>
                      <span className="text-sm">Coinbase</span>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                      <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-2">
                        <span className="text-blue-500 font-bold">P</span>
                      </div>
                      <span className="text-sm">Phantom</span>
                    </div>
                  </div>
                  <p className="text-sm text-center text-muted-foreground">
                    Select a wallet to connect to SwapFlow
                  </p>
                </div>
              </div>
              
              {/* Step 2 - Choose Tokens */}
              <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${activeStep === 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 w-full max-w-md">
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <p className="text-sm font-medium">You Pay</p>
                        <p className="text-sm text-muted-foreground">Balance: 1.25 ETH</p>
                      </div>
                      <div className="flex items-center p-4 bg-white/10 rounded-lg border border-white/10 mb-2">
                        <div className="mr-3">
                          <div className="h-8 w-8 bg-cyan-500/20 rounded-full flex items-center justify-center">
                            <span className="text-cyan-500 text-xs font-bold">ETH</span>
                          </div>
                        </div>
                        <input 
                          type="text" 
                          value="1.0" 
                          readOnly
                          className="bg-transparent border-none text-xl focus:outline-none flex-grow" 
                        />
                        <span className="text-sm text-muted-foreground">≈ $3,456</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        <div className="bg-white/5 rounded p-2 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
                          <div className="h-6 w-6 bg-cyan-500/20 rounded-full flex items-center justify-center">
                            <span className="text-cyan-500 text-[10px] font-bold">ETH</span>
                          </div>
                        </div>
                        <div className="bg-white/5 rounded p-2 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
                          <div className="h-6 w-6 bg-yellow-500/20 rounded-full flex items-center justify-center">
                            <span className="text-yellow-500 text-[10px] font-bold">BTC</span>
                          </div>
                        </div>
                        <div className="bg-white/5 rounded p-2 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
                          <div className="h-6 w-6 bg-green-500/20 rounded-full flex items-center justify-center">
                            <span className="text-green-500 text-[10px] font-bold">USDC</span>
                          </div>
                        </div>
                        <div className="bg-white/5 rounded p-2 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
                          <div className="h-6 w-6 bg-purple-500/20 rounded-full flex items-center justify-center">
                            <span className="text-purple-500 text-[10px] font-bold">SOL</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      <div className="bg-white/10 backdrop-blur-sm p-2 rounded-full border border-white/10">
                        <Repeat className="h-5 w-5" />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <p className="text-sm font-medium">You Receive</p>
                        <p className="text-sm text-muted-foreground">Balance: 0 BTC</p>
                      </div>
                      <div className="flex items-center p-4 bg-white/10 rounded-lg border border-white/10 mb-2">
                        <div className="mr-3">
                          <div className="h-8 w-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                            <span className="text-yellow-500 text-xs font-bold">BTC</span>
                          </div>
                        </div>
                        <input 
                          type="text" 
                          value="0.05232"
                          readOnly 
                          className="bg-transparent border-none text-xl focus:outline-none flex-grow" 
                        />
                        <span className="text-sm text-muted-foreground">≈ $3,421</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        <div className="bg-white/5 rounded p-2 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
                          <div className="h-6 w-6 bg-yellow-500/20 rounded-full flex items-center justify-center">
                            <span className="text-yellow-500 text-[10px] font-bold">BTC</span>
                          </div>
                        </div>
                        <div className="bg-white/5 rounded p-2 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
                          <div className="h-6 w-6 bg-green-500/20 rounded-full flex items-center justify-center">
                            <span className="text-green-500 text-[10px] font-bold">USDC</span>
                          </div>
                        </div>
                        <div className="bg-white/5 rounded p-2 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
                          <div className="h-6 w-6 bg-pink-500/20 rounded-full flex items-center justify-center">
                            <span className="text-pink-500 text-[10px] font-bold">AVAX</span>
                          </div>
                        </div>
                        <div className="bg-white/5 rounded p-2 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
                          <div className="h-6 w-6 bg-gray-500/20 rounded-full flex items-center justify-center">
                            <span className="text-gray-500 text-[10px] font-bold">+50</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Step 3 - Execute the Swap */}
              <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${activeStep === 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 w-full max-w-md">
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-4">
                        <div className="h-12 w-12 bg-cyan-500/20 rounded-full flex items-center justify-center">
                          <span className="text-cyan-500 text-sm font-bold">ETH</span>
                        </div>
                        <div className="mx-2">
                          <ArrowUpRight className="h-6 w-6" />
                        </div>
                        <div className="h-12 w-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                          <span className="text-yellow-500 text-sm font-bold">BTC</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold mb-1">Swapping 1.0 ETH to 0.05232 BTC</h3>
                      <p className="text-muted-foreground mb-6">Estimated value: $3,421.00</p>
                      
                      <div className="space-y-2 mb-6">
                        <div className="flex justify-between py-2 border-b border-white/5">
                          <span className="text-muted-foreground">Exchange Rate</span>
                          <span>1 ETH = 0.05232 BTC</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-white/5">
                          <span className="text-muted-foreground">Network Fee</span>
                          <span>0.0005 ETH ($1.73)</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">SwapFlow Fee</span>
                          <span>0.1% ($3.45)</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <button className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 py-3 rounded-lg font-medium">
                          Confirm Swap
                        </button>
                        <button className="w-full bg-white/5 hover:bg-white/10 py-3 rounded-lg font-medium">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}