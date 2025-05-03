from __future__ import annotations

"""weighted_deaditude_scorer.py
================================
Public API
~~~~~~~~~~
``calculate_deaditude_score(metrics: dict[str, dict[str, float]],
                           tech_info: dict[str, Any] | None = None) -> dict``
"""

# ───────────────────────── Imports ────────────────────────────
import datetime
import logging
from math import sqrt
from typing import Any, Dict, Optional

# ---------------------------------------------------------------------------
#  Configuration (unchanged logic)
# ---------------------------------------------------------------------------
BASE_WEIGHTS: Dict[str, float] = {
    "github": 0.20,
    "google_jobs": 0.20,
    "reddit": 0.15,
    "stackshare": 0.15,
    "youtube": 0.15,
    "stackoverflow": 0.10,
    "hn": 0.05,
}

# Young tech weights
# Young techs are calculated with different weights
# They are likely to have less jobs demand, but more active communities
# and more active codebases
YOUNG_TECH_WEIGHTS: Dict[str, float] = {
    "github": 0.25,
    "google_jobs": 0.10,
    "reddit": 0.2,
    "stackshare": 0.10,
    "youtube": 0.20,
    "stackoverflow": 0.10,
    "hn": 0.05,
}

YOUNG_TECH_THRESHOLD = 5
MATURING_TECH_THRESHOLD = 10

DIMENSIONS = {
    "codebase": ["github"],
    "community": ["reddit", "hn"],
    "support": ["stackoverflow"],
    "learning": ["youtube"],
    "adoption": ["stackshare"],
    "jobs": ["google_jobs"],
}

SIGMA_BASE = 0.5
MIN_QUALITY_FOR_INFO = 0.3

# ---------------------------------------------------------------------------
#  Helpers
# ---------------------------------------------------------------------------
logger = logging.getLogger(__name__)


def _quality(src_metrics: Dict[str, float]) -> float:
    """Return quality ∈ [0,1]; default 1 if missing."""
    if not src_metrics:
        return 0.0
    return max(0.0, min(1.0, float(src_metrics.get("quality", 1.0))))


def _sigma_for_quality(q: float) -> float:
    """Measurement σ given quality q (0→very noisy)."""
    return SIGMA_BASE * 2 if q <= 0 else SIGMA_BASE / sqrt(q)


def _explain(src: str, score: float) -> str | None:
    if score <= 2:
        return f"{src}: very active (score {score})"
    if score >= 8:
        return f"{src}: looks abandoned (score {score})"
    return None


def _get_tech_age(tech_info: Optional[Dict[str, Any]]) -> int:
    """Return tech age in years (fallback high if unknown)."""
    if not tech_info or "creation_year" not in tech_info:
        return 100
    current_year = datetime.datetime.now().year
    return max(1, current_year - int(tech_info["creation_year"]))


def _adjust_score_by_age(score: float, tech_age: int) -> float:
    """Apply age‑based generosity multiplier (same math as original)."""
    if tech_age <= YOUNG_TECH_THRESHOLD:
        factor = 0.85
    elif tech_age <= MATURING_TECH_THRESHOLD:
        factor = 0.90
    else:
        factor = 1.0
    return score * factor


# ---------------------------------------------------------------------------
#  Public API
# ---------------------------------------------------------------------------
def calculate_deaditude_score(
    metrics: Dict[str, Dict[str, float]],
    tech_info: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """Compute weighted deaditude score with confidence interval.

    Parameters
    ----------
    metrics
        Per-source dicts containing at least ``deaditude_score`` and optionally
        ``quality`` (0-1). Missing sources are treated as neutral with low
        quality (adds variance).
    tech_info
        Optional dict with ``creation_year`` to enable ag-‑aware adjustments.

    Returns
    -------
    dict
        Keys:
        * overall_score - 0-100
        * confidence_interval - (low%, high%)
        * dimension_scores - by category
        * explanations - human-readable notes
        * weights - effective normalised weights
        * tech_age, tech_age_category
    """
    tech_age = _get_tech_age(tech_info)
    weights = (
        YOUNG_TECH_WEIGHTS
        if tech_age <= YOUNG_TECH_THRESHOLD
        else BASE_WEIGHTS
    )

    eff_w: Dict[str, float] = {}
    sigmas: Dict[str, float] = {}
    explanations: list[str] = []

    # Effective weights & per‑source σ
    for src, base_w in weights.items():
        m = metrics.get(src) or {}
        q = _quality(m)
        eff_w[src] = base_w * q
        sigmas[src] = _sigma_for_quality(q)
        if m:
            if exp := _explain(src, m.get("deaditude_score", 5.0)):
                explanations.append(exp)

    # Renormalise
    total_w = sum(eff_w.values()) or 1.0
    for src in eff_w:
        eff_w[src] /= total_w

    # Weighted mean (0‑10)
    overall = sum(
        eff_w[s] *
        metrics.get(s, {}).get("deaditude_score", 5.0) for s in eff_w
    )
    adjusted_overall = _adjust_score_by_age(overall, tech_age)

    # Variance & 95 % CI
    var_overall = sum((eff_w[s] ** 2) * (sigmas[s] ** 2) for s in eff_w)
    se = sqrt(var_overall)
    z = 1.96
    low = max(0.0, adjusted_overall - z * se) / 10
    high = min(10.0, adjusted_overall + z * se) / 10

    # Dimensions
    dims: Dict[str, float | None] = {}
    for dim, sources in DIMENSIONS.items():
        w_sum = sum(eff_w[s] for s in sources)
        if not w_sum:
            dims[dim] = None
            continue
        dim_score = (
            sum(
                eff_w[s] * metrics.get(s, {}).get("deaditude_score", 5.0)
                for s in sources
            )
            / w_sum
        )
        dims[dim] = round(_adjust_score_by_age(dim_score, tech_age), 2)

    pct = adjusted_overall * 10
    age_cat = (
        "young"
        if tech_age <= YOUNG_TECH_THRESHOLD
        else ("maturing"
              if tech_age <= MATURING_TECH_THRESHOLD
              else "established")
    )

    return {
        "overall_score": round(pct, 1),
        "confidence_interval": (round(low * 100, 1), round(high * 100, 1)),
        "dimension_scores": dims,
        "explanations": explanations,
        "weights": {s: round(w, 3) for s, w in eff_w.items()},
        "tech_age": tech_age,
        "tech_age_category": age_cat,
    }


# ---------------------------------------------------------------------------
#  Manual test
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import argparse
    import pprint

    p = argparse.ArgumentParser(description="Weighted deaditude scorer demo")
    p.add_argument("-v",
                   "--verbose",
                   action="store_true",
                   help="enable debug logging",
                   )
    args = p.parse_args()

    if args.verbose:
        logging.basicConfig(
            level=logging.DEBUG, format="%(levelname)s:%(name)s:%(message)s"
        )

    demo = {
        "github": {"deaditude_score": 1.0, "quality": 0.9},
        "google_jobs": {"deaditude_score": 0.5},
        "stackoverflow": {"deaditude_score": 3.0},
        "reddit": {"deaditude_score": 8.0, "quality": 0.9},
    }
    result = calculate_deaditude_score(demo, {"creation_year": 2020})
    pprint.pprint(result)
