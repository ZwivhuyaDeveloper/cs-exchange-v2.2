
import type { Metadata } from 'next'
import "@rainbow-me/rainbowkit/styles.css";
import "@/styles/globals.css";
import { Providers } from './providers'
import { Roboto, Manrope, Inter } from 'next/font/google'
import './globals.css';
import React from 'react';
import {
  ClerkProvider
} from '@clerk/nextjs'
import { ThemeProvider } from '@/context/ThemeContext';
import { TermsProvider } from '@/context/TermsContext';
import TermsAndConditions from './components/agreement/terms-conditions';

const manrope = Manrope({
  subsets: ['latin'],
  weight: [ '200', '300', '400', '500', '600', '700', '800',],
  
})

export const metadata: Metadata = {
  title: 'Cyclespace Markets',
  description: 'The Best Cross-Swap Exchange',
}

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider >
      <html lang="en">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body className={`${manrope.className} antialiased w-full `}>
          <ThemeProvider>
            <TermsProvider>
              <Providers >
                  {children}
              </Providers>
              <TermsAndConditions/>
            </TermsProvider>
          </ThemeProvider>  
        </body>
      </html>
    </ClerkProvider>
  )
}

export default RootLayout;
