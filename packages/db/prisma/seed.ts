/* eslint-disable no-console */
import { Prisma, PrismaClient } from '@prisma/client';

/**
 * VELORA seed — deterministic by design.
 *
 * A fixed PRNG seed means every developer sees the same catalogue, the same
 * order history and the same analytics, which makes screenshots, demos and
 * snapshot tests comparable across machines.
 *
 * Run with: pnpm db:seed   (requires PostgreSQL + a pushed schema)
 */
const prisma = new PrismaClient();

const NOW = new Date('2026-11-10T09:00:00.000Z');
const MINUTE = 60_000;
const DAY = 86_400_000;
const ago = (days: number) => new Date(NOW.getTime() - days * DAY);
const minutesAgo = (minutes: number) => new Date(NOW.getTime() - minutes * MINUTE);
const ahead = (days: number) => new Date(NOW.getTime() + days * DAY);

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(20261110);

function must<T>(value: T | undefined): T {
  if (value === undefined) throw new Error('[seed] unexpected undefined — data table is inconsistent');
  return value;
}

const pick = <T>(list: readonly T[]): T => must(list[Math.floor(rng() * list.length)]);
const intBetween = (min: number, max: number) => min + Math.floor(rng() * (max - min + 1));
const roundRupee = (paise: number) => Math.round(paise / 100) * 100;

