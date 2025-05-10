from __future__ import annotations

"""Batch runner v2 collectors (quality aware)
==============================================
Runs all collectors for a subset of techs that are due for refresh, obeying
runtime and API quota constraints, then stores a snapshot in Supabase.

Collectors plugged in
---------------------
* GitHub repo metrics
* Reddit discussion
* Hacker News discussion
* Stack Overflow activity
* YouTube tutorials / courses
* Company adoption (StackShare / showcases / TheirStack)
* Jobs market (Adzuna → Google CSE fallback)

All collectors expose `collect_*_signals(tech)` → `(metrics, quality)`.
The scorer takes both the per-source metrics **and** the quality map.

Usage:
------
# Run analysis for a specific technology
python -m engine.cli --tech flutter

# Run only specific analyzers for a technology
python -m engine.cli --tech flutter --analyzers stackoverflow youtube

# Run batch update for all technologies
python -m engine.cli
"""

import datetime
import os
import random
import time
import argparse
import logging
import re
from typing import Dict, Any, Callable
from engine.collectors import (
    github,
    reddit,
    hn,
    stackoverflow,
    youtube,
    jobs,
    companies,
)

# Import the APIBanError class from stackoverflow module
from engine.collectors.stackoverflow import APIBanError

from engine.scoring.scoring import calculate_deaditude_score

# Database operations
from packages.db.supabase import (
    insert_snapshot,
    get_registry,
    update_last_checked,
)

# ---------------------------------------------------------------------------
#  Constants
# ---------------------------------------------------------------------------

# Default environment variables
DEFAULT_RUNTIME_SECONDS = "300"  # 5 min
DEFAULT_CHECK_THRESHOLD_DAYS = "5"
DEFAULT_DRY_RUN = "false"
DEFAULT_GOOGLE_CSE_LIMIT = "100"
DEFAULT_GITHUB_API_LIMIT = "5000"
DEFAULT_BATCH_SIZE = "2"  # Maximum techs to process in one run

# API cost per technology
GOOGLE_COST_PER_TECH = 1
GITHUB_COST_PER_TECH = 30

# Critical services that should abort the batch if unavailable
CRITICAL_SERVICES = ["stackoverflow", "youtube"]

# Scoring thresholds for verdicts
THRESHOLD_VERY_ALIVE = 30
THRESHOLD_ALIVE = 50
THRESHOLD_STABLE = 70
THRESHOLD_DECLINING = 85

# Confidence scaling
CONFIDENCE_SCALING_FACTOR = 1
CONFIDENCE_HIGH_QUALITY_THRESHOLD = 0.9
CONFIDENCE_MIN_SOURCES = 2

# Throttling configuration (seconds between requests)
THROTTLE_CONFIG = {
    "stackoverflow": 3.0,  # 3 seconds between Stack Overflow API calls
    "reddit": 5.0,  # 5 seconds between Reddit API calls
    "youtube": 10.0,  # 10 seconds between YouTube API calls
    "github": 2.0,  # 2 seconds between GitHub API calls
    "default": 1.0,  # Default for other services
}

# Retry configuration
MAX_RETRIES = 3  # Maximum number of retry attempts
RETRY_BASE_DELAY = 30.0  # Base delay in seconds for exponential backoff
JITTER_FACTOR = 0.25  # Random jitter factor (0.25 = ±25%)

# API ban tracking
api_ban_until = {}  # Dict of service_name -> timestamp when ban expires

# Estimated seconds per collector (for batch‑size estimator)
EST_PER_TECH = {
    "github": 4,
    "reddit": 2,
    "hn": 1.5,
    "stackoverflow": 3,
    "youtube": 3.5,
    "companies": 2,
    "jobs": 2,
}

# Enable or disable throttling (for testing)
ENABLE_THROTTLING = True

# Maximum number of technologies to process in one batch
MAX_BATCH_SIZE = int(os.getenv("MAX_BATCH_SIZE", DEFAULT_BATCH_SIZE))


# ---------------------------------------------------------------------------
#  Config and Logging
# ---------------------------------------------------------------------------

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("deaditude")

# Environment variables
TARGET_RUNTIME_SECONDS = int(
    os.getenv("TARGET_RUNTIME_SECONDS", DEFAULT_RUNTIME_SECONDS)
)
CHECK_THRESHOLD_DAYS = int(
    os.getenv("CHECK_THRESHOLD_DAYS", DEFAULT_CHECK_THRESHOLD_DAYS)
)
DRY_RUN = os.getenv("DRY_RUN", DEFAULT_DRY_RUN).lower() == "true"

