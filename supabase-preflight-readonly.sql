-- Supabase portfolio preflight inspection
-- Read-only: every statement below is a SELECT (including the SELECT
-- executed by query_to_xml for exact table counts). No records are changed.
-- Run in Supabase SQL Editor before preparing or applying any migrations.

-- 1. Table existence and columns
-- A row with NULL column_name means the table is missing from public schema.
WITH requested_tables(table_name) AS (
  VALUES
    ('categories'::text),
    ('artworks'::text),
    ('commission_inquiries'::text),
    ('artist_profile'::text),
    ('services'::text),
    ('contact_info'::text)
)
SELECT
  requested_tables.table_name,
  columns.ordinal_position,
  columns.column_name,
  columns.data_type,
  columns.udt_name,
  columns.is_nullable,
  columns.column_default
FROM requested_tables
LEFT JOIN information_schema.columns AS columns
  ON columns.table_schema = 'public'
  AND columns.table_name = requested_tables.table_name
ORDER BY requested_tables.table_name, columns.ordinal_position;

-- 2. Primary keys, foreign keys, unique constraints, and check constraints
-- A row marked TABLE MISSING or NO LISTED CONSTRAINTS is intentional output.
WITH requested_tables(table_name) AS (
  VALUES
    ('categories'::text),
    ('artworks'::text),
    ('commission_inquiries'::text),
    ('artist_profile'::text),
    ('services'::text),
    ('contact_info'::text)
)
SELECT
  requested_tables.table_name,
  CASE
    WHEN relations.oid IS NULL THEN 'TABLE MISSING'
    WHEN constraints.oid IS NULL THEN 'NO LISTED CONSTRAINTS'
    WHEN constraints.contype = 'p' THEN 'PRIMARY KEY'
    WHEN constraints.contype = 'f' THEN 'FOREIGN KEY'
    WHEN constraints.contype = 'u' THEN 'UNIQUE'
    WHEN constraints.contype = 'c' THEN 'CHECK'
  END AS constraint_type,
  constraints.conname AS constraint_name,
  pg_catalog.pg_get_constraintdef(constraints.oid, true) AS definition
FROM requested_tables
LEFT JOIN pg_catalog.pg_namespace AS namespaces
  ON namespaces.nspname = 'public'
LEFT JOIN pg_catalog.pg_class AS relations
  ON relations.relnamespace = namespaces.oid
  AND relations.relname = requested_tables.table_name
  AND relations.relkind IN ('r', 'p')
LEFT JOIN pg_catalog.pg_constraint AS constraints
  ON constraints.conrelid = relations.oid
  AND constraints.contype IN ('p', 'f', 'u', 'c')
ORDER BY requested_tables.table_name, constraint_type, constraints.conname;

-- 3. RLS state and policies for public portfolio tables
-- One row is returned per policy; NO POLICY or TABLE MISSING are explicit.
WITH requested_tables(table_name) AS (
  VALUES
    ('categories'::text),
    ('artworks'::text),
    ('commission_inquiries'::text),
    ('artist_profile'::text),
    ('services'::text),
    ('contact_info'::text)
)
SELECT
  requested_tables.table_name,
  CASE
    WHEN relations.oid IS NULL THEN 'TABLE MISSING'
    WHEN policies.policyname IS NULL THEN 'NO POLICY'
    ELSE 'POLICY'
  END AS inspection_status,
  relations.relrowsecurity AS rls_enabled,
  relations.relforcerowsecurity AS rls_forced,
  policies.policyname,
  policies.permissive,
  policies.roles,
  policies.cmd AS command,
  policies.qual AS using_expression,
  policies.with_check AS check_expression
FROM requested_tables
LEFT JOIN pg_catalog.pg_namespace AS namespaces
  ON namespaces.nspname = 'public'
LEFT JOIN pg_catalog.pg_class AS relations
  ON relations.relnamespace = namespaces.oid
  AND relations.relname = requested_tables.table_name
  AND relations.relkind IN ('r', 'p')
LEFT JOIN pg_catalog.pg_policies AS policies
  ON policies.schemaname = 'public'
  AND policies.tablename = requested_tables.table_name
ORDER BY requested_tables.table_name, policies.policyname;

-- 4. Artwork storage bucket configuration
-- A row with bucket_status = BUCKET MISSING means no bucket named artwork exists.
SELECT
  'artwork' AS requested_bucket,
  CASE
    WHEN buckets.id IS NULL THEN 'BUCKET MISSING'
    ELSE 'BUCKET EXISTS'
  END AS bucket_status,
  buckets.id,
  buckets.name,
  buckets.public,
  buckets.file_size_limit,
  buckets.allowed_mime_types,
  buckets.created_at,
  buckets.updated_at
FROM (SELECT 1 AS marker) AS requested
LEFT JOIN storage.buckets AS buckets
  ON buckets.name = 'artwork';

-- 5. RLS state and policies for storage.objects
-- One row is returned per policy; NO POLICY or TABLE MISSING are explicit.
SELECT
  'storage.objects' AS table_name,
  CASE
    WHEN relations.oid IS NULL THEN 'TABLE MISSING'
    WHEN policies.policyname IS NULL THEN 'NO POLICY'
    ELSE 'POLICY'
  END AS inspection_status,
  relations.relrowsecurity AS rls_enabled,
  relations.relforcerowsecurity AS rls_forced,
  policies.policyname,
  policies.permissive,
  policies.roles,
  policies.cmd AS command,
  policies.qual AS using_expression,
  policies.with_check AS check_expression
FROM (SELECT 1 AS marker) AS requested
LEFT JOIN pg_catalog.pg_class AS relations
  ON relations.oid = pg_catalog.to_regclass('storage.objects')
LEFT JOIN pg_catalog.pg_policies AS policies
  ON policies.schemaname = 'storage'
  AND policies.tablename = 'objects';

-- 6. Exact record counts for public portfolio tables
-- query_to_xml executes only the generated SELECT COUNT(*) statement.
-- Identifiers are quoted from the fixed table list above. Missing tables
-- report NULL instead of causing the inspection to fail.
WITH requested_tables(table_name) AS (
  VALUES
    ('categories'::text),
    ('artworks'::text),
    ('commission_inquiries'::text),
    ('artist_profile'::text),
    ('services'::text),
    ('contact_info'::text)
),
count_results AS (
  SELECT
    requested_tables.table_name,
    CASE
      WHEN pg_catalog.to_regclass(
        pg_catalog.format('%I.%I', 'public', requested_tables.table_name)
      ) IS NULL THEN NULL
      ELSE pg_catalog.query_to_xml(
        pg_catalog.format(
          'SELECT count(*) AS row_count FROM %I.%I',
          'public',
          requested_tables.table_name
        ),
        true,
        false,
        ''
      )
    END AS count_xml
  FROM requested_tables
)
SELECT
  table_name,
  CASE
    WHEN count_xml IS NULL THEN NULL
    ELSE (
      pg_catalog.xpath('/table/row/row_count/text()', count_xml)
    )[1]::text::bigint
  END AS exact_record_count,
  CASE
    WHEN count_xml IS NULL THEN 'TABLE MISSING'
    ELSE 'COUNTED'
  END AS inspection_status
FROM count_results
ORDER BY table_name;
