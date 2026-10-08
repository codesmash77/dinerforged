import React from 'react';
import { X } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms';
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  const isPrivacy = type === 'privacy';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-900 text-slate-200 shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-xl font-bold text-white">
            {isPrivacy ? 'Privacy Policy — Dinerforged' : 'Terms of Service — Dinerforged'}
          </h2>
          <button onClick={onClose} className="rounded-full bg-slate-800 p-2 text-slate-300 hover:bg-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-sm text-slate-300 pr-2">
          {isPrivacy ? (
            <>
              <p className="font-semibold text-slate-100">Last updated: October 2026</p>
              <p>
                Dinerforged ("we", "our", or "us") respects your privacy. This Privacy Policy explains how our Progressive Web Application handles your information when you use our local-first culinary application and optional Google Drive cloud sync features.
              </p>
              <h3 className="text-base font-bold text-culinary-400 mt-3">1. Data Storage & Local-First Architecture</h3>
              <p>
                All your custom recipes, meal plans, and pantry lists are stored locally on your device using browser LocalStorage and IndexedDB. We do not collect, store, or monetize your personal culinary data on external servers.
              </p>
              <h3 className="text-base font-bold text-culinary-400 mt-3">2. Google Drive Integration</h3>
              <p>
                If you choose to use our optional Google Drive Cloud Sync feature, Dinerforged requests access strictly via the restricted <code className="text-culinary-300">drive.file</code> OAuth scope. This means Dinerforged can only read, create, and modify dedicated backup files (<code className="text-culinary-300">dinerforged-backup.json</code>) created by the application itself. We never access, scan, or store any other files in your Google Drive.
              </p>
              <h3 className="text-base font-bold text-culinary-400 mt-3">3. Third-Party AI Services</h3>
              <p>
                When utilizing optional AI features (such as the AI Chef or Recipe OCR parser), prompts and images are securely processed via serverless proxies to OpenRouter / Groq API models without retaining personally identifiable information.
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold text-slate-100">Last updated: October 2026</p>
              <p>
                Welcome to Dinerforged. By accessing or using our application, you agree to be bound by these Terms of Service.
              </p>
              <h3 className="text-base font-bold text-culinary-400 mt-3">1. Acceptance of Terms</h3>
              <p>
                Dinerforged is provided as an offline-capable Progressive Web App for personal culinary planning, recipe management, and cooking guidance.
              </p>
              <h3 className="text-base font-bold text-culinary-400 mt-3">2. User Responsibilities & Backups</h3>
              <p>
                Because Dinerforged is built on a local-first architecture, you are responsible for maintaining backups of your local data. While we provide Google Drive backup tools, we are not liable for any data loss resulting from cleared browser storage or local device failures.
              </p>
              <h3 className="text-base font-bold text-culinary-400 mt-3">3. Disclaimer of Warranties</h3>
              <p>
                Cooking times, food science computations, and nutritional estimators provided by Dinerforged are for informational and educational purposes. Always verify internal food temperatures and safety guidelines independently.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-culinary-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-culinary-400 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};