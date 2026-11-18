'use client';

import React from 'react';

export type LinkType =
  | 'github'
  | 'firebase'
  | 'supabase'
  | 'mongodb'
  | 'vercel'
  | 'live'
  | 'website'
  | 'docs'
  | 'other';

const LINK_LABELS: Record<string, string> = {
  github: 'GitHub',
  firebase: 'Firebase',
  supabase: 'Supabase',
  mongodb: 'MongoDB',
  vercel: 'Vercel',
  live: 'Live Site',
  website: 'Website',
  docs: 'Docs',
  other: 'Link',
};

export function getLinkLabel(type: string): string {
  return LINK_LABELS[type] || 'Link';
}

export function getLinkConfig(type: string) {
  return {
    label: LINK_LABELS[type] || 'Link',
    name: LINK_LABELS[type] || 'Link',
    defaultLabel: LINK_LABELS[type] || 'Link',
  };
}

interface LinkIconProps {
  type: string;
  size?: number;
  className?: string;
}

export function LinkIcon({ type, size = 15, className = '' }: LinkIconProps) {
  switch (type) {
    case 'github':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`shrink-0 ${className || 'text-zinc-300'}`}
        >
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      );
    case 'firebase':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          className={`shrink-0 ${className || 'text-amber-400'}`}
        >
          <path
            d="M3.89 15.672L6.255 1.618a.473.473 0 01.885-.156l2.482 4.634L3.89 15.672z"
            fill="currentColor"
            opacity="0.75"
          />
          <path
            d="M20.11 15.672L17.745 1.618a.473.473 0 00-.885-.156L3.89 15.672 12 20.896l8.11-5.224z"
            fill="currentColor"
          />
          <path
            d="M12 20.896l8.11-5.224L17.745 1.618a.473.473 0 00-.885-.156L12 20.896z"
            fill="currentColor"
            opacity="0.5"
          />
        </svg>
      );
    case 'supabase':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`shrink-0 ${className || 'text-emerald-400'}`}
        >
          <path
            d="M13.5 21.168c-.511.63-1.527.235-1.534-.597l-.09-10.571h8.039c1.457 0 2.267 1.677 1.35 2.796L13.5 21.168z"
            opacity="0.75"
          />
          <path d="M10.5 2.832c.511-.63 1.527-.235 1.534.597l.09 10.571H4.085c-1.457 0-2.267-1.677-1.35-2.796L10.5 2.832z" />
        </svg>
      );
    case 'mongodb':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`shrink-0 ${className || 'text-emerald-500'}`}
        >
          <path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0111.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.604-.463-.22-1.837-.422-6.241 3.688-10.912z" />
        </svg>
      );
    case 'vercel':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`shrink-0 ${className || 'text-zinc-200'}`}
        >
          <path d="M12 1L24 22H0L12 1z" />
        </svg>
      );
    case 'live':
    case 'website':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`shrink-0 ${className || 'text-sky-400'}`}
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
        </svg>
      );
    case 'docs':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`shrink-0 ${className || 'text-zinc-400'}`}
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      );
    default:
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`shrink-0 ${className || 'text-zinc-400'}`}
        >
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
        </svg>
      );
  }
}

export const LinkBrandIcon = LinkIcon;