GOOGLE_CSE_DAILY_LIMIT = int(
    os.getenv("GOOGLE_CSE_DAILY_LIMIT", DEFAULT_GOOGLE_CSE_LIMIT)
)
GITHUB_API_HOURLY_LIMIT = int(
    os.getenv("GITHUB_API_HOURLY_LIMIT", DEFAULT_GITHUB_API_LIMIT)
)

# Last API call timestamps (for throttling)
last_api_call = {}

# ---------------------------------------------------------------------------
#  Throttling and retry mechanisms
# ---------------------------------------------------------------------------


def throttled_api_call(service_name: str, func: Callable, *args, **kwargs):
    """Execute an API call with throttling and retry logic.

    Args:
        service_name: Name of the service (for throttling config)
        func: Function to call
        *args: Positional arguments to pass to func
        **kwargs: Keyword arguments to pass to func

    Returns:
        Result of the function call

    Raises:
        Exception: If all retries fail
    """
    # Check if this service is currently banned
    now = time.time()
    if service_name in api_ban_until and now < api_ban_until[service_name]:
        ban_remaining = int(api_ban_until[service_name] - now)
        ban_hours = ban_remaining // 3600
        ban_minutes = (ban_remaining % 3600) // 60

        error_msg = (
            f"{service_name} API is banned for"
            f"~{ban_hours}h {ban_minutes}m more. "
            f"Will be available at"
            f"{datetime.datetime.fromtimestamp(api_ban_until[service_name])}"
        )
        logger.warning(error_msg)

        # Raise a recognizable ban error
        raise APIBanError(service_name, ban_remaining, error_msg)

    # Skip throttling if disabled (for testing)
    if not ENABLE_THROTTLING:
        return func(*args, **kwargs)

    # Get throttle delay for this service
    throttle_delay = THROTTLE_CONFIG.get(service_name,
                                         THROTTLE_CONFIG["default"])

    # Add jitter to avoid synchronized requests
    jitter = random.uniform(-JITTER_FACTOR, JITTER_FACTOR) * throttle_delay
    delay = max(0, throttle_delay + jitter)

    # Check if we need to wait based on last call time
    now = time.time()
    if service_name in last_api_call:
        time_since_last_call = now - last_api_call[service_name]
        if time_since_last_call < delay:
            sleep_time = delay - time_since_last_call
            logger.debug(f"Throttling {service_name} API for"
                         f"{sleep_time:.2f}s")
            time.sleep(sleep_time)

    # Update last call time
    last_api_call[service_name] = time.time()

    # Implement retry with exponential backoff
    for attempt in range(MAX_RETRIES + 1):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            error_str = str(e).lower()

            # Custom block for Stack Overflow's specific error
            # format when already in the output
            # Direct handling for stackoverflow API errors in
            # "Stack Overflow API error:" format
            if (
                "stack overflow api error" in error_str
                and "throttle_violation" in error_str
            ):
                # Try to find the ban time directly from the error message
                ban_seconds = None

                # Extract seconds directly
                import re

                ban_match = re.search(
                    r"more requests available in (\d+) seconds", error_str
                )
                if ban_match:
                    ban_seconds = int(ban_match.group(1))
                    logger.warning(
                        f"Detected Stack Overflow ban for"
                        f"{ban_seconds} seconds"
                    )

                # If we found a ban time, register it
                if ban_seconds and ban_seconds > 60:
                    ban_until = time.time() + ban_seconds
                    api_ban_until[service_name] = ban_until

                    ban_hours = ban_seconds // 3600
                    ban_minutes = (ban_seconds % 3600) // 60

                    error_msg = (
                        f"{service_name} API is banned for"
                        f"~{ban_hours}h {ban_minutes}m. "
                        f"Will be available at"
                        f"{datetime.datetime.fromtimestamp(ban_until)}"
                    )
                    logger.error(error_msg)

                    # Skip immediately
                    raise APIBanError(service_name, ban_seconds, error_msg)

            # Check if this is a throttling error
            is_throttle_error = (
                "429" in str(e)
                or "too many requests" in error_str
                or "throttle" in error_str
                or "quota exceeded" in error_str
            )

            # Parse ban time if available
            ban_seconds = None
            if "more requests available in" in error_str:
                try:
                    import re

                    match = re.search(
                        r"more requests available in (\d+) seconds", error_str
                    )
                    if match:
                        ban_seconds = int(match.group(1))
                    else:
                        # Fallback to the original method
                        pieces = error_str.split("more requests available in")
                        [1].split("seconds")
                        ban_seconds = int(pieces[0].strip())
                except (ValueError, IndexError):
                    pass

            # If this is a long ban (> 1 minute),
            # register it and raise a special error
            if ban_seconds and ban_seconds > 60:
                api_ban_until[service_name] = ban_until

                ban_hours = ban_seconds // 3600
                ban_minutes = (ban_seconds % 3600) // 60

                error_msg = (
                    f"{service_name} API is banned for"
                    f"~{ban_hours}h {ban_minutes}m. "
                    f"Will be available at"
                    f"{datetime.datetime.fromtimestamp(ban_until)}"
                )
                logger.error(error_msg)

                # Raise a special ban error to be handled differently
                raise APIBanError(service_name, ban_seconds, error_msg)

            # If it's the last attempt or not a throttling error, re-raise
            if attempt == MAX_RETRIES or not is_throttle_error:
                raise

            # Calculate backoff with jitter
            backoff = RETRY_BASE_DELAY * (2**attempt)
            jitter_backoff = backoff * (1 + random.uniform(-0.1, 0.1))

            logger.warning(
                f"{service_name} API throttled. Retrying in "
                f"{jitter_backoff:.1f}s (attempt {attempt+1}/{MAX_RETRIES})"
            )
            time.sleep(jitter_backoff)

            # Double the throttle delay for this service after throttling
            THROTTLE_CONFIG[service_name] = THROTTLE_CONFIG[service_name] * 2
            logger.info(
                f"Increased throttle delay for {service_name} to "
                f"{THROTTLE_CONFIG[service_name]}s"
            )


