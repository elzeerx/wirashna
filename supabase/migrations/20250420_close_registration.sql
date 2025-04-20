
-- Add registration_closed column to workshops table
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS registration_closed BOOLEAN DEFAULT FALSE;

-- Update comment for the workshops table
COMMENT ON TABLE workshops IS 'Stores workshop information including dates, capacity, and registration status';

-- Update comment for the new column
COMMENT ON COLUMN workshops.registration_closed IS 'Flag to manually close registration for a workshop';
