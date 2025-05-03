from __future__ import annotations

"""jobs_collector.py
====================
Collect current job openings signal for a programming language / framework.

*   Primary source **Adzuna REST v1** across a configurable country list.
*   Fallback - Google Custom Search scrape.
*   Returns``(metrics, quality)``
CLI usage
~~~~~~~~~
```
python jobs_collector.py <tech-term> [-v | --verbose]
```
"""

from collections.abc import Mapping
from typing import Any, Dict, Tuple
import argparse
import json
import logging
import os
import re
import time

import requests
from dotenv import load_dotenv

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

load_dotenv()

ADZ_APP_ID: str | None = os.getenv("ADZUNA_APP_ID")
ADZ_APP_KEY: str | None = os.getenv("ADZUNA_APP_KEY")
ADZ_COUNTRIES: list[str] = os.getenv("ADZ_COUNTRIES",
                                     "us,gb,ca,fr,de,in").split(",")

GOOGLE_API_KEY: str | None = os.getenv("GOOGLE_API_KEY")
CSE_ID: str | None = os.getenv("SEARCH_ENGINE_ID")

HEADERS = {"User-Agent": "deaditude-jobs-collector/2.0"}
MAX_HTML = 5_000

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Scoring parameters - to tweak if needed
# ---------------------------------------------------------------------------

JOBS_VERY_HIGH_THRESHOLD = 100_000
JOBS_HIGH_THRESHOLD = 50_000
JOBS_GOOD_THRESHOLD = 20_000
JOBS_MODERATE_THRESHOLD = 5_000
JOBS_LOW_THRESHOLD = 1_000
JOBS_VERY_LOW_THRESHOLD = 100

JOBS_VERY_HIGH_SCORE = 1.0
JOBS_HIGH_SCORE = 2.5
JOBS_GOOD_SCORE = 4.0
JOBS_MODERATE_SCORE = 5.5
JOBS_LOW_SCORE = 7.0
JOBS_VERY_LOW_SCORE = 8.5
JOBS_NONE_SCORE = 10.0

QUALITY_HIGH_THRESHOLD = 4
QUALITY_HIGH_VALUE = 1.0
QUALITY_MED_HIGH_THRESHOLD = 2
QUALITY_MED_HIGH_VALUE = 0.7
QUALITY_MED_THRESHOLD = 1
QUALITY_MED_VALUE = 0.4
QUALITY_LOW_VALUE = 0.2

# ---------------------------------------------------------------------------
# Adzuna helper
# ---------------------------------------------------------------------------


def _adzuna_jobs(term: str, cc: str) -> Tuple[int, str]:
    """Return (count, trimmed_raw_json) or (-1, reason)."""
    if not (ADZ_APP_ID and ADZ_APP_KEY):
        return -1, "missing credentials"

    url = f"https://api.adzuna.com/v1/api/jobs/{cc}/search/1"
    params = {
        "app_id": ADZ_APP_ID,
        "app_key": ADZ_APP_KEY,
        "results_per_page": 1,
        "what": term,
        "content-type": "application/json",
    }
    try:
        logger.debug("Adzuna %s – %s", cc, term)
        r = requests.get(url, params=params, headers=HEADERS, timeout=10)
        if r.status_code == 403:
            return -1, "quota"
        if r.status_code != 200:
            return -1, f"{r.status_code}"
        js = r.json()
        return js.get("count", 0), json.dumps(js)[:MAX_HTML]
    except Exception as exc:  # pragma: no cover – network
        return -1, str(exc)


# ---------------------------------------------------------------------------
# Google CSE fallback
# ---------------------------------------------------------------------------


_G_PATTERN = re.compile(r"([\d,]+)\s+jobs available", re.I)


