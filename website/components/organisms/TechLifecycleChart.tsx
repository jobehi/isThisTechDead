import { Snapshot } from '@/domains';

interface LifecycleProps {
  last_snapshot: Snapshot;
  creation_year?: number | undefined;
}

enum TechStatus {
  THRIVING = 30,
  HEALTHY = 45,
  CONCERNING = 65,
  TERMINAL_DECLINE = 80,
  DEAD = 100,
}

function getTechLifecycleEmoji(score: number): string {
  if (score < TechStatus.THRIVING) return '🚀'; // rocket for thriving
  if (score < TechStatus.HEALTHY) return '✨'; // sparkles for healthy
  if (score < TechStatus.CONCERNING) return '⚠️'; // warning for concerning
  if (score < TechStatus.TERMINAL_DECLINE) return '🏥'; // hospital for terminal decline
  return '💀'; // skull for dead
}

function getTechPositioningSummary(score: number): string {
  if (score < TechStatus.THRIVING) {
    return `Is in its dynamic growth phase with strong momentum, active development, and expanding adoption among organizations.`;
  }

  if (score < TechStatus.HEALTHY) {
    return `Has achieved stable mainstream adoption with robust community support and established patterns.`;
  }

  if (score < 65) {
    return `Has reached maturity with slowing innovation and some early warning signs of potential future decline.`;
  }

  if (score < 80) {
    return `Is showing significant decline with reduced development activity, community engagement, and new adoption.`;
  }

  return `Has entered obsolescence - it's being actively replaced and finding minimal development or community support.`;
}

/**
 * TechLifecycleChart component displays the lifecycle of a technology over time.
 *
 * @example
 * ```tsx
 * import { TechLifecycleChart } from '@/components/organisms';
 *
 * <TechLifecycleChart
 *   last_snapshot={latestSnapshot}
 * />
 * ```
 */
export function TechLifecycleChart({ last_snapshot, creation_year }: LifecycleProps) {
  const deaditudeScore = last_snapshot?.deaditude_score;

  return (
    <>
      {/* Tech Lifecycle Position */}
      <section className="mb-16">
        <h2 className="text-xl font-bold mb-4 text-lime-300 flex items-center">
          <span className="mr-2">⏱️</span> Tech Lifecycle Position
        </h2>
        <p className="text-sm text-zinc-500 mb-4">{getTechPositioningSummary(deaditudeScore)}</p>
        {/* Lifecycle visualization */}
        <div className="relative h-36 mb-6">
          <div className="absolute inset-0 w-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-lg opacity-20"></div>
          <div className="absolute inset-0 flex items-center justify-between px-6">
            <div className="text-center">
              <div className="text-green-400 text-xs font-bold mb-1">INNOVATION</div>
              <div className="w-1 h-12 bg-zinc-700 rounded-full mx-auto"></div>
            </div>
            <div className="text-center md:visible invisible">
              <div className="text-lime-400 text-xs font-bold mb-1">ADOPTION</div>
              <div className="w-1 h-12 bg-zinc-700 rounded-full mx-auto"></div>
            </div>
            <div className="text-center">
              <div className="text-yellow-400 text-xs font-bold mb-1">PEAK</div>
              <div className="w-1 h-12 bg-zinc-700 rounded-full mx-auto"></div>
            </div>
            <div className="text-center md:visible invisible">
              <div className="text-orange-400 text-xs font-bold mb-1">DECLINE</div>
              <div className="w-1 h-12 bg-zinc-700 rounded-full mx-auto"></div>
            </div>
            <div className="text-center">
              <div className="text-red-400 text-xs font-bold mb-1">OBSOLESCENCE</div>
              <div className="w-1 h-12 bg-zinc-700 rounded-full mx-auto"></div>
            </div>
          </div>

          {/* Position indicator */}
          <div
            className="absolute top-1/2 w-12 h-12 transform -translate-y-1/2 -translate-x-1/2 flex items-center justify-center"
            style={{
              left: `${Math.min(90, Math.max(10, deaditudeScore))}%`,
              transition: 'left 1s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
            }}
          >
            <div className="absolute w-6 h-6 bg-white rounded-full animate-ping opacity-70"></div>
            <div className="w-10 h-10 rounded-full bg-zinc-900 border-2 border-white shadow-lg flex items-center justify-center text-lg z-10">
              {getTechLifecycleEmoji(deaditudeScore)}
            </div>
          </div>

          {/* creation year -> death year if score > 80 */}

          <div className="absolute bottom-0 left-0 w-full text-center text-xs text-zinc-500 font-bold mb-2">
            <div className="flex justify-between px-4">
              <span>{creation_year}</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
