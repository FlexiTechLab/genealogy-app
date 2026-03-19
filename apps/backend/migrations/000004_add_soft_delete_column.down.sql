DROP INDEX IF EXISTS idx_clan_rules_deleted_at;
DROP INDEX IF EXISTS idx_family_assets_deleted_at;
DROP INDEX IF EXISTS idx_events_deleted_at;
DROP INDEX IF EXISTS idx_media_deleted_at;
DROP INDEX IF EXISTS idx_marriages_deleted_at;
DROP INDEX IF EXISTS idx_persons_deleted_at;
DROP INDEX IF EXISTS idx_branches_deleted_at;
DROP INDEX IF EXISTS idx_trees_deleted_at;

ALTER TABLE clan_rules DROP COLUMN IF EXISTS deleted_at;
ALTER TABLE family_assets DROP COLUMN IF EXISTS deleted_at;
ALTER TABLE events DROP COLUMN IF EXISTS deleted_at;
ALTER TABLE media DROP COLUMN IF EXISTS deleted_at;
ALTER TABLE marriages DROP COLUMN IF EXISTS deleted_at;
ALTER TABLE persons DROP COLUMN IF EXISTS deleted_at;
ALTER TABLE branches DROP COLUMN IF EXISTS deleted_at;
ALTER TABLE trees DROP COLUMN IF EXISTS deleted_at;