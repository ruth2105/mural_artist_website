# Supabase Final Admin Integration Plan

**Review type:** Read-only architecture and integration review  
**Scope:** Current admin frontend, Supabase access, static public content, checked-in SQL, and the confirmed live schema/security findings supplied for this review.

## Executive summary

The site currently has two separate content paths:

- The public portfolio is bundled static content and local media. It does not read published projects, profile, or services from Supabase.
- Admin pages call Supabase directly from the browser using the public anon key and the signed-in user's session. Several pages still have demo fallbacks or target tables that do not exist.

The live database can store artwork, categories, and inquiries, but the current frontend does not consistently match its columns. More importantly, “any authenticated user” is not an administrator authorization rule. The current inquiry read policy exposes private inquiry records to all authenticated users, and anonymous inquiry insertion accepts any row under an unconditional `WITH CHECK true`. Storage has no object policies; the bucket is public and has no MIME allowlist.

**Recommendation:** Do not connect additional public sections to the database or enable CMS writes until administrator authorization, RLS, storage policies, inquiry field mapping, and backup/recovery steps are agreed and tested. Keep the current static portfolio serving as the public source of truth during the transition.

## Evidence and confidence

### Confirmed live facts supplied for this review

- Existing tables and their columns are as listed below; `artist_profile`, `services`, and `contact_info` are absent.
- `artworks` lacks `gallery_images` and `collaborators`.
- `categories.slug` and `artworks.slug` are required and unique.
- `artworks.category_id` references categories with `ON DELETE SET NULL`.
- RLS is enabled on `storage.objects`; no object policies were returned.
- The `artwork` bucket is public, limited to 10 MB per object, and has no MIME type restriction.
- Existing artwork/category management policies authorize any authenticated user.
- Any authenticated user can read commission inquiries.
- Anonymous inquiry insertion has `WITH CHECK true`.

### Confirmed by source inspection

- `src/lib/supabase.js` creates the browser client from `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`; it does not embed a service-role key.
- The app uses Supabase Auth sessions, but protected routes check only whether a user exists.
- The public artwork, artist, and services components import local modules under `src/data/`; they do not query Supabase.
- Only `supabase-schema.sql` and the read-only `supabase-preflight-readonly.sql` are present as SQL files at the project root; no migrations directory was found.
- The local media directory currently contains 391 processed files: 354 WebP, 19 JPEG, and 18 MP4. Eight MP4 files exceed 10 MiB; the largest is 47,167,731 bytes. The browser uploader currently accepts only JPEG, PNG, and WebP, with a 10 MiB client-side limit.
- The existing checked-in SQL is an older setup script, not a migration verified against the live database. It defines different inquiry/profile/service schemas, seeds example content, grants management to all authenticated users, and leaves storage policies as manual instructions.

### Not verified in this review

- The exact live constraints, indexes, category rows, inquiry status constraint values, and policy definitions beyond the supplied findings.
- Successful login, RLS enforcement, browser CRUD, database persistence, uploads, or public-site refresh from CMS edits.
- Whether every contact detail or profile statement in static content is approved for publication.
- Whether the currently configured Supabase project is the same environment described in the supplied live-schema findings. No credentials were printed or requested.

## Current architecture

### Admin and authentication

- `src/App.jsx` wraps admin pages in `ProtectedRoute`.
- `src/contexts/AuthContext.jsx` calls `auth.getSession()`, listens for `onAuthStateChange`, and exposes password sign-in/sign-out.
- `src/components/admin/ProtectedRoute.jsx` redirects only when there is no authenticated user. There is no role or allowlist check.
- `src/pages/admin/Settings.jsx` exposes password update and reset-email actions for the current authenticated account; it is not an administrator-management system.
- Admin pages use the Supabase browser client directly for reads and writes. Authorization therefore depends on database RLS; hiding pages in React is not a security boundary.

### Public site

