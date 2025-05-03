from __future__ import annotations

"""
github_collector.py - lean, fault-tolerant GitHub metrics collector (v2)
============================================================================
* Preserves raw GraphQL & REST payloads in the returned dict
* CLI smoke-test:

      python github_collector.py <owner> <repo> [-v | --verbose]

  Use -v/--verbose to activate DEBUG logging & pretty-print the metrics.
"""

# ───────────────────────── Imports ────────────────────────────
import argparse
import json
import logging
import os
import time
from collections.abc import Mapping
from datetime import datetime, timedelta, timezone
from pprint import pprint
from typing import Any, Dict, Optional, Tuple

import requests
from dateutil import parser as dtparse
from dotenv import load_dotenv

# ───────────────────── Configuration ──────────────────────────
load_dotenv()

GQL_ENDPOINT = "https://api.github.com/graphql"
REST_ROOT = "https://api.github.com"
TOKEN: str | None = os.getenv("GITHUB_PAT")

logger = logging.getLogger(__name__)

HEADERS_GQL = {"Authorization": f"Bearer {TOKEN}"} if TOKEN else {}
HEADERS_REST = {"Authorization": f"token {TOKEN}"} if TOKEN else {}

sess: requests.Session = requests.Session()
sess.headers.update({"User-Agent": "deaditude-bot/3.1"})

_TIMEOUT = 12
_RETRY_STATUS: set[int] = {502, 503, 504, 403}
_MAX_RETRIES = 4

# ───────────────────── Scoring constants ──────────────────────
BASE_SCORE = 5.0  # neutral baseline

COMMITS_NONE_THRESHOLD = 0
COMMITS_LOW_THRESHOLD = 10
COMMITS_MED_THRESHOLD = 30
COMMITS_HIGH_THRESHOLD = 50
COMMITS_VERY_HIGH_THRESHOLD = 100

COMMITS_NONE_PENALTY = 3.0
COMMITS_LOW_PENALTY = 2.0
COMMITS_MED_PENALTY = 1.0
COMMITS_HIGH_BONUS = 1.5
COMMITS_VERY_HIGH_BONUS = 2.0

PR_MED_OLD_THRESHOLD = 90
PR_OLD_THRESHOLD = 180
PR_MED_OLD_PENALTY = 1.0
PR_OLD_PENALTY = 2.0

RELEASE_MED_OLD_THRESHOLD = 60
RELEASE_OLD_THRESHOLD = 365
RELEASE_MED_OLD_PENALTY = 1.0
RELEASE_OLD_PENALTY = 2.0
RELEASE_NONE_PENALTY = 2.0
RELEASE_PARSE_ERROR_PENALTY = 0.5

STARS_MED_THRESHOLD = 10_000
STARS_HIGH_THRESHOLD = 50_000
STARS_VERY_HIGH_THRESHOLD = 100_000
STARS_MED_BONUS = 1.0
STARS_HIGH_BONUS = 2.0
STARS_VERY_HIGH_BONUS = 3.0

CONTRIBS_MED_THRESHOLD = 5
CONTRIBS_HIGH_THRESHOLD = 20
CONTRIBS_VERY_HIGH_THRESHOLD = 50
CONTRIBS_MED_BONUS = 1.0
CONTRIBS_HIGH_BONUS = 1.5
CONTRIBS_VERY_HIGH_BONUS = 2.0

FALLBACK_NO_PUSH_DATE_PENALTY = 1.0
COMMIT_WINDOW_DAYS = 30


# ───────────────────────── Helpers ────────────────────────────
def _get(url: str, **kwargs) -> requests.Response:
    """HTTP GET with exponential back‑off."""
    delay = 1.0
    for attempt in range(_MAX_RETRIES):
        resp = sess.get(url, timeout=_TIMEOUT, **kwargs)
        if resp.status_code not in _RETRY_STATUS:
            return resp
        logger.debug(
            "%s – retry %d/%d (status %s)",
            url,
            attempt + 1,
            _MAX_RETRIES,
            resp.status_code,
        )
        time.sleep(delay)
        delay *= 2
    resp.raise_for_status()
    return resp  # for type checkers


