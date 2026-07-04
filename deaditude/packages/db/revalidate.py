from __future__ import annotations

"""revalidate.py
==================
GitHub Actions rebuild trigger helper for GitHub Pages.
* CLI: `python revalidate.py <tech-id> [-v]`
"""

import logging
import os
import random
import time
import requests
from dotenv import load_dotenv

load_dotenv()

# ------------------------------------------------------------------------
#  Configuration
# ------------------------------------------------------------------------
GITHUB_PAT = os.getenv("GITHUB_PAT")
GITHUB_REPOSITORY = os.getenv("GITHUB_REPOSITORY")  # e.g. "user/repo"
MAX_RETRIES = 2
INITIAL_RETRY_DELAY = 2
MAX_RETRY_DELAY = 60
REQUEST_TIMEOUT = 30

logger = logging.getLogger(__name__)

# ------------------------------------------------------------------------
#  Startup diagnostics (run once on import)
# ------------------------------------------------------------------------
def _diagnose_github() -> None:
    msg: list[str] = []
    if not GITHUB_PAT:
        msg.append("⚠️ missing GITHUB_PAT")
    if not GITHUB_REPOSITORY:
        msg.append("⚠️ missing GITHUB_REPOSITORY")
    if msg:
        logger.debug("GitHub diagnostics – " + "; ".join(msg))
    else:
        logger.debug(f"GitHub trigger configured for: {GITHUB_REPOSITORY}")

_diagnose_github()

# ------------------------------------------------------------------------
#  Helpers
# ------------------------------------------------------------------------
def _calculate_backoff(attempt: int) -> float:
    delay = min(MAX_RETRY_DELAY, INITIAL_RETRY_DELAY * (2**attempt))
    return delay * random.uniform(0.8, 1.2)

def _trigger_github_action(tech_id: str) -> bool:
    if not GITHUB_PAT or not GITHUB_REPOSITORY:
        logger.warning("GITHUB_PAT or GITHUB_REPOSITORY not set, skipping rebuild dispatch")
        return False
        
    url = f"https://api.github.com/repos/{GITHUB_REPOSITORY}/dispatches"
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "Authorization": f"token {GITHUB_PAT}"
    }
    data = {
        "event_type": "rebuild_site",
        "client_payload": {"tech_id": tech_id}
    }
    
    for attempt in range(MAX_RETRIES):
        try:
            logger.debug(f"POST {url} with event_type: rebuild_site")
            resp = requests.post(url, headers=headers, json=data, timeout=REQUEST_TIMEOUT)
            
            if resp.status_code == 204:
                logger.info(f"Successfully triggered GitHub Action rebuild for {tech_id}")
                return True
            else:
                logger.warning(
                    f"GitHub Action trigger failed ({resp.status_code}): {resp.text[:200]}"
                )
        except Exception as exc:
            logger.warning(f"Error triggering rebuild for {tech_id}: {exc}")

        if attempt < MAX_RETRIES - 1:
            backoff = _calculate_backoff(attempt)
            logger.debug(f"Retrying in {backoff:.1f}s")
            time.sleep(backoff)

    logger.error(f"Failed to trigger GitHub Action after {MAX_RETRIES} attempts")
    return False

def revalidate_tech(tech_id: str) -> bool:
    """
    For a static GitHub Pages site, updating any tech requires a full rebuild.
    We trigger a repository_dispatch event to run the deploy workflow.
    """
    return _trigger_github_action(tech_id)

# ------------------------------------------------------------------------
#  CLI
# ------------------------------------------------------------------------
if __name__ == "__main__":
    import argparse
    import sys

    p = argparse.ArgumentParser(
        description="Trigger GitHub Actions rebuild for the static site."
    )
    p.add_argument("tech_id", help="e.g. react, vue")
    p.add_argument(
        "-v",
        "--verbose",
        action="store_true",
        help="enable debug logging",
    )
    args = p.parse_args()

    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(levelname)s:%(name)s:%(message)s",
    )

    success = revalidate_tech(args.tech_id)
    sys.exit(0 if success else 1)
