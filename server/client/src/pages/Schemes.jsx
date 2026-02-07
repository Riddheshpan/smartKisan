import React, { useState } from 'react';
import { ExternalLink, CheckCircle2, FileText, Search, Filter, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';

// Comprehensive list of Indian Govt Schemes
const SCHEMES_DATA = [
    {
        id: 1,
        title: "PM-KISAN Samman Nidhi",
        description: "Financial benefit of ₹6,000/- per year in three equal installments to all landholding farmers families.",
        category: "Financial",
        deadline: "Open Year-Round",
        status: "Active",
        link: "https://pmkisan.gov.in/",
        tags: ["Central", "Direct Transfer"]
    },
    {
        id: 2,
        title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
        description: "One Nation One Scheme for crop insurance. Provides comprehensive insurance cover against failure of crop.",
        category: "Insurance",
        deadline: "31st July (Kharif)",
        status: "Closing Soon",
        link: "https://pmfby.gov.in/",
        tags: ["Insurance", "Risk Cover"]
    },
    {
        id: 3,
        title: "Kisan Credit Card (KCC)",
        description: "Adequate and timely credit support from the banking system under a single window with flexible and simplified procedure.",
        category: "Credit",
        deadline: "Open Year-Round",
        status: "Active",
        link: "https://www.myscheme.gov.in/schemes/kcc",
        tags: ["Loan", "Low Interest"]
    },
    {
        id: 4,
        title: "Soil Health Card Scheme",
        description: "Assisting states to issue soil health cards to all farmers once in a cycle of 3 years. Helps in optimal nutrient usage.",
        category: "Technical",
        deadline: "Ongoing Cycle",
        status: "Active",
        link: "https://soilhealth.dac.gov.in/",
        tags: ["Soil", "Lab Test"]
    },
    {
        id: 5,
        title: "PM Krishi Sinchai Yojana (PMKSY)",
        description: "More crop per drop. Subsidies for drip and sprinkler irrigation systems to improve water use efficiency.",
        category: "Subsidy",
        deadline: "State-wise",
        status: "Active",
        link: "https://pmksy.gov.in/",
        tags: ["Irrigation", "Subsidy"]
    },
    {
        id: 6,
        title: "e-NAM (National Agriculture Market)",
        description: "Pan-India electronic trading portal which networks the existing APMC mandis to create a unified national market.",
        category: "Market",
        deadline: "Registration Open",
        status: "Active",
        link: "https://www.enam.gov.in/",
        tags: ["Trade", "Online Mandi"]
    }
];

const Schemes = () => {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    const categories = ["All", "Financial", "Insurance", "Credit", "Technical", "Subsidy", "Market"];

    const filteredSchemes = SCHEMES_DATA.filter(scheme => {
        const matchesSearch = scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === "All" || scheme.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">{t('govt_schemes')}</h1>
                    <p className="text-muted-foreground mt-1">{t('schemes_subtitle')}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => window.open('https://agricoop.nic.in/', '_blank')}>
                        <Info className="w-4 h-4 mr-2" />
                        Min. of Agriculture
                    </Button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 rounded-lg border shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={t('search_schemes')}
                        className="pl-9 bg-background"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto w-full pb-2 md:pb-0 scrollbar-hide">
                    {categories.map(cat => (
                        <Button
                            key={cat}
                            variant={activeCategory === cat ? "default" : "outline"}
                            size="sm"
                            onClick={() => setActiveCategory(cat)}
                            className="whitespace-nowrap"
                        >
                            {cat}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Schemes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSchemes.length > 0 ? filteredSchemes.map((scheme) => (
                    <Card key={scheme.id} className="flex flex-col hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant={scheme.category === "Financial" ? "default" : "secondary"}>
                                    {scheme.category}
                                </Badge>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${scheme.status === "Active" ? "bg-green-100 text-green-700" : "bg-orange-100 text-green-700"
                                    }`}>
                                    ● {scheme.status}
                                </span>
                            </div>
                            <CardTitle className="leading-snug">{scheme.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <CardDescription className="text-sm text-foreground/80 mb-4">
                                {scheme.description}
                            </CardDescription>

                            <div className="space-y-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-blue-500" />
                                    <span>Req: Aadhar, Land Record, Bank Passbook</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    <span className="font-medium text-foreground">{t('deadline')}: {scheme.deadline}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-4">
                                {scheme.tags.map(tag => (
                                    <span key={tag} className="text-[10px] px-2 py-1 bg-secondary rounded-sm text-secondary-foreground border border-secondary">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                            <Button className="w-full" onClick={() => window.open(scheme.link, '_blank')}>
                                {t('view_portal')} <ExternalLink className="ml-2 h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                )) : (
                    <div className="col-span-full h-64 flex flex-col items-center justify-center text-muted-foreground">
                        <Info className="w-12 h-12 mb-4 opacity-20" />
                        <p>{t('no_data_found')} "{searchTerm}"</p>
                        <Button variant="link" onClick={() => { setSearchTerm(""); setActiveCategory("All"); }}>Clear Filters</Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Schemes;
