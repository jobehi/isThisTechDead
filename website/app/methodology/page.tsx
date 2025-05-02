'use client';

import React from 'react';
import { PageLayout } from '@/templates';
import { Card, GlitchText } from '@/components/molecules';
import { JsonLd } from '@/components/atoms';
import { motion } from 'framer-motion';
import config from '@/lib/config';

export default function MethodologyPage() {
  // Animation container variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
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
        </motion.div>

        <motion.h2
          className="text-2xl font-semibold text-lime-400 mt-10 mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Deaditude Score™ Calculation{' '}
          <span className="text-sm text-zinc-500">(Or: Quantifying Your Poor Life Choices)</span>
        </motion.h2>

        <p className="text-zinc-300 mb-6">
          Our Deaditude Score ranges from 0 (thriving like venture capital at a buzzword convention)
          to 100 (so dead it makes COBOL look cutting-edge). We combine metrics from across the
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
                  { name: 'StackShare Adoption', weight: '15%' },
                  { name: 'YouTube Desperation', weight: '15%' },
                  { name: 'Stack Overflow Panic', weight: '10%' },
                  { name: 'Hacker News Contempt', weight: '5%' },
                ].map((source, index) => (
                  <motion.li
                    key={source.name}
                    className="flex justify-between items-center border-b border-zinc-800 pb-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.07 }}
                  >
                    <span className="text-zinc-300">
                      {source.name}
                      {source.name === 'Google Jobs' && (
                        <span className="text-xs ml-1">(or lack thereof)</span>
                      )}
                    </span>
                    <motion.span
                      className="text-lime-400 font-mono"
                      whileHover={{ scale: 1.1, y: -2 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    >
                      {source.weight}
                    </motion.span>
                  </motion.li>
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
                    range: '0-20',
                    color: 'text-green-400',
                    description:
                      'Very Active — Silicon Valley is currently throwing money at it like a tech bro at a crypto nightclub.',
                  },
                  {
                    range: '21-40',
                    color: 'text-green-300',
                    description:
                      "Active — Recruiters will still spam you on LinkedIn. You'll be employable for at least 2-3 more years.",
                  },
                  {
                    range: '41-60',
                    color: 'text-yellow-300',
                    description:
                      'Stable — The "Java Zone" – boring but pays the bills. Mostly maintained by people who are too tired to learn something new.',
                  },
                  {
                    range: '61-80',
                    color: 'text-orange-400',
                    description:
                      "Declining — Only one guy in Belarus still has commit access and he hasn't been seen since 2018.",
                  },
                  {
                    range: '81-100',
                    color: 'text-red-500',
                    description:
                      'Abandoned — This tech is deader than your Tamagotchi. Time to update that résumé, champ.',
                  },
                ].map((score, index) => (
                  <motion.li
                    key={score.range}
                    className="flex items-start gap-2 border-b border-zinc-800 pb-2"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.07 }}
                  >
                    <motion.span
                      className={`${score.color} font-mono whitespace-nowrap`}
                      whileHover={{ scale: 1.1, x: 2 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    >
                      {score.range}:
                    </motion.span>
                    <span className="text-zinc-300">{score.description}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        <motion.h2
          className="text-2xl font-semibold text-lime-400 mt-10 mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          How We Analyze Each Source{' '}
          <span className="text-sm text-zinc-500">(With Brutal Precision)</span>
        </motion.h2>

        <motion.div
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {[
            {
              title: 'GitHub Analysis',
              subtitle: 'Digital Archaeology',
              description:
                'We dig through GitHub repositories like digital archaeologists searching for signs of life:',
              items: [
                "We count commits to see if anyone still cares (spoiler: they probably don't)",
                'We measure how long issues stay open (some repos have bugs old enough to vote)',
                "We analyze PRs to see if maintainers are still alive or just propped up Weekend-at-Bernie's style",
                'We count active contributors (one maintainer = imminent death)',
                'We track star counts (the "thoughts and prayers" of open source)',
                "We check release dates (if the last tag was when Gangnam Style was trending, it's not looking good)",
              ],
            },
            {
              title: 'Google Jobs',
              subtitle: 'Economic Distress Signals',
              description:
                'We analyze job listings to see if anyone is still hiring for this tech:',
              items: [
                'Number of job listings (fewer than Blockbuster store openings? Not a good sign)',
                'Search result relevance (when "expert in X" returns jobs for "anything but X")',
                'Requirement patterns (when it only appears in "legacy system maintenance" sections)',
              ],
            },
            {
              title: 'Reddit Activity',
              subtitle: 'Digital Eulogy Department',
              description: 'We scour Reddit for the vibe check:',
              items: [
                'Post volume (when "is X dead yet?" posts outnumber tutorials, it\'s terminal)',
                'Subreddit subscriber counts (fewer members than a MySpace fan club? Bad news)',
                'Post sentiment analysis (measuring the ratio of excitement to existential dread)',
              ],
            },
            {
              title: 'StackShare Adoption',
              subtitle: 'Corporate FOMO Tracker',
              description: "We check who's actually using this technology in production:",
              items: [
                "Number of companies reporting usage (fewer than people who've finished a CAPTCHA on the first try? Concerning)",
                'Notable companies listed (when even the example companies are startups that went bankrupt in 2017)',
              ],
            },
            {
              title: 'YouTube Tutorials',
              subtitle: 'Digital Lifeboat Analysis',
              description: 'We track the last gasps of tutorial content:',
              items: [
                'Video freshness (all tutorials recorded on potato cameras from 2009? Get your resume ready)',
                'View counts (fewer than "How to install Windows Vista" videos? Time to panic)',
                'Video-to-complaint ratio (when "why X sucks" videos outnumber actual tutorials)',
              ],
            },
            {
              title: 'Stack Overflow',
              subtitle: 'Desperation Metrics',
              description:
                'We measure the collective panic of developers through 30 days of Stack Overflow activity:',
              items: [
                'Answered ratio (< 30% of questions answered? +3 points toward death)',
                'Zero answers (50% of questions with zero answers? +2 points)',
                'Accepted answers (< 10% accepted answers? +2 points)',
                'Answer time (48+ hours for first answers? +2 points)',
                'Low views (< 10 average views? +2 points)',
                'Volume penalty (< 10 questions in 30 days? +3 points)',
                'Lurker ratio (1000+ views per answer? +1 point)',
              ],
              link: {
                text: 'View detailed Stack Overflow scoring methodology',
                url: '/methodology/stackoverflow',
              },
            },
            {
              title: 'Hacker News',
              subtitle: 'Tech Hipster Sentiment',
              description: 'We analyze what the insufferable tech elites are saying:',
              items: [
                'Mention frequency (fewer mentions than Betamax or HD-DVD restoration projects? Not great)',
                'Comment sentiment (when the most positive comment is "well, it\'s still better than PHP")',
                'Discussion topics (the ratio of obituaries to actual technical discussions)',
              ],
            },
          ].map((source, index) => (
            <motion.div
              key={source.title}
              className="border-l-4 border-lime-500 pl-6 py-2"
              variants={itemVariants}
            >
              <h3 className="text-xl font-medium text-lime-300 mb-2">
                <GlitchText text={source.title} intensity="low" glitchOnHover={true} />
                <span className="text-xs text-zinc-500 ml-2">({source.subtitle})</span>
              </h3>
              <p className="text-zinc-300 mb-3">{source.description}</p>
              <ul className="list-disc list-inside text-zinc-400 space-y-1">
                {source.items.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.05 + index * 0.02 }}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
              {source.link && (
                <motion.a
                  href={source.link.url}
                  className="text-lime-400 text-sm italic"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 + index * 0.02 }}
                >
                  {source.link.text}
                </motion.a>
              )}
            </motion.div>
          ))}
        </motion.div>

        <Card className="mt-12 p-6" glowColor="none" hoverEffect={false} delay={1.2}>
          <h2 className="text-xl font-semibold text-lime-400 mb-4">
            Data Refresh Schedule{' '}
            <span className="text-xs text-zinc-500">(Keeping the Death Certificate Updated)</span>
          </h2>
          <p className="text-zinc-300">
            {`Our algorithms grind away daily, dispassionately charting the decline of your favorite technologies like the world's 
            most depressing heart monitor. We apply sophisticated statistical smoothing, not to make things look better, 
            but to ensure the flatline is scientifically accurate.`}
          </p>
        </Card>

        <Card className="mt-8 p-6" glowColor="lime" hoverEffect={false} delay={1.4}>
          <h4 className="text-xl font-semibold text-lime-400 mb-3">
            A Note From Our Legal Department
          </h4>
          <p className="text-zinc-400 italic">
            {`Please be advised that using Deaditude Score™ as your only basis for tech stack decisions is 
            like choosing a spouse based exclusively on their Zodiac sign. We take no responsibility for your 
            career after you decide to learn FORTRAN because "it seems due for a comeback."`}
          </p>
        </Card>

        <motion.p
          className="text-zinc-400 italic mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          {`Remember: A high Deaditude Score doesn't necessarily mean you should avoid a technology.
          Sometimes the most stable tech is just unfashionably reliable, like those Volvo station wagons from the 90s.
          They'll still run when the nuclear winter comes, but don't expect anyone to be impressed at car meetups.`}
        </motion.p>
      </div>
    </PageLayout>
  );
}
