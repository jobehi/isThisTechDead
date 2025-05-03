from __future__ import annotations

"""youtube_collector.py
========================
YouTube adoption collector (v2.0).

* CLI: `python youtube_collector.py <tech> [-v]`
"""

import logging
import math
import os
from datetime import datetime, timedelta
from typing import Any, Dict, List, Tuple

import isodate
from dotenv import load_dotenv

load_dotenv()
YOUTUBE_API_KEY: str | None = os.getenv("YOUTUBE_API_KEY")

WINDOW_DAYS = int(os.getenv("YT_WINDOW_DAYS", "60"))
MAX_PAGES = int(os.getenv("YT_MAX_PAGES", "1"))
DEV_CATS = {"27", "28"}  # Education, Science/Tech
QUERIES = ["{tech} tutorial", "{tech} course", "learn {tech}"]

logger = logging.getLogger(__name__)

# ─── Scoring constants (unchanged) ─────────────────────────────
MAX_VIDEO_COUNT_SCORE = 2.5
MAX_VIEW_SCORE = 4.0
MAX_RECENCY_SCORE = 1.5
MAX_TREND_SCORE = 2.0

VIDEO_COUNT_MULTIPLIER = 1.2

VIEWS_VERY_HIGH_THRESHOLD = 100_000
VIEWS_VERY_HIGH_SCORE = 4.0
VIEWS_HIGH_THRESHOLD = 30_000
VIEWS_HIGH_SCORE = 3.0
VIEWS_GOOD_THRESHOLD = 10_000
VIEWS_GOOD_SCORE = 2.0
VIEWS_MODERATE_THRESHOLD = 3_000
VIEWS_MODERATE_SCORE = 1.0
VIEWS_LOW_SCORE = 0.5

RECENCY_MULTIPLIER = 1.5

TREND_PERIODS = 3
TREND_GROWTH_BONUS = 1.5
TREND_GROWTH_PENALTY = 1.0
HIGH_GROWTH_THRESHOLD = 0.5
MODERATE_GROWTH_THRESHOLD = 0.2

QUALITY_HIGH_VIDEOS = 25
QUALITY_HIGH_VIEWS = 30_000
QUALITY_MED_HIGH_VIDEOS = 15
QUALITY_MED_HIGH_VIEWS = 10_000
QUALITY_MEDIUM_VIDEOS = 10
QUALITY_MEDIUM_VIEWS = 1_000

MIN_VIDEO_DURATION = 240
MIN_VIDEOS_FOR_TRENDS = 3


# ─── YouTube API client (lazy) ─────────────────────────────────
def _build_youtube_api():
    if not YOUTUBE_API_KEY:
        logger.warning("YouTube collector disabled – missing API key")
        return None
    try:
        from googleapiclient.discovery import build

        return build(
            "youtube",
            "v3",
            developerKey=YOUTUBE_API_KEY,
            cache_discovery=False,
        )
    except Exception as exc:  # pragma: no cover
        logger.warning("Cannot build YouTube client: %s", exc)
        return None


yt = _build_youtube_api()


# ─── Helpers ───────────────────────────────────────────────────
def _search(query: str, published_after: str) -> List[str]:
    if not yt:
        return []
    ids: list[str] = []
    page_token: str | None = None
    for _ in range(MAX_PAGES):
        params = {
            "q": query,
            "part": "id",
            "type": "video",
            "publishedAfter": published_after,
            "relevanceLanguage": "en",
            "maxResults": 50,
        }
        if page_token:
            params["pageToken"] = page_token
        res = yt.search().list(**params).execute()
        ids.extend(item["id"]["videoId"] for item in res.get("items", []))
        page_token = res.get("nextPageToken")
        if not page_token:
            break
    return ids


