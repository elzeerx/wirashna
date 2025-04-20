
-- Create function to find duplicate registrations
CREATE OR REPLACE FUNCTION public.find_duplicate_registrations()
RETURNS TABLE (
  user_id UUID,
  workshop_id UUID,
  count BIGINT,
  registrations JSONB
) 
LANGUAGE SQL
AS $$
  SELECT 
    user_id,
    workshop_id,
    COUNT(*) as count,
    jsonb_agg(
      jsonb_build_object(
        'id', id,
        'email', email,
        'full_name', full_name,
        'payment_status', payment_status,
        'status', status,
        'created_at', created_at,
        'updated_at', updated_at
      )
    ) as registrations
  FROM 
    workshop_registrations
  GROUP BY 
    user_id, workshop_id
  HAVING 
    COUNT(*) > 1
  ORDER BY 
    COUNT(*) DESC;
$$;

-- Update ON DELETE CASCADE for workshop_registrations table
ALTER TABLE IF EXISTS public.workshop_registrations
  DROP CONSTRAINT IF EXISTS workshop_registrations_user_id_fkey;

-- Re-add the foreign key with ON DELETE CASCADE
ALTER TABLE IF EXISTS public.workshop_registrations
  ADD CONSTRAINT workshop_registrations_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add a check to prevent users from registering for closed workshops 
-- (via a trigger instead of a check constraint for better error handling)
CREATE OR REPLACE FUNCTION public.check_workshop_registration_allowed()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if workshop registration is closed
  IF EXISTS (
    SELECT 1 FROM workshops 
    WHERE id = NEW.workshop_id AND registration_closed = true
  ) THEN
    RAISE EXCEPTION 'Registration is closed for this workshop';
  END IF;
  
  -- Check if workshop already has the maximum number of participants
  IF EXISTS (
    SELECT 1 FROM workshops
    WHERE id = NEW.workshop_id AND available_seats <= 0
  ) THEN
    RAISE EXCEPTION 'Workshop is full';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create or replace the trigger
DROP TRIGGER IF EXISTS before_registration_insert ON public.workshop_registrations;
CREATE TRIGGER before_registration_insert
BEFORE INSERT ON public.workshop_registrations
FOR EACH ROW
EXECUTE FUNCTION public.check_workshop_registration_allowed();
