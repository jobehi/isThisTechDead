from __future__ import annotations

"""db_gateway.py
=================
Supabase persistence layer & snapshot inserter.

"""

import logging
import os
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv
from postgrest.exceptions import APIError
from supabase import Client, create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

ENABLE_REVALIDATION = os.getenv("ENABLE_REVALIDATION",
                                "true").lower() == "true"
DEBUG_LOGGING = os.getenv("DEBUG_LOGGING", "false").lower() == "true"

logger = logging.getLogger(__name__)
if DEBUG_LOGGING and not logger.handlers:
    logging.basicConfig(
        level=logging.DEBUG, format="%(levelname)s:%(name)s:%(message)s"
    )


# ---------------------------------------------------------------------------
#  Helpers
# ---------------------------------------------------------------------------
def _now_iso() -> str:
    return datetime.utcnow().isoformat()


def _today_iso() -> str:
    return datetime.utcnow().date().isoformat()


def _sanitize_github(raw: Dict[str, Any]) -> Dict[str, Any]:
    data = raw.copy()
    if "raw" in data:
        del data["raw"]
    if "statistics" in data and "contributors" in data["statistics"]:
        contributors = data["statistics"]["contributors"]
        data["statistics"]["contributor_count"] = len(contributors)
        del data["statistics"]["contributors"]
    return data


def _get_verdict(score: float) -> str:
    try:
        from engine.cli import get_verdict  # local project import

        return get_verdict(score)
    except Exception:
        # fallback inline implementation
        if score < 30:
            return "Very Alive"
        if score < 50:
            return "Alive"
        if score < 70:
            return "Stable"
        if score < 85:
            return "Declining"
        return "Dead"


# ---------------------------------------------------------------------------
#  Snapshot insertion
# ---------------------------------------------------------------------------
def insert_snapshot(
    tech_id: str,
    tech_name: str,
    metrics: Dict[str, Dict[str, Any]],
    score_data: Dict[str, Any],
) -> None:
    # Guard: tech exists
    if (
        not supabase.table("tech_registry")
        .select("id")
        .eq("id", tech_id)
        .execute()
        .data
    ):
        raise ValueError(f"Tech ID '{tech_id}' not found in tech_registry.")

    verdict = score_data.get("verdict") or _get_verdict(
        score_data.get("overall_score", 50)
    )
    snapshot: Dict[str, Any] = {
        "tech_id": tech_id,
        "tech_name": tech_name,
        "snapshot_date": _today_iso(),
        "created_at": _now_iso(),
        "deaditude_score": score_data.get("overall_score", 5.0),
        "component_scores": score_data.get("components", {}),
        "confidence_score": int(score_data.get("confidence", 70)),
        "verdict": verdict,
    }

    # --- GitHub (structured & raw copy sans heavy data) --------------------
    gh_data = metrics.get("github") or {}
    snapshot["github_metrics"] = _sanitize_github(gh_data) if gh_data else {}
    # Convenience scalar fields (kept identical to original logic)
    gh = gh_data
    contrib_count = (
        gh.get("statistics", {}).get("contributor_count")
        or len(gh.get("statistics", {}).get("contributors", []))
        or gh.get("contributor_count")
        or 0
    )
    commits_30d = (
        gh.get("commits_last_30d")
        or gh.get("statistics", {}).get("commit_count_30d")
        or gh.get("commit_count_30d")
        or 0
    )
    last_commit_days = (
        gh.get("days_since_last_commit")
        or gh.get("statistics", {}).get("days_since_last_commit")
        or gh.get("last_commit_days")
        or gh.get("last_activity_days")
        or 0
    )
    issues_closed_ratio = (
        gh.get("issues_closed_ratio")
        or gh.get("statistics", {}).get("issues_closed_ratio")
        or gh.get("closed_issues_ratio")
        or 0
    )
    snapshot.update(
        {
            "github_stars": gh.get("stars", 0),
            "github_forks": gh.get("forks", 0),
            "github_commits_last_month": commits_30d,
            "github_issues_open": gh.get("open_issues", 0),
            "github_issues_closed_ratio": issues_closed_ratio,
            "github_days_since_last_commit": last_commit_days,
            "github_contributors_count": contrib_count,
            "github_trend_direction": gh.get("trend_direction")
            or gh.get("trend_metrics", {}).get("trend_direction", "stable"),
            "github_trend_growth_rate": gh.get("trend_growth_rate")
            or gh.get("trend_metrics", {}).get("growth_rate", 0),
            "github_quality": gh.get("quality", 0.7),
        }
    )

    # --- Simple passthrough JSONB columns ----------------------------------
    snapshot.update(
        {
            "reddit_metrics": metrics.get("reddit", {}),
            "hn_metrics": metrics.get("hn", {}),
            "so_metrics": metrics.get("stackoverflow", {}),
            "youtube_metrics": metrics.get("youtube", {}),
            "stackshare_metrics": metrics.get("companies")
            or metrics.get("stackshare", {}),
            "google_jobs": metrics.get("jobs") or
            metrics.get("google_jobs", {}),
        }
    )

    # The rest of the per‑source scalar extraction code has been collapsed
    # into helper functions to avoid ~300 repetitive lines.  **No fields were
    # removed** – they are calculated exactly the same as before.
    _augment_so(snapshot, metrics.get("stackoverflow", {}))
    _augment_youtube(snapshot, metrics.get("youtube", {}))
    _augment_reddit(snapshot, metrics.get("reddit", {}))
    _augment_hn(snapshot, metrics.get("hn", {}))
    _augment_stackshare(
        snapshot, metrics.get("companies") or metrics.get("stackshare", {})
    )
    _augment_jobs(snapshot,
                  metrics.get("jobs") or metrics.get("google_jobs", {}))

    if DEBUG_LOGGING:
        logger.debug(
            "Snapshot prepared: %s",
            {k: v for k, v in snapshot.items() if not k.endswith("_metrics")},
        )

    # Write to DB
    try:
        supabase.table("tech_snapshots_v2").insert(snapshot).execute()
        if ENABLE_REVALIDATION:
            _try_revalidate(tech_id)
    except APIError:
        raise  # critical
    except Exception as exc:
        logger.error("Unexpected DB error inserting snapshot: %s", exc)
        raise


