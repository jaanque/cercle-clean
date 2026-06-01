-- Habilitar RLS en la tabla
ALTER TABLE public.recent_searches ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas antiguas para evitar conflictos
DROP POLICY IF EXISTS "Permitir leer sus propias busquedas" ON public.recent_searches;
DROP POLICY IF EXISTS "Permitir insertar a usuarios autenticados" ON public.recent_searches;
DROP POLICY IF EXISTS "Permitir borrar sus propias busquedas" ON public.recent_searches;
DROP POLICY IF EXISTS "Allow user reads" ON public.recent_searches;
DROP POLICY IF EXISTS "Allow user inserts" ON public.recent_searches;
DROP POLICY IF EXISTS "Allow user deletes" ON public.recent_searches;

-- 1. Política para permitir LEER (SELECT) sus propias búsquedas (¡Esto es lo que suele faltar!)
CREATE POLICY "Permitir leer sus propias busquedas"
ON public.recent_searches
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 2. Política para permitir INSERTAR (INSERT) sus propias búsquedas
CREATE POLICY "Permitir insertar a usuarios autenticados"
ON public.recent_searches
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 3. Política para permitir BORRAR (DELETE) sus propias búsquedas
CREATE POLICY "Permitir borrar sus propias busquedas"
ON public.recent_searches
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
