CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CREATE TYPE ROLES AS ENUM('ADMIN','CREATOR');

-- CREATE TYPE YN AS ENUM('YES','NO','');

-- CREATE TYPE INFLUENCER_TYPE AS ENUM('Nano (1K-10K)','Micro (10K-50K)','Macro (500K-1M)','Celebrity (1M+)');

-- CREATE TYPE MAIL_STATUS AS ENUM('Sent','Pending');

-- CREATE TYPE PAYMENT_STATUS AS ENUM('Completed','Pending');

-- CREATE TYPE APPROVAL_STATUS AS ENUM('YES','NO','OTHER','');

CREATE TABLE IF NOT EXISTS users(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    email VARCHAR(500) NOT NULL UNIQUE,
    role ROLES NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS influencers(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    profile VARCHAR(200) NOT NULL,
    brand_name VARCHAR(200),
    followers VARCHAR(50),
    type INFLUENCER_TYPE,
    email VARCHAR(200),
    contact VARCHAR(20),
    payout INT ,
    product_amount INT,
    total_amount INT GENERATED ALWAYS AS (COALESCE(payout, 0) + COALESCE(product_amount, 0)) STORED,
    order_date DATE,
    receive_date DATE,
    published_date DATE,
    reel_link VARCHAR(500),
    mail_status MAIL_STATUS,
    photo YN,
    review YN,
    views VARCHAR(50),
    likes VARCHAR(50),
    comments VARCHAR(50),
    payment_date DATE,
    gpay_number VARCHAR(20),
    payment_status PAYMENT_STATUS,
    payment_done DATE,
    approval_required YN,
    approval_status APPROVAL_STATUS,
    approval_comment VARCHAR(2000),
    created_at TIMESTAMP DEFAULT now(),
    creator_id UUID NOT NULL
);

CREATE TABLE IF NOT EXISTS brand(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(500) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT now()
);

-- ALTER TABLE influencers DROP CONSTRAINT fk_brand_name;

-- ALTER TABLE influencers ALTER COLUMN brand_name TYPE VARCHAR(255);

-- ALTER TABLE influencers ADD CONSTRAINT fk_brand_name FOREIGN KEY(brand_name) REFERENCES brand(name);

-- ALTER TABLE influencers ADD CONSTRAINT fk_creator FOREIGN KEY(creator_id) REFERENCES users(id);

