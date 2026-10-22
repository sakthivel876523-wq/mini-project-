# CivicPulse — mini-project demo

## Run locally

Open `civicpulse/dist/index.html` in a browser, or run `python -m http.server 5174 --bind 127.0.0.1` from `civicpulse/dist`, then open http://127.0.0.1:5174.

## Two-minute demo

1. Overview: explain the four live counters and category breakdown. The initial five records are sample data.
2. Report an issue: click **Fill demo example**, optionally attach a photo, then **Preview smart triage**.
3. Show Roads category, High priority, Roads & Highways department, suggested action and the possible duplicate warning.
4. Submit. Copy the generated CP tracking ID.
5. Incident queue: open the new report, set **In Progress**, then **Save status**.
6. Track a report: enter the same ID and show the updated journey and activity log. Refresh to demonstrate persistence.
7. Optionally export the incident queue as CSV.

## Honest project explanation

This is an interactive frontend prototype of the attached AI-powered smart city concept. It uses deterministic text rules for category, priority, summary truncation and department routing. Duplicate detection compares category and normalized exact location text. Photos are stored as evidence and are not classified. GPS is optional and requires browser permission; a landmark works without it. Coordinates can be opened on OpenStreetMap.

Data persists in localStorage for the current browser and origin, including resized photos. There is no shared server database, authentication, real municipal integration, trained model, embedding search or continuous learning. The admin screen is a demonstration role, not a secured portal.

Next implementation stage: add authenticated citizen/admin roles, FastAPI and PostgreSQL with shared records and object storage, then evaluate trained image/NLP models and geospatial/embedding duplicate detection using labelled complaint data.

## Design

Figma: https://www.figma.com/design/2eZcjlZydYwNmZ2DqxnpbS

Four editable reference screens: overview, citizen report, incident queue and report tracking. Overview → Report and Submit → Tracking are linked for a simple Figma walkthrough. The website is the functional prototype.

## Demo preparation

Use the same browser throughout: another device or browser has separate records. Use **Reset demo data** in the queue to return to the sample records; it asks for confirmation. Keep a local copy for offline demonstration. Fonts fall back to Arial if Google Fonts is unavailable.

## Image interactions

Choose an illustrated Roads, Water or Waste card to start a pre-filled report. Attach a JPG, PNG or WebP (up to 3 MB), click its preview to enlarge it, or remove it. Photos remain evidence only. The Figma screens include clickable navigation and matching illustrated cards.

