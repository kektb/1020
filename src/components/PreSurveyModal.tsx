import React, { useState } from 'react';
import { Gender, AgeGroup, AIPerception, UserProfile } from '../types';
import { UserCheck, Sparkles, X, ShieldCheck } from 'lucide-react';

interface PreSurveyModalProps {
  isOpen: boolean;
  initialProfile: UserProfile | null;
  onSave: (profile: UserProfile) => void;
  onClose?: () => void;
  canCloseWithoutSaving?: boolean;
}

const GENDERS: Gender[] = ['남성', '여성', '기타', '답변거부'];
const AGE_GROUPS: AgeGroup[] = ['10대 이하', '20대', '30대', '40대', '50대', '60대 이상'];

const PERCEPTION_LABELS: Record<AIPerception, { label: string; desc: string }> = {
  1: { label: '매우 부정적', desc: '위험과 부작용이 크며 엄격한 규제가 필요하다' },
  2: { label: '다소 부정적', desc: '사회적 혼란 및 일자리 위협이 우려된다' },
  3: { label: '중립 / 보통', desc: '긍정적인 면과 부정적인 면이 비슷하다' },
  4: { label: '다소 긍정적', desc: '인간의 생산성과 편의를 증진시킨다' },
  5: { label: '매우 긍정적', desc: '인류의 난제를 해결할 획기적 기회다' }
};

export const PreSurveyModal: React.FC<PreSurveyModalProps> = ({
  isOpen,
  initialProfile,
  onSave,
  onClose,
  canCloseWithoutSaving = false
}) => {
  const [gender, setGender] = useState<Gender>(initialProfile?.gender || '20대' ? (initialProfile?.gender || '남성') : '남성');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(initialProfile?.age_group || '20대');
  const [aiPerception, setAiPerception] = useState<AIPerception>(initialProfile?.ai_perception || 3);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gender || !ageGroup || !aiPerception) {
      setError('모든 항목을 선택해 주세요.');
      return;
    }
    const profile: UserProfile = {
      gender,
      age_group: ageGroup,
      ai_perception: aiPerception,
      savedAt: new Date().toISOString()
    };
    onSave(profile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                기초 정보 입력 (사전 설문)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                세대별·성별 통계 분석을 위한 기초 정보입니다. (익명 처리)
              </p>
            </div>
          </div>

          {canCloseWithoutSaving && onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs">
              {error}
            </div>
          )}

          {/* 1. 성별 선택 */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              1. 성별을 선택해 주세요
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {GENDERS.map((g) => {
                const isSelected = gender === g;
                return (
                  <button
                    type="button"
                    key={g}
                    onClick={() => setGender(g)}
                    className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-medium border text-center transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-semibold shadow-xs ring-1 ring-indigo-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. 연령대 선택 */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              2. 연령대를 선택해 주세요
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {AGE_GROUPS.map((a) => {
                const isSelected = ageGroup === a;
                return (
                  <button
                    type="button"
                    key={a}
                    onClick={() => setAgeGroup(a)}
                    className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-medium border text-center transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-semibold shadow-xs ring-1 ring-indigo-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {a}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. AI에 대한 인식 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-slate-800">
                3. 평소 인공지능(AI)에 대한 인식은 어떠신가요?
              </label>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                {aiPerception}점 : {PERCEPTION_LABELS[aiPerception].label}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mb-2">
              {([1, 2, 3, 4, 5] as AIPerception[]).map((score) => {
                const isSelected = aiPerception === score;
                return (
                  <button
                    type="button"
                    key={score}
                    onClick={() => setAiPerception(score)}
                    className={`py-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600 text-white font-bold shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-base sm:text-lg font-bold">{score}</span>
                    <span className="text-[10px] hidden sm:inline-block opacity-90">
                      {score === 1 ? '매우 부정' : score === 5 ? '매우 긍정' : score === 3 ? '중립' : ''}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 flex items-center justify-between">
              <span>{PERCEPTION_LABELS[aiPerception].desc}</span>
            </div>
          </div>

          {/* Anonymous & Privacy note */}
          <div className="flex items-center space-x-2 text-[11px] text-slate-500 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              개인정보는 수집되지 않으며, 선택한 정보는 오직 딜레마 통계 분석에만 익명으로 활용됩니다.
            </span>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-all flex items-center justify-center space-x-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>정보 저장하고 딜레마 시작하기</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
