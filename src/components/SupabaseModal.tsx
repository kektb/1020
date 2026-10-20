import React, { useState } from 'react';
import { Database, CheckCircle2, AlertCircle, Copy, Check, ExternalLink, X, RefreshCw } from 'lucide-react';
import { getSupabaseCredentials, saveCustomSupabaseConfig, testSupabaseConnection } from '../lib/supabase';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdated: () => void;
  showToast: (msg: string) => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  onConfigUpdated,
  showToast
}) => {
  const credentials = getSupabaseCredentials();
  const [url, setUrl] = useState(credentials.url || '');
  const [anonKey, setAnonKey] = useState(credentials.anonKey || '');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const handleTest = async () => {
    if (!url || !anonKey) {
      setTestResult({ success: false, message: 'URL과 Anon Key를 모두 입력해 주세요.' });
      return;
    }
    setIsTesting(true);
    setTestResult(null);
    const result = await testSupabaseConnection(url.trim(), anonKey.trim());
    setTestResult(result);
    setIsTesting(false);
  };

  const handleSave = () => {
    saveCustomSupabaseConfig(url.trim(), anonKey.trim());
    onConfigUpdated();
    showToast('Supabase 설정이 저장되었습니다.');
    onClose();
  };

  const handleClear = () => {
    saveCustomSupabaseConfig('', '');
    setUrl('');
    setAnonKey('');
    setTestResult(null);
    onConfigUpdated();
    showToast('로컬 데모 모드로 전환되었습니다.');
  };

  const handleCopySql = () => {
    fetch('/supabase_schema.sql')
      .then((res) => (res.ok ? res.text() : ''))
      .catch(() => '')
      .then((text) => {
        const query =
          text ||
          `-- supabase_schema.sql 은 프로젝트 루트에 포함되어 있습니다.
-- dilemmas 및 responses 테이블을 생성합니다.`;
        navigator.clipboard.writeText(query);
        setCopiedSql(true);
        setTimeout(() => setCopiedSql(false), 2500);
        showToast('SQL 스키마가 클립보드에 복사되었습니다.');
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Database className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Supabase 데이터베이스 연동 설정
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                클라우드 PostgreSQL(Supabase) 또는 로컬 데모 모드를 선택합니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Current Status Badge */}
          <div
            className={`p-4 rounded-xl border flex items-start space-x-3 ${
              credentials.isConfigured
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                : 'bg-amber-50/70 border-amber-200 text-amber-900'
            }`}
          >
            {credentials.isConfigured ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="text-xs leading-relaxed">
              <strong className="font-bold text-sm block mb-0.5">
                {credentials.isConfigured
                  ? 'Supabase 연동 활성화 상태'
                  : '로컬 데모 모드 작동 중'}
              </strong>
              {credentials.isConfigured
                ? '실시간 Supabase DB(dilemmas, responses)와 통신하여 투표 및 통계가 클라우드에 영구 저장됩니다.'
                : '현재 VITE_SUPABASE_URL이 설정되지 않아 브라우저 로컬 스토리지와 내장 시드 데이터를 활용하여 원활하게 동작하고 있습니다.'}
            </div>
          </div>

          {/* Connection Form */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Supabase Project URL (VITE_SUPABASE_URL)
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Supabase Anon Public API Key (VITE_SUPABASE_ANON_KEY)
              </label>
              <input
                type="password"
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>

          {/* Test connection result */}
          {testResult && (
            <div
              className={`p-3 rounded-xl border text-xs ${
                testResult.success
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              {testResult.message}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={handleTest}
              disabled={isTesting || !url || !anonKey}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 transition-colors flex items-center space-x-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>연결 테스트</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={!url || !anonKey}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-xs"
            >
              설정 저장
            </button>

            {credentials.isCustom && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors ml-auto"
              >
                설정 초기화 (로컬 모드)
              </button>
            )}
          </div>

          {/* SQL Schema Copy Helper */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800">
                SQL 스키마 쿼리 (`supabase_schema.sql`)
              </span>
              <button
                onClick={handleCopySql}
                className="flex items-center space-x-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">복사 완료!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>SQL 복사하기</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Supabase 대시보드의 <strong>SQL Editor</strong>에 붙여넣고 실행하면 <code className="bg-slate-100 px-1 rounded">dilemmas</code> 및 <code className="bg-slate-100 px-1 rounded">responses</code> 테이블과 5개 기본 딜레마 및 시드 데이터가 자동 생성됩니다.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