# ---------------------------------------------------------------------------
#  Per‑source augment helpers (collapsed logic, same outputs)
# ---------------------------------------------------------------------------
def _augment_so(dest: Dict[str, Any], so: Dict[str, Any]) -> None:
    total = so.get("total_questions", 0)
    trend = so.get("trend_metrics", {})
    last_activity_days = 0
    if iso := so.get("last_activity"):
        try:
            dt = datetime.fromisoformat(iso)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            last_activity_days = (datetime.now(timezone.utc) - dt).days
        except Exception:
            pass
    dest.update(
        {
            "so_trend_direction": trend.get("direction", "stable"),
            "so_trend_growth_rate": trend.get("growth_rate", 0),
            "so_period_counts": trend.get("period_counts", {}),
            "so_total_questions": total,
            "so_answered_ratio": (so.get("answered", 0) / total)
            if total else 0,
            "so_accepted_ratio": (so.get("accepted", 0) / total)
            if total else 0,
            "so_zero_answer_ratio": (so.get("no_answers", 0) / total)
            if total else 0,
            "so_median_response_hr": so.get("median_response_hr", 0),
            "so_last_activity_days": last_activity_days,
            "so_quality": so.get("quality", 0.5),
        }
    )


def _augment_youtube(dest: Dict[str, Any], yt: Dict[str, Any]) -> None:
    dest.update(
        {
            "youtube_trend_direction": yt.get("trend_direction", "stable"),
            "youtube_trend_growth_rate": yt.get("growth_rate", 0),
            "youtube_period_counts": yt.get("period_counts", {}),
            "youtube_video_count": yt.get("video_count", 0),
            "youtube_avg_views": yt.get("avg_views")
            or yt.get("avg_views_per_video", 0),
            "youtube_days_since_last": yt.get("days_since_last", 0),
            "youtube_quality": yt.get("quality", 0.5),
        }
    )


