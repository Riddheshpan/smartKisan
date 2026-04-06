import React, { useState } from 'react';
import {
    BookOpen, PlayCircle, FileText, Star, ChevronRight, Search,
    Clock, Users, TrendingUp, Award, ExternalLink, Bookmark,
    Tag, Globe, Sprout, BarChart3, Droplets
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

// ─── Resources Data ────────────────────────────────────────────────────────
const ARTICLES = [
    {
        id: 1, type: 'article', emoji: '🌾',
        title: 'PM-KISAN Samman Nidhi',
        desc: 'Direct income support of ₹6,000 per year to all landholding farmer families, paid in three equal installments of ₹2,000 each.',
        tag: 'Government Scheme', readTime: '5 min', author: 'Govt. of India',
        date: 'Scheme Active', featured: true, category: 'schemes',
        link: 'https://pmkisan.gov.in/'
    },
    {
        id: 2, type: 'article', emoji: '☔',
        title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
        desc: 'Comprehensive crop insurance from pre-sowing to post-harvest losses against non-preventable natural risks.',
        tag: 'Government Scheme', readTime: '7 min', author: 'Govt. of India',
        date: 'Scheme Active', featured: true, category: 'schemes',
        link: 'https://pmfby.gov.in/'
    },
    {
        id: 3, type: 'article', emoji: '💳',
        title: 'Kisan Credit Card (KCC)',
        desc: 'Provides farmers with adequate and timely credit support from the banking system via a single window with flexible and simplified procedures.',
        tag: 'Credit & Finance', readTime: '5 min', author: 'Govt. of India',
        date: 'Scheme Active', featured: false, category: 'schemes',
        link: 'https://sbi.co.in/web/agri-rural/agriculture-banking/crop-finance/kisan-credit-card'
    },
    {
        id: 4, type: 'article', emoji: '📱',
        title: 'National Agriculture Market (e-NAM)',
        desc: 'A pan-India electronic trading portal that networks the existing APMC mandis to create a unified national market for agricultural commodities.',
        tag: 'Market Access', readTime: '6 min', author: 'Govt. of India',
        date: 'Scheme Active', featured: false, category: 'market',
        link: 'https://enam.gov.in/web/'
    },
    {
        id: 5, type: 'article', emoji: '🌱',
        title: 'Soil Health Card Scheme',
        desc: 'Aims at promoting soil test based and balanced use of fertilizers to enable farmers to realize higher yields at lower cost.',
        tag: 'Soil Health', readTime: '4 min', author: 'Govt. of India',
        date: 'Scheme Active', featured: false, category: 'soil',
        link: 'https://soilhealth.dac.gov.in/'
    },
    {
        id: 6, type: 'article', emoji: '💧',
        title: 'Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)',
        desc: 'Focused on improving water use efficiency at farm level. "Per Drop More Crop" for micro-irrigation systems.',
        tag: 'Irrigation', readTime: '5 min', author: 'Govt. of India',
        date: 'Scheme Active', featured: false, category: 'irrigation',
        link: 'https://pmksy.gov.in/'
    },
    {
        id: 7, type: 'article', emoji: '🚜',
        title: 'Sub-Mission on Agricultural Mechanization (SMAM)',
        desc: 'Provides subsidy for buying tractors, power tillers, and other farm machinery to promote mechanization for small/marginal farmers.',
        tag: 'Government Scheme', readTime: '8 min', author: 'Govt. of India',
        date: 'Scheme Active', featured: false, category: 'schemes',
        link: 'https://agrimachinery.nic.in/'
    },
    {
        id: 8, type: 'article', emoji: '🌿',
        title: 'Paramparagat Krishi Vikas Yojana (PKVY)',
        desc: 'Promotes organic farming through a cluster approach and Participatory Guarantee System certification.',
        tag: 'Government Scheme', readTime: '6 min', author: 'Govt. of India',
        date: 'Scheme Active', featured: false, category: 'schemes',
        link: 'https://pgsindia-ncof.gov.in/'
    },
];

const CATEGORIES = [
    { id: 'all', label: 'All Topics', icon: BookOpen },
    { id: 'schemes', label: 'Govt. Schemes', icon: Award },
    { id: 'pest', label: 'Pest & Disease', icon: Sprout },
    { id: 'irrigation', label: 'Irrigation', icon: Droplets },
    { id: 'soil', label: 'Soil Health', icon: Globe },
    { id: 'market', label: 'Market Access', icon: BarChart3 },
    { id: 'success', label: 'Success Stories', icon: Star },
];

const TAG_COLORS = {
    'Government Scheme': 'bg-blue-100 text-blue-700',
    'Irrigation': 'bg-kissan-sky-pale text-kissan-sky-dark',
    'Success Story': 'bg-kissan-amber-pale text-kissan-amber-dark',
    'Pest Management': 'bg-green-100 text-green-700',
    'Credit & Finance': 'bg-purple-100 text-purple-700',
    'Soil Health': 'bg-kissan-brown-pale text-kissan-brown',
    'Market Access': 'bg-emerald-100 text-emerald-700',
};

// ─── Featured Article ──────────────────────────────────────────────────────
const FeaturedCard = ({ article }) => (
    <div
        id={`featured-${article.id}`}
        className="bg-gradient-to-br from-kissan-green to-kissan-green-mid text-white rounded-2xl p-5 sm:p-6 cursor-pointer hover:shadow-green transition-all duration-300"
    >
        <span className={cn('inline-flex px-2.5 py-1 rounded-full text-xs font-bold mb-3 bg-white/20 text-white')}>
            ⭐ Featured
        </span>
        <div className="flex items-start gap-4">
            <span className="text-4xl flex-shrink-0">{article.emoji}</span>
            <div>
                <h3 className="font-extrabold text-lg leading-snug mb-2">{article.title}</h3>
                <p className="text-green-100/80 text-sm leading-relaxed mb-4 line-clamp-2">{article.desc}</p>
                <div className="flex items-center gap-3 text-green-100/70 text-xs">
                    {article.type === 'video' ? <PlayCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    {article.readTime}
                    <span>·</span>
                    {article.author}
                </div>
            </div>
        </div>
        <button 
           onClick={() => article.link && window.open(article.link, '_blank')}
           className="mt-4 flex items-center gap-2 text-sm font-bold text-white/90 hover:text-white no-tap-highlight">
            {article.link ? 'Official Website' : 'Read Now'} <ExternalLink className="w-4 h-4" />
        </button>
    </div>
);

// ─── Resource Card ─────────────────────────────────────────────────────────
const ResourceCard = ({ article }) => (
    <div
        id={`resource-${article.id}`}
        className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 cursor-pointer hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 flex flex-col gap-3"
    >
        <div className="flex items-start gap-3">
            <span className="text-3xl flex-shrink-0">{article.emoji}</span>
            <div className="flex-1 min-w-0">
                <span className={cn('inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold mb-1.5', TAG_COLORS[article.tag] || 'bg-gray-100 text-gray-500')}>
                    {article.tag}
                </span>
                <h3 className="font-bold text-gray-900 text-sm leading-tight">{article.title}</h3>
            </div>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed flex-1 line-clamp-3">{article.desc}</p>

        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
            <div className="flex items-center gap-2 text-xs text-gray-400">
                {article.type === 'video'
                    ? <PlayCircle className="w-3.5 h-3.5 text-kissan-sky" />
                    : article.type === 'success'
                    ? <Star className="w-3.5 h-3.5 text-kissan-gold fill-kissan-gold" />
                    : <BookOpen className="w-3.5 h-3.5 text-kissan-green" />
                }
                {article.readTime} · {article.date}
            </div>
            <button 
               onClick={() => article.link && window.open(article.link, '_blank')}
               className="flex items-center gap-1 text-xs font-bold text-kissan-green hover:text-kissan-green-dark no-tap-highlight">
               {article.link ? 'Visit Site' : 'Read'} {article.link ? <ExternalLink className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
        </div>
    </div>
);

// ─── Main Component ────────────────────────────────────────────────────────
const Schemes = () => {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    const filteredArticles = ARTICLES.filter((a) => {
        const matchCat = activeCategory === 'all' || a.category === activeCategory;
        const matchSearch = !searchTerm ||
            a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.tag.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCat && matchSearch;
    });

    const featured = filteredArticles.filter(a => a.featured);
    const regular = filteredArticles.filter(a => !a.featured);

    return (
        <div className="page-wrapper animate-fade-in">
            {/* Header */}
            <div className="mb-5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">📚 Resources & Schemes</h1>
                <p className="text-gray-500 mt-1 text-sm">Guides, videos, success stories & government scheme information</p>
            </div>

            {/* Impact Banner */}
            <div
                className="rounded-2xl p-5 sm:p-6 mb-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
                style={{ background: 'linear-gradient(135deg, #5D4037, #795548)' }}
                id="impact-banner"
            >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full sm:w-auto flex-shrink-0">
                    {[
                        { num: '2.5L+', label: 'Farmers Helped' },
                        { num: '28%', label: 'Yield Increase' },
                        { num: '₹3,200', label: 'Avg. Savings/Yr' },
                    ].map(({ num, label }) => (
                        <div key={label} className="text-center">
                            <p className="text-2xl font-extrabold text-kissan-amber">{num}</p>
                            <p className="text-xs text-white/75 mt-0.5">{label}</p>
                        </div>
                    ))}
                </div>
                <div className="sm:border-l sm:border-white/20 sm:pl-6 text-center sm:text-left">
                    <p className="font-bold text-white text-base">Smart Kissan Impact</p>
                    <p className="text-white/70 text-sm mt-0.5">Helping Indian farmers since 2021 across 18 states</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    id="resources-search"
                    type="search"
                    placeholder="Search articles, schemes, videos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-kissan pl-12"
                    aria-label="Search resources"
                />
            </div>

            {/* Category Chips */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
                {CATEGORIES.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        id={`resource-cat-${id}`}
                        onClick={() => setActiveCategory(id)}
                        className={cn(
                            'flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-semibold flex-shrink-0 transition-all duration-200 no-tap-highlight',
                            activeCategory === id
                                ? 'bg-kissan-green text-white border-kissan-green'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-kissan-green/40 hover:text-kissan-green'
                        )}
                        aria-pressed={activeCategory === id}
                    >
                        <Icon className="w-4 h-4" />
                        {label}
                    </button>
                ))}
            </div>

            {/* Featured */}
            {featured.length > 0 && (
                <div className="mb-6 space-y-4">
                    {featured.map(a => <FeaturedCard key={a.id} article={a} />)}
                </div>
            )}

            {/* Regular Grid */}
            {regular.length > 0 && (
                <>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-bold text-gray-900">
                            {activeCategory === 'all' ? 'All Resources' : CATEGORIES.find(c => c.id === activeCategory)?.label}
                            <span className="ml-2 text-sm text-gray-400 font-normal">({regular.length})</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {regular.map(a => <ResourceCard key={a.id} article={a} />)}
                    </div>
                </>
            )}

            {filteredArticles.length === 0 && (
                <div className="text-center py-16">
                    <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-400">No resources found for "<span className="font-semibold">{searchTerm}</span>"</p>
                    <button onClick={() => { setSearchTerm(''); setActiveCategory('all'); }}
                        className="mt-3 text-sm text-kissan-green font-semibold hover:underline">
                        Clear filters
                    </button>
                </div>
            )}
        </div>
    );
};

export default Schemes;
