-- ALTER TABLE influencers ALTER COLUMN brand_name TYPE VARCHAR(255);

-- ALTER TABLE influencers ADD COLUMN creator_name VARCHAR(100);

CREATE TABLE sessions(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    role ROLES NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
)