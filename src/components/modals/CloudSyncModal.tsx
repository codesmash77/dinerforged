import React, { useState, useEffect } from 'react';
import { Cloud, Upload, Download, CheckCircle2, AlertCircle, X, ShieldCheck } from 'lucide-react';
import { initGoogleTokenClient, uploadBackupToDrive, downloadBackupFromDrive } from '../../services/googleDriveSync';
import { LegalModal } from './LegalModal';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestoreState: (state: any) => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({ isOpen, onClose, onRestoreState }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenClient, setTokenClient] = useState<any>(null);
  const [activeLegalModal, setActiveLegalModal] = useState<'privacy' | 'terms' | null>(null);

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

  useEffect(() => {
    if (isOpen && window.google) {
      try {
        const client = initGoogleTokenClient(GOOGLE_CLIENT_ID, (token) => {
          setAccessToken(token);
          setStatusMessage({ text: 'Connected to Google Drive successfully!', type: 'success' });
        });
        setTokenClient(client);
      } catch (e) {
        console.error('Error initializing Google client:', e);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAuthenticate = () => {
    if (tokenClient) {
      tokenClient.requestAccessToken();
    } else {
      setStatusMessage({ text: 'Google API script still loading. Please try again in a moment.', type: 'error' });
    }
  };

  const handleBackup = async () => {
    if (!accessToken) return;
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const appData = {
        recipes: localStorage.getItem('dinerforged_recipes'),
        mealPlanner: localStorage.getItem('dinerforged_planner'),
        favorites: localStorage.getItem('dinerforged_favorites'),
        techniques: localStorage.getItem('dinerforged_techniques'),
        timestamp: new Date().toISOString(),
      };

      await uploadBackupToDrive(appData, accessToken);
      setStatusMessage({ text: 'Backup uploaded successfully to your Google Drive!', type: 'success' });
    } catch (error) {
      setStatusMessage({ text: 'Backup failed. Please re-authenticate and try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!accessToken) return;
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const backupData = await downloadBackupFromDrive(accessToken);
      if (!backupData) {
        setStatusMessage({ text: 'No existing Dinerforged backup found in your Google Drive.', type: 'error' });
        setIsLoading(false);
        return;
      }

      if (backupData.recipes) localStorage.setItem('dinerforged_recipes', backupData.recipes);
      if (backupData.mealPlanner) localStorage.setItem('dinerforged_planner', backupData.mealPlanner);
      if (backupData.favorites) localStorage.setItem('dinerforged_favorites', backupData.favorites);
      if (backupData.techniques) localStorage.setItem('dinerforged_techniques', backupData.techniques);

      onRestoreState(backupData);
      setStatusMessage({ text: 'Data restored successfully from Google Drive! Refreshing state...', type: 'success' });
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      setStatusMessage({ text: 'Failed to restore backup from Google Drive.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 text-white shadow-2xl">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5 text-culinary-400 font-bold text-base">
              <Cloud className="h-6 w-6" />
              <span>Google Drive Cloud Sync</span>
            </div>
            <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content Body */}
          <div className="mt-5 space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              Protect your custom recipes, meal plans, and bookmarks across devices. Data is stored privately in a dedicated backup file inside <strong className="text-white">your own Google Drive</strong>.
            </p>

            <div className="flex items-center gap-2 rounded-xl bg-slate-800/60 p-3 border border-slate-700/50 text-xs text-slate-300">
              <ShieldCheck className="h-5 w-5 text-culinary-400 shrink-0" />
              <span>Uses restricted <code className="text-culinary-400 font-mono">drive.file</code> scope—Dinerforged can only access files it creates.</span>
            </div>

            {statusMessage && (
              <div className={`flex items-center gap-2 rounded-xl p-3 text-xs font-medium ${
                statusMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                statusMessage.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
                'bg-sky-500/10 text-sky-400 border border-sky-500/30'
              }`}>
                {statusMessage.type === 'success' ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
                <span>{statusMessage.text}</span>
              </div>
            )}

            {!accessToken ? (
              <button
                onClick={handleAuthenticate}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-culinary-500 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-culinary-400 transition-colors shadow-lg"
              >
                <Cloud className="h-4 w-4" />
                <span>Connect Google Drive</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleBackup}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-culinary-500 px-4 py-3 text-xs font-bold text-slate-950 hover:bg-culinary-400 transition-colors disabled:opacity-50"
                >
                  <Upload className="h-4 w-4" />
                  <span>{isLoading ? 'Syncing...' : 'Backup Now'}</span>
                </button>

                <button
                  onClick={handleRestore}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-3 text-xs font-bold text-white hover:bg-slate-700 transition-colors border border-slate-700 disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  <span>{isLoading ? 'Restoring...' : 'Restore Data'}</span>
                </button>
              </div>
            )}

            {/* Legal Links Footer for Google Cloud OAuth Consent Screen requirements */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-center gap-3 text-[11px] text-slate-400">
              <button onClick={() => setActiveLegalModal('privacy')} className="hover:text-culinary-400 underline transition-colors">
                Privacy Policy
              </button>
              <span>•</span>
              <button onClick={() => setActiveLegalModal('terms')} className="hover:text-culinary-400 underline transition-colors">
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Render Legal Modals if requested */}
      {activeLegalModal && (
        <LegalModal type={activeLegalModal} onClose={() => setActiveLegalModal(null)} />
      )}
    </>
  );
};