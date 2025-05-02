'use client';

import { formatDate, getScoreColor, safeToFixed } from '@/lib/shared';
import { Snapshot } from '@/domains/tech';

interface TechHistorySectionProps {
  snapshots: Snapshot[];
}

/**
 * TechHistorySection component displays historical deaditude scores in a timeline.
 * Shows a table with all previous scores for a technology.
 *
 * @example
 * ```tsx
 * import { TechHistorySection } from '@/components/organisms';
 *
 * <TechHistorySection snapshots={snapshotData} />
 * ```
 */
export function TechHistorySection({ snapshots }: TechHistorySectionProps) {
  // Only render if we have more than 1 snapshot
  if (snapshots.length <= 1) {
    return null;
  }

  return (
    <section className="mb-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-lime-300 flex items-center">
          <span className="mr-2">📈</span>
          Historical Score Timeline
        </h2>
        <div className="text-xs text-zinc-500 italic">Watch the slow death in progress</div>
      </div>

      <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700">
        <table className="w-full text-left rounded-lg overflow-hidden">
          <thead className="bg-zinc-700/50 text-zinc-300">
            <tr>
              <th className="py-3 px-4 rounded-l-lg">Date</th>
              <th className="py-3 px-4 rounded-r-lg">Score</th>
            </tr>
          </thead>
          <tbody>
            {snapshots.map((snapshot: Snapshot, index: number) => {
              const snapshotScore =
                typeof snapshot?.deaditude_score === 'number' && !isNaN(snapshot.deaditude_score)
                  ? snapshot.deaditude_score * 10
                  : 0;

              return (
                <tr key={snapshot.id || index} className="border-b border-zinc-700 last:border-0">
                  <td className="py-3 px-4 text-zinc-100">{formatDate(snapshot.snapshot_date)}</td>
                  <td className="py-3 px-4">
                    <span
                      className="inline-block px-3 py-1 rounded-md font-semibold"
                      style={{
                        backgroundColor: getScoreColor(snapshotScore),
                        color: snapshotScore > 50 ? '#fff' : '#000',
                      }}
                    >
                      {safeToFixed(snapshotScore)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
