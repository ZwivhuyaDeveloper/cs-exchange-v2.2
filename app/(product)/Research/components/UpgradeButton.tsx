'use client';

import { PaymentButton } from '@/app/components/PaymentButton';

export function UpgradeButton() {
  return (
    <PaymentButton 
      variant="default"
      size="lg"
      buttonText="Unlock Premium Research ($49/month)"
      loadingText="Processing your subscription..."
      successText="Access granted! Loading your research..."
      className="w-full sm:w-auto px-8 py-3 text-lg bg-transparent dark:text-green-950 text-white font-semibold"
      onSuccess={() => {
        // Page will refresh automatically after successful payment
      }}
      onError={(error) => {
        console.error('Payment error:', error);
      }}
    />
  );
}