# ---------------------------------------------------------------------------
#  Collector mapping (returns metrics, quality)
# ---------------------------------------------------------------------------


def create_throttled_collector(service_name, collector_func):
    """Create a throttled version of a collector function.

    Args:
        service_name: Name of the service for throttling config
        collector_func: Original collector function

    Returns:
        Throttled collector function
    """

    def throttled_collector(*args, **kwargs):
        return throttled_api_call(service_name,
                                  collector_func, *args, **kwargs)

    return throttled_collector


# Apply throttling to collectors
COLLECTORS: Dict[str, Any] = {
    "github": create_throttled_collector(
        "github",
        lambda t: github.collect_repo_metrics(t.get("owner", ""),
                                              t.get("repo", "")),
    ),
    "reddit": create_throttled_collector(
        "reddit", lambda t: reddit.collect_reddit_signals(t)
    ),
    "hn": create_throttled_collector("hn",
                                     lambda t: hn.collect_hn_signals(
                                         t["name"])),
    "stackoverflow": create_throttled_collector(
        "stackoverflow",
        lambda t: stackoverflow.collect_so_signals(
            t["name"].replace(" ", "-").lower()
        )
    ),
    "youtube": create_throttled_collector(
        "youtube",
        lambda t: youtube.collect_youtube_signals({"name": t["name"]})
    ),
    "companies": create_throttled_collector(
        "companies", lambda t: companies.collect_company_signals(t)
    ),
    "jobs": create_throttled_collector("jobs",
                                       lambda t: jobs.collect_jobs_signals(t)),
}

# ---------------------------------------------------------------------------
#  Helper functions
# ---------------------------------------------------------------------------


def _get_due_batch(all_techs):
    """Get technologies due for update.

    Since get_registry now sorts by last_checked date, we just need
    to filter based on the CHECK_THRESHOLD_DAYS.
    """
    today = datetime.datetime.utcnow().date()
    due = []

    for tech in all_techs:
        last = tech.get("last_checked")

        # If never checked, it's definitely due
        if not last:
            due.append(tech)
            continue

        try:
            # Parse the ISO date
            date_format = last.replace("Z", "+00:00")
            # Check if there's a microseconds component with less than 6 digits
            microsec_pat = r'(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{1,5})'
            date_format = re.sub(
                microsec_pat + r'([+-])',
                r'\1000\2',
                date_format
            )
            date_format = re.sub(
                microsec_pat + r'$',
                r'\1000',
                date_format
            )
            checked_date = datetime.datetime.fromisoformat(date_format).date()
            delta = (today - checked_date).days

            # Add techs that have passed the threshold
            if delta >= CHECK_THRESHOLD_DAYS:
                due.append(tech)
            else:
                # Since list is sorted by last_checked, if we find a tech
                # that's too recent, we can stop checking the rest
                if len(due) > 0:
                    logger.info(
                        f"Stopping early at {tech.get('name')} - "
                        f"remaining techs are too fresh (checked"
                        f"{delta} days ago)"
                    )
                    break
        except Exception as e:
            logger.warning(f"Error parsing date for {tech.get('name')}: {e}")
            due.append(tech)  # fail‑safe

    # No need to shuffle anymore since we want to process oldest first
    return due


