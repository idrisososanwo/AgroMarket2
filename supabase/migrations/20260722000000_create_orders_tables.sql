-- Migration: 20260722000000_create_orders_tables.sql
-- Description: Create orders and order_items tables, indexes, RLS policies, triggers, and grants.

-- ==========================================
-- 1. ORDERS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    seller_id TEXT,
    delivery_cost NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    tax NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL DEFAULT 'Pending',
    status_desc TEXT DEFAULT 'Order received by farm. Preparing for packaging.',
    carrier TEXT DEFAULT 'AgroExpress Local',
    tracking_number TEXT,
    shipping_address TEXT,
    payment_method TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON public.orders(buyer_id);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Users can view their own orders'
    ) THEN
        CREATE POLICY "Users can view their own orders" ON public.orders
            FOR SELECT TO authenticated USING (auth.uid() = buyer_id OR auth.uid() = user_id OR auth.uid()::text = seller_id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Users can insert their own orders'
    ) THEN
        CREATE POLICY "Users can insert their own orders" ON public.orders
            FOR INSERT TO authenticated WITH CHECK (auth.uid() = buyer_id OR auth.uid() = user_id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Users can update their own orders'
    ) THEN
        CREATE POLICY "Users can update their own orders" ON public.orders
            FOR UPDATE TO authenticated USING (auth.uid() = buyer_id OR auth.uid() = user_id OR auth.uid()::text = seller_id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Users can delete their own orders'
    ) THEN
        CREATE POLICY "Users can delete their own orders" ON public.orders
            FOR DELETE TO authenticated USING (auth.uid() = buyer_id OR auth.uid() = user_id);
    END IF;
END $$;

-- ==========================================
-- 2. ORDER ITEMS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    qty INTEGER NOT NULL DEFAULT 1 CHECK (qty > 0),
    price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    unit TEXT NOT NULL DEFAULT 'kg',
    image TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'order_items' AND policyname = 'Users can view order items of their orders'
    ) THEN
        CREATE POLICY "Users can view order items of their orders" ON public.order_items
            FOR SELECT TO authenticated USING (
                EXISTS (
                    SELECT 1 FROM public.orders 
                    WHERE orders.id = order_items.order_id 
                    AND (orders.buyer_id = auth.uid() OR orders.user_id = auth.uid() OR orders.seller_id = auth.uid()::text)
                )
            );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'order_items' AND policyname = 'Users can insert order items of their orders'
    ) THEN
        CREATE POLICY "Users can insert order items of their orders" ON public.order_items
            FOR INSERT TO authenticated WITH CHECK (
                EXISTS (
                    SELECT 1 FROM public.orders 
                    WHERE orders.id = order_items.order_id 
                    AND (orders.buyer_id = auth.uid() OR orders.user_id = auth.uid())
                )
            );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'order_items' AND policyname = 'Users can update order items of their orders'
    ) THEN
        CREATE POLICY "Users can update order items of their orders" ON public.order_items
            FOR UPDATE TO authenticated USING (
                EXISTS (
                    SELECT 1 FROM public.orders 
                    WHERE orders.id = order_items.order_id 
                    AND (orders.buyer_id = auth.uid() OR orders.user_id = auth.uid() OR orders.seller_id = auth.uid()::text)
                )
            );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'order_items' AND policyname = 'Users can delete order items of their orders'
    ) THEN
        CREATE POLICY "Users can delete order items of their orders" ON public.order_items
            FOR DELETE TO authenticated USING (
                EXISTS (
                    SELECT 1 FROM public.orders 
                    WHERE orders.id = order_items.order_id 
                    AND (orders.buyer_id = auth.uid() OR orders.user_id = auth.uid())
                )
            );
    END IF;
END $$;

-- ==========================================
-- 3. TRIGGERS & GRANTS
-- ==========================================
DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_order_items_updated_at ON public.order_items;
CREATE TRIGGER update_order_items_updated_at
    BEFORE UPDATE ON public.order_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

GRANT ALL ON TABLE public.orders TO authenticated;
GRANT ALL ON TABLE public.orders TO service_role;
GRANT ALL ON TABLE public.order_items TO authenticated;
GRANT ALL ON TABLE public.order_items TO service_role;
