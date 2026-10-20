import React from 'react';
import { UserProfile } from '../types';
import { Scale, Database, User, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';

interface HeaderProps {
  userProfile: UserProfile | null;
  onOpenProfile: () => void;
  onOpenSupabaseModal: () => void;
  isSupabaseConnected: boolean;
  onResetQuiz: () => void;
  hasVoted: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  userProfile,
  onOpenProfile,
  onOpenSupabaseModal,
  isSupabaseConnected,
  onResetQuiz,
  hasVoted
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onResetQuiz}>
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <Scale className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">
                AI 윤리 딜레마
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600 border border-slate-200 hidden sm:inline-block">
                참답 플랫폼
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              인공지능 시대, 당신의 선택과 사회적 합의의 통계
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Supabase Status Button */}
          <button
            onClick={onOpenSupabaseModal}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isSupabaseConnected
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
            title="데이터베이스 연동 상태 확인 및 설정"
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden md:inline">
              {isSupabaseConnected ? 'Supabase 연동' : '데모/로컬 DB'}
            </span>
            {isSupabaseConnected ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            )}
          </button>

          {/* User Profile Chip */}
          {userProfile ? (
            <button
              onClick={onOpenProfile}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200/70 transition-colors"
              title="사전 설문 정보 확인 및 수정"
            >
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span className="font-medium">
                {userProfile.age_group} · {userProfile.gender}
              </span>
              <span className="text-[10px] bg-white px-1.5 py-0.5 rounded text-indigo-700 border border-slate-200">
                인식 {userProfile.ai_perception}점
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenProfile}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
            >
              <User className="w-3.5 h-3.5" />
              <span>기초정보 입력</span>
            </button>
          )}

          {/* Reset / Retry Button if already voted */}
          {hasVoted && (
            <button
              onClick={onResetQuiz}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
              title="다시 투표하기"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">다시하기</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
