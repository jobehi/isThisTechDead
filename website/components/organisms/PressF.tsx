'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePressFFeature } from '@/domains/respect';

interface PressFProps {
  techId: string;
  techName: string;
  onPress?: () => void;
}

/**
 * PressF component allows users to "press F to pay respects" to dead technologies.
 * Features keyboard sound effects, animation, and tracking of personal and global respects.
 *
 * @example
 * ```tsx
 * import { PressF } from '@/components/organisms';
 *
 * <PressF
 *   techId="angular-js"
 *   techName="AngularJS"
 *   onPress={() => console.log('F pressed')}
 * />
 * ```
 */
export function PressF({ techId, techName, onPress }: PressFProps) {
  // State from our domain hook
  const {
    animating: isPressing,
    isSubmitting,
    respectCount,
    handlePressF,
    isDisabled,
    rateLimited,
  } = usePressFFeature(techId, techName);

  const [personalRespects, setPersonalRespects] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [sessionClicks, setSessionClicks] = useState(0);
  const [showRateLimitMessage, setShowRateLimitMessage] = useState(false);
  const [showDisabledMessage, setShowDisabledMessage] = useState(false);

  // Snarky loading messages
  const loadingMessages = [
    'Counting digital sympathy...',
    'Quantifying developer grief...',
    'Measuring respect levels...',
    'Calculating tech mourners...',
    'Tabulating F-presses...',
    'Summoning respect statistics...',
    'Digging through the tech graveyard...',
    'Polling the developer funeral attendees...',
  ];

  // Show rate limit message when limit is reached
  useEffect(() => {
    if (rateLimited && !showRateLimitMessage) {
      setShowRateLimitMessage(true);
      const timer = setTimeout(() => {
        setShowRateLimitMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [rateLimited, showRateLimitMessage]);

  // Rotate loading messages
  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setLoadingMessageIndex(prev => (prev + 1) % loadingMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isLoading, loadingMessages.length]);

  // Load stored personal respects from localStorage
  useEffect(() => {
    // Load personal respects from localStorage
    if (typeof window !== 'undefined') {
      const storedRespects = localStorage.getItem(`respects-${techId}`);
      if (storedRespects) {
        setPersonalRespects(parseInt(storedRespects, 10));
      }
      setIsLoading(false);
    }
  }, [techId]);

  // Play key press sound
  const playSound = () => {
    if (typeof window !== 'undefined') {
      // Create audio element for mechanical keyboard sound
      const audio = new Audio('/key-press.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {});
    }
  };

  // Get random snarky message
  const getSnarkyMessage = () => {
    const messages = [
      "Seriously? Clicking won't make the tech any less dead.",
      'We get it, you have feelings about this tech.',
      'Your keyboard warranty is now void.',
      "You're really committed to this dead tech, huh?",
      "Congratulations, you've unlocked: Keyboard Abuser Badge!",
      'Your F key has filed a complaint with HR.',
      'Is this therapeutic for you?',
      "No matter how many times you press F, it won't resurrect the framework.",
      'Developer found: Excessive respect-payer.',
      'Your respect has been noted. Repeatedly.',
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  // Get rate limit message
  const getRateLimitMessage = () => {
    const messages = [
      `Whoa there! You've hit your daily limit of 10 respects for ${techName}.`,
      'Even dead tech deserves a break from your grief.',
      'Your F key needs a 24-hour cooldown. Try again tomorrow.',
      'Respect limit reached. The digital cemetery has visiting hours.',
      `You've paid your respects to ${techName} enough for one day.`,
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  // Get disabled feature message
  const getDisabledFeatureMessage = () => {
    return "We're giving you a break from griefing for now. We'll be back after midnight 👻";
  };

  // Check if either rate limited or feature is disabled
  const isButtonDisabled = rateLimited || isDisabled;
  // Memoize the handleKeyPress function to avoid recreation on each render
  const handleKeyPress = useCallback(() => {
    // If button is currently being pressed, submitting, rate limited, or feature disabled, don't process
    if (isPressing || isSubmitting || rateLimited || isDisabled) {
      if (rateLimited) {
        setShowRateLimitMessage(true);
        setTimeout(() => {
          setShowRateLimitMessage(false);
        }, 5000);
      }
      if (isDisabled) {
        setShowDisabledMessage(true);
        setTimeout(() => {
          setShowDisabledMessage(false);
        }, 5000);
      }
      return;
    }

    playSound();

    // Update locally only - no server update
    const newPersonalCount = personalRespects + 1;
    setPersonalRespects(newPersonalCount);

    // Update session clicks and check for easter egg
    const newSessionClicks = sessionClicks + 1;
    setSessionClicks(newSessionClicks);

    // Only show easter egg if we're not already showing it
    if (newSessionClicks > 10 && !showEasterEgg && Math.random() < 0.7) {
      setShowEasterEgg(true);
      setTimeout(() => {
        setShowEasterEgg(false);
      }, 4000);
    }

    // Store in localStorage (personal count only)
    if (typeof window !== 'undefined') {
      localStorage.setItem(`respects-${techId}`, newPersonalCount.toString());
    }

    // Call the domain hook's handlePressF function which handles the API call
    handlePressF();

    // Execute callback if provided
    if (onPress) onPress();
  }, [
    isPressing,
    isSubmitting,
    rateLimited,
    isDisabled,
    personalRespects,
    sessionClicks,
    showEasterEgg,
    techId,
    onPress,
    handlePressF,
  ]);

  // Add keyboard event listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger if the key pressed is 'f' or 'F'
      if (event.key.toLowerCase() === 'f') {
        // Prevent default behavior (like focusing on a form input)
        event.preventDefault();

        // Don't trigger if user is typing in an input field or textarea
        const activeElement = document.activeElement;
        const isTypingElement =
          activeElement instanceof HTMLInputElement ||
          activeElement instanceof HTMLTextAreaElement ||
          activeElement?.getAttribute('contenteditable') === 'true';

        if (!isTypingElement) {
          handleKeyPress();
        }
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyPress]);

  // Show disabled message when feature is disabled
  useEffect(() => {
    if (isDisabled && !showDisabledMessage) {
      setShowDisabledMessage(true);
      const timer = setTimeout(() => {
        setShowDisabledMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isDisabled, showDisabledMessage]);

  return (
    <div className="flex flex-col items-center mt-6 mb-10">
      <p className="text-zinc-400 text-sm mb-2">Press F to Pay Respects</p>

      <div className="relative">
        <motion.button
          className={`relative w-24 h-24 bg-[#2c2c2c] rounded-lg border-2 border-black cursor-skeleton ${isButtonDisabled ? 'opacity-70' : ''}`}
          style={{
            boxShadow: isPressing
              ? '0 1px 0 #1a1a1a, 0 1px 6px rgba(0, 0, 0, 0.4), inset 0 0 3px rgba(0, 0, 0, 0.4)'
              : '0 6px 0 #1a1a1a, 0 7px 10px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          }}
          initial={{ y: 0 }}
          animate={{ y: isPressing ? 5 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          onClick={handleKeyPress}
          whileHover={{ scale: isButtonDisabled ? 1.0 : 1.05 }}
          whileTap={{ scale: isButtonDisabled ? 1.0 : 0.95 }}
          disabled={isSubmitting || rateLimited || isDisabled}
        >
          <div
            className="absolute inset-2 rounded bg-[#333333] flex items-center justify-center"
            style={{
              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.4)',
              background: 'linear-gradient(145deg, #333333, #292929)',
            }}
          >
            <span
              className={`text-6xl font-bold font-mono ${isButtonDisabled ? 'text-gray-600' : 'text-[#41a848]'}`}
              style={{
                textShadow: '0 1px 1px rgba(0, 0, 0, 0.5)',
                transform: isPressing ? 'translateY(2px)' : 'translateY(0)',
              }}
            >
              F
            </span>
          </div>

          {/* Light reflection */}
          <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-[rgba(255,255,255,0.1)] to-transparent rounded-t-md"></div>
        </motion.button>

        <AnimatePresence>
          {showEasterEgg && !showRateLimitMessage && !showDisabledMessage && (
            <motion.div
              className="absolute left-1/2 bottom-full mb-3 w-64 -translate-x-1/2 bg-zinc-900/90 p-3 rounded-lg shadow-lg border border-zinc-700"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-sm text-zinc-300">{getSnarkyMessage()}</div>
              <div className="absolute left-1/2 bottom-0 w-3 h-3 -mb-1.5 -ml-1.5 transform rotate-45 bg-zinc-900/90 border-b border-r border-zinc-700"></div>
            </motion.div>
          )}

          {showRateLimitMessage && !showDisabledMessage && (
            <motion.div
              className="absolute left-1/2 bottom-full mb-3 w-72 -translate-x-1/2 bg-zinc-900/90 p-3 rounded-lg shadow-lg border border-amber-700/50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-sm text-amber-200">{getRateLimitMessage()}</div>
              <div className="absolute left-1/2 bottom-0 w-3 h-3 -mb-1.5 -ml-1.5 transform rotate-45 bg-zinc-900/90 border-b border-r border-amber-700/50"></div>
            </motion.div>
          )}

          {showDisabledMessage && (
            <motion.div
              className="absolute left-1/2 bottom-full mb-3 w-72 -translate-x-1/2 bg-zinc-900/90 p-3 rounded-lg shadow-lg border border-red-700/50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-sm text-red-200">{getDisabledFeatureMessage()}</div>
              <div className="absolute left-1/2 bottom-0 w-3 h-3 -mb-1.5 -ml-1.5 transform rotate-45 bg-zinc-900/90 border-b border-r border-red-700/50"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex flex-col items-center">
        {isLoading ? (
          <div className="text-zinc-500 text-sm animate-pulse">
            {loadingMessages[loadingMessageIndex]}
          </div>
        ) : (
          <>
            <div className="flex items-center text-zinc-300 mb-1">
              <span className="text-2xl font-bold">{respectCount || 0}</span>
              <span className="ml-2 text-sm text-zinc-500">total respects</span>
            </div>

            <div className="text-xs text-zinc-500 mb-1">
              {`You've paid respect ${personalRespects} ${personalRespects === 1 ? 'time' : 'times'}`}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
