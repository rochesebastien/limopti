<critical>
- Use Yarn workspaces and keep `yarn.lock` synchronized with dependency changes.
- Use Oxlint and Oxfmt as the only linting and formatting tools; their root config files own code style.
- Treat `apps/web/.adonisjs/` and `apps/web/types/db.ts` as generated code. Regenerate them through Adonis or `yarn workspace @limopti/web db:codegen`.
- Keep delivery dependencies pointing from `apps/web/app` to `apps/web/src`; application modules never import from `app`.
- Never label static GTFS data, interpolated positions, or fixtures as real-time data.
- Preserve source attribution, feed validity, freshness, and confidence whenever mobility data crosses a boundary.
</critical>

## Architecture

Architecture: read [the application architecture](docs/architecture/application.md) before adding or refactoring controllers, Actions, Queries, repositories, domain objects, jobs, or capability boundaries.

Domain language: read [the glossary](CONTEXT.md) before naming or changing domain concepts.

Mobility data: use the dedicated TCL Limoges feed (transport.data.gouv.fr resource 82348) instead of the regional aggregate when a Limoges-only dataset is sufficient. Favorites represent journey intent and never persist a GTFS `trip_id` as their stable identity.

Use Kysely with Postgres for persistence. Keep database invariants in migrations and persistence mapping inside repositories. Prefer explicit read models for non-trivial reads and domain objects for command paths that enforce business rules.

## Design system

Read [the design system guide](docs/agents/design-system.md) before changing `packages/design-system` or extracting UI from an Inertia page.

## Verification

Run `yarn lint`, `yarn format`, `yarn typecheck`, and `yarn test` before committing. Use Conventional Commits.