- Artwork and categories come from `src/data/artworks.js`; project images and videos reference static files under `public/portfolio-media`.
- Artist details come from `src/data/artist.js`.
- Services and process steps come from `src/data/services.js`.
- `ArtworkGallery`, `VideoGallery`, `ProjectViewer`, `AboutSection`, `ServicesSection`, contact and social sections consume those local modules.
- Consequently, admin edits cannot currently update the live public portfolio without a code/media deployment. There is no live published-content query or cache-refresh path.
- The current data includes project records with empty descriptions; media curation remains separate from the database CMS.

### Current Supabase surface

| Area | Frontend operations found |
|---|---|
| Auth | Session restore/listener, email/password sign-in, sign-out, password update, reset email |
| Artworks | List/filter, detail read, insert, update, delete, status update, dashboard counts/recent list |
| Categories | List, insert, update |
| Services | List, insert, update, delete |
| Artist profile | Single-row read and upsert |
| Inquiries | Public insert; admin list/filter, status update, delete |
| Storage | Upload image, derive public URL, delete helper; no video upload flow |

## Actual schema and frontend mismatches

The following comparisons use the confirmed live schema in this task, not the older checked-in SQL.

### `artworks`

Live columns: `id`, `title`, `slug`, `category_id`, `description`, `main_image_url`, `main_image_path`, `video_url`, `ownership_type`, `project_year`, `project_location`, `is_featured`, `status`, `object_position`, `created_at`, `updated_at`.

| Frontend use | Finding |
|---|---|
| `ArtworkForm` reads/writes `collaborators` | Column is absent from the live table. A save payload containing it will fail until the schema is deliberately extended or the field is removed/mapped elsewhere. |
| `ArtworkForm` generates and writes `slug` | Matches the live column and satisfies its presence requirement for ordinary titles, but uniqueness collisions are not prechecked and must be surfaced as database errors. |
| `ArtworkForm` writes category, description, image URL/path, video URL, ownership, year, location, featured status, publication status, and object position | These names match the supplied live columns. Input validation, enum/check constraints, and category nullability still need verification against the actual constraints. |
| Form contains only a main image and a video URL | It does not manage `gallery_images` and cannot upload videos. Those features need a schema/storage design before being advertised as CMS capabilities. |
| Edit with no newly selected image sets `main_image_path` to `null` | The current update payload can erase the stored path even while retaining the existing URL. This breaks reliable later cleanup/audit of the object. |
| Artwork delete passes an image path to the handler but deletes only the database row | The supplied path is unused; storage cleanup is not performed. With `ON DELETE SET NULL`, deleting a category can also leave artwork unassigned. |
| `ArtworksList` joins `categories(name, label)` | Those category columns exist; the relationship must still be confirmed in the generated API schema and row permissions. |
| Dashboard fetches rows and calculates counts in the browser | Counts depend on select permission and full-row visibility; errors from individual count queries are not checked before presenting zero-like statistics. |

### `categories`

Live columns: `id`, `name`, `slug`, `label`, `display_order`, `is_active`, `created_at`, `updated_at`.

- `Categories` uses `name` as the slug-like field in its UI. Updates send `name`, `label`, and `display_order`; they do not update the separate `slug`.
- Inserts send `name`, `label`, `display_order`, and `is_active`, but omit the required, unique `slug`; inserts therefore do not satisfy the confirmed schema.
- The UI provides no delete/archive action even though its page is described as category management.
- Category removal should normally be archival (`is_active = false`) where existing projects should retain their category association. A hard delete triggers the confirmed `ON DELETE SET NULL` behavior.

### `commission_inquiries`

Live columns: `id`, `name`, `email`, `phone`, `project_type`, `message`, `budget_range`, `timeline`, `status`, `created_at`, plus the exact set above.

