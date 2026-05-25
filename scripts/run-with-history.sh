#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────────────
# run-with-history.sh
# Runs Playwright tests N times using Allure 3's native history tracking.
# Keeps the allure-history.jsonl file to accumulate trends across runs.
# ──────────────────────────────────────────────────────────────────────────────

set -e

RUNS=${1:-5}
REPORT_NAME="SauceDemo QA Suite"

echo "╔══════════════════════════════════════════════════════╗"
echo "  Allure 3 History Runner — $RUNS run(s) planned"
echo "╚══════════════════════════════════════════════════════╝"

# Clean old temporary results and reports, but KEEP allure-history.jsonl
rm -rf allure-results allure-report

for i in $(seq 1 "$RUNS"); do
  echo ""
  echo "┌──────────────────────────────────────────────────────"
  echo "│  Run $i / $RUNS"
  echo "└──────────────────────────────────────────────────────"

  # 1. Run Playwright tests on Chromium (setting RUN_INDEX to simulate flakiness)
  RUN_INDEX="$i" npx playwright test --project=chromium || true

  # 2. Generate report using Allure 3 config (history accumulates in allure-history.jsonl)
  npx allure generate ./allure-results \
    -o allure-report \
    --config allurerc.json \
    --report-name "$REPORT_NAME"

  echo "  ✓ Run $i complete — history logged"
done

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "  ✅ All $RUNS runs complete — opening Allure 3 report"
echo "╚══════════════════════════════════════════════════════╝"
npx allure open allure-report
