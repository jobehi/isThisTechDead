'use client';

/**
 * ReCaptchaTerms component displays the required legal text for Google reCAPTCHA integration.
 * Used in forms that implement reCAPTCHA protection.
 *
 * @example
 * ```tsx
 * import { ReCaptchaTerms } from '@/components/molecules';
 *
 * <form>
 *   <input type="text" />
 *   <ReCaptchaTerms />
 * </form>
 * ```
 */
export function ReCaptchaTerms() {
  return (
    <div className="text-xs text-zinc-500 mt-2">
      This site is protected by reCAPTCHA and the Google{' '}
      <a
        href="https://policies.google.com/privacy"
        target="_blank"
        rel="noopener noreferrer"
        className="text-lime-600 hover:text-lime-500 underline"
      >
        Privacy Policy
      </a>{' '}
      and{' '}
      <a
        href="https://policies.google.com/terms"
        target="_blank"
        rel="noopener noreferrer"
        className="text-lime-600 hover:text-lime-500 underline"
      >
        Terms of Service
      </a>{' '}
      apply.
    </div>
  );
}