def _max_batch():
    """Calculate maximum batch size based on API limits."""
    return min(
        GOOGLE_CSE_DAILY_LIMIT // GOOGLE_COST_PER_TECH,
        GITHUB_API_HOURLY_LIMIT // GITHUB_COST_PER_TECH,
    )


def calculate_confidence(qualities):
    """Calculate overall confidence percentage from quality scores.

    Args:
        qualities: Dict mapping analyzer names to quality scores (0.0-1.0)

    Returns:
        Confidence percentage (0-100)
    """
    if not qualities:
        return 0

    # Calculate weighted average of quality scores
    total_quality = sum(qualities.values())
    raw_confidence = total_quality / len(qualities) * 100

    # Apply scaling for more conservative confidence values
    scaled_confidence = raw_confidence * CONFIDENCE_SCALING_FACTOR

    # For high-quality data (all 1.0), still allow high confidence
    if (
        all(q >= CONFIDENCE_HIGH_QUALITY_THRESHOLD for q in qualities.values())
        and len(qualities) >= CONFIDENCE_MIN_SOURCES
    ):
        # Multiple high-quality sources should still show high confidence
        return min(100, int(raw_confidence))

    return min(100, int(scaled_confidence))


def get_verdict(score):
    """Get verdict text based on score.

    Args:
        score: Overall score value

    Returns:
        Verdict string
    """
    if score < THRESHOLD_VERY_ALIVE:
        return "Very Alive"
    elif score < THRESHOLD_ALIVE:
        return "Alive"
    elif score < THRESHOLD_STABLE:
        return "Stable"
    elif score < THRESHOLD_DECLINING:
        return "Declining"
    else:
        return "Dead"


# ---------------------------------------------------------------------------
#  Main runner
# ---------------------------------------------------------------------------


