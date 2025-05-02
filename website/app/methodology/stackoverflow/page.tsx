'use client';

import { ChevronLeftIcon } from '@/components/atoms/icons/ChevronLeftIcon';
import Link from 'next/link';

// Simple component to replace the motion div
function ScoreFactor({
  title,
  emoji,
  description,
  thresholds,
  commentary,
}: {
  title: string;
  emoji: string;
  description: string;
  thresholds: { threshold: string; points: string }[];
  commentary: string;
}) {
  return (
    <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/60 backdrop-blur-sm mb-6">
      <div className="flex items-start gap-4">
        <div className="text-2xl">{emoji}</div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
          <p className="text-zinc-400 mb-4">{description}</p>

          <div className="space-y-2 mb-4">
            {thresholds.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div className="text-zinc-300">{item.threshold}</div>
                <div className="font-mono text-lime-400">{item.points}</div>
              </div>
            ))}
          </div>

          <p className="text-zinc-500 text-sm italic">{commentary}</p>
        </div>
      </div>
    </div>
  );
}

export default function StackOverflowMethodologyPage() {
  const factors = [
    {
      title: 'Answered Ratio',
      emoji: '📉',
      description: 'What percentage of questions actually get an answer?',
      thresholds: [
        { threshold: '< 30% of questions answered', points: '+3 points' },
        { threshold: '< 60% answered', points: '+2 points' },
        { threshold: '< 85% answered', points: '+1 point' },
      ],
      commentary: 'If people ask and nobody answers… the tech is giving "ghost town" energy.',
    },
    {
      title: 'Accepted Answers',
      emoji: '✅',
      description: 'Out of all answered questions, how many get an accepted answer?',
      thresholds: [
        { threshold: '< 10% accepted answers', points: '+2 points' },
        { threshold: '< 30% accepted', points: '+1 point' },
      ],
      commentary:
        "If people do answer, but nobody accepts the answer, either no one cares or no one's coming back. Either way, not a great sign.",
    },
    {
      title: 'Zero Answers',
      emoji: '🙉',
      description: 'How many questions get absolutely no answers?',
      thresholds: [
        { threshold: '50% of questions get zero answers', points: '+2 points' },
        { threshold: '30% get zero answers', points: '+1 point' },
      ],
      commentary: "It's like screaming into the void, but nerdier.",
    },
    {
      title: 'Median Time to First Answer',
      emoji: '🕒',
      description: 'How long does it take to get a first response?',
      thresholds: [
        { threshold: '48+ hours to first answer', points: '+2 points' },
        { threshold: '24+ hours to first answer', points: '+1 point' },
      ],
      commentary: "If it takes days to get a first response, you're in legacy land.",
    },
    {
      title: 'Duplicate Questions',
      emoji: '🔁',
      description: 'How many questions are marked as duplicates?',
      thresholds: [{ threshold: '30% are closed as duplicates', points: '+1 point' }],
      commentary: "Means either the community is annoyed or nobody's updating their docs. Or both.",
    },
    {
      title: 'Views',
      emoji: '👁️',
      description: 'How many people are looking at these questions?',
      thresholds: [
        { threshold: 'Average views < 10', points: '+2 points' },
        { threshold: 'Average views < 30', points: '+1 point' },
      ],
      commentary: 'If no one even looks at the questions, this tech is basically in hospice.',
    },
    {
      title: 'High View But Low Engagement',
      emoji: '👻',
      description: 'Questions that many look at but few help with',
      thresholds: [
        { threshold: 'Many questions get >1k views but few are answered', points: '+1 point' },
      ],
      commentary: 'Basically a crowd watching a slow trainwreck.',
    },
    {
      title: 'Lurker Ratio',
      emoji: '🧟',
      description: 'Views per answer ratio',
      thresholds: [
        { threshold: '1000+ views per answer', points: '+1 point' },
        { threshold: '500+ views per answer', points: '+0.5 point' },
      ],
      commentary: "Everyone's looking. No one's helping. Kind of like your old team.",
    },
    {
      title: 'Volume Penalty',
      emoji: '🔕',
      description: 'How many questions are being asked about this tech?',
      thresholds: [
        { threshold: '< 10 questions in 30 days', points: '+3 points' },
        { threshold: '< 25 questions in 30 days', points: '+2 points' },
        { threshold: '< 50 questions in 30 days', points: '+1 point' },
      ],
      commentary: "Low activity? It's either niche… or dying. Possibly both.",
    },
    {
      title: 'Last Activity Date',
      emoji: '⌛',
      description: 'When was the last sign of life?',
      thresholds: [
        { threshold: 'Last activity > 180 days ago', points: '+2 points' },
        { threshold: 'Last activity > 60 days ago', points: '+1 point' },
      ],
      commentary: 'Nobody home? Turn off the lights.',
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800 py-4">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-2xl font-bold text-lime-400">
            Is This Tech Dead?
          </Link>
        </div>
      </header>

      <main>
        <div className="container max-w-4xl mx-auto px-4 py-12">
          <div className="mb-8">
            <Link
              href="/methodology"
              className="text-zinc-400 hover:text-lime-400 transition-colors inline-flex items-center mb-4"
            >
              <ChevronLeftIcon className="w-4 h-4 mr-2" />
              Back to Methodology
            </Link>

            <h1 className="text-4xl font-bold mb-2">Stack Overflow Deaditude Score</h1>
            <p className="text-xl text-zinc-400">
              How we measure digital decay through unanswered questions
            </p>
          </div>

          <div className="mb-12 bg-zinc-900/60 border border-zinc-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-lime-400">The Technical Autopsy</h2>
            <p className="text-zinc-300 mb-4">
              {`We calculate the Stack Overflow "Deaditude Score" out of 10 (10 = please bury this tech, 0 = still breathing fire). 
              Higher scores indicate more signs of technological decay.`}
            </p>
            <p className="text-zinc-300 mb-2">
              For each technology, we pull the last 30 days of questions using the StackExchange
              API, then analyze the data looking for these key indicators of morbidity:
            </p>
          </div>

          <div className="space-y-6">
            {factors.map((factor, idx) => (
              <ScoreFactor
                key={idx}
                title={factor.title}
                emoji={factor.emoji}
                description={factor.description}
                thresholds={factor.thresholds}
                commentary={factor.commentary}
              />
            ))}
          </div>

          <div className="mt-16 p-6 border border-zinc-800 rounded-lg bg-zinc-900/60">
            <h2 className="text-xl font-bold mb-4">The Final Diagnosis</h2>
            <p className="text-zinc-300 mb-4">
              {`All the points add up to a score out of 10 — capped at 10. Higher score = more signs of decay. 
              It's like a mortality index, but for codebases your boss still believes in.`}
            </p>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-green-900/20 border border-green-900 rounded-lg">
                <div className="text-3xl font-mono mb-2">0-3</div>
                <div className="text-green-400">Healthy tech</div>
                <div className="text-xs text-zinc-400 mt-1">Active community, quick responses</div>
              </div>
              <div className="p-4 bg-yellow-900/20 border border-yellow-900 rounded-lg">
                <div className="text-3xl font-mono mb-2">4-6</div>
                <div className="text-yellow-400">Concerning signs</div>
                <div className="text-xs text-zinc-400 mt-1">Slow decay, update your resume</div>
              </div>
              <div className="p-4 bg-orange-900/20 border border-orange-900 rounded-lg">
                <div className="text-3xl font-mono mb-2">7-8</div>
                <div className="text-orange-400">Serious decline</div>
                <div className="text-xs text-zinc-400 mt-1">The StackOverflow hospice ward</div>
              </div>
              <div className="p-4 bg-red-900/20 border border-red-900 rounded-lg">
                <div className="text-3xl font-mono mb-2">9-10</div>
                <div className="text-red-400">Digital cemetery</div>
                <div className="text-xs text-zinc-400 mt-1">
                  Time to delete from your LinkedIn skills
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center text-zinc-500 text-sm border-t border-zinc-800 pt-6">
            <div className="mt-4 p-3 border border-zinc-800 bg-zinc-900/40 rounded-lg">
              <p className="text-orange-400 font-medium">Ironic Plot Twist:</p>
              <p className="text-zinc-400 mt-1">
                {`Stack Overflow itself is probably dying because of LLMs anyway. The metrics we use to measure tech death will soon be measuring Stack Overflow's own demise. How deliciously meta.`}
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-800 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-zinc-500">
          <p>
            © {new Date().getFullYear()} Is This Tech Dead? All rights to mock your tech stack
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
