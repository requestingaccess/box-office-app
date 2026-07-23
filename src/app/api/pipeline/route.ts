import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { job } = body;

    let result = {};

    switch (job) {
      case 'tmdb-sync':
        result = store.runJob1TmdbSync();
        return NextResponse.json({
          success: true,
          job: 'Job 1: TMDB Sync',
          message: 'Synced wide releases from TMDB and updated open statuses.',
          data: result,
        });

      case 'lock-predictions':
        result = store.runJob2LockPredictions();
        return NextResponse.json({
          success: true,
          job: 'Job 2: Thursday 3 PM EST Prediction Lock',
          message: 'Locked upcoming weekend predictions.',
          data: result,
        });

      case 'scrape-estimates':
        result = store.runJob3EstimateScraper();
        return NextResponse.json({
          success: true,
          job: 'Job 3: Sunday 12 PM EST Estimates Scraper',
          message: 'Scraped weekend estimates and calculated provisional scores.',
          data: result,
        });

      case 'score-actuals':
        result = store.runJob4ActualsAndScoring();
        return NextResponse.json({
          success: true,
          job: 'Job 4: Monday 4 PM EST Actuals & Batch Scoring',
          message: 'Finalized actual box office numbers, executed scoring transaction, and updated leaderboard averages.',
          data: result,
        });

      default:
        return NextResponse.json({ success: false, message: 'Invalid job specified.' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
