from __future__ import annotations

"""stackoverflow_collector.py
==============================
Stack Overflow collector (v2)

Public API
~~~~~~~~~~
    collect_so_signals(tag: str) -> (metrics: dict, quality: float)

CLI
~~~
    python stackoverflow_collector.py <tag> [-v | --verbose]

Passing --verbose enables DEBUG-level logging; otherwise the script is silent.
"""
# ───────────────────────── Imports ────────────────────────────
import argparse
import json
import logging
import os
import re
import time
from datetime import datetime, timezone
from statistics import median
from typing import Any, Dict, List, Tuple

import requests
from dateutil import parser as dtparse
from dotenv import load_dotenv

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
load_dotenv()

BASE_URL = "https://api.stackexchange.com/2.3/questions"
SITE = "stackoverflow"
SINCE_DAYS = int(os.getenv("SO_WINDOW_DAYS", "30"))
MAX_Q = int(os.getenv("SO_MAX_Q", "400"))
APP_KEY = os.getenv("STACK_APP_KEY")  # optional
FILTER = "!9Z(-wsMqT"  # minimal filter

logger = logging.getLogger(__name__)


class APIBanError(Exception):
    """Raised when Stack Exchange API throttles us for a prolonged period."""

    def __init__(self, seconds: int, message: str):
        self.seconds = seconds
        super().__init__(message)


# ---------------------------------------------------------------------------
# Scoring parameters (unchanged)
# ---------------------------------------------------------------------------
QUALITY_HIGH_THRESHOLD = 100
QUALITY_HIGH_VALUE = 1.0
QUALITY_MEDIUM_THRESHOLD = 30
QUALITY_MEDIUM_VALUE = 0.7
QUALITY_LOW_VALUE = 0.4
QUALITY_EMPTY_VALUE = 0.3

ANSWERED_RATIO_WEIGHT = 2.0
ACCEPTED_RATIO_WEIGHT = 1.0
ZERO_ANSWERS_WEIGHT = 1.0
RESPONSE_TIME_WEIGHT = 1.5
ACTIVITY_RECENCY_WEIGHT = 1.5

VOLUME_BONUS = 2
HIGH_VOLUME_THRESHOLD = 300

VIEW_COUNT_BONUS = 1.5
VIEW_COUNT_THRESHOLD = 50

RESPONSE_TIME_THRESHOLD = 36.0
ACTIVITY_RECENCY_THRESHOLD = 90.0

TREND_WEIGHT = 1.5
TREND_PERIODS = 3


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _fetch_page(tag: str,
                page: int,
                fromdate: int,
                todate: int) -> Dict[str, Any]:
    params = {
        "site": SITE,
        "tagged": tag,
        "fromdate": fromdate,
        "todate": todate,
        "pagesize": 100,
        "page": page,
        "order": "desc",
        "sort": "creation",
        "filter": FILTER,
    }
    if APP_KEY:
        params["key"] = APP_KEY

    delay = 1.0
    for attempt in range(4):
        resp = requests.get(BASE_URL, params=params, timeout=12)
        if resp.status_code == 200:
            js = resp.json()
            if "backoff" in js:
                logger.debug("Backoff %ss from API", js["backoff"])
                time.sleep(js["backoff"])
            return js

        if resp.status_code in (400, 429):
            txt = resp.text.lower()
            m = re.search(r"more requests available in (\d+) seconds", txt)
            if m:
                ban_seconds = int(m.group(1))
                if ban_seconds > 60:
                    raise APIBanError(
                        ban_seconds,
                        f"Stack Overflow API ban: {ban_seconds//60} min",
                    )
            logger.debug("Throttle hit, sleeping %ss", delay)
            time.sleep(delay)
            delay *= 2
            continue

        if resp.status_code in (502, 503):
            logger.debug("SO %s, retry in %ss", resp.status_code, delay)
            time.sleep(delay)
            delay *= 2
            continue

        logger.debug("SO error %s: %s", resp.status_code, resp.text[:120])
        resp.raise_for_status()

    raise RuntimeError("SO API failed repeatedly")


