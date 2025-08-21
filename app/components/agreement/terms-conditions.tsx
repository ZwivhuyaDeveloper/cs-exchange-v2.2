// components/agreement/terms-conditions.tsx
'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useCookies } from 'react-cookie';

// Dynamically import the modal to avoid SSR issues
const CookieConsent = dynamic(
  () => import('react-cookie-consent'),
  { ssr: false }
);

const TermsAndConditions = () => {
  const [mounted, setMounted] = useState(false);
  const [cookies, setCookie] = useCookies(['terms_accepted']);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleAccept = () => {
    // Set cookie to expire in 1 year
    setCookie('terms_accepted', 'true', {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
  };

  // Don't show if already accepted
  if (cookies.terms_accepted === 'true') return null;

  return (
    <CookieConsent
      location="bottom"
      buttonText="I Accept"
      declineButtonText="Decline"
      enableDeclineButton
      onAccept={handleAccept}
      onDecline={() => {
        // Optional: Handle decline (e.g., redirect or show limited access)
        window.location.href = '/limited-access';
      }}
      style={{
        background: 'linear-gradient(to right, #1a1a1a, #2d2d2d)',
        color: '#fff',
        padding: '20px',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.2)',
      }}
      buttonStyle={{
        background: '#00FFC2',
        color: '#000',
        fontSize: '16px',
        fontWeight: 'bold',
        padding: '10px 24px',
        borderRadius: '9999px',
        margin: '10px',
      }}
      declineButtonStyle={{
        background: 'transparent',
        color: '#fff',
        border: '1px solid #fff',
        fontSize: '16px',
        padding: '10px 24px',
        borderRadius: '9999px',
        margin: '10px',
      }}
      expires={365}
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-bold mb-2">Terms and Conditions</h2>
        <div className="max-h-[60vh] overflow-y-auto pr-4 mb-6 text-sm space-y-4">
  <div className="space-y-4">
    <h3 className="text-base font-semibold text-white">Welcome to CS Exchange</h3>
    <p className="text-gray-300 leading-relaxed">
      By accessing or using our platform, you agree to be bound by these Terms of Service and our Privacy Policy. 
      Please read them carefully before using our services.
    </p>
  </div>

  <div className="space-y-3">
    <h4 className="font-medium text-white">1. Acceptance of Terms</h4>
    <p className="text-gray-300 leading-relaxed">
      By accessing or using CS Exchange, you confirm that you accept these terms and that you agree to comply with them. 
      If you do not agree to these terms, you must not use our platform.
    </p>
  </div>

  <div className="space-y-3">
    <h4 className="font-medium text-white">2. Account Registration</h4>
    <p className="text-gray-300 leading-relaxed">
      You must be at least 18 years old to use our services. When creating an account, you agree to provide accurate 
      and complete information and to keep it updated.
    </p>
  </div>

  <div className="space-y-3">
    <h4 className="font-medium text-white">3. User Responsibilities</h4>
    <ul className="list-disc pl-5 space-y-2 text-gray-300">
      <li>Maintain the confidentiality of your account credentials</li>
      <li>Comply with all applicable laws and regulations</li>
      <li>Not engage in any fraudulent, deceptive, or illegal activities</li>
      <li>Not attempt to interfere with or disrupt our services</li>
    </ul>
  </div>

  <div className="space-y-3">
    <h4 className="font-medium text-white">4. Risk Disclosure</h4>
    <p className="text-gray-300 leading-relaxed">
      Cryptocurrency trading involves significant risk. Prices can be extremely volatile. You should carefully consider 
      whether trading is appropriate for you in light of your financial situation.
    </p>
  </div>

  <div className="space-y-3">
    <h4 className="font-medium text-white">5. Privacy & Data Protection</h4>
    <p className="text-gray-300 leading-relaxed">
      We are committed to protecting your personal information. Our Privacy Policy explains how we collect, use, 
      and share your information when you use our services.
    </p>
  </div>

  <div className="text-xs text-gray-400 border-t border-gray-700 pt-4 mt-4">
    <p>Last updated: {new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}</p>
    <p className="mt-1">
      By clicking &quot;I Accept,&quot; you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
    </p>
  </div>
</div>
      </div>
    </CookieConsent>
  );
};

export default TermsAndConditions;