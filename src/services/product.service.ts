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
    name: "Kano Super White Rice (50kg Bag)",
    description: "Parboiled long-grain white rice harvested directly from Kano irrigation fields. Stone-free, highly aromatic, and perfect for household cooking or commercial catering.",
    category: "grains",
    price: 78000,
    unit: "50kg bag",
    rating: 4.9,
    reviews: 64,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
    seller: "Alhaji Danladi Grains",
    seller_id: "seller-1",
    location: "Kano, Kano State",
    inStock: true,
    in_stock: true,
    stock_quantity: 120,
    created_at: "2026-07-01T10:00:00Z",
  },
  {
    id: "2",
    name: "Benue Fresh White Yam Tubers (5 Large Tubers)",
    description: "Organically cultivated heavy white yams harvested from the fertile soils of Gboko, Benue State. Excellent starch quality, ideal for pounded yam or boiling.",
    category: "tubers",
    price: 18500,
    unit: "5 tubers",
    rating: 4.8,
    reviews: 42,
    image: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=800&q=80",
    seller: "Gboko Yam Farmers Co-op",
    seller_id: "seller-2",
    location: "Gboko, Benue State",
    inStock: true,
    in_stock: true,
    stock_quantity: 85,
    created_at: "2026-07-02T10:00:00Z",
  },
  {
    id: "3",
    name: "Jos Fresh Plum Tomatoes (Big Basket)",
    description: "Sun-ripened red plum tomatoes harvested fresh from Plateau State highlands. Firm, juicy, and low seed content, ideal for stew and paste preparation.",
    category: "vegetables",
    price: 24000,
    unit: "big basket",
    rating: 4.7,
    reviews: 58,
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
    seller: "Plateau Green Harvest",
    seller_id: "seller-3",
    location: "Jos, Plateau State",
    inStock: true,
    in_stock: true,
    stock_quantity: 50,
    created_at: "2026-07-03T10:00:00Z",
  },
  {
    id: "4",
    name: "Fresh Red Habanero Peppers (Ata Rodo - Paint Bucket)",
    description: "Extremely spicy and aromatic red habanero peppers picked fresh daily from Ibadan farms. Rich flavor and deep crimson color.",
    category: "vegetables",
    price: 9500,
    unit: "paint bucket",
    rating: 4.8,
    reviews: 36,
    image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80",
    seller: "Oyo Spice Farms",
    seller_id: "seller-4",
    location: "Ibadan, Oyo State",
    inStock: true,
    in_stock: true,
    stock_quantity: 90,
    created_at: "2026-07-04T10:00:00Z",
  },
  {
    id: "5",
    name: "Kano Dry Yellow Onions (50kg Bag)",
    description: "Well-cured dry yellow onions from Bichi, Kano. High shelf-life, pungent flavor, and firm layers suitable for long storage and commercial transport.",
    category: "vegetables",
    price: 42000,
    unit: "50kg bag",
    rating: 4.6,
    reviews: 29,
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80",
    seller: "Bichi Agro Traders",
    seller_id: "seller-5",
    location: "Kano, Kano State",
    inStock: true,
    in_stock: true,
    stock_quantity: 65,
    created_at: "2026-07-05T10:00:00Z",
  },
  {
    id: "6",
    name: "Pure Unrefined Red Palm Oil (25 Liters)",
    description: "100% pure unadulterated red palm oil extracted naturally in Nsukka. Free from additives or artificial coloring, rich in Vitamin A.",
    category: "oils_spices",
    price: 32500,
    unit: "25L jerrycan",
    rating: 4.9,
    reviews: 81,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
    seller: "Nsukka Oil Palm Estates",
    seller_id: "seller-6",
    location: "Nsukka, Enugu State",
    inStock: true,
    in_stock: true,
    stock_quantity: 110,
    created_at: "2026-07-06T10:00:00Z",
  },
  {
    id: "7",
    name: "Farm Fresh Jumbo Eggs (Crate of 30)",
    description: "Clean, brown-shelled jumbo eggs laid by free-range poultry fed with organic grain mash. Rich golden yolk.",
    category: "dairy",
    price: 4200,
    unit: "crate",
    rating: 4.9,
    reviews: 94,
    image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=800&q=80",
    seller: "Sunshine Poultry Farms",
    seller_id: "seller-7",
    location: "Abeokuta, Ogun State",
    inStock: true,
    in_stock: true,
    stock_quantity: 200,
    created_at: "2026-07-07T10:00:00Z",
  },
  {
    id: "8",
    name: "Live Heavyweight Broiler Chicken (Full Grown)",
    description: "Healthy 3.5kg live broiler chicken raised in hygienic conditions with natural feeds. Vaccinated and ready for dressing.",
    category: "livestock",
    price: 9800,
    unit: "head",
    rating: 4.8,
    reviews: 45,
    image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80",
    seller: "Sunshine Poultry Farms",
    seller_id: "seller-7",
    location: "Abeokuta, Ogun State",
    inStock: true,
    in_stock: true,
    stock_quantity: 75,
    created_at: "2026-07-08T10:00:00Z",
  },
  {
    id: "9",
    name: "Oron Dried Smoked Catfish (Pack of 10)",
    description: "Oven-dried premium catfish smoked with natural hardwood. Thoroughly dried, stone-free, and rich in natural smoky aroma.",
    category: "fish_seafood",
    price: 14000,
    unit: "pack of 10",
    rating: 4.9,
    reviews: 52,
    image: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=800&q=80",
    seller: "Calabar Marine Products",
    seller_id: "seller-8",
    location: "Oron, Akwa Ibom State",
    inStock: true,
    in_stock: true,
    stock_quantity: 60,
    created_at: "2026-07-09T10:00:00Z",
  },
  {
    id: "10",
    name: "Sweet Benue Oranges (100 Pieces Sack)",
    description: "Juicy, naturally sweet Valencia oranges harvested from Makurdi orchards. High juice content and refreshing flavor.",
    category: "fruits",
    price: 12000,
    unit: "100 pcs sack",
    rating: 4.7,
    reviews: 33,
    image: "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=800&q=80",
    seller: "Makurdi Citrus Growers",
    seller_id: "seller-9",
    location: "Makurdi, Benue State",
    inStock: true,
    in_stock: true,
    stock_quantity: 40,
    created_at: "2026-07-10T10:00:00Z",
  },
  {
    id: "11",
    name: "Ripe Cavendish Bananas (Big Bunch)",
    description: "Freshly harvested naturally ripened Cavendish bananas from Ondo orchards. Sweet, plump, and perfect for smoothies or snacks.",
    category: "fruits",
    price: 5500,
    unit: "bunch",
    rating: 4.6,
    reviews: 27,
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",
    seller: "Ondo Fruit Orchards",
    seller_id: "seller-10",
    location: "Ondo, Ondo State",
    inStock: true,
    in_stock: true,
    stock_quantity: 90,
    created_at: "2026-07-11T10:00:00Z",
  },
  {
    id: "12",
    name: "Fresh Raw Cassava Roots (100kg Bag)",
    description: "Freshly harvested high-yield TME 419 cassava roots from Ijebu plantations. Ideal for garri, fufu, or starch processing.",
    category: "tubers",
    price: 22000,
    unit: "100kg bag",
    rating: 4.5,
    reviews: 21,
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
    seller: "Ijebu Cassava Processors",
    seller_id: "seller-11",
    location: "Ijebu-Ode, Ogun State",
    inStock: true,
    in_stock: true,
    stock_quantity: 70,
    created_at: "2026-07-12T10:00:00Z",
  },
  {
    id: "13",
    name: "Kaduna Dry Yellow Maize (50kg Bag)",
    description: "Sun-dried yellow corn grains from Zaria farms. Clean, moisture-tested, and perfect for livestock feed or cornmeal.",
    category: "grains",
    price: 38000,
    unit: "50kg bag",
    rating: 4.7,
    reviews: 38,
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80",
    seller: "Zaria Grain Merchants",
    seller_id: "seller-12",
    location: "Zaria, Kaduna State",
    inStock: true,
    in_stock: true,
    stock_quantity: 150,
    created_at: "2026-07-13T10:00:00Z",
  },
  {
    id: "14",
    name: "Fresh Green Ugwu Leaves (Fluted Pumpkin - Large Bundle)",
    description: "Freshly cut organic fluted pumpkin leaves (Ugwu) from Epe riverbanks. Deep green, nutrient-packed, ideal for soups.",
    category: "vegetables",
    price: 2500,
    unit: "bundle",
    rating: 4.9,
    reviews: 72,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    seller: "Epe Green Farms",
    seller_id: "seller-13",
    location: "Epe, Lagos State",
    inStock: true,
    in_stock: true,
    stock_quantity: 130,
    created_at: "2026-07-14T10:00:00Z",
  },
  {
    id: "15",
    name: "Ogun Unripe Plantain (Big Bunch)",
    description: "Firm green unripe plantains harvested from Sagamu plantain groves. Ideal for plantain flour or fried dodo chips.",
    category: "fruits",
    price: 6800,
    unit: "bunch",
    rating: 4.8,
    reviews: 41,
    image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=800&q=80",
    seller: "Remo Plantain Plantations",
    seller_id: "seller-14",
    location: "Sagamu, Ogun State",
    inStock: true,
    in_stock: true,
    stock_quantity: 80,
    created_at: "2026-07-15T10:00:00Z",
  },
  {
    id: "16",
    name: "Hand-Picked Raw Groundnuts / Peanuts (10kg Bag)",
    description: "Clean, dry raw groundnut pods harvested in Funtua, Katsina. Excellent oil content and crisp crunch when roasted.",
    category: "grains",
    price: 16000,
    unit: "10kg bag",
    rating: 4.6,
    reviews: 19,
    image: "https://images.unsplash.com/photo-1567892320421-1c657571ea48?auto=format&fit=crop&w=800&q=80",
    seller: "Katsina Nut Harvest",
    seller_id: "seller-15",
    location: "Funtua, Katsina State",
    inStock: true,
    in_stock: true,
    stock_quantity: 100,
    created_at: "2026-07-16T10:00:00Z",
  },
  {
    id: "17",
    name: "Jigawa Fresh Watermelon (Extra Large Single Fruit)",
    description: "Extra large, super sweet crimson watermelon cultivated in Dutse irrigation zone. Deep red flesh and refreshing taste.",
    category: "fruits",
    price: 3500,
    unit: "fruit",
    rating: 4.7,
    reviews: 50,
    image: "https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=800&q=80",
    seller: "Jigawa Melon Farms",
    seller_id: "seller-16",
    location: "Dutse, Jigawa State",
    inStock: true,
    in_stock: true,
    stock_quantity: 95,
    created_at: "2026-07-17T10:00:00Z",
  },
  {
    id: "18",
    name: "Smoked Mangala Fish (Pack of 5)",
    description: "Traditional dry-smoked Mangala fish from Lake Chad region. Rich flavor profile for native soups and stews.",
    category: "fish_seafood",
    price: 11500,
    unit: "pack",
    rating: 4.8,
    reviews: 34,
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    seller: "Lake Chad Artisanal Fishery",
    seller_id: "seller-17",
    location: "Maiduguri, Borno State",
    inStock: true,
    in_stock: true,
    stock_quantity: 45,
    created_at: "2026-07-18T10:00:00Z",
  },
  {
    id: "19",
    name: "Fresh Sweet Pineapple (Large Unit)",
    description: "Sugarloaf variety sweet pineapple from Cross River State. Golden yellow flesh with exceptional natural aroma.",
    category: "fruits",
    price: 2200,
    unit: "fruit",
    rating: 4.9,
    reviews: 62,
    image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=800&q=80",
    seller: "Cross River Fruits Ltd",
    seller_id: "seller-18",
    location: "Ugep, Cross River State",
    inStock: true,
    in_stock: true,
    stock_quantity: 115,
    created_at: "2026-07-19T10:00:00Z",
  },
  {
    id: "20",
    name: "Hand-Shelled Egusi Seeds (Melon Seeds - 1 Paint Bucket)",
    description: "Clean, hand-peeled white egusi melon seeds from Agbani. High oil yield, perfect texture for thick egusi soup.",
    category: "oils_spices",
    price: 18000,
    unit: "paint bucket",
    rating: 4.9,
    reviews: 77,
    image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80",
    seller: "Enugu Agricultural Co-op",
    seller_id: "seller-19",
    location: "Agbani, Enugu State",
    inStock: true,
    in_stock: true,
    stock_quantity: 70,
    created_at: "2026-07-20T10:00:00Z",
  },
  {
    id: "21",
    name: "Cleaned Ogbono Seeds (Dika Nut - 1 Paint Bucket)",
    description: "Wild-harvested, sun-dried dika nuts (Ogbono) from Edo forests. High drawability and rich earthy flavor.",
    category: "oils_spices",
    price: 28000,
    unit: "paint bucket",
    rating: 4.8,
    reviews: 48,
    image: "https://images.unsplash.com/photo-1509358271058-acd05cc93224?auto=format&fit=crop&w=800&q=80",
    seller: "Edo Spice Harvesters",
    seller_id: "seller-20",
    location: "Auchi, Edo State",
    inStock: true,
    in_stock: true,
    stock_quantity: 40,
    created_at: "2026-07-20T11:00:00Z",
  },
  {
    id: "22",
    name: "Fresh Farm Goat (Live Adult Male Balami Goat)",
    description: "Healthy 25kg live Northern Balami goat raised on free pasture. Lean meat, ideal for festive celebrations or pepper soup.",
    category: "livestock",
    price: 55000,
    unit: "head",
    rating: 4.7,
    reviews: 23,
    image: "https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=800&q=80",
    seller: "Sokoto Pastoralists Network",
    seller_id: "seller-21",
    location: "Tambuwal, Sokoto State",
    inStock: true,
    in_stock: true,
    stock_quantity: 30,
    created_at: "2026-07-20T11:15:00Z",
  },
  {
    id: "23",
    name: "Borno Honey Beans (Oloyin Beans - 50kg Bag)",
    description: "Naturally sweet brown honey beans (Oloyin) free from weevils or stones. Cooks soft and fast with rich natural aroma.",
    category: "grains",
    price: 65000,
    unit: "50kg bag",
    rating: 4.9,
    reviews: 86,
    image: "https://images.unsplash.com/photo-1551462147-37885acc36f1?auto=format&fit=crop&w=800&q=80",
    seller: "Maiduguri Grain Exchange",
    seller_id: "seller-22",
    location: "Maiduguri, Borno State",
    inStock: true,
    in_stock: true,
    stock_quantity: 110,
    created_at: "2026-07-20T11:30:00Z",
  },
  {
    id: "24",
    name: "Fresh Carrots (Jos Farm - 10kg Bag)",
    description: "Sweet, crunchy orange carrots harvested from Vom valley greenhouses. High beta-carotene content.",
    category: "vegetables",
    price: 12500,
    unit: "10kg bag",
    rating: 4.6,
    reviews: 29,
    image: "https://images.unsplash.com/photo-1598170845058-12ef4a457939?auto=format&fit=crop&w=800&q=80",
    seller: "Vom Greenhouses",
    seller_id: "seller-23",
    location: "Vom, Plateau State",
    inStock: true,
    in_stock: true,
    stock_quantity: 85,
    created_at: "2026-07-20T11:45:00Z",
  },
  {
    id: "25",
    name: "Fresh Red Tatase Peppers (Bell Peppers - Paint Bucket)",
    description: "Large, thick-walled red bell peppers (Tatase) grown in Ogbomoso. Adds deep red color and rich aroma to stews.",
    category: "vegetables",
    price: 11000,
    unit: "paint bucket",
    rating: 4.8,
    reviews: 44,
    image: "https://images.unsplash.com/photo-1526346698389-224221b4b48d?auto=format&fit=crop&w=800&q=80",
    seller: "Oyo Spice Farms",
    seller_id: "seller-4",
    location: "Ogbomoso, Oyo State",
    inStock: true,
    in_stock: true,
    stock_quantity: 65,
    created_at: "2026-07-20T12:00:00Z",
  },
  {
    id: "26",
    name: "Dried Crayfish (Oron Ground Crayfish - 1 Paint Bucket)",
    description: "100% pure dried coastal crayfish from Akwa Ibom waters. Cleaned, grit-free, and delivers authentic seafood taste.",
    category: "fish_seafood",
    price: 16500,
    unit: "paint bucket",
    rating: 4.9,
    reviews: 91,
    image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80",
    seller: "Akwa Ibom Coastal Fishery",
    seller_id: "seller-24",
    location: "Eket, Akwa Ibom State",
    inStock: true,
    in_stock: true,
    stock_quantity: 140,
    created_at: "2026-07-20T12:15:00Z",
  },
  {
    id: "27",
    name: "Fresh Okra Fingers (1 Large Basket)",
    description: "Tender green okra fingers picked early morning in Badagry. Highly viscous, perfect for Ila Alase soup.",
    category: "vegetables",
    price: 6500,
    unit: "basket",
    rating: 4.5,
    reviews: 18,
    image: "https://images.unsplash.com/photo-1425543103986-224d3f28e2aa?auto=format&fit=crop&w=800&q=80",
    seller: "Badagry Lagoon Farmers",
    seller_id: "seller-25",
    location: "Badagry, Lagos State",
    inStock: true,
    in_stock: true,
    stock_quantity: 50,
    created_at: "2026-07-20T12:30:00Z",
  },
  {
    id: "28",
    name: "Ginger Bulbs (Fresh Yellow Ginger - 10kg Bag)",
    description: "Pungent yellow ginger roots from Kafanchan, Southern Kaduna. High essential oil concentration.",
    category: "oils_spices",
    price: 22500,
    unit: "10kg bag",
    rating: 4.8,
    reviews: 37,
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
    seller: "Southern Kaduna Ginger Co-op",
    seller_id: "seller-26",
    location: "Kafanchan, Kaduna State",
    inStock: true,
    in_stock: true,
    stock_quantity: 75,
    created_at: "2026-07-20T12:45:00Z",
  },
  {
    id: "29",
    name: "Garlic Bulbs (Kano White Garlic - 5kg Sack)",
    description: "Firm white garlic heads grown under sun in Kura, Kano. Strong aroma and medicinal properties.",
    category: "oils_spices",
    price: 14000,
    unit: "5kg sack",
    rating: 4.7,
    reviews: 31,
    image: "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=800&q=80",
    seller: "Kura Farm Association",
    seller_id: "seller-27",
    location: "Kura, Kano State",
    inStock: true,
    in_stock: true,
    stock_quantity: 90,
    created_at: "2026-07-20T13:00:00Z",
  },
  {
    id: "30",
    name: "Sorghum / Guinea Corn (50kg Bag)",
    description: "Red sorghum grains from Azare, Bauchi. Ideal for pap (Ogi/Kunu), brewing, and cereal meal production.",
    category: "grains",
    price: 35000,
    unit: "50kg bag",
    rating: 4.6,
    reviews: 22,
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
    seller: "Bauchi Grain Traders",
    seller_id: "seller-28",
    location: "Azare, Bauchi State",
    inStock: true,
    in_stock: true,
    stock_quantity: 130,
    created_at: "2026-07-20T13:15:00Z",
  },
  {
    id: "31",
    name: "Sweet Yellow Yam Tubers (5 Large Tubers)",
    description: "Golden yellow yam tubers from Wukari, Taraba State. Naturally sweet, firm texture when boiled.",
    category: "tubers",
    price: 21000,
    unit: "5 tubers",
    rating: 4.8,
    reviews: 35,
    image: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=800&q=80",
    seller: "Taraba Yam Belt",
    seller_id: "seller-29",
    location: "Wukari, Taraba State",
    inStock: true,
    in_stock: true,
    stock_quantity: 60,
    created_at: "2026-07-20T13:30:00Z",
  },
  {
    id: "32",
    name: "Fresh Red Shombo Peppers (Chili Pepper - Paint Bucket)",
    description: "Long red cayenne chili peppers (Shombo) picked fresh in Iseyin. Gives lively heat and vivid color to stews.",
    category: "vegetables",
    price: 9000,
    unit: "paint bucket",
    rating: 4.7,
    reviews: 26,
    image: "https://images.unsplash.com/photo-1588252303782-77d3047e700a?auto=format&fit=crop&w=800&q=80",
    seller: "Oyo Spice Farms",
    seller_id: "seller-4",
    location: "Iseyin, Oyo State",
    inStock: true,
    in_stock: true,
    stock_quantity: 80,
    created_at: "2026-07-20T13:45:00Z",
  },
  {
    id: "33",
    name: "Fresh Green Cucumbers (Bag of 50)",
    description: "Crisp, firm green cucumbers cultivated under controlled irrigation in Bukuru. Refreshing taste.",
    category: "vegetables",
    price: 8500,
    unit: "bag of 50",
    rating: 4.6,
    reviews: 20,
    image: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=800&q=80",
    seller: "Jos Valley Vegetable Farms",
    seller_id: "seller-30",
    location: "Bukuru, Plateau State",
    inStock: true,
    in_stock: true,
    stock_quantity: 75,
    created_at: "2026-07-20T14:00:00Z",
  },
  {
    id: "34",
    name: "Fresh Green Cabbage Heads (Bag of 20)",
    description: "Tight, crunchy cabbage heads grown in Jos temperate climate. Perfect for salads and coleslaw.",
    category: "vegetables",
    price: 10000,
    unit: "bag of 20",
    rating: 4.7,
    reviews: 28,
    image: "https://images.unsplash.com/photo-1515471209610-e3b126a58799?auto=format&fit=crop&w=800&q=80",
    seller: "Plateau Green Harvest",
    seller_id: "seller-3",
    location: "Jos, Plateau State",
    inStock: true,
    in_stock: true,
    stock_quantity: 60,
    created_at: "2026-07-20T14:15:00Z",
  },
  {
    id: "35",
    name: "Fresh Irish Potatoes (Jos Potato 50kg Sack)",
    description: "High-grade Irish potato tubers from Pankshin hills. Smooth skin, solid flesh, ideal for french fries.",
    category: "tubers",
    price: 36000,
    unit: "50kg sack",
    rating: 4.8,
    reviews: 55,
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80",
    seller: "Pankshin Potato Producers",
    seller_id: "seller-31",
    location: "Pankshin, Plateau State",
    inStock: true,
    in_stock: true,
    stock_quantity: 95,
    created_at: "2026-07-20T14:30:00Z",
  },
  {
    id: "36",
    name: "Red Sweet Potatoes (50kg Bag)",
    description: "Naturally sweet orange-fleshed sweet potatoes from Ilorin. Packed with vitamins and dietary fiber.",
    category: "tubers",
    price: 24000,
    unit: "50kg bag",
    rating: 4.6,
    reviews: 24,
    image: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=800&q=80",
    seller: "Kwara Agricultural Hub",
    seller_id: "seller-32",
    location: "Ilorin, Kwara State",
    inStock: true,
    in_stock: true,
    stock_quantity: 80,
    created_at: "2026-07-20T14:45:00Z",
  },
  {
    id: "37",
    name: "Pure Groundnut Oil (Refined 25 Liters)",
    description: "Triple-filtered clear peanut oil produced in Kano mills. Cholesterol-free, high smoke point for frying.",
    category: "oils_spices",
    price: 44000,
    unit: "25L jerrycan",
    rating: 4.9,
    reviews: 63,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
    seller: "Kano Oil Mills",
    seller_id: "seller-33",
    location: "Kano, Kano State",
    inStock: true,
    in_stock: true,
    stock_quantity: 100,
    created_at: "2026-07-20T15:00:00Z",
  },
  {
    id: "38",
    name: "Fresh Tilapia Fish (5kg Chilled Pack)",
    description: "Farm-raised fresh tilapia harvested from Jebba dam cages. Cleaned, scaled, and flash-chilled.",
    category: "fish_seafood",
    price: 17500,
    unit: "5kg pack",
    rating: 4.7,
    reviews: 39,
    image: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=800&q=80",
    seller: "Jebba Lake Fisheries",
    seller_id: "seller-34",
    location: "Jebba, Niger State",
    inStock: true,
    in_stock: true,
    stock_quantity: 50,
    created_at: "2026-07-20T15:15:00Z",
  },
  {
    id: "39",
    name: "Live Heavyweight Ram (Northern Grazed Balami Ram)",
    description: "Large 45kg Northern Balami ram raised on open grazing in Daura. Excellent muscle build for ceremonies.",
    category: "livestock",
    price: 140000,
    unit: "head",
    rating: 4.9,
    reviews: 33,
    image: "https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=800&q=80",
    seller: "Katsina Livestock Market",
    seller_id: "seller-35",
    location: "Daura, Katsina State",
    inStock: true,
    in_stock: true,
    stock_quantity: 25,
    created_at: "2026-07-20T15:30:00Z",
  },
  {
    id: "40",
    name: "Fresh Organic Pawpaw (Papaya - Pack of 4 Large)",
    description: "Tree-ripened red-fleshed papaya from Benin City orchards. Sweet, juicy, and rich in digestive enzymes.",
    category: "fruits",
    price: 3800,
    unit: "pack of 4",
    rating: 4.8,
    reviews: 27,
    image: "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?auto=format&fit=crop&w=800&q=80",
    seller: "Edo Tropical Orchards",
    seller_id: "seller-36",
    location: "Benin City, Edo State",
    inStock: true,
    in_stock: true,
    stock_quantity: 85,
    created_at: "2026-07-20T15:45:00Z",
  },
  {
    id: "41",
    name: "Fresh Green Ewedu Leaves (Jute Leaves - Bundle)",
    description: "Freshly harvested jute leaves (Ewedu) from Ogun riverbank farms. Creates smooth, viscous green soup.",
    category: "vegetables",
    price: 1800,
    unit: "bundle",
    rating: 4.8,
    reviews: 40,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    seller: "Ogun Riverbank Farmers",
    seller_id: "seller-37",
    location: "Abeokuta, Ogun State",
    inStock: true,
    in_stock: true,
    stock_quantity: 100,
    created_at: "2026-07-20T16:00:00Z",
  },
  {
    id: "42",
    name: "Fresh Waterleaf (Soft Soup Greens - Bundle)",
    description: "Tender green waterleaf harvested fresh in Uyo. Essential ingredient for Afang and Edikang Ikong soups.",
    category: "vegetables",
    price: 1500,
    unit: "bundle",
    rating: 4.9,
    reviews: 58,
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80",
    seller: "Uyo Vegetable Market",
    seller_id: "seller-38",
    location: "Uyo, Akwa Ibom State",
    inStock: true,
    in_stock: true,
    stock_quantity: 110,
    created_at: "2026-07-20T16:15:00Z",
  },
  {
    id: "43",
    name: "Fresh Hass Avocados (10 Pieces Pack)",
    description: "Creamy, buttery Hass avocados grown on the Mambilla Plateau. Rich in healthy monounsaturated fats.",
    category: "fruits",
    price: 4500,
    unit: "10 pcs pack",
    rating: 4.7,
    reviews: 32,
    image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80",
    seller: "Mambilla Highland Orchards",
    seller_id: "seller-39",
    location: "Gembu, Taraba State",
    inStock: true,
    in_stock: true,
    stock_quantity: 70,
    created_at: "2026-07-20T16:30:00Z",
  },
  {
    id: "44",
    name: "Fresh Mangoes (Ogbomoso Kerosene Mangoes - 50 Pcs Basket)",
    description: "Famous Ogbomoso sweet mangoes packed in traditional basket. Extremely sweet pulp and high juice content.",
    category: "fruits",
    price: 8000,
    unit: "basket",
    rating: 4.9,
    reviews: 65,
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80",
    seller: "Ogbomoso Fruit Co-op",
    seller_id: "seller-40",
    location: "Ogbomoso, Oyo State",
    inStock: true,
    in_stock: true,
    stock_quantity: 60,
    created_at: "2026-07-20T16:45:00Z",
  },
  {
    id: "45",
    name: "Dried Stockfish Cod (Original Norwegian Stockfish Cut - 1kg)",
    description: "Premium grade Norwegian stockfish cod cuts imported via Onitsha. Thick flesh, rich traditional flavor.",
    category: "fish_seafood",
    price: 26000,
    unit: "1kg pack",
    rating: 4.8,
    reviews: 49,
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    seller: "Onitsha Main Market Importers",
    seller_id: "seller-41",
    location: "Onitsha, Anambra State",
    inStock: true,
    in_stock: true,
    stock_quantity: 80,
    created_at: "2026-07-20T17:00:00Z",
  },
  {
    id: "46",
    name: "Local Ofada Brown Rice (Unpolished - 50kg Bag)",
    description: "Authentic short-grain Ofada brown rice from Ogun State. Naturally processed, nutrient-dense with distinct aroma.",
    category: "grains",
    price: 68000,
    unit: "50kg bag",
    rating: 4.9,
    reviews: 73,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
    seller: "Ofada Rice Millers",
    seller_id: "seller-42",
    location: "Ofada, Ogun State",
    inStock: true,
    in_stock: true,
    stock_quantity: 90,
    created_at: "2026-07-20T17:15:00Z",
  },
  {
    id: "47",
    name: "Millet Grain (Bajra - 50kg Bag)",
    description: "Cleaned pearl millet grains harvested in Damaturu, Yobe State. High fiber, ideal for kunu and porridge.",
    category: "grains",
    price: 32000,
    unit: "50kg bag",
    rating: 4.6,
    reviews: 25,
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
    seller: "Yobe Cereal Producers",
    seller_id: "seller-43",
    location: "Damaturu, Yobe State",
    inStock: true,
    in_stock: true,
    stock_quantity: 110,
    created_at: "2026-07-20T17:30:00Z",
  },
  {
    id: "48",
    name: "Cocoyam Tubers (Ede - 1 Bag)",
    description: "Fresh cocoyam tubers from Abakaliki, Ebonyi State. High starch quality, perfect thickener for Ofe Oha soup.",
    category: "tubers",
    price: 19500,
    unit: "bag",
    rating: 4.7,
    reviews: 29,
    image: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=800&q=80",
    seller: "Ebonyi Tubers Farmers",
    seller_id: "seller-44",
    location: "Abakaliki, Ebonyi State",
    inStock: true,
    in_stock: true,
    stock_quantity: 65,
    created_at: "2026-07-20T17:45:00Z",
  },
  {
    id: "49",
    name: "Fresh Beef Meat (Chunk Portion 5kg)",
    description: "Freshly dressed grass-fed beef cut into chunks at Bodija abattoir. Inspected by veterinary officers.",
    category: "livestock",
    price: 22000,
    unit: "5kg pack",
    rating: 4.8,
    reviews: 61,
    image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=800&q=80",
    seller: "Bodija Meat Abattoir",
    seller_id: "seller-45",
    location: "Ibadan, Oyo State",
    inStock: true,
    in_stock: true,
    stock_quantity: 80,
    created_at: "2026-07-20T18:00:00Z",
  },
  {
    id: "50",
    name: "Live Layer Chickens (Old Layers - Pair)",
    description: "Healthy spent layer hens weighing 2.2kg each. Tender meat suitable for stew or pepper soup.",
    category: "livestock",
    price: 11000,
    unit: "pair",
    rating: 4.7,
    reviews: 38,
    image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80",
    seller: "Sunshine Poultry Farms",
    seller_id: "seller-7",
    location: "Abeokuta, Ogun State",
    inStock: true,
    in_stock: true,
    stock_quantity: 90,
    created_at: "2026-07-20T18:15:00Z",
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
