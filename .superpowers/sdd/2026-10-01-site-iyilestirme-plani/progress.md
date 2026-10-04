# SDD ledger — plan: docs/superpowers/plans/2026-10-01-site-iyilestirme-plani.md

Setup: existing isolated worktree verified on codex/site-iyilestirme-2026.
Pre-flight: shared interfaces are carousel → stage controller, main.js → modal events, and index.html → SEO contract tests; all are already present and will be preserved.

Task 1: complete (commits pending, tests: node --test scripts/seo-contract.test.mjs scripts/plan-completion.test.mjs → 8/8 pass)
Task 1: Ruling: external DNS, Search Console recrawl, and backlink publication remain documented dependencies because the repository cannot safely mutate those systems.
Task 2: complete (commits pending, tests: node --check js/main.js/js/carousel.js/js/scene/stage.js/js/visual-bootstrap.js and git diff --check → passed)
