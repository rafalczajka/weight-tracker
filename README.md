# Weight Tracker

A personal health app for tracking weight, nutrition, and health goals.

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
docker compose -f infra/local/compose.yml up -d azurite
docker compose -f infra/local/compose.yml run --rm storage-init
dotnet run --project api/src/WeightTracker.Api
```

The `storage-init` service creates the local `CalorieData`, `UserData` and `WeightData`
tables. It must finish successfully before the API starts.

Run or build the CLI:

```bash
pnpm --filter @weight-tracker/cli dev --help
pnpm --filter @weight-tracker/cli build:binary

cd ./clients/cli/dist/

wtrack.exe --help
wtrack.exe weight list --plot --moving-average 30 --bmi
wtrack.exe calories list --limit-days 7
wtrack.exe food get <barcode>
wtrack.exe profile update --height 180 --activity moderately-active
wtrack.exe calculate bmi
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

Generated request schemas are used by `packages/client-core` to share input
parsing and validation between the CLI and mobile application.

Archived applications under `legacy/` are excluded from active tooling and
dependency updates.
