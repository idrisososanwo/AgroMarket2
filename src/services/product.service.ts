import { supabase } from "../lib/supabase";
import type {
  Product,
  ProductQueryParams,
  CreateProductInput,
  UpdateProductInput,
} from "../types";

const INITIAL_MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Premium Basmati Rice",
    description:
      "Naturally grown, aromatic, long-grain basmati rice. Handled with extreme hygiene and dried using solar-powered drying facilities to maintain high nutrition and premium quality.",
    category: "grains",
    price: 45.0,
    unit: "kg",
    rating: 4.8,
    reviews: 24,
    image: "🌾",
    seller: "GreenValley Farms",
    seller_id: "seller-1",
    location: "Green Valley Fields",
    inStock: true,
    in_stock: true,
    stock_quantity: 150,
    created_at: "2026-07-01T10:00:00Z",
  },
  {
    id: "2",
    name: "Organic Vine Tomatoes",
    description:
      "Sun-ripened on the vine, these tomatoes are 100% organic, sweet, juicy, and perfect for salads, sauces, or home cooking. Picked fresh on the morning of dispatch.",
    category: "vegetables",
    price: 3.5,
    unit: "kg",
    rating: 4.9,
    reviews: 42,
    image: "🍅",
    seller: "Sunny Slope Organic",
    seller_id: "seller-2",
    location: "Sunny Slope Hills",
    inStock: true,
    in_stock: true,
    stock_quantity: 80,
    created_at: "2026-07-02T10:00:00Z",
  },
  {
    id: "3",
    name: "Fresh Honey Crisp Apples",
    description:
      "Crispy, sweet, and slightly tart honeycrisp apples. Grown using natural pollination and sustainable orchard practices. Perfect healthy snack or pie ingredient.",
    category: "fruits",
    price: 4.2,
    unit: "kg",
    rating: 4.7,
    reviews: 18,
    image: "🍎",
    seller: "Orchard Heights",
    seller_id: "seller-3",
    location: "Appalachian Slopes",
    inStock: true,
    in_stock: true,
    stock_quantity: 200,
    created_at: "2026-07-03T10:00:00Z",
  },
  {
    id: "4",
    name: "Farm Fresh Large Eggs",
    description:
      "Free-range eggs from pasture-raised hens fed with organic corn and seed. Deep yellow yolks, firm whites, and exceptional fresh farm taste.",
    category: "dairy",
    price: 5.5,
    unit: "dozen",
    rating: 4.9,
    reviews: 56,
    image: "🥚",
    seller: "Feathered Nest Poultry",
    seller_id: "seller-4",
    location: "Meadowland Meadows",
    inStock: true,
    in_stock: true,
    stock_quantity: 95,
    created_at: "2026-07-04T10:00:00Z",
  },
  {
    id: "5",
    name: "Golden Sunflower Seed Oil",
    description:
      "Cold-pressed virgin sunflower oil rich in Vitamin E and essential omega fatty acids. Filtered without chemicals for pure golden clarity.",
    category: "grains",
    price: 12.0,
    unit: "liter",
    rating: 4.6,
    reviews: 12,
    image: "🌻",
    seller: "BioPress Oils",
    seller_id: "seller-5",
    location: "Golden Valley",
    inStock: true,
    in_stock: true,
    stock_quantity: 60,
    created_at: "2026-07-05T10:00:00Z",
  },
  {
    id: "6",
    name: "Sweet Yellow Sweetcorn",
    description:
      "Succulent, non-GMO sweetcorn harvested at peak sweetness. Tastes fantastic boiled, grilled, or roasted over open fire.",
    category: "vegetables",
    price: 2.8,
    unit: "pack",
    rating: 4.5,
    reviews: 8,
    image: "🌽",
    seller: "Riverbend Fields",
    seller_id: "seller-6",
    location: "Riverbend Valley",
    inStock: false,
    in_stock: false,
    stock_quantity: 0,
    created_at: "2026-07-06T10:00:00Z",
  },
];