def _analyze_question_trends(questions: List[dict]) -> Dict[str, Any]:
    if not questions:
        return {
            "trend_direction": "insufficient_data",
            "growth_rate": 0,
            "period_counts": [],
            "period_response_times": [],
        }

    qs = sorted(questions, key=lambda q: q.get("creation_date", 0))
    oldest, newest = qs[0]["creation_date"], qs[-1]["creation_date"]
    span = newest - oldest
    if span < 86_400:
        return {
            "trend_direction": "insufficient_data",
            "growth_rate": 0,
            "period_counts": [],
            "period_response_times": [],
        }

    seg = span / TREND_PERIODS
    segments = [
        [
            q
            for q in questions
            if oldest + i * seg <= q["creation_date"] < oldest + (i + 1) * seg
        ]
        for i in range(TREND_PERIODS)
    ]
    counts = [len(s) for s in segments]

    resp_times = []
    for seg in segments:
        rs = []
        for q in seg:
            if q.get("is_answered") and q.get("answers"):
                first = q["answers"][0]["creation_date"]
                rs.append((first - q["creation_date"]) / 3600)
        resp_times.append(sum(rs) / len(rs) if rs else 0)

    if counts[0] < counts[-1]:
        direction = "increasing"
    elif counts[0] > counts[-1]:
        direction = "decreasing"
    else:
        direction = "stable"

    growth = (counts[-1] / counts[0] - 1) if counts[0] else 0
    return {
        "trend_direction": direction,
        "growth_rate": growth,
        "period_counts": counts,
        "period_response_times": resp_times,
    }


def _score(d: Dict[str, Any]) -> float:
    total_q = d["total_questions"]
    if total_q == 0:
        return 10.0
    if total_q <= 5:
        return 8.5 - ((total_q - 1) / 4) * 1.5

    s = 0.0
    volume_bonus = VOLUME_BONUS * min(1, total_q / HIGH_VOLUME_THRESHOLD)
    view_bonus = VIEW_COUNT_BONUS * min(1, d["views_avg"] /
                                        VIEW_COUNT_THRESHOLD)

    ans_r = d["answered"] / total_q
    s += ANSWERED_RATIO_WEIGHT * (1 - ans_r)

    acc_r = d["accepted"] / total_q if total_q else 0
    s += ACCEPTED_RATIO_WEIGHT * (1 - acc_r)

    zero_r = d["no_answers"] / total_q
    s += ZERO_ANSWERS_WEIGHT * zero_r

    if d["median_response_hr"] is not None:
        s += RESPONSE_TIME_WEIGHT * min(
            1, d["median_response_hr"] / RESPONSE_TIME_THRESHOLD
        )
    else:
        s += RESPONSE_TIME_WEIGHT * 0.5

    if d["last_activity"]:
        try:
            dt_last = dtparse.parse(d["last_activity"])
            days_since = (datetime.now(timezone.utc) - dt_last).days
            s += ACTIVITY_RECENCY_WEIGHT * min(
                1, days_since / ACTIVITY_RECENCY_THRESHOLD
            )
        except Exception:
            s += ACTIVITY_RECENCY_WEIGHT * 0.5
    else:
        s += ACTIVITY_RECENCY_WEIGHT

    trend = d.get("trend_metrics", {})
    td = trend.get("trend_direction", "stable")
    gr = trend.get("growth_rate", 0)
    trend_adj = 0
    if td == "increasing":
        trend_adj -= TREND_WEIGHT
    elif td == "decreasing":
        trend_adj += TREND_WEIGHT
    if gr > 1:
        trend_adj -= 0.5
    elif gr > 0.5:
        trend_adj -= 0.3
    elif gr > 0.2:
        trend_adj -= 0.2
    elif gr < -0.5:
        trend_adj += 0.5
    elif gr < -0.2:
        trend_adj += 0.3
    s += trend_adj

    final = s - volume_bonus - view_bonus
    return round(max(0, min(10, final)), 2)