| Frontend use | Finding |
|---|---|
| Public form inserts `full_name` | Live column is `name`. |
| Public form inserts `description` | Live column is `message`. |
| Public form inserts `budget` | Live column is `budget_range`. |
| Public form inserts `project_location`, `surface_type`, `project_size` | These columns are not in the confirmed live schema. Decide whether to add them additively or intentionally omit them. |
| Public form sends `email: null` and has no email input | The live table has an `email` column, but its nullability was not supplied; confirm the constraint and business requirement before choosing a mapping. |
| Admin displays `name`, `email`, `phone`, `project_type`, `message`, `budget_range`, and `timeline` | These names match the live column names. |
| Admin offers statuses `new`, `in_progress`, `completed` | The live status column exists, but its allowed values/check constraint were not supplied. The older SQL script instead constrains `new`, `reviewed`, `contacted`, and `archived`; inspect the live constraint before allowing updates. |
| Admin supports delete | The supplied findings confirm broad SELECT and UPDATE concerns but do not confirm a delete policy. Treat delete as unavailable until the exact policy is reviewed; prefer archive/retention over deleting customer records. |

The public form's insert currently cannot be considered compatible with the live table. Because its error is caught in the UI, a visitor can receive an error instead of a persisted inquiry.

### `artist_profile`, `services`, and `contact_info`

- The admin Profile page queries `artist_profile` and uses `full_name`, `bio`, `tagline`, `years_experience`, `specialties`, `phone`, `email`, and `social_media`. The live table is absent.
- The Profile form initializes guessed/example values, including `mrjon@example.com`, a phone number, social handles, biography/tagline, and experience/specialty claims. They are demo defaults and must not be treated as approved public profile data.
- The checked-in SQL's profile table instead contains `name`, `tagline`, `biography`, `portrait_url`, `portrait_path`, `skills`, and timestamps, so it does not match the admin form.
- The admin Services page expects `name`, `description`, `icon`, `display_order`, and `is_active`; the live table is absent.
- The checked-in SQL's Services table instead uses `service_number`, `title`, `description`, `features`, `display_order`, and `is_active`. It is not a compatible live migration as written.
- The admin pages for both missing tables retain demo fallback data and local-only “success” behavior when configuration appears absent.
- The public profile and services sections continue to use static JavaScript data, not either admin page or database.
- `contact_info` is absent. Contact details and social URLs are currently sourced from static `src/data/artist.js`; do not create or seed a public contact record from unverified values.

### Other demo and error-handling findings

- Categories, Services, Profile, and Inquiries contain sample/demo branches. Inquiries includes fabricated sample people and `example.com` addresses.
- The Artwork and Settings pages use real calls when configured, but the real database operation has not been tested here.
- Dashboard count queries ignore individual Supabase errors and may show zeros as if they were measured values.
- Several admin handlers log errors without showing actionable feedback; an unsuccessful inquiry status update, for example, can leave the UI appearing unchanged without an explicit explanation.
- `AuthContext` does not handle a rejected `getSession()` promise. A transient auth initialization failure can leave `loading` unresolved unless another auth event occurs.
- No administrator identity/role check is performed after a successful Supabase Auth sign-in.

## Security risks

### Critical before any production CMS launch

1. **Authenticated is not admin.** The current policies authorize all authenticated accounts to manage artwork/categories, and all signed-in users can read inquiries. A compromised or unintended account can access or modify CMS data.
2. **Private inquiry exposure.** Inquiry SELECT must be restricted to approved administrators only. Public clients must not be able to enumerate, read, or update inquiry records.
3. **Unvalidated public inserts.** `WITH CHECK true` allows any anonymous caller to attempt arbitrary inquiry inserts, including oversized or malformed data. It does not rate-limit automated spam.
4. **No storage object policies.** The public bucket permits public object viewing by design, but uploads/updates/deletes are not safely enabled by the reported policies. Never solve upload failures by granting all authenticated users blanket object access.
5. **No public CMS integration path.** Public sections are static today. A future query must explicitly select only published artwork, active categories/services, and public profile/contact fields.

### Additional risks

