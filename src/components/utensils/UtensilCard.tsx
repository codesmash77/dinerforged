import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Utensil } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface UtensilModalProps {
  isOpen: boolean;
  onClose: () => void;
  utensilToEdit?: Utensil | null;
}

export const UtensilModal: React.FC<UtensilModalProps> = ({ isOpen, onClose, utensilToEdit }) => {
  const { addCustomUtensil, updateCustomUtensil } = useAppStore();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Cookware');
  const [description, setDescription] = useState('');
  const [materialInfo, setMaterialInfo] = useState('');
  const [thermalRetention, setThermalRetention] = useState('');

  useEffect(() => {
    if (utensilToEdit) {
      setName(utensilToEdit.name || '');
      setCategory(utensilToEdit.category || 'Cookware');
      setDescription(utensilToEdit.description || '');
      setMaterialInfo(utensilToEdit.materialInfo || '');
      setThermalRetention(utensilToEdit.thermalRetention || '');
    } else {
      setName('');
      setCategory('Cookware');
      setDescription('');
      setMaterialInfo('');
      setThermalRetention('');
    }
  }, [utensilToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const data: Utensil = {
      id: utensilToEdit ? utensilToEdit.id : `utensil-${Date.now()}`,
      name,
      category,
      description,
      materialInfo,
      thermalRetention,
      isCustom: true,
    };

    if (utensilToEdit) {
      updateCustomUtensil(utensilToEdit.id, data);
    } else {
      addCustomUtensil(data);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 my-8">
        <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {utensilToEdit ? 'Edit Custom Utensil' : 'Add Custom Utensil'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Utensil Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Mandoline Slicer"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Material Info</label>
            <input
              type="text"
              value={materialInfo}
              onChange={(e) => setMaterialInfo(e.target.value)}
              placeholder="e.g. High-carbon stainless steel alloy"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Thermal Retention</label>
            <input
              type="text"
              value={thermalRetention}
              onChange={(e) => setThermalRetention(e.target.value)}
              placeholder="e.g. High / Exceptional / Low"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t dark:border-slate-800">
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-slate-600 dark:text-slate-300">Cancel</button>
            <button type="submit" className="rounded-lg bg-culinary-500 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-culinary-400">Save Utensil</button>
          </div>
        </form>
      </div>
    </div>
  );
};