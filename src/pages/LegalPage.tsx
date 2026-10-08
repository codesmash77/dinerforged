import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ShieldCheck, FileText, ArrowLeft } from 'lucide-react';

export const LegalPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'privacy';
  const isPrivacy = type === 'privacy';

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 text-slate-100">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors mb-6 shadow-sm"
      >
        <ArrowLeft className="h-4 w-4 text-culinary-400" />
        <span>Back to Dinerforged</span>
      </Link>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 md:p-10 shadow-2xl backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
          {isPrivacy ? (
            <ShieldCheck className="h-8 w-8 text-culinary-400 shrink-0" />
          ) : (
            <FileText className="h-8 w-8 text-culinary-400 shrink-0" />
          )}
          <div>
            <h1 className="text-2xl font-bold text-white">
              {isPrivacy ? 'Privacy Policy' : 'Terms of Service'}
            </h1>
            <p className="text-xs text-slate-400">Dinerforged Culinary Operating System</p>
          </div>
        </div>

        {/* Content Body */}
        <div className="mt-6 space-y-6 text-sm text-slate-300 leading-relaxed">
          {isPrivacy ? (
            <>
              <div>
                <p className="font-semibold text-slate-100">Last updated: October 2026</p>
                <p className="mt-2">
                  Dinerforged ("we", "our", or "us") respects your privacy. This Privacy Policy explains how our Progressive Web Application handles your information when you use our local-first culinary application and optional Google Drive cloud sync features.
                </p>
              </div>

              <div>
                <h2 className="text-base font-bold text-culinary-400">1. Data Storage & Local-First Architecture</h2>
                <p className="mt-1">
                  All your custom recipes, meal plans, and pantry lists are stored locally on your device using browser LocalStorage and IndexedDB. We do not collect, store, or monetize your personal culinary data on external servers.
                </p>
              </div>

              <div>
                <h2 className="text-base font-bold text-culinary-400">2. Google Drive Integration</h2>
                <p className="mt-1">
                  If you choose to use our optional Google Drive Cloud Sync feature, Dinerforged requests access strictly via the restricted <code className="text-culinary-300 font-mono">drive.file</code> OAuth scope. This means Dinerforged can only read, create, and modify dedicated backup files (<code className="text-culinary-300 font-mono">dinerforged-backup.json</code>) created by the application itself. We never access, scan, or store any other files in your Google Drive.
                </p>
              </div>

              <div>
                <h2 className="text-base font-bold text-culinary-400">3. Third-Party AI Services</h2>
                <p className="mt-1">
                  When utilizing optional AI features (such as the AI Chef or Recipe OCR parser), prompts and images are securely processed via serverless proxies to OpenRouter / Groq API models without retaining personally identifiable information.
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="font-semibold text-slate-100">Last updated: October 2026</p>
                <p className="mt-2">
                  Welcome to Dinerforged. By accessing or using our application, you agree to be bound by these Terms of Service.
                </p>
              </div>

              <div>
                <h2 className="text-base font-bold text-culinary-400">1. Acceptance of Terms</h2>
                <p className="mt-1">
                  Dinerforged is provided as an offline-capable Progressive Web App for personal culinary planning, recipe management, and cooking guidance.
                </p>
              </div>

              <div>
                <h2 className="text-base font-bold text-culinary-400">2. User Responsibilities & Backups</h2>
                <p className="mt-1">
                  Because Dinerforged is built on a local-first architecture, you are responsible for maintaining backups of your local data. While we provide Google Drive backup tools, we are not liable for any data loss resulting from cleared browser storage or local device failures.
                </p>
              </div>

              <div>
                <h2 className="text-base font-bold text-culinary-400">3. Disclaimer of Warranties</h2>
                <p className="mt-1">
                  Cooking times, food science computations, and nutritional estimators provided by Dinerforged are for informational and educational purposes. Always verify internal food temperatures and safety guidelines independently.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};