-- Media Panel (Photo/Video/Document Management)
CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tree_id UUID NOT NULL REFERENCES trees(id) ON DELETE CASCADE,
    person_id UUID REFERENCES persons(id) ON DELETE SET NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL, -- Local path or S3 Key
    file_type VARCHAR(50),   -- image, video, document
    mime_type VARCHAR(100),
    file_size BIGINT,
    is_avatar BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Events & Calendar panel (Used to send push notifications)
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tree_id UUID NOT NULL REFERENCES trees(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    is_lunar BOOLEAN DEFAULT true, -- Important for Vietnam's death anniversary
    event_type VARCHAR(50),        -- death_anniversary, wedding, meeting
    reminder_days INTEGER DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table of Member Permissions for Group Participation
CREATE TABLE tree_members (
    tree_id UUID REFERENCES trees(id) ON DELETE CASCADE,
    user_id UUID NOT NULL, -- User ID from the Auth system
    role VARCHAR(50) DEFAULT 'viewer', -- owner, editor, viewer
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (tree_id, user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);