_GQL_QUERY = """
query RepoOverview($owner:String!,$repo:String!,$sinceISO:GitTimestamp!){
  repository(owner:$owner,name:$repo){
    name stargazerCount forkCount watchers{totalCount}
    issuesCount: issues(states:OPEN){totalCount}
    pullRequestsCount: pullRequests(states:OPEN){totalCount}
    refs(refPrefix:"refs/tags/"){totalCount}
    defaultBranchRef{
      target{... on Commit{history(since:$sinceISO){totalCount}}}
    }
    languages(first:10,orderBy:{field:SIZE,direction:DESC}){
      edges{node{name}size}
    }
    repositoryTopics(first:10){
      nodes{topic{name}}
    }
    releases(first:1,orderBy:{field:CREATED_AT,direction:DESC}){
      nodes{tagName createdAt}
    }
    issuesDetails: issues(
      first:50,
      states:OPEN,
      orderBy:{field:CREATED_AT,direction:ASC}
    ){
      nodes{createdAt}
    }
    pullRequestsDetails: pullRequests(
      first:50,
      states:OPEN,
      orderBy:{field:CREATED_AT,direction:ASC}
    ){
      nodes{createdAt}
    }
  }
}""".strip()


def _run_gql(variables: Dict[str, str]) -> Mapping[str, Any]:
    resp = sess.post(
        GQL_ENDPOINT,
        json={"query": _GQL_QUERY, "variables": variables},
        headers=HEADERS_GQL,
        timeout=20,
    )
    if resp.status_code == 200:
        return resp.json()
    raise RuntimeError(f"GraphQL {resp.status_code}: {resp.text[:120]}")


_STAT_CACHE: dict[str, Any] = {}


def _rest_stats(owner: str, repo: str) -> dict[str, Any]:
    key = f"{owner}/{repo}"
    if key in _STAT_CACHE:
        return _STAT_CACHE[key]
    out: dict[str, Any] = {}
    for ep in ("participation", "contributors"):
        res = _get(f"{REST_ROOT}/repos/{owner}/{repo}/stats/{ep}",
                   headers=HEADERS_REST)
        if res.status_code == 200:
            out[ep] = res.json()
    _STAT_CACHE[key] = out
    return out


# ──────────────────────── Public API ───────────────────────────
__all__ = ["collect_repo_metrics"]


