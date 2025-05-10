#!/usr/bin/env python
"""
Generate technology badges for the main README.md based on the latest
technology updates.
"""

import os
import sys
import re
import logging
from datetime import datetime, timedelta, timezone
from typing import Dict, List, Any
from packages.db.supabase import supabase
from dateutil import parser as dtparse

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("badge-generator")

# Color mapping for verdicts
VERDICT_COLORS = {
    "Very Alive": "brightgreen",
    "Alive": "green",
    "Stable": "yellow",
    "Declining": "orange",
    "Dead": "red",
}

# Maximum number of badges to display
MAX_BADGES = 10


def get_recently_updated_techs(hours: int = 2) -> List[Dict[str, Any]]:
    """
    Get technologies that were updated in the last N hours.

    Args:
        hours: Number of hours to look back

    Returns:
        List of tech records with their latest snapshots
    """
    # Create timezone-aware cutoff time in UTC
    cutoff_time = datetime.now(timezone.utc) - timedelta(hours=hours)
    cutoff_date = cutoff_time.date().isoformat()

    try:
        # Query for snapshots created since the cutoff date
        result = (
            supabase.table("tech_snapshots_v2")
            .select(
                "tech_id, tech_name, deaditude_score, verdict, created_at"
            )
            .gte("snapshot_date", cutoff_date)
            .order("created_at", desc=True)
            .execute()
        )

        # Filter results to match cutoff time (not just date)
        filtered_results = []
        for record in result.data:
            # Parse created_at as timezone-aware using dateutil.parser.isoparse
            created_at = dtparse.isoparse(
                record["created_at"].replace("Z", "+00:00")
            )
            if created_at >= cutoff_time:
                filtered_results.append(record)

        # Get unique technologies (first occurrence = most recent)
        unique_techs = {}
        for snapshot in filtered_results:
            tech_id = snapshot["tech_id"]
            if tech_id not in unique_techs:
                unique_techs[tech_id] = snapshot

        return list(unique_techs.values())[:MAX_BADGES]

    except Exception as e:
        logger.error(f"Failed to fetch recently updated techs: {e}")
        return []


def generate_badge_markdown(tech: Dict[str, Any]) -> str:
    """
    Generate a markdown badge for a technology.

    Args:
        tech: Technology data with name, score, and verdict

    Returns:
        Markdown string for a shield.io badge
    """
    tech_name = tech["tech_name"]
    tech_id = tech["tech_id"]
    score = round(tech["deaditude_score"])
    verdict = tech["verdict"]
    color = VERDICT_COLORS.get(verdict, "lightgrey")

    # Handle tech names with spaces for the URL
    url_tech_name = tech_name.replace('-', '--').replace(' ', '%20')

    # Create badge using shields.io - only showing tech name and score
    # Link to the technology's page on the website
    badge = (
        f"[![{tech_name}: {score}](https://img.shields.io/badge/"
        f"{url_tech_name}-{score}%25-{color}"
        f"?style=flat-square)](https://www.isthistechdead.com/{tech_id})"
    )

    return badge


def update_readme_badges(techs: List[Dict[str, Any]]) -> bool:
    """
    Update the README.md file with badges for recently updated technologies.

    Args:
        techs: List of technologies with their latest data

    Returns:
        True if README was updated, False otherwise
    """
    # Get the project root directory
    project_root = os.path.dirname(os.path.dirname(os.path.dirname(
        os.path.abspath(__file__))))

    # Path for README
    readme_path = os.path.join(project_root, "README.md")

    # Read the current README
    try:
        with open(readme_path, "r") as f:
            content = f.read()
    except Exception as e:
        logger.error(f"Failed to read README.md: {e}")
        return False

    # Generate badges section
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    badges_section = f"\n## Latest Technology Updates ({today})\n\n"

    if techs:
        for tech in techs:
            badges_section += generate_badge_markdown(tech) + " "
    else:
        badges_section += "*No technologies were updated in the last day.*"

    # Check if badges section already exists and update it
    badge_pattern = (
        r"\n## Latest Technology Updates \(\d{4}-\d{2}-\d{2}\)"
        r"[\s\S]*?(?=\n## |$)"
    )

    if re.search(badge_pattern, content):
        # Replace existing badges section
        new_content = re.sub(badge_pattern, badges_section, content)
    else:
        # Add new badges section after What Is This section
        after_pattern = r"(## What Is This\?[\s\S]*?)(?=\n## )"
        after_what_section = re.search(after_pattern, content)
        if after_what_section:
            insertion_point = after_what_section.end()
            new_content = (
                content[:insertion_point] +
                badges_section +
                content[insertion_point:]
            )
        else:
            # Fall back to inserting after project description
            new_content = content + badges_section

    # Write updated README
    try:
        with open(readme_path, "w") as f:
            f.write(new_content)
        logger.info(f"Updated README.md with {len(techs)} technology badges")
        return True
    except Exception as e:
        logger.error(f"Failed to write updated README.md: {e}")
        return False


def main():
    """Main function to generate and update badges."""
    logger.info("Fetching recently updated technologies")
    updated_techs = get_recently_updated_techs(hours=2)

    if updated_techs:
        logger.info(f"Found {len(updated_techs)}" +
                    "recently updated technologies")
        update_readme_badges(updated_techs)
    else:
        logger.info("No technologies were updated recently")
        update_readme_badges([])


if __name__ == "__main__":
    main()
