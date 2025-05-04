'use client';

import { Snapshot, StackOverflowQuestion } from '@/domains';
import { useState } from 'react';
import { StackOverflowIcon } from '../atoms/icons/StackOverflowIcon';

interface StackOverflowProps {
  last_snapshot: Snapshot;
}

export function StackOverflowSection({ last_snapshot }: StackOverflowProps) {
  const [showScoreInfo, setShowScoreInfo] = useState(false);
  const so_metrics = last_snapshot?.so_metrics || {};
  const deadnessLevel = so_metrics.deaditude_score || 5;

  // Get status label based on deaditude score
  const getStatusLabel = () => {
    if (deadnessLevel > 8) return { label: 'Dead End', color: 'text-red-500 bg-red-900/20' };
    if (deadnessLevel > 6)
      return { label: 'Struggling', color: 'text-orange-400 bg-orange-900/20' };
    if (deadnessLevel > 4)
      return { label: 'Needs Help', color: 'text-yellow-400 bg-yellow-900/20' };
    if (deadnessLevel > 2) return { label: 'Holding On', color: 'text-blue-400 bg-blue-900/20' };
    return { label: 'Active Support', color: 'text-green-400 bg-green-900/20' };
  };

  const status = getStatusLabel();

  return (
    <>
      <section className="mb-8 bg-zinc-800/60 p-6 rounded-xl shadow-lg border border-zinc-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-lime-300 flex items-center">
            <span className="mr-2">
              <StackOverflowIcon />
            </span>
            Stack Overflow Analysis
          </h2>
          <div className="flex items-center">
            <div className={`text-sm font-medium ${status.color} px-3 py-1 rounded-full`}>
              {status.label}
            </div>
            <button
              onClick={() => setShowScoreInfo(!showScoreInfo)}
              className="ml-2 text-zinc-400 hover:text-lime-300 transition-colors text-xs underline"
              aria-label="Show deaditude score calculation information"
            >
              How is this calculated?
            </button>
          </div>
        </div>

        {showScoreInfo && (
          <div className="mb-4 p-3 bg-zinc-900/70 rounded-lg border border-zinc-700 text-sm">
            <h3 className="text-lime-300 font-medium mb-1">
              How the Stack Overflow deaditude score is calculated:
            </h3>
            <p className="text-zinc-300 mb-2">
              Our algorithm analyzes multiple Stack Overflow metrics with these weighted factors:
            </p>
            <ul className="text-zinc-400 space-y-1 ml-4 list-disc">
              <li>
                <span className="font-medium">Answered ratio (weight: 2.0)</span>: Percentage of
                questions with answers
              </li>
              <li>
                <span className="font-medium">Accepted ratio (weight: 1.0)</span>: Percentage of
                questions with accepted answers
              </li>
              <li>
                <span className="font-medium">Zero answer rate (weight: 1.0)</span>: Percentage of
                questions with no answers
              </li>
              <li>
                <span className="font-medium">Response time (weight: 1.5)</span>: Median time to
                first answer (higher is worse)
              </li>
              <li>
                <span className="font-medium">Activity recency (weight: 1.5)</span>: Days since last
                activity
              </li>
              <li>
                <span className="font-medium">Trend direction (weight: 1.5)</span>: Bonus for
                increasing activity, penalty for decreasing
              </li>
            </ul>
            <p className="text-zinc-400 mt-2">
              Bonuses are applied for high question volume (max 2.0 points) and high view counts
              (max 1.5 points).
            </p>
            <div className="mt-3 bg-zinc-800/60 p-2 rounded border border-zinc-700">
              <code className="text-xs text-lime-300 font-mono leading-relaxed">
                score = SUM(metrics_weights) - volume_bonus - view_count_bonus
                <br />
                deaditude = max(0, min(10, score))
              </code>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          {/* Question Stats */}
          {
            <div className="bg-zinc-900/40 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-zinc-300 mb-3">Question Metrics</h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-zinc-800/60 p-3 rounded-lg">
                  <div className="text-xs text-zinc-400">Total Questions</div>
                  <div className="text-2xl font-bold text-lime-400">
                    {last_snapshot.so_total_questions?.toLocaleString() || '0'}
                  </div>
                </div>

                <div className="bg-zinc-800/60 p-3 rounded-lg">
                  <div className="text-xs text-zinc-400">Answer Rate</div>
                  <div className="text-2xl font-bold text-lime-400">
                    {last_snapshot.so_answered_ratio
                      ? `${(last_snapshot.so_answered_ratio * 100).toFixed(0)}%`
                      : '0%'}
                  </div>
                </div>

                <div className="bg-zinc-800/60 p-3 rounded-lg">
                  <div className="text-xs text-zinc-400">Acceptance Rate</div>
                  <div className="text-2xl font-bold text-lime-400">
                    {last_snapshot.so_accepted_ratio
                      ? `${(last_snapshot.so_accepted_ratio * 100).toFixed(0)}%`
                      : '0%'}
                  </div>
                </div>
                <div className="bg-zinc-800/60 p-3 rounded-lg">
                  <div className="text-xs text-zinc-400">Growth</div>
                  <div className="text-2xl font-bold text-lime-400">
                    {last_snapshot.so_trend_growth_rate
                      ? `${last_snapshot.so_trend_growth_rate > 0 ? '+' : ''}${(last_snapshot.so_trend_growth_rate * 100).toFixed(0)}%`
                      : '0%'}
                  </div>
                </div>
              </div>
              <span className="text-xs text-zinc-500">In the last 30 days</span>
            </div>
          }
        </div>

        {/* Recent Questions - only show if we have data */}
        {so_metrics.raw.questions && so_metrics.raw.questions.length > 0 && (
          <div className="mt-6 bg-zinc-900/40 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-zinc-300 mb-3">Recent Questions</h3>

            <div className="space-y-3">
              {[...so_metrics.raw.questions]
                .sort((a, b) => b.view_count - a.view_count)
                .slice(0, 3)
                .map((question: StackOverflowQuestion, idx: number) => (
                  <a
                    key={idx}
                    href={question.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-300 text-sm line-clamp-2 hover:text-lime-300 transition-colors"
                  >
                    <div className="bg-zinc-800/60 p-3 rounded-lg">
                      {question.title}
                      <div className="flex items-center justify-between mt-2 text-xs">
                        <div className="flex items-center">
                          <span
                            className={`px-1.5 py-0.5 rounded ${question.is_answered ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}
                          >
                            {question.is_answered ? 'Answered' : 'Unanswered'}
                          </span>
                          <span className="text-zinc-500 ml-2">{question.view_count} views</span>
                        </div>
                        <div className="flex space-x-1">
                          {question.tags &&
                            question.tags.slice(0, 3).map((tag: string, tagIdx: number) => (
                              <span
                                key={tagIdx}
                                className="bg-blue-900/30 text-blue-400 px-1.5 rounded text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