def _fetch_details(video_ids: List[str]) -> List[dict]:
    if not yt or not video_ids:
        return []
    out: list[dict] = []
    for i in range(0, len(video_ids), 50):
        chunk = video_ids[i: i + 50]
        res = (
            yt.videos()
            .list(part="snippet,statistics,contentDetails", id=",".join(chunk))
            .execute()
        )
        out.extend(res.get("items", []))
    return out


def _duration_sec(iso_dur: str) -> int:
    try:
        return int(isodate.parse_duration(iso_dur).total_seconds())
    except Exception:
        return 0


def _analyze_video_trends(videos: List[dict]) -> Dict[str, Any]:
    if len(videos) < MIN_VIDEOS_FOR_TRENDS:
        return {
            "trend_direction": "insufficient_data",
            "growth_rate": 0,
            "period_counts": [],
            "period_avg_views": [],
        }

    for v in videos:
        v.setdefault(
            "timestamp",
            datetime.strptime(
                v["snippet"]["publishedAt"], "%Y-%m-%dT%H:%M:%SZ"
            ).timestamp(),
        )

    videos.sort(key=lambda v: v["timestamp"])
    oldest, newest = videos[0]["timestamp"], videos[-1]["timestamp"]
    span = newest - oldest
    if span < 86_400:
        return {
            "trend_direction": "insufficient_data",
            "growth_rate": 0,
            "period_counts": [],
            "period_avg_views": [],
        }

    seg_len = span / TREND_PERIODS
    segments: list[list[dict]] = [[] for _ in range(TREND_PERIODS)]
    for v in videos:
        idx = min(int((v["timestamp"] - oldest) // seg_len), TREND_PERIODS - 1)
        segments[idx].append(v)

    period_counts = [len(seg) for seg in segments]
    period_avg_views = [
        (
            int(sum(int(v["statistics"].get("viewCount", 0)) for v in seg) /
                len(seg))
            if seg
            else 0
        )
        for seg in segments
    ]

    if len(set(period_counts)) == 1:
        trend = "stable"
    elif period_counts[0] < period_counts[-1]:
        trend = (
            "increasing" if
            period_counts == sorted(period_counts) else
            "growing"
        )
    else:
        trend = (
            "decreasing"
            if period_counts == sorted(period_counts, reverse=True)
            else "declining"
        )

    growth_rate = (
        (period_counts[-1] / period_counts[0] - 1)
        if period_counts[0]
        else 0
    )
    return {
        "trend_direction": trend,
        "growth_rate": growth_rate,
        "period_counts": period_counts,
        "period_avg_views": period_avg_views,
    }


# ─── Collector (public) ────────────────────────────────────────
def collect_youtube_signals(tech: Dict[str, str]) -> Tuple[Dict[str, Any],
                                                           float]:
    name = tech["name"]
    if not yt:
        return {"video_count": 0, "deaditude_score": 10.0, "raw": {}}, 0.3

    after = (
        (datetime.utcnow() - timedelta(days=WINDOW_DAYS))
        .isoformat("T") + "Z"
    )
    vid_ids: set[str] = set()
    for tmpl in QUERIES:
        vid_ids.update(_search(tmpl.format(tech=name), after))
        if len(vid_ids) >= 30:
            break

    if not vid_ids:
        return {"video_count": 0, "deaditude_score": 10.0, "raw": {}}, 0.4

    vids = _fetch_details(list(vid_ids))
    filtered = [
        v
        for v in vids
        if v["snippet"].get("categoryId") in DEV_CATS
        and _duration_sec(v["contentDetails"]["duration"]) >=
        MIN_VIDEO_DURATION
    ]
    if not filtered:
        return {"video_count": 0, "deaditude_score": 10.0, "raw": {}}, 0.4

    vc = len(filtered)
    total_views = (
        sum(int(v["statistics"].get("viewCount", 0)) for v in filtered)
    )
    avg_views = total_views / vc
    latest = max(v["snippet"]["publishedAt"] for v in filtered)
    days_since_last = (
        datetime.utcnow() - datetime.strptime(latest, "%Y-%m-%dT%H:%M:%SZ")
    ).days

    trend = _analyze_video_trends(filtered)
    trend_dir, growth_rate = trend["trend_direction"], trend["growth_rate"]

    video_count_score = min(
        MAX_VIDEO_COUNT_SCORE, math.log10(vc) * VIDEO_COUNT_MULTIPLIER
    )

    if avg_views >= VIEWS_VERY_HIGH_THRESHOLD:
        view_score = VIEWS_VERY_HIGH_SCORE
    elif avg_views >= VIEWS_HIGH_THRESHOLD:
        view_score = VIEWS_HIGH_SCORE
    elif avg_views >= VIEWS_GOOD_THRESHOLD:
        view_score = VIEWS_GOOD_SCORE
    elif avg_views >= VIEWS_MODERATE_THRESHOLD:
        view_score = VIEWS_MODERATE_SCORE
    elif avg_views > 0:
        view_score = VIEWS_LOW_SCORE
    else:
        view_score = 0.0

    recency_score = max(
        0.0, MAX_RECENCY_SCORE -
        days_since_last / WINDOW_DAYS * RECENCY_MULTIPLIER
    )

    trend_score = 0.0
    if trend_dir in ("increasing", "growing"):
        if growth_rate >= HIGH_GROWTH_THRESHOLD:
            trend_score = MAX_TREND_SCORE
        elif growth_rate >= MODERATE_GROWTH_THRESHOLD:
            trend_score = MAX_TREND_SCORE * 0.7
        else:
            trend_score = MAX_TREND_SCORE * 0.4
    elif trend_dir in ("decreasing", "declining"):
        if growth_rate <= -HIGH_GROWTH_THRESHOLD:
            trend_score = -TREND_GROWTH_PENALTY
        elif growth_rate <= -MODERATE_GROWTH_THRESHOLD:
            trend_score = -TREND_GROWTH_PENALTY * 0.7
        else:
            trend_score = -TREND_GROWTH_PENALTY * 0.4

    alive = video_count_score + view_score + recency_score + trend_score
    deaditude = round(min(max(10 - alive, 0), 10), 2)

    if vc >= QUALITY_HIGH_VIDEOS and avg_views >= QUALITY_HIGH_VIEWS:
        quality = 1.0
    elif vc >= QUALITY_MED_HIGH_VIDEOS or avg_views >= QUALITY_MED_HIGH_VIEWS:
        quality = 0.9
    elif vc >= QUALITY_MEDIUM_VIDEOS or avg_views >= QUALITY_MEDIUM_VIEWS:
        quality = 0.7
    else:
        quality = 0.4

    metrics = {
        "video_count": vc,
        "total_views": total_views,
        "avg_views_per_video": round(avg_views, 1),
        "days_since_last_upload": days_since_last,
        "video_count_score": round(video_count_score, 2),
        "view_score": round(view_score, 2),
        "recency_score": round(recency_score, 2),
        "trend_score": round(trend_score, 2),
        "trend_metrics": trend,
        "deaditude_score": deaditude,
        "raw": {"videos": filtered[:100]},
    }

    print(
        f"YouTube → {name}: count={vc}, views={int(avg_views)}, "
        f"trend={trend_dir}, deaditude={deaditude}, quality={quality}"
    )
    return metrics, quality


# ─── CLI ───────────────────────────────────────────────────────
def _cli():
    import argparse
    import pprint
    import logging

    p = argparse.ArgumentParser(description="YouTube adoption collector")
    p.add_argument("tech", nargs="?", default="python", help="Technology name")
    p.add_argument("-v",
                   "--verbose",
                   action="store_true",
                   help="enable debug logging")
    args = p.parse_args()
    if args.verbose:
        logging.basicConfig(
            level=logging.DEBUG, format="%(levelname)s:%(name)s:%(message)s"
        )
    data, q = collect_youtube_signals({"name": args.tech})
    pprint.pprint(data)
    print("quality", q)


if __name__ == "__main__":
    _cli()
