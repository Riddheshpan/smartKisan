import React, { useState } from 'react';
import {
    Search, Filter, ShoppingBag, Star, MessageCircle, ChevronRight,
    Tag, Truck, ShieldCheck, Leaf, Sprout, FlaskConical, Tractor,
    Droplets, SlidersHorizontal, Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

// ─── Product Data ──────────────────────────────────────────────────────────
const PRODUCTS = [
    {
        id: 1, category: 'seeds', name: 'HD-2967 Wheat Seeds', brand: 'IARI Certified', emoji: '🌾',
        price: 850, mrp: 1200, unit: 'per 40kg bag', rating: 4.8, reviews: 342,
        tag: 'Best Seller', delivery: '2-3 days', forCrops: ['Wheat'],
        desc: 'High yielding, disease-resistant variety. 45-50 qtl/ha yield potential.'
    },
    {
        id: 2, category: 'seeds', name: 'Pusa Basmati 1121', brand: 'HCL Foundation Seeds', emoji: '🍚',
        price: 1200, mrp: 1600, unit: 'per 25kg bag', rating: 4.6, reviews: 218,
        tag: 'Premium', delivery: '3-4 days', forCrops: ['Rice'],
        desc: 'Extra-long grain basmati. High export demand. 55 qtl/ha.'
    },
    {
        id: 3, category: 'fertilizers', name: 'DAP (18:46:0)', brand: 'IFFCO', emoji: '🧪',
        price: 1350, mrp: 1530, unit: 'per 50kg bag', rating: 4.9, reviews: 895,
        tag: 'Govt. Rate', delivery: '1-2 days', forCrops: ['All'],
        desc: 'Di-Ammonium Phosphate. Ideal for basal dose application.'
    },
    {
        id: 4, category: 'fertilizers', name: 'Urea (46-0-0)', brand: 'NFL', emoji: '⚗️',
        price: 266, mrp: 266, unit: 'per 50kg bag', rating: 4.7, reviews: 1204,
        tag: 'Govt. Rate', delivery: '1-2 days', forCrops: ['All'],
        desc: 'Prilled urea for top dressing. Quick nitrogen release.'
    },
    {
        id: 5, category: 'pesticides', name: 'Imidacloprid 17.8% SL', brand: 'Bayer CropScience', emoji: '🐛',
        price: 480, mrp: 650, unit: 'per 250ml', rating: 4.5, reviews: 187,
        tag: '26% Off', delivery: '3-5 days', forCrops: ['Wheat', 'Cotton', 'Vegetables'],
        desc: 'Systemic insecticide for aphids, whitefly, jassids control.'
    },
    {
        id: 6, category: 'pesticides', name: 'Mancozeb 75% WP', brand: 'UPL Limited', emoji: '🍄',
        price: 320, mrp: 420, unit: 'per 500g', rating: 4.4, reviews: 124,
        tag: '', delivery: '3-5 days', forCrops: ['Potato', 'Tomato', 'Onion'],
        desc: 'Broad spectrum fungicide. Controls early & late blight.'
    },
    {
        id: 7, category: 'equipment', name: 'Soil Moisture Sensor', brand: 'AgriSense IoT', emoji: '📡',
        price: 2499, mrp: 3500, unit: 'per unit', rating: 4.6, reviews: 67,
        tag: 'Smart Farm', delivery: '5-7 days', forCrops: ['All'],
        desc: 'WiFi-enabled moisture sensor with mobile app alerts. Saves 30% water.'
    },
    {
        id: 8, category: 'equipment', name: 'Knapsack Sprayer 16L', brand: 'Neptune', emoji: '💦',
        price: 890, mrp: 1100, unit: 'per piece', rating: 4.3, reviews: 453,
        tag: '', delivery: '2-3 days', forCrops: ['All'],
        desc: 'Heavy-duty HDPE tank. Adjustable nozzle 3-bar pressure.'
    },
    {
        id: 9, category: 'irrigation', name: 'Drip Irrigation Kit', brand: 'Netafim', emoji: '💧',
        price: 4800, mrp: 6500, unit: 'per acre kit', rating: 4.8, reviews: 89,
        tag: 'Subsidy Eligible', delivery: '7-10 days', forCrops: ['Vegetables', 'Cotton'],
        desc: 'Complete drip system with PM-KISAN subsidy certificate included.'
    },
];

const CATEGORIES = [
    { id: 'all', label: 'All Products', icon: ShoppingBag },
    { id: 'seeds', label: 'Seeds', icon: Sprout },
    { id: 'fertilizers', label: 'Fertilizers', icon: FlaskConical },
    { id: 'pesticides', label: 'Pest Control', icon: Leaf },
    { id: 'equipment', label: 'Equipment', icon: Tractor },
    { id: 'irrigation', label: 'Irrigation', icon: Droplets },
];

// ─── Product Card ──────────────────────────────────────────────────────────
const ProductCard = ({ product, onAskExpert }) => (
    <div
        id={`product-${product.id}`}
        className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300"
    >
        {/* Product Image / Emoji */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 h-36 flex items-center justify-center relative">
            <span className="text-6xl">{product.emoji}</span>
            {product.tag && (
                <span className={cn(
                    'absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold',
                    product.tag === 'Best Seller' ? 'bg-kissan-amber text-white' :
                    product.tag === 'Govt. Rate' ? 'bg-kissan-green text-white' :
                    product.tag === 'Smart Farm' ? 'bg-kissan-sky text-white' :
                    product.tag === 'Subsidy Eligible' ? 'bg-purple-600 text-white' :
                    'bg-red-500 text-white'
                )}>
                    {product.tag}
                </span>
            )}
        </div>

        {/* Content */}
        <div className="p-4">
            <p className="text-xs text-gray-400 font-medium mb-1">{product.brand}</p>
            <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1">{product.name}</h3>
            <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.desc}</p>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mb-3">
                <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={cn('w-3 h-3', i < Math.floor(product.rating) ? 'fill-kissan-gold text-kissan-gold' : 'text-gray-200')} />
                    ))}
                </div>
                <span className="text-xs font-semibold text-gray-700">{product.rating}</span>
                <span className="text-xs text-gray-400">({product.reviews})</span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-2 mb-3">
                <span className="text-xl font-extrabold text-gray-900">₹{product.price}</span>
                {product.mrp > product.price && (
                    <span className="text-xs text-gray-400 line-through mb-1">₹{product.mrp}</span>
                )}
            </div>
            <p className="text-xs text-gray-400 mb-1">{product.unit}</p>

            {/* Delivery */}
            <div className="flex items-center gap-1.5 text-xs text-kissan-green font-medium mb-4">
                <Truck className="w-3.5 h-3.5" />
                Delivery in {product.delivery}
            </div>

            {/* CTAs */}
            <div className="flex gap-2">
                <button
                    id={`buy-${product.id}`}
                    className="flex-1 btn-primary py-2.5 text-sm rounded-xl justify-center"
                    aria-label={`Buy ${product.name}`}
                >
                    Buy Now
                </button>
                <button
                    id={`expert-${product.id}`}
                    onClick={() => onAskExpert(product)}
                    className="px-3 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 hover:border-kissan-green hover:text-kissan-green transition-all no-tap-highlight"
                    aria-label={`Ask expert about ${product.name}`}
                    title="Ask Expert"
                >
                    <MessageCircle className="w-4 h-4" />
                </button>
            </div>
        </div>
    </div>
);

