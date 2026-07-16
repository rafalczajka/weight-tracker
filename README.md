# Weight Tracker

## Migration

The client applications are being migrated gradually to a shared TypeScript
workspace. The existing applications remain the stable versions and continue
to work independently while the replacements are developed.

### Stable applications

```text
app-api/       # Existing .NET API and OpenAPI source
app-cli/       # Existing Python CLI
app-mobile/    # Existing React Native mobile client
```

### TypeScript workspace

```text
package.json               # Root scripts and development dependencies
pnpm-workspace.yaml        # pnpm workspace definition
pnpm-lock.yaml             # Shared dependency lockfile
turbo.json                 # Turborepo task configuration

clients/
  cli/                     # TypeScript CLI distributed as wtrack-next.exe
  mobile/                  # React Native mobile client

packages/
  api-client/              # Shared client generated from OpenAPI
  client-config/           # Shared runtime configuration
  eslint-config/           # Shared ESLint configurations
  typescript-config/       # Shared TypeScript configurations
```

The .NET API remains in `app-api/` and provides the OpenAPI contract for both
generations of clients. Existing applications will only be retired after their
replacements are ready. They may then be moved to an archival directory rather
than deleted. After the client migration, `app-api/` may be renamed to `api/`;
rewriting the API is not part of the current migration.

## TypeScript workspace setup

The workspace requires Node.js 22 or newer and pnpm 10:

```powershell
corepack enable
pnpm install
```

Shared runtime values are versioned in
`packages/client-config/config.json`. Both clients use the same API URL, tenant
ID, client ID and delegated scope. Changing this file requires rebuilding the
standalone CLI because the values are embedded in the executable.

Run the workspace checks from the repository root:

```powershell
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## TypeScript CLI

The new CLI is available during migration as `wtrack-next` and provides the
same commands and aliases as the Python CLI:

```text
login      aliases: signin
logout     aliases: signout
status     aliases: streak
add        aliases: new, insert
report     aliases: show, get, list, ls, display
update     aliases: edit
remove     aliases: rm, delete
```

The chart and the `report --plot` option are intentionally not implemented in
this version.

For local development:

```powershell
pnpm --filter @weight-tracker/cli dev --help
pnpm --filter @weight-tracker/cli build
node clients/cli/dist/wtrack-next.cjs --help
```

Building the standalone Windows x64 executable requires Windows and Node.js 22 or newer:

```powershell
pnpm --filter @weight-tracker/cli build:binary
clients/cli/dist/wtrack-next.exe --help
```

The result is an unsigned, self-contained `wtrack-next.exe` that does not
require Node.js on the target computer.

### Entra configuration

The shared Entra app registration must be configured as a public client:

1. Add `http://localhost` as a **Mobile and desktop applications** redirect
   URI.
2. Add the API delegated permission
   `api://<client-id>/access_as_user` and grant consent.
3. Do not create or configure a client secret.

Authentication uses Authorization Code Flow with PKCE and the system browser.
The MSAL cache is encrypted for the current Windows user with DPAPI and stored
in `%LOCALAPPDATA%\wtrack-next\token-cache.bin`. Persistence and concurrent
access are handled by `@azure/msal-node-extensions`. `wtrack-next logout`
removes the local cache.

### Parallel installation

Run the installer from Bash:

```bash
bash scripts/install-cli.sh
```

The installer always builds `wtrack-next.exe`. When `CLI_APP_INSTALLATION_DIR`
and `CLI_APP_NAME` are both configured in `.env`, it also copies the executable
to `<CLI_APP_INSTALLATION_DIR>/<CLI_APP_NAME>/`, next to the existing
`wtrack.exe`. Otherwise, the copy step is skipped. The installer does not
modify or remove the Python CLI installation.

## OpenAPI client

`packages/api-client` contains a versioned TypeScript SDK generated from
`app-api/src/WeightTracker.Api/openapi.json` by Hey API. Request functions,
models, response types, error types, Bearer authentication, and the Fetch
runtime are generated and shared by the TypeScript CLI and mobile client. The
only handwritten client code configures the base URL and common runtime
errors.

Regenerate and verify the client from the repository root:

```bash
pnpm generate
bash scripts/check-generated.sh
```

CI fails when the generated SDK is not synchronized with the OpenAPI file.

## Legacy applications

The legacy Python CLI requires Python 3.12 or higher. Create and populate its
separate application and tools environments:

```powershell
python -m venv app-cli/.venv
python -m venv app-cli/.venv-tools
cd app-cli
./.venv/Scripts/python.exe -m pip install -r requirements.txt
./.venv-tools/Scripts/python.exe -m pip install -r requirements-tools.txt
```

On Linux or macOS, use `.venv/bin/python` and `.venv-tools/bin/python` instead.

The existing Python OpenAPI client can be regenerated with:

```bash
./app-cli/generate_client.sh
```

`pnpm install` configures `.githooks` as the repository hooks directory
automatically.
