'use client';

import { Suspense } from 'react';
import { ProjectSubmissionForm } from '@/components/features/project';
import { PageLayout } from '@/templates';

// Loader component to show while client component is loading
function ProjectFormLoader() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-64 bg-zinc-800 rounded mb-6"></div>
      <div className="h-14 w-full bg-zinc-800 rounded-lg mb-4"></div>
      <div className="h-24 w-full bg-zinc-800 rounded-lg mb-8"></div>
      <div className="h-96 w-full bg-zinc-800 rounded-lg"></div>
    </div>
  );
}

// Main page component
export default function SubmitProjectPage() {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto pt-16 pb-24 px-8">
        <Suspense fallback={<ProjectFormLoader />}>
          <SubmitProjectForm />
        </Suspense>
      </div>
    </PageLayout>
  );
}

// Client component that uses useSearchParams
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import config from '@/lib/config';

function SubmitProjectForm() {
  const searchParams = useSearchParams();
  const [techId, setTechId] = useState<string>('');
  const [techName, setTechName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if project submission is enabled
  const isSubmissionEnabled = config.features.enableProjectSubmission;

  useEffect(() => {
    const id = searchParams.get('techId');
    const name = searchParams.get('techName');

    if (id) setTechId(id);
    if (name) setTechName(decodeURIComponent(name));

    setIsLoading(false);

    // Redirect if submissions are disabled
    if (!isSubmissionEnabled) {
      window.location.href = id ? `/${id}` : '/';
    }
  }, [searchParams, isSubmissionEnabled]);

  // Handle form completion (submission or cancel)
  const handleComplete = () => {
    // Navigate back to the tech page
    if (techId) {
      window.location.href = `/${techId}`;
    } else {
      window.location.href = '/';
    }
  };

  // Show loading state while the redirect is happening
  if (isLoading || !isSubmissionEnabled) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-64 bg-zinc-800 rounded mb-6"></div>
        <div className="h-14 w-full bg-zinc-800 rounded-lg mb-4"></div>
        <div className="h-24 w-full bg-zinc-800 rounded-lg mb-8"></div>
        <div className="h-96 w-full bg-zinc-800 rounded-lg"></div>
      </div>
    );
  }

  return (
    <>
      <Link
        href={techId ? `/${techId}` : '/'}
        className="inline-flex items-center text-zinc-400 hover:text-lime-300 mb-8"
      >
        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to {techName || 'Home'}
      </Link>

      <h1 className="text-4xl font-bold text-lime-300 mb-6">
        Submit Your {techName ? techName : 'Project'}
      </h1>

      <p className="text-zinc-400 mb-8">
        {`Found a way to make ${techName || 'a technology'} do something interesting? Share your project with 
        fellow developers and show how you're using this technology in the wild.`}
      </p>

      {techId ? (
        <ProjectSubmissionForm
          techId={techId}
          techName={techName}
          onSubmissionComplete={handleComplete}
        />
      ) : (
        <div className="bg-red-950/50 border border-red-700/50 rounded-md p-6 text-red-300">
          <h2 className="text-xl font-semibold mb-3">Missing Technology Information</h2>
          <p className="mb-4">
            {`We couldn't determine which technology you're submitting a project for.
            Please go back to a technology page and use the "Add Yours" button there.`}
          </p>
          <Link
            href="/"
            className="px-4 py-2 bg-red-900/50 hover:bg-red-900 text-red-300 rounded-md inline-flex items-center"
          >
            Back to Homepage
          </Link>
        </div>
      )}
    </>
  );
}
