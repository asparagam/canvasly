import React, { useState } from 'react';
import { X, Database, Check, Play, RefreshCw, Server, ShieldCheck, Terminal } from 'lucide-react';
import { NeonDatabaseService } from '../../services/neonService';

interface NeonDatabaseModalProps {
  onClose: () => void;
  onSyncNow: () => void;
}

export const NeonDatabaseModal: React.FC<NeonDatabaseModalProps> = ({ onClose, onSyncNow }) => {
  const [connectionUrl, setConnectionUrl] = useState(NeonDatabaseService.getConnectionUrl());
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; version?: string } | null>(null);
  
  const [sqlInput, setSqlInput] = useState('SELECT * FROM canvasly_projects LIMIT 5;');
  const [isExecutingSql, setIsExecutingSql] = useState(false);
  const [queryOutput, setQueryOutput] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'connection' | 'sql-console' | 'schema'>('connection');

  const handleSaveConnection = () => {
    NeonDatabaseService.setConnectionUrl(connectionUrl);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    handleSaveConnection();
    const res = await NeonDatabaseService.testConnection();
    setTestResult(res);
    setIsTesting(false);
  };

  const handleRunSql = async () => {
    if (!sqlInput.trim()) return;
    setIsExecutingSql(true);
    try {
      const res = await NeonDatabaseService.executeSql(sqlInput);
      setQueryOutput(JSON.stringify(res, null, 2));
    } catch (err: any) {
      setQueryOutput(`SQL Error: ${err?.message || 'Execution failed'}`);
    }
    setIsExecutingSql(false);
  };

  const handleInitSchema = async () => {
    setIsTesting(true);
    const res = await NeonDatabaseService.initializeSchema();
    setTestResult({
      success: res.success,
      message: res.log
    });
    setIsTesting(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-[#0f111a] border border-emerald-500/40 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-5 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-[#0a0b10] rounded-[10px] flex items-center justify-center">
                <Database className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                Neon Serverless Postgres
                <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  http://neon.com/
                </span>
              </h3>
              <p className="text-xs text-slate-400">Database connection & live SQL engine</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-[#0d0e15] p-1 rounded-xl gap-1">
          <button
            onClick={() => setActiveTab('connection')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 ${
              activeTab === 'connection' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" /> Connection
          </button>
          <button
            onClick={() => setActiveTab('sql-console')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 ${
              activeTab === 'sql-console' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" /> SQL Console
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 ${
              activeTab === 'schema' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Schema Migration
          </button>
        </div>

        {/* CONNECTION TAB */}
        {activeTab === 'connection' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Neon Connection String (Postgres Serverless Driver)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={connectionUrl}
                  onChange={(e) => setConnectionUrl(e.target.value)}
                  placeholder="postgres://user:pass@ep-xyz.neon.tech/neondb?sslmode=require"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Get your serverless connection string from your Neon Dashboard at <a href="https://neon.tech" target="_blank" rel="noreferrer" className="text-emerald-400 underline">neon.tech</a>
              </span>
            </div>

            {testResult && (
              <div
                className={`p-3 rounded-xl border text-xs font-mono ${
                  testResult.success
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-red-950/40 border-red-500/40 text-red-300'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  {testResult.success ? <Check className="w-4 h-4" /> : '✕'} {testResult.message}
                </div>
                {testResult.version && (
                  <div className="text-[10px] text-slate-400 mt-1">{testResult.version}</div>
                )}
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={onSyncNow}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" /> Sync Canvas to Neon
              </button>

              <button
                onClick={handleTestConnection}
                disabled={isTesting}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-1.5"
              >
                {isTesting ? 'Testing...' : 'Test Connection'}
              </button>
            </div>
          </div>
        )}

        {/* SQL CONSOLE TAB */}
        {activeTab === 'sql-console' && (
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300">Run SQL Query on Neon Serverless Postgres</label>
                <span className="text-[10px] font-mono text-emerald-400">@neondatabase/serverless</span>
              </div>
              <textarea
                value={sqlInput}
                onChange={(e) => setSqlInput(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleRunSql}
                disabled={isExecutingSql}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-xs flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Execute Query
              </button>
            </div>

            {queryOutput && (
              <div className="bg-[#090a10] border border-slate-800 rounded-xl p-3 max-h-48 overflow-y-auto font-mono text-[11px] text-slate-300">
                <pre>{queryOutput}</pre>
              </div>
            )}
          </div>
        )}

        {/* SCHEMA MIGRATION TAB */}
        {activeTab === 'schema' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-300">
              Canvasly can automatically construct required relational tables (`canvasly_projects`, `canvasly_screens`) in your Neon Postgres database.
            </p>

            <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl font-mono text-[11px] text-slate-400">
              CREATE TABLE IF NOT EXISTS canvasly_projects (...);<br />
              CREATE TABLE IF NOT EXISTS canvasly_screens (...);
            </div>

            <button
              onClick={handleInitSchema}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 font-semibold text-xs text-white shadow-lg shadow-emerald-600/20"
            >
              Run Neon Schema Migration
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
