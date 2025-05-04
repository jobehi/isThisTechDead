import { Snapshot, StackOverflowQuestion } from '@/domains';
import { StackOverflowIcon } from '../atoms/icons/StackOverflowIcon';

interface StackOverflowProps {
  last_snapshot: Snapshot;
}

export function StackOverflowSection({ last_snapshot }: StackOverflowProps) {
  const so_metrics = last_snapshot?.so_metrics || {};
  return (
    <>
      <section className="mb-8 bg-zinc-800/60 p-6 rounded-xl shadow-lg border border-zinc-700">
        <h2 className="text-xl font-bold mb-4 text-lime-300 flex items-center">
          <span className="mr-2">
            <StackOverflowIcon />
          </span>{' '}
          Stack Overflow Analysis
        </h2>

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