- The public bucket has no MIME restriction; browser file-picker restrictions are not a security control because clients can bypass them.
- Public-read storage means object URLs are intentionally accessible to anyone who obtains them. Do not store private drafts or sensitive content in that bucket if public visibility is unacceptable.
- The application has no verified admin allowlist, role claim, or server-side authorization layer.
- Inquiry deletion can conflict with retention/audit needs. Status handling and allowed values are not aligned with the old SQL script.
- Demo defaults and seeded records can accidentally be mistaken for client-approved contact/profile information.
- Direct browser CRUD makes RLS policy correctness essential; route guards and hidden controls cannot substitute for database authorization.

## Proposed database changes

These are recommendations only; no SQL has been written or applied for these changes.

1. **Administrator authorization**
   - Add a small private administrator allowlist keyed by Supabase Auth user UUID, with active state and optional grant metadata.
   - Enable RLS and deny public/authenticated table access to the allowlist. Only a trusted database owner/operator or secure server-side admin process should add/remove administrators.
   - Provide a narrow `SECURITY DEFINER` predicate for policy checks only if needed; fix its `search_path`, schema-qualify referenced objects, and revoke execution from `PUBLIC` unless explicitly granted. Never allow users to self-enroll.
   - Keep service-role credentials exclusively in trusted server-side/administrative environments; never in Vite variables or browser code.
2. **Artwork**
   - Decide whether to add `gallery_images` (prefer a constrained JSONB structure or a normalized related-media table with ordering) and collaborator credits (prefer normalized relation/structured credits if attribution needs more than plain text).
   - Preserve existing `artworks` columns and records. Add constraints/indexes only after checking current values and duplicates.
   - Consider a stable `display_order` column if curated ordering is required; it is not in the confirmed live schema.
3. **Categories**
   - Keep `slug` separate from display `name`; retain its required unique constraint.
   - Prefer setting `is_active = false` over deleting a category used by artwork.
4. **Services**
   - Create a Services schema only after selecting one canonical model. Align it with the editor and public renderer; do not copy the incompatible example SQL wholesale.
   - A minimal model could include title/name, slug if needed, description, optional structured features, display order, active flag, timestamps. Avoid invented seeded service descriptions.
5. **Artist profile and contact**
   - Choose a single public profile shape and align UI/API names before creating the missing table. A singleton profile should be enforced explicitly.
   - Separate public artist biography/portrait from contact and social fields if they need different access or publication controls.
   - Store only information confirmed by the artist; do not seed example email, phone, awards, experience, specialties, or social handles.
6. **Inquiries**
   - Preserve the existing column names and records. Add optional location/surface/size columns only if the artist wants to retain those public-form fields.
   - Reconcile `full_name` → `name`, `description` → `message`, and `budget` → `budget_range` in the application adapter.
   - Inspect live nullability and status constraints. Additive constraint changes should first validate current records and should not silently rewrite them.
   - Prefer archival/status handling to hard deletion. If delete is retained, require admin authorization and an explicit retention policy.
7. **Operational audit log**
   - Add a private append-only audit record for content, access, and inquiry-management events (see Audit logging below). Do not store secrets or duplicate full inquiry PII in logs.

## Proposed RLS policy design

Implement equivalent least-privilege policies using the verified administrator predicate. The examples below are policy intent, not executable SQL.

| Resource | Anonymous/public access | Administrator access |
|---|---|---|
| `categories` | `SELECT` active rows only | CRUD; prefer deactivate over delete |
| `artworks` | `SELECT` published rows only | CRUD, including draft reads and publishing |
| `commission_inquiries` | `INSERT` only with validated required fields; no `SELECT`, `UPDATE`, or `DELETE` | Read and update status; delete only if retention policy allows |
| Artist profile | Read only fields/rows explicitly intended for publication | Read/update; admin-only create if singleton is absent |
| `services` | Read active rows only | CRUD |
| `contact_info` | Read only intentionally public information; never expose private contact data by table-wide policy | CRUD |
| Admin allowlist | No access | No direct client access; changes only by trusted operator/server process |
| Audit log | No access | Read only for authorized administrators; append through controlled database trigger/function or trusted server path |

Implementation notes:

