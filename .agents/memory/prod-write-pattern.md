---
name: Production write pattern
description: Production DB is read-only via executeSql. All writes require a deployed endpoint called via curl with Basic Auth.
---

## The Rule
- `executeSql({ environment: "production" })` is READ-ONLY. Use it only for SELECT queries.
- To write to production: add a `router.post("/admin/some-endpoint", ...)` one-shot endpoint, deploy (suggest_deploy → user clicks Publish), then call via curl.

**Auth pattern:**
```bash
AUTH=$(echo -n "${DASH_USER}:${DASH_PASS}" | base64)
curl -s -X POST "https://growthmonk.ai/api/admin/<endpoint>" -H "Authorization: Basic ${AUTH}"
```

**Why:** The production Postgres instance only allows writes through the running API server process, not via direct DB connections from the dev environment.

**How to apply:** Whenever a production data fix is needed, always check if an existing deployed endpoint can handle it before adding a new one-shot endpoint. If adding a new endpoint, group multiple fixes into a single endpoint to minimize deploy cycles.

## dosteli1 quick facts (client_id=17 in production)
- slug: `dosteli1`
- languages: primary=de, secondary=tr
- One-shot endpoints already exist: fix-dosteli1-languages, restore-dosteli1-branding, trim-dosteli1-bookings, seed-dosteli1-demo