def _google_jobs(term: str) -> Tuple[int, str]:
    if not (GOOGLE_API_KEY and CSE_ID):
        return 0, "missing creds"

    url = "https://www.googleapis.com/customsearch/v1"
    params = {
        "key": GOOGLE_API_KEY,
        "cx": CSE_ID,
        "q": f'"{term}" jobs Indeed "Employment"',
        "num": 10,
        "gl": "us",
        "hl": "en",
    }
    try:
        logger.debug("Google CSE – %s", term)
        r = requests.get(url, params=params, timeout=10)
        if r.status_code != 200:
            return 0, f"http {r.status_code}"
        for it in r.json().get("items", []):
            m = _G_PATTERN.search(it.get("snippet", ""))
            if m:
                return int(m.group(1).replace(",",
                                              "")), json.dumps(it)[:MAX_HTML]
    except Exception as exc:  # pragma: no cover – network
        return 0, str(exc)
    return 0, "no‑match"


# ---------------------------------------------------------------------------
# Collector
# ---------------------------------------------------------------------------


def collect_jobs_signals(tech: Mapping[str,
                                       Any]) -> Tuple[Dict[str, Any], float]:
    term = tech["name"]
    metrics: Dict[str, Any] = {"by_country": {}, "source": "adzuna"}
    raw: Dict[str, Any] = {}
    successes = 0

    if ADZ_APP_ID and ADZ_APP_KEY:
        for cc in ADZ_COUNTRIES:
            cnt, blob = _adzuna_jobs(term, cc)
            if cnt >= 0:
                metrics["by_country"][cc] = cnt
                raw[cc] = blob
                successes += 1
            time.sleep(0.2)  # stay friendly
    else:
        logger.debug("No Adzuna creds – fallback to Google CSE")
        cnt, blob = _google_jobs(term)
        metrics["by_country"]["google"] = cnt
        raw["google"] = blob
        metrics["source"] = "google_cse"
        successes = 1 if cnt else 0

    total = sum(metrics["by_country"].values())
    metrics["total_jobs"] = total
    metrics["raw"] = raw

    # Deaditude score (lower = healthier job market)
    if total >= JOBS_VERY_HIGH_THRESHOLD:
        deaditude = JOBS_VERY_HIGH_SCORE
    elif total >= JOBS_HIGH_THRESHOLD:
        deaditude = JOBS_HIGH_SCORE
    elif total >= JOBS_GOOD_THRESHOLD:
        deaditude = JOBS_GOOD_SCORE
    elif total >= JOBS_MODERATE_THRESHOLD:
        deaditude = JOBS_MODERATE_SCORE
    elif total >= JOBS_LOW_THRESHOLD:
        deaditude = JOBS_LOW_SCORE
    elif total >= JOBS_VERY_LOW_THRESHOLD:
        deaditude = JOBS_VERY_LOW_SCORE
    else:
        deaditude = JOBS_NONE_SCORE

    metrics["deaditude_score"] = deaditude

    # Quality metric
    if successes >= QUALITY_HIGH_THRESHOLD:
        quality = QUALITY_HIGH_VALUE
    elif successes >= QUALITY_MED_HIGH_THRESHOLD:
        quality = QUALITY_MED_HIGH_VALUE
    elif successes >= QUALITY_MED_THRESHOLD:
        quality = QUALITY_MED_VALUE
    else:
        quality = QUALITY_LOW_VALUE

    logger.debug(
        "Jobs → %s: total=%d deaditude=%.1f quality=%.1f",
        term,
        total,
        deaditude,
        quality,
    )
    return metrics, quality


# ---------------------------------------------------------------------------
# CLI wrapper
# ---------------------------------------------------------------------------


def _cli() -> None:
    p = argparse.ArgumentParser(description="Collect job-market" +
                                "signal for a tech term")
    p.add_argument("term", help="technology / language name, e.g. 'flutter'")
    p.add_argument("-v", "--verbose", action="store_true",
                   help="enable debug logging")
    args = p.parse_args()

    if args.verbose:
        logging.basicConfig(
            level=logging.DEBUG, format="%(levelname)s:%(name)s:%(message)s"
        )

    m, q = collect_jobs_signals({"name": args.term})
    print("deaditude", m["deaditude_score"])
    print("quality", q)


if __name__ == "__main__":
    _cli()