export const productService = {
  /**
   * Fetch list of products with optional filtering and pagination
   */
  async getProducts(params: ProductQueryParams = {}): Promise<Product[]> {
    try {
      let query = supabase.from("products").select("*");

      if (params.category) {
        query = query.eq("category", params.category);
      }

      if (params.sellerId) {
        query = query.eq("seller_id", params.sellerId);
      }

      if (params.inStock !== undefined) {
        query = query.eq("in_stock", params.inStock);
      }

      if (params.minPrice !== undefined) {
        query = query.gte("price", params.minPrice);
      }

      if (params.maxPrice !== undefined) {
        query = query.lte("price", params.maxPrice);
      }

      if (params.searchQuery) {
        query = query.or(
          `name.ilike.%${params.searchQuery}%,description.ilike.%${params.searchQuery}%,seller.ilike.%${params.searchQuery}%`
        );
      }

      if (params.sortBy) {
        switch (params.sortBy) {
          case "price_asc":
            query = query.order("price", { ascending: true });
            break;
          case "price_desc":
            query = query.order("price", { ascending: false });
            break;
          case "rating":
            query = query.order("rating", { ascending: false });
            break;
          case "newest":
          default:
            query = query.order("created_at", { ascending: false });
            break;
        }
      } else {
        query = query.order("created_at", { ascending: false });
      }

      if (params.limit) {
        const from = params.offset || 0;
        const to = from + params.limit - 1;
        query = query.range(from, to);
      }

      const { data, error } = await query;

      if (error) {
        console.warn("Supabase query error, using fallback data:", error.message);
        return this.filterMockProducts(INITIAL_MOCK_PRODUCTS, params);
      }

      if (!data || data.length === 0) {
        return this.filterMockProducts(INITIAL_MOCK_PRODUCTS, params);
      }

      return data.map((item) => ({
        ...item,
        inStock: item.in_stock ?? item.inStock ?? true,
        reviews: item.reviews_count ?? item.reviews ?? 0,
      }));
    } catch (err: unknown) {
      console.warn("Error fetching products, returning fallback products", err);
      return this.filterMockProducts(INITIAL_MOCK_PRODUCTS, params);
    }
  },

  /**
   * Helper to filter fallback mock products
   */
  filterMockProducts(list: Product[], params: ProductQueryParams): Product[] {
    let result = [...list];

    if (params.category) {
      result = result.filter((p) => p.category.toLowerCase() === params.category?.toLowerCase());
    }

    if (params.sellerId) {
      result = result.filter((p) => p.seller_id === params.sellerId || p.seller === params.sellerId);
    }

    if (params.inStock !== undefined) {
      result = result.filter((p) => p.inStock === params.inStock);
    }

    if (params.searchQuery) {
      const q = params.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.seller.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    if (params.sortBy) {
      switch (params.sortBy) {
        case "price_asc":
          result.sort((a, b) => a.price - b.price);
          break;
        case "price_desc":
          result.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          result.sort((a, b) => b.rating - a.rating);
          break;
        case "newest":
        default:
          result.sort(
            (a, b) =>
              new Date(b.created_at || "").getTime() -
              new Date(a.created_at || "").getTime()
          );
          break;
      }
    }

    return result;
  },

  /**
   * Fetch a single product by ID
   */
  async getProductById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        const mockMatch = INITIAL_MOCK_PRODUCTS.find((p) => p.id === id);
        return mockMatch || null;
      }

      return {
        ...data,
        inStock: data.in_stock ?? data.inStock ?? true,
        reviews: data.reviews_count ?? data.reviews ?? 0,
      };
    } catch (err: unknown) {
      console.warn("Error fetching product by ID, using mock fallback", err);
      const mockMatch = INITIAL_MOCK_PRODUCTS.find((p) => p.id === id);
      return mockMatch || null;
    }
  },

  /**
   * Fetch products for a specific seller
   */
  async getSellerProducts(sellerId: string): Promise<Product[]> {
    return this.getProducts({ sellerId });
  },

  /**
   * Create a new product listing
   */
  async createProduct(input: CreateProductInput): Promise<Product> {
    try {
      const dbPayload = {
        name: input.name,
        description: input.description ?? "",
        category: input.category,
        price: input.price,
        unit: input.unit,
        image: input.image,
        seller: input.seller,
        seller_id: input.seller_id,
        location: input.location ?? "",
        in_stock: input.inStock ?? input.in_stock ?? true,
        rating: 5.0,
        reviews_count: 1,
      };

      const { data, error } = await supabase
        .from("products")
        .insert([dbPayload])
        .select()
        .single();

      if (error) {
        console.error("Error creating product in Supabase:", error.message);
        const createdMock: Product = {
          ...dbPayload,
          id: `product-${Date.now()}`,
          inStock: dbPayload.in_stock,
          reviews: 1,
        };
        INITIAL_MOCK_PRODUCTS.unshift(createdMock);
        return createdMock;
      }

      return {
        ...data,
        inStock: data.in_stock ?? true,
        reviews: data.reviews_count ?? 0,
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error("An unexpected error occurred while creating product.", { cause: err });
    }
  },

  /**
   * Update an existing product
   */
  async updateProduct(id: string, updates: UpdateProductInput): Promise<Product> {
    try {
      const dbUpdates: Record<string, unknown> = { ...updates };
      if (updates.inStock !== undefined) {
        dbUpdates.in_stock = updates.inStock;
      }
      dbUpdates.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from("products")
        .update(dbUpdates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating product:", error.message);
        throw new Error(`Failed to update product: ${error.message}`);
      }

      return {
        ...data,
        inStock: data.in_stock ?? true,
        reviews: data.reviews_count ?? 0,
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error("An unexpected error occurred while updating product.", { cause: err });
    }
  },

  /**
   * Delete a product by ID
   */
  async deleteProduct(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) {
        console.error("Error deleting product:", error.message);
        throw new Error(`Failed to delete product: ${error.message}`);
      }

      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error("An unexpected error occurred while deleting product.", { cause: err });
    }
  },

};
