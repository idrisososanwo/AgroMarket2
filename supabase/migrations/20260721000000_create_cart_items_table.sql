-- Migration: 20260721000000_create_cart_items_table.sql
-- Description: Create cart_items table, products dependency, indexes, relationships, and RLS policies for AgroMarket cart functionality.

-- 1. Ensure products table exists for foreign key referencing
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'general',
    price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    unit TEXT NOT NULL DEFAULT 'kg',
    rating NUMERIC(3, 2) DEFAULT 0.00,
    reviews INTEGER DEFAULT 0,
    image TEXT,
    seller TEXT,
    seller_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    location TEXT,
    in_stock BOOLEAN DEFAULT true,
    stock_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on products if created
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Product RLS: Anyone can read products
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Anyone can view products'
    ) THEN
        CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);
    END IF;
END $$;

-- 2. Create cart_items table
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT 'Product',
    price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    unit TEXT NOT NULL DEFAULT 'kg',
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    image TEXT NOT NULL DEFAULT '🌾',
    seller TEXT NOT NULL DEFAULT 'Farm Seller',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT cart_items_user_product_unique UNIQUE (user_id, product_id)
);

-- 3. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON public.cart_items(product_id);

-- 4. Enable Row Level Security (RLS) on cart_items
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- RLS Policy 1: Authenticated users can view their own cart items
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'cart_items' AND policyname = 'Users can view their own cart items'
    ) THEN
        CREATE POLICY "Users can view their own cart items" 
            ON public.cart_items 
            FOR SELECT 
            TO authenticated 
            USING (auth.uid() = user_id);
    END IF;
END $$;

-- RLS Policy 2: Authenticated users can insert their own cart items
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'cart_items' AND policyname = 'Users can insert their own cart items'
    ) THEN
        CREATE POLICY "Users can insert their own cart items" 
            ON public.cart_items 
            FOR INSERT 
            TO authenticated 
            WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- RLS Policy 3: Authenticated users can update their own cart items
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'cart_items' AND policyname = 'Users can update their own cart items'
    ) THEN
        CREATE POLICY "Users can update their own cart items" 
            ON public.cart_items 
            FOR UPDATE 
            TO authenticated 
            USING (auth.uid() = user_id)
            WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- RLS Policy 4: Authenticated users can delete their own cart items
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'cart_items' AND policyname = 'Users can delete their own cart items'
    ) THEN
        CREATE POLICY "Users can delete their own cart items" 
            ON public.cart_items 
            FOR DELETE 
            TO authenticated 
            USING (auth.uid() = user_id);
    END IF;
END $$;

-- 5. Trigger for updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_cart_items_updated_at ON public.cart_items;
CREATE TRIGGER update_cart_items_updated_at
    BEFORE UPDATE ON public.cart_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6. Permissions & Grants
GRANT ALL ON TABLE public.cart_items TO authenticated;
GRANT ALL ON TABLE public.cart_items TO service_role;
GRANT ALL ON TABLE public.products TO authenticated;
GRANT ALL ON TABLE public.products TO service_role;
GRANT SELECT ON TABLE public.products TO anon;
