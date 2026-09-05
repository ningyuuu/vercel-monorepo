# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Clinic/GP staff in Singapore who need to check Innoquest test menus and pricing for patients during consults and bookings. Maintained by the author as a hobby project for convenience; not built by a medical professional.

## Product Purpose

A searchable, filterable database of medical test profiles and individual tests from Innoquest Singapore's 2026 Test Menu, with codes, contents, and costs. It replaces digging through the official PDF with instant search, test-item filtering, and sorting. Success is a user finding the right test profile and its price in seconds.

## Positioning

A faithful, cleaned republication of the official Innoquest menu: test names normalized between profiles and individual tests with every correction documented, plus transparent data-cleaning methodology. A neighboring product could copy the raw PDF, but not the corrected, cross-aligned dataset and its documented methodology. Multi-lab comparison across Singapore labs is the confirmed future direction.

## Operating Context

Used at the point of care: GP consults and clinic front-desk bookings. Source of truth is the Innoquest 2026 Test Menu PDF (https://www.innoquest.com.sg/test-menu/); the app mirrors the 2026 menu edition. Costs are in Singapore dollars ($).

## Capabilities and Constraints

- 682 records: 199 profiles, 364 single tests, 119 single allergies (`lib/data.csv`).
- AND-match filtering by contained test items; fuzzy search across code, name, contents, cost, remarks; sortable columns.
- Experimental "Show Single Tests" mode includes single tests and allergies; that data is imperfect (scraped from PDF) and errors are possible.
- Item-specific comments (e.g. "only for female patients") moved to a remarks column; drug-test items missing from the individual-tests list were not added.
- This page does not offer medical advice; users must verify against the Innoquest source of truth.
- Not affiliated with or endorsed by Innoquest Diagnostics.
- Open decision: refresh cadence for future menu years (e.g. 2027) is undecided.

## Brand Commitments

The product name derives from the lab it indexes; it is an unofficial tool and must never imply endorsement. The disclaimer copy (data source banner and About page) is binding and must be preserved in any redesign.

## Evidence on Hand

- `lib/data.csv` — the full cleaned 2026 menu dataset.
- `lib/test-items.json` — deduplicated individual test names.
- About page (`/about`) — data-cleaning methodology and a 50+ row table of test-name corrections (PDF name → normalized name).
- Absences to respect: no medical professional has reviewed the data; no testimonials, press, or user metrics exist. Future work must not fabricate any of these.

## Product Principles

1. Fastest path to the answer: from a test name or symptom to code, contents, and price in seconds.
2. Fidelity to source: never invent or improve beyond the official menu; document every deviation.
3. Trust through transparency: the disclaimer and cleaning methodology stay one click away.
4. Structure for the multi-lab future: keep data shaped so cross-lab comparison can be added without rework.
