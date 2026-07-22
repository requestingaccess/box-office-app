1. Database Architecture (PostgreSQL)

The core data structures must enforce relational integrity and manage the seasonal nature of the game.

Table: seasons

    id (UUID, Primary Key)

    name (String, e.g., "Summer Blockbuster 2026")

    start_date (Timestamp)

    end_date (Timestamp)

    is_active (Boolean)

Table: users

    id (UUID, Primary Key)

    username (String, Unique)

    email (String, Unique)

    created_at (Timestamp)

Table: movies

    id (UUID, Primary Key)

    season_id (UUID, Foreign Key)

    tmdb_id (Integer, Unique)

    title (String)

    release_date (Date)

    status (Enum: hidden, open, locked, estimated, scored)

    estimate_revenue (Numeric, Nullable)

    actual_revenue (Numeric, Nullable)

Table: predictions

    id (UUID, Primary Key)

    user_id (UUID, Foreign Key)

    movie_id (UUID, Foreign Key)

    predicted_revenue (Numeric)

    score_awarded (Numeric, Nullable)

    submitted_at (Timestamp)

    Constraint: Unique index on (user_id, movie_id).

Table: leaderboard_standings

    id (UUID, Primary Key)

    user_id (UUID, Foreign Key)

    season_id (UUID, Foreign Key)

    total_points (Numeric)

    predictions_count (Integer)

    average_score (Numeric, Calculated)

2. Backend API & Automation Pipeline

The backend will rely on Next.js Serverless API routes triggered by external cron jobs (e.g., GitHub Actions or Vercel Cron) to keep compute costs at zero.

Job 1: TMDB Sync (Runs Daily at 2:00 AM EST)

    Queries the TMDB API for wide-release films in the US market.

    Inserts new films into the movies table.

    If release_date - current_date <= 30 and status == hidden, update status to open.

Job 2: Prediction Lock (Runs Thursdays at 3:00 PM EST)

    Queries movies where release_date is the upcoming Friday.

    Updates status from open to locked.

    Any client-side prediction submissions after this timestamp must be rejected by the server.

Job 3: Estimates Scraper (Runs Sundays at 12:00 PM EST)

    Executes a Python script using BeautifulSoup or Apify to scrape Box Office Mojo.

    Pushes estimated dollar amounts to estimate_revenue.

    Updates status to estimated.

    Triggers a background calculation to show users provisional scores on the frontend.

Job 4: Actuals & Scoring (Runs Mondays at 4:00 PM EST)

    Scrapes final official numbers.

    Pushes actual dollar amounts to actual_revenue.

    Executes the scoring algorithm for all predictions tied to that movie.

    Updates score_awarded on the predictions table.

    Updates total_points, predictions_count, and average_score on the leaderboard_standings table.

    Updates movie status to scored.

3. The Scoring Algorithm

The scoring math is handled entirely on the backend during the Monday cron job. The percentage error needs to be translated into an exponential decay curve that respects the bounds (+100 max, 0 at 30% error, -50 min).

Step 1: Calculate Percentage Error
error_percentage = abs(predicted_revenue - actual_revenue) / actual_revenue

Step 2: Apply the Decay Formula
To achieve an exponential decay where 0% error = 100 points and 30% error = 0 points, the formula relies on a decay constant.

base_score = 100 * (decay_constant ^ (error_percentage * 100))

To make 30% error equal 0, we introduce a shift.
A practical implementation that an AI agent can build uses a piecewise or shifted exponential function:

raw_score = 125 * (e ^ (-0.03 * (error_percentage * 100))) - 25
(At 0% error: 125 * 1 - 25 = 100)
(At 30% error: 125 * 0.406 - 25 ≈ 25 - 25 = 0)
(At 60% error: 125 * 0.165 - 25 ≈ 20 - 25 = -4)

Step 3: Apply the Hard Floor
final_score = max(-50, raw_score)

Step 4: Apply the Early Bird Multiplier

    Calculate days_in_advance = movie.release_date - prediction.submitted_at

    If days_in_advance >= 14, multiplier is 1.25

    If days_in_advance >= 4, multiplier is 1.10

    Else, multiplier is 1.0

    Note: The multiplier is only applied if final_score > 0 to avoid penalizing early guesses that miss the mark.

4. Frontend Requirements

The React frontend requires specific states to guide the user through the loop.

    Release Feed: A horizontal scrolling or grid layout of upcoming movies pulled from TMDB. Must visually distinguish between open (accepting guesses), locked (waiting for weekend), and scored (finished).

    Prediction Interface: An input field that automatically formats numbers into currency. Must display a real-time countdown timer to the Thursday lock.

    Leaderboard View: Defaults to the current active season. Ranks players strictly by average_score. Must gray out or hide players who have not met the minimum 5-prediction threshold.

    Player Profile: A historical graph plotting the user's score_awarded over time. Visualizes their accuracy percentage alongside the actual box office results to create a sense of progression.