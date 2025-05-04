'use client';

import React, { useState, ReactNode } from 'react';

interface ExternalLinkDialogProps {
  href: string;
  children: ReactNode;
  className?: string;
  platform?: 'reddit' | 'hackernews' | 'youtube' | 'github' | 'other';
}

export function ExternalLinkDialog({
  href,
  children,
  className = '',
  platform = 'other',
}: ExternalLinkDialogProps) {
  const [showDialog, setShowDialog] = useState(false);

  const getPlatformInfo = () => {
    switch (platform) {
      case 'reddit':
        return {
          name: 'Reddit',
          color: 'text-orange-400',
          icon: '💬',
          quip: 'Where reasonable discussions go to die.',
        };
      case 'hackernews':
        return {
          name: 'Hacker News',
          color: 'text-orange-500',
          icon: '🔸',
          quip: 'Where everyone is an expert, especially when they are not.',
        };
      case 'youtube':
        return {
          name: 'YouTube',
          color: 'text-red-500',
          icon: '🎬',
          quip: "Home of 10:01 videos and Don't forget to like and subscribe!",
        };
      case 'github':
        return {
          name: 'GitHub',
          color: 'text-white',
          icon: '🐙',
          quip: 'Where your PR will be reviewed... eventually.',
        };
      default:
        return {
          name: 'an external site',
          color: 'text-blue-400',
          icon: '🌐',
          quip: 'Yet another rabbit hole to disappear into.',
        };
    }
  };

  const { name, color, icon, quip } = getPlatformInfo();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setShowDialog(true);
  };

  const handleConfirm = () => {
    window.open(href, '_blank', 'noopener,noreferrer');
    setShowDialog(false);
  };

  const handleCancel = () => {
    setShowDialog(false);
  };

  return (
    <>
      <a href={href} onClick={handleClick} className={className} rel="noopener noreferrer">
        {children}
      </a>

      {showDialog && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center mb-4">
              <span className="text-xl mr-2">{icon}</span>
              <h3 className={`text-xl font-bold ${color}`}>Off to {name}?</h3>
            </div>

            <p className="text-zinc-300 mb-3">
              You&apos;re about to escape the comfort of Is This Tech Dead? for {name}.
              <span className="italic text-zinc-400 ml-1">{quip}</span>
            </p>

            <div className="text-xs text-zinc-500 mb-5 bg-black/30 p-3 rounded border-l-2 border-zinc-700">
              Fun fact: People who visit {name} are 73% more likely to procrastinate on actual work.
              That&apos;s a made-up statistic, but you know it&apos;s true.
            </div>

            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded transition-colors"
                onClick={handleCancel}
              >
                Stay Safe Here
              </button>
              <button
                className="px-4 py-2 bg-lime-700 hover:bg-lime-600 text-white rounded transition-colors"
                onClick={handleConfirm}
              >
                Risk It All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
