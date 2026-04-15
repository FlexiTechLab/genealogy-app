CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    
    is_active BOOLEAN DEFAULT true,
    role VARCHAR(50) DEFAULT 'member', -- admin, editor, member
    
    person_id UUID,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_user_person 
        FOREIGN KEY (person_id) 
        REFERENCES persons(id) 
        ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);