def collect_so_signals(tag: str) -> Tuple[Dict[str, Any], float]:
    logger.debug("Collecting StackOverflow signals for %s", tag)
    now = int(time.time())
    from_ts = now - SINCE_DAYS * 86400
    all_q: List[dict] = []
    page = 1
    while True:
        js = _fetch_page(tag, page, from_ts, now)
        all_q.extend(js.get("items", []))
        if not js.get("has_more") or len(all_q) >= MAX_Q:
            break
        page += 1
        time.sleep(0.2)

    total = len(all_q)
    if total == 0:
        return {
            "total_questions": 0,
            "answered": 0,
            "accepted": 0,
            "no_answers": 0,
            "dupes": 0,
            "median_response_hr": None,
            "last_activity": None,
            "views_total": 0,
            "views_avg": 0,
            "views_high": 0,
            "trend_metrics": {
                "trend_direction": "insufficient_data",
                "growth_rate": 0,
                "period_counts": [],
                "period_response_times": [],
            },
            "deaditude_score": 10.0,
            "raw": {"questions": []},
        }, QUALITY_EMPTY_VALUE

    ans = acc = zero = dup = 0
    first_ans_delta = []
    views = []
    last_activity = 0
    for q in all_q:
        if q.get("is_answered"):
            ans += 1
        if q.get("accepted_answer_id"):
            acc += 1
        if q.get("answer_count", 0) == 0:
            zero += 1
        if q.get("closed_reason") == "duplicate":
            dup += 1
        if q.get("answers"):
            fa_ts = q["answers"][0]["creation_date"]
            first_ans_delta.append(fa_ts - q.get("creation_date", 0))
        views.append(q.get("view_count", 0))
        last_activity = max(last_activity, q.get("last_activity_date", 0))

    mrt = round(median(first_ans_delta) / 3600, 2) if first_ans_delta else None
    dt_last = (
        datetime.fromtimestamp(last_activity, tz=timezone.utc).isoformat()
        if last_activity
        else None
    )
    views_total = sum(views)
    views_avg = round(views_total / total, 1)
    views_high = sum(v > 1000 for v in views)

    trend_metrics = _analyze_question_trends(all_q)

    metrics = {
        "total_questions": total,
        "answered": ans,
        "accepted": acc,
        "no_answers": zero,
        "dupes": dup,
        "median_response_hr": mrt,
        "last_activity": dt_last,
        "views_total": views_total,
        "views_avg": views_avg,
        "views_high": views_high,
        "trend_metrics": trend_metrics,
        "raw": {"questions": all_q[:200]},
    }
    metrics["deaditude_score"] = _score(metrics)

    if total >= QUALITY_HIGH_THRESHOLD:
        quality = QUALITY_HIGH_VALUE
    elif total >= QUALITY_MEDIUM_THRESHOLD:
        quality = QUALITY_MEDIUM_VALUE
    else:
        quality = QUALITY_LOW_VALUE

    return metrics, quality


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------
def _cli() -> None:
    p = argparse.ArgumentParser(
        description="Collect StackOverflow tag signals"
        )
    p.add_argument("tag", help="technology tag, e.g. 'flutter'")
    p.add_argument("-v",
                   "--verbose",
                   action="store_true",
                   help="enable debug logging")
    args = p.parse_args()
    if args.verbose:
        logging.basicConfig(
            level=logging.DEBUG, format="%(levelname)s:%(name)s:%(message)s"
        )
    else:
        logging.basicConfig(level=logging.INFO)
    m, q = collect_so_signals(args.tag)
    print(json.dumps(m, indent=2)[:1500])
    print("deaditude", m["deaditude_score"])
    print("quality", q)


if __name__ == "__main__":
    _cli()
