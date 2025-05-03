from __future__ import annotations

"""revalidator.py
==================
Next-JS ISR revalidation helper (cleaned).
* CLI: `python revalidator.py <tech-id> [-v]`

"""

# ───────────────────────── Imports ────────────────────────────
import logging
import os
import random
import time
import urllib.parse
from typing import Dict

import requests
from dotenv import load_dotenv

load_dotenv()

# ------------------------------------------------------------------------
#  Configuration
# ------------------------------------------------------------------------
API_BASE_URL = os.getenv("NEXT_PUBLIC_API_URL", "http://localhost:3000/api")
REVALIDATE_SECRET = os.getenv("REVALIDATE_SECRET", "mysecrettoken")
MAX_RETRIES = 2
INITIAL_RETRY_DELAY = 2
MAX_RETRY_DELAY = 60
REQUEST_TIMEOUT = 30

logger = logging.getLogger(__name__)


# ------------------------------------------------------------------------
#  Startup diagnostics (run once on import)
# ------------------------------------------------------------------------
def _diagnose_url() -> None:
    parsed = urllib.parse.urlparse(API_BASE_URL)
    msg: list[str] = [f"API base: {API_BASE_URL}"]
    if not parsed.scheme:
        msg.append("⚠️ missing protocol")
    if not parsed.netloc:
        msg.append("⚠️ missing hostname")
    if parsed.scheme == "http":
        msg.append("⚠️ plain HTTP (insecure)")
    if API_BASE_URL.rstrip("/").endswith("/revalidate"):
        msg.append("⚠️ base URL ends with /revalidate – strip it")
    logger.debug("URL diagnostics – " + "; ".join(msg))


_diagnose_url()


# ------------------------------------------------------------------------
#  Helpers
# ------------------------------------------------------------------------
def _calculate_backoff(attempt: int) -> float:
    delay = min(MAX_RETRY_DELAY, INITIAL_RETRY_DELAY * (2**attempt))
    return delay * random.uniform(0.8, 1.2)


def _headers() -> Dict[str, str]:
    origin = API_BASE_URL.split("/api")[0] if "/api" in API_BASE_URL else API_BASE_URL
    return {
        "User-Agent": "Is-This-Tech-Dead-Revalidator/1.0",
        "X-Revalidation-Source": "cron-job",
        "Content-Type": "application/json",
        "Origin": origin,
        "Referer": API_BASE_URL,
    }


def _post_with_redirects(
    session: requests.Session, url: str, payload: dict
) -> requests.Response:
    resp = session.post(
        url,
        json=payload,
        headers=_headers(),
        timeout=REQUEST_TIMEOUT,
        allow_redirects=False,
    )
    if 300 <= resp.status_code < 400 and "location" in resp.headers:
        loc = resp.headers["location"]
        next_url = loc if loc.startswith("http") else urllib.parse.urljoin(url, loc)
        logger.debug("Redirect %s → %s", resp.status_code, next_url)
        resp = session.post(
            next_url,
            json=payload,
            headers=_headers(),
            timeout=REQUEST_TIMEOUT,
        )
    return resp


# ------------------------------------------------------------------------
#  Core logic
# ------------------------------------------------------------------------
def _revalidate_path(path: str) -> bool:
    url = f"{API_BASE_URL}/revalidate"
    payload = {"secret": REVALIDATE_SECRET, "path": path}
    session = requests.Session()

    for attempt in range(MAX_RETRIES):
        try:
            logger.debug("POST %s %s", url, payload)
            resp = _post_with_redirects(session, url, payload)
            if resp.status_code == 200:
                logger.info(
                    "Revalidated %s - %s", path, resp.json().get("message", "OK")
                )
                return True
            else:
                try:
                    body = resp.json()
                except Exception:
                    body = resp.text[:200]
                logger.warning(
                    "Revalidation %s failed (%s): %s",
                    path,
                    resp.status_code,
                    body,
                )
        except Exception as exc:
            logger.warning("Error revalidating %s: %s", path, exc, exc_info=False)

        if attempt < MAX_RETRIES - 1:
            backoff = _calculate_backoff(attempt)
            logger.debug("Retrying %s in %.1fs", path, backoff)
            time.sleep(backoff)

    logger.error(
        "Failed to revalidate %s after %d attempts",
        path,
        MAX_RETRIES,
    )
    return False


def revalidate_tech(tech_id: str) -> bool:
    tech_ok = _revalidate_path(f"/{tech_id}")
    main_ok = _revalidate_path("/")
    return tech_ok and main_ok


# ------------------------------------------------------------------------
#  CLI
# ------------------------------------------------------------------------
if __name__ == "__main__":
    import argparse
    import sys

    p = argparse.ArgumentParser(
        description="Trigger ISR revalidation for a tech page + home."
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
