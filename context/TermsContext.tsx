// context/TermsContext.tsx
'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useCookies, CookiesProvider as ReactCookiesProvider } from 'react-cookie';

interface TermsContextType {
  hasAcceptedTerms: boolean;
}

const TermsContext = createContext<TermsContextType>({
  hasAcceptedTerms: false,
});

export const useTerms = () => useContext(TermsContext);

// Inner provider that uses cookies
const TermsProviderInner = ({ children }: { children: ReactNode }) => {
  const [cookies] = useCookies(['terms_accepted']);
  const hasAcceptedTerms = cookies.terms_accepted === 'true';

  return (
    <TermsContext.Provider value={{ hasAcceptedTerms }}>
      {children}
    </TermsContext.Provider>
  );
};

// Outer provider that wraps with CookiesProvider
export const TermsProvider = ({ children }: { children: ReactNode }) => (
  <ReactCookiesProvider>
    <TermsProviderInner>
      {children}
    </TermsProviderInner>
  </ReactCookiesProvider>
);