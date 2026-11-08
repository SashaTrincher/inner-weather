# Inner Weather

A responsive emotion-reflection web app with two paths:

- **Quick check-in:** the original ten questions and sixteen emotional patterns, about two minutes.
- **In-depth check-in:** 42 questions across seven sections and 34 emotional patterns, about seven to ten minutes. Covers emotional tone, physical sensations, thoughts, relationships, experiences, positive possibilities and current context.

Both provide a closest match, its meaning, answer-based explanations and exactly three alternatives. Results acknowledge close or equal matches. The in-depth result also includes body-and-mind summaries and optional physical/time context. Users can switch paths, resume in the current tab, review individual answers and recalculate results. Each path has independent state.

Rankings are editorial heuristics, not clinical assessments or calibrated probabilities. More questions do not make the questionnaire clinically validated.

## Run

From this directory, run `node server.cjs` and open http://127.0.0.1:4173. No install or build is required. The `dist` folder can also be served by any static web host.

Answers exist only in tab memory. There is no backend, analytics, or answer persistence. Google Fonts supplies the optional typography, with local font fallbacks.

## Files

- `dist/index.html`: layout and explanation dialog
- `dist/style.css`: responsive styling
- `dist/model.js`: original quick questionnaire and distance-based ranking
- `dist/deep-model.js`: extended questionnaire, profiles, contextual interpretation and summaries
- `dist/app.js`: questionnaire and results flow
- `server.cjs`: local preview server

## Validation

Run `node --test tests/model.test.cjs`. Eight test groups cover quick-mode compatibility, input validation (including sparse arrays), all extended profile definitions, distinguishing emotional cues, physical-context independence, limited physical-sensation weighting, stable mixed-answer rankings and preserving coexisting signals.

Browser checks covered both complete questionnaire journeys, three alternatives, switching modes, resuming partial answers, skipping optional context, contextual result text, editing an individual answer, recalculated results, restart and reload. The read-only WebMCP result was invoked successfully. Responsive CSS is included; a separate mobile viewport test was not performed.

## Matching and physical context

The in-depth matcher combines distance across all scored dimensions (40%) with distance on each pattern's defining emotional cues (60%). Body tension, restlessness and heaviness have lower weights in the broad comparison. Sleep, physical discomfort, unmet needs, possible physical influences and duration never change the emotion rank: they generate separate context notes, and may be skipped. This avoids treating nonspecific physical experiences as proof of a mental state.

Background reference: [NHS stress guidance](https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/stress/). This informs the distinction between physical and mental experiences, not the scoring system or its validity.

## Hosting status

A private Sites project was registered in `.openai/hosting.json`. Publication did not complete: the source host connection failed, then the Sites publishing helper became unavailable in the environment. Reuse the existing project ID when resuming publication. No live deployment was verified.

The November 2026 questionnaire update is local. No repositories or commits were created for this update; the user's instructions require an explicit request before either action. The Sites publication helper commits and pushes source, so it was not run.