def collect_repo_metrics(
    owner: str,
    repo: str,
    now: Optional[datetime] = None,
) -> Tuple[Dict[str, Any], float]:
    """Return (metrics, quality) for *owner/repo* without side‑effects."""
    if now is None:
        now = datetime.utcnow().replace(tzinfo=timezone.utc)

    since_iso = (now - timedelta(days=COMMIT_WINDOW_DAYS)).isoformat()

    try:
        gql_raw = _run_gql({"owner": owner,
                            "repo": repo,
                            "sinceISO": since_iso,
                            })
    except Exception as exc:
        logger.debug("GraphQL path failed: %s", exc, exc_info=False)
        return _rest_fallback(owner, repo)

    if gql_raw.get("errors"):
        logger.debug("GraphQL errors: %s", gql_raw["errors"], exc_info=False)
        return _rest_fallback(owner, repo)

    repo_data = gql_raw.get("data", {}).get("repository")
    if not repo_data:
        return _rest_fallback(owner, repo)

    # Scalars
    metrics: Dict[str, Any] = {
        "stars": repo_data["stargazerCount"],
        "forks": repo_data["forkCount"],
        "watchers": repo_data["watchers"]["totalCount"],
        "open_issues": repo_data["issuesCount"]["totalCount"],
        "open_prs": repo_data["pullRequestsCount"]["totalCount"],
        "tags_count": repo_data["refs"]["totalCount"],
        "commits_last_30d": repo_data["defaultBranchRef"]["target"]["history"][
            "totalCount"
        ],
    }

    # Latest release
    rels = repo_data["releases"]["nodes"]
    if rels:
        metrics["latest_tag_name"] = rels[0].get("tagName")
        metrics["latest_tag_date"] = rels[0].get("createdAt")
    else:
        metrics["latest_tag_name"] = metrics["latest_tag_date"] = None

    # Languages
    lang_edges = repo_data["languages"]["edges"]
    total_size = sum(e["size"] for e in lang_edges) or 1
    metrics["languages"] = [
        {
            "name": e["node"]["name"],
            "percentage": round(e["size"] * 100 / total_size, 2),
        }
        for e in lang_edges
    ]

    # Topics
    metrics["topics"] = [
        n["topic"]["name"] for n in repo_data["repositoryTopics"]["nodes"]
    ]

    # Age helpers
    def _age(nodes: list[dict[str, Any]]) -> dict[str, Any]:
        ages = [
            (now -
             dtparse.isoparse(n["createdAt"]).astimezone(timezone.utc)).days
            for n in nodes
        ]
        if not ages:
            return {"avg": None, "oldest": None, "30d": 0, "90d": 0, "365d": 0}
        return {
            "avg": sum(ages) / len(ages),
            "oldest": max(ages),
            "30d": sum(a >= 30 for a in ages),
            "90d": sum(a >= 90 for a in ages),
            "365d": sum(a >= 365 for a in ages),
        }

    metrics["issue_age_metrics"] = _age(repo_data["issuesDetails"]["nodes"])
    metrics["pr_age_metrics"] = _age(repo_data["pullRequestsDetails"]["nodes"])

    # REST stats
    rest_raw = _rest_stats(owner, repo)
    metrics["statistics"] = rest_raw

    # Raw payloads
    metrics["raw"] = {
        "graphql": json.dumps(gql_raw)[:10_000],
        "rest_stats": rest_raw,
    }

    # Deaditude
    metrics["deaditude_score"] = _calculate_deaditude(metrics)

    quality = 1.0 if rest_raw.get("contributors") else 0.6
    return metrics, quality


# ────────────────── Deaditude scoring  ─────────────────────────
def _calculate_deaditude(metrics: Dict[str, Any]) -> float:  # noqa: C901
    score = BASE_SCORE

    # Negative signals
    commits_30d = metrics.get("commits_last_30d") or 0
    if commits_30d == COMMITS_NONE_THRESHOLD:
        score += COMMITS_NONE_PENALTY
    elif commits_30d < COMMITS_LOW_THRESHOLD:
        score += COMMITS_LOW_PENALTY
    elif commits_30d < COMMITS_MED_THRESHOLD:
        score += COMMITS_MED_PENALTY
    elif commits_30d < COMMITS_HIGH_THRESHOLD:
        score += COMMITS_HIGH_BONUS
    elif commits_30d < COMMITS_VERY_HIGH_THRESHOLD:
        score += COMMITS_VERY_HIGH_BONUS

    pr_age = metrics.get("pr_age_metrics", {}).get("avg", 0) or 0
    if pr_age > PR_OLD_THRESHOLD:
        score += PR_OLD_PENALTY
    elif pr_age > PR_MED_OLD_THRESHOLD:
        score += PR_MED_OLD_PENALTY

    if metrics.get("latest_tag_date"):
        try:
            rel_dt = dtparse.isoparse(metrics["latest_tag_date"])
            days_since_release = (datetime.now(timezone.utc) - rel_dt).days
            if days_since_release > RELEASE_OLD_THRESHOLD:
                score += RELEASE_OLD_PENALTY
            elif days_since_release > RELEASE_MED_OLD_THRESHOLD:
                score += RELEASE_MED_OLD_PENALTY
        except Exception:
            score += RELEASE_PARSE_ERROR_PENALTY
    else:
        score += RELEASE_NONE_PENALTY

    # Positive signals
    stars = metrics.get("stars", 0)
    if stars > STARS_VERY_HIGH_THRESHOLD:
        score -= STARS_VERY_HIGH_BONUS
    elif stars > STARS_HIGH_THRESHOLD:
        score -= STARS_HIGH_BONUS
    elif stars > STARS_MED_THRESHOLD:
        score -= STARS_MED_BONUS

    contributors = len(metrics.get("statistics", {}).get("contributors", []))
    if contributors > CONTRIBS_VERY_HIGH_THRESHOLD:
        score -= CONTRIBS_VERY_HIGH_BONUS
    elif contributors > CONTRIBS_HIGH_THRESHOLD:
        score -= CONTRIBS_HIGH_BONUS
    elif contributors > CONTRIBS_MED_THRESHOLD:
        score -= CONTRIBS_MED_BONUS

    if commits_30d > COMMITS_VERY_HIGH_THRESHOLD:
        score -= COMMITS_VERY_HIGH_BONUS
    elif commits_30d > COMMITS_HIGH_THRESHOLD:
        score -= COMMITS_HIGH_BONUS

    return max(0, min(10, score))


