from __future__ import annotations

"""company_collector.py
========================
Company-adoption collector (v 2.0)

Scrapes public company usage signals for a language or framework from up to
three sources and returns:

* ``company_count`` median of available counts
* ``deaditude_score`` 0 (alive) → 10 (dead) based solely on company uptake
* ``quality`` 1.0 (three signals) · 0.67 (two) · 0.33 (one) · 0.2 (zero)
* ``raw`` trimmed HTML / sample data for auditability

Public API
----------
``collect_company_signals(tech: dict[str, str]) -> tuple[dict, float]``

"""

# ───────────────────────── Imports ────────────────────────────
import logging
import math
import re
from typing import Any, Dict, Tuple

import bs4
import requests
from dotenv import load_dotenv

# ---------------------------------------------------------------------------
# Configuration & globals
# ---------------------------------------------------------------------------
load_dotenv()

HEADERS = {"User-Agent": "deaditude-company-collector/1.0"}
SS_BASE = "https://stackshare.io"
TS_BASE = "https://theirstack.com/en/technology"
MAX_HTML = 10_000  # chars kept per raw source
TIMEOUT = 12  # seconds for HTTP calls

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Scoring parameters - to tweak if needed
# ---------------------------------------------------------------------------
LOG_SCALE_FACTOR = 4.0
MAX_ALIVE_SCORE = 10.0

QUALITY_HIGH_THRESHOLD = 3
QUALITY_HIGH_VALUE = 1.0
QUALITY_MED_HIGH_THRESHOLD = 2
QUALITY_MED_HIGH_VALUE = 0.67
QUALITY_MED_THRESHOLD = 1
QUALITY_MED_VALUE = 0.33
QUALITY_LOW_VALUE = 0.2


# ---------------------------------------------------------------------------
# Slug/URL derivation helpers
# ---------------------------------------------------------------------------
def _normalize(name: str) -> str:
    slug = re.sub(r"[^a-zA-Z0-9\s]", "", name.lower())
    return re.sub(r"\s+", "-", slug)


def get_stackshare_slug(name: str) -> str:
    return _normalize(name)


def _guess_domain(slug: str) -> str:
    special = {
        "react": "reactjs.org",
        "reactjs": "reactjs.org",
        "react-native": "reactnative.dev",
        "vue": "vuejs.org",
        "vuejs": "vuejs.org",
        "angular": "angular.io",
        "node": "nodejs.org",
        "nodejs": "nodejs.org",
        "typescript": "typescriptlang.org",
        "golang": "go.dev",
        "deno": "deno.land",
        "svelte": "svelte.dev",
        "nextjs": "nextjs.org",
        "next-js": "nextjs.org",
    }
    return special.get(slug, f"{slug}.dev")


def get_showcase_url(name: str) -> str:
    slug = _normalize(name)
    domain = _guess_domain(slug)
    patterns = [
        f"https://{domain}/showcase",
        f"https://{domain}/customers",
        f"https://{domain}/case-studies",
        f"https://{domain}/companies",
        f"https://{domain}/users",
        f"https://{domain}/whos-using",
    ]
    for url in patterns:
        try:
            if requests.head(url,
                             headers=HEADERS,
                             timeout=5).status_code == 200:
                return url
        except Exception:
            continue
    return patterns[0]


def get_their_stack_slug(name: str) -> str:
    return _normalize(name)


# ---------------------------------------------------------------------------
#  StackShare helper
# ---------------------------------------------------------------------------
_SS_RE = re.compile(r"companies reportedly use", re.I)


def _stackshare(slug: str):
    url = f"{SS_BASE}/{slug}"
    try:
        r = requests.get(url, headers=HEADERS, timeout=TIMEOUT)
        if r.status_code != 200:
            return 0, [], ""
        soup = bs4.BeautifulSoup(r.text, "html.parser")
        blurb = soup.find(string=_SS_RE)
        if not blurb:
            return 0, [], r.text[:MAX_HTML]
        strongs = blurb.find_parent().find_all("strong")
        count = int(strongs[0].text.strip().replace(",", "")) if strongs else 0

        companies: list[str] = []
        for card in soup.find_all("div", class_="company-card"):
            txt = card.get_text(" ", strip=True)
            if txt:
                companies.append(txt)
        if not companies and strongs and len(strongs) > 2:
            companies = [s.text.strip().rstrip(".,") for s in strongs[2:42]]
        if not companies:
            for link in soup.find_all("a",
                                      href=lambda h: h and "/company/" in h):
                txt = link.text.strip()
                if txt:
                    companies.append(txt)

        return count, companies[:40], r.text[:MAX_HTML]
    except Exception as exc:
        logger.debug("StackShare error: %s", exc, exc_info=False)
        return 0, [], ""


