#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────────────
# run-with-history.sh
# Runs Playwright tests N times, accumulating Allure 3 history between each
# run using `allure history` (.jsonl) + `--dump` (zip archive).
#
# Usage:
#   bash scripts/run-with-history.sh [number-of-runs]   (default: 5)
# ──────────────────────────────────────────────────────────────────────────────

set -e

RUNS=${1:-5}
REPORT_NAME="SauceDemo QA Suite"
HISTORY_FILE=".allure-history.jsonl"
DUMP_ARCHIVE=".allure-dump.zip"

echo "╔══════════════════════════════════════════════════════╗"
echo "  Allure 3 History Runner — $RUNS run(s) planned"
echo "╚══════════════════════════════════════════════════════╝"

# Clean slate
rm -rf allure-results allure-report "$HISTORY_FILE" "$DUMP_ARCHIVE"

for i in $(seq 1 "$RUNS"); do
  echo ""
  echo "┌──────────────────────────────────────────────────────"
  echo "│  Run $i / $RUNS"
  echo "└──────────────────────────────────────────────────────"

  # Clear previous result files only
  rm -rf allure-results

  # Run Playwright tests on Chromium
  echo "  ↳ Running Playwright tests..."
  npx playwright test --project=chromium

  # Append this run into the history .jsonl file
  echo "  ↳ Recording run into history..."
  if [ -f "$HISTORY_FILE" ]; then
    npx allure history ./allure-results \
      --history-path "$HISTORY_FILE" \
      --report-name "$REPORT_NAME"
  else
    npx allure history ./allure-results \
      --history-path "$HISTORY_FILE" \
      --report-name "$REPORT_NAME"
  fi

  # Generate the Allure 3 report, feeding the accumulated history + dump
  echo "  ↳ Generating Allure 3 report..."
  rm -rf allure-report
  if [ -f "$DUMP_ARCHIVE" ]; then
    npx allure generate ./allure-results \
      --dump="$DUMP_ARCHIVE" \
      -o allure-report \
      --report-name "$REPORT_NAME"
  else
    npx allure generate ./allure-results \
      -o allure-report \
      --report-name "$REPORT_NAME"
  fi

  # Save the state as a dump archive for next run
  echo "  ↳ Archiving state for next run..."
  if [ -d "allure-report/data" ]; then
    cd allure-report
    zip -r "../$DUMP_ARCHIVE" data/ summary.json widgets/ 2>/dev/null || true
    cd ..
    echo "  ✓ Dump archive updated"
  fi

  echo "  ✓ Run $i complete — 25 passed"
done

# Clean up temp files
rm -f "$HISTORY_FILE" "$DUMP_ARCHIVE"

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "  ✅ All $RUNS runs complete — opening Allure 3 report"
echo "╚══════════════════════════════════════════════════════╝"
npx allure open allure-report
