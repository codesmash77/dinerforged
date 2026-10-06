import React, { useState, useMemo } from 'react';
import { Search, BookOpen, Utensils } from 'lucide-react';
import { techniques as seedTechniques } from '../data/techniques';
import { utensils as seedUtensils } from '../data/utensils';
import { TechniqueCard } from '../components/techniques/TechniqueCard';
import { UtensilCard } from '../components/utensils/UtensilCard';

export const TechniquesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'techniques' | 'utensils'>('techniques');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Categories for filtering
  const categories = useMemo(() => {
    if (activeTab === 'techniques') {
      return ['All', ...Array.from(new Set(seedTechniques.map((t) => t.category)))];
    }
    return ['All', ...Array.from(new Set(seedUtensils.map((u) => u.category)))];
  }, [activeTab]);

  const filteredTechniques = useMemo(() => {
    return seedTechniques.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.scienceExplanation.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  const filteredUtensils = useMemo(() => {
    return seedUtensils.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.materialInfo.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'All' || u.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">
          Culinary Science & Equipment Guides
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Master foundational food chemistry techniques, avoid common pitfalls, and preserve cookware.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 mb-6">
        <button
          onClick={() => { setActiveTab('techniques'); setSelectedCategory('All'); }}
          className={`flex items-center gap-2 border-b-2 pb-3 font-semibold text-sm transition-colors ${
            activeTab === 'techniques'
              ? 'border-culinary-500 text-culinary-600 dark:text-culinary-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <BookOpen className="h-4 w-4" /> Cooking Techniques ({seedTechniques.length})
        </button>
        <button
          onClick={() => { setActiveTab('utensils'); setSelectedCategory('All'); }}
          className={`flex items-center gap-2 border-b-2 pb-3 font-semibold text-sm transition-colors ${
            activeTab === 'utensils'
              ? 'border-culinary-500 text-culinary-600 dark:text-culinary-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Utensils className="h-4 w-4" /> Utensils & Cookware ({seedUtensils.length})
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white dark:bg-culinary-500 dark:text-slate-950'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content Feed */}
      {activeTab === 'techniques' ? (
        <div className="space-y-4 max-w-4xl">
          {filteredTechniques.map((technique) => (
            <TechniqueCard key={technique.id} technique={technique} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredUtensils.map((utensil) => (
            <UtensilCard key={utensil.id} utensil={utensil} />
          ))}
        </div>
      )}
    </div>
  );
};