# ---------------------------------------------------------------------------
#  Showcase helper
# ---------------------------------------------------------------------------
def _showcase(url: str):
    try:
        r = requests.get(url, headers=HEADERS, timeout=TIMEOUT)
        if r.status_code != 200:
            return 0, [], ""
        soup = bs4.BeautifulSoup(r.text, "html.parser")
        names: set[str] = set()
        for img in soup.find_all("img", alt=True):
            alt = img["alt"].strip()
            if 2 <= len(alt) <= 40:
                names.add(alt)
        for h in soup.find_all(["h2", "h3", "h4"]):
            txt = h.get_text(" ", strip=True)
            if 2 <= len(txt) <= 40 and re.match(r"[A-Z].*", txt):
                names.add(txt)
        return len(names), sorted(list(names))[:40], r.text[:MAX_HTML]
    except Exception as exc:
        logger.debug("Showcase error: %s", exc, exc_info=False)
        return 0, [], ""


# ---------------------------------------------------------------------------
#  TheirStack helper
# ---------------------------------------------------------------------------
_TS_RE = re.compile(r"data on ([\d,]+) companies", re.I)


def _their_stack(slug: str):
    url = f"{TS_BASE}/{slug}"
    try:
        r = requests.get(url, headers=HEADERS, timeout=TIMEOUT)
        if r.status_code != 200:
            return 0, ""
        m = _TS_RE.search(r.text)
        count = int(m.group(1).replace(",", "")) if m else 0
        return count, r.text[:MAX_HTML]
    except Exception as exc:
        logger.debug("TheirStack error: %s", exc, exc_info=False)
        return 0, ""


# ---------------------------------------------------------------------------
#  Aggregator
# ---------------------------------------------------------------------------
def collect_company_signals(tech: Dict[str, str]) -> Tuple[Dict[str, Any],
                                                           float]:
    """Collect adoption signals for *tech* and return metrics & quality."""
    raw: Dict[str, Any] = {}
    counts: list[int] = []
    name = tech.get("name", "")

    # StackShare
    slug = tech.get("stackshare_slug") or (get_stackshare_slug(name) if
                                           name else None)
    if slug:
        c, sample, html = _stackshare(slug)
        if c:
            counts.append(c)
        raw["stackshare"] = {"count": c, "sample": sample, "html": html}

    # Showcase
    showc = tech.get("showcase_url") or (get_showcase_url(name) if
                                         name else None)
    if showc:
        c, sample, html = _showcase(showc)
        if c:
            counts.append(c)
        raw["showcase"] = {"count": c, "sample": sample, "html": html}

    # TheirStack
    tslug = tech.get("their_stack_slug") or (
        get_their_stack_slug(name) if name else None
    )
    if tslug:
        c, html = _their_stack(tslug)
        if c:
            counts.append(c)
        raw["their_stack"] = {"count": c, "html": html}

    # Aggregate
    if counts:
        counts.sort()
        company_count = counts[len(counts) // 2]
    else:
        company_count = 0

    alive = min(
        MAX_ALIVE_SCORE,
        math.log10(company_count or 1) / LOG_SCALE_FACTOR * MAX_ALIVE_SCORE,
    )
    deaditude = round(10 - alive, 2)

    signal_count = sum(
        1
        for src in ("stackshare", "showcase", "their_stack")
        if raw.get(src, {}).get("count")
    )

    if signal_count >= QUALITY_HIGH_THRESHOLD:
        quality = QUALITY_HIGH_VALUE
    elif signal_count >= QUALITY_MED_HIGH_THRESHOLD:
        quality = QUALITY_MED_HIGH_VALUE
    elif signal_count >= QUALITY_MED_THRESHOLD:
        quality = QUALITY_MED_VALUE
    else:
        quality = QUALITY_LOW_VALUE

    metrics = {
        "company_count": company_count,
        "deaditude_score": deaditude,
        "raw": raw,
    }
    logger.debug(
        "Collected signals for %s – count=%s deaditude=%s quality=%s",
        name,
        company_count,
        deaditude,
        quality,
    )
    return metrics, quality


# ---------------------------------------------------------------------------
#  CLI convenience
# ---------------------------------------------------------------------------
def _cli():
    import argparse
    import pprint
    import logging

    p = argparse.ArgumentParser(description="Company adoption collector")
    p.add_argument("name", help="Technology name, e.g. 'Flutter'")
    p.add_argument("-v", "--verbose", action="store_true",
                   help="enable debug logging")
    args = p.parse_args()

    if args.verbose:
        logging.basicConfig(
            level=logging.DEBUG, format="%(levelname)s:%(name)s:%(message)s"
        )
    tech = {"name": args.name}
    metrics, quality = collect_company_signals(tech)
    pprint.pprint(metrics)
    print("quality", quality)


if __name__ == "__main__":
    _cli()
