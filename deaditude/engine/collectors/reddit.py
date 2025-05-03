from __future__ import annotations

"""reddit_collector.py
=======================
Robust, raw-preserving Reddit collector (v2).

* ``collect_reddit_signals(tech) -> (metrics, quality)``
"""

# ───────────────────────── Imports ────────────────────────────
import argparse
import json
import logging
import os
import re
import statistics
import time
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional, Tuple

import praw
from dotenv import load_dotenv
from textblob import TextBlob

load_dotenv()

# ---------------------------------------------------------------------------
# Configuration (same env vars as original)
# ---------------------------------------------------------------------------
REDDIT_CLIENT_ID = os.getenv("REDDIT_CLIENT_ID")
REDDIT_CLIENT_SECRET = os.getenv("REDDIT_CLIENT_SECRET")

SINCE_DAYS = int(os.getenv("REDDIT_WINDOW_DAYS", "30"))
POST_LIMIT = int(os.getenv("REDDIT_MAX_POSTS", "500"))

DEV_FALLBACK_SUBS = [
    "programming",
    "webdev",
    "learnprogramming",
    "devops",
    "cscareerquestions",
]

MIGRATION_RE = re.compile(
    r"""\b(migrat|leaving|abandon|alternativ|is it dead|quit|rewrite|switch|
               dropping|replacing|ditching)\b""",
    re.I | re.VERBOSE,
)

MANUAL_MAP = {
    "flutter": "flutterdev",
    "react native": "reactnative",
    "vue": "vuejs",
    "vue.js": "vuejs",
    "react": "reactjs",
    "angularjs": "Angular2",
    "angular": "Angular2",
    "backbone": "backbonejs",
    "backbone.js": "backbonejs",
    "jquery": "jquery",
    "typescript": "typescript",
    "python": "python",
}

# ---------------------------------------------------------------------------
# Scoring thresholds (verbatim)
# ---------------------------------------------------------------------------
MAX_SUBSCRIBERS = 1_000_000
HIGH_SUB_COUNT = 100_000
MED_SUB_COUNT = 20_000
LOW_SUB_COUNT = 5_000
VERY_LOW_SUB_COUNT = 1_000

HIGH_POST_VOLUME = 50
MED_POST_VOLUME = 20
LOW_POST_VOLUME = 10
VERY_LOW_POST_VOLUME = 5

HIGH_ENGAGEMENT = 50
MED_ENGAGEMENT = 20
LOW_ENGAGEMENT = 10
VERY_LOW_ENGAGEMENT = 5

SUBSCRIBER_WEIGHT = 0.15
POST_VOLUME_WEIGHT = 0.15
TREND_WEIGHT = 0.35
SENTIMENT_WEIGHT = 0.15  # kept for future use
ENGAGEMENT_WEIGHT = 0.10
MIGRATION_WEIGHT = 0.10

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Reddit client
# ---------------------------------------------------------------------------
def _init_reddit() -> Optional[praw.Reddit]:
    if not (REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET):
        logger.debug("Missing Reddit API credentials")
        return None
    try:
        reddit = praw.Reddit(
            client_id=REDDIT_CLIENT_ID,
            client_secret=REDDIT_CLIENT_SECRET,
            user_agent="deaditude-reddit-collector/2.0",
        )
        logger.debug("Reddit client initialised")
        return reddit
    except Exception as exc:
        logger.debug("Error initialising Reddit client: %s", exc)
        return None


reddit = _init_reddit()


# ---------------------------------------------------------------------------
# Helper functions (logic unchanged)
# ---------------------------------------------------------------------------
def _sentiment(txt: str) -> float:
    try:
        return TextBlob(txt).sentiment.polarity
    except Exception:
        return 0.0


def _find_best_sub(term: str) -> Optional[str]:
    if not reddit:
        return None
    try:
        matches = list(reddit.subreddits.search(term, limit=5))
        matches.sort(key=lambda s: getattr(s, "subscribers", 0), reverse=True)
        for sub in matches:
            if term.lower() in sub.display_name.lower():
                return sub.display_name
        return matches[0].display_name if matches else None
    except Exception as exc:
        logger.debug("Find‑sub error: %s", exc)
        return None


def _get_subreddit_stats(name: str) -> Dict[str, Any]:
    if not reddit:
        return {}
    try:
        sub = reddit.subreddit(name)
        return {
            "display_name": sub.display_name,
            "subscribers": sub.subscribers,
            "active_users": getattr(sub, "active_user_count", 0),
            "created_utc": sub.created_utc,
            "description": (
                sub.description[:500] if
                hasattr(sub, "description") else ""
            ),
            "over18": sub.over18,
            "url": f"https://www.reddit.com{sub.url}",
            "age_days": (
                (datetime.utcnow().timestamp() - sub.created_utc) / 86400
            ),
        }
    except Exception as exc:
        logger.debug("Subreddit stats error: %s", exc)
        return {}


