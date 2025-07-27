'use client';

import { ReactNode } from 'react';
import { UserAccess, ContentAccess, checkAccess, getContentAccessLevel } from '@/app/lib/access-control';
import AccessGate from './AccessGate';

interface ContentWrapperProps {
  children: ReactNode;
  userAccess: UserAccess;
  content: {
    accessLevel: 'public' | 'premium' | 'pro' | 'analyst' | 'admin';
    [key: string]: any; // Allow additional properties
  };
  title?: string;
  description?: string;
  showPreview?: boolean;
  className?: string;
}

export default function ContentWrapper({
  children,
  userAccess,
  content,
  title,
  description,
  showPreview = false,
  className = '',
}: ContentWrapperProps) {
  const contentAccess = getContentAccessLevel(content);
  const accessResult = checkAccess(userAccess, contentAccess);

  return (
    <AccessGate
      userAccess={userAccess}
      contentAccess={contentAccess}
      accessResult={accessResult}
      title={title}
      description={description}
      showPreview={showPreview}
      className={className}
    >
      {children}
    </AccessGate>
  );
}
