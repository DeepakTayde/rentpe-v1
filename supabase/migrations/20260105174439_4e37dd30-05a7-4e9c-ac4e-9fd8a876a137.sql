-- Trigger: Notify on visit scheduled
CREATE OR REPLACE FUNCTION public.notify_on_visit_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  property_title TEXT;
  property_owner_id UUID;
BEGIN
  -- Get property info
  SELECT title, owner_id INTO property_title, property_owner_id
  FROM public.properties
  WHERE id = NEW.property_id;
  
  -- Notify tenant about scheduled visit
  IF NEW.tenant_id IS NOT NULL THEN
    PERFORM public.create_notification(
      NEW.tenant_id,
      'visit',
      'Visit Scheduled',
      'Your property visit for ' || COALESCE(property_title, 'the property') || ' is scheduled for ' || NEW.scheduled_date || ' at ' || NEW.scheduled_time,
      jsonb_build_object('visit_id', NEW.id, 'property_id', NEW.property_id),
      '/tenant/dashboard'
    );
  END IF;
  
  -- Notify owner about upcoming visit
  IF property_owner_id IS NOT NULL THEN
    PERFORM public.create_notification(
      property_owner_id,
      'visit',
      'Property Visit Scheduled',
      'A tenant has scheduled a visit to your property ' || COALESCE(property_title, '') || ' on ' || NEW.scheduled_date,
      jsonb_build_object('visit_id', NEW.id, 'property_id', NEW.property_id),
      '/owner/dashboard'
    );
  END IF;
  
  -- Notify agent if assigned
  IF NEW.agent_id IS NOT NULL THEN
    PERFORM public.create_notification(
      NEW.agent_id,
      'visit',
      'New Visit Assigned',
      'Property visit scheduled: ' || COALESCE(property_title, 'Property') || ' on ' || NEW.scheduled_date || ' at ' || NEW.scheduled_time,
      jsonb_build_object('visit_id', NEW.id, 'property_id', NEW.property_id),
      '/agent/dashboard'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_visit_created
AFTER INSERT ON public.visits
FOR EACH ROW
EXECUTE FUNCTION public.notify_on_visit_created();

-- Trigger: Notify on visit status change
CREATE OR REPLACE FUNCTION public.notify_on_visit_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  property_title TEXT;
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    SELECT title INTO property_title
    FROM public.properties
    WHERE id = NEW.property_id;
    
    -- Notify tenant about status change
    IF NEW.tenant_id IS NOT NULL THEN
      PERFORM public.create_notification(
        NEW.tenant_id,
        'visit',
        'Visit ' || INITCAP(NEW.status::text),
        'Your visit for ' || COALESCE(property_title, 'the property') || ' has been ' || REPLACE(NEW.status::text, '_', ' '),
        jsonb_build_object('visit_id', NEW.id, 'status', NEW.status),
        '/tenant/dashboard'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_visit_status_changed
AFTER UPDATE ON public.visits
FOR EACH ROW
EXECUTE FUNCTION public.notify_on_visit_status_change();

-- Trigger: Notify on property status change
CREATE OR REPLACE FUNCTION public.notify_on_property_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status AND NEW.owner_id IS NOT NULL THEN
    PERFORM public.create_notification(
      NEW.owner_id,
      'property',
      'Property ' || INITCAP(NEW.status::text),
      'Your property "' || NEW.title || '" is now ' || REPLACE(NEW.status::text, '_', ' '),
      jsonb_build_object('property_id', NEW.id, 'status', NEW.status),
      '/owner/dashboard'
    );
    
    -- If property is verified and agent exists, notify agent
    IF NEW.status = 'verified' AND NEW.agent_id IS NOT NULL THEN
      PERFORM public.create_notification(
        NEW.agent_id,
        'property',
        'Property Verified',
        'Property "' || NEW.title || '" has been verified and is now live',
        jsonb_build_object('property_id', NEW.id),
        '/agent/dashboard'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_property_status_changed
AFTER UPDATE ON public.properties
FOR EACH ROW
EXECUTE FUNCTION public.notify_on_property_status_change();