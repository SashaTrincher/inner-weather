# Inner Weather

A responsive emotion-reflection web app. Ten questions produce a closest emotional match, an explanation tied to the answers, and three ranked alternatives. Sixteen hand-authored profiles cover simple feelings and more complex experiences. Rankings are heuristic, not clinical assessments or calibrated probabilities.

## Run

From this directory, run `node server.cjs` and open http://127.0.0.1:4173. No install or build is required. The `dist` folder can also be served by any static web host.

Answers exist only in tab memory. There is no backend, analytics, or answer persistence. Google Fonts supplies the optional typography, with local font fallbacks.

## Files

- `dist/index.html`: layout and explanation dialog
- `dist/style.css`: responsive styling
- `dist/model.js`: question definitions, profiles and distance-based ranking
- `dist/app.js`: questionnaire and results flow
- `server.cjs`: local preview server

## Validation

JavaScript syntax checks passed. All 16 profile vectors returned their own profile as the strongest match; incomplete and out-of-range inputs were rejected. Browser checks covered the ten-question journey, a result with exactly three alternatives, opening an alternative, and reviewing retained answers. A read-only WebMCP tool is feature-detected; registration was observed, but tool invocation validation was unavailable in this browser session. Mobile layout is implemented but was not separately browser-tested.

## Hosting status

A private Sites project was registered in `.openai/hosting.json`. Publication did not complete: the source host connection failed, then the Sites publishing helper became unavailable in the environment. Reuse the existing project ID when resuming publication. No live deployment was verified.
