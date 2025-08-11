// app/(product)/components/TokenLogo.tsx
'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface TokenLogoProps extends Omit<ImageProps, 'src' | 'alt'> {
  src?: string;
  alt: string;
  fallbackText?: string;
  size?: number;
}

export function TokenLogo({ 
  src, 
  alt, 
  fallbackText, 
  size = 32,
  className = '',
  ...props 
}: TokenLogoProps) {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {fallbackText?.substring(0, 3) || 'TKN'}
        </span>
      </div>
    );
  }

  return (
    <div 
      className={`relative flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
        {...props}
      />
    </div>
  );
}