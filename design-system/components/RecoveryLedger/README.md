# RecoveryLedger

Versions of something, newest first: the current one marked, an earlier one opened on what restoring it would change. The page asks before restoring.

**You provide** `entries` (`[{ id, action, description, timestamp?, author?, reference?, details?, restorable? }]`, `details.content` being what restoring would change), `currentEntryId`, `title`; `onRestore` (the restore button shows only with it); `restoreLabel`, `currentLabel`, `countLabel` in the page's words; `variant` (`timeline` · `compact`); `expandedId` with `onExpandedChange`.

```tsx
<RecoveryLedger title="Versions of the price list" currentEntryId="v3" currentLabel="Current"
  restoreLabel="Restore" onRestore={(id) => askBeforeRestoring(id)} entries={versions} />
```

- The ledger restores nothing itself: `onRestore` opens the page's confirmation (a `SettleModal`), which restores.
- The current entry is marked in green; an entry with `details` opens under its card. An entry with `restorable: false` has no restore button.
- Give the words: the defaults are "Recovery Ledger", "Revert", "Current Head" and "N snapshots".
