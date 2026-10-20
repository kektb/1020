import React, { useState, useEffect } from 'react';
import { Dilemma, UserVote } from '../types';
import {
  ChevronLeft,
  ChevronRight,
  Send,
  HelpCircle,
  CheckCircle,
  MessageSquare,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface DilemmaQuizProps {
  dilemmas: Dilemma[];
  votes: Record<string, UserVote>;
  onVoteChange: (dilemmaId: string, option: 'A' | 'B', reason: string) => void;
  onSubmitAll: () => void;
  isSubmitting: boolean;
}

export const DilemmaQuiz: React.FC<DilemmaQuizProps> = ({
  dilemmas,
  votes,
  onVoteChange,
  onSubmitAll,
  isSubmitting
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPhilosophy, setShowPhilosophy] = useState(false);

  const currentDilemma = dilemmas[currentIndex];
  const currentVote = currentDilemma ? votes[currentDilemma.id] : undefined;
  const currentOption = currentVote?.selected_option;
  const currentReason = currentVote?.reason || '';

  // Local state for fast responsive typing in the reason textarea
  const [reasonText, setReasonText] = useState(currentReason);

  // Sync reason text when dilemma changes
  useEffect(() => {
    setReasonText(currentVote?.reason || '');
    setShowPhilosophy(false);
  }, [currentIndex, currentDilemma?.id]);

  if (!currentDilemma) {
    return (
      <div className="py-20 text-center text-slate-500">
        문항을 불러오는 중입니다...
      </div>
    );
  }

  const handleSelectOption = (option: 'A' | 'B') => {
    onVoteChange(currentDilemma.id, option, reasonText);
  };

  const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setReasonText(val);
    if (currentOption) {
      onVoteChange(currentDilemma.id, currentOption, val);
    }
  };

  const handleReasonBlur = () => {
    if (currentOption) {
      onVoteChange(currentDilemma.id, currentOption, reasonText);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (!currentOption) {
      alert('선택지 A 또는 B 중 하나를 선택해 주세요.');
      return;
    }
    if (currentIndex < dilemmas.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const isLastQuestion = currentIndex === dilemmas.length - 1;
  const answeredCount = Object.keys(votes).filter((k) => votes[k]?.selected_option).length;
  const allAnswered = dilemmas.every((d) => votes[d.id]?.selected_option);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      {/* Top Progress & Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[11px] font-bold">
              딜레마 {currentIndex + 1} / {dilemmas.length}
            </span>
            {currentDilemma.category && (
              <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                {currentDilemma.category}
              </span>
            )}
          </div>
          <span className="text-slate-600">
            완료: <strong className="text-indigo-600">{answeredCount}</strong> / {dilemmas.length} 문항
          </span>
        </div>

        {/* Linear progress bar */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
          <div
            className="h-full bg-slate-900 transition-all duration-300 rounded-full"
            style={{ width: `${((currentIndex + 1) / dilemmas.length) * 100}%` }}
          />
        </div>

        {/* Quick Stepper Dots */}
        <div className="flex justify-between items-center mt-3 px-1">
          {dilemmas.map((d, idx) => {
            const isFilled = Boolean(votes[d.id]?.selected_option);
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={d.id}
                onClick={() => setCurrentIndex(idx)}
                className={`flex items-center justify-center text-xs font-semibold rounded-lg transition-all ${
                  isCurrent
                    ? 'w-7 h-7 bg-slate-900 text-white shadow-xs'
                    : isFilled
                    ? 'w-7 h-7 bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'
                    : 'w-7 h-7 bg-slate-100 text-slate-400 hover:bg-slate-200'
                }`}
                title={`딜레마 ${idx + 1}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Dilemma Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden mb-8">
        {/* Card Header & Title */}
        <div className="p-6 sm:p-8 border-b border-slate-100">
          <div className="flex items-center justify-between gap-4 mb-3">
            <span className="text-xs font-semibold tracking-wider uppercase text-indigo-600 bg-indigo-50/80 px-2.5 py-1 rounded-md border border-indigo-100">
              Scenario #{currentIndex + 1}
            </span>
            {currentDilemma.philosophical_context && (
              <button
                type="button"
                onClick={() => setShowPhilosophy(!showPhilosophy)}
                className="flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-800 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                <span>{showPhilosophy ? '철학적 배경 닫기' : '철학적 관점 힌트'}</span>
              </button>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
            {currentDilemma.title}
          </h1>

          {/* Collapsible Philosophical Context */}
          {showPhilosophy && currentDilemma.philosophical_context && (
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed animate-in fade-in">
              <div className="font-semibold text-slate-900 flex items-center space-x-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>관련된 윤리학적 논쟁</span>
              </div>
              <p>{currentDilemma.philosophical_context}</p>
            </div>
          )}
        </div>

        {/* Scenario Detailed Description */}
        <div className="p-6 sm:p-8 bg-slate-50/40 border-b border-slate-100">
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
            {currentDilemma.description}
          </p>
        </div>

        {/* Options Selection (A vs B) */}
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">
              선택지를 결정해 주세요 (1개 선택)
            </span>
            {currentOption && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{currentOption} 선택됨</span>
              </span>
            )}
          </div>

          {/* Option A Card */}
          <div
            onClick={() => handleSelectOption('A')}
            className={`cursor-pointer p-5 sm:p-6 rounded-xl border-2 transition-all relative ${
              currentOption === 'A'
                ? 'border-indigo-600 bg-indigo-50/40 shadow-xs ring-1 ring-indigo-500/20'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 bg-white'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                  currentOption === 'A'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                A
              </div>
              <div className="flex-1 pr-2">
                <p className={`text-sm sm:text-base leading-relaxed ${
                  currentOption === 'A' ? 'text-indigo-950 font-semibold' : 'text-slate-800'
                }`}>
                  {currentDilemma.option_a.replace(/^A:\s*/, '')}
                </p>
              </div>
              {currentOption === 'A' && (
                <div className="shrink-0 text-indigo-600">
                  <CheckCircle className="w-5 h-5" />
                </div>
              )}
            </div>
          </div>

          {/* Option B Card */}
          <div
            onClick={() => handleSelectOption('B')}
            className={`cursor-pointer p-5 sm:p-6 rounded-xl border-2 transition-all relative ${
              currentOption === 'B'
                ? 'border-indigo-600 bg-indigo-50/40 shadow-xs ring-1 ring-indigo-500/20'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 bg-white'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                  currentOption === 'B'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                B
              </div>
              <div className="flex-1 pr-2">
                <p className={`text-sm sm:text-base leading-relaxed ${
                  currentOption === 'B' ? 'text-indigo-950 font-semibold' : 'text-slate-800'
                }`}>
                  {currentDilemma.option_b.replace(/^B:\s*/, '')}
                </p>
              </div>
              {currentOption === 'B' && (
                <div className="shrink-0 text-indigo-600">
                  <CheckCircle className="w-5 h-5" />
                </div>
              )}
            </div>
          </div>

          {/* Qualitative Reason Input (선택 사항 서술형) */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="reason-input"
                className="text-xs font-semibold text-slate-700 flex items-center space-x-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                <span>이 선택을 하신 이유를 간단히 적어주세요</span>
                <span className="text-slate-400 font-normal">(선택사항)</span>
              </label>
              <span className="text-[11px] text-slate-400">
                {reasonText.length}/300자
              </span>
            </div>

            <textarea
              id="reason-input"
              value={reasonText}
              onChange={handleReasonChange}
              onBlur={handleReasonBlur}
              maxLength={300}
              placeholder="예: 다수의 생명 보호가 최우선이라고 생각합니다. 또는 원작자의 동의 없는 학습은 명백한 수탈이라고 봅니다..."
              rows={3}
              className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-slate-400 bg-white"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              * 작성하신 의견은 결과 화면의 '서술형 의견 모아보기'에 익명으로 집계됩니다.
            </p>
          </div>
        </div>

        {/* Card Footer Navigation */}
        <div className="p-6 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
              currentIndex === 0
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-700 hover:bg-slate-200/70 border border-slate-200 bg-white'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>이전 문항</span>
          </button>

          {!isLastQuestion ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!currentOption}
              className={`flex items-center space-x-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                currentOption
                  ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>다음 문항</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onSubmitAll}
              disabled={!allAnswered || isSubmitting}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm ${
                allAnswered && !isSubmitting
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>결과 집계 중...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>투표 완료 및 통계 보기</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