# ───────────────── REST fallback (unchanged) ───────────────────
def _rest_fallback(owner: str, repo: str) -> Tuple[Dict[str, Any], float]:
    logger.debug("REST fallback for %s/%s", owner, repo)
    try:
        r = _get(f"{REST_ROOT}/repos/{owner}/{repo}", headers=HEADERS_REST)
        if r.status_code != 200:
            raise RuntimeError(
                f"REST fallback failed: {r.status_code} – {r.text[:100]}"
            )

        js = r.json()
        metrics = {
            "stars": js.get("stargazers_count", 0),
            "forks": js.get("forks_count", 0),
            "watchers": js.get("subscribers_count", 0),
            "open_issues": js.get("open_issues_count", 0),
            "open_prs": None,
            "tags_count": None,
            "commits_last_30d": None,
            "latest_tag_name": None,
            "latest_tag_date": None,
            "languages": [],
            "topics": js.get("topics", []),
            "issue_age_metrics": {},
            "pr_age_metrics": {},
            "statistics": {},
            "raw": {"rest_repo": js},
        }

        last_push = js.get("pushed_at")
        if last_push:
            try:
                pushed_dt = dtparse.isoparse(last_push)
                days_since_push = (datetime.now(timezone.utc) - pushed_dt).days
                score = BASE_SCORE
                if days_since_push > RELEASE_OLD_THRESHOLD:
                    score += RELEASE_OLD_PENALTY
                elif days_since_push > RELEASE_MED_OLD_THRESHOLD:
                    score += RELEASE_MED_OLD_PENALTY
                elif days_since_push > PR_OLD_THRESHOLD:
                    score += PR_OLD_PENALTY

                stars = metrics["stars"]
                if stars > STARS_VERY_HIGH_THRESHOLD:
                    score -= STARS_VERY_HIGH_BONUS
                elif stars > STARS_HIGH_THRESHOLD:
                    score -= STARS_HIGH_BONUS
                elif stars > STARS_MED_THRESHOLD:
                    score -= STARS_MED_BONUS

                metrics["deaditude_score"] = max(0, min(10, score))
            except Exception:
                metrics["deaditude_score"] = BASE_SCORE
        else:
            metrics["deaditude_score"] = (
                BASE_SCORE + FALLBACK_NO_PUSH_DATE_PENALTY
            )

        return metrics, 0.4
    except Exception as exc:
        logger.error("REST fallback exception: %s", exc)
        raise


# ─────────────────────────── CLI ───────────────────────────────
def _cli() -> None:
    p = argparse.ArgumentParser(description="Collect GitHub repo metrics")
    p.add_argument("owner")
    p.add_argument("repo")
    p.add_argument("-v",
                   "--verbose",
                   action="store_true",
                   help="enable debug logging",
                   )
    args = p.parse_args()

    if args.verbose:
        logging.basicConfig(
            level=logging.DEBUG,
            format="%(levelname)s:%(name)s:%(message)s",
        )
    metrics, quality = collect_repo_metrics(args.owner, args.repo)
    pprint(metrics)
    print(f"quality={quality}")


if __name__ == "__main__":
    _cli()
