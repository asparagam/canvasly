import React, { useState } from 'react';
import { X, Cloud, Check, ExternalLink, HardDrive } from 'lucide-react';
import { GoogleCloudStorageService } from '../../services/googleCloudService';
import type { Project } from '../../types';

interface GoogleCloudModalProps {
  project: Project;
  onClose: () => void;
}

export const GoogleCloudModal: React.FC<GoogleCloudModalProps> = ({ project, onClose }) => {
  const [bucketName, setBucketName] = useState(GoogleCloudStorageService.getBucketName());
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ success: boolean; message: string; gcsUrl: string } | null>(null);

  const handleSaveToGcs = async () => {
    setIsSaving(true);
    GoogleCloudStorageService.setBucketName(bucketName);
    const res = await GoogleCloudStorageService.saveProjectToGoogleCloud(project);
    setSaveStatus(res);
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-[#0e101a] border border-cyan-500/40 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-[#0a0b10] rounded-[10px] flex items-center justify-center">
                <Cloud className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Google Cloud Storage</h3>
              <p className="text-xs text-slate-400">Save & backup project canvas objects</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Google Cloud Storage Bucket Target
            </label>
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
              <span className="text-xs text-slate-500 font-mono">gs://</span>
              <input
                type="text"
                value={bucketName}
                onChange={(e) => setBucketName(e.target.value)}
                className="bg-transparent text-xs font-mono text-cyan-300 flex-1 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2 text-xs">
            <div className="font-semibold text-white flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-cyan-400" /> Project Object payload
            </div>
            <div className="text-[11px] text-slate-400">
              File: <strong className="text-slate-200">{project.name}.json</strong> ({project.screens.length} screens, {project.flowConnections.length} flow paths)
            </div>
          </div>

          {saveStatus && (
            <div className={`p-3 rounded-xl border text-xs ${
              saveStatus.success ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300' : 'bg-red-950/40 border-red-500/40 text-red-300'
            }`}>
              <div className="font-bold flex items-center gap-1.5">
                {saveStatus.success ? <Check className="w-4 h-4 text-emerald-400" /> : '✕'} {saveStatus.message}
              </div>
              {saveStatus.gcsUrl && (
                <a
                  href={saveStatus.gcsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] font-mono text-cyan-400 underline block mt-1 break-all flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" /> {saveStatus.gcsUrl}
                </a>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
              Cancel
            </button>
            <button
              onClick={handleSaveToGcs}
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 font-semibold text-xs text-white shadow-lg flex items-center gap-1.5"
            >
              <Cloud className="w-4 h-4" /> {isSaving ? 'Saving to GCS...' : 'Save to Google Cloud'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
