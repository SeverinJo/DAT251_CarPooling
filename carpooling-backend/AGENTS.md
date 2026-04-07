# AGENTS.md

Instructions for the coding agent operating in this repo. This is not end-user documentation.

## Context (Keep Current)
- Build: Gradle, Spring Boot, Java 21.
- Data: Spring Data JPA + Flyway, PostgreSQL.
- Testing tools present: JUnit Platform, Testcontainers, JaCoCo.

When unsure, inspect the repo rather than guessing.

## Scope Discipline
- Do the minimum necessary to satisfy the user request.
- Avoid opportunistic refactors unless they directly reduce risk for the requested change.
- If you notice issues outside scope, mention them briefly as suggestions (with concrete location and impact), but do not expand work without approval.
- Avoid large renames/moves unless explicitly requested (they create merge pain and can break contracts).

## Build and Verification
- Do not run tests unless the user explicitly asks.
- Do not compile/build/package/run the application unless the user explicitly asks.
- You may read files, search the codebase, and make edits without running builds/tests.
- If you believe execution is required to avoid a likely regression, ask first and state:
  - What you want to run (`./gradlew test`, `./gradlew build`, `./gradlew bootRun`, etc.)
  - What risk it mitigates
  - What you expect to learn from the output

Reference commands (run only if asked):
```bash
./gradlew bootRun
./gradlew test
./gradlew build
```

## Standards and Conventions
- Language: Prefer consistent English naming for identifiers, packages, DTOs, logs, and comments.
- Do not casually rename existing non-English identifiers, endpoints, JSON fields, or DB columns.
  - If you propose a rename, treat it as a migration: call out compatibility risks and suggest a safe transition plan.
- Architecture:
  - Controllers: thin, orchestration only (validation + auth + calls into service layer).
  - Services: business logic, authorization decisions where appropriate, transactional boundaries when using JPA.
  - Prefer DTOs at API boundaries; do not expose JPA entities directly from controllers.
- Persistence:
  - Be explicit about fetch strategy and pagination; avoid unbounded queries.
  - Call out likely N+1 patterns and suggest minimal fixes (fetch joins, entity graphs, batching) when seen.
- Migrations:
  - Treat Flyway migrations as production contracts; do not introduce destructive changes without explicit approval.

## Working Style
- Keep changes small and cohesive; optimize for reviewability and low regression risk.
- Before editing, confirm the current patterns in this repo and follow them (package layout, naming, exception handling).
- When you see problems, suggest them with: file/area, risk, and smallest viable fix.
- Suggest improvements to `AGENTS.md` when it would prevent repeated mistakes or clarify recurring decisions.

## Communication
- Ask targeted questions when requirements are ambiguous (prefer 1-3 crisp questions).
- When making a design choice, state the assumption and the tradeoff in one sentence.
- Call out breaking-change risks explicitly (API, security rules, DB schema, migrations, auth flows).
- Summarize what changed and where; avoid long narratives.
