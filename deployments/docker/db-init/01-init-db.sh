#!/bin/bash
set -e

DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
ENV=${APP_ENV}

echo "--- [INIT DB] Environment: $ENV ---"

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    
    -- Create a Metadata table for SeaweedFS
    CREATE TABLE IF NOT EXISTS filemeta (
        dirhash     BIGINT,         -- Optimized directory hash (no path locking!)
        name        VARCHAR(65535), -- Supports looong filenames (65k chars!)
        directory   VARCHAR(65535), -- Full path storage (e.g., '/user_uploads')
        meta        bytea,          -- Serialized protobuf (timestamps, permissions)
        PRIMARY KEY (dirhash, name) -- Blazing fast lookups + uniqueness
    );
    CREATE INDEX IF NOT EXISTS idx_directory ON public.filemeta (directory);
    
    -- Create a user account if you don't already have one.
    DO \$\$
    BEGIN
        IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = '$DB_USER') THEN
            CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
        END IF;
    END
    \$\$;

    -- Clear old permissions to ensure consistency when switching environments.
    REVOKE ALL ON SCHEMA public FROM $DB_USER;
    GRANT USAGE ON SCHEMA public TO $DB_USER;

     -- Grant ownership of the SeaweedFS table to the user
    ALTER TABLE public.filemeta OWNER TO $DB_USER;

    -- Authorization logic based on environment variables
    DO \$\$
    BEGIN
        IF '$ENV' = 'production' THEN
            -- PRODUCTION MODE: Allows only data manipulation (DML), not structure modification (DDL)
            GRANT CREATE, SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO $DB_USER;
            GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;
            GRANT USAGE, SELECT ON ALL FUNCTIONS IN SCHEMA public TO $DB_USER;

            ALTER DEFAULT PRIVILEGES FOR ROLE $POSTGRES_USER IN SCHEMA public GRANT SELECT, INSERT, UPDATE ON TABLES TO $DB_USER;
            ALTER DEFAULT PRIVILEGES FOR ROLE $POSTGRES_USER IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO $DB_USER;
            ALTER DEFAULT PRIVILEGES FOR ROLE $POSTGRES_USER IN SCHEMA public GRANT USAGE, SELECT ON FUNCTIONS TO $DB_USER;
            
            RAISE NOTICE 'Applied PRODUCTION privileges (DML only) to %', '$DB_USER';
        ELSE
            -- DEVELOPMENT MODE: Governor-General (Owner)
            EXECUTE 'ALTER SCHEMA public OWNER TO ' || quote_ident('$DB_USER');
            GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;
            GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;
            GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO $DB_USER;

            ALTER DEFAULT PRIVILEGES FOR ROLE $POSTGRES_USER IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO $DB_USER;
            ALTER DEFAULT PRIVILEGES FOR ROLE $POSTGRES_USER IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO $DB_USER;
            ALTER DEFAULT PRIVILEGES FOR ROLE $POSTGRES_USER IN SCHEMA public GRANT ALL PRIVILEGES ON FUNCTIONS TO $DB_USER;

            
            RAISE NOTICE 'Applied DEVELOPMENT privileges (Full Owner) to %', '$DB_USER';
        END IF;
    END
    \$\$;
EOSQL