'use client';

import React from 'react';
import { PageLayout } from '@/templates';
import { Card, GlitchText } from '@/components/molecules';
import { JsonLd } from '@/components/atoms';
import config from '@/lib/config';
import Link from 'next/link';

export default function MethodologyPage() {
  // JSON-LD structured data for the methodology page
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Is This Tech Dead? Methodology',
    description:
      'Learn how we calculate the Deaditude Score™ to determine how dead your favorite technology really is. Our data-driven approach combines metrics from GitHub, Stack Overflow, job listings, and more.',
    url: `${config.site.url}/methodology`,
    mainEntityOfPage: {
      '@type': 'Article',
      headline: 'Our Methodology',
      description:
        'How we perform digital autopsies and calculate exactly how screwed you are for choosing that technology stack.',
      author: {
        '@type': 'Organization',
        name: 'Is This Tech Dead?',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Is This Tech Dead?',
        logo: {
          '@type': 'ImageObject',
          url: `${config.site.url}/is_this_tech_dead_logo_small`,
        },
      },
    },
  };

  return (
    <PageLayout showBackLink={true}>
      <JsonLd data={structuredData} />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-lime-400 mb-2">
            <GlitchText text="Our Methodology" as="span" />
            <span className="text-xs align-top text-zinc-500 ml-2">
              (or How We Perform Digital Autopsies)
            </span>
          </h1>

          <p className="text-zinc-300 mb-6">
            {`At "Is This Tech Dead?", we've developed a sophisticated system to calculate exactly how screwed 
            you are for choosing that technology stack. Our Deaditude Score™ is like a health inspector for tech 
            showing up unannounced, poking around in dark corners, and leaving with a clipboard full of horrifying facts
            you'd rather not know.`}
          </p>
        </div>

        <h2 className="text-2xl font-semibold text-lime-400 mt-10 mb-4">
          Deaditude Score™ Calculation{' '}
          <span className="text-sm text-zinc-500">(Or: Quantifying Your Poor Life Choices)</span>
        </h2>

        <p className="text-zinc-300 mb-6">
          Our Deaditude Score ranges from 0 (thriving like venture capital at a buzzword convention)
          to 10 (so dead it makes COBOL look cutting-edge). We combine metrics from across the
          internet into one soul-crushing number that accurately measures how much you should regret
          your technology decisions.
        </p>

        <Card className="p-6 mb-8" glowColor="none" hoverEffect={false}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-lime-300 mb-3">
                Data Sources & Weights{' '}
                <span className="text-xs text-zinc-500">(a.k.a. Our Blame Distribution)</span>
              </h3>
              <ul className="space-y-3">
                {[
                  { name: 'GitHub Activity', weight: '20%' },
                  { name: 'Google Jobs', weight: '20%' },
                  { name: 'Reddit Complaints', weight: '15%' },
                  { name: 'Stack Overflow Panic', weight: '15%' },
                  { name: 'YouTube Desperation', weight: '15%' },
                  { name: 'Hacker News Contempt', weight: '15%' },
                ].map(source => (
                  <li
                    key={source.name}
                    className="flex justify-between items-center border-b border-zinc-800 pb-2"
                  >
                    <span className="text-zinc-300">
                      {source.name}
                      {source.name === 'Google Jobs' && (
                        <span className="text-xs ml-1">(or lack thereof)</span>
                      )}
                    </span>
                    <span className="text-lime-400 font-mono">{source.weight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-lime-300 mb-3">
                Score Interpretation{' '}
                <span className="text-xs text-zinc-500">(a.k.a. Your Career Forecast)</span>
              </h3>
              <ul className="space-y-3">
                {[
                  {
                    range: '0-2',
                    color: 'text-green-400',
                    description:
                      'Very Active — Silicon Valley is currently throwing money at it like a tech bro at a crypto nightclub.',
                  },
                  {
                    range: '3-4',
                    color: 'text-green-300',
                    description:
                      "Active — Recruiters will still spam you on LinkedIn. You'll be employable for at least 2-3 more years.",
                  },
                  {
                    range: '5-6',
                    color: 'text-yellow-300',
                    description:
                      'Stable — The "Java Zone" – boring but pays the bills. Mostly maintained by people who are too tired to learn something new.',
                  },
                  {
                    range: '7-8',
                    color: 'text-orange-400',
                    description:
                      "Declining — Only one guy in Belarus still has commit access and he hasn't been seen since 2018.",
                  },
                  {
                    range: '9-10',
                    color: 'text-red-500',
                    description:
                      'Abandoned — This tech is deader than your Tamagotchi. Time to update that résumé, champ.',
                  },
                ].map(score => (
                  <li
                    key={score.range}
                    className="flex items-start gap-2 border-b border-zinc-800 pb-2"
                  >
                    <span className={`${score.color} font-mono whitespace-nowrap`}>
                      {score.range}:
                    </span>
                    <span className="text-zinc-300">{score.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        <h2 className="text-2xl font-semibold text-lime-400 mt-10 mb-6">
          Detailed Platform Methodologies{' '}
          <span className="text-sm text-zinc-500">(The Gory Details)</span>
        </h2>

        <div className="space-y-8">
          {/* GitHub Analysis */}
          <div className="bg-zinc-900/60 rounded-lg p-6 border border-zinc-800">
            <h3 className="text-xl font-semibold text-lime-300 mb-3 flex items-center">
              <span className="mr-2">🐙</span> GitHub Analysis
              <span className="text-sm text-zinc-500 ml-2">(Digital Archaeology)</span>
            </h3>

            <p className="text-zinc-300 mb-4">
              Our GitHub deaditude score calculates exactly how neglected a repository is based on
              these factors:
            </p>

            <div className="space-y-4 mt-4">
              <div className="border-l-2 border-lime-500/30 pl-4">
                <h4 className="text-lime-400 font-medium">Commit Activity (last 30 days)</h4>
                <ul className="text-zinc-400 text-sm mt-1 space-y-1">
                  <li>• No commits: +3.0 penalty</li>
                  <li>• 1-9 commits: +2.0 penalty</li>
                  <li>• 10-29 commits: +1.0 penalty</li>
                  <li>• 30-49 commits: -1.0 bonus</li>
                  <li>• 50+ commits: -2.0 bonus</li>
                </ul>
              </div>

              <div className="border-l-2 border-lime-500/30 pl-4">
                <h4 className="text-lime-400 font-medium">PR Age</h4>
                <ul className="text-zinc-400 text-sm mt-1 space-y-1">
                  <li>• 90-180 days average age: +1.0 penalty</li>
                  <li>• 180+ days average age: +2.0 penalty</li>
                </ul>
                <p className="text-zinc-500 text-xs mt-1 italic">
                  No one wants to review your PR? That&apos;s a five-alarm fire.
                </p>
              </div>

              <div className="border-l-2 border-lime-500/30 pl-4">
                <h4 className="text-lime-400 font-medium">Latest Release</h4>
                <ul className="text-zinc-400 text-sm mt-1 space-y-1">
                  <li>• 60-365 days old: +1.0 penalty</li>
                  <li>• 365+ days old: +2.0 penalty</li>
                  <li>• No releases: +2.0 penalty</li>
                </ul>
                <p className="text-zinc-500 text-xs mt-1 italic">
                  If the last tag was when Gangnam Style was trending, it&apos;s not looking good.
                </p>
              </div>

              <div className="border-l-2 border-lime-500/30 pl-4">
                <h4 className="text-lime-400 font-medium">Stars (Popularity Bonus)</h4>
                <ul className="text-zinc-400 text-sm mt-1 space-y-1">
                  <li>• 10,000-50,000 stars: -1.0 bonus</li>
                  <li>• 50,000-100,000 stars: -2.0 bonus</li>
                  <li>• 100,000+ stars: -3.0 bonus</li>
                </ul>
                <p className="text-zinc-500 text-xs mt-1 italic">
                  The &quot;thoughts and prayers&quot; of open source, but they do count for
                  something.
                </p>
              </div>

              <div className="border-l-2 border-lime-500/30 pl-4">
                <h4 className="text-lime-400 font-medium">Contributors</h4>
                <ul className="text-zinc-400 text-sm mt-1 space-y-1">
                  <li>• 5-20 contributors: -1.0 bonus</li>
                  <li>• 20-50 contributors: -1.5 bonus</li>
                  <li>• 50+ contributors: -2.0 bonus</li>
                </ul>
                <p className="text-zinc-500 text-xs mt-1 italic">
                  One maintainer = imminent death. Many contributors = probably alive.
                </p>
              </div>
            </div>

            <div className="mt-4 text-sm bg-zinc-950/50 p-3 rounded-lg border border-zinc-700">
              <code className="text-lime-300 font-mono">
                score = 5.0 (baseline) + penalties - bonuses
                <br />
                deaditude = max(0, min(10, score))
              </code>
            </div>
          </div>

          {/* Stack Overflow Analysis */}
          <div className="bg-zinc-900/60 rounded-lg p-6 border border-zinc-800">
            <h3 className="text-xl font-semibold text-lime-300 mb-3 flex items-center">
              <span className="mr-2">🧠</span> Stack Overflow Analysis
              <span className="text-sm text-zinc-500 ml-2">(Desperation Metrics)</span>
            </h3>

            <p className="text-zinc-300 mb-4">
              We measure how quickly devs run away screaming when you mention your stack on Stack
              Overflow:
            </p>

            <div className="space-y-4 mt-4">
              <div className="border-l-2 border-blue-500/30 pl-4">
                <h4 className="text-blue-400 font-medium">Answered Ratio (weight: 2.0)</h4>
                <p className="text-zinc-400 text-sm mt-1">
                  Percentage of questions with answers. If people ask and nobody answers, ghost town
                  confirmed.
                </p>
              </div>

              <div className="border-l-2 border-blue-500/30 pl-4">
                <h4 className="text-blue-400 font-medium">Accepted Ratio (weight: 1.0)</h4>
                <p className="text-zinc-400 text-sm mt-1">
                  Percentage of questions with accepted answers. Low acceptance rate means no one is
                  finding good solutions.
                </p>
              </div>

              <div className="border-l-2 border-blue-500/30 pl-4">
                <h4 className="text-blue-400 font-medium">Zero Answer Rate (weight: 1.0)</h4>
                <p className="text-zinc-400 text-sm mt-1">
                  Percentage of questions with no answers. It&apos;s like screaming into the void,
                  but nerdier.
                </p>
              </div>

              <div className="border-l-2 border-blue-500/30 pl-4">
                <h4 className="text-blue-400 font-medium">Response Time (weight: 1.5)</h4>
                <p className="text-zinc-400 text-sm mt-1">
                  Median time to first answer. If it takes days to get a response, that&apos;s
                  legacy code territory.
                </p>
              </div>

              <div className="border-l-2 border-blue-500/30 pl-4">
                <h4 className="text-blue-400 font-medium">Activity Recency (weight: 1.5)</h4>
                <p className="text-zinc-400 text-sm mt-1">
                  Days since last activity. Nobody home? Turn off the lights.
                </p>
              </div>

              <div className="border-l-2 border-blue-500/30 pl-4">
                <h4 className="text-blue-400 font-medium">Trend Direction (weight: 1.5)</h4>
                <p className="text-zinc-400 text-sm mt-1">
                  Bonus for increasing activity, penalty for decreasing. Like measuring a
                  patient&apos;s pulse.
                </p>
              </div>
            </div>

            <p className="text-zinc-400 mt-4 text-sm">
              Bonuses are applied for high question volume (max 2.0 points) and high view counts
              (max 1.5 points).
            </p>

            <div className="mt-4 text-sm bg-zinc-950/50 p-3 rounded-lg border border-zinc-700">
              <code className="text-blue-300 font-mono">
                score = SUM(metrics_weights) - volume_bonus - view_count_bonus
                <br />
                deaditude = max(0, min(10, score))
              </code>
            </div>

            <div className="mt-3 text-right">
              <Link
                href="/methodology/stackoverflow"
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                View detailed Stack Overflow methodology →
              </Link>
            </div>
          </div>

          {/* YouTube Analysis */}
          <div className="bg-zinc-900/60 rounded-lg p-6 border border-zinc-800">
            <h3 className="text-xl font-semibold text-lime-300 mb-3 flex items-center">
              <span className="mr-2">🎬</span> YouTube Analysis
              <span className="text-sm text-zinc-500 ml-2">(Tutorial Desperation)</span>
            </h3>

            <p className="text-zinc-300 mb-4">
              We analyze YouTube to understand how desperately people are searching for help:
            </p>

            <div className="space-y-4 mt-4">
              <div className="border-l-2 border-red-500/30 pl-4">
                <h4 className="text-red-400 font-medium">Video Count (30%)</h4>
                <p className="text-zinc-400 text-sm mt-1">
                  If almost no one is making content about your tech, that&apos;s a red flag.
                </p>
                <ul className="text-zinc-500 text-xs mt-1 space-y-1">
                  <li>• &lt; 5 videos: Maximum penalty</li>
                  <li>• 5-20 videos: High penalty</li>
                  <li>• 20-50 videos: Medium penalty</li>
                  <li>• 50-100 videos: Low penalty</li>
                  <li>• &gt; 100 videos: No penalty</li>
                </ul>
              </div>

              <div className="border-l-2 border-red-500/30 pl-4">
                <h4 className="text-red-400 font-medium">View Score (30%)</h4>
                <p className="text-zinc-400 text-sm mt-1">
                  Low view counts mean even desperate people aren&apos;t watching.
                </p>
                <ul className="text-zinc-500 text-xs mt-1 space-y-1">
                  <li>• Avg &lt; 100 views: Maximum penalty</li>
                  <li>• Avg 100-500 views: High penalty</li>
                  <li>• Avg 500-1,000 views: Medium penalty</li>
                  <li>• Avg 1,000-5,000 views: Low penalty</li>
                  <li>• Avg &gt; 5,000 views: No penalty</li>
                </ul>
              </div>

              <div className="border-l-2 border-red-500/30 pl-4">
                <h4 className="text-red-400 font-medium">Recency (25%)</h4>
                <p className="text-zinc-400 text-sm mt-1">
                  If the newest video is from the Obama administration, your tech might be in
                  trouble.
                </p>
                <ul className="text-zinc-500 text-xs mt-1 space-y-1">
                  <li>• Newest video &gt; 2 years ago: Maximum penalty</li>
                  <li>• Newest video 1-2 years ago: High penalty</li>
                  <li>• Newest video 6-12 months ago: Medium penalty</li>
                  <li>• Newest video 3-6 months ago: Low penalty</li>
                  <li>• Newest video &lt; 3 months ago: No penalty</li>
                </ul>
              </div>

              <div className="border-l-2 border-red-500/30 pl-4">
                <h4 className="text-red-400 font-medium">Trend (15%)</h4>
                <p className="text-zinc-400 text-sm mt-1">
                  We compare video counts over time to see if creators are abandoning ship.
                </p>
                <ul className="text-zinc-500 text-xs mt-1 space-y-1">
                  <li>• Rapidly declining: Maximum penalty</li>
                  <li>• Slowly declining: Medium penalty</li>
                  <li>• Stable: No penalty</li>
                  <li>• Growing: Bonus</li>
                  <li>• Rapid growth: Maximum bonus</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 text-sm bg-zinc-950/50 p-3 rounded-lg border border-zinc-700">
              <code className="text-red-300 font-mono">
                score = (videoCount * 0.3) + (viewScore * 0.3) + (recency * 0.25) + (trend * 0.15)
                <br />
                deaditude = score / 10
              </code>
            </div>
          </div>

          {/* Reddit Analysis */}
          <div className="bg-zinc-900/60 rounded-lg p-6 border border-zinc-800">
            <h3 className="text-xl font-semibold text-lime-300 mb-3 flex items-center">
              <span className="mr-2">💬</span> Reddit Analysis
              <span className="text-sm text-zinc-500 ml-2">(Community Complaints)</span>
            </h3>

            <p className="text-zinc-300 mb-4">
              We measure despair in Reddit communities to gauge the suffering of your chosen tech
              stack:
            </p>

            <div className="space-y-4 mt-4">
              <div className="border-l-2 border-green-500/30 pl-4">
                <h4 className="text-green-400 font-medium">Post Volume (30%)</h4>
                <p className="text-zinc-400 text-sm mt-1">
                  How many posts are being made about your technology? Ghost town = bad sign.
                </p>
              </div>

              <div className="border-l-2 border-green-500/30 pl-4">
                <h4 className="text-green-400 font-medium">Post Engagement (15%)</h4>
                <p className="text-zinc-400 text-sm mt-1">
                  How many upvotes and comments are posts receiving? Low engagement = dying
                  interest.
                </p>
              </div>

              <div className="border-l-2 border-green-500/30 pl-4">
                <h4 className="text-green-400 font-medium">Sentiment Analysis (20%)</h4>
                <p className="text-zinc-400 text-sm mt-1">
                  We analyze post titles and comments for positive/negative sentiment. Are people
                  angry?
                </p>
              </div>

              <div className="border-l-2 border-green-500/30 pl-4">
                <h4 className="text-green-400 font-medium">Community Growth (15%)</h4>
                <p className="text-zinc-400 text-sm mt-1">
                  Is the subreddit growing, stable, or shrinking? Mass exodus = technology funeral.
                </p>
              </div>

              <div className="border-l-2 border-green-500/30 pl-4">
                <h4 className="text-green-400 font-medium">Problem-to-Showcase Ratio (10%)</h4>
                <p className="text-zinc-400 text-sm mt-1">
                  Ratio of help requests to showcase posts. High ratio = everyone&apos;s struggling.
                </p>
              </div>

              <div className="border-l-2 border-green-500/30 pl-4">
                <h4 className="text-green-400 font-medium">Alternatives Mentions (10%)</h4>
                <p className="text-zinc-400 text-sm mt-1">
                  How often are people discussing alternatives/replacements? If high,
                  everyone&apos;s looking for escape routes.
                </p>
              </div>
            </div>

            <div className="mt-4 text-sm bg-zinc-950/50 p-3 rounded-lg border border-zinc-700">
              <code className="text-green-300 font-mono">
                score = (0.3 * volumeScore) + (0.15 * engagementScore) + (0.2 * sentimentScore) +
                <br />
                (0.15 * growthScore) + (0.1 * problemShowcaseScore) + (0.1 * alternativesScore)
                <br />
                deaditude = max(0, min(10, score))
              </code>
            </div>
          </div>

          {/* Hacker News Analysis */}
          <div className="bg-zinc-900/60 rounded-lg p-6 border border-zinc-800">
            <h3 className="text-xl font-semibold text-lime-300 mb-3 flex items-center">
              <span className="mr-2">🔸</span> Hacker News Analysis
              <span className="text-sm text-zinc-500 ml-2">(Silicon Valley Contempt)</span>
            </h3>

            <p className="text-zinc-300 mb-4">
              We analyze Hacker News to see if your tech passes the Silicon Valley sniff test:
            </p>

            <div className="space-y-4 mt-4">
              <div className="border-l-2 border-orange-500/30 pl-4">
                <h4 className="text-orange-400 font-medium">Post Volume (40%)</h4>
                <p className="text-zinc-400 text-sm mt-1">
                  How frequently is your tech mentioned? Tech that nobody talks about is either
                  boring or dead.
                </p>
              </div>

              <div className="border-l-2 border-orange-500/30 pl-4">
                <h4 className="text-orange-400 font-medium">Post Karma (40%)</h4>
                <p className="text-zinc-400 text-sm mt-1">
                  Average points per post. Low points means even HN trolls can&apos;t be bothered to
                  comment.
                </p>
              </div>

              <div className="border-l-2 border-orange-500/30 pl-4">
                <h4 className="text-orange-400 font-medium">Recency (20%)</h4>
                <p className="text-zinc-400 text-sm mt-1">
                  How recent are the posts? If the latest discussion was during the Trump
                  administration, not a good sign.
                </p>
              </div>
            </div>

            <div className="mt-4 text-sm bg-zinc-950/50 p-3 rounded-lg border border-zinc-700">
              <code className="text-orange-300 font-mono">
                score = (volumeScore * 0.4) + (karmaScore * 0.4) + (recencyScore * 0.2)
                <br />
                deaditude = max(0, min(10, score))
              </code>
            </div>
          </div>

          {/* Jobs Analysis */}
          <div className="bg-zinc-900/60 rounded-lg p-6 border border-zinc-800">
            <h3 className="text-xl font-semibold text-lime-300 mb-3 flex items-center">
              <span className="mr-2">💼</span> Jobs Analysis
              <span className="text-sm text-zinc-500 ml-2">(Economic Distress Signals)</span>
            </h3>

            <p className="text-zinc-300 mb-4">
              We scan job listings to see if your skill set belongs in a museum:
            </p>

            <div className="space-y-3 mt-4">
              <div className="w-full overflow-x-auto">
                <table className="w-full text-sm text-left text-zinc-400">
                  <thead className="text-xs uppercase bg-zinc-800 text-zinc-300">
                    <tr>
                      <th className="px-4 py-2">Job Count</th>
                      <th className="px-4 py-2">Score (0-10)</th>
                      <th className="px-4 py-2">Interpretation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-zinc-800">
                      <td className="px-4 py-2 font-mono text-purple-400">0-10</td>
                      <td className="px-4 py-2 font-mono text-purple-400">10</td>
                      <td className="px-4 py-2">
                        Your skills are so irrelevant you should consider farming
                      </td>
                    </tr>
                    <tr className="border-b border-zinc-800">
                      <td className="px-4 py-2 font-mono text-purple-400">11-50</td>
                      <td className="px-4 py-2 font-mono text-purple-400">8</td>
                      <td className="px-4 py-2">
                        Basically maintaining legacy systems until retirement
                      </td>
                    </tr>
                    <tr className="border-b border-zinc-800">
                      <td className="px-4 py-2 font-mono text-purple-400">51-200</td>
                      <td className="px-4 py-2 font-mono text-purple-400">6</td>
                      <td className="px-4 py-2">Only employable in government or banking</td>
                    </tr>
                    <tr className="border-b border-zinc-800">
                      <td className="px-4 py-2 font-mono text-purple-400">201-500</td>
                      <td className="px-4 py-2 font-mono text-purple-400">4</td>
                      <td className="px-4 py-2">
                        You&apos;ll find a job, but it won&apos;t be fun
                      </td>
                    </tr>
                    <tr className="border-b border-zinc-800">
                      <td className="px-4 py-2 font-mono text-purple-400">501-1000</td>
                      <td className="px-4 py-2 font-mono text-purple-400">2</td>
                      <td className="px-4 py-2">
                        Employable and occasionally invited to happy hours
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono text-purple-400">1000+</td>
                      <td className="px-4 py-2 font-mono text-purple-400">0</td>
                      <td className="px-4 py-2">
                        Recruiters won&apos;t stop calling, you can afford avocado toast
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4 text-sm bg-zinc-950/50 p-3 rounded-lg border border-zinc-700">
              <code className="text-purple-300 font-mono">
                score = lookupTable[jobCount]
                <br />
                deaditude = max(0, min(10, score))
              </code>
            </div>

            <p className="text-xs text-zinc-500 mt-3 italic">
              Note: We also analyze job requirements for &quot;maintenance of legacy systems&quot;
              as a red flag multiplier.
            </p>
          </div>
        </div>

        <div className="mt-16 p-6 border border-zinc-700 rounded-lg bg-zinc-900/40">
          <h2 className="text-xl font-semibold text-lime-400 mb-3">The Final Diagnosis</h2>
          <p className="text-zinc-300 mb-4">
            {`Our platform combines all these signals to deliver the brutal truth about your technology choices. 
            The final Deaditude Score™ is a weighted average of individual platform scores, 
            calibrated with our proprietary "I Told You So" algorithm, developed by bitter senior engineers 
            who warned against using these technologies in the first place.`}
          </p>
          <p className="mb-4">
            {"You don't like it ? "}
            <Link
              href="https://github.com/jobehi/isThisTechDead/tree/main/deaditude"
              className="text-lime-400 hover:text-lime-300 transition-colors underline"
            >
              {'Change it.'}
            </Link>
          </p>
          <p className="text-sm text-zinc-400 italic">
            Remember: All technologies die eventually. The question is whether your resumé will be
            updated before that happens.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
