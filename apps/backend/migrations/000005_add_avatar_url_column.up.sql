ALTER TABLE persons ADD COLUMN avatar_url TEXT;
COMMENT ON COLUMN persons.avatar_url IS 'Member profile picture';