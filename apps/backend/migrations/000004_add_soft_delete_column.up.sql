ALTER TABLE trees ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE branches ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE persons ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE marriages ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE media ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE events ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE family_assets ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE clan_rules ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;

CREATE INDEX idx_trees_deleted_at ON trees(deleted_at);
CREATE INDEX idx_branches_deleted_at ON branches(deleted_at);
CREATE INDEX idx_persons_deleted_at ON persons(deleted_at);
CREATE INDEX idx_marriages_deleted_at ON marriages(deleted_at);
CREATE INDEX idx_media_deleted_at ON media(deleted_at);
CREATE INDEX idx_events_deleted_at ON events(deleted_at);
CREATE INDEX idx_family_assets_deleted_at ON family_assets(deleted_at);
CREATE INDEX idx_clan_rules_deleted_at ON clan_rules(deleted_at);