def _calc_engagement(posts: List[dict]) -> Dict[str, Any]:
    if not posts:
        return {"avg_score": 0, "median_score": 0, "max_score": 0}
    scores = [p["score"] for p in posts]
    return {
        "avg_score": sum(scores) / len(scores),
        "median_score": statistics.median(scores),
        "max_score": max(scores),
        "posts_with_high_engagement": (
            sum(s >= HIGH_ENGAGEMENT for s in scores)
            ),
        "posts_with_med_engagement": sum(
            MED_ENGAGEMENT <= s < HIGH_ENGAGEMENT for s in scores
        ),
        "posts_with_low_engagement": sum(
            LOW_ENGAGEMENT <= s < MED_ENGAGEMENT for s in scores
        ),
    }


def _trend_metrics(posts: List[dict]) -> Dict[str, Any]:
    if len(posts) < 3:
        return {"trend_direction": "insufficient_data"}
    posts_sorted = sorted(posts, key=lambda p: p["created"])
    oldest, newest = posts_sorted[0]["created"], posts_sorted[-1]["created"]
    span = newest - oldest
    if span < 86_400:
        return {"trend_direction": "insufficient_data"}
    seg = span / 3
    buckets = [
        [p for p in posts if
         oldest + i * seg <= p["created"] < oldest + (i + 1) * seg]
        for i in range(3)
    ]
    counts = [len(b) for b in buckets]
    avg_scores = [sum(p["score"] for p in b) / len(b) if
                  b else 0 for b in buckets]
    if counts[0] < counts[1] < counts[2]:
        direction = "increasing"
    elif counts[0] > counts[1] > counts[2]:
        direction = "decreasing"
    else:
        direction = "stable"
    growth = (counts[2] / counts[0] - 1) if counts[0] else 0
    return {
        "trend_direction": direction,
        "growth_rate": growth,
        "segment_counts": counts,
        "segment_avg_scores": avg_scores,
    }


def _activity_score(
    stats: Dict[str, Any],
    post_count: int,
    engagement: Dict[str, Any],
    trend: Dict[str, Any],
) -> float:
    subs = stats.get("subscribers", 0)
    if subs >= HIGH_SUB_COUNT:
        sub_score = 3.0
    elif subs >= MED_SUB_COUNT:
        sub_score = 2.0
    elif subs >= LOW_SUB_COUNT:
        sub_score = 1.0
    elif subs >= VERY_LOW_SUB_COUNT:
        sub_score = 0.5
    else:
        sub_score = 0.0

    if post_count >= HIGH_POST_VOLUME:
        vol_score = 3.0
    elif post_count >= MED_POST_VOLUME:
        vol_score = 2.0
    elif post_count >= LOW_POST_VOLUME:
        vol_score = 1.0
    elif post_count >= VERY_LOW_POST_VOLUME:
        vol_score = 0.5
    else:
        vol_score = 0.0

    avg_score = engagement["avg_score"]
    if avg_score >= HIGH_ENGAGEMENT:
        eng_score = 2.0
    elif avg_score >= MED_ENGAGEMENT:
        eng_score = 1.5
    elif avg_score >= LOW_ENGAGEMENT:
        eng_score = 1.0
    elif avg_score >= VERY_LOW_ENGAGEMENT:
        eng_score = 0.5
    else:
        eng_score = 0.0

    tr_dir = trend.get("trend_direction", "stable")
    growth = trend.get("growth_rate", 0)
    tr_score = (
        1.5 if tr_dir == "increasing" else
        0.8 if tr_dir == "stable" else
        0.0
    )
    if growth > 1.0:
        tr_score += 1.0
    elif growth > 0.5:
        tr_score += 0.3
    elif growth > 0.2:
        tr_score += 0.2
    elif growth < -0.2:
        tr_score -= 0.3
    tr_score = max(0, min(3.0, tr_score))

    total = (
        (sub_score / 3) * 10 * SUBSCRIBER_WEIGHT
        + (vol_score / 3) * 10 * POST_VOLUME_WEIGHT
        + (eng_score / 2) * 10 * ENGAGEMENT_WEIGHT
        + (tr_score / 2) * 10 * TREND_WEIGHT
    )
    return total