def _augment_reddit(dest: Dict[str, Any], rd: Dict[str, Any]) -> None:
    engagement = rd.get("engagement_metrics", {})
    trend = rd.get("trend_metrics", {})
    subreddit = rd.get("subreddit_metrics", {})
    dest.update(
        {
            "reddit_post_count": rd.get("post_count", 0),
            "reddit_avg_upvotes": engagement.get(
                "avg_score", engagement.get("avg_upvotes", 0)
            ),
            "reddit_comments_per_post": engagement.get("avg_comments", 0),
            "reddit_days_since_last": subreddit.get("days_since_last_post", 0),
            "reddit_trend_direction": trend.get(
                "trend_direction", trend.get("direction", "stable")
            ),
            "reddit_trend_growth_rate": trend.get("growth_rate", 0),
            "reddit_quality": rd.get("quality", 0.5),
        }
    )


def _augment_hn(dest: Dict[str, Any], hn: Dict[str, Any]) -> None:
    dest.update(
        {
            "hn_post_count": hn.get("post_count", 0),
            "hn_avg_points": hn.get("avg_points", 0),
            "hn_avg_comments": hn.get("avg_comments", 0),
            "hn_days_since_last": hn.get("days_since_last_post", 0),
            "hn_trend_direction": hn.get("trend_direction", "stable"),
            "hn_quality": hn.get("quality", 0.4),
        }
    )


def _augment_stackshare(dest: Dict[str, Any], ss: Dict[str, Any]) -> None:
    dest.update(
        {
            "stackshare_stacks_count": ss.get("company_count", 0),
            "stackshare_followers": ss.get("followers", 0),
            "stackshare_upvotes": ss.get("upvotes", 0),
            "stackshare_mentions": ss.get("mentions", 0),
            "stackshare_quality": ss.get("quality", 0.5),
        }
    )


def _augment_jobs(dest: Dict[str, Any], jobs: Dict[str, Any]) -> None:
    dest.update(
        {
            "google_jobs_count": jobs.get("total_jobs", 0),
            "google_jobs_trend_direction": jobs.get("trend_direction",
                                                    "stable"),
            "google_jobs_trend_growth_rate": jobs.get("growth_rate", 0),
            "google_jobs_quality": jobs.get("quality", 0.5),
        }
    )


def _try_revalidate(tech_id: str) -> None:
    try:
        from packages.db.revalidate import revalidate_tech

        revalidate_tech(tech_id)
    except ImportError:
        if DEBUG_LOGGING:
            logger.debug("Revalidate module not found – skipping")
    except Exception as exc:
        logger.debug("Revalidate failed but is non‑critical: %s", exc)


# ---------------------------------------------------------------------------
#  Registry helpers
# ---------------------------------------------------------------------------
def update_last_checked(tech_id: str) -> None:
    supabase.table("tech_registry").update({"last_checked": _now_iso()}).eq(
        "id", tech_id
    ).execute()


def get_registry(limit: int = 1000, offset: int = 0) -> List[Dict[str, Any]]:
    try:
        result = (
            supabase.table("tech_registry")
            .select("*")
            .order("last_checked", desc=False, nullsfirst=True)
            .range(offset, offset + limit - 1)
            .execute()
        )
        return result.data or []
    except Exception as exc:
        logger.error("Error fetching registry: %s", exc)
        return []


def update_tech(tech_id: str, fields: Dict[str, Any]) -> None:
    supabase.table("tech_registry").update(fields).eq("id", tech_id).execute()


def register_tech(tech_id: str, fields: Dict[str, Any]) -> None:
    supabase.table("tech_registry").insert({"id": tech_id, **fields}).execute()


def delete_tech(tech_id: str) -> None:
    supabase.table("tech_registry").delete().eq("id", tech_id).execute()


def register_techs(tech_list: List[Dict[str, Any]]) -> None:
    for tech in tech_list:
        tech.setdefault("id", tech["name"].lower().replace(" ", "-"))
        tech["last_checked"] = None
    supabase.table("tech_registry").upsert(tech_list,
                                           on_conflict=["id"]).execute()


def get_tech(tech_id: str) -> Optional[Dict[str, Any]]:
    try:
        res = supabase.table("tech_registry").select("*").eq("id",
                                                             tech_id).execute()
        return res.data[0] if res.data else None
    except Exception as exc:
        logger.error("Error fetching tech %s: %s", tech_id, exc)
        return None
