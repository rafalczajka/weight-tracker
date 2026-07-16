# Weight Tracker

## Migration

The client applications will be migrated gradually to a shared TypeScript
workspace. During the migration, the existing applications remain the stable
versions and continue to work independently.

### Current stable applications

```text
app-api/       # Existing .NET API and OpenAPI source
app-cli/       # Existing Python CLI
app-mobile/    # Existing React Native mobile client
```

### New client workspace

```text
package.json               # Root scripts and development dependencies
pnpm-workspace.yaml        # pnpm workspace definition
pnpm-lock.yaml             # Shared dependency lockfile
turbo.json                 # Turborepo task configuration

clients/
  cli/                     # New TypeScript CLI
  mobile/                  # New React Native mobile client

packages/
  api-client/              # Client generated from the API OpenAPI document
  client-config/           # Shared runtime configuration for both clients
  eslint-config/           # Shared ESLint configuration
  typescript-config/       # Shared TypeScript configurations
  charts/                  # Shared chart definitions and data transformations
```

The root `pnpm-workspace.yaml` registers `clients/*` and `packages/*` as
workspaces. Each client and shared package will have its own `package.json`,
allowing Turborepo to derive their dependency and task graph. The versioned
`packages/client-config/config.json` will contain the shared API URL, tenant ID,
and client ID.

Install dependencies and run tasks with the pnpm version pinned by the project:

```sh
corepack pnpm install --frozen-lockfile
corepack pnpm build
corepack pnpm lint
corepack pnpm test
corepack pnpm typecheck
```

The .NET API remains in `app-api/` and provides the OpenAPI contract for both
generations of clients. Until the migration is complete, directories named
`app-*` contain the stable implementations, while `clients/*` and `packages/*`
contain the new TypeScript implementation. Existing applications will only be
retired after their replacements are ready for use. After the client migration,
`app-api/` may be renamed to `api/` for consistency with the new structure. This
would only be a directory rename; rewriting the API is not part of the current
migration plan.

## requirements

python 3.12 or higher

Create CLI and tools environments:

```powershell
python -m venv app-cli/.venv
python -m venv app-cli/.venv-tools
```

Install dependencies:

```powershell
# windows
cd app-cli
./.venv/Scripts/python.exe -m pip install -r requirements.txt
./.venv-tools/Scripts/python.exe -m pip install -r requirements-tools.txt
```

```bash
# linux/mac
cd app-cli
./.venv/bin/python -m pip install -r requirements.txt
./.venv-tools/bin/python -m pip install -r requirements-tools.txt
```

## githooks setup

`git config core.hooksPath .githooks`

## CLI App Usage

```
Usage: wtrack [OPTIONS] COMMAND [ARGS]...

Options:
  --help   Show this message and exit.

Commands:
  login    aliases: signin
  logout   aliases: signout
  status   aliases: streak
  add      aliases: new, insert
  report   aliases: show, get, list, ls, display
  update   aliases: edit
  remove   aliases: rm, delete
```

## OpenAPI Python Client

The CLI uses a generated Python client (based on OpenAPI doc).

Generate and install locally:

```
./app-cli/generate_client.sh
```