function pickSome<T>(list: readonly T[], count: number): T[] {
  const pool = [...list];
  const out: T[] = [];
  for (let i = 0; i < Math.min(count, pool.length); i += 1) {
    const [item] = pool.splice(Math.floor(rng() * pool.length), 1);
    out.push(must(item));
  }
  return out;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const INTERACTION_TYPES = [
  'IMPRESSION',
  'VIEW',
  'PRODUCT_TAP',
  'SAVE',
  'ADD_TO_CART',
  'PURCHASE',
  'SEARCH',
] as const;

// =============================================================================
// Constant data — the shape of the fictional marketplace
// =============================================================================

interface CategoryNode {
  slug: string;
  name: string;
  children: { slug: string; name: string }[];
}

const CATEGORY_TREE: CategoryNode[] = [
  {
    slug: 'fashion',
    name: 'Fashion',
    children: [
      { slug: 'footwear', name: 'Footwear' },
      { slug: 'bags', name: 'Bags & Accessories' },
      { slug: 'eyewear', name: 'Eyewear' },
    ],
  },
  {
    slug: 'home',
    name: 'Home & Living',
    children: [
      { slug: 'lighting', name: 'Lighting' },
      { slug: 'furniture', name: 'Furniture' },
      { slug: 'textiles', name: 'Textiles' },
      { slug: 'ceramics', name: 'Ceramics & Tableware' },
      { slug: 'plants', name: 'Plants' },
    ],
  },
  {
    slug: 'tech',
    name: 'Tech',
    children: [
      { slug: 'audio', name: 'Audio' },
      { slug: 'wearables', name: 'Wearables' },
    ],
  },
  {
    slug: 'beauty',
    name: 'Beauty',
    children: [
      { slug: 'skincare', name: 'Skincare' },
      { slug: 'fragrance', name: 'Fragrance' },
    ],
  },
  {
    slug: 'everyday',
    name: 'Everyday',
    children: [
      { slug: 'kitchen', name: 'Kitchen' },
      { slug: 'stationery', name: 'Stationery' },
    ],
  },
  {
    slug: 'quick',
    name: 'Quick Essentials',
    children: [
      { slug: 'produce', name: 'Fresh Produce' },
      { slug: 'dairy', name: 'Dairy & Eggs' },
      { slug: 'snacks', name: 'Snacks' },
      { slug: 'beverages', name: 'Beverages' },
      { slug: 'care', name: 'Personal Care' },
      { slug: 'homecare', name: 'Home Care' },
    ],
  },
];

interface SellerSeed {
  key: string;
  storeName: string;
  handle: string;
  ownerName: string;
  commissionBps: number;
}

const SELLERS: SellerSeed[] = [
  { key: 'aureli', storeName: 'Aureli Studio', handle: 'aurelistudio', ownerName: 'Aureli Kapoor', commissionBps: 1100 },
  { key: 'sonar', storeName: 'Sonar Audio', handle: 'sonaraudio', ownerName: 'Ravi Bhat', commissionBps: 900 },
  { key: 'serein', storeName: 'Serein Atelier', handle: 'sereinatelier', ownerName: 'Noor Sheikh', commissionBps: 1400 },
  { key: 'botanica', storeName: 'Botanica Labs', handle: 'botanicalabs', ownerName: 'Ira Dutta', commissionBps: 1300 },
  { key: 'copperline', storeName: 'Copperline House', handle: 'copperlinehouse', ownerName: 'Dev Menon', commissionBps: 1200 },
  { key: 'quick', storeName: 'Velora Quick', handle: 'veloraquick', ownerName: 'Kavya Rao', commissionBps: 800 },
];

interface CreatorSeed {
  id: string;
  name: string;
  handle: string;
  niche: string;
  followerCount: number;
}

const CREATORS: CreatorSeed[] = [
  { id: 'usr_creator_aria', name: 'Aria Menon', handle: 'ariamenon', niche: 'minimal styling', followerCount: 486_300 },
  { id: 'usr_creator_dev', name: 'Dev Anand', handle: 'devbuilds', niche: 'desk & gear', followerCount: 214_800 },
  { id: 'usr_creator_meher', name: 'Meher Kapadia', handle: 'mehermakes', niche: 'home rituals', followerCount: 132_400 },
  { id: 'usr_creator_ishaan', name: 'Ishaan Roy', handle: 'ishaanruns', niche: 'running & recovery', followerCount: 98_700 },
  { id: 'usr_creator_tara', name: 'Tara Iyer', handle: 'taraskin', niche: 'skin & scent', followerCount: 305_100 },
  { id: 'usr_creator_zed', name: 'Zed Fernandes', handle: 'zedframes', niche: 'film photography', followerCount: 77_900 },
];

interface ShopperSeed {
  id: string;
  name: string;
  handle: string;
  city: string;
  isPlus: boolean;
}

const SHOPPERS: ShopperSeed[] = [
  { id: 'usr_shopper_ananya', name: 'Ananya Bose', handle: 'ananyab', city: 'Bengaluru', isPlus: true },
  { id: 'usr_shopper_vikram', name: 'Vikram Nair', handle: 'vikramn', city: 'Bengaluru', isPlus: true },
  { id: 'usr_shopper_sara', name: 'Sara Qureshi', handle: 'saraq', city: 'Bengaluru', isPlus: false },
  { id: 'usr_shopper_rohit', name: 'Rohit Shetty', handle: 'rohits', city: 'Bengaluru', isPlus: true },
  { id: 'usr_shopper_priya', name: 'Priya Raman', handle: 'priyar', city: 'Bengaluru', isPlus: false },
  { id: 'usr_shopper_karthik', name: 'Karthik Reddy', handle: 'karthikr', city: 'Bengaluru', isPlus: false },
];

const RIDER_SEED = [
  { id: 'usr_rider_arun', name: 'Arun Pillai', handle: 'arunpillai', deliveries: 1842, rating: 4.9, lat: 12.9721, lng: 77.6398 },
  { id: 'usr_rider_neha', name: 'Neha Jadhav', handle: 'nehaj', deliveries: 964, rating: 4.8, lat: 12.9361, lng: 77.6261 },
  { id: 'usr_rider_sameer', name: 'Sameer Khan', handle: 'sameerk', deliveries: 2310, rating: 4.7, lat: 12.9135, lng: 77.6461 },
];

const DARK_STORES = [
  { id: 'store_indiranagar', name: 'Velora Dark Store · Indiranagar', code: 'BLR-IND-01', address: '12th Main, Indiranagar', pincode: '560038', lat: 12.9719, lng: 77.6412 },
  { id: 'store_koramangala', name: 'Velora Dark Store · Koramangala', code: 'BLR-KOR-02', address: '80 Feet Road, Koramangala 4th Block', pincode: '560034', lat: 12.9352, lng: 77.6245 },
  { id: 'store_hsr', name: 'Velora Dark Store · HSR', code: 'BLR-HSR-03', address: '27th Main, HSR Layout', pincode: '560102', lat: 12.9121, lng: 77.6446 },
  { id: 'store_jayanagar', name: 'Velora Dark Store · Jayanagar', code: 'BLR-JAY-04', address: '11th Main, Jayanagar 4th Block', pincode: '560011', lat: 12.9308, lng: 77.5838 },
  { id: 'store_whitefield', name: 'Velora Dark Store · Whitefield', code: 'BLR-WHF-05', address: 'ITPL Main Road, Whitefield', pincode: '560066', lat: 12.9698, lng: 77.75 },
];

interface CollectionSeed {
  key: string;
  categorySlug: string;
  brand: string;
  sellerKey: string;
  quick: boolean;
  priceRange: [number, number];
  items: string[];
  highlights: string[];
}

const MARKET_SUFFIXES = ['', 'Edition 2'];
const QUICK_SUFFIXES = ['', 'Family Pack'];

const COLLECTIONS: CollectionSeed[] = [
  {
    key: 'produce',
    categorySlug: 'produce',
    brand: 'Farmly',
    sellerKey: 'quick',
    quick: true,
    priceRange: [1_500, 25_000],
    highlights: ['Harvested within 24 hours', 'Zero-waste packaging', 'Cold chain from farm to door'],
    items: ['Alphonso Mangoes', 'Baby Spinach', 'Cherry Tomatoes', 'Hass Avocado', 'Thai Basil', 'Seedless Grapes', 'Broccoli Florets', 'Button Mushrooms', 'Baby Corn', 'Red Bell Peppers', 'English Cucumber', 'Pomegranate Arils', 'Spring Onion Bunch'],
  },
  {
    key: 'dairy',
    categorySlug: 'dairy',
    brand: 'Milkrun',
    sellerKey: 'quick',
    quick: true,
    priceRange: [2_500, 45_000],
    highlights: ['Farm-to-store in 6 hours', 'No preservatives', 'Hormone-free herds'],
    items: ['Toned Milk 1 L', 'Farm Eggs 6', 'Greek Yoghurt 400 g', 'Salted Butter 100 g', 'Paneer Block 200 g', 'Fresh Cream 200 ml', 'Curd Tub 500 g', 'Cheddar Slices', 'Almond Milk 1 L', 'Ghee 500 ml', 'Mozzarella 200 g', 'Buttermilk 500 ml', 'Lassi 200 ml'],
  },
  {
    key: 'snacks',
    categorySlug: 'snacks',
    brand: 'Crisp Co.',
    sellerKey: 'quick',
    quick: true,
    priceRange: [2_000, 45_000],
    highlights: ['Small-batch fried', 'No palm oil', 'Resealable packs'],
    items: ['Sea Salt Potato Chips', 'Chilli Lime Makhana', 'Dark Chocolate 70%', 'Roasted Almonds 200 g', 'Butter Cookies', 'Peanut Protein Bar', 'Banana Chips', 'Trail Mix 250 g', 'Peri Peri Puffs', 'Coconut Bites', 'Multigrain Crackers', 'Jaggery Cookies', 'Wasabi Peas'],
  },
  {
    key: 'beverages',
    categorySlug: 'beverages',
    brand: 'Coldbrew Co.',
    sellerKey: 'quick',
    quick: true,
    priceRange: [4_000, 60_000],
    highlights: ['Single-origin beans', 'No added sugar', 'Canned at source'],
    items: ['Cold Brew Can 250 ml', 'Sparkling Water 500 ml', 'Tender Coconut 300 ml', 'Green Tea Bags 25', 'Orange Juice 1 L', 'Kombucha Ginger 300 ml', 'Filter Coffee 250 g', 'Energy Drink 250 ml', 'Iced Tea Peach 500 ml', 'Mineral Water 1 L', 'Aam Panna 250 ml', 'Hot Chocolate Mix', 'Lemonade 500 ml'],
  },
  {
    key: 'care',
    categorySlug: 'care',
    brand: 'Ritual',
    sellerKey: 'quick',
    quick: true,
    priceRange: [9_900, 79_900],
    highlights: ['Dermatologist tested', 'Fragrance-free options', 'Recyclable tube'],
    items: ['Charcoal Face Wash', 'SPF 50 Sunscreen', 'Argan Hair Oil', 'Bamboo Toothbrush', 'Aloe Body Lotion', 'Sheet Mask', 'Lip Balm', 'Hand Sanitiser 100 ml', 'Deodorant Stick', 'Shampoo Bar', 'Cotton Pads', 'Body Wash 250 ml', 'Under-eye Roller'],
  },
  {
    key: 'homecare',
    categorySlug: 'homecare',
    brand: 'Tidy',
    sellerKey: 'quick',
    quick: true,
    priceRange: [8_900, 49_900],
    highlights: ['Plant-derived surfactants', 'Safe on septic tanks', 'Concentrated formula'],
    items: ['Dishwash Gel 750 ml', 'Laundry Pods 20', 'Floor Cleaner 1 L', 'Kitchen Towels 2', 'Garbage Bags 30', 'Glass Cleaner 500 ml', 'Mop Refill', 'Air Freshener', 'Toilet Cleaner 500 ml', 'Fabric Conditioner 1 L', 'Scrub Sponge 3', 'Furniture Polish', 'Drain Cleaner 500 ml'],
  },
  {
    key: 'lighting',
    categorySlug: 'lighting',
    brand: 'Aureli',
    sellerKey: 'aureli',
    quick: false,
    priceRange: [349_000, 2_499_000],
    highlights: ['Hand-finished aluminium', 'Warm dimmable LED', 'Five-year warranty'],
    items: ['Aura Lamp 02', 'Halo Pendant', 'Arc Floor Lamp', 'Paper Moon Sconce', 'Orb Desk Light', 'Linear Wall Bar', 'Cove Ceiling Light', 'Ember Table Lamp', 'Vega Track Spot', 'Nimbus Ring Light', 'Sol Pendant Mini', 'Lumen Floor Wash', 'Dusk Night Lamp'],
  },
  {
    key: 'furniture',
    categorySlug: 'furniture',
    brand: 'Nordwell',
    sellerKey: 'aureli',
    quick: false,
    priceRange: [899_000, 8_990_000],
    highlights: ['Solid ash frame', 'Ten-year structural warranty', 'Tool-free assembly'],
    items: ['Atlas Lounge Chair', 'Sable Side Table', 'Loft Bookshelf', 'Drift Sofa', 'Cove Bench', 'Muse Writing Desk', 'Ridge Low Stool', 'Haven Bed Frame', 'Vault Cabinet', 'Plume Armchair', 'Terra Console', 'Fold Study Table', 'Quiet Daybed'],
  },
  {
    key: 'audio',
    categorySlug: 'audio',
    brand: 'Sonar',
    sellerKey: 'sonar',
    quick: false,
    priceRange: [249_000, 8_999_000],
    highlights: ['Hybrid ANC', 'USB-C lossless', 'Two-year warranty'],
    items: ['Aero Buds Pro', 'Studio Cans 900', 'Pebble Speaker', 'Turntable One', 'Soundbar Slim', 'Clip Mic', 'Field Recorder', 'Boom Mic Stand', 'Mini Sub', 'Wireless Dock', 'In-ear Monitors', 'Vinyl Care Kit', 'Acoustic Panel Set'],
  },
  {
    key: 'wearables',
    categorySlug: 'wearables',
    brand: 'Halo',
    sellerKey: 'sonar',
    quick: false,
    priceRange: [799_000, 4_599_000],
    highlights: ['Sapphire crystal', 'Seven-day battery', '100 m water resistance'],
    items: ['Chrono 04 Watch', 'Pulse Band', 'Solar Field Watch', 'Moonphase Classic', 'Trail GPS Watch', 'Dive Chrono', 'Slim Dress Watch', 'Smart Ring', 'Titanium Bracelet', 'Analog Skeleton', 'Altimeter Watch', 'Compass Watch', 'Strap Set'],
  },
  {
    key: 'bags',
    categorySlug: 'bags',
    brand: 'Serein',
    sellerKey: 'serein',
    quick: false,
    priceRange: [249_000, 1_299_000],
    highlights: ['Full-grain leather', 'Lifetime repairs', 'Hand-stitched edges'],
    items: ['Serein Tote', 'Mini Crossbody', 'Weekender Duffel', 'Leather Card Case', 'Camera Sling', 'Bucket Bag', 'Slim Laptop Sleeve', 'Fold Belt Bag', 'Market Basket', 'Passport Wallet', 'Drawstring Pouch', 'Clutch Nocturne', 'Key Clip'],
  },
  {
    key: 'footwear',
    categorySlug: 'footwear',
    brand: 'Lumen',
    sellerKey: 'serein',
    quick: false,
    priceRange: [399_000, 1_599_000],
    highlights: ['Recycled knit upper', 'Carbon-plate option', 'Free size exchange'],
    items: ['Lumen Runner', 'Court Low', 'Trail Grip', 'Studio Slip-on', 'Hiker Mid', 'Cloud Sandal', 'Derby Classic', 'Chelsea Boot', 'Canvas Plim', 'Recovery Slide', 'Race Flat', 'Knit Trainer', 'Mule Shearling'],
  },
  {
    key: 'ceramics',
    categorySlug: 'ceramics',
    brand: 'Kiln',
    sellerKey: 'aureli',
    quick: false,
    priceRange: [49_900, 399_000],
    highlights: ['Stoneware, food safe', 'Dishwasher friendly', 'Each piece unique'],
    items: ['Matte Dinner Plate', 'Ripple Mug', 'Speckled Bowl', 'Serving Platter', 'Espresso Cup Set', 'Vase Cylinder', 'Butter Dish', 'Salad Bowl', 'Tea Pot', 'Spice Cellar', 'Pourer Jug', 'Candle Holder', 'Planter Footed'],
  },
  {
    key: 'fragrance',
    categorySlug: 'fragrance',
    brand: 'Maison Ina',
    sellerKey: 'botanica',
    quick: false,
    priceRange: [129_000, 1_199_000],
    highlights: ['Cold-pressed naturals', 'IFRA compliant', 'Refillable flacon'],
    items: ['Nocturne EDP', 'Fig Leaf Cologne', 'Amber Room Mist', 'Vetiver Candle', 'Cedar Diffuser', 'Neroli Roll-on', 'Smoke & Salt EDP', 'Linen Water', 'Rose Absolute Oil', 'Oud Discovery Set', 'Citrus Cologne', 'Incense Sticks', 'Travel Atomiser'],
  },
  {
    key: 'textiles',
    categorySlug: 'textiles',
    brand: 'Threadwork',
    sellerKey: 'serein',
    quick: false,
    priceRange: [79_900, 1_299_000],
    highlights: ['European flax', 'Stonewashed softness', 'Fair-trade weaving'],
    items: ['Linen Duvet Cover', 'Waffle Throw', 'Handloom Runner', 'Velvet Cushion', 'Cotton Flat Sheet', 'Wool Rug', 'Muslin Curtain', 'Kitchen Apron', 'Bedcover Kantha', 'Bath Towel', 'Cushion Cover Set', 'Table Runner', 'Quilt Lightweight'],
  },
  {
    key: 'skincare',
    categorySlug: 'skincare',
    brand: 'Botanica',
    sellerKey: 'botanica',
    quick: false,
    priceRange: [39_900, 249_000],
    highlights: ['Clinical-grade actives', 'Fragrance-free', 'Recyclable glass'],
    items: ['Dew Serum', 'Barrier Cream', 'Clay Mask', 'Rosewater Toner', 'Overnight Peel', 'Eye Gel', 'Cleansing Balm', 'SPF Gel 40', 'Hydrating Mist', 'Body Oil', 'Lip Mask', 'Exfoliating Pads', 'Repair Ampoule'],
  },
  {
    key: 'kitchen',
    categorySlug: 'kitchen',
    brand: 'Copperline',
    sellerKey: 'copperline',
    quick: false,
    priceRange: [89_900, 899_000],
    highlights: ['Tin-lined copper', 'Lifetime re-tinning', 'Chef tested'],
    items: ['Copper Kettle', 'Stoneware Pot', 'Cast Pan 24', 'Chef Knife', 'Pour-over Set', 'Spice Jar Set', 'Oak Board', 'Mortar Pestle', 'Measuring Set', 'Milk Frother', 'Rolling Pin', 'Serving Tongs', 'Oil Cruet'],
  },
  {
    key: 'stationery',
    categorySlug: 'stationery',
    brand: 'Papier',
    sellerKey: 'copperline',
    quick: false,
    priceRange: [19_900, 199_900],
    highlights: ['100 gsm fountain-pen paper', 'Lay-flat binding', 'Made in India'],
    items: ['Dot Grid Notebook', 'Fountain Pen', 'Brass Ruler', 'Weekly Planner', 'Ink Set', 'Leather Journal', 'Mechanical Pencil', 'Desk Tray', 'Letterpress Cards', 'Bookmark Set', 'Wax Seal Kit', 'Sketchbook A5', 'Pen Case'],
  },
  {
    key: 'plants',
    categorySlug: 'plants',
    brand: 'Greenhouse',
    sellerKey: 'copperline',
    quick: false,
    priceRange: [29_900, 399_000],
    highlights: ['Nursery-grown', 'Includes care card', 'Safe packaging'],
    items: ['Monstera Deliciosa', 'Fiddle Leaf Fig', 'Snake Plant', 'Terracotta Pot', 'Ceropegia Chain', 'Pothos Marble', 'Rubber Fig', 'ZZ Plant', 'Self-watering Planter', 'Plant Food', 'Mister Bottle', 'Pebble Tray', 'Propagation Set'],
  },
  {
    key: 'eyewear',
    categorySlug: 'eyewear',
    brand: 'Vista',
    sellerKey: 'serein',
    quick: false,
    priceRange: [89_900, 599_000],
    highlights: ['Italian acetate', 'Polarised option', 'Free lens fitting'],
    items: ['Aviator Frame', 'Round Acetate', 'Cat-eye Noir', 'Blue-light Glasses', 'Titanium Rimless', 'Sport Shield', 'Clear Lens Wayfarer', 'Fold Reader', 'Oversized Square', 'Micro Round', 'Clip-on Shades', 'Reading Half-rim', 'Kids Flex Frame'],
  },
];

const BOARD_SEED = [
  { id: 'board_quiet_light', title: 'Quiet Light', slug: 'quiet-light', description: 'Warm lamps, paper shades, dusk energy.' },
  { id: 'board_desk_2027', title: 'Desk 2027', slug: 'desk-2027', description: 'A calmer setup for deep work.' },
  { id: 'board_beach_wedding', title: 'Beach wedding', slug: 'beach-wedding', description: 'Linen, sand tones, one perfect tote.' },
  { id: 'board_ten_minute_dinners', title: 'Ten-minute dinners', slug: 'ten-minute-dinners', description: 'Everything that fits in one quick box.' },
  { id: 'board_sunday_reset', title: 'Sunday reset', slug: 'sunday-reset', description: 'Cleaning, candles, clean sheets.' },
  { id: 'board_running_kit', title: 'Running kit', slug: 'running-kit', description: 'Mileage, recovery, and the shoes in between.' },
];

const COUPON_SEED = [
  { id: 'coup_first10', code: 'FIRST10', type: 'PERCENT', value: 10, minSpend: 0, maxDiscount: 50000 },
  { id: 'coup_quick49', code: 'QUICK49', type: 'FLAT', value: 4900, minSpend: 19900, maxDiscount: null },
  { id: 'coup_freeship', code: 'FREESHIP', type: 'FREE_DELIVERY', value: 0, minSpend: 29900, maxDiscount: null },
  { id: 'coup_glow15', code: 'GLOW15', type: 'PERCENT', value: 15, minSpend: 99900, maxDiscount: 150000 },
] as const;

// =============================================================================
// Wipe — children before parents, so foreign keys stay satisfied
// =============================================================================

async function wipe() {
  await prisma.$transaction([
    prisma.refund.deleteMany(),
    prisma.returnRequest.deleteMany(),
    prisma.review.deleteMany(),
    prisma.payment.deleteMany(),
    prisma.shipment.deleteMany(),
    prisma.deliveryAssignment.deleteMany(),
    prisma.orderEvent.deleteMany(),
    prisma.orderItem.deleteMany(),
    prisma.couponRedemption.deleteMany(),
    prisma.order.deleteMany(),
    prisma.cartItem.deleteMany(),
    prisma.cart.deleteMany(),
    prisma.wishlistItem.deleteMany(),
    prisma.priceForecast.deleteMany(),
    prisma.priceSnapshot.deleteMany(),
    prisma.reviewSummary.deleteMany(),
    prisma.postProductTag.deleteMany(),
    prisma.postMedia.deleteMany(),
    prisma.postLike.deleteMany(),
    prisma.commentLike.deleteMany(),
    prisma.comment.deleteMany(),
    prisma.savedPost.deleteMany(),
    prisma.boardItem.deleteMany(),
    prisma.boardCollaborator.deleteMany(),
    prisma.board.deleteMany(),
    prisma.storyView.deleteMany(),
    prisma.story.deleteMany(),
    prisma.message.deleteMany(),
    prisma.conversationParticipant.deleteMany(),
    prisma.conversation.deleteMany(),
    prisma.post.deleteMany(),
    prisma.storeInventory.deleteMany(),
    prisma.smartSubstitution.deleteMany(),
    prisma.rider.deleteMany(),
    prisma.darkStore.deleteMany(),
    prisma.productVariant.deleteMany(),
    prisma.productImage.deleteMany(),
    prisma.product.deleteMany(),
    prisma.brand.deleteMany(),
    prisma.category.deleteMany(),
    prisma.membership.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.address.deleteMany(),
    prisma.follow.deleteMany(),
    prisma.pushToken.deleteMany(),
    prisma.refreshToken.deleteMany(),
    prisma.oAuthAccount.deleteMany(),
    prisma.adminAuditLog.deleteMany(),
    prisma.affiliateLink.deleteMany(),
    prisma.payout.deleteMany(),
    prisma.seller.deleteMany(),
    prisma.creatorProfile.deleteMany(),
    prisma.reorderSuggestion.deleteMany(),
    prisma.visualSearchRequest.deleteMany(),
    prisma.assistantMessage.deleteMany(),
    prisma.assistantThread.deleteMany(),
    prisma.searchQuery.deleteMany(),
    prisma.feedImpression.deleteMany(),
    prisma.analyticsEvent.deleteMany(),
    prisma.report.deleteMany(),
    prisma.riskSignal.deleteMany(),
    prisma.coupon.deleteMany(),
    prisma.user.deleteMany(),
  ]);
}

// =============================================================================
// Identity
// =============================================================================

interface SeedContext {
  adminId: string;
  creatorIds: string[];
  shopperIds: string[];
  riderIds: string[];
  sellerByKey: Record<string, string>;
  storeIds: string[];
}

async function seedIdentity(): Promise<SeedContext> {
  const adminId = 'usr_admin_velora';

  const users: Prisma.UserCreateManyInput[] = [
    {
      id: adminId,
      email: 'admin@velora.app',
      name: 'Vela Rao',
      handle: 'velora',
      bio: 'Platform operator.',
      role: 'ADMIN',
      isVerified: true,
      avatarUrl: 'https://picsum.photos/seed/velora-admin/200/200',
      createdAt: ago(420),
    },
  ];

  for (const creator of CREATORS) {
    users.push({
      id: creator.id,
      email: `${creator.handle}@creators.velora.app`,
      name: creator.name,
      handle: creator.handle,
      bio: `${creator.niche} · shoppable stories`,
      role: 'CREATOR',
      isVerified: creator.followerCount > 150_000,
      avatarUrl: `https://picsum.photos/seed/${creator.handle}/200/200`,
      coverUrl: `https://picsum.photos/seed/${creator.handle}-cover/1200/400`,
      createdAt: ago(360),
    });
  }

  for (const shopper of SHOPPERS) {
    users.push({
      id: shopper.id,
      email: `${shopper.handle}@velora.app`,
      phone: `+9198${intBetween(10_000_000, 99_999_999)}`,
      name: shopper.name,
      handle: shopper.handle,
      role: 'USER',
      avatarUrl: `https://picsum.photos/seed/${shopper.handle}/200/200`,
      createdAt: ago(intBetween(30, 300)),
    });
  }

  for (const rider of RIDER_SEED) {
    users.push({
      id: rider.id,
      email: `${rider.handle}@riders.velora.app`,
      name: rider.name,
      handle: rider.handle,
      role: 'RIDER',
      isVerified: true,
      avatarUrl: `https://picsum.photos/seed/${rider.handle}/200/200`,
      createdAt: ago(200),
    });
  }

  for (const seller of SELLERS) {
    users.push({
      id: `usr_seller_${seller.key}`,
      email: `owner@${seller.handle}.velora.app`,
      name: seller.ownerName,
      handle: `${seller.handle}.ops`,
      role: 'SELLER',
      isVerified: true,
      avatarUrl: `https://picsum.photos/seed/${seller.handle}/200/200`,
      createdAt: ago(300),
    });
  }

  await prisma.user.createMany({ data: users });

  // Follow graph: shoppers follow a few creators, creators follow each other.
  const follows: Prisma.FollowCreateManyInput[] = [];
  for (const shopper of SHOPPERS) {
    for (const creator of pickSome(CREATORS, intBetween(2, 4))) {
      follows.push({ followerId: shopper.id, followingId: creator.id, createdAt: ago(intBetween(1, 120)) });
    }
  }
  for (const creator of CREATORS) {
    for (const other of pickSome(CREATORS.filter((c) => c.id !== creator.id), 2)) {
      follows.push({ followerId: creator.id, followingId: other.id, createdAt: ago(intBetween(5, 200)) });
    }
  }
  await prisma.follow.createMany({ data: follows, skipDuplicates: true });

  await prisma.creatorProfile.createMany({
    data: CREATORS.map((creator, index) => ({
      id: `crp_${creator.handle}`,
      userId: creator.id,
      niche: creator.niche,
      about: `${creator.name} builds shoppable ${creator.niche} stories on VELORA.`,
      isAffiliate: true,
      affiliateCode: `${creator.handle.toUpperCase().slice(0, 8)}${index}`,
      followerCount: creator.followerCount,
      totalEarnings: creator.followerCount * intBetween(4, 14),
      monthlyEarnings: creator.followerCount * intBetween(1, 3),
    })),
  });

  const sellerByKey: Record<string, string> = {};
  const sellerRows: Prisma.SellerCreateManyInput[] = SELLERS.map((seller) => {
    const id = `slr_${seller.key}`;
    sellerByKey[seller.key] = id;
    return {
      id,
      userId: `usr_seller_${seller.key}`,
      storeName: seller.storeName,
      slug: seller.handle,
      description: `${seller.storeName} — part of the VELORA marketplace.`,
      logoUrl: `https://picsum.photos/seed/${seller.handle}-logo/240/240`,
      rating: Number((4.3 + rng() * 0.6).toFixed(2)),
      ratingCount: intBetween(120, 9_400),
      status: 'VERIFIED',
      commissionBps: seller.commissionBps,
      createdAt: ago(300),
    };
  });
  await prisma.seller.createMany({ data: sellerRows });

  await prisma.rider.createMany({
    data: RIDER_SEED.map((rider) => ({
      id: `rdr_${rider.handle}`,
      userId: rider.id,
      vehicle: 'BIKE',
      licenseNumber: `KA01-${intBetween(1000, 9999)}`,
      status: 'AVAILABLE',
      rating: rider.rating,
      deliveriesCount: rider.deliveries,
      currentLat: rider.lat,
      currentLng: rider.lng,
      lastPingAt: minutesAgo(2),
      createdAt: ago(200),
    })),
  });

  await prisma.darkStore.createMany({
    data: DARK_STORES.map((store) => ({
      id: store.id,
      name: store.name,
      code: store.code,
      address: store.address,
      city: 'Bengaluru',
      pincode: store.pincode,
      lat: store.lat,
      lng: store.lng,
      radiusKm: 2.5,
      capacity: 4000,
      isActive: true,
    })),
  });

  await prisma.address.createMany({
    data: SHOPPERS.map((shopper, index) => ({
      id: `adr_${shopper.handle}`,
      userId: shopper.id,
      label: index % 2 === 0 ? 'Home' : 'Work',
      recipientName: shopper.name,
      phone: `+9198${intBetween(10_000_000, 99_999_999)}`,
      line1: `${intBetween(1, 90)}, ${pick(['12th Main', '80 Feet Road', '27th Main', 'Sarjapur Road', 'Church Street'])}`,
      line2: pick(['Near Metro', 'Above the bakery', 'Gate 2', 'Opposite the park']),
      city: shopper.city,
      state: 'Karnataka',
      pincode: pick(['560038', '560034', '560102', '560011', '560066']),
      country: 'IN',
      lat: 12.93 + rng() * 0.06,
      lng: 77.6 + rng() * 0.12,
      isDefault: true,
      createdAt: ago(120),
    })),
  });

  await prisma.membership.createMany({
    data: SHOPPERS.filter((shopper) => shopper.isPlus).map((shopper) => ({
      id: `mem_${shopper.handle}`,
      userId: shopper.id,
      tier: 'PLUS',
      status: 'ACTIVE',
      startedAt: ago(intBetween(40, 200)),
      renewsAt: ahead(intBetween(3, 25)),
    })),
  });

  await prisma.pushToken.createMany({
    data: SHOPPERS.slice(0, 3).map((shopper) => ({
      id: `push_${shopper.handle}`,
      userId: shopper.id,
      token: `fcm_${shopper.handle}_${intBetween(100000, 999999)}`,
      platform: 'ANDROID',
    })),
  });

  await prisma.adminAuditLog.createMany({
    data: [
      { id: 'audit_1', actorId: adminId, action: 'seller.verify', entityType: 'Seller', entityId: sellerByKey.aureli, metadata: { note: 'GST verified' }, createdAt: ago(90) },
      { id: 'audit_2', actorId: adminId, action: 'catalog.block', entityType: 'Product', entityId: 'prd_fragrance_8', metadata: { reason: 'missing IFRA sheet' }, createdAt: ago(60) },
      { id: 'audit_3', actorId: adminId, action: 'report.dismiss', entityType: 'Report', entityId: 'rpt_2', metadata: { reason: 'no violation' }, createdAt: ago(12) },
    ],
  });

  return {
    adminId,
    creatorIds: CREATORS.map((creator) => creator.id),
    shopperIds: SHOPPERS.map((shopper) => shopper.id),
    riderIds: RIDER_SEED.map((rider) => rider.id),
    sellerByKey,
    storeIds: DARK_STORES.map((store) => store.id),
  };
}

// =============================================================================
// Catalogue
// =============================================================================

interface CatalogueResult {
  productIds: string[];
  quickProductIds: string[];
  productIdsByCollection: Record<string, string[]>;
}

async function seedCatalogue(context: SeedContext): Promise<CatalogueResult> {
  // Parents and children go in separate statements: a self-referencing FK is
  // only guaranteed satisfiable once the parent rows are committed.
  const parentCategoryRows: Prisma.CategoryCreateManyInput[] = CATEGORY_TREE.map((parent, index) => ({
    id: `cat_${parent.slug}`,
    name: parent.name,
    slug: parent.slug,
    position: index,
    imageUrl: `https://picsum.photos/seed/cat-${parent.slug}/600/600`,
  }));
  await prisma.category.createMany({ data: parentCategoryRows });

  const childCategoryRows: Prisma.CategoryCreateManyInput[] = CATEGORY_TREE.flatMap((parent) =>
    parent.children.map((child, childIndex) => ({
      id: `cat_${child.slug}`,
      name: child.name,
      slug: child.slug,
      parentId: `cat_${parent.slug}`,
      position: childIndex,
      imageUrl: `https://picsum.photos/seed/cat-${child.slug}/600/600`,
    })),
  );
  await prisma.category.createMany({ data: childCategoryRows });

  const brandNames = [...new Set(COLLECTIONS.map((collection) => collection.brand))];
  await prisma.brand.createMany({
    data: brandNames.map((brand) => ({
      id: `brd_${slugify(brand)}`,
      name: brand,
      slug: slugify(brand),
      description: `${brand} — sold exclusively through VELORA.`,
      logoUrl: `https://picsum.photos/seed/${slugify(brand)}-brand/200/200`,
    })),
  });

  const productRows: Prisma.ProductCreateManyInput[] = [];
  const imageRows: Prisma.ProductImageCreateManyInput[] = [];
  const variantRows: Prisma.ProductVariantCreateManyInput[] = [];
  const collectionProductIds: Record<string, string[]> = {};

  for (const collection of COLLECTIONS) {
    const ids: string[] = [];
    const suffixes = collection.quick ? QUICK_SUFFIXES : MARKET_SUFFIXES;

    collection.items.forEach((item, itemIndex) => {
      suffixes.forEach((suffix, suffixIndex) => {
        const ordinal = itemIndex * suffixes.length + suffixIndex + 1;
        const title = suffix ? `${collection.brand} ${item} ${suffix}` : `${collection.brand} ${item}`;
        const slug = `${slugify(collection.brand)}-${slugify(item)}${suffix ? `-${slugify(suffix)}` : ''}`;
        const productId = `prd_${collection.key}_${ordinal}`;
        const base = intBetween(collection.priceRange[0], collection.priceRange[1]);
        const price = roundRupee(base);
        const onSale = rng() > 0.32;
        const compareAtPrice = onSale ? roundRupee(price * (1.18 + rng() * 0.35)) : null;
        const ratingCount = intBetween(8, 2_800);
        const rating = Number((3.6 + rng() * 1.3).toFixed(1));
        const shippingDaysMin = collection.quick ? 0 : intBetween(2, 4);
        const shippingDaysMax = collection.quick ? 1 : shippingDaysMin + intBetween(2, 5);

        ids.push(productId);
        productRows.push({
          id: productId,
          sellerId: must(context.sellerByKey[collection.sellerKey]),
          categoryId: `cat_${collection.categorySlug}`,
          brandId: `brd_${slugify(collection.brand)}`,
          title,
          slug,
          description: collection.quick
            ? `${title} — picked this morning and stocked at the dark store closest to you. ${must(collection.highlights[0])}. Delivered in about ten minutes.`
            : `${title}. ${must(collection.highlights[0])}; ${must(collection.highlights[1])}. Ships in ${shippingDaysMin}–${shippingDaysMax} days with seven-day returns.`,
          highlights: collection.highlights,
          price,
          compareAtPrice,
          currency: 'INR',
          status: 'ACTIVE',
          rating,
          ratingCount,
          soldCount: intBetween(40, collection.quick ? 12_000 : 3_400),
          attributes: collection.quick
            ? { net: suffix || 'standard pack', shelfLife: `${intBetween(2, 21)} days`, storage: 'refrigerated' }
            : {
                colour: pick(['onyx', 'sand', 'ivory', 'sage', 'clay', 'bone']),
                material: pick(['ash wood', 'stoneware', 'brushed aluminium', 'full-grain leather', 'linen', 'recycled knit']),
                dimensions: `${intBetween(12, 90)} × ${intBetween(12, 90)} × ${intBetween(8, 120)} cm`,
              },
          shippingDaysMin,
          shippingDaysMax,
          isReturnable: !collection.quick,
          createdAt: ago(intBetween(5, 280)),
        });

        for (let imageIndex = 0; imageIndex < 3; imageIndex += 1) {
          imageRows.push({
            id: `img_${collection.key}_${ordinal}_${imageIndex}`,
            productId,
            url: `https://picsum.photos/seed/${slug}-${imageIndex}/1000/1200`,
            alt: `${title} — view ${imageIndex + 1}`,
            width: 1000,
            height: 1200,
            position: imageIndex,
          });
        }

        const variantNames = collection.quick
          ? ['Standard', 'Pack of 2']
          : ['Standard', pick(['Onyx', 'Sand', 'Ivory', 'Sage'])];

        variantNames.forEach((variantName, variantIndex) => {
          variantRows.push({
            id: `var_${collection.key}_${ordinal}_${variantIndex}`,
            productId,
            sku: `${slug}-v${variantIndex + 1}`,
            name: variantName,
            attributes: collection.quick ? { pack: variantName } : { finish: variantName.toLowerCase() },
            price: variantIndex === 0 ? price : roundRupee(price * (collection.quick ? 1.85 : 1.12)),
            compareAtPrice: variantIndex === 0 ? compareAtPrice : null,
            stock: intBetween(0, collection.quick ? 140 : 60),
            weightGrams: collection.quick ? intBetween(100, 2000) : intBetween(400, 12_000),
            isDefault: variantIndex === 0,
            createdAt: ago(intBetween(5, 280)),
          });
        });
      });
    });

    collectionProductIds[collection.key] = ids;
  }

  await prisma.product.createMany({ data: productRows });
  await prisma.productImage.createMany({ data: imageRows });
  await prisma.productVariant.createMany({ data: variantRows });

  // Quick-commerce stock in two nearby stores; a slice of marketplace bestsellers too.
  const inventoryRows: Prisma.StoreInventoryCreateManyInput[] = [];
  const primaryStore = must(context.storeIds[0]);
  const secondaryStore = must(context.storeIds[1]);

  for (const collection of COLLECTIONS.filter((entry) => entry.quick)) {
    const ids = collectionProductIds[collection.key] ?? [];
    ids.forEach((productId, index) => {
      const stores = index % 3 === 0 ? [primaryStore, secondaryStore] : [primaryStore];
      stores.forEach((storeId, storeIndex) => {
        inventoryRows.push({
          id: `inv_${productId}_${storeIndex}`,
          storeId,
          productId,
          variantId: `var_${collection.key}_${index + 1}_0`,
          quantity: index % 11 === 0 ? 0 : intBetween(4, 220),
          reserved: intBetween(0, 3),
          restockEtaMinutes: index % 11 === 0 ? intBetween(40, 180) : null,
          priceOverride: index % 13 === 0 ? roundRupee(intBetween(1_500, 20_000)) : null,
          aisle: `A${intBetween(1, 9)}-${intBetween(1, 24)}`,
        });
      });
    });
  }

  const bestsellerIds = collectionProductIds.lighting?.slice(0, 10) ?? [];
  bestsellerIds.forEach((productId, index) => {
    inventoryRows.push({
      id: `inv_${productId}_market`,
      storeId: primaryStore,
      productId,
      variantId: `var_lighting_${index + 1}_0`,
      quantity: intBetween(1, 6),
      reserved: 0,
      aisle: `B${intBetween(1, 4)}-${intBetween(1, 12)}`,
    });
  });

  await prisma.storeInventory.createMany({ data: inventoryRows, skipDuplicates: true });

  // Smart substitutions for the fast-moving essentials.
  const quickIds = COLLECTIONS.filter((entry) => entry.quick).flatMap(
    (entry) => collectionProductIds[entry.key] ?? [],
  );
  const substitutionRows: Prisma.SmartSubstitutionCreateManyInput[] = [];
  for (let i = 0; i < 18; i += 1) {
    const original = must(quickIds[i * 3]);
    const substitute = must(quickIds[i * 3 + 1]);
    substitutionRows.push({
      id: `sub_${i + 1}`,
      storeId: primaryStore,
      originalProductId: original,
      substituteProductId: substitute,
      score: Number((0.62 + rng() * 0.35).toFixed(2)),
      reason: pick(['same category, closest pack size', 'higher rated, similar price', 'customer favourite nearby']),
      isActive: true,
    });
  }
  await prisma.smartSubstitution.createMany({ data: substitutionRows, skipDuplicates: true });

  return {
    productIds: productRows.map((row) => row.id as string),
    quickProductIds: quickIds,
    productIdsByCollection: collectionProductIds,
  };
}

// =============================================================================
// Social + discovery
// =============================================================================

async function seedSocial(context: SeedContext, catalogue: CatalogueResult) {
  const postRows: Prisma.PostCreateManyInput[] = [];
  const mediaRows: Prisma.PostMediaCreateManyInput[] = [];
  const tagRows: Prisma.PostProductTagCreateManyInput[] = [];
  const pinPostIds: string[] = [];

  const captions = [
    'The lamp that fixed my evenings. Tagged so you can steal the look.',
    'Three things on my desk that actually earn their place.',
    'Sunday reset, but make it warm light and clean sheets.',
    'Found the tote. It holds a laptop, a camera and my entire personality.',
    'Six kilometres, zero blisters. Kit linked below.',
    'Skincare that survived a week of flights.',
    'Coffee ritual, upgraded. This pour-over is worth the counter space.',
    'Every object in this frame is under ten minutes away.',
  ];

  const marketIds = Object.entries(catalogue.productIdsByCollection)
    .filter(([key]) => !COLLECTIONS.find((entry) => entry.key === key)?.quick)
    .flatMap(([, ids]) => ids);

  for (let i = 0; i < 32; i += 1) {
    const postId = `pst_${i + 1}`;
    const type = i % 5 === 0 ? 'PIN' : i % 3 === 0 ? 'REEL' : 'POST';
    const authorId = must(context.creatorIds[i % context.creatorIds.length]);

    if (type === 'PIN') pinPostIds.push(postId);

    postRows.push({
      id: postId,
      authorId,
      type,
      caption: must(captions[i % captions.length]),
      locationName: pick(['Indiranagar, Bengaluru', 'Koramangala, Bengaluru', 'HSR Layout, Bengaluru', 'Jayanagar, Bengaluru']),
      lat: 12.93 + rng() * 0.05,
      lng: 77.6 + rng() * 0.1,
      visibility: 'PUBLIC',
      likeCount: intBetween(120, 48_000),
      commentCount: intBetween(4, 640),
      saveCount: intBetween(20, 12_000),
      viewCount: intBetween(1_200, 480_000),
      shareCount: intBetween(2, 1_800),
      isShoppable: true,
      publishedAt: ago(intBetween(0, 45)),
      createdAt: ago(intBetween(0, 45)),
    });

    mediaRows.push({
      id: `med_${i + 1}_0`,
      postId,
      type: type === 'REEL' ? 'VIDEO' : 'IMAGE',
      url: type === 'REEL' ? `https://cdn.velora.app/reels/${postId}.mp4` : `https://picsum.photos/seed/${postId}/900/1125`,
      thumbUrl: `https://picsum.photos/seed/${postId}-thumb/450/560`,
      width: 900,
      height: 1125,
      durationMs: type === 'REEL' ? intBetween(12_000, 48_000) : null,
      position: 0,
    });

    if (type === 'POST' && i % 2 === 0) {
      mediaRows.push({
        id: `med_${i + 1}_1`,
        postId,
        type: 'IMAGE',
        url: `https://picsum.photos/seed/${postId}-b/900/1125`,
        thumbUrl: `https://picsum.photos/seed/${postId}-b-thumb/450/560`,
        width: 900,
        height: 1125,
        position: 1,
      });
    }

    // Two shoppable hotspots per post: the whole point of the product loop.
    const tagged = pickSome(marketIds, 2);
    tagged.forEach((productId, tagIndex) => {
      tagRows.push({
        id: `tag_${i + 1}_${tagIndex}`,
        postId,
        productId,
        label: pick(['Shop the look', 'Under ₹5,000', 'In stock nearby', 'Creator pick']),
        x: Number((0.28 + tagIndex * 0.34).toFixed(2)),
        y: Number((0.32 + rng() * 0.36).toFixed(2)),
        atMs: type === 'REEL' ? 1_800 + tagIndex * 4_000 : null,
      });
    });
  }

  await prisma.post.createMany({ data: postRows });
  await prisma.postMedia.createMany({ data: mediaRows });
  await prisma.postProductTag.createMany({ data: tagRows, skipDuplicates: true });

  // Likes, comments and saves — enough to make counters and threads realistic.
  const likeRows: Prisma.PostLikeCreateManyInput[] = [];
  const commentRows: Prisma.CommentCreateManyInput[] = [];
  const saveRows: Prisma.SavedPostCreateManyInput[] = [];

  postRows.forEach((post, index) => {
    const postId = post.id as string;
    for (const shopperId of pickSome(context.shopperIds, intBetween(1, 4))) {
      likeRows.push({ postId, userId: shopperId, createdAt: ago(intBetween(0, 20)) });
    }
    if (index % 2 === 0) {
      saveRows.push({ postId, userId: must(context.shopperIds[index % context.shopperIds.length]), createdAt: ago(intBetween(0, 20)) });
    }
    if (index % 3 === 0) {
      commentRows.push({
        id: `cmt_${index + 1}`,
        postId,
        authorId: must(context.shopperIds[(index + 1) % context.shopperIds.length]),
        body: pick(['Where is the lamp from?', 'Saved to my board instantly.', 'Is this still in stock near me?', 'The styling is unreal.']),
        likeCount: intBetween(0, 48),
        createdAt: ago(intBetween(0, 12)),
      });
    }
  });

  await prisma.postLike.createMany({ data: likeRows, skipDuplicates: true });
  await prisma.savedPost.createMany({ data: saveRows, skipDuplicates: true });
  await prisma.comment.createMany({ data: commentRows });

  await prisma.story.createMany({
    data: context.creatorIds.slice(0, 5).map((creatorId, index) => ({
      id: `sty_${index + 1}`,
      authorId: creatorId,
      mediaUrl: `https://picsum.photos/seed/story-${index + 1}/720/1280`,
      mediaType: 'IMAGE',
      caption: pick(['restock day', 'ten-minute unboxing', 'new drop', 'behind the scenes']),
      expiresAt: ahead(1),
      createdAt: minutesAgo(intBetween(20, 700)),
    })),
  });

  await prisma.board.createMany({
    data: BOARD_SEED.map((board, index) => ({
      id: board.id,
      ownerId: must(context.shopperIds[index % context.shopperIds.length]),
      title: board.title,
      slug: board.slug,
      description: board.description,
      isPrivate: false,
      isCollaborative: index === 2,
      itemCount: pinPostIds.length,
      createdAt: ago(intBetween(20, 200)),
    })),
  });

  const boardItemRows: Prisma.BoardItemCreateManyInput[] = [];
  BOARD_SEED.forEach((board, boardIndex) => {
    for (let i = 0; i < 5; i += 1) {
      const postId = must(pinPostIds[(boardIndex * 2 + i) % pinPostIds.length]);
      boardItemRows.push({
        id: `bit_${boardIndex}_${i}`,
        boardId: board.id,
        postId,
        addedById: must(context.shopperIds[boardIndex % context.shopperIds.length]),
        note: pick(['love this light', 'need for the wedding', 'desk upgrade', 'sunday list']),
        position: i,
        createdAt: ago(intBetween(1, 90)),
      });
    }
    const productId = must(catalogue.productIdsByCollection.lighting?.[boardIndex] ?? catalogue.productIds[0]);
    boardItemRows.push({
      id: `bit_${boardIndex}_product`,
      boardId: board.id,
      productId,
      addedById: must(context.shopperIds[boardIndex % context.shopperIds.length]),
      note: 'ready to buy',
      position: 99,
      createdAt: ago(intBetween(1, 30)),
    });
  });
  await prisma.boardItem.createMany({ data: boardItemRows, skipDuplicates: true });

  await prisma.boardCollaborator.createMany({
    data: [
      { boardId: 'board_beach_wedding', userId: must(context.shopperIds[1]), role: 'EDITOR', createdAt: ago(40) },
      { boardId: 'board_beach_wedding', userId: must(context.creatorIds[0]), role: 'VIEWER', createdAt: ago(38) },
    ],
    skipDuplicates: true,
  });

  await prisma.trendingTopic.createMany({
    data: [
      'quiet light', 'desk 2027', 'beach wedding fit', 'ten minute dinner', 'monsoon skincare',
      'linen everything', 'running reset', 'copper kitchen', 'sunday reset', 'shoppable reels',
    ].map((label, index) => ({
      id: `trd_${index + 1}`,
      label,
      slug: slugify(label),
      score: Number((0.95 - index * 0.06).toFixed(2)),
      windowStart: ago(7),
      windowEnd: NOW,
    })),
    skipDuplicates: true,
  });

  // Direct messages between a shopper and a creator about a tagged product.
  await prisma.conversation.createMany({
    data: [
      { id: 'cnv_1', type: 'DIRECT', title: null, lastMessageAt: minutesAgo(24), createdAt: ago(3) },
      { id: 'cnv_2', type: 'SUPPORT', title: 'Order help', lastMessageAt: minutesAgo(120), createdAt: ago(1) },
    ],
  });
  await prisma.conversationParticipant.createMany({
    data: [
      { conversationId: 'cnv_1', userId: must(context.shopperIds[0]), role: 'MEMBER', lastReadAt: minutesAgo(20), joinedAt: ago(3) },
      { conversationId: 'cnv_1', userId: must(context.creatorIds[0]), role: 'MEMBER', lastReadAt: minutesAgo(30), joinedAt: ago(3) },
      { conversationId: 'cnv_2', userId: must(context.shopperIds[0]), role: 'MEMBER', joinedAt: ago(1) },
      { conversationId: 'cnv_2', userId: context.adminId, role: 'ADMIN', joinedAt: ago(1) },
    ],
    skipDuplicates: true,
  });
  await prisma.message.createMany({
    data: [
      { id: 'msg_1', conversationId: 'cnv_1', senderId: must(context.shopperIds[0]), body: 'Is the Aura Lamp warm or neutral?', createdAt: minutesAgo(28) },
      { id: 'msg_2', conversationId: 'cnv_1', senderId: must(context.creatorIds[0]), body: 'Warm 2700K — it is the one tagged in the reel.', createdAt: minutesAgo(26) },
      { id: 'msg_3', conversationId: 'cnv_1', senderId: must(context.shopperIds[0]), body: 'Saved it. Can I get it today?', createdAt: minutesAgo(24) },
      { id: 'msg_4', conversationId: 'cnv_2', senderId: context.adminId, body: 'Your quick order is with Arun, two minutes away.', createdAt: minutesAgo(120) },
    ],
  });

  return { pinPostIds };
}

// =============================================================================
// Commerce
// =============================================================================

async function seedCommerce(context: SeedContext, catalogue: CatalogueResult) {
  await prisma.coupon.createMany({
    data: COUPON_SEED.map((coupon) => ({
      id: coupon.id,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minSpend: coupon.minSpend,
      maxDiscount: coupon.maxDiscount,
      isActive: true,
      usageLimit: 10_000,
      usedCount: intBetween(20, 900),
      expiresAt: ahead(45),
      startsAt: ago(30),
    })),
  });

  const quickIds = catalogue.quickProductIds;
  const marketIds = catalogue.productIds.filter((id) => !quickIds.includes(id));

  const orderRows: Prisma.OrderCreateManyInput[] = [];
  const orderItemRows: Prisma.OrderItemCreateManyInput[] = [];
  const orderEventRows: Prisma.OrderEventCreateManyInput[] = [];
  const paymentRows: Prisma.PaymentCreateManyInput[] = [];
  const shipmentRows: Prisma.ShipmentCreateManyInput[] = [];
  const deliveryRows: Prisma.DeliveryAssignmentCreateManyInput[] = [];

  for (let i = 0; i < 12; i += 1) {
    const quick = i < 6;
    const orderId = `ord_${String(i + 1).padStart(3, '0')}`;
    const userId = must(context.shopperIds[i % context.shopperIds.length]);
    const itemCount = intBetween(1, 3);
    let subtotal = 0;

    for (let itemIndex = 0; itemIndex < itemCount; itemIndex += 1) {
      const productId = quick
        ? must(quickIds[(i * 7 + itemIndex * 3) % quickIds.length])
        : must(marketIds[(i * 11 + itemIndex * 5) % marketIds.length]);
      const unitPrice = quick ? intBetween(3_500, 42_000) : intBetween(120_000, 1_800_000);
      const quantity = intBetween(1, quick ? 3 : 2);
      const total = unitPrice * quantity;
      subtotal += total;

      orderItemRows.push({
        id: `oit_${i + 1}_${itemIndex}`,
        orderId,
        productId,
        variantId: null,
        sellerId: quick ? context.sellerByKey.quick : pick(Object.values(context.sellerByKey)),
        title: `Seeded line item ${itemIndex + 1}`,
        variantName: null,
        quantity,
        unitPrice,
        total,
        status: quick ? 'DELIVERED' : i % 4 === 0 ? 'PLACED' : 'DELIVERED',
        createdAt: ago(30 - i),
      });
    }

    const deliveryFee = quick ? 0 : subtotal > 99_900 ? 0 : 4_900;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + deliveryFee + tax;

    orderRows.push({
      id: orderId,
      userId,
      mode: quick ? 'QUICK' : 'MARKETPLACE',
      status: quick ? 'OUT_FOR_DELIVERY' : i % 4 === 0 ? 'PACKING' : 'DELIVERED',
      storeId: quick ? must(context.storeIds[i % context.storeIds.length]) : null,
      subtotal,
      discount: 0,
      deliveryFee,
      tax,
      total,
      currency: 'INR',
      addressSnapshot: {
        recipientName: `Customer ${i + 1}`,
        phone: '+919800000000',
        line1: '12th Main',
        city: 'Bengaluru',
        pincode: '560038',
      },
      placedAt: minutesAgo(quick ? 18 + i * 6 : 60 * 26 + i * 300),
      deliveredAt: quick ? null : ago(3),
    });

    orderEventRows.push(
      { id: `oev_${i + 1}_1`, orderId, type: 'ORDER_PLACED', message: 'Payment captured, store notified', createdAt: minutesAgo(quick ? 18 + i * 6 : 60 * 26) },
      { id: `oev_${i + 1}_2`, orderId, type: quick ? 'RIDER_ASSIGNED' : 'PACKED', message: quick ? 'Rider assigned from nearest dark store' : 'Packed at seller warehouse', createdAt: minutesAgo(quick ? 14 + i * 6 : 60 * 24) },
    );

    paymentRows.push({
      id: `pay_${i + 1}`,
      orderId,
      provider: quick ? 'RAZORPAY' : 'STRIPE',
      providerRef: `sandbox_${orderId}`,
      amount: total,
      currency: 'INR',
      status: 'CAPTURED',
      method: quick ? 'UPI' : 'CARD',
      capturedAt: minutesAgo(quick ? 17 + i * 6 : 60 * 26),
    });

    if (quick) {
      deliveryRows.push({
        id: `dlv_${i + 1}`,
        orderId,
        riderId: `rdr_${RIDER_SEED[i % RIDER_SEED.length]?.handle ?? 'arunpillai'}`,
        status: 'EN_ROUTE',
        distanceKm: Number((0.6 + rng() * 2.4).toFixed(2)),
        etaMinutes: intBetween(3, 9),
        routeGeometry: {
          type: 'LineString',
          coordinates: [
            [77.6412, 12.9719],
            [77.6398, 12.9721],
            [77.6375, 12.9734],
          ],
        },
        currentLat: 12.9712,
        currentLng: 77.6402,
        assignedAt: minutesAgo(14 + i * 6),
        pickedUpAt: minutesAgo(9 + i * 6),
      });
    } else {
      shipmentRows.push({
        id: `shp_${i + 1}`,
        orderId,
        carrier: pick(['Bluedart', 'Delhivery', 'Ekart']),
        trackingNumber: `VEL${1_000 + i}${intBetween(100_000, 999_999)}`,
        status: i % 4 === 0 ? 'IN_TRANSIT' : 'DELIVERED',
        dispatchedAt: ago(5),
        etaAt: ahead(2),
        deliveredAt: i % 4 === 0 ? null : ago(3),
        events: [
          { at: ago(6).toISOString(), label: 'Picked up' },
          { at: ago(4).toISOString(), label: 'In transit' },
        ],
      });
    }
  }

  await prisma.order.createMany({ data: orderRows });
  await prisma.orderItem.createMany({ data: orderItemRows });
  await prisma.orderEvent.createMany({ data: orderEventRows });
  await prisma.payment.createMany({ data: paymentRows });
  await prisma.shipment.createMany({ data: shipmentRows });
  await prisma.deliveryAssignment.createMany({ data: deliveryRows });

  await prisma.returnRequest.createMany({
    data: [
      {
        id: 'ret_1',
        orderItemId: 'oit_8_0',
        userId: must(context.shopperIds[1]),
        productId: must(marketIds[3]),
        reason: 'SIZE_MISMATCH',
        description: 'Runs half a size small.',
        media: [`https://picsum.photos/seed/return-1/800/800`],
        status: 'REQUESTED',
        refundAmount: 249_000,
        createdAt: ago(2),
      },
      {
        id: 'ret_2',
        orderItemId: 'oit_11_0',
        userId: must(context.shopperIds[3]),
        productId: must(marketIds[9]),
        reason: 'DAMAGED',
        description: 'Ceramic arrived chipped.',
        media: [],
        status: 'APPROVED',
        refundAmount: 89_900,
        pickupAt: ahead(1),
        createdAt: ago(5),
      },
    ],
  });

  await prisma.review.createMany({
    data: catalogue.productIds.slice(0, 120).map((productId, index) => ({
      id: `rev_${index + 1}`,
      productId,
      authorId: must(context.shopperIds[index % context.shopperIds.length]),
      rating: index % 9 === 0 ? 3 : index % 5 === 0 ? 4 : 5,
      title: pick(['Worth it', 'Exactly as pictured', 'Better in person', 'Solid buy', 'Would reorder']),
      body: pick([
        'Arrived in ten minutes and the packaging was flawless.',
        'Used it every day for a month — still looks new.',
        'Colour is slightly warmer than the photos, which I prefer.',
        'Great value at this price point.',
      ]),
      media: index % 4 === 0 ? [`https://picsum.photos/seed/review-${index + 1}/700/700`] : [],
      helpfulCount: intBetween(0, 320),
      isVerified: index % 3 === 0,
      status: 'PUBLISHED',
      createdAt: ago(intBetween(1, 120)),
    })),
  });

  await prisma.reviewSummary.createMany({
    data: catalogue.productIds.slice(0, 24).map((productId, index) => ({
      id: `rvs_${index + 1}`,
      productId,
      summary: 'Reviewers consistently praise the finish and packaging; a few mention the colour is warmer than pictured.',
      pros: ['build quality', 'fast delivery', 'packaging'],
      cons: ['colour reads warmer', 'limited stock'],
      sentiment: Number((0.72 + rng() * 0.2).toFixed(2)),
      reviewCount: intBetween(12, 320),
      model: 'seed-summariser-v1',
      generatedAt: ago(intBetween(1, 20)),
    })),
  });

  await prisma.priceSnapshot.createMany({
    data: catalogue.productIds.slice(0, 40).flatMap((productId, productIndex) =>
      [0, 1, 2, 3].map((step) => ({
        id: `psn_${productIndex}_${step}`,
        productId,
        price: roundRupee(intBetween(49_900, 1_200_000) * (1 - step * 0.02)),
        compareAtPrice: null,
        capturedAt: ago(step * 7),
      })),
    ),
  });

  await prisma.priceForecast.createMany({
    data: catalogue.productIds.slice(0, 12).flatMap((productId, index) =>
      [7, 14].map((horizonDays) => ({
        id: `pfc_${index}_${horizonDays}`,
        productId,
        horizonDays,
        predictedPrice: roundRupee(intBetween(45_000, 1_100_000)),
        confidence: Number((0.55 + rng() * 0.4).toFixed(2)),
        generatedAt: ago(1),
      })),
    ),
    skipDuplicates: true,
  });

  await prisma.wishlistItem.createMany({
    data: SHOPPERS.flatMap((shopper, index) =>
      pickSome(marketIds.slice(20), 3).map((productId, wishIndex) => ({
        userId: shopper.id,
        productId,
        createdAt: ago(index + wishIndex),
      })),
    ),
    skipDuplicates: true,
  });

  // Two live carts, one per fulfilment mode.
  await prisma.cart.createMany({
    data: [
      { id: 'crt_quick', userId: must(context.shopperIds[0]), mode: 'QUICK', storeId: must(context.storeIds[0]) },
      { id: 'crt_market', userId: must(context.shopperIds[0]), mode: 'MARKETPLACE' },
    ],
    skipDuplicates: true,
  });
  await prisma.cartItem.createMany({
    data: [
      { id: 'crti_1', cartId: 'crt_quick', productId: must(quickIds[2]), quantity: 2, unitPrice: 6_400, fulfillment: 'QUICK' },
      { id: 'crti_2', cartId: 'crt_quick', productId: must(quickIds[9]), quantity: 1, unitPrice: 14_900, fulfillment: 'QUICK' },
      { id: 'crti_3', cartId: 'crt_market', productId: must(marketIds[4]), quantity: 1, unitPrice: 449_000, fulfillment: 'MARKETPLACE' },
    ],
    skipDuplicates: true,
  });

  await prisma.payout.createMany({
    data: SELLERS.slice(0, 4).map((seller, index) => ({
      id: `pyo_${index + 1}`,
      userId: `usr_seller_${seller.key}`,
      sellerId: context.sellerByKey[seller.key],
      amount: intBetween(180_000, 4_800_000),
      currency: 'INR',
      status: index === 0 ? 'PAID' : 'SCHEDULED',
      periodStart: ago(30),
      periodEnd: ago(0),
      reference: `IMPS${intBetween(10000000, 99999999)}`,
      processedAt: index === 0 ? ago(2) : null,
      createdAt: ago(3),
    })),
  });

  await prisma.affiliateLink.createMany({
    data: context.creatorIds.flatMap((creatorId, creatorIndex) =>
      pickSome(marketIds, 2).map((productId, productIndex) => {
        const creatorProfileId = `crp_${CREATORS[creatorIndex]?.handle ?? 'ariamenon'}`;
        return {
          id: `aff_${creatorIndex}_${productIndex}`,
          creatorId: creatorProfileId,
          productId,
          code: `AFF${creatorIndex}${productIndex}${intBetween(100, 999)}`,
          clicks: intBetween(120, 24_000),
          conversions: intBetween(4, 640),
          gmv: intBetween(80_000, 2_400_000),
          earnings: intBetween(4_000, 160_000),
          createdAt: ago(30),
        };
      }),
    ),
    skipDuplicates: true,
  });
}

// =============================================================================
// Intelligence + trust
// =============================================================================

async function seedIntelligence(context: SeedContext, catalogue: CatalogueResult) {
  await prisma.analyticsEvent.createMany({
    data: Array.from({ length: 400 }).map((_, index) => ({
      id: `evt_${index + 1}`,
      actorId: SHOPPERS[index % SHOPPERS.length]?.id ?? null,
      sessionId: `ses_${(index % 40) + 1}`,
      type: must(INTERACTION_TYPES[index % INTERACTION_TYPES.length]),
      entityType: index % 3 === 0 ? 'product' : 'post',
      entityId: must(catalogue.productIds[index % catalogue.productIds.length]),
      surface: pick(['for_you', 'discover', 'quick', 'marketplace']),
      metadata: { position: index % 24 },
      createdAt: minutesAgo(index * 17),
    })),
  });

  await prisma.feedImpression.createMany({
    data: Array.from({ length: 80 }).map((_, index) => ({
      id: `imp_${index + 1}`,
      userId: must(context.shopperIds[index % context.shopperIds.length]),
      postId: `pst_${(index % 32) + 1}`,
      surface: 'for_you',
      position: index % 12,
      dwellMs: intBetween(400, 9_000),
      clicked: index % 4 === 0,
      saved: index % 7 === 0,
      createdAt: minutesAgo(index * 9),
    })),
  });

  await prisma.searchQuery.createMany({
    data: [
      'outfit for a beach wedding under 3000',
      'warm lamp for a small bedroom',
      'running shoes wide feet',
      'milk and eggs',
      'linen duvet queen',
      'gift under 2000',
    ].map((query, index) => ({
      id: `sqr_${index + 1}`,
      userId: must(context.shopperIds[index % context.shopperIds.length]),
      rawQuery: query,
      normalized: query.toLowerCase(),
      resultCount: intBetween(12, 240),
      clickedProductId: index % 2 === 0 ? must(catalogue.productIds[index]) : null,
      createdAt: minutesAgo(index * 45),
    })),
  });

  await prisma.reorderSuggestion.createMany({
    data: catalogue.quickProductIds.slice(0, 8).map((productId, index) => ({
      id: `rso_${index + 1}`,
      userId: must(context.shopperIds[index % context.shopperIds.length]),
      productId,
      cadenceDays: pick([7, 10, 14, 21]),
      nextOrderAt: ahead(intBetween(-1, 3)),
      confidence: Number((0.62 + rng() * 0.33).toFixed(2)),
      isDismissed: false,
      createdAt: ago(6),
    })),
    skipDuplicates: true,
  });

  await prisma.assistantThread.createMany({
    data: [
      { id: 'ast_1', userId: must(context.shopperIds[0]), title: 'Beach wedding look', updatedAt: minutesAgo(40) },
      { id: 'ast_2', userId: must(context.shopperIds[2]), title: 'Desk refresh', updatedAt: ago(2) },
    ],
  });
  await prisma.assistantMessage.createMany({
    data: [
      { id: 'asm_1', threadId: 'ast_1', role: 'USER', content: 'Outfit for a beach wedding under ₹3000', createdAt: minutesAgo(41) },
      {
        id: 'asm_2',
        threadId: 'ast_1',
        role: 'ASSISTANT',
        content: 'Linen shirt + tailored shorts + the Serein mini tote. All three ship in two days.',
        recommendations: { productIds: catalogue.productIds.slice(0, 3), total: 287_000 },
        tokenCount: 312,
        createdAt: minutesAgo(40),
      },
      { id: 'asm_3', threadId: 'ast_2', role: 'USER', content: 'Make my desk feel calmer without moving furniture', createdAt: ago(2) },
    ],
  });

  await prisma.visualSearchRequest.createMany({
    data: [
      { id: 'vsr_1', userId: must(context.shopperIds[1]), imageUrl: 'https://picsum.photos/seed/visual-1/900/900', topProductIds: catalogue.productIds.slice(4, 9), confidence: 0.83, latencyMs: 412, createdAt: minutesAgo(30) },
      { id: 'vsr_2', userId: must(context.shopperIds[4]), imageUrl: 'https://picsum.photos/seed/visual-2/900/900', topProductIds: catalogue.productIds.slice(9, 14), confidence: 0.71, latencyMs: 388, createdAt: ago(1) },
    ],
  });

  await prisma.notification.createMany({
    data: [
      { id: 'ntf_1', userId: must(context.shopperIds[0]), actorId: must(context.creatorIds[0]), type: 'ORDER_UPDATE', title: 'Your quick order is two minutes away', body: 'Arun is at the gate.', entityType: 'order', entityId: 'ord_001', createdAt: minutesAgo(12) },
      { id: 'ntf_2', userId: must(context.shopperIds[1]), type: 'PRICE_DROP', title: 'A price you saved dropped 18%', body: 'Aura Lamp 02 is now ₹3,682.', entityType: 'product', entityId: must(catalogue.productIdsByCollection.lighting?.[0]), createdAt: minutesAgo(90) },
      { id: 'ntf_3', userId: must(context.shopperIds[2]), actorId: must(context.creatorIds[3]), type: 'FOLLOW', title: 'Ishaan Roy followed you back', createdAt: ago(1) },
      { id: 'ntf_4', userId: must(context.shopperIds[3]), type: 'RESTOCK', title: 'Back in stock near you', body: 'Farm Eggs 6 restocked at Indiranagar.', entityType: 'product', entityId: must(catalogue.quickProductIds[14]), readAt: ago(1), createdAt: ago(2) },
      { id: 'ntf_5', userId: context.adminId, type: 'MODERATION', title: '3 reports need review', createdAt: minutesAgo(50) },
    ],
  });

  await prisma.report.createMany({
    data: [
      { id: 'rpt_1', reporterId: must(context.shopperIds[0]), targetType: 'POST', targetId: 'pst_7', reason: 'SPAM', details: 'Repeated affiliate spam in comments.', status: 'OPEN', createdAt: ago(1) },
      { id: 'rpt_2', reporterId: must(context.shopperIds[2]), targetType: 'PRODUCT', targetId: must(catalogue.productIds[30]), reason: 'MISLEADING', status: 'REVIEWING', moderatorId: context.adminId, createdAt: ago(2) },
      { id: 'rpt_3', reporterId: must(context.shopperIds[4]), targetType: 'USER', targetId: must(context.creatorIds[4]), reason: 'IMPERSONATION', status: 'DISMISSED', moderatorId: context.adminId, resolution: 'Verified identity', resolvedAt: ago(1), createdAt: ago(4) },
    ],
  });

  await prisma.riskSignal.createMany({
    data: [
      { id: 'rsk_1', subjectType: 'user', subjectId: must(context.shopperIds[5]), signal: 'card_testing', score: 0.87, status: 'OPEN', metadata: { attempts: 14, windowMinutes: 30 } },
      { id: 'rsk_2', subjectType: 'seller', subjectId: must(context.sellerByKey.botanica), signal: 'review_ring', score: 0.64, status: 'REVIEWING', metadata: { linkedAccounts: 6 } },
      { id: 'rsk_3', subjectType: 'post', subjectId: 'pst_12', signal: 'engagement_pod', score: 0.41, status: 'OPEN' },
    ],
  });
}

// =============================================================================
// Entry point
// =============================================================================

async function main() {
  console.time('[seed] total');
  console.log('[seed] wiping existing rows');
  await wipe();

  console.log('[seed] identity + stores');
  const context = await seedIdentity();

  console.log('[seed] catalogue');
  const catalogue = await seedCatalogue(context);

  console.log('[seed] social + discovery');
  await seedSocial(context, catalogue);

  console.log('[seed] commerce');
  await seedCommerce(context, catalogue);

  console.log('[seed] intelligence + trust');
  await seedIntelligence(context, catalogue);

  const [products, posts, users, orders] = await Promise.all([
    prisma.product.count(),
    prisma.post.count(),
    prisma.user.count(),
    prisma.order.count(),
  ]);

  console.log(`[seed] done — ${products} products · ${posts} posts · ${users} users · ${orders} orders`);
  console.timeEnd('[seed] total');
}

main()
  .catch((error) => {
    console.error('[seed] failed', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
