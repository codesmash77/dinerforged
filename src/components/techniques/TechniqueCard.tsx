import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Technique } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface TechniqueModalProps {
  isOpen: boolean;
  onClose: () => void;
  techniqueToEdit?: Technique | null;
}

export const TechniqueModal: React.FC<TechniqueModalProps> = ({ isOpen, onClose, techniqueToEdit }) => {
  const { addCustomTechnique, updateCustomTechnique } = useAppStore();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Sauces & Chemistry');
  const [description, setDescription] = useState('');
  const [scienceExplanation, setScienceExplanation] = useState('');

  useEffect(() => {
    if (techniqueToEdit) {
      setTitle(techniqueToEdit.title || '');
      setCategory(techniqueToEdit.category || 'Sauces & Chemistry');
      setDescription(techniqueToEdit.description || '');
      setScienceExplanation(techniqueToEdit.scienceExplanation || '');
    } else {
      setTitle('');
      setCategory('Sauces & Chemistry');
      setDescription('');
      setScienceExplanation('');
    }
  }, [techniqueToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const data: Technique = {
      id: techniqueToEdit ? techniqueToEdit.id : `tech-${Date.now()}`,
      title,
      category,
      description,
      scienceExplanation,
      isCustom: true,
    };

    if (techniqueToEdit) {
      updateCustomTechnique(techniqueToEdit.id, data);
    } else {
      addCustomTechnique(data);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 my-8">
        <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {techniqueToEdit ? 'Edit Custom Technique' : 'Add Custom Technique'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Technique Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sous-Vide Tempering"
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
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Science Explanation</label>
            <textarea
              rows={3}
              value={scienceExplanation}
              onChange={(e) => setScienceExplanation(e.target.value)}
              placeholder="Detail the molecular or chemical breakdown..."
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white resize-none"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t dark:border-slate-800">
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-slate-600 dark:text-slate-300">Cancel</button>
            <button type="submit" className="rounded-lg bg-culinary-500 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-culinary-400">Save Technique</button>
          </div>
        </form>
      </div>
    </div>
  );
};