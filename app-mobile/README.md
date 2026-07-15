# Weight Tracker Mobile

React Native application for adding one weight entry for the current UTC day.

## Configuration

Create the local configuration file before running checks or building the application:

```sh
cp config.template.json config.json
```

On PowerShell, use:

```powershell
Copy-Item config.template.json config.json
```

Fill in the following values in `config.json`:

- `api.baseUrl`: Weight Tracker API base URL without a trailing slash.
- `auth.clientId`: application client ID of the Entra registration shared by the CLI, mobile client, and API scope.
- `auth.tenantId`: directory tenant ID containing the app registration.

`config.json` is ignored by Git and must be created manually in each checkout. Its values are bundled with the mobile application and must not contain secrets.

## Microsoft Entra setup

Use the existing single-tenant Weight Tracker app registration shared with the CLI and API:

1. Add `com.weighttracker.auth://oauth/redirect/` as a **Mobile and desktop applications** redirect URI.
2. Ensure it exposes the `api://<clientId>/access_as_user` delegated scope.
3. Grant consent for the delegated permission when required by the tenant policy.
4. Copy its application client ID and directory tenant ID to `config.json`.

The mobile application is a public client. Do not create or embed a client secret.

## Project structure

- `src/App.tsx` provides the application shell and composes authentication with the weight-entry feature.
- `src/auth` handles Entra authentication, session state, and refresh-token storage.
- `src/features/weight-entry` contains the form, validation, and controller for adding today's weight.
- `src/ui` contains the shared theme and controls.
- `src/api.ts` sends the weight to the API.
- `android` and `ios` contain the native React Native projects and OAuth redirect configuration.

## Run on Android

Install dependencies:

```sh
npm ci
```

Start Metro:

```sh
npm start
```

In another terminal, build and install the application:

```sh
npm run android
```

## Run on iOS

Install CocoaPods dependencies on macOS before the first build or after changing native packages:

```sh
cd ios
bundle install
bundle exec pod install
cd ..
npm run ios
```

## Checks

```sh
npm run lint
npm run typecheck
npm test -- --runInBand
```
