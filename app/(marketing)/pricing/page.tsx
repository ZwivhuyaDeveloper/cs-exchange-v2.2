import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Pricing | AlphaChain Signals Plans & Subscription Costs',
  description: 'Compare AlphaChain Signals pricing plans. Choose from Free, Pro, or Institutional to access AI-powered crypto signals, advanced analytics, and premium trading tools. 7-day free trial available.',
  keywords: 'crypto pricing, trading plans, subscription, AlphaChain cost, pro plan, institutional trading, free trial, crypto analytics',
  openGraph: {
    title: 'Pricing | AlphaChain Signals Plans & Subscription Costs',
    description: 'Compare AlphaChain Signals pricing plans. Choose from Free, Pro, or Institutional to access AI-powered crypto signals, advanced analytics, and premium trading tools. 7-day free trial available.',
    url: 'https://alphachain.com/pricing',
    type: 'website',
    images: [
      {
        url: '/Cyclespace-logo/CS-logo-black-2.png',
        width: 1200,
        height: 630,
        alt: 'AlphaChain Pricing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing | AlphaChain Signals Plans & Subscription Costs',
    description: 'Compare AlphaChain Signals pricing plans. Choose from Free, Pro, or Institutional to access AI-powered crypto signals, advanced analytics, and premium trading tools. 7-day free trial available.',
    images: ['/Cyclespace-logo/CS-logo-black-2.png'],
    site: '@AlphaChain',
  },
  alternates: {
    canonical: 'https://alphachain.com/pricing',
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
};

import Footer from "@/app/(marketing)/components/layout/Footer";
import Header from "@/app/(marketing)/components/layout/Header";
import PricingComparison from "@/app/(marketing)/pricing/components/PricingComparison";
import PricingFAQ from "@/app/(marketing)/pricing/components/PricingFAQ";
import PricingHero from "@/app/(marketing)/pricing/components/PricingHero";
import PricingPlans from "@/app/(marketing)/pricing/components/PricingPlans";
import PricingTestimonials from "@/app/(marketing)/pricing/components/PricingTestimonials";


export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0A0E17] text-white">
      <Header />
      <main>
        <PricingHero />
        <PricingPlans />
        <PricingComparison />
        <PricingTestimonials />
        <PricingFAQ />
        <Script id="ld-json-faq" type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Can I change plans at any time?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any billing adjustments.'
                }
              },
              {
                '@type': 'Question',
                name: 'What payment methods do you accept?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and cryptocurrency payments (Bitcoin, Ethereum, USDC).'
                }
              },
              {
                '@type': 'Question',
                name: 'Is there a free trial for paid plans?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes! Both Pro and Institutional plans come with a 7-day free trial. No credit card required to start, and you can cancel anytime during the trial period.'
                }
              },
              {
                '@type': 'Question',
                name: 'What happens if I cancel my subscription?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'You can cancel anytime with no penalties. You\'ll retain access to your plan features until the end of your current billing period. Your data is preserved for 30 days in case you want to reactivate.'
                }
              },
              {
                '@type': 'Question',
                name: 'Do you offer refunds?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'We offer a 7-day money-back guarantee on all paid plans. If you\'re not satisfied within the first 7 days, we\'ll provide a full refund, no questions asked.'
                }
              },
              {
                '@type': 'Question',
                name: 'How accurate are your trading signals?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Our premium signals maintain a 90% accuracy rate based on 30-day rolling performance. All signals are verified by our team of 8+ expert analysts before being sent to users.'
                }
              },
              {
                '@type': 'Question',
                name: 'Can I use the API with the Pro plan?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'API access is only available with the Institutional plan. This includes full REST API, WebSocket feeds, and webhook integrations for automated trading systems.'
                }
              },
              {
                '@type': 'Question',
                name: 'Do you provide customer support?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes! Free users get email support, Pro users get priority email support, and Institutional users get phone support plus a dedicated account manager.'
                }
              },
              {
                '@type': 'Question',
                name: 'Is my data secure?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Absolutely. We use 256-bit SSL encryption, SOC 2 Type II compliance, and never store your exchange API keys or trading credentials. Your data is fully protected.'
                }
              },
              {
                '@type': 'Question',
                name: 'Can I get a custom enterprise solution?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes! We offer custom solutions for hedge funds, trading firms, and large institutions. This includes white-label options, dedicated infrastructure, and custom integrations. Contact our sales team for details.'
                }
              }
            ]
          })}
        </Script>
        <Script id="ld-json-products" type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Product',
                name: 'AlphaChain Free Plan',
                description: 'Perfect for getting started. Basic crypto news feed, community trading signals, email alerts, and more.',
                brand: { '@type': 'Brand', name: 'AlphaChain' },
                offers: {
                  '@type': 'Offer',
                  price: 0,
                  priceCurrency: 'USD',
                  availability: 'https://schema.org/InStock',
                  url: 'https://alphachain.com/onboarding?plan=free',
                },
              },
              {
                '@type': 'Product',
                name: 'AlphaChain Pro Plan',
                description: 'Best for active traders. Premium trading signals, real-time news alerts, advanced analytics, and more.',
                brand: { '@type': 'Brand', name: 'AlphaChain' },
                offers: {
                  '@type': 'Offer',
                  price: 29,
                  priceCurrency: 'USD',
                  availability: 'https://schema.org/InStock',
                  url: 'https://alphachain.com/onboarding?plan=pro',
                },
              },
              {
                '@type': 'Product',
                name: 'AlphaChain Institutional Plan',
                description: 'For serious investors & funds. Advanced research terminal, full API access, custom integrations, and more.',
                brand: { '@type': 'Brand', name: 'AlphaChain' },
                offers: {
                  '@type': 'Offer',
                  price: 99,
                  priceCurrency: 'USD',
                  availability: 'https://schema.org/InStock',
                  url: 'https://alphachain.com/onboarding?plan=institutional',
                },
              },
            ],
          })}
        </Script>
      </main>
      <Footer />
    </div>
  );
}