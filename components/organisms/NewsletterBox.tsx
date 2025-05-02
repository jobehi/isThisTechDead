'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import config from '@/lib/config';

/**
 * NewsletterBox component displays a subscription form for the tech death alerts newsletter.
 * Features animated effects, validation, and humorous success/error messages.
 *
 * @example
 * ```tsx
 * import { NewsletterBox } from '@/components/organisms';
 *
 * <NewsletterBox />
 * ```
 */
export function NewsletterBox() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);

  // Random glitch animation on hover
  const [glitchInterval, setGlitchInterval] = useState<NodeJS.Timeout | null>(null);
  const [glitchText, setGlitchText] = useState('');

  useEffect(() => {
    if (isHovered && !glitchInterval) {
      const interval = setInterval(() => {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890!@#$%^&*()_+';
        const randomStr = Array(3)
          .fill(0)
          .map(() => letters[Math.floor(Math.random() * letters.length)])
          .join('');
        setGlitchText(randomStr);
      }, 100);
      setGlitchInterval(interval);
    } else if (!isHovered && glitchInterval) {
      clearInterval(glitchInterval);
      setGlitchInterval(null);
      setGlitchText('');
    }

    return () => {
      if (glitchInterval) clearInterval(glitchInterval);
    };
  }, [isHovered, glitchInterval]);

  // Sanitize email input - BUT allow all valid email characters
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Modern approach: use the browser's built-in email validation
    // but don't restrict user input with aggressive sanitization
    // Valid email local part can include: + % ! # $ & ' * = ? ^ ` { | } ~ and more
    setEmail(e.target.value);
  };

  // Validate email format without being overly restrictive
  const isValidEmail = (email: string): boolean => {
    // Simple check for @ and . without restricting valid characters
    return email.includes('@') && email.includes('.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Basic email validation
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Rate limiting - prevent rapid submissions (3 second cooldown)
    const now = Date.now();
    if (now - lastSubmitTime < 3000) {
      setError('Please wait a moment before trying again.');
      return;
    }
    setLastSubmitTime(now);

    // Get the form element
    const form = e.target as HTMLFormElement;

    setLoading(true);
    setError(null);

    try {
      // Check for honeypot fields (if filled, silently "succeed" but don't submit)
      const honeypotField = form.elements.namedItem('contact_me_by_fax_please') as HTMLInputElement;
      if (honeypotField && honeypotField.value) {
        // Simulate success but don't actually submit
        setTimeout(() => {
          setSubmitted(true);
          setLoading(false);
        }, 1000);
        return;
      }

      // Using FormData to submit the form
      const formData = new FormData(form);

      // Using the correct Buttondown endpoint as per documentation
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        // Try to get error details
        let errorMessage = 'Something went wrong. Just like your favorite framework.';
        let isDuplicateEmail = false;

        try {
          // Check the response format
          const contentType = response.headers.get('content-type');

          // Parse JSON responses
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            errorMessage = data.message || errorMessage;

            // Check for duplicate email in response
            if (
              data.detail &&
              typeof data.detail === 'string' &&
              data.detail.toLowerCase().includes('already exists')
            ) {
              isDuplicateEmail = true;
            }
          }
          // Parse text/html responses
          else {
            const text = await response.text();
            if (config.isDevelopment) {
              console.error('Error response:', text.substring(0, 150));
            }

            // Check for duplicate email in HTML response
            if (
              text.toLowerCase().includes('already exists') ||
              text.toLowerCase().includes('already subscribed')
            ) {
              isDuplicateEmail = true;
            }
          }

          // Set custom message for duplicate emails
          if (isDuplicateEmail) {
            errorMessage = "You're already dead to us. Just kidding. You're already subscribed.";
          }
        } catch (parseError) {
          if (config.isDevelopment) {
            console.error('Error parsing response:', parseError);
          }
        }

        setError(errorMessage);
      }
    } catch (err) {
      if (config.isDevelopment) {
        console.error('Submission failed:', err);
      }
      setError('Failed to subscribe. The server is as dead as CoffeeScript.');
    } finally {
      setLoading(false);
    }
  };

  // A selection of brutally honest success messages
  const successMessages = [
    "You're in. Now you'll know what tech to avoid before your colleagues waste months learning it.",
    'Subscription confirmed. Prepare for monthly tech eulogies delivered to your inbox.',
    "Welcome aboard! You'll now receive alerts when something your CTO is excited about dies.",
    "You're now part of our digital cemetery club. Let's watch frameworks flatline together.",
    'Success! Your monthly dose of schadenfreude has been scheduled. We all enjoy watching tech die.',
    "Congratulations. You'll now be smugly informed when your coworkers' favorite frameworks get EOL'd.",
  ];

  // Randomly select a success message
  const randomSuccessMessage = successMessages[Math.floor(Math.random() * successMessages.length)];

  return (
    <motion.div
      className="relative rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm"
      initial={{ opacity: 0.9 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      {/* Grid pattern background */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Main content */}
      <div className="relative z-10 p-6">
        {/* Header section with title and description */}
        <div className="mb-5">
          <motion.div
            className="inline-block relative"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            <h3 className="text-xl font-bold text-lime-400 mb-2">
              Tech Death Alerts
              {/* Glitch effect */}
              <AnimatePresence>
                {isHovered && (
                  <motion.span
                    className="absolute top-0 left-1/2 -translate-x-1/2 text-red-500 opacity-70 font-mono"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                  >
                    {glitchText}
                  </motion.span>
                )}
              </AnimatePresence>
            </h3>
          </motion.div>

          <p className="text-sm text-zinc-400">
            <span className="text-lime-400"> Subscribe</span>{' '}
            {`to our monthly tech obituaries and watch the slow, painful death of frameworks your coworkers won't shut up about.`}
          </p>
        </div>

        {/* Form section */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                className="flex flex-col sm:flex-row gap-3 w-full"
                action="https://buttondown.com/api/emails/embed-subscribe/is-this-tech-dead"
                method="post"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  disabled={loading}
                  className="px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-md text-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-lime-500 focus:border-lime-500 w-full disabled:opacity-50 text-sm flex-1"
                />

                {/* Required for Buttondown's embed form */}
                <input type="hidden" name="tag" value="website" />

                {/* Honeypot field to prevent spam */}
                <div style={{ display: 'none' }}>
                  <input
                    type="text"
                    name="contact_me_by_fax_please"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-lime-700 hover:bg-lime-600 text-black text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div
                className="bg-zinc-800/50 p-4 rounded-lg border border-lime-900/30"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <svg
                      className="h-5 w-5 text-lime-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-lime-300 font-medium">{randomSuccessMessage}</p>
                    <p className="mt-2 text-xs text-zinc-500">
                      You can unsubscribe anytime, but you will miss out on all the tech death
                      drama.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="mt-3 bg-red-900/20 border border-red-800/30 rounded p-3"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex text-sm text-red-400">
                  <svg
                    className="h-5 w-5 text-red-500 mr-2 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Small print */}
        <div className="mt-4 text-xs text-zinc-500">
          {`By subscribing, you agree to occasional emails about tech that didn't survive. We respect your inbox and your data.`}
          <a
            href="/terms"
            className="underline hover:text-zinc-400 ml-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy policy.
          </a>
        </div>
      </div>
    </motion.div>
  );
}
