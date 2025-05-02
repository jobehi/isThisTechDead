/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/molecules';
import { ReCaptchaTerms } from '@/components/molecules';
import Link from 'next/link';
import config from '@/lib/config';
import { TextInput, TextArea, Button, FileUpload } from '@/components/atoms';

// Add reCAPTCHA type declaration
declare global {
  interface Window {
    recaptcha: {
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      ready: (callback: () => void) => void;
    };
  }
}

// Add reCAPTCHA script to the document head
const loadReCaptchaScript = (siteKey: string): (() => void) | undefined => {
  if (typeof window !== 'undefined' && !window.recaptcha) {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }
  return undefined;
};

interface ProjectSubmissionFormProps {
  techId: string;
  techName: string;
  onSubmissionComplete?: () => void;
}

/**
 * ProjectSubmissionForm component displays a form for submitting projects built with a specific technology.
 * Features reCAPTCHA protection, file uploads, and validation.
 *
 * @example
 * ```tsx
 * import { ProjectSubmissionForm } from '@/components/features';
 *
 * <ProjectSubmissionForm
 *   techId="react"
 *   techName="React"
 *   onSubmissionComplete={() => console.log('Submission complete')}
 * />
 * ```
 */
export function ProjectSubmissionForm({
  techId,
  techName,
  onSubmissionComplete,
}: ProjectSubmissionFormProps) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [description, setDescription] = useState('');
  const [selfRoast, setSelfRoast] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if project submission is enabled
  const isFeatureEnabled = config.features.enableProjectSubmission;

  // Load reCAPTCHA script
  useEffect(() => {
    const siteKey = config.recaptcha.siteKey;
    if (siteKey) {
      const cleanup = loadReCaptchaScript(siteKey);
      return cleanup;
    }
    return undefined;
  }, []);

  // Get reCAPTCHA token
  const getReCaptchaToken = async (): Promise<string> => {
    if (typeof window === 'undefined' || !window.recaptcha) {
      throw new Error('reCAPTCHA not loaded');
    }

    try {
      const siteKey = config.recaptcha.siteKey;
      const token = await window.recaptcha.execute(siteKey, { action: 'submit_project' });
      return token;
    } catch {
      throw new Error('Failed to get reCAPTCHA token');
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        setError('File size too large (max 2MB)');
        return;
      }

      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError('Only JPEG, PNG, and WebP images are allowed');
        return;
      }

      setScreenshot(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  // Reset form
  const resetForm = () => {
    setName('');
    setUrl('');
    setGithubUrl('');
    setDescription('');
    setSelfRoast('');
    setScreenshot(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle file removal
  const handleRemoveFile = () => {
    setScreenshot(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if feature is enabled
    if (!isFeatureEnabled) {
      setError('Project submission is currently disabled.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Form validation
      if (!name || !description || !selfRoast) {
        setError('Please fill out all required fields');
        setIsSubmitting(false);
        return;
      }

      // URL validation if provided
      if (url && !url.match(/^(https?:\/\/)/)) {
        setError('URL must start with http:// or https://');
        setIsSubmitting(false);
        return;
      }

      // GitHub URL validation if provided
      if (githubUrl && !githubUrl.match(/^(https?:\/\/)?(www\.)?github\.com\/.+/)) {
        setError('Please enter a valid GitHub repository URL');
        setIsSubmitting(false);
        return;
      }

      // Get reCAPTCHA token
      let recaptchaToken = '';
      try {
        recaptchaToken = await getReCaptchaToken();
      } catch {
        setError('Security verification failed. Please refresh the page and try again.');
        setIsSubmitting(false);
        return;
      }

      // Create FormData object
      const formData = new FormData();
      formData.append('techId', techId);
      formData.append('name', name);
      formData.append('url', url);
      formData.append('githubUrl', githubUrl);
      formData.append('description', description);
      formData.append('selfRoast', selfRoast);
      formData.append('recaptchaToken', recaptchaToken);

      if (screenshot) {
        formData.append('screenshot', screenshot);
      }

      // Submit form
      const response = await fetch('/api/projects', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit project');
      }

      // Success handling
      setSuccessMessage(result.message || 'Project submitted successfully!');
      resetForm();

      // Notify parent component if needed
      if (onSubmissionComplete) {
        onSubmissionComplete();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prepare fun roast placeholders
  const roastPlaceholders = [
    `Sure, I built this with ${techName}. I also enjoy hitting myself with a hammer.`,
    `This project works 60% of the time, every time. Just like ${techName}.`,
    `I chose ${techName} because I hate having free time and enjoy debugging obscure errors.`,
    `My therapist said I should make better choices, but I still used ${techName}.`,
    `This is held together with duct tape and Stack Overflow copypasta, just like all ${techName} projects.`,
  ];

  const randomRoastPlaceholder =
    roastPlaceholders[Math.floor(Math.random() * roastPlaceholders.length)];

  // If feature is disabled, show a message
  if (!isFeatureEnabled) {
    return (
      <Card className="w-full p-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-lime-300 mb-2">Project Submission Disabled</h3>
          <p className="text-zinc-400 text-sm">
            {`We're currently not accepting new project submissions. We've had enough dead projects. Check back later!`}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-lime-300 mb-2">Submit Your Zombie Project</h3>
        <p className="text-zinc-400 text-sm">
          {`Built something with ${techName} that's somehow still alive? Show it off and help others understand the depths of your regret. All submissions will be reviewed before they appear.`}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {successMessage ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-lime-900/30 border border-lime-700/50 rounded-lg p-4 text-lime-300 mb-6"
          >
            <div className="flex items-start space-x-3">
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
              <div>
                <p className="font-medium">{successMessage}</p>
                <p className="text-zinc-400 text-sm mt-1">
                  Your submission will be reviewed by our team of necromancers soon.
                </p>
                <button
                  type="button"
                  onClick={() => setSuccessMessage(null)}
                  className="mt-3 text-lime-500 hover:text-lime-400 text-sm font-medium"
                >
                  Submit another project
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
            onSubmit={handleSubmit}
          >
            {/* Project name */}
            <TextInput
              id="project-name"
              label="Project Name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="My Doomed Project"
              disabled={isSubmitting}
              required
            />

            {/* Project URL */}
            <TextInput
              id="project-url"
              label="Live URL (Optional)"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://my-project.com"
              disabled={isSubmitting}
              type="url"
            />

            {/* GitHub URL */}
            <TextInput
              id="github-url"
              label="GitHub Repository (Optional)"
              value={githubUrl}
              onChange={e => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username/project"
              disabled={isSubmitting}
              type="url"
            />

            {/* Description */}
            <TextArea
              id="description"
              label="Project Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={`A brief description of what your ${techName} project does, assuming it works at all.`}
              rows={3}
              disabled={isSubmitting}
              required
            />

            {/* Self-roast */}
            <TextArea
              id="self-roast"
              label="Self-Roast"
              value={selfRoast}
              onChange={e => setSelfRoast(e.target.value)}
              placeholder={randomRoastPlaceholder}
              rows={2}
              disabled={isSubmitting}
              required
              helperText={`Tell us why choosing ${techName} was your biggest regret. Be creative and brutally honest.`}
            />

            {/* Screenshot upload */}
            <FileUpload
              id="screenshot"
              label="Screenshot (Optional)"
              onChange={handleFileChange}
              onClear={handleRemoveFile}
              accept="image/jpeg,image/png,image/webp"
              disabled={isSubmitting}
              hasFile={!!screenshot}
              buttonText="Upload Image"
              changeButtonText="Change Image"
              helperText="Max file size: 2MB. Supported formats: JPEG, PNG, WebP."
            />

            {/* Image preview */}
            {previewUrl && (
              <div className="mt-3 relative">
                <img
                  src={previewUrl}
                  alt="Screenshot preview"
                  className="max-h-48 rounded-md object-contain"
                />
              </div>
            )}

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-950/50 border border-red-700/50 rounded-md p-3 text-red-400 text-sm"
              >
                <div className="flex items-center">
                  <svg
                    className="h-4 w-4 mr-2 text-red-500 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              </motion.div>
            )}

            {/* Submit button */}
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Submit Project
              </Button>
            </div>

            <div className="text-xs text-zinc-500 border-t border-zinc-800 pt-4 mt-4">
              <p>
                By submitting, you agree to our{' '}
                <Link
                  href="/terms#user-generated-content-project-submissions"
                  className="text-lime-400 hover:underline"
                >
                  Terms of Service
                </Link>{' '}
                regarding User-Generated Content and acknowledge our use of reCAPTCHA.
              </p>
              <ReCaptchaTerms />
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </Card>
  );
}
