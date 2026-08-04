# Mobile UI/UX Plan

## Summary

Expand the mobile client into a simple companion to the CLI. The application
will support weight and calorie tracking, food barcode scanning, health
calculators, and profile management.

The existing weight chart will be removed and replaced with a compact table of
recent measurements. The interface will remain functional, restrained,
responsive, and consistent across light and dark themes.

## Navigation

Use five bottom tabs, each with its own navigation stack:

1. **Home**: daily overview, quick actions, and calculators.
2. **Weight**: recent measurements and weight management.
3. **Scan**: barcode scanner and product details.
4. **Calories**: calorie history and entry management.
5. **Account**: profile and sign-out.

Nested screens use a standard header with a title and back button. The
persistent global `Weight Tracker` header will be replaced by screen-specific
headers to preserve vertical space.

## Authentication

### Session restoration

- Display a centered loading indicator while restoring the session.
- Redirect to Sign In when no valid session exists.
- Redirect from any authenticated screen when the session expires.

### Sign In

- Application name and a single `Sign in` button.
- Loading, authentication error, and retry states.
- No additional onboarding or marketing content.

## Home

The initial screen will provide a compact daily dashboard:

- Today's weight with `Add` or `Edit` action.
- Today's calorie total and number of entries.
- Current and longest weight-entry streak.
- Quick actions: add weight, add calories, and scan product.
- Calculator links: BMI, calorie requirement, and protein requirement.
- Pull-to-refresh for all displayed data.

Content will use full-width sections separated by dividers rather than a grid
of decorative cards.

## Weight

### Weight History

Replace the existing Chart tab and chart components with a recent-measurements
table.

- Show the latest 10 records by default, newest first.
- Columns: date, weight, and change from the previous measurement.
- Show compact minimum, maximum, and average values for the loaded range.
- Provide `Load more` in increments of 10.
- Provide optional `From` and `To` date filters in a filter sheet.
- Row selection opens Weight Details.
- A plus icon in the header opens Add Weight.
- Empty state contains an `Add weight` action.

### Add Weight

- Weight input with `kg` suffix.
- Date picker defaulting to the current API day.
- Primary `Add weight` button.
- Inline validation and request status.
- A conflict does not overwrite the entry and offers `View existing entry`.

### Weight Details

- Date, weight, and change from the preceding measurement.
- Explicit `Edit` and `Delete` actions.
- Date remains read-only.

### Edit Weight

- Reuse the weight form with the current value.
- Save only the weight value.
- Confirm deletion through a standard destructive dialog.

## Calories

### Calorie History

- Show daily groups newest first.
- Columns: date, total calories, and number of entries.
- Load the latest seven recorded days initially.
- Support `Load more` and `From`/`To` date filters.
- Selecting a day opens Daily Calories.
- Header actions allow manual entry or product scanning.

### Daily Calories

- Date, total calories, and number of entries.
- Entries listed from oldest to newest.
- Each row shows calories and optional description.
- Selecting an entry opens Calorie Entry Details.
- `Add entry` creates an entry for the displayed date.

### Add Calorie Entry

- Calories input, optional description, and date picker.
- Date defaults to today or inherits the selected day.
- Prevent duplicate submissions and show inline validation.

### Calorie Entry Details and Edit

- Display date, calories, and description; keep the opaque ID hidden.
- Allow editing calories and description.
- Date remains immutable.
- Provide deletion with confirmation.

## Product Scanner

### Barcode Scanner

- Open the camera immediately when the Scan tab is selected.
- Display a clear scanning frame and flashlight control.
- Pause scanning after a code is detected and show a loading state.
- Prevent duplicate handling of the same scan.
- Provide manual barcode entry as a permanent fallback.

Permission states:

- Initial camera permission request.
- Denied state with retry and manual entry.
- Permanently denied state with `Open settings`.
- Unsupported camera state with manual entry.

### Product Details

Show the most useful information first:

- Product image, name, barcode, quantity, and serving size.
- Calories per serving and per 100 units when available.
- Primary `Add calories` action.
- Collapsible sections for complete nutrition facts and ingredients.
- Clear unavailable-data placeholders without displaying empty rows.
- `Scan another product` action.

### Add Calories From Product

