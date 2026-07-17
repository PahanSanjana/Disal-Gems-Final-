
DROP POLICY IF EXISTS "appointments_insert_any" ON public.appointments;
CREATE POLICY "appointments_insert_own_or_anon" ON public.appointments
  FOR INSERT TO authenticated, anon
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
