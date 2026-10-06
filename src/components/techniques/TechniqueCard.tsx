import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, Lightbulb, FlaskConical } from 'lucide-react';
import { Technique } from '../../types';

interface TechniqueCardProps {
  technique: Technique;
}

export const TechniqueCard: React.FC<TechniqueCardProps> = ({ technique }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex cursor-pointer items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-culinary-500/10 text-culinary-600 dark:text-culinary-400">
            <FlaskConical className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-culinary-600 dark:text-culinary-400">
              {technique.category}
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {technique.title}
            </h3>
          </div>
        </div>

        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="border-t border-slate-100 bg-slate-50/50 p-5 space-y-4 dark:border-slate-800 dark:bg-slate-900/40">
          {/* Science Explanation */}
          <div>
            <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
              Food Science Breakdown
            </h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {technique.scienceExplanation}
            </p>
          </div>

          {/* Common Mistakes */}
          <div>
            <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase text-red-600 dark:text-red-400 mb-2">
              <AlertTriangle className="h-3.5 w-3.5" /> Common Pitfalls
            </h4>
            <ul className="space-y-1">
              {technique.commonMistakes.map((mistake, idx) => (
                <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pro Tips */}
          <div>
            <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase text-culinary-600 dark:text-culinary-400 mb-2">
              <Lightbulb className="h-3.5 w-3.5" /> Chef's Pro Tips
            </h4>
            <ul className="space-y-1">
              {technique.proTips.map((tip, idx) => (
                <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                  <span className="text-culinary-500 font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};