# Weight Tracker

Weight tracking system with a .NET API, a TypeScript CLI and a React Native
mobile application.

## Setup

Requirements:

- Node.js 22 or newer
- pnpm 10
- .NET SDK 10
- Docker
- Android SDK for mobile development

```bash
corepack enable
pnpm install
dotnet restore api
```

Runtime configuration is stored in `packages/client-config/config.json` and is
shared by both TypeScript clients.

## Development

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
dotnet test api
```

Run the API:

```bash
docker compose -f infra/local/docker-compose.yml up -d azurite
docker compose -f infra/local/docker-compose.yml run --rm storage-init
dotnet run --project api/src/WeightTracker.Api
```

The `storage-init` service creates the local `WeightData` table. It must finish
successfully before the API starts.

Run or build the CLI:

```bash
pnpm --filter @weight-tracker/cli dev --help
pnpm --filter @weight-tracker/cli build:binary
clients/cli/dist/wtrack.exe --help
```

`bash scripts/install-cli.sh` builds the CLI and optionally installs it using
values from `.env`.

Run the mobile application:

```bash
pnpm --filter @weight-tracker/mobile start
pnpm --filter @weight-tracker/mobile android
```

## OpenAPI Client

Regenerate the shared client after changing `api/src/WeightTracker.Api/openapi.json`:

```bash
pnpm generate
bash scripts/check-generated.sh
```

Archived applications under `legacy/` are excluded from active tooling and
dependency updates.
