# Muonroi.Ui.Engine

Hybrid UI engine runtime for Muonroi platform.

## Scope

- Backend (MuonroiBuildingBlock) owns UI contracts and policy/permission/license decisions.
- This repo owns frontend runtime engine and framework adapters.
- UI developers focus on layout/theme/UX while core behavior stays metadata-driven.

## Packages

- `@muonroi/ui-engine-core`: contracts, runtime store, API client, render planner.
- `@muonroi/ui-engine-angular`: Angular-oriented mapping helpers.
- `@muonroi/ui-engine-react`: React-oriented mapping helpers.
- `Muonroi.Ui.Engine.Mvc`: ASP.NET MVC runtime client package.

## Local Development

```bash
npm install
npm run test
npm run build
```

```bash
./scripts/generate-ui-clients.sh --openapi http://localhost:5000/swagger/v1/swagger.json --framework all
```

For detailed architecture, see `docs/UI-ENGINE-ARCHITECTURE.md`.