- Amount mode: `Serving` or `Amount`.
- Default to one serving when serving nutrition exists.
- Amount mode uses the unit supplied by the product, such as grams or
  millilitres.
- Calculate calories immediately and round to the nearest whole kcal.
- Allow positive decimal servings or amounts.
- Date defaults to today and remains editable.
- Description defaults to the product name.
- Show a read-only calorie total before submission.
- After success, navigate to the corresponding Daily Calories screen.
- When usable nutrition data is missing, offer `Add calories manually`.

No product relationship will be stored: the existing calorie endpoint receives
the calculated calories, product name as description, and selected date.

## Calculators

Calculator links are available from Home. Mobile calculations use profile data
and the latest weight; temporary manual overrides are not provided.

Every calculator screen contains:

- A compact list of data that will be used.
- A missing-data panel listing each unavailable field.
- `Update profile` when profile information is missing.
- `Add weight` when weight history is empty.
- A disabled calculation action until all required data is available.
- Automatic refresh after returning from profile or weight editing.

### BMI

- Required: latest weight and profile height.
- Result: BMI, category name, weight, and height.
- Display the adult BMI ranges as a table and highlight the current category.
- Do not display a chart.

### Calorie Requirement

- Required: latest weight, height, date of birth, sex, and activity level.
- Result: resting calories and maintenance calories per day.

### Protein Requirement

- Required: latest weight and protein goal.
- Result: minimum and maximum daily protein in grams.

## Account and Profile

### Account

- Profile summary with human-readable values or `Not set`.
- `Edit profile` action.
- Sign-out action at the bottom with confirmation.
- Space may later contain authenticated account information, but no placeholders
  are required now.

### Edit Profile

- Height in centimetres.
- Sex selector.
- Date-of-birth picker.
- Activity-level selector with readable labels.
- Protein-goal selector with readable labels.
- Every field remains optional and can be cleared.
- `Clear profile` requires destructive confirmation.
- Warn before leaving with unsaved changes.

## Shared UI Behaviour

- Use existing light and dark themes with neutral backgrounds and one restrained
  accent colour.
- Prefer full-width sections, rows, tables, dividers, and standard controls.
- Use icons for navigation and familiar actions; include accessible labels.
- Keep controls at least 44-48 px high and support system text scaling.
- Use locale-readable dates in the UI while preserving existing API date
  semantics.
- Provide loading, empty, error, retry, offline, and expired-session states.
- Use pull-to-refresh on Home and history screens.
- Disable controls and prevent repeated requests during mutations.
- Show short success notices after create, update, and delete operations.
- Keep all visible application text in English.

## Implementation Stages

1. **Navigation foundation:** introduce the five tabs and nested stacks, remove
   the chart route, and establish shared headers, list rows, forms, dialogs, and
   state views.
2. **Tracking:** implement weight history and CRUD, calorie history and CRUD,
   then connect their daily summaries to Home.
3. **Food scanning:** implement permission states, manual barcode entry,
   product details, calorie calculation, and the product-to-calorie flow.
4. **Profile and calculators:** implement profile viewing/editing, missing-data
   navigation, and the three result screens.
5. **Integration and polish:** complete Home, cross-stack return flows,
   accessibility, small-screen behaviour, dark theme, and failure-state
   verification.

## Acceptance Criteria

- All active CLI capabilities have a mobile equivalent except the weight chart
  and CLI-specific output options.
- Weight history is readable without horizontal scrolling on a small Android
  screen.
- A product can be scanned, reviewed, converted by serving or amount, and added
  to a selected day.
- Calculator errors identify exact missing data and provide the correct profile
  or weight action.
- Editing and deletion are explicit and require no hidden swipe gestures.
- Navigation state and unsaved forms are preserved when switching tabs.
- No screen overlaps the keyboard, safe areas, bottom navigation, or system
  text.

## Assumptions

- Android remains the primary target; the layout remains compatible with iOS.
- Existing API contracts are sufficient for the planned UI.
- Charts, nutritional goals, product favourites, and product history are outside
  this plan.
- Dates retain the API's current UTC-based behaviour.
- The document describes UI/UX and navigation only; component architecture and
  library selection will be planned during implementation.
