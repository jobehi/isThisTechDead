from __future__ import annotations

"""hn_collector.py
===================
Hacker News signal collector (v2).

* ``collect_hn_signals(tech_name) -> (metrics, quality)``
* CLI: ``python hn_collector.py <tech> [-v | --verbose]``
"""

# ───────────────────────── Imports ────────────────────────────
import argparse
import json
import logging
import os
import time
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List, Tuple

import requests
from dotenv import load_dotenv

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

load_dotenv()

BASE_URL = "https://hn.algolia.com/api/v1/search"
HEADERS = {"User-Agent": "deaditude-hn-collector/2.0"}
WINDOW_DAYS = int(os.getenv("HN_WINDOW_DAYS", "120"))
MAX_HITS = int(os.getenv("HN_MAX_HITS", "300"))
RETRY_LIMIT = 4

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Scoring constants (unchanged)
# ---------------------------------------------------------------------------

MAX_SCORE = 10

VOLUME_DIVISOR = 2
KARMA_DIVISOR = 5
RECENT_DAYS_THRESHOLD = 7

VOLUME_WEIGHT = 0.4
KARMA_WEIGHT = 0.4
RECENCY_WEIGHT = 0.2

HIGH_QUALITY_THRESHOLD = 10
MED_QUALITY_THRESHOLD = 3

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _fetch_page(term: str, page: int, epoch_cutoff: int) -> Dict[str, Any]:
    params = {
        "query": term,
        "tags": "story",
        "hitsPerPage": 1000,
        "page": page,
        "numericFilters": f"created_at_i>{epoch_cutoff}",
    }
    delay = 1.0
    for attempt in range(RETRY_LIMIT):
        resp = requests.get(BASE_URL,
                            params=params,
                            headers=HEADERS,
                            timeout=12)
        if resp.status_code == 200:
            return resp.json()
        if resp.status_code == 429:
            logger.debug(
                "HN 429 - back-off %ss (attempt %d)",
                delay,
                attempt + 1,
            )
            time.sleep(delay)
            delay *= 2
            continue
        resp.raise_for_status()
    raise RuntimeError(f"HN API failed: {resp.status_code}")


# ---------------------------------------------------------------------------
# Collector
# ---------------------------------------------------------------------------

__all__ = ["collect_hn_signals"]


def collect_hn_signals(tech_name: str) -> Tuple[Dict[str, Any], float]:
    """Collect Hacker News activity metrics for *tech_name*."""
    logger.debug("Analyzing %s on HN", tech_name)
    now = datetime.utcnow().replace(tzinfo=timezone.utc)
    epoch_cutoff = int((now - timedelta(days=WINDOW_DAYS)).timestamp())

    all_hits: List[dict] = []
    page = 0
    while True:
        js = _fetch_page(tech_name, page, epoch_cutoff)
        hits = js.get("hits", [])
        all_hits.extend(hits)
        if page >= js.get("nbPages", 0) - 1:
            break
        if len(all_hits) >= MAX_HITS:
            break
        page += 1
        time.sleep(0.25)

    post_count = len(all_hits)
    if post_count == 0:
        metrics = {
            "post_count": 0,
            "avg_points": 0,
            "days_since_last_post": None,
            "recent_within_7": False,
            "raw": {"hits": []},
            "deaditude_score": 10.0,
        }
        return metrics, 0.3

    points = [h.get("points", 0) for h in all_hits]
    avg_points = sum(points) / post_count if points else 0

    latest_ts = max(h.get("created_at_i", 0) for h in all_hits)
    days_since = (now -
                  datetime.fromtimestamp(latest_ts, tz=timezone.utc)).days
    recent_7 = days_since <= RECENT_DAYS_THRESHOLD

    # Component scores (0‑10)
    vol_score = min(MAX_SCORE, post_count / VOLUME_DIVISOR)
    karma_score = min(MAX_SCORE, avg_points / KARMA_DIVISOR)
    recency_score = (
        MAX_SCORE
        if recent_7
        else max(0, MAX_SCORE - days_since / WINDOW_DAYS * MAX_SCORE)
    )

    alive = (
        vol_score * VOLUME_WEIGHT
        + karma_score * KARMA_WEIGHT
        + recency_score * RECENCY_WEIGHT
    )
    deaditude = round(MAX_SCORE - alive, 2)

    # Quality flag
    if post_count >= HIGH_QUALITY_THRESHOLD:
        quality = 1.0
    elif post_count >= MED_QUALITY_THRESHOLD:
        quality = 0.7
    else:
        quality = 0.4

    metrics = {
        "post_count": post_count,
        "avg_points": round(avg_points, 2),
        "days_since_last_post": days_since,
        "recent_within_7": recent_7,
        "deaditude_score": deaditude,
        "raw": {"hits": all_hits[:50]},
        "score_components": {
            "volume_score": round(vol_score, 2),
            "karma_score": round(karma_score, 2),
            "recency_score": round(recency_score, 2),
        },
    }

    logger.debug(
        "HN → %s: posts=%d avg_pts=%.1f deaditude=%.2f quality=%.1f",
        tech_name,
        post_count,
        avg_points,
        deaditude,
        quality,
    )

    return metrics, quality


# ---------------------------------------------------------------------------
# CLI wrapper
# ---------------------------------------------------------------------------


def _cli() -> None:
    p = argparse.ArgumentParser(
        description="Collect HN signal for a tech term"
    )
    p.add_argument("term", help="technology / language name, e.g. 'react'")
    p.add_argument("-v",
                   "--verbose",
                   action="store_true",
                   help="enable debug logging")
    args = p.parse_args()

    if args.verbose:
        logging.basicConfig(
            level=logging.DEBUG, format="%(levelname)s:%(name)s:%(message)s"
        )

    m, q = collect_hn_signals(args.term)
    print(json.dumps(m, indent=2)[:2000])
    print("quality", q)


if __name__ == "__main__":
    _cli()
