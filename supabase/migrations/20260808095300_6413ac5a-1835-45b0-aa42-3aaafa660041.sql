CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  company_name text NOT NULL,
  contact_name text NOT NULL,
  contact_email text NOT NULL,
  employee_count integer NOT NULL DEFAULT 0,
  prints_per_employee integer NOT NULL DEFAULT 1,
  access_code text NOT NULL UNIQUE,
  closed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.selections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text NOT NULL DEFAULT '',
  email text NOT NULL,
  print_id text NOT NULL,
  print_title text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX selections_order_id_idx ON public.selections(order_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
GRANT SELECT, DELETE ON public.selections TO authenticated;
GRANT ALL ON public.selections TO service_role;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.selections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners manage their orders"
ON public.orders FOR ALL TO authenticated
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners read their order selections"
ON public.selections FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = selections.order_id AND o.owner_id = auth.uid()));

CREATE POLICY "Owners delete their order selections"
ON public.selections FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = selections.order_id AND o.owner_id = auth.uid()));