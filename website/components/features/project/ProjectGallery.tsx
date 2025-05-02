'use client';

import { motion } from 'framer-motion';
import { ProjectCard } from '@/components/molecules';
import config from '@/lib/config';
import type { Project } from '@/domains';
import { linkButtonVariants } from '@/lib/ui/variants';
import { cn } from '@/lib/cn';
import { PlusIcon } from '@/components/atoms/icons/PlusIcon';

interface ProjectGalleryProps {
  techId: string;
  techName: string;
  projects: Project[];
}

/**
 * ProjectGallery component displays submitted projects for a specific technology.
 * Includes empty state UI and links to submit new projects.
 *
 * @example
 * ```tsx
 * import { ProjectGallery } from '@/components/features';
 *
 * <ProjectGallery
 *   techId="react"
 *   techName="React"
 *   projects={projectsData}
 * />
 * ```
 */
export function ProjectGallery({ techId, techName, projects }: ProjectGalleryProps) {
  // Check if project submission is enabled
  const isSubmissionEnabled = config.features.enableProjectSubmission;

  // If there are no projects, show a message
  if (projects.length === 0) {
    return (
      <div className="mt-16 w-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-lime-300 mb-3">Made Something with {techName}?</h2>
          <p className="text-zinc-400 max-w-xl mx-auto mb-8">
            {isSubmissionEnabled
              ? `No one has submitted a ${techName} project yet. Be the first to immortalize your regrettable tech choice in our gallery of questionable decisions.`
              : `No one has submitted a ${techName} project yet. Project submissions are currently disabled.`}
          </p>

          {isSubmissionEnabled ? (
            <motion.a
              href={`/submit-project?techId=${techId}&techName=${encodeURIComponent(techName)}`}
              className={cn(
                linkButtonVariants({ variant: 'primary', size: 'lg', withIcon: 'left' }),
                'text-black font-medium'
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <PlusIcon className="mr-2 h-5 w-5" />
              Submit Your Project
            </motion.a>
          ) : (
            <div
              className={cn(
                linkButtonVariants({ variant: 'default', size: 'lg' }),
                'bg-zinc-700 text-zinc-400 cursor-not-allowed'
              )}
            >
              🪦 Submissions Disabled
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16 w-full">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-lime-300">
          Built With {techName}
          <span className="ml-2 text-zinc-500 text-lg font-normal">({projects.length})</span>
        </h2>

        {isSubmissionEnabled ? (
          <motion.a
            href={`/submit-project?techId=${techId}&techName=${encodeURIComponent(techName)}`}
            className={cn(
              linkButtonVariants({ variant: 'primary', size: 'sm', withIcon: 'left' }),
              'text-black font-medium text-sm'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Yours
          </motion.a>
        ) : (
          <div
            className={cn(
              linkButtonVariants({ variant: 'default', size: 'sm' }),
              'bg-zinc-700 text-zinc-400 cursor-not-allowed text-sm'
            )}
          >
            🪦 Submissions Disabled
          </div>
        )}
      </div>

      {/* Projects grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
