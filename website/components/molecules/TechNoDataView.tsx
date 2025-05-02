/**
 * TechNoDataView component displays a message when no technology data is available.
 * Used as a fallback in tech-specific pages when data is missing.
 *
 * @example
 * ```tsx
 * import { TechNoDataView } from '@/components/molecules';
 *
 * {!techData && <TechNoDataView />}
 * ```
 */
export function TechNoDataView() {
  return (
    <div className="bg-yellow-900/20 text-yellow-200 p-6 rounded-xl border border-yellow-900/30 mt-10">
      <div className="flex items-start">
        <div className="text-3xl mr-4">🤔</div>
        <div>
          <h3 className="text-xl font-bold mb-2">No Data Found</h3>
          <p className="text-yellow-100/80">
            {`No data available for this technology yet. It's either too obscure to register on our radar,
            or it's somehow defying the universal law of eventual tech obsolescence.`}
          </p>
        </div>
      </div>
    </div>
  );
}
