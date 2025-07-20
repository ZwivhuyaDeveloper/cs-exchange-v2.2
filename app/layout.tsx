
import type { Metadata } from 'next'
import "@rainbow-me/rainbowkit/styles.css";
import "@/styles/globals.css";
import { Providers } from './providers'
import { Poppins, Roboto, Open_Sans, Noto_Sans, Nunito_Sans, Manrope, Inter } from 'next/font/google'
import './globals.css';
import { SWRConfig } from 'swr'
import React from 'react';
import { ThemeProvider } from '@/context/ThemeContext';

const manrope = Manrope({
  subsets: ['latin'],
  weight: [ '200', '300', '400', '500', '600', '700', '800',],
  
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],

})

export const metadata: Metadata = {
  title: 'Cyclespace Markets',
  description: 'The Best Cross-Swap Exchange',
}

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${manrope.className} antialiased w-full `}>
        <ThemeProvider>
          <Providers >
              {children}
          </Providers>
        </ThemeProvider>  
      </body>
    </html>
  )
}

export default RootLayout;
