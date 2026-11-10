/**
 * Phase 1 landing fixtures.
 *
 * These objects are intentionally shaped like the future API contracts
 * (`ProductSummary`, `PostSummary`, ...) so swapping in `fetch('/api/v1/...')`
 * in Phase 2 is a data-source change, not a component rewrite.
 */

export type ArtShape =
  | 'lamp'
  | 'sneaker'
  | 'bag'
  | 'watch'
  | 'bottle'
  | 'chair'
  | 'headphones'
  | 'vase'
  | 'camera';

export type Accent = 'violet' | 'coral' | 'aqua' | 'amber';

export interface ProductSummary {
  id: string;
  name: string;
  brand: string;
  /** minor units (paise) - matches the Prisma schema */
  price: number;
  compareAt?: number;
  accent: Accent;
  shape: ArtShape;
  badge: string;
  fulfillment: 'quick' | 'marketplace';
  rating?: number;
}

export const heroProducts: ProductSummary[] = [
  {
    id: 'p_aura_lamp',
    name: 'Aura Lamp 02',
    brand: 'Noor Studio',
    price: 449000,
    compareAt: 599000,
    accent: 'aqua',
    shape: 'lamp',
    badge: 'In your dark store',
    fulfillment: 'quick',
    rating: 4.8,
  },
  {
    id: 'p_lumen_sneaker',
    name: 'Lumen Runner',
    brand: 'Kinetic',
    price: 899000,
    accent: 'violet',
    shape: 'sneaker',
    badge: 'Trending in Reels',
    fulfillment: 'marketplace',
    rating: 4.6,
  },
  {
    id: 'p_serein_tote',
    name: 'Serein Tote',
    brand: 'Atelier 9',
    price: 599000,
    accent: 'coral',
    shape: 'bag',
    badge: 'Saved 12.4k times',
    fulfillment: 'marketplace',
    rating: 4.9,
  },
  {
    id: 'p_halo_watch',
    name: 'Halo Chrono',
    brand: 'Meridian',
    price: 1599000,
    compareAt: 1899000,
    accent: 'amber',
    shape: 'watch',
    badge: 'Price drop predicted',
    fulfillment: 'marketplace',
    rating: 4.7,
  },
];

export interface LoopStep {
  id: string;
  kicker: string;
  title: string;
  body: string;
  accent: Accent;
  surface: 'feed' | 'tag' | 'board' | 'door';
}

export const loopSteps: LoopStep[] = [
  {
    id: 'see',
    kicker: '01 — See',
    title: 'A feed that actually knows your taste',
    body: 'Reels, stories and pins ranked by what you linger on, not what pays most. Every frame is tagged, so inspiration is instantly purchasable.',
    accent: 'violet',
    surface: 'feed',
  },
  {
    id: 'tap',
    kicker: '02 — Tap',
    title: 'The tag is the doorway',
    body: 'One tap lifts the product out of the video into a glass detail card — variants, reviews, seller, and where it can ship from.',
    accent: 'coral',
    surface: 'tag',
  },
  {
    id: 'save',
    kicker: '03 — Save',
    title: 'Boards become shopping lists',
    body: 'Save to a board and VELORA quietly checks availability, price history and restock odds. Your mood board turns into a plan.',
    accent: 'amber',
    surface: 'board',
  },
  {
    id: 'get',
    kicker: '04 — Get',
    title: 'Ten minutes, or full marketplace reach',
    body: 'If it sits in a dark store inside your ring, it arrives in ten. If not, the same cart flows into marketplace delivery with live tracking.',
    accent: 'aqua',
    surface: 'door',
  },
];

export const heroStats = [
  { label: 'Shoppable posts', value: 42.6, suffix: 'M' },
  { label: 'Median delivery', value: 10, suffix: ' min' },
  { label: 'Creators earning', value: 1.2, suffix: 'M' },
  { label: 'Save-to-cart rate', value: 38, suffix: '%' },
];

export interface PinSummary {
  id: string;
  title: string;
  accent: Accent;
  shape: ArtShape;
  height: 'tall' | 'mid' | 'short';
  saves: string;
  price: number;
}