- Enable and verify RLS on every exposed public table, not just storage.
- Ensure policies cover the needed command explicitly. Do not use a blanket `FOR ALL` predicate that treats every authenticated user as an administrator.
- Use both `USING` and `WITH CHECK` for update policies so an admin cannot update a row into an unauthorized state through a permissive check.
- Public inquiry inserts should validate lengths, required values, safe status defaults, and permitted project-type values with constraints/policy checks. RLS alone is not rate limiting; add a server-side/edge-function abuse-control layer if spam occurs or the endpoint is exposed at scale.
- Review table grants in addition to RLS. RLS does not grant privileges and does not replace column-level exposure controls.
- For public profile/contact data, consider splitting public and private records rather than exposing all columns via `SELECT` on one table.
- Test as `anon`, ordinary authenticated user, allowlisted admin, and database owner; do not infer security from the admin UI.

## Proposed storage policies and media limits

### Access model

- Keep public read access only for published portfolio media. The current public bucket means direct object access is public; do not upload unpublished/private objects there unless that behavior is acceptable.
- Add `SELECT` policy for public object reads scoped to the intended public bucket(s).
- Add `INSERT`, `UPDATE`, and `DELETE` policies restricted to the verified administrator predicate and the appropriate bucket ID. `UPDATE` must validate both the existing object (`USING`) and destination (`WITH CHECK`).
- Restrict object keys to predictable project/media prefixes where practical. Do not rely on a client-supplied filename or folder as authorization.
- Ensure deleting a database record does not automatically destroy media until shared references and retention are checked. Prefer explicit orphan cleanup with a reviewable audit trail.

### Recommended formats and limits

- Allow image upload formats: `image/jpeg`, `image/png`, and `image/webp`.
- Allow video only as browser-ready `video/mp4` (H.264/AAC where encoding is controlled). Do not accept HEIC/HEIF or MOV directly unless a verified conversion pipeline is introduced.
- Current processed assets include MP4 files up to about 45 MiB, with eight above the current 10 MiB bucket limit. A 10 MiB limit therefore cannot accept every existing processed video.
- Prefer separate image and video buckets/policies: keep image uploads at 10 MiB or lower, and set a video ceiling around 64 MiB to accommodate the largest current MP4 with limited headroom. Transcode/compress videos that exceed the cap.
- If only one bucket is used, a 64 MiB bucket maximum would support the current largest file, but the frontend must still enforce a smaller image limit and the storage policy must restrict MIME types. Client-side checks are usability controls, not security boundaries.
- Verify actual upload size, content type, decoded media, and playback before publishing. The repository currently has no video upload UI.

## Admin authorization design

Recommended approach: a database-backed allowlist keyed by immutable `auth.uid()` values, checked in every admin RLS policy. This is straightforward for a small portfolio and does not depend on user-editable metadata.

1. Create Supabase Auth users through a trusted operator workflow, with email confirmation and strong account recovery settings.
2. Add the user UUID to the private allowlist only after identity verification by the owner.
3. Keep allowlist writes unavailable to browser clients. Provision/revoke admins through a trusted server/admin console or carefully controlled SQL Editor session; never expose a service-role key to the site.
4. Use one narrowly scoped, hardened helper function (or another non-recursive policy-safe mechanism) to check active membership. Test policy recursion, `search_path`, grants, and inactive/revoked accounts.
5. In React, use the same role check to improve UX, but treat the RLS check as the enforcement point. `ProtectedRoute` must require both a valid session and an affirmative administrator result.
6. On revocation, disable the allowlist entry and revoke active sessions as operationally appropriate; verify an existing session loses database access.

For a larger organization, a trusted `app_metadata` role claim is also viable if only a server-side admin process can assign it and token-refresh/revocation behavior is tested. Do not trust `user_metadata` as an authorization source because users may control it.

## Public website integration plan

Implement only after policies and schema are ready:

