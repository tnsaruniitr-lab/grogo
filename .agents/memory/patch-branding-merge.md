---
name: PATCH branding merge bug
description: The PATCH /admin/clients/:id handler previously merged only `preserved + newCfg`, losing all unset existingCfg fields. Fixed to use existingCfg as base.
---

## The Rule
When merging a partial PATCH body into an existing JSON config column, always start with `existingCfg` as the base:

```ts
updates.config = { ...existingCfg, ...newCfg };
```

Never do `{ ...preserved, ...newCfg }` — this wipes every field absent from the request body.

**Why:** Zod strips absent optional fields from parsed output (they're omitted, not set to undefined). Spreading a partial Zod-parsed object over an empty base destroys all existing config fields not included in the request.

**How to apply:** Any time a PATCH handler merges into a JSONB config column, the spread order must be `existingCfg` first, then incoming fields. Special fields (industryLocked) can be re-applied after.