def run_batch(techTest=None, analyzers=None):
    """Run collection for multiple technologies or a single tech.

    Args:
        techTest: Single technology to test (dict with name/id)
        analyzers: List of specific analyzers to run
    """
    if techTest:
        all_techs = [techTest]
    else:
        # Get technologies from registry
        try:
            all_techs = get_registry(limit=MAX_BATCH_SIZE)
            logger.info(f"Loaded {len(all_techs)} technologies from registry")
        except Exception as e:
            logger.error(f"Failed to get registry: {e}")
            all_techs = []

    due = _get_due_batch(all_techs) if not techTest else all_techs
    if not due:
        print("🚀 Nothing to update – all techs fresh.")
        return

    est_total = sum(EST_PER_TECH.values())
    runtime_limit = max(1, TARGET_RUNTIME_SECONDS // int(est_total))
    batch_size = min(runtime_limit, _max_batch(), len(due))

    print(
        f"🧠 Runtime‑budget {TARGET_RUNTIME_SECONDS}s "
        f"(est ~{est_total:.1f}s/tech)"
    )
    print(
        f"🔒 Quotas – Google CSE {GOOGLE_CSE_DAILY_LIMIT}, "
        f"GitHub {GITHUB_API_HOURLY_LIMIT}"
    )

    # Show any API bans
    now = time.time()
    banned_services = [
        (service, int((ban_time - now) / 60))
        for service, ban_time in api_ban_until.items()
        if ban_time > now
    ]

    # Check if any critical services are already banned from previous runs
    critical_banned = [s for s, _ in banned_services if s in CRITICAL_SERVICES]
    if critical_banned:
        critical_list = ", ".join(critical_banned)
        next_available = min(
            [datetime.datetime.fromtimestamp(api_ban_until[s])
             for s in critical_banned]
        )

        print(f"⛔ CRITICAL SERVICES UNAVAILABLE: {critical_list}")
        print(f"⏰ Batch processing aborted. Try again after {next_available}")
        print("🔄 Quota will reset at midnight UTC")
        return

    if banned_services:
        ban_list = ", ".join(
            f"{service} ({mins}m)" for service, mins in banned_services
        )
        print(f"⛔ API limits in effect: {ban_list}")

    print(f"🎯 Processing {batch_size}/{len(due)} techs this run\n")

    for tech in due[:batch_size]:
        print(f"🔍 {tech['name']}")
        t0 = time.time()

        metrics: Dict[str, Any] = {}
        qualities: Dict[str, float] = {}
        banned_services = []
        active_services = 0

        # If analyzers specified, only run those
        selected_collectors = COLLECTORS
        if analyzers:
            selected_collectors = {
                k: v for k, v in COLLECTORS.items() if k in analyzers
            }

        for key, fn in selected_collectors.items():
            try:
                m, q = fn(tech)
                metrics[key] = m
                qualities[key] = q
                active_services += 1
            except APIBanError as e:
                banned_services.append(key)
                logger.warning(f"Skipping {key} for {tech['name']}"
                               "due to API ban")
                print(f"⛔ {key} unavailable: {e.service} API limits")

                # If a critical service gets banned during processing,
                # abort the entire batch
                if key in CRITICAL_SERVICES:
                    next_available = datetime.datetime.fromtimestamp(
                        time.time() + e.seconds
                    )
                    print(f"\n⛔ CRITICAL SERVICE {key.upper()} UNAVAILABLE")
                    print(
                        f"⏰ Batch processing aborted. "
                        f"Try again after {next_available}"
                    )
                    print("🔄 Quota will reset at midnight UTC")
                    return

            except Exception as e:
                logger.error(f"Error in {key} analyzer for"
                             f" {tech['name']}: {e}")
                print(f"   ⚠️  {key} failed: {e}")

                # Check if this is a quota exceeded error for YouTube
                if (
                    key == "youtube"
                    and "quota" in str(e).lower()
                    and "exceed" in str(e).lower()
                ):
                    print("\n⛔ YOUTUBE API QUOTA EXCEEDED")
                    print("⏰ Batch processing aborted. "
                          "Quota will reset at midnight Pacific Time")
                    return

        # Skip scoring if all services are banned
        count = len(selected_collectors)
        if banned_services and len(banned_services) == count:
            print(
                f"⚠️ Skipping {tech['name']} - all selected services "
                f"unavailable due to API limits"
            )
            continue

        try:
            # Pass the tech object to the scoring function
            # for age-aware scoring
            score_data = calculate_deaditude_score(metrics, tech)

            # Calculate confidence
            confidence = calculate_confidence(qualities)

            # Save to database if not in dry run mode
            if not DRY_RUN:
                try:
                    insert_snapshot(tech["id"], tech["name"],
                                    metrics,
                                    score_data)
                    update_last_checked(tech["id"])
                except Exception as e:
                    logger.error(f"Failed to save {tech['name']} to database:"
                                 f" {e}")

            dt = time.time() - t0

            # Show verdict with confidence
            verdict = get_verdict(score_data["overall_score"])

            # Include age category info if present
            age_info = ""
            if "tech_age_category" in score_data:
                age_info = f" ({score_data['tech_age_category']})"

            # Add banned warning if applicable
            ban_note = ""
            if banned_services:
                ban_note = (
                    f" (NOTE: {len(banned_services)} services unavailable)"
                )

            print(
                f"✅ {tech['name']} scored "
                f"{score_data['overall_score']:.2f} in {dt:.1f}s"
                f" - {verdict} ({confidence}% confidence){age_info}{ban_note}"
            )
        except Exception as e:
            logger.error(f"Scoring failed for {tech['name']}: {e}")
            print(f"❌ Scoring failed for {tech['name']}: {e}")


def parse_args():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(
        description="Test technology health and popularity"
    )
    parser.add_argument("--tech", type=str, help="Specific technology to test")
    parser.add_argument(
        "--analyzers",
        type=str,
        nargs="*",
        choices=list(COLLECTORS.keys()),
        help="Specific analyzers to run (e.g. stackoverflow youtube)",
    )
    parser.add_argument(
        "--save",
        action="store_true",
        help="Save results to database (only for --tech mode)",
    )
    parser.add_argument(
        "--dry-run", action="store_true", help="Run without saving to database"
    )
    parser.add_argument(
        "--no-throttle",
        action="store_true",
        help="Disable API throttling (not recommended for production)",
    )
    parser.add_argument(
        "--batch",
        action="store_true",
        help="Run batch processing for all technologies due for update",
    )
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()

    # Set dry run mode from args
    if args.dry_run:
        DRY_RUN = True
        logger.info("Running in dry-run mode - no database saves")

    # Set throttling from args
    if args.no_throttle:
        ENABLE_THROTTLING = False
        logger.warning(
            "API throttling disabled - "
            "this may result in rate limiting or IP bans"
        )

    if args.batch:
        # Explicitly run batch processing
        print("\n==== RUNNING BATCH PROCESSING ====")
        run_batch(analyzers=args.analyzers)
    else:
        # Run the full batch process as fallback
        run_batch(analyzers=args.analyzers)