# ---------------------------------------------------------------------------
# Main collector
# ---------------------------------------------------------------------------
def collect_reddit_signals(tech) -> Tuple[Dict[str, Any], float]:
    if isinstance(tech, str):
        tech_name = tech
        specified_sub = None
    else:
        tech_name = tech["name"]
        specified_sub = tech.get("subreddit")

    official_sub = (
        specified_sub or
        MANUAL_MAP.get(tech_name.lower()) or
        _find_best_sub(tech_name)
    )
    sub_stats = _get_subreddit_stats(official_sub) if official_sub else {}

    since_epoch = int((datetime.utcnow() -
                       timedelta(days=SINCE_DAYS)).timestamp())
    posts: List[dict] = []

    if official_sub and reddit:
        try:
            sub = reddit.subreddit(official_sub)
            for p in sub.top(time_filter="month", limit=POST_LIMIT // 2):
                if p.created_utc < since_epoch:
                    continue
                posts.append(
                    {
                        "title": p.title,
                        "score": p.score,
                        "created": p.created_utc,
                        "url": p.url,
                        "sub": p.subreddit.display_name,
                        "num_comments": p.num_comments,
                        "upvote_ratio": getattr(p, "upvote_ratio", None),
                    }
                )
            for p in sub.new(limit=POST_LIMIT // 2):
                if (
                    p.created_utc < since_epoch or
                    any(e["url"] == p.url for e in posts)
                ):
                    continue
                posts.append(
                    {
                        "title": p.title,
                        "score": p.score,
                        "created": p.created_utc,
                        "url": p.url,
                        "sub": p.subreddit.display_name,
                        "num_comments": p.num_comments,
                        "upvote_ratio": getattr(p, "upvote_ratio", None),
                    }
                )
        except Exception as exc:
            logger.debug("PRAW fetch error: %s", exc)

    if reddit and len(posts) < 10 and not specified_sub:
        for sub_name in DEV_FALLBACK_SUBS:
            try:
                sub = reddit.subreddit(sub_name)
                for p in sub.search(
                    tech_name,
                    limit=POST_LIMIT // len(DEV_FALLBACK_SUBS),
                    params={"syntax": "plain"},
                ):
                    if p.created_utc < since_epoch:
                        continue
                    posts.append(
                        {
                            "title": p.title,
                            "score": p.score,
                            "created": p.created_utc,
                            "url": p.url,
                            "sub": p.subreddit.display_name,
                            "num_comments": p.num_comments,
                            "upvote_ratio": getattr(p, "upvote_ratio", None),
                        }
                    )
                if len(posts) >= POST_LIMIT:
                    break
            except Exception as exc:
                logger.debug("Fallback sub error: %s", exc)
            time.sleep(0.25)

    if not posts:
        return {
            "post_count": 0,
            "avg_sentiment": 0,
            "migration_mentions": 0,
            "subreddit_metrics": sub_stats,
            "engagement_metrics": {},
            "trend_metrics": {"trend_direction": "insufficient_data"},
            "deaditude_score": 10.0,
            "raw": {"posts": []},
        }, 0.3

    sentiments = [_sentiment(p["title"]) for p in posts]
    avg_sent = sum(sentiments) / len(sentiments) if sentiments else 0
    migration_hits = sum(bool(MIGRATION_RE.search(p["title"])) for p in posts)

    engagement = _calc_engagement(posts)
    trend = _trend_metrics(posts)

    activity = _activity_score(sub_stats, len(posts), engagement, trend)

    sentiment_score = max(0, min(10, (avg_sent + 1) * 5))
    migration_penalty = min(5, migration_hits)

    alive_score = (
        activity * (1 - TREND_WEIGHT - MIGRATION_WEIGHT)
        + sentiment_score * TREND_WEIGHT
        - migration_penalty * MIGRATION_WEIGHT * 2
    )
    alive_score = max(0, min(10, alive_score))

    if alive_score > 7:
        deaditude = round(10 - alive_score, 2)
    else:
        deaditude = round(10 - alive_score * 1.5, 2)
        if (
            trend.get("trend_direction") == "increasing"
            and trend.get("growth_rate", 0) > 0.5
        ):
            deaditude = min(3.0, deaditude)

    quality = (
        1.0 if len(posts) >= 15 and
        official_sub else
        0.7 if len(posts) >= 5 else 0.4
    )

    metrics = {
        "post_count": len(posts),
        "avg_sentiment": round(avg_sent, 3),
        "migration_mentions": migration_hits,
        "subreddit_metrics": sub_stats,
        "engagement_metrics": engagement,
        "trend_metrics": trend,
        "deaditude_score": deaditude,
        "raw": {"posts": posts[:100]},
    }
    return metrics, quality


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------
def _cli() -> None:
    p = argparse.ArgumentParser(description="Collect Reddit tech signal")
    p.add_argument("term", help="technology name, e.g. 'svelte'")
    p.add_argument("-v", "--verbose",
                   action="store_true",
                   help="enable debug logging")
    args = p.parse_args()

    if args.verbose:
        logging.basicConfig(
            level=logging.DEBUG, format="%(levelname)s:%(name)s:%(message)s"
        )
    else:
        logging.basicConfig(level=logging.INFO)

    m, q = collect_reddit_signals(args.term)
    print(json.dumps(m, indent=2)[:2000])
    print("quality", q)


if __name__ == "__main__":
    _cli()
