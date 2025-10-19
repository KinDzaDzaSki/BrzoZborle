# Quickstart: Mode-specific unique words

Run the unit tests for ModeSelector and integration tests for mode-specific word selection.

1. Install dependencies (already done):

```powershell
npm ci
```

2. Run unit tests (Jest):

```powershell
npm test -- tests/modeSelector.test.ts
```

3. Run full test suite:

```powershell
npm test
```

4. Manual verification in browser:
- Start the dev server:

```powershell
npm start
```
- Open the app, select each mode, and verify the displayed solution matches the expected mode word for today's date (compare to `src/lib/words.ts` output).

*** End Quickstart
