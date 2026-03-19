-- Family Tree Table (Root of all data)
CREATE TABLE trees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID NOT NULL, -- Liên kết với bảng Users (sẽ tạo ở bảng Auth)
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Family/Tribe Table
CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tree_id UUID NOT NULL REFERENCES trees(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES branches(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Personal Table
CREATE TABLE persons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tree_id UUID NOT NULL REFERENCES trees(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id),
    full_name VARCHAR(255) NOT NULL,
    nick_name VARCHAR(255),
    gender SMALLINT CHECK (gender IN (0, 1)),
    generation_number INTEGER NOT NULL,
    birth_order INTEGER,
    
    -- Life and death information
    date_of_birth DATE,
    birth_hour TIME,
    date_of_death DATE,
    death_hour TIME,
    longevity_info TEXT,
    
    -- Blood relationship
    father_id UUID REFERENCES persons(id),
    mother_id UUID REFERENCES persons(id),
    
    child_type VARCHAR(50) DEFAULT 'biological',
    is_alive BOOLEAN DEFAULT true,
    
    -- Important column for synchronization: save the old ID trace if needed or hash the data
    sync_hash VARCHAR(64), 
    metadata JSONB, -- Save custom non-permanent information
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Marriage Table
CREATE TABLE marriages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tree_id UUID NOT NULL REFERENCES trees(id) ON DELETE CASCADE,
    husband_id UUID NOT NULL REFERENCES persons(id),
    wife_id UUID NOT NULL REFERENCES persons(id),
    marriage_order INTEGER DEFAULT 1,
    marriage_date DATE,
    divorce_date DATE,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Index so Shared Server runs quickly when filtering by genealogy
CREATE INDEX idx_branches_tree ON branches(tree_id);
CREATE INDEX idx_persons_tree ON persons(tree_id);