import { supabase } from "../lib/supabase";
import type {
  Product,
  ProductQueryParams,
  CreateProductInput,
  UpdateProductInput,
} from "../types";

const isUUID = (val?: string): boolean =>
  Boolean(val && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val));

export const INITIAL_MOCK_PRODUCTS: Product[] = [
  {
    id: "a1b2c3d4-0000-4000-8000-000000000001",
    name: "Kano Super White Rice (50kg Bag)",
    description: "Parboiled long-grain white rice harvested directly from Kano irrigation fields. Stone-free, highly aromatic, and perfect for household cooking or commercial catering.",
    category: "grains",
    price: 78000,
    unit: "50kg bag",
    rating: 4.9,
    reviews: 64,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
    seller: "Alhaji Danladi Grains",
    seller_id: "00000000-0000-4000-8000-000000000001",
    location: "Kano, Kano State",
    inStock: true,
    in_stock: true,
    stock_quantity: 120,
    created_at: "2026-07-01T10:00:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000002",
    name: "Benue Fresh White Yam Tubers (5 Large Tubers)",
    description: "Organically cultivated heavy white yams harvested from the fertile soils of Gboko, Benue State. Excellent starch quality, ideal for pounded yam or boiling.",
    category: "tubers",
    price: 18500,
    unit: "5 tubers",
    rating: 4.8,
    reviews: 42,
    image: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=800&q=80",
    seller: "Gboko Yam Farmers Co-op",
    seller_id: "00000000-0000-4000-8000-000000000002",
    location: "Gboko, Benue State",
    inStock: true,
    in_stock: true,
    stock_quantity: 85,
    created_at: "2026-07-02T10:00:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000003",
    name: "Jos Fresh Plum Tomatoes (Big Basket)",
    description: "Sun-ripened red plum tomatoes harvested fresh from Plateau State highlands. Firm, juicy, and low seed content, ideal for stew and paste preparation.",
    category: "vegetables",
    price: 24000,
    unit: "big basket",
    rating: 4.7,
    reviews: 58,
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
    seller: "Plateau Green Harvest",
    seller_id: "00000000-0000-4000-8000-000000000003",
    location: "Jos, Plateau State",
    inStock: true,
    in_stock: true,
    stock_quantity: 50,
    created_at: "2026-07-03T10:00:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000004",
    name: "Fresh Red Habanero Peppers (Ata Rodo - Paint Bucket)",
    description: "Extremely spicy and aromatic red habanero peppers picked fresh daily from Ibadan farms. Rich flavor and deep crimson color.",
    category: "vegetables",
    price: 9500,
    unit: "paint bucket",
    rating: 4.8,
    reviews: 36,
    image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80",
    seller: "Oyo Spice Farms",
    seller_id: "00000000-0000-4000-8000-000000000004",
    location: "Ibadan, Oyo State",
    inStock: true,
    in_stock: true,
    stock_quantity: 90,
    created_at: "2026-07-04T10:00:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000005",
    name: "Kano Dry Yellow Onions (50kg Bag)",
    description: "Well-cured dry yellow onions from Bichi, Kano. High shelf-life, pungent flavor, and firm layers suitable for long storage and commercial transport.",
    category: "vegetables",
    price: 42000,
    unit: "50kg bag",
    rating: 4.6,
    reviews: 29,
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80",
    seller: "Bichi Agro Traders",
    seller_id: "00000000-0000-4000-8000-000000000005",
    location: "Kano, Kano State",
    inStock: true,
    in_stock: true,
    stock_quantity: 65,
    created_at: "2026-07-05T10:00:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000006",
    name: "Pure Unrefined Red Palm Oil (25 Liters)",
    description: "100% pure unadulterated red palm oil extracted naturally in Nsukka. Free from additives or artificial coloring, rich in Vitamin A.",
    category: "oils_spices",
    price: 32500,
    unit: "25L jerrycan",
    rating: 4.9,
    reviews: 81,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
    seller: "Nsukka Oil Palm Estates",
    seller_id: "00000000-0000-4000-8000-000000000006",
    location: "Nsukka, Enugu State",
    inStock: true,
    in_stock: true,
    stock_quantity: 110,
    created_at: "2026-07-06T10:00:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000007",
    name: "Farm Fresh Jumbo Eggs (Crate of 30)",
    description: "Clean, brown-shelled jumbo eggs laid by free-range poultry fed with organic grain mash. Rich golden yolk.",
    category: "dairy",
    price: 4200,
    unit: "crate",
    rating: 4.9,
    reviews: 94,
    image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=800&q=80",
    seller: "Sunshine Poultry Farms",
    seller_id: "00000000-0000-4000-8000-000000000007",
    location: "Abeokuta, Ogun State",
    inStock: true,
    in_stock: true,
    stock_quantity: 200,
    created_at: "2026-07-07T10:00:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000008",
    name: "Live Heavyweight Broiler Chicken (Full Grown)",
    description: "Healthy 3.5kg live broiler chicken raised in hygienic conditions with natural feeds. Vaccinated and ready for dressing.",
    category: "livestock",
    price: 9800,
    unit: "head",
    rating: 4.8,
    reviews: 45,
    image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80",
    seller: "Sunshine Poultry Farms",
    seller_id: "00000000-0000-4000-8000-000000000007",
    location: "Abeokuta, Ogun State",
    inStock: true,
    in_stock: true,
    stock_quantity: 75,
    created_at: "2026-07-08T10:00:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000009",
    name: "Oron Dried Smoked Catfish (Pack of 10)",
    description: "Oven-dried premium catfish smoked with natural hardwood. Thoroughly dried, stone-free, and rich in natural smoky aroma.",
    category: "fish_seafood",
    price: 14000,
    unit: "pack of 10",
    rating: 4.9,
    reviews: 52,
    image: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=800&q=80",
    seller: "Calabar Marine Products",
    seller_id: "00000000-0000-4000-8000-000000000008",
    location: "Oron, Akwa Ibom State",
    inStock: true,
    in_stock: true,
    stock_quantity: 60,
    created_at: "2026-07-09T10:00:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000010",
    name: "Sweet Benue Oranges (100 Pieces Sack)",
    description: "Juicy, naturally sweet Valencia oranges harvested from Makurdi orchards. High juice content and refreshing flavor.",
    category: "fruits",
    price: 12000,
    unit: "100 pcs sack",
    rating: 4.7,
    reviews: 33,
    image: "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=800&q=80",
    seller: "Makurdi Citrus Growers",
    seller_id: "00000000-0000-4000-8000-000000000009",
    location: "Makurdi, Benue State",
    inStock: true,
    in_stock: true,
    stock_quantity: 40,
    created_at: "2026-07-10T10:00:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000011",
    name: "Ripe Cavendish Bananas (Big Bunch)",
    description: "Freshly harvested naturally ripened Cavendish bananas from Ondo orchards. Sweet, plump, and perfect for smoothies or snacks.",
    category: "fruits",
    price: 5500,
    unit: "bunch",
    rating: 4.6,
    reviews: 27,
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",
    seller: "Ondo Fruit Orchards",
    seller_id: "00000000-0000-4000-8000-000000000010",
    location: "Ondo, Ondo State",
    inStock: true,
    in_stock: true,
    stock_quantity: 90,
    created_at: "2026-07-11T10:00:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000012",
    name: "Fresh Raw Cassava Roots (100kg Bag)",
    description: "Freshly harvested high-yield TME 419 cassava roots from Ijebu plantations. Ideal for garri, fufu, or starch processing.",
    category: "tubers",
    price: 22000,
    unit: "100kg bag",
    rating: 4.5,
    reviews: 21,
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
    seller: "Ijebu Cassava Processors",
    seller_id: "00000000-0000-4000-8000-000000000011",
    location: "Ijebu-Ode, Ogun State",
    inStock: true,
    in_stock: true,
    stock_quantity: 70,
    created_at: "2026-07-12T10:00:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000013",
    name: "Kaduna Dry Yellow Maize (50kg Bag)",
    description: "Sun-dried yellow corn grains from Zaria farms. Clean, moisture-tested, and perfect for livestock feed or cornmeal.",
    category: "grains",
    price: 38000,
    unit: "50kg bag",
    rating: 4.7,
    reviews: 38,
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80",
    seller: "Zaria Grain Merchants",
    seller_id: "00000000-0000-4000-8000-000000000012",
    location: "Zaria, Kaduna State",
    inStock: true,
    in_stock: true,
    stock_quantity: 150,
    created_at: "2026-07-13T10:00:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000014",
    name: "Fresh Green Ugwu Leaves (Fluted Pumpkin - Large Bundle)",
    description: "Freshly cut organic fluted pumpkin leaves (Ugwu) from Epe riverbanks. Deep green, nutrient-packed, ideal for soups.",
    category: "vegetables",
    price: 2500,
    unit: "bundle",
    rating: 4.9,
    reviews: 72,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    seller: "Epe Green Farms",
    seller_id: "00000000-0000-4000-8000-000000000013",
    location: "Epe, Lagos State",
    inStock: true,
    in_stock: true,
    stock_quantity: 130,
    created_at: "2026-07-14T10:00:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000015",
    name: "Ogun Unripe Plantain (Big Bunch)",
    description: "Firm green unripe plantains harvested from Sagamu plantain groves. Ideal for plantain flour or fried dodo chips.",
    category: "fruits",
    price: 6800,
    unit: "bunch",
    rating: 4.8,
    reviews: 41,
    image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=800&q=80",
    seller: "Remo Plantain Plantations",
    seller_id: "00000000-0000-4000-8000-000000000014",
    location: "Sagamu, Ogun State",
    inStock: true,
    in_stock: true,
    stock_quantity: 80,
    created_at: "2026-07-15T10:00:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000016",
    name: "Hand-Picked Raw Groundnuts / Peanuts (10kg Bag)",
    description: "Clean, dry raw groundnut pods harvested in Funtua, Katsina. Excellent oil content and crisp crunch when roasted.",
    category: "grains",
    price: 16000,
    unit: "10kg bag",
    rating: 4.6,
    reviews: 19,
    image: "https://images.unsplash.com/photo-1567892320421-1c657571ea48?auto=format&fit=crop&w=800&q=80",
    seller: "Katsina Nut Harvest",
    seller_id: "00000000-0000-4000-8000-000000000015",
    location: "Funtua, Katsina State",
    inStock: true,
    in_stock: true,
    stock_quantity: 100,
    created_at: "2026-07-16T10:00:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000017",
    name: "Jigawa Fresh Watermelon (Extra Large Single Fruit)",
    description: "Extra large, super sweet crimson watermelon cultivated in Dutse irrigation zone. Deep red flesh and refreshing taste.",
    category: "fruits",
    price: 3500,
    unit: "fruit",
    rating: 4.7,
    reviews: 50,
    image: "https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=800&q=80",
    seller: "Jigawa Melon Farms",
    seller_id: "00000000-0000-4000-8000-000000000016",
    location: "Dutse, Jigawa State",
    inStock: true,
    in_stock: true,
    stock_quantity: 95,
    created_at: "2026-07-17T10:00:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000018",
    name: "Smoked Mangala Fish (Pack of 5)",
    description: "Traditional dry-smoked Mangala fish from Lake Chad region. Rich flavor profile for native soups and stews.",
    category: "fish_seafood",
    price: 11500,
    unit: "pack",
    rating: 4.8,
    reviews: 34,
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    seller: "Lake Chad Artisanal Fishery",
    seller_id: "00000000-0000-4000-8000-000000000017",
    location: "Maiduguri, Borno State",
    inStock: true,
    in_stock: true,
    stock_quantity: 45,
    created_at: "2026-07-18T10:00:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000019",
    name: "Fresh Sweet Pineapple (Large Unit)",
    description: "Sugarloaf variety sweet pineapple from Cross River State. Golden yellow flesh with exceptional natural aroma.",
    category: "fruits",
    price: 2200,
    unit: "fruit",
    rating: 4.9,
    reviews: 62,
    image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=800&q=80",
    seller: "Cross River Fruits Ltd",
    seller_id: "00000000-0000-4000-8000-000000000018",
    location: "Ugep, Cross River State",
    inStock: true,
    in_stock: true,
    stock_quantity: 115,
    created_at: "2026-07-19T10:00:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000020",
    name: "Hand-Shelled Egusi Seeds (Melon Seeds - 1 Paint Bucket)",
    description: "Clean, hand-peeled white egusi melon seeds from Agbani. High oil yield, perfect texture for thick egusi soup.",
    category: "oils_spices",
    price: 18000,
    unit: "paint bucket",
    rating: 4.9,
    reviews: 77,
    image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80",
    seller: "Enugu Agricultural Co-op",
    seller_id: "00000000-0000-4000-8000-000000000019",
    location: "Agbani, Enugu State",
    inStock: true,
    in_stock: true,
    stock_quantity: 70,
    created_at: "2026-07-20T10:00:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000021",
    name: "Cleaned Ogbono Seeds (Dika Nut - 1 Paint Bucket)",
    description: "Wild-harvested, sun-dried dika nuts (Ogbono) from Edo forests. High drawability and rich earthy flavor.",
    category: "oils_spices",
    price: 28000,
    unit: "paint bucket",
    rating: 4.8,
    reviews: 48,
    image: "https://images.unsplash.com/photo-1509358271058-acd05cc93224?auto=format&fit=crop&w=800&q=80",
    seller: "Edo Spice Harvesters",
    seller_id: "00000000-0000-4000-8000-000000000020",
    location: "Auchi, Edo State",
    inStock: true,
    in_stock: true,
    stock_quantity: 40,
    created_at: "2026-07-20T11:00:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000022",
    name: "Fresh Farm Goat (Live Adult Male Balami Goat)",
    description: "Healthy 25kg live Northern Balami goat raised on free pasture. Lean meat, ideal for festive celebrations or pepper soup.",
    category: "livestock",
    price: 55000,
    unit: "head",
    rating: 4.7,
    reviews: 23,
    image: "https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=800&q=80",
    seller: "Sokoto Pastoralists Network",
    seller_id: "00000000-0000-4000-8000-000000000021",
    location: "Tambuwal, Sokoto State",
    inStock: true,
    in_stock: true,
    stock_quantity: 30,
    created_at: "2026-07-20T11:15:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000023",
    name: "Borno Honey Beans (Oloyin Beans - 50kg Bag)",
    description: "Naturally sweet brown honey beans (Oloyin) free from weevils or stones. Cooks soft and fast with rich natural aroma.",
    category: "grains",
    price: 65000,
    unit: "50kg bag",
    rating: 4.9,
    reviews: 86,
    image: "https://images.unsplash.com/photo-1551462147-37885acc36f1?auto=format&fit=crop&w=800&q=80",
    seller: "Maiduguri Grain Exchange",
    seller_id: "00000000-0000-4000-8000-000000000022",
    location: "Maiduguri, Borno State",
    inStock: true,
    in_stock: true,
    stock_quantity: 110,
    created_at: "2026-07-20T11:30:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000024",
    name: "Fresh Carrots (Jos Farm - 10kg Bag)",
    description: "Sweet, crunchy orange carrots harvested from Vom valley greenhouses. High beta-carotene content.",
    category: "vegetables",
    price: 12500,
    unit: "10kg bag",
    rating: 4.6,
    reviews: 29,
    image: "https://images.unsplash.com/photo-1598170845058-12ef4a457939?auto=format&fit=crop&w=800&q=80",
    seller: "Vom Greenhouses",
    seller_id: "00000000-0000-4000-8000-000000000023",
    location: "Vom, Plateau State",
    inStock: true,
    in_stock: true,
    stock_quantity: 85,
    created_at: "2026-07-20T11:45:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000025",
    name: "Fresh Red Tatase Peppers (Bell Peppers - Paint Bucket)",
    description: "Large, thick-walled red bell peppers (Tatase) grown in Ogbomoso. Adds deep red color and rich aroma to stews.",
    category: "vegetables",
    price: 11000,
    unit: "paint bucket",
    rating: 4.8,
    reviews: 44,
    image: "https://images.unsplash.com/photo-1526346698389-224221b4b48d?auto=format&fit=crop&w=800&q=80",
    seller: "Oyo Spice Farms",
    seller_id: "00000000-0000-4000-8000-000000000004",
    location: "Ogbomoso, Oyo State",
    inStock: true,
    in_stock: true,
    stock_quantity: 65,
    created_at: "2026-07-20T12:00:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000026",
    name: "Dried Crayfish (Oron Ground Crayfish - 1 Paint Bucket)",
    description: "100% pure dried coastal crayfish from Akwa Ibom waters. Cleaned, grit-free, and delivers authentic seafood taste.",
    category: "fish_seafood",
    price: 16500,
    unit: "paint bucket",
    rating: 4.9,
    reviews: 91,
    image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80",
    seller: "Akwa Ibom Coastal Fishery",
    seller_id: "00000000-0000-4000-8000-000000000024",
    location: "Eket, Akwa Ibom State",
    inStock: true,
    in_stock: true,
    stock_quantity: 140,
    created_at: "2026-07-20T12:15:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000027",
    name: "Fresh Okra Fingers (1 Large Basket)",
    description: "Tender green okra fingers picked early morning in Badagry. Highly viscous, perfect for Ila Alase soup.",
    category: "vegetables",
    price: 6500,
    unit: "basket",
    rating: 4.5,
    reviews: 18,
    image: "https://images.unsplash.com/photo-1425543103986-224d3f28e2aa?auto=format&fit=crop&w=800&q=80",
    seller: "Badagry Lagoon Farmers",
    seller_id: "00000000-0000-4000-8000-000000000025",
    location: "Badagry, Lagos State",
    inStock: true,
    in_stock: true,
    stock_quantity: 50,
    created_at: "2026-07-20T12:30:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000028",
    name: "Ginger Bulbs (Fresh Yellow Ginger - 10kg Bag)",
    description: "Pungent yellow ginger roots from Kafanchan, Southern Kaduna. High essential oil concentration.",
    category: "oils_spices",
    price: 22500,
    unit: "10kg bag",
    rating: 4.8,
    reviews: 37,
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
    seller: "Southern Kaduna Ginger Co-op",
    seller_id: "00000000-0000-4000-8000-000000000026",
    location: "Kafanchan, Kaduna State",
    inStock: true,
    in_stock: true,
    stock_quantity: 75,
    created_at: "2026-07-20T12:45:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000029",
    name: "Garlic Bulbs (Kano White Garlic - 5kg Sack)",
    description: "Firm white garlic heads grown under sun in Kura, Kano. Strong aroma and medicinal properties.",
    category: "oils_spices",
    price: 14000,
    unit: "5kg sack",
    rating: 4.7,
    reviews: 31,
    image: "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=800&q=80",
    seller: "Kura Farm Association",
    seller_id: "00000000-0000-4000-8000-000000000027",
    location: "Kura, Kano State",
    inStock: true,
    in_stock: true,
    stock_quantity: 90,
    created_at: "2026-07-20T13:00:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000030",
    name: "Sorghum / Guinea Corn (50kg Bag)",
    description: "Red sorghum grains from Azare, Bauchi. Ideal for pap (Ogi/Kunu), brewing, and cereal meal production.",
    category: "grains",
    price: 35000,
    unit: "50kg bag",
    rating: 4.6,
    reviews: 22,
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
    seller: "Bauchi Grain Traders",
    seller_id: "00000000-0000-4000-8000-000000000028",
    location: "Azare, Bauchi State",
    inStock: true,
    in_stock: true,
    stock_quantity: 130,
    created_at: "2026-07-20T13:15:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000031",
    name: "Sweet Yellow Yam Tubers (5 Large Tubers)",
    description: "Golden yellow yam tubers from Wukari, Taraba State. Naturally sweet, firm texture when boiled.",
    category: "tubers",
    price: 21000,
    unit: "5 tubers",
    rating: 4.8,
    reviews: 35,
    image: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=800&q=80",
    seller: "Taraba Yam Belt",
    seller_id: "00000000-0000-4000-8000-000000000029",
    location: "Wukari, Taraba State",
    inStock: true,
    in_stock: true,
    stock_quantity: 60,
    created_at: "2026-07-20T13:30:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000032",
    name: "Fresh Red Shombo Peppers (Chili Pepper - Paint Bucket)",
    description: "Long red cayenne chili peppers (Shombo) picked fresh in Iseyin. Gives lively heat and vivid color to stews.",
    category: "vegetables",
    price: 9000,
    unit: "paint bucket",
    rating: 4.7,
    reviews: 26,
    image: "https://images.unsplash.com/photo-1588252303782-77d3047e700a?auto=format&fit=crop&w=800&q=80",
    seller: "Oyo Spice Farms",
    seller_id: "00000000-0000-4000-8000-000000000004",
    location: "Iseyin, Oyo State",
    inStock: true,
    in_stock: true,
    stock_quantity: 80,
    created_at: "2026-07-20T13:45:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000033",
    name: "Fresh Green Cucumbers (Bag of 50)",
    description: "Crisp, firm green cucumbers cultivated under controlled irrigation in Bukuru. Refreshing taste.",
    category: "vegetables",
    price: 8500,
    unit: "bag of 50",
    rating: 4.6,
    reviews: 20,
    image: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=800&q=80",
    seller: "Jos Valley Vegetable Farms",
    seller_id: "00000000-0000-4000-8000-000000000030",
    location: "Bukuru, Plateau State",
    inStock: true,
    in_stock: true,
    stock_quantity: 75,
    created_at: "2026-07-20T14:00:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000034",
    name: "Fresh Green Cabbage Heads (Bag of 20)",
    description: "Tight, crunchy cabbage heads grown in Jos temperate climate. Perfect for salads and coleslaw.",
    category: "vegetables",
    price: 10000,
    unit: "bag of 20",
    rating: 4.7,
    reviews: 28,
    image: "https://images.unsplash.com/photo-1515471209610-e3b126a58799?auto=format&fit=crop&w=800&q=80",
    seller: "Plateau Green Harvest",
    seller_id: "00000000-0000-4000-8000-000000000003",
    location: "Jos, Plateau State",
    inStock: true,
    in_stock: true,
    stock_quantity: 60,
    created_at: "2026-07-20T14:15:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000035",
    name: "Fresh Irish Potatoes (Jos Potato 50kg Sack)",
    description: "High-grade Irish potato tubers from Pankshin hills. Smooth skin, solid flesh, ideal for french fries.",
    category: "tubers",
    price: 36000,
    unit: "50kg sack",
    rating: 4.8,
    reviews: 55,
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80",
    seller: "Pankshin Potato Producers",
    seller_id: "00000000-0000-4000-8000-000000000031",
    location: "Pankshin, Plateau State",
    inStock: true,
    in_stock: true,
    stock_quantity: 95,
    created_at: "2026-07-20T14:30:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000036",
    name: "Red Sweet Potatoes (50kg Bag)",
    description: "Naturally sweet orange-fleshed sweet potatoes from Ilorin. Packed with vitamins and dietary fiber.",
    category: "tubers",
    price: 24000,
    unit: "50kg bag",
    rating: 4.6,
    reviews: 24,
    image: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=800&q=80",
    seller: "Kwara Agricultural Hub",
    seller_id: "00000000-0000-4000-8000-000000000032",
    location: "Ilorin, Kwara State",
    inStock: true,
    in_stock: true,
    stock_quantity: 80,
    created_at: "2026-07-20T14:45:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000037",
    name: "Pure Groundnut Oil (Refined 25 Liters)",
    description: "Triple-filtered clear peanut oil produced in Kano mills. Cholesterol-free, high smoke point for frying.",
    category: "oils_spices",
    price: 44000,
    unit: "25L jerrycan",
    rating: 4.9,
    reviews: 63,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
    seller: "Kano Oil Mills",
    seller_id: "00000000-0000-4000-8000-000000000033",
    location: "Kano, Kano State",
    inStock: true,
    in_stock: true,
    stock_quantity: 100,
    created_at: "2026-07-20T15:00:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000038",
    name: "Fresh Tilapia Fish (5kg Chilled Pack)",
    description: "Farm-raised fresh tilapia harvested from Jebba dam cages. Cleaned, scaled, and flash-chilled.",
    category: "fish_seafood",
    price: 17500,
    unit: "5kg pack",
    rating: 4.7,
    reviews: 39,
    image: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=800&q=80",
    seller: "Jebba Lake Fisheries",
    seller_id: "00000000-0000-4000-8000-000000000034",
    location: "Jebba, Niger State",
    inStock: true,
    in_stock: true,
    stock_quantity: 50,
    created_at: "2026-07-20T15:15:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000039",
    name: "Live Heavyweight Ram (Northern Grazed Balami Ram)",
    description: "Large 45kg Northern Balami ram raised on open grazing in Daura. Excellent muscle build for ceremonies.",
    category: "livestock",
    price: 140000,
    unit: "head",
    rating: 4.9,
    reviews: 33,
    image: "https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=800&q=80",
    seller: "Katsina Livestock Market",
    seller_id: "00000000-0000-4000-8000-000000000035",
    location: "Daura, Katsina State",
    inStock: true,
    in_stock: true,
    stock_quantity: 25,
    created_at: "2026-07-20T15:30:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000040",
    name: "Fresh Organic Pawpaw (Papaya - Pack of 4 Large)",
    description: "Tree-ripened red-fleshed papaya from Benin City orchards. Sweet, juicy, and rich in digestive enzymes.",
    category: "fruits",
    price: 3800,
    unit: "pack of 4",
    rating: 4.8,
    reviews: 27,
    image: "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?auto=format&fit=crop&w=800&q=80",
    seller: "Edo Tropical Orchards",
    seller_id: "00000000-0000-4000-8000-000000000036",
    location: "Benin City, Edo State",
    inStock: true,
    in_stock: true,
    stock_quantity: 85,
    created_at: "2026-07-20T15:45:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000041",
    name: "Fresh Green Ewedu Leaves (Jute Leaves - Bundle)",
    description: "Freshly harvested jute leaves (Ewedu) from Ogun riverbank farms. Creates smooth, viscous green soup.",
    category: "vegetables",
    price: 1800,
    unit: "bundle",
    rating: 4.8,
    reviews: 40,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    seller: "Ogun Riverbank Farmers",
    seller_id: "00000000-0000-4000-8000-000000000037",
    location: "Abeokuta, Ogun State",
    inStock: true,
    in_stock: true,
    stock_quantity: 100,
    created_at: "2026-07-20T16:00:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000042",
    name: "Fresh Waterleaf (Soft Soup Greens - Bundle)",
    description: "Tender green waterleaf harvested fresh in Uyo. Essential ingredient for Afang and Edikang Ikong soups.",
    category: "vegetables",
    price: 1500,
    unit: "bundle",
    rating: 4.9,
    reviews: 58,
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80",
    seller: "Uyo Vegetable Market",
    seller_id: "00000000-0000-4000-8000-000000000038",
    location: "Uyo, Akwa Ibom State",
    inStock: true,
    in_stock: true,
    stock_quantity: 110,
    created_at: "2026-07-20T16:15:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000043",
    name: "Fresh Hass Avocados (10 Pieces Pack)",
    description: "Creamy, buttery Hass avocados grown on the Mambilla Plateau. Rich in healthy monounsaturated fats.",
    category: "fruits",
    price: 4500,
    unit: "10 pcs pack",
    rating: 4.7,
    reviews: 32,
    image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80",
    seller: "Mambilla Highland Orchards",
    seller_id: "00000000-0000-4000-8000-000000000039",
    location: "Gembu, Taraba State",
    inStock: true,
    in_stock: true,
    stock_quantity: 70,
    created_at: "2026-07-20T16:30:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000044",
    name: "Fresh Mangoes (Ogbomoso Kerosene Mangoes - 50 Pcs Basket)",
    description: "Famous Ogbomoso sweet mangoes packed in traditional basket. Extremely sweet pulp and high juice content.",
    category: "fruits",
    price: 8000,
    unit: "basket",
    rating: 4.9,
    reviews: 65,
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80",
    seller: "Ogbomoso Fruit Co-op",
    seller_id: "00000000-0000-4000-8000-000000000040",
    location: "Ogbomoso, Oyo State",
    inStock: true,
    in_stock: true,
    stock_quantity: 60,
    created_at: "2026-07-20T16:45:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000045",
    name: "Dried Stockfish Cod (Original Norwegian Stockfish Cut - 1kg)",
    description: "Premium grade Norwegian stockfish cod cuts imported via Onitsha. Thick flesh, rich traditional flavor.",
    category: "fish_seafood",
    price: 26000,
    unit: "1kg pack",
    rating: 4.8,
    reviews: 49,
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    seller: "Onitsha Main Market Importers",
    seller_id: "00000000-0000-4000-8000-000000000041",
    location: "Onitsha, Anambra State",
    inStock: true,
    in_stock: true,
    stock_quantity: 80,
    created_at: "2026-07-20T17:00:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000046",
    name: "Local Ofada Brown Rice (Unpolished - 50kg Bag)",
    description: "Authentic short-grain Ofada brown rice from Ogun State. Naturally processed, nutrient-dense with distinct aroma.",
    category: "grains",
    price: 68000,
    unit: "50kg bag",
    rating: 4.9,
    reviews: 73,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
    seller: "Ofada Rice Millers",
    seller_id: "00000000-0000-4000-8000-000000000042",
    location: "Ofada, Ogun State",
    inStock: true,
    in_stock: true,
    stock_quantity: 90,
    created_at: "2026-07-20T17:15:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000047",
    name: "Millet Grain (Bajra - 50kg Bag)",
    description: "Cleaned pearl millet grains harvested in Damaturu, Yobe State. High fiber, ideal for kunu and porridge.",
    category: "grains",
    price: 32000,
    unit: "50kg bag",
    rating: 4.6,
    reviews: 25,
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
    seller: "Yobe Cereal Producers",
    seller_id: "00000000-0000-4000-8000-000000000043",
    location: "Damaturu, Yobe State",
    inStock: true,
    in_stock: true,
    stock_quantity: 110,
    created_at: "2026-07-20T17:30:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000048",
    name: "Cocoyam Tubers (Ede - 1 Bag)",
    description: "Fresh cocoyam tubers from Abakaliki, Ebonyi State. High starch quality, perfect thickener for Ofe Oha soup.",
    category: "tubers",
    price: 19500,
    unit: "bag",
    rating: 4.7,
    reviews: 29,
    image: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=800&q=80",
    seller: "Ebonyi Tubers Farmers",
    seller_id: "00000000-0000-4000-8000-000000000044",
    location: "Abakaliki, Ebonyi State",
    inStock: true,
    in_stock: true,
    stock_quantity: 65,
    created_at: "2026-07-20T17:45:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000049",
    name: "Fresh Beef Meat (Chunk Portion 5kg)",
    description: "Freshly dressed grass-fed beef cut into chunks at Bodija abattoir. Inspected by veterinary officers.",
    category: "livestock",
    price: 22000,
    unit: "5kg pack",
    rating: 4.8,
    reviews: 61,
    image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=800&q=80",
    seller: "Bodija Meat Abattoir",
    seller_id: "00000000-0000-4000-8000-000000000045",
    location: "Ibadan, Oyo State",
    inStock: true,
    in_stock: true,
    stock_quantity: 80,
    created_at: "2026-07-20T18:00:00Z",
  },
  {
    id: "a1b2c3d4-0000-4000-8000-000000000050",
    name: "Live Layer Chickens (Old Layers - Pair)",
    description: "Healthy spent layer hens weighing 2.2kg each. Tender meat suitable for stew or pepper soup.",
    category: "livestock",
    price: 11000,
    unit: "pair",
    rating: 4.7,
    reviews: 38,
    image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80",
    seller: "Sunshine Poultry Farms",
    seller_id: "00000000-0000-4000-8000-000000000007",
    location: "Abeokuta, Ogun State",
    inStock: true,
    in_stock: true,
    stock_quantity: 90,
    created_at: "2026-07-20T18:15:00Z",
  },
];