1. Keep the existing static media/content available as a fallback and baseline. Do not bulk-delete, rename, or replace it during initial CMS integration.
2. Add a typed/data-adapter boundary between Supabase rows and the present UI model. Map `category_id` to category slug/label and map database media URLs into the fields expected by cards, detail viewer, and video gallery.
3. Fetch only published artwork joined to active categories; order deterministically by category display order, project display order (after it exists), featured flag, and a stable tie-breaker.
4. Fetch active services and only the artist/contact fields approved for public display. Do not expose admin-only fields through `SELECT *`.
5. Keep static project films until a verified video relation or stable association is designed. Do not infer a project association from a filename alone.
6. Add loading, empty, stale-cache, and explicit error states. Do not convert query errors into empty data that appears to be a legitimate empty portfolio.
7. Define how edits become public without redeployment (Supabase query on page load, bounded cache, and/or realtime invalidation). Test publication and unpublication in a real browser session.
8. Reconcile inquiry input names with the actual schema before enabling public form submission; explain failures without telling visitors to contact an unverified address.

## Audit logging

Record actor UUID, action, entity/table, record ID, timestamp, and a minimal before/after summary for:

- Admin allowlist additions, revocations, and role changes.
- Artwork create/edit/delete, category assignment, featured changes, and publish/unpublish.
- Category creation, edits, ordering, activation/deactivation, and any deletion.
- Service create/edit/delete and public activation changes.
- Profile/contact/portrait edits and publication changes.
- Storage object upload, replacement, move, and delete, including object path and linked record ID.
- Inquiry status changes, exports if supported, and deletion/archival.
- Failed or denied privileged operations where reliable server-side logging is available.

Keep logs private and append-only to normal admins where possible. Avoid copying message text, email, phone, authentication tokens, or uploaded file contents into audit payloads. Define retention and access controls before enabling inquiry exports or deletion.

## Safest preservation and migration approach

### Before changes

- Take and verify a restorable Supabase backup/snapshot. Confirm the recovery procedure and required retention window, not merely that a backup job exists.
- Export schema, constraints, RLS policies, grants, bucket settings, and object metadata as a baseline.
- Record table counts and representative non-sensitive schema/constraint checks. Do not put inquiry contents or secrets in the review report.
- Preserve current database rows, inquiry records, object keys, and static website media. Avoid table drops, column renames, destructive casts, bulk reseeding, or replacing existing bucket contents.
- Verify a separate staging project or isolated test schema is available before production changes.

### Migration order

1. **Schema-only preflight:** confirm exact live constraints, enum/check values, grants, RLS state, bucket IDs, and current records.
2. **Agree canonical models:** settle profile, services, contact, gallery media, collaborator credits, inquiry fields/statuses, and public/private boundaries.
3. **Add administrator allowlist and hardened predicate:** no public access; provision only verified admin UUIDs.
4. **Add missing tables/columns additively:** use nullable/default-safe additions; do not seed invented public data. Backfill only from confirmed client-approved/static content with a reviewed mapping and duplicate checks.
5. **Add indexes/constraints after preflight:** validate existing data first; apply constraints in a way that does not unexpectedly reject or rewrite current rows.
6. **Replace broad policies with least-privilege policies:** do not leave permissive policies alongside restrictive ones; PostgreSQL permissive policies combine with OR semantics. Review and remove obsolete policies only in a reviewed, versioned migration with rollback steps.
7. **Add storage policies and MIME/size settings:** test with non-admin and admin accounts before enabling uploads in production.
8. **Deploy frontend adapter behind a controlled feature flag or staged release:** first read-only public queries, then admin mutations, then public form writes.
9. **Backfill/synchronize content in small idempotent batches:** preserve existing static media; validate counts, paths, duplicates, and published visibility before moving any public section to database-driven content.
10. **Observe and reconcile:** compare before/after record counts and public rendering, inspect errors and audit logs, then schedule any old static-path retirement separately.

## Rollback plan

