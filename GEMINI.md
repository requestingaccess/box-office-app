# Box Office Prediction Game - AI Agent Instructions

## Project Overview
This project is a web-based game where users predict the domestic opening weekend box office gross of upcoming wide-release movies. Players are ranked on a seasonal global leaderboard based on their average point yield per prediction. 

## Core Tech Stack
*   **Frontend & API Framework:** Next.js (React)
*   **Database:** PostgreSQL (e.g., Supabase)
*   **Movie Metadata:** TMDB API
*   **Box Office Data:** Python-based scraper (GitHub Actions cron job)

## Key Mechanics & Rules
1.  **Prediction Window:** 
    *   Opens 30 days before a film's release date (synced via TMDB).
    *   Locks exactly on Thursday at 3:00 PM EST before the weekend release.
    *   Edge case handling: If a film appears in the database <30 days before release, open predictions immediately.
2.  **Scoring System (Bounded Exponential Decay):**
    *   Scoring uses percentage accuracy, not absolute dollar variance.
    *   +100 points (perfect guess).
    *   0 points (30% error - the breakeven point).
    *   -50 points (hard floor penalty for massive misses).
    *   Skipping a movie yields 0 points.
    *   Rankings are determined by **Average Points per Prediction** (minimum 5 predictions required to qualify).
    *   Seasonal leaderboards (e.g., "Oscar Season", "Summer Blockbuster").
3.  **Data Pipeline:**
    *   **Daily:** Sync with TMDB to capture new wide releases.
    *   **Thursday 3 PM EST:** Lock weekend predictions.
    *   **Sunday 12 PM EST:** Scrape weekend estimates, update UI with provisional scores.
    *   **Monday 4 PM EST:** Scrape final actuals, finalize scores, update player averages.

## Coding Best Practices
*   **Database Integrity:** Use foreign keys and strict constraints for Users, Movies, and Predictions. Ensure transactions are used when running the Monday scoring batch.
*   **Timezone Enforcement:** All lock times and cron triggers must be strictly evaluated against EST/EDT (US domestic time) to prevent exploits.
*   **Scraper Resilience:** Box office websites change DOM structures. Use robust CSS selectors and error logging. Fail gracefully if a scrape fails.
*   **Serverless Optimization:** Rely on Next.js API routes triggered by external cron jobs (like GitHub Actions) to minimize idle server costs.