export const productService = {
  /**
   * Helper to automatically seed Supabase database if empty
   */
  async ensureSeeded(): Promise<void> {
    try {
      const dbSeedPayload = INITIAL_MOCK_PRODUCTS.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description || "",
        category: p.category,
        price: p.price,
        unit: p.unit,
        rating: p.rating,
        reviews: p.reviews,
        image: p.image,
        seller: p.seller,
        location: p.location || "",
        in_stock: p.inStock ?? p.in_stock ?? true,
        stock_quantity: p.stock_quantity ?? 50,
        created_at: p.created_at,
      }));

      const { error } = await supabase
        .from("products")
        .upsert(dbSeedPayload, { onConflict: "id" });

      if (error) {
        console.warn("Auto-seeding products notice:", error.message);
      }
    } catch (e) {
      console.warn("Auto-seeding exception:", e);
    }
  },

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
        if (isUUID(params.sellerId)) {
          query = query.eq("seller_id", params.sellerId);
        } else {
          query = query.eq("seller", params.sellerId);
        }
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

      if (params.location) {
        query = query.ilike("location", `%${params.location}%`);
      }

      if (params.minRating !== undefined) {
        query = query.gte("rating", params.minRating);
      }

      if (params.featured) {
        query = query.gte("rating", 4.7);
      }

      if (params.searchQuery) {
        query = query.or(
          `name.ilike.%${params.searchQuery}%,description.ilike.%${params.searchQuery}%,seller.ilike.%${params.searchQuery}%,category.ilike.%${params.searchQuery}%`
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
          case "best_selling":
            query = query.order("reviews", { ascending: false });
            break;
          case "name_asc":
            query = query.order("name", { ascending: true });
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

      // If database is empty, seed it automatically and re-run query
      if (!error && (!data || data.length === 0)) {
        await this.ensureSeeded();
        const reQueryResult = await query;
        if (reQueryResult.data && reQueryResult.data.length > 0) {
          return reQueryResult.data.map((item) => ({
            ...item,
            inStock: item.in_stock ?? item.inStock ?? true,
            reviews: item.reviews ?? item.reviews_count ?? 0,
          }));
        }
      }

      if (error || !data) {
        console.warn("Supabase query error:", error?.message);
        return this.filterMockProducts(INITIAL_MOCK_PRODUCTS, params);
      }

      return data.map((item) => ({
        ...item,
        inStock: item.in_stock ?? item.inStock ?? true,
        reviews: item.reviews ?? item.reviews_count ?? 0,
      }));
    } catch (err: unknown) {
      console.warn("Error fetching products", err);
      return this.filterMockProducts(INITIAL_MOCK_PRODUCTS, params);
    }
  },

  /**
   * Helper to filter mock products fallback if database offline
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
      result = result.filter((p) => (p.inStock !== false && p.in_stock !== false) === params.inStock);
    }

    if (params.location) {
      const loc = params.location.toLowerCase();
      result = result.filter((p) => p.location && p.location.toLowerCase().includes(loc));
    }

    if (params.minRating !== undefined) {
      result = result.filter((p) => (p.rating ?? 5.0) >= params.minRating!);
    }

    if (params.minPrice !== undefined) {
      result = result.filter((p) => p.price >= params.minPrice!);
    }

    if (params.maxPrice !== undefined) {
      result = result.filter((p) => p.price <= params.maxPrice!);
    }

    if (params.featured) {
      result = result.filter((p) => p.rating >= 4.7 || (p.stock_quantity ?? 0) >= 50);
    }

    if (params.searchQuery) {
      const q = params.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.seller.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.location && p.location.toLowerCase().includes(q)) ||
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
        case "best_selling":
          result.sort((a, b) => (b.reviews ?? b.reviews_count ?? 0) - (a.reviews ?? a.reviews_count ?? 0));
          break;
        case "name_asc":
          result.sort((a, b) => a.name.localeCompare(b.name));
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
    if (!id) return null;
    try {
      if (isUUID(id)) {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (!error && data) {
          return {
            ...data,
            inStock: data.in_stock ?? data.inStock ?? true,
            reviews: data.reviews ?? data.reviews_count ?? 0,
          };
        }
      }

      // If not found in DB or non-UUID, check local dataset
      const mockMatch = INITIAL_MOCK_PRODUCTS.find((p) => p.id === id);
      return mockMatch || null;
    } catch (err: unknown) {
      console.warn("Error fetching product by ID", err);
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
        seller_id: isUUID(input.seller_id) ? input.seller_id : null,
        location: input.location ?? "",
        in_stock: input.inStock ?? input.in_stock ?? true,
        rating: 5.0,
        reviews: 1,
      };

      const { data, error } = await supabase
        .from("products")
        .insert([dbPayload])
        .select()
        .single();

      if (error) {
        console.error("Error creating product in Supabase:", error.message);
        throw new Error(`Failed to create product: ${error.message}`);
      }

      return {
        ...data,
        inStock: data.in_stock ?? true,
        reviews: data.reviews ?? 0,
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

      if (isUUID(id)) {
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
          reviews: data.reviews ?? 0,
        };
      }

      throw new Error("Invalid product ID format");
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
      if (isUUID(id)) {
        const { error } = await supabase.from("products").delete().eq("id", id);

        if (error) {
          console.error("Error deleting product:", error.message);
          throw new Error(`Failed to delete product: ${error.message}`);
        }

        return true;
      }
      return false;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error("An unexpected error occurred while deleting product.", { cause: err });
    }
  },
};