- Keep each migration small, version-controlled, and transaction-safe where supported. Document which steps are reversible before applying them.
- Before applying production changes, capture the verified database backup and storage-object metadata baseline.
- If a new public query or frontend release fails, disable the CMS feature flag or roll back the frontend release to the existing static content. This should not require database deletion.
- For additive schema failures, stop the rollout; do not drop new tables/columns automatically if they may contain writes. Restore service by reverting the frontend adapter while preserving data.
- If an RLS policy blocks legitimate admin/public behavior, roll back only the affected policy migration to the previously reviewed policy set, under controlled access. Do not temporarily grant broad authenticated access.
- If new writes have occurred, reconcile them before any schema reversal. Never remove populated columns, tables, inquiries, or storage objects as a routine rollback.
- Confirm backup restoration in a non-production environment before considering production migration ready.

## Testing checklist

### Authorization and RLS

- [ ] Anonymous user cannot access admin rows, drafts, inquiry records, allowlist, or audit log.
- [ ] Ordinary authenticated but non-allowlisted user cannot create/update/delete CMS rows, read inquiries, or upload/replace/delete objects.
- [ ] Allowlisted admin can perform only intended CMS operations.
- [ ] Revoked admin loses access, including with an already-existing session/token.
- [ ] Public visitors can read only active/published content and public media.
- [ ] Query table grants as well as RLS; test each role directly against Supabase, not only through React routes.
- [ ] Public inquiry insert validates required fields and cannot set privileged statuses or read submitted/other inquiry rows.

### Data/API contracts

- [ ] Category create/update writes both the intended `name` and unique `slug`; duplicate slug errors are visible.
- [ ] Artwork create/edit preserves existing `main_image_path`, correctly stores new paths, handles slug conflict, and validates all live constraints.
- [ ] Gallery images and collaborator credits round-trip only after the chosen schema exists.
- [ ] Inquiry form maps to live columns, preserves approved optional fields, and handles status constraints and nullability.
- [ ] Services/profile/contact readers and writers use the final canonical schema and never publish defaults or demo records.
- [ ] Dashboard counts use explicit count queries or verified complete result sets and show errors distinctly from zero.

### Persistence, media, and public behavior

- [ ] Create/edit/publish/unpublish/delete or archive records, refresh, and verify persisted results.
- [ ] Upload allowed image/video formats as admin; verify object key, type, limit, playback/rendering, and public visibility.
- [ ] Verify non-admin upload/update/delete is denied by storage RLS.
- [ ] Verify replacement/deletion does not orphan or prematurely remove media referenced by another record.
- [ ] Verify published changes appear publicly and drafts/unpublished records never appear.
- [ ] Verify public sections handle query loading, empty results, network failure, and stale cache.
- [ ] Run browser checks at mobile and desktop widths; verify category filtering, detail navigation, and video playback.
- [ ] Check for duplicate content, broken media URLs, and unauthorized data in public API responses.

### Operational

- [ ] Confirm backup restore in staging.
- [ ] Confirm audit events for each privileged action and appropriate privacy/retention.
- [ ] Confirm migration ordering, idempotency, and rollback procedure in staging.
- [ ] Run production build and existing checks after implementation; review actual results before release.

## Deployment checklist

- [ ] Do not deploy until the administrator authorization and RLS tests pass.
- [ ] Apply reviewed migrations only after a verified backup and an approved maintenance/change window.
- [ ] Keep service-role keys out of frontend source, Vite environment variables, browser logs, and reports.
- [ ] Configure only public Supabase URL and anon/publishable key in the browser build; rely on tested RLS.
- [ ] Ensure authentication redirect URLs, email confirmation/reset delivery, and admin account recovery are configured.
- [ ] Confirm storage bucket MIME/size restrictions and object policies in the target environment.
- [ ] Release in stages with a static-content rollback path; monitor Supabase/API errors and audit events.
- [ ] Verify published content and inquiry submissions end-to-end before announcing launch.
- [ ] Do not claim CMS persistence, authorization, upload, or public synchronization until each is actually tested.

## Review disposition

- No application code was changed.
- No SQL that changes the database was executed.
- No migration was created or applied.
- No storage files were uploaded or deleted.
- Nothing was pushed or deployed.
- The existing read-only preflight script remains a separate inspection artifact; this report is a plan, not migration instructions.
