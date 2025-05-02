/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Card } from './Card';
import type { Project } from '@/domains';
import { LinkButton } from '../atoms/LinkButton';
import { ExternalLinkIcon } from '../atoms/icons/ExternalLinkIcon';
import { GithubIcon } from '../atoms/icons/GithubIcon';

interface ProjectCardProps {
  project: Project;
  variant?: 'default' | 'glow' | 'elevated' | 'outline';
}

/**
 * ProjectCard – renders single project tile identical to the original ProjectGallery markup.
 */
export function ProjectCard({ project, variant = 'elevated' }: ProjectCardProps) {
  return (
    <Card variant={variant} padding="none" className="h-full flex flex-col">
      {/* Project screenshot (if available) */}
      {project.screenshot_url && (
        <div className="h-48 overflow-hidden bg-zinc-900 border-b border-zinc-800">
          <img
            src={project.screenshot_url}
            alt={project.name}
            className="w-full h-full object-contain"
          />
        </div>
      )}

      {/* Project details */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-lime-300 line-clamp-1">{project.name}</h3>
        </div>

        {/* Description */}
        <p className="text-zinc-400 text-sm mb-4 flex-grow">{project.description}</p>

        {/* External links */}
        <div className="flex flex-wrap gap-2 mb-3">
          {project.url && (
            <LinkButton
              href={project.url}
              external
              size="xs"
              icon={<ExternalLinkIcon size={14} />}
              iconPosition="left"
            >
              Visit
            </LinkButton>
          )}

          {project.github_url && (
            <LinkButton
              href={project.github_url}
              external
              size="xs"
              icon={<GithubIcon size={14} />}
              iconPosition="left"
            >
              GitHub
            </LinkButton>
          )}
        </div>

        {/* Self roast */}
        <div className="mt-4 pt-3 border-t border-zinc-800">
          <p className="text-pink-300 text-sm italic">
            <span className="text-zinc-500">&quot;</span>
            {project.self_roast}
            <span className="text-zinc-500">&quot;</span>
          </p>
        </div>
      </div>
    </Card>
  );
}
