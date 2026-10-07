import React, { useState, useMemo } from 'react';
import { BookOpen, Search, Plus, Edit, Trash2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { techniques as seedTechniques } from '../data/techniques';
import { utensils as seedUtensils } from '../data/utensils';
import { Technique, Utensil } from '../types';
import { TechniqueModal } from '../components/techniques/TechniqueCard';
import { UtensilModal } from '../components/utensils/UtensilCard';

export const TechniquesPage: React.FC = () => {
  const { customTechniques, customUtensils, deleteCustomTechnique, deleteCustomUtensil } = useAppStore();

  const [activeTab, setActiveTab] = useState<'techniques' | 'utensils'>('techniques');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isTechModalOpen, setIsTechModalOpen] = useState(false);
  const [techToEdit, setTechToEdit] = useState<Technique | null>(null);

  const [isUtensilModalOpen, setIsUtensilModalOpen] = useState(false);
  const [utensilToEdit, setUtensilToEdit] = useState<Utensil | null>(null);

  const allTechniques = useMemo(() => [...customTechniques, ...seedTechniques], [customTechniques]);
  const allUtensils = useMemo(() => [...customUtensils, ...seedUtensils], [customUtensils]);

  const filteredTechniques = allTechniques.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredUtensils = allUtensils.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-6 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-culinary-500" /> Culinary Science & Equipment Guides
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Master foundational food chemistry techniques and equipment care.
          </p>
        </div>

        {activeTab === 'techniques' ? (
          <button
            onClick={() => { setTechToEdit(null); setIsTechModalOpen(true); }}
            className="flex items-center gap-2 rounded-xl bg-culinary-500 px-4 py-2.5 text-sm font-bold text-slate-950 hover:bg-culinary-400 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Technique
          </button>
        ) : (
          <button
            onClick={() => { setUtensilToEdit(null); setIsUtensilModalOpen(true); }}
            className="flex items-center gap-2 rounded-xl bg-culinary-500 px-4 py-2.5 text-sm font-bold text-slate-950 hover:bg-culinary-400 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Utensil
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 my-6 border-b dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('techniques')}
          className={`pb-2 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'techniques' ? 'border-culinary-500 text-culinary-500' : 'border-transparent text-slate-500'
          }`}
        >
          Cooking Techniques ({allTechniques.length})
        </button>
        <button
          onClick={() => setActiveTab('utensils')}
          className={`pb-2 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'utensils' ? 'border-culinary-500 text-culinary-500' : 'border-transparent text-slate-500'
          }`}
        >
          Utensils & Cookware ({allUtensils.length})
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 relative w-full sm:w-96">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder={activeTab === 'techniques' ? 'Search techniques...' : 'Search cookware...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-white"
        />
      </div>

      {/* Content Grid */}
      {activeTab === 'techniques' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTechniques.map((tech) => (
            <div key={tech.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-culinary-500">{tech.category}</span>
                  {tech.isCustom && (
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setTechToEdit(tech); setIsTechModalOpen(true); }} className="p-1 text-slate-400 hover:text-white">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => deleteCustomTechnique(tech.id)} className="p-1 text-red-400 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{tech.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">{tech.description}</p>
                {tech.scienceExplanation && (
                  <div className="rounded-lg bg-culinary-500/10 p-3 text-xs text-culinary-600 dark:text-culinary-400">
                    🔬 <strong>Science Explanation:</strong> {tech.scienceExplanation}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredUtensils.map((utensil) => (
            <div key={utensil.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-culinary-500">{utensil.category}</span>
                  {utensil.isCustom && (
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setUtensilToEdit(utensil); setIsUtensilModalOpen(true); }} className="p-1 text-slate-400 hover:text-white">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => deleteCustomUtensil(utensil.id)} className="p-1 text-red-400 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{utensil.name}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">{utensil.description}</p>
                
                <div className="space-y-2">
                  {utensil.materialInfo && (
                    <div className="rounded-lg bg-slate-100 p-2.5 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      🛠️ <strong>Material:</strong> {utensil.materialInfo}
                    </div>
                  )}
                  {utensil.thermalRetention && (
                    <div className="rounded-lg bg-amber-500/10 p-2.5 text-xs text-amber-600 dark:text-amber-400">
                      🔥 <strong>Thermal Retention:</strong> {utensil.thermalRetention}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <TechniqueModal isOpen={isTechModalOpen} onClose={() => setIsTechModalOpen(false)} techniqueToEdit={techToEdit} />
      <UtensilModal isOpen={isUtensilModalOpen} onClose={() => setIsUtensilModalOpen(false)} utensilToEdit={utensilToEdit} />
    </div>
  );
};