export const pins: PinSummary[] = [
  { id: 'pin_1', title: 'Quiet luxury, monsoon edition', accent: 'violet', shape: 'vase', height: 'tall', saves: '18.2k', price: 329000 },
  { id: 'pin_2', title: 'Warm corner, cold coffee', accent: 'amber', shape: 'lamp', height: 'short', saves: '9.7k', price: 449000 },
  { id: 'pin_3', title: 'Beach wedding, under 3000', accent: 'coral', shape: 'bag', height: 'mid', saves: '24.1k', price: 279000 },
  { id: 'pin_4', title: 'Studio desk reset', accent: 'aqua', shape: 'camera', height: 'mid', saves: '6.4k', price: 899000 },
  { id: 'pin_5', title: 'Sculptural seating', accent: 'violet', shape: 'chair', height: 'tall', saves: '12.8k', price: 1599000 },
  { id: 'pin_6', title: 'Analog, but make it future', accent: 'amber', shape: 'watch', height: 'short', saves: '4.2k', price: 1599000 },
  { id: 'pin_7', title: 'Ceramic mornings', accent: 'aqua', shape: 'bottle', height: 'mid', saves: '7.1k', price: 129000 },
  { id: 'pin_8', title: 'Late-night listening', accent: 'coral', shape: 'headphones', height: 'tall', saves: '15.6k', price: 2499000 },
];

export interface QuickItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  eta: number;
  accent: Accent;
  shape: ArtShape;
  stock: 'in' | 'low' | 'swap';
}

export const quickItems: QuickItem[] = [
  { id: 'q_1', name: 'Cold brew, 6 pack', price: 48000, unit: '6 × 250ml', eta: 9, accent: 'amber', shape: 'bottle', stock: 'in' },
  { id: 'q_2', name: 'Linen throw', price: 129000, unit: '130 × 170cm', eta: 11, accent: 'aqua', shape: 'vase', stock: 'low' },
  { id: 'q_3', name: 'Studio headphones', price: 2499000, unit: 'Over-ear', eta: 10, accent: 'violet', shape: 'headphones', stock: 'swap' },
  { id: 'q_4', name: 'Heatless styler', price: 89900, unit: 'Silk set', eta: 8, accent: 'coral', shape: 'camera', stock: 'in' },
];

export interface DealCard {
  id: string;
  name: string;
  seller: string;
  price: number;
  compareAt: number;
  rating: number;
  reviews: number;
  accent: Accent;
  shape: ArtShape;
  reviewsSummary: string;
}

export const deals: DealCard[] = [
  {
    id: 'd_1',
    name: 'Serein Tote — Onyx',
    seller: 'Atelier 9',
    price: 599000,
    compareAt: 749000,
    rating: 4.9,
    reviews: 2841,
    accent: 'coral',
    shape: 'bag',
    reviewsSummary: 'Buyers love the leather weight; 12 reviews flag the strap length for tall frames.',
  },
  {
    id: 'd_2',
    name: 'Lumen Runner — Vapor',
    seller: 'Kinetic Official',
    price: 899000,
    compareAt: 1099000,
    rating: 4.6,
    reviews: 5120,
    accent: 'violet',
    shape: 'sneaker',
    reviewsSummary: 'Runs half a size small. Praised for grip on wet tile; 8% mention a break-in period.',
  },
  {
    id: 'd_3',
    name: 'Halo Chrono — Sand',
    seller: 'Meridian',
    price: 1599000,
    compareAt: 1899000,
    rating: 4.7,
    reviews: 942,
    accent: 'amber',
    shape: 'watch',
    reviewsSummary: 'Sapphire glass and 42h reserve get consistent praise; bracelet tool is fiddly.',
  },
];

export const studioMetrics = [
  { label: 'Creator payouts', value: '₹18.4L', delta: '+24% MoM' },
  { label: 'Attributed GMV', value: '₹2.7Cr', delta: '+31% MoM' },
  { label: 'Save → cart', value: '38.2%', delta: '+6.1 pts' },
  { label: 'Stock-outs avoided', value: '1,284', delta: 'auto-substituted' },
];

export const assistantDemo = {
  prompt: 'outfit for a beach wedding under ₹3000',
  thinking: ['Reading 4,208 tagged looks', 'Filtering by coastal palette', 'Checking dark-store stock'],
  reply: 'Three looks in your palette, all under ₹3,000. The linen set can reach you in 10 minutes.',
  chips: ['Linen co-ord · ₹2,480', 'Shell earrings · ₹399', 'Woven slides · ₹1,290'],
};

export const navLinks = [
  { label: 'The loop', href: '#loop' },
  { label: 'Discover', href: '#discover' },
  { label: 'Ten minutes', href: '#quick' },
  { label: 'Marketplace', href: '#marketplace' },
  { label: 'Studio', href: '#studio' },
];
