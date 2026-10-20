import React, { useState, useEffect, useCallback } from 'react';
import { Dilemma, ResponseItem, UserProfile, UserVote } from './types';
import { Header } from './components/Header';
import { PreSurveyModal } from './components/PreSurveyModal';
import { DilemmaQuiz } from './components/DilemmaQuiz';
import { ResultsDashboard } from './components/ResultsDashboard';
import { SupabaseModal } from './components/SupabaseModal';
import { Toast } from './components/Toast';
import {
  fetchDilemmas,
  fetchResponses,
  submitUserResponses,
  likeResponse,
  getLikedResponseIds,
  getSupabaseCredentials
} from './lib/supabase';
import { INITIAL_DILEMMAS } from './lib/defaultData';
import { Sparkles, Brain, Scale, ShieldAlert, Users, Award, BookOpen } from 'lucide-react';

const STORAGE_KEY_PROFILE = 'ai_ethics_user_profile';
const STORAGE_KEY_VOTES = 'ai_ethics_user_votes';
const STORAGE_KEY_COMPLETED = 'ai_ethics_survey_completed';

export default function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [dilemmas, setDilemmas] = useState<Dilemma[]>(INITIAL_DILEMMAS);
  const [responses, setResponses] = useState<ResponseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [userVotes, setUserVotes] = useState<Record<string, UserVote>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VOTES);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [hasCompleted, setHasCompleted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_COMPLETED) === 'true';
    } catch {
      return false;
    }
  });

  const [isPreSurveyOpen, setIsPreSurveyOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check Supabase connection status
  const checkConnectionStatus = useCallback(() => {
    const creds = getSupabaseCredentials();
    setIsSupabaseConnected(creds.isConfigured);
  }, []);

  // Initial Data Load
  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    checkConnectionStatus();
    try {
      const [dilemmasResult, responsesResult] = await Promise.all([
        fetchDilemmas(),
        fetchResponses()
      ]);
      setDilemmas(dilemmasResult.data);
      setResponses(responsesResult);
      setLikedIds(getLikedResponseIds());
    } catch (e) {
      console.warn('Data loading warning:', e);
    } finally {
      setIsLoading(false);
    }
  }, [checkConnectionStatus]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Open pre-survey if first visit and no profile
  useEffect(() => {
    if (!userProfile) {
      setIsPreSurveyOpen(true);
    }
  }, [userProfile]);

  // Save profile
  const handleSaveProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    setIsPreSurveyOpen(false);
    setToastMessage('기초 정보가 정상적으로 저장되었습니다.');
  };

  // Record user option & reason vote
  const handleVoteChange = (dilemmaId: string, option: 'A' | 'B', reason: string) => {
    setUserVotes((prev) => {
      const updated = {
        ...prev,
        [dilemmaId]: {
          dilemma_id: dilemmaId,
          selected_option: option,
          reason
        }
      };
      localStorage.setItem(STORAGE_KEY_VOTES, JSON.stringify(updated));
      return updated;
    });
  };

  // Submit all votes and view results
  const handleSubmitAllVotes = async () => {
    if (!userProfile) {
      setIsPreSurveyOpen(true);
      return;
    }

    const voteList: UserVote[] = Object.values(userVotes);
    if (voteList.length < dilemmas.length) {
      alert('모든 문항(5개)의 선택지를 결정해 주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitUserResponses(userProfile, voteList);
      // Reload responses to include new submissions and updated stats
      const updatedResponses = await fetchResponses();
      setResponses(updatedResponses);

      setHasCompleted(true);
      localStorage.setItem(STORAGE_KEY_COMPLETED, 'true');
      setToastMessage('투표가 완료되었습니다! 전체 통계를 확인해 보세요.');
    } catch (e) {
      console.error('Submit error:', e);
      setHasCompleted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Like a qualitative response
  const handleLikeReason = async (responseId: string) => {
    const success = await likeResponse(responseId);
    if (success) {
      setLikedIds((prev) => [...prev, responseId]);
      setResponses((prev) =>
        prev.map((r) =>
          r.id === responseId ? { ...r, likes_count: (r.likes_count || 0) + 1 } : r
        )
      );
      setToastMessage('의견에 공감했습니다.');
    }
  };

  // Add extra opinion directly on the Results page
  const handleAddOpinion = async (dilemmaId: string, option: 'A' | 'B', reason: string) => {
    const profile = userProfile || {
      gender: '기타',
      age_group: '20대',
      ai_perception: 3
    };

    const newVote: UserVote = {
      dilemma_id: dilemmaId,
      selected_option: option,
      reason
    };

    await submitUserResponses(profile, [newVote]);
    const updated = await fetchResponses();
    setResponses(updated);
  };

  // Reset quiz to participate again
  const handleResetQuiz = () => {
    if (window.confirm('투표를 처음부터 다시 진행하시겠습니까? (이전 통계는 보존됩니다)')) {
      setUserVotes({});
      setHasCompleted(false);
      localStorage.removeItem(STORAGE_KEY_VOTES);
      localStorage.removeItem(STORAGE_KEY_COMPLETED);
      setToastMessage('새로운 투표가 시작되었습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation Header */}
      <Header
        userProfile={userProfile}
        onOpenProfile={() => setIsPreSurveyOpen(true)}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        isSupabaseConnected={isSupabaseConnected}
        onResetQuiz={handleResetQuiz}
        hasVoted={hasCompleted}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-xs text-slate-500 font-medium">
              AI 윤리 딜레마 플랫폼을 불러오는 중...
            </p>
          </div>
        ) : !hasCompleted ? (
          <div>
            {/* Hero Sub-header */}
            <div className="bg-white border-b border-slate-200/80 py-8 px-4 text-center">
              <div className="max-w-3xl mx-auto">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-3">
                  <Brain className="w-3.5 h-3.5" />
                  <span>5가지 핵심 인공지능 윤리 딜레마</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  기계가 생사를 결정하는 순간, 당신의 선택은?
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl mx-auto leading-relaxed">
                  자율주행, 의료, 채용, 창작물, 군사 무기까지. 5개의 윤리적 딜레마에 투표하고 우리 사회의 세대별·성별 생각 통계를 확인해 보세요.
                </p>
              </div>
            </div>

            {/* Dilemma Step Flow */}
            <DilemmaQuiz
              dilemmas={dilemmas}
              votes={userVotes}
              onVoteChange={handleVoteChange}
              onSubmitAll={handleSubmitAllVotes}
              isSubmitting={isSubmitting}
            />
          </div>
        ) : (
          /* Step 3: Comprehensive Results & Statistics */
          userProfile && (
            <ResultsDashboard
              dilemmas={dilemmas}
              responses={responses}
              userProfile={userProfile}
              userVotes={userVotes}
              onResetQuiz={handleResetQuiz}
              onLikeReason={handleLikeReason}
              onAddOpinion={handleAddOpinion}
              likedIds={likedIds}
              showToast={(msg) => setToastMessage(msg)}
            />
          )
        )}
      </main>

      {/* Clean & Minimal Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4 mt-auto text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Scale className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-slate-700">
              AI 윤리 딜레마 참답 플랫폼
            </span>
            <span className="text-slate-300">|</span>
            <span>AI Ethics Dilemma Platform</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSupabaseModalOpen(true)}
              className="text-slate-600 hover:text-indigo-600 transition-colors font-medium flex items-center space-x-1"
            >
              <span>Supabase DB 설정</span>
            </button>
            <span className="text-slate-300">·</span>
            <button
              onClick={() => setIsPreSurveyOpen(true)}
              className="text-slate-600 hover:text-indigo-600 transition-colors font-medium"
            >
              <span>기초정보 수정</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Toast */}
      <PreSurveyModal
        isOpen={isPreSurveyOpen}
        initialProfile={userProfile}
        onSave={handleSaveProfile}
        onClose={() => setIsPreSurveyOpen(false)}
        canCloseWithoutSaving={Boolean(userProfile)}
      />

      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onConfigUpdated={() => {
          checkConnectionStatus();
          loadInitialData();
        }}
        showToast={(msg) => setToastMessage(msg)}
      />

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