// ─── Ask Expert Modal ──────────────────────────────────────────────────────
const AskExpertModal = ({ product, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 animate-fade-in">
        <div className="bg-white rounded-3xl w-full max-w-md p-6 space-y-4 animate-slide-up shadow-2xl">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-kissan-green-pale rounded-2xl flex items-center justify-center text-2xl">
                    {product.emoji}
                </div>
                <div>
                    <h3 className="font-bold text-gray-900">Ask an Expert</h3>
                    <p className="text-sm text-gray-500">{product.name}</p>
                </div>
            </div>
            <p className="text-gray-600 text-sm">Our agronomist will help you decide if this product is right for your crop and soil.</p>
            <div className="space-y-3">
                <a
                    href={`https://wa.me/918001234567?text=I want advice on ${product.name} for my farm`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-bold text-sm transition-all hover:opacity-90"
                    style={{ background: '#25D366' }}
                >
                    💬 Chat on WhatsApp
                </a>
                <button
                    onClick={onClose}
                    className="w-full py-3.5 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors no-tap-highlight"
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
);

// ─── Main Component ────────────────────────────────────────────────────────
const Marketplace = () => {
    const { t } = useLanguage();
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [expertProduct, setExpertProduct] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    const filteredProducts = PRODUCTS.filter((p) => {
        const matchCat = activeCategory === 'all' || p.category === activeCategory;
        const matchSearch = !searchTerm ||
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCat && matchSearch;
    });

    return (
        <div className="page-wrapper animate-fade-in">
            {/* Header */}
            <div className="mb-5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">🛒 Farm Marketplace</h1>
                <p className="text-gray-500 mt-1 text-sm">Seeds, fertilizers, pesticides & smart equipment</p>
            </div>

            {/* Trust strip */}
            <div className="flex gap-4 overflow-x-auto pb-2 mb-5 no-scrollbar">
                {[
                    { icon: ShieldCheck, text: 'Govt. Certified Products' },
                    { icon: Truck, text: 'Pan-India Delivery' },
                    { icon: Tag, text: 'MSP & Subsidy Rates' },
                    { icon: MessageCircle, text: 'Expert Guidance Free' },
                ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2 bg-kissan-green-pale border border-kissan-green/20 rounded-xl px-3.5 py-2.5 flex-shrink-0">
                        <Icon className="w-4 h-4 text-kissan-green" />
                        <span className="text-xs font-semibold text-kissan-green-dark whitespace-nowrap">{text}</span>
                    </div>
                ))}
            </div>

            {/* Search + Filter Bar */}
            <div className="flex gap-3 mb-5">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        id="marketplace-search"
                        type="search"
                        placeholder="Search seeds, fertilizers, tools..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-kissan pl-12"
                        aria-label="Search marketplace"
                    />
                </div>
                <button
                    id="marketplace-filter-btn"
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 rounded-xl border-2 border-gray-200 text-gray-600 hover:border-kissan-green hover:text-kissan-green transition-all no-tap-highlight flex items-center gap-2"
                >
                    <SlidersHorizontal className="w-5 h-5" />
                    <span className="hidden sm:inline text-sm font-semibold">Filter</span>
                </button>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
                {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = activeCategory === cat.id;
                    return (
                        <button
                            key={cat.id}
                            id={`category-${cat.id}`}
                            onClick={() => setActiveCategory(cat.id)}
                            className={cn(
                                'flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-semibold flex-shrink-0 transition-all duration-200 no-tap-highlight',
                                isActive
                                    ? 'bg-kissan-green border-kissan-green text-white shadow-green'
                                    : 'bg-white border-gray-200 text-gray-600 hover:border-kissan-green/40 hover:text-kissan-green'
                            )}
                            aria-pressed={isActive}
                        >
                            <Icon className="w-4 h-4" />
                            {cat.label}
                        </button>
                    );
                })}
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">
                    <span className="font-bold text-gray-900">{filteredProducts.length}</span> products found
                </p>
                <div className="flex items-center gap-1.5 text-xs text-kissan-green font-medium">
                    <Clock className="w-3 h-3" />
                    Updated daily
                </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                    <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-400">No products found for "<span className="font-semibold">{searchTerm}</span>"</p>
                    <button onClick={() => { setSearchTerm(''); setActiveCategory('all'); }}
                        className="mt-3 text-sm text-kissan-green font-semibold hover:underline">
                        Clear filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onAskExpert={setExpertProduct}
                        />
                    ))}
                </div>
            )}

            {/* Ask Expert Modal */}
            {expertProduct && (
                <AskExpertModal
                    product={expertProduct}
                    onClose={() => setExpertProduct(null)}
                />
            )}
        </div>
    );
};

export default Marketplace;
