import React, { useState, useMemo } from 'react';
import { Dilemma, ResponseItem, UserProfile, UserVote, Gender, AgeGroup } from '../types';
import {
  BarChart3,
  MessageSquare,
  Share2,
  RotateCcw,
  ThumbsUp,
  CheckCircle2,
  Sparkles,
  Users,
  Compass,
  TrendingUp,
  Send,
  Layers,
  Sparkle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResultsDashboardProps {
  dilemmas: Dilemma[];
  responses: ResponseItem[];
  userProfile: UserProfile;
  userVotes: Record<string, UserVote>;
  onResetQuiz: () => void;
  onLikeReason: (responseId: string) => void;
  onAddOpinion: (dilemmaId: string, option: 'A' | 'B', reason: string) => void;
  likedIds: string[];
  showToast: (msg: string) => void;
}

type TabType = 'stats' | 'opinions';
type OpinionFilter = 'ALL' | 'A' | 'B';

const ALL_GENDERS: Gender[] = ['여성', '남성', '기타', '답변거부'];
const ALL_AGE_GROUPS: AgeGroup[] = ['10대 이하', '20대', '30대', '40대', '50대', '60대 이상'];

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  dilemmas,
  responses,
  userProfile,
  userVotes,
  onResetQuiz,
  onLikeReason,
  onAddOpinion,
  likedIds,
  showToast
}) => {
  const [selectedDilemmaIndex, setSelectedDilemmaIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>('stats');
  const [opinionFilter, setOpinionFilter] = useState<OpinionFilter>('ALL');

  // Multi-dimensional Intersectional Filter States (성별 × 연령대 중복 교차 필터)
  const [selectedGender, setSelectedGender] = useState<'ALL' | Gender>('ALL');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<'ALL' | AgeGroup>('ALL');
  const [filterOpinionsByIntersection, setFilterOpinionsByIntersection] = useState(false);

  // Quick reply state for adding new opinion right on this dashboard
  const [newReasonInput, setNewReasonInput] = useState('');
  const [newReasonOption, setNewReasonOption] = useState<'A' | 'B'>('A');
  const [isSubmittingReason, setIsSubmittingReason] = useState(false);

  const currentDilemma = dilemmas[selectedDilemmaIndex] || dilemmas[0];
  const userVote = currentDilemma ? userVotes[currentDilemma.id] : undefined;

  // Filter all responses for the current dilemma
  const dilemmaResponses = useMemo(() => {
    if (!currentDilemma) return [];
    return responses.filter((r) => r.dilemma_id === currentDilemma.id);
  }, [responses, currentDilemma]);

  // Overall Statistics for current dilemma (Baseline)
  const overallStats = useMemo(() => {
    const total = dilemmaResponses.length;
    const countA = dilemmaResponses.filter((r) => r.selected_option === 'A').length;
    const countB = dilemmaResponses.filter((r) => r.selected_option === 'B').length;
    const percentA = total > 0 ? Math.round((countA / total) * 100) : 50;
    const percentB = total > 0 ? 100 - percentA : 50;
    return { total, countA, countB, percentA, percentB };
  }, [dilemmaResponses]);

  // Intersectional Subgroup Statistics (성별 & 연령대 중복 교차 집계)
  const intersectionStats = useMemo(() => {
    const matched = dilemmaResponses.filter((r) => {
      const matchG = selectedGender === 'ALL' || r.gender === selectedGender;
      const matchA = selectedAgeGroup === 'ALL' || r.age_group === selectedAgeGroup;
      return matchG && matchA;
    });

    const total = matched.length;
    const countA = matched.filter((r) => r.selected_option === 'A').length;
    const countB = matched.filter((r) => r.selected_option === 'B').length;
    const percentA = total > 0 ? Math.round((countA / total) * 100) : 0;
    const percentB = total > 0 ? 100 - percentA : 0;

    const diffFromOverallA = total > 0 ? percentA - overallStats.percentA : 0;

    return {
      matched,
      total,
      countA,
      countB,
      percentA,
      percentB,
      diffFromOverallA
    };
  }, [dilemmaResponses, selectedGender, selectedAgeGroup, overallStats]);

  // 2D Cross-Tabulation Matrix (성별 × 연령대 매트릭스 데이터 생성)
  const crossMatrix = useMemo(() => {
    return ALL_GENDERS.map((g) => {
      const rowAgeData = ALL_AGE_GROUPS.map((a) => {
        const cellItems = dilemmaResponses.filter((r) => r.gender === g && r.age_group === a);
        const cellTotal = cellItems.length;
        const cellA = cellItems.filter((r) => r.selected_option === 'A').length;
        const cellB = cellItems.filter((r) => r.selected_option === 'B').length;
        const cellPercentA = cellTotal > 0 ? Math.round((cellA / cellTotal) * 100) : null;
        const cellPercentB = cellTotal > 0 ? 100 - (cellPercentA ?? 0) : null;
        return {
          gender: g,
          ageGroup: a,
          total: cellTotal,
          countA: cellA,
          countB: cellB,
          percentA: cellPercentA,
          percentB: cellPercentB
        };
      });

      // Row subtotal for gender
      const rowTotalItems = dilemmaResponses.filter((r) => r.gender === g);
      const rowTotal = rowTotalItems.length;
      const rowA = rowTotalItems.filter((r) => r.selected_option === 'A').length;
      const rowPercentA = rowTotal > 0 ? Math.round((rowA / rowTotal) * 100) : null;

      return {
        gender: g,
        cells: rowAgeData,
        rowTotal,
        rowPercentA
      };
    });
  }, [dilemmaResponses]);

  // Qualitative Opinions list (with optional intersection filter)
  const filteredOpinions = useMemo(() => {
    return dilemmaResponses
      .filter((r) => r.reason && r.reason.trim().length > 0)
      .filter((r) => {
        if (!filterOpinionsByIntersection) return true;
        const matchG = selectedGender === 'ALL' || r.gender === selectedGender;
        const matchA = selectedAgeGroup === 'ALL' || r.age_group === selectedAgeGroup;
        return matchG && matchA;
      })
      .filter((r) => {
        if (opinionFilter === 'ALL') return true;
        return r.selected_option === opinionFilter;
      });
  }, [dilemmaResponses, opinionFilter, filterOpinionsByIntersection, selectedGender, selectedAgeGroup]);

  // Trigger celebratory confetti on initial view
  React.useEffect(() => {
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  }, []);

  // Update default option for new reason to user's vote
  React.useEffect(() => {
    if (userVote?.selected_option) {
      setNewReasonOption(userVote.selected_option);
    }
  }, [userVote]);

  const handleShare = () => {
    if (navigator.clipboard) {
      const text = `[AI 윤리 딜레마 참답 플랫폼]\n${currentDilemma.title}\n전체 결과: A(${overallStats.percentA}%) vs B(${overallStats.percentB}%)\n나의 선택: ${userVote?.selected_option || '미참여'}\n\n지금 확인하기: ${window.location.href}`;
      navigator.clipboard.writeText(text);
      showToast('통계 결과와 링크가 클립보드에 복사되었습니다.');
    } else {
      showToast('주소창 URL을 복사해 공유해 보세요.');
    }
  };

  const handleAddNewOpinion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReasonInput.trim()) return;

    setIsSubmittingReason(true);
    onAddOpinion(currentDilemma.id, newReasonOption, newReasonInput.trim());
    setNewReasonInput('');
    setIsSubmittingReason(false);
    showToast('소중한 의견이 등록되었습니다.');
  };

  // Helper to set specific intersection
  const setIntersection = (gender: 'ALL' | Gender, age: 'ALL' | AgeGroup) => {
    setSelectedGender(gender);
    setSelectedAgeGroup(age);
  };

  const myOption = userVote?.selected_option;
  const isMajority = myOption
    ? (myOption === 'A' && overallStats.percentA >= 50) || (myOption === 'B' && overallStats.percentB >= 50)
    : false;

  const isCrossFilterActive = selectedGender !== 'ALL' || selectedAgeGroup !== 'ALL';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Top Banner & Overview */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                <Sparkles className="w-3 h-3 mr-1" />
                설문 완료 및 중복 통계 분석
              </span>
              <span className="text-xs text-slate-400">총 5개 딜레마 집계 완료</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              AI 윤리 딜레마 참답 결과 분석
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              성별과 연령대를 자유롭게 조합하여 특정 집단(예: <strong>여성이면서 10대</strong>)의 생각 차이를 확인해 보세요.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleShare}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200/80 transition-colors border border-slate-200"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>결과 공유</span>
            </button>
            <button
              onClick={onResetQuiz}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>다시 투표하기</span>
            </button>
          </div>
        </div>

        {/* 5 Dilemma Navigation Tabs */}
        <div className="pt-6">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            문항별 결과 탐색 (1 ~ 5)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {dilemmas.map((d, idx) => {
              const isSelected = idx === selectedDilemmaIndex;
              const v = userVotes[d.id];
              return (
                <button
                  key={d.id}
                  onClick={() => setSelectedDilemmaIndex(idx)}
                  className={`p-2.5 rounded-xl border text-left transition-all relative ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-900">딜레마 {idx + 1}</span>
                    {v?.selected_option && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-slate-100 text-indigo-700 border border-slate-200">
                        선택: {v.selected_option}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-1">
                    {d.title}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Dilemma Focus Box */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden mb-8">
        {/* Title & Baseline Verdict Summary */}
        <div className="p-6 sm:p-8 border-b border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              딜레마 #{selectedDilemmaIndex + 1} · {currentDilemma.category}
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500">
                총 응답자: <strong className="text-slate-900">{overallStats.total}명</strong>
              </span>
              {myOption && (
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>
                    내 선택 {myOption} ({isMajority ? '다수파' : '소수파'})
                  </span>
                </span>
              )}
            </div>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
            {currentDilemma.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
            {currentDilemma.description}
          </p>

          {/* Primary Baseline Ratio Bar */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="flex justify-between items-end text-xs sm:text-sm font-semibold mb-2">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                  A
                </span>
                <span className="text-slate-800">
                  선택지 A: <strong className="text-indigo-600">{overallStats.percentA}%</strong> ({overallStats.countA}표)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-slate-800">
                  선택지 B: <strong className="text-slate-900">{overallStats.percentB}%</strong> ({overallStats.countB}표)
                </span>
                <span className="w-6 h-6 rounded bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
                  B
                </span>
              </div>
            </div>

            {/* Visual ratio bar */}
            <div className="w-full h-8 bg-slate-100 rounded-xl overflow-hidden flex border border-slate-200 relative p-0.5">
              <div
                className="h-full bg-indigo-600 rounded-l-lg transition-all duration-500 flex items-center justify-start pl-3 text-white text-xs font-bold"
                style={{ width: `${overallStats.percentA}%` }}
              >
                {overallStats.percentA >= 15 ? `${overallStats.percentA}%` : ''}
              </div>
              <div
                className="h-full bg-slate-800 rounded-r-lg transition-all duration-500 flex items-center justify-end pr-3 text-white text-xs font-bold"
                style={{ width: `${overallStats.percentB}%` }}
              >
                {overallStats.percentB >= 15 ? `${overallStats.percentB}%` : ''}
              </div>
            </div>

            {/* Options Labels preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs">
              <div className={`p-3 rounded-xl border ${myOption === 'A' ? 'border-indigo-500 bg-indigo-50/40' : 'border-slate-200 bg-slate-50'}`}>
                <div className="font-bold text-slate-900 mb-1 flex items-center justify-between">
                  <span>선택지 A</span>
                  {myOption === 'A' && <span className="text-indigo-600 font-semibold">(내가 선택)</span>}
                </div>
                <p className="text-slate-600 leading-relaxed">{currentDilemma.option_a}</p>
              </div>
              <div className={`p-3 rounded-xl border ${myOption === 'B' ? 'border-indigo-500 bg-indigo-50/40' : 'border-slate-200 bg-slate-50'}`}>
                <div className="font-bold text-slate-900 mb-1 flex items-center justify-between">
                  <span>선택지 B</span>
                  {myOption === 'B' && <span className="text-indigo-600 font-semibold">(내가 선택)</span>}
                </div>
                <p className="text-slate-600 leading-relaxed">{currentDilemma.option_b}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Controls: 중복 교차 통계 분석 vs 서술형 의견 모음 */}
        <div className="bg-slate-50/70 border-b border-slate-200 px-6 sm:px-8 py-3 flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'stats'
                  ? 'bg-white text-slate-900 border border-slate-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>성별 × 연령대 중복 교차 통계</span>
            </button>
            <button
              onClick={() => setActiveTab('opinions')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'opinions'
                  ? 'bg-white text-slate-900 border border-slate-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <span>서술형 의견 모음 ({filteredOpinions.length})</span>
            </button>
          </div>
        </div>

        {/* Tab 1 Content: 성별 × 연령대 중복 교차 통계 (Intersectional Cross-Statistics) */}
        {activeTab === 'stats' && (
          <div className="p-6 sm:p-8 space-y-6">
            {/* Explanatory Header */}
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center space-x-1.5">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  <span>중복 교차 조건 필터링</span>
                </h3>
                <span className="text-[11px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium border border-indigo-100">
                  성별 + 연령대 다차원 분석
                </span>
              </div>
              <p className="text-xs text-slate-500">
                원하는 성별과 연령대를 각각 선택하면, 두 조건을 <strong>동시에 만족하는 집단(예: 여성이면서 10대 이하)</strong>의 투표 통계와 전체 평균 대비 차이를 즉시 확인할 수 있습니다.
              </p>
            </div>

            {/* Quick Combination Preset Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs font-semibold text-slate-400 mr-1">빠른 예시 조합:</span>
              <button
                type="button"
                onClick={() => setIntersection('여성', '10대 이하')}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                  selectedGender === '여성' && selectedAgeGroup === '10대 이하'
                    ? 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                }`}
              >
                ✨ 여성이면서 10대 이하
              </button>
              <button
                type="button"
                onClick={() => setIntersection('여성', '20대')}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                  selectedGender === '여성' && selectedAgeGroup === '20대'
                    ? 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                }`}
              >
                여성 · 20대
              </button>
              <button
                type="button"
                onClick={() => setIntersection('남성', '20대')}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                  selectedGender === '남성' && selectedAgeGroup === '20대'
                    ? 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                }`}
              >
                남성 · 20대
              </button>
              <button
                type="button"
                onClick={() => setIntersection('남성', '40대')}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                  selectedGender === '남성' && selectedAgeGroup === '40대'
                    ? 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                }`}
              >
                남성 · 40대
              </button>
              <button
                type="button"
                onClick={() => setIntersection(userProfile.gender, userProfile.age_group)}
                className="text-xs px-2.5 py-1 rounded-lg border border-indigo-200 bg-indigo-50/70 text-indigo-800 hover:bg-indigo-100 font-medium"
              >
                👤 내 그룹 ({userProfile.gender} · {userProfile.age_group})
              </button>
              {isCrossFilterActive && (
                <button
                  type="button"
                  onClick={() => setIntersection('ALL', 'ALL')}
                  className="text-xs px-2 py-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ml-auto"
                >
                  ✕ 전체 초기화
                </button>
              )}
            </div>

            {/* Filter Selector Panel */}
            <div className="bg-slate-50/80 rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-4">
              {/* 1. 성별 필터 */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  1. 성별 선택
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedGender('ALL')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      selectedGender === 'ALL'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs font-bold'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    전체 성별
                  </button>
                  {ALL_GENDERS.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setSelectedGender(g)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                        selectedGender === g
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs font-bold'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. 연령대 필터 */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  2. 연령대 선택
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedAgeGroup('ALL')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      selectedAgeGroup === 'ALL'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs font-bold'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    전체 연령대
                  </button>
                  {ALL_AGE_GROUPS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setSelectedAgeGroup(a)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                        selectedAgeGroup === a
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs font-bold'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Filtered Subset Result Presentation Card */}
            <div className="p-5 sm:p-6 rounded-2xl border-2 border-indigo-200 bg-indigo-50/20 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-indigo-100">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-indigo-600 animate-pulse" />
                  <span className="font-bold text-slate-900 text-sm sm:text-base">
                    선택된 조건:&nbsp;
                    <span className="text-indigo-600 underline underline-offset-4 font-extrabold">
                      {selectedGender === 'ALL' ? '모든 성별' : `${selectedGender}`}
                    </span>
                    &nbsp;이면서&nbsp;
                    <span className="text-indigo-600 underline underline-offset-4 font-extrabold">
                      {selectedAgeGroup === 'ALL' ? '모든 연령대' : `${selectedAgeGroup}`}
                    </span>
                    인 응답자
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-600">
                    표본 수: <strong className="text-indigo-600 font-bold">{intersectionStats.total}명</strong>
                    {overallStats.total > 0 && (
                      <span className="text-slate-400 ml-1">
                        (전체의 {Math.round((intersectionStats.total / overallStats.total) * 100)}%)
                      </span>
                    )}
                  </span>
                  {selectedGender === userProfile.gender && selectedAgeGroup === userProfile.age_group && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-600 text-white">
                      나의 프로필 일치
                    </span>
                  )}
                </div>
              </div>

              {intersectionStats.total > 0 ? (
                <div>
                  {/* Gauge bar for this subgroup */}
                  <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-1.5">
                    <span className="text-indigo-700">
                      A 선택: {intersectionStats.percentA}% ({intersectionStats.countA}명)
                    </span>
                    <span className="text-slate-700">
                      B 선택: {intersectionStats.percentB}% ({intersectionStats.countB}명)
                    </span>
                  </div>

                  <div className="w-full h-6 bg-slate-100 rounded-xl overflow-hidden flex border border-slate-200">
                    <div
                      className="h-full bg-indigo-600 transition-all duration-500 flex items-center justify-center text-white text-[11px] font-bold"
                      style={{ width: `${intersectionStats.percentA}%` }}
                    >
                      {intersectionStats.percentA >= 10 ? `${intersectionStats.percentA}%` : ''}
                    </div>
                    <div
                      className="h-full bg-slate-800 transition-all duration-500 flex items-center justify-center text-white text-[11px] font-bold"
                      style={{ width: `${intersectionStats.percentB}%` }}
                    >
                      {intersectionStats.percentB >= 10 ? `${intersectionStats.percentB}%` : ''}
                    </div>
                  </div>

                  {/* Comparison with Overall Average Callout */}
                  <div className="mt-4 p-3 rounded-xl bg-white border border-indigo-100 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span className="text-slate-700">
                        전체 평균(A {overallStats.percentA}% vs B {overallStats.percentB}%) 대비:
                      </span>
                    </div>

                    <div className="font-bold">
                      {intersectionStats.diffFromOverallA > 0 ? (
                        <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                          A 선택 비율이 +{intersectionStats.diffFromOverallA}%p 더 높음
                        </span>
                      ) : intersectionStats.diffFromOverallA < 0 ? (
                        <span className="text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                          B 선택 비율이 +{Math.abs(intersectionStats.diffFromOverallA)}%p 더 높음
                        </span>
                      ) : (
                        <span className="text-slate-500">전체 평균과 완벽히 일치</span>
                      )}
                    </div>
                  </div>

                  {/* Quick link to opinions of this subgroup */}
                  {intersectionStats.matched.some((r) => r.reason) && (
                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setFilterOpinionsByIntersection(true);
                          setActiveTab('opinions');
                        }}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center space-x-1"
                      >
                        <span>이 집단({selectedGender === 'ALL' ? '전체' : selectedGender} · {selectedAgeGroup === 'ALL' ? '전체' : selectedAgeGroup})의 서술형 의견 바로 보기 →</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-slate-500 bg-white rounded-xl border border-dashed border-slate-200">
                  선택하신 조건({selectedGender} + {selectedAgeGroup})의 응답자가 아직 데이터베이스에 없습니다.<br />
                  다른 연령대나 성별을 선택해 보세요.
                </div>
              )}
            </div>

            {/* 2D Cross-Tabulation Matrix: 성별 × 연령대 전체 일람표 */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                  <Users className="w-4 h-4 text-slate-700" />
                  <span>전체 교차 매트릭스 일람 (성별 × 연령대)</span>
                </h4>
                <span className="text-[11px] text-slate-400">
                  * 표의 셀을 클릭하면 해당 조건으로 위 필터가 즉시 전환됩니다.
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-2xs">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                      <th className="py-3 px-3 font-bold border-r border-slate-200 text-center w-24">
                        성별 \ 연령
                      </th>
                      {ALL_AGE_GROUPS.map((a) => (
                        <th key={a} className="py-3 px-2 font-bold text-center border-r border-slate-200">
                          {a}
                        </th>
                      ))}
                      <th className="py-3 px-2 font-bold text-center bg-slate-100/70">
                        성별 소계 (A비율)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {crossMatrix.map((row) => (
                      <tr key={row.gender} className="border-b border-slate-100 hover:bg-slate-50/40">
                        <td className="py-3 px-3 font-bold text-slate-900 bg-slate-50/50 border-r border-slate-200 text-center">
                          {row.gender}
                        </td>
                        {row.cells.map((cell) => {
                          const isSelectedCell =
                            selectedGender === cell.gender && selectedAgeGroup === cell.ageGroup;
                          const isMyCell =
                            userProfile.gender === cell.gender && userProfile.age_group === cell.ageGroup;

                          return (
                            <td
                              key={cell.ageGroup}
                              onClick={() => setIntersection(cell.gender, cell.ageGroup)}
                              className={`py-2 px-2 text-center border-r border-slate-200 cursor-pointer transition-all ${
                                isSelectedCell
                                  ? 'bg-indigo-100/70 ring-2 ring-indigo-500 font-bold'
                                  : isMyCell
                                  ? 'bg-amber-50/60'
                                  : 'hover:bg-indigo-50/40'
                              }`}
                            >
                              {cell.total > 0 ? (
                                <div className="space-y-1">
                                  <div className="text-[11px] font-bold">
                                    <span className="text-indigo-600">A {cell.percentA}%</span>
                                    <span className="text-slate-300 mx-1">/</span>
                                    <span className="text-slate-700">B {cell.percentB}%</span>
                                  </div>
                                  <div className="text-[10px] text-slate-400">
                                    ({cell.total}표)
                                  </div>
                                  {/* Micro visual gauge */}
                                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden flex mx-auto max-w-[50px]">
                                    <div
                                      className="h-full bg-indigo-600"
                                      style={{ width: `${cell.percentA}%` }}
                                    />
                                    <div
                                      className="h-full bg-slate-800"
                                      style={{ width: `${cell.percentB}%` }}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <span className="text-slate-300 text-[11px]">-</span>
                              )}
                            </td>
                          );
                        })}
                        <td className="py-2 px-2 text-center bg-slate-50/60 font-semibold text-slate-700">
                          {row.rowTotal > 0 ? (
                            <div>
                              <span className="text-indigo-600 font-bold">A {row.rowPercentA}%</span>
                              <div className="text-[10px] text-slate-400">({row.rowTotal}표)</div>
                            </div>
                          ) : (
                            '-'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Insight Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start space-x-2.5">
              <Compass className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">다차원 교차 분석 인사이트:</strong>{' '}
                동일한 성별이라도 10대와 40·50대 간에 뚜렷한 세대 차이가 나타나며, 동일한 연령대 내에서도 성별에 따라 윤리적 접근 방식(원칙주의 vs 효용주의)에 흥미로운 차이가 관찰됩니다.
              </div>
            </div>
          </div>
        )}

        {/* Tab 2 Content: Qualitative Reasons List */}
        {activeTab === 'opinions' && (
          <div className="p-6 sm:p-8 space-y-6">
            {/* Filter by Option A / B & Optional Subgroup filter */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">참여자들의 서술형 의견</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  각 선택을 내린 생생한 이유와 윤리적 고뇌를 읽어보세요.
                </p>

                {/* Subgroup Filter Toggle */}
                {isCrossFilterActive && (
                  <div className="mt-2 flex items-center space-x-2">
                    <label className="flex items-center space-x-1.5 text-xs text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filterOpinionsByIntersection}
                        onChange={(e) => setFilterOpinionsByIntersection(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>
                        선택한 교차 조건(<strong>{selectedGender === 'ALL' ? '모든 성별' : selectedGender} · {selectedAgeGroup === 'ALL' ? '모든 연령대' : selectedAgeGroup}</strong>) 의견만 모아보기
                      </span>
                    </label>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold shrink-0">
                <button
                  onClick={() => setOpinionFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    opinionFilter === 'ALL'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  전체 ({filteredOpinions.length})
                </button>
                <button
                  onClick={() => setOpinionFilter('A')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    opinionFilter === 'A'
                      ? 'bg-white text-indigo-700 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  A 선택자 의견
                </button>
                <button
                  onClick={() => setOpinionFilter('B')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    opinionFilter === 'B'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  B 선택자 의견
                </button>
              </div>
            </div>

            {/* Opinions Cards List */}
            {filteredOpinions.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                {filterOpinionsByIntersection
                  ? '선택하신 교차 조건에 해당하는 서술형 의견이 아직 없습니다. 필터를 해제하거나 아래에서 첫 의견을 작성해 보세요!'
                  : '등록된 서술형 의견이 아직 없습니다. 아래 폼에서 첫 의견을 남겨보세요!'}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredOpinions.map((item) => {
                  const isA = item.selected_option === 'A';
                  const isLiked = likedIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 transition-all flex flex-col justify-between shadow-2xs"
                    >
                      <div>
                        {/* Meta tags */}
                        <div className="flex items-center justify-between text-xs mb-2.5">
                          <div className="flex items-center space-x-1.5">
                            <span
                              className={`w-5 h-5 rounded font-bold text-[11px] flex items-center justify-center text-white ${
                                isA ? 'bg-indigo-600' : 'bg-slate-800'
                              }`}
                            >
                              {item.selected_option}
                            </span>
                            <span className="text-[11px] text-slate-700 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">
                              {item.gender} · {item.age_group}
                            </span>
                          </div>

                          <span className="text-[10px] text-slate-400">
                            {new Date(item.created_at).toLocaleDateString('ko-KR', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>

                        {/* Reason content */}
                        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal whitespace-pre-line mb-3">
                          "{item.reason}"
                        </p>
                      </div>

                      {/* Card Footer: Upvote / Like */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                        <button
                          onClick={() => onLikeReason(item.id)}
                          disabled={isLiked}
                          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                            isLiked
                              ? 'bg-rose-50 text-rose-600 border border-rose-200 cursor-default'
                              : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                          }`}
                          title="공감하기"
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                          <span>공감 {item.likes_count || 0}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Inline Box to add your own comment / reason */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                  <span>이 딜레마에 새로운 의견 남기기</span>
                </span>
                <div className="flex items-center space-x-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setNewReasonOption('A')}
                    className={`px-2 py-0.5 rounded text-xs font-semibold border ${
                      newReasonOption === 'A'
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    A 지지
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewReasonOption('B')}
                    className={`px-2 py-0.5 rounded text-xs font-semibold border ${
                      newReasonOption === 'B'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    B 지지
                  </button>
                </div>
              </div>

              <form onSubmit={handleAddNewOpinion} className="space-y-2">
                <textarea
                  value={newReasonInput}
                  onChange={(e) => setNewReasonInput(e.target.value)}
                  maxLength={300}
                  placeholder="당신의 추가적인 논리나 느낀 점을 자유롭게 남겨보세요..."
                  rows={2}
                  className="w-full text-xs sm:text-sm p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!newReasonInput.trim() || isSubmittingReason}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors disabled:bg-slate-300 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>의견 등록</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation / Quick jump to other dilemmas */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
        <button
          onClick={() => setSelectedDilemmaIndex((prev) => Math.max(0, prev - 1))}
          disabled={selectedDilemmaIndex === 0}
          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 font-medium"
        >
          ← 이전 딜레마
        </button>
        <span>
          {selectedDilemmaIndex + 1} / {dilemmas.length}
        </span>
        <button
          onClick={() => setSelectedDilemmaIndex((prev) => Math.min(dilemmas.length - 1, prev + 1))}
          disabled={selectedDilemmaIndex === dilemmas.length - 1}
          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 font-medium"
        >
          다음 딜레마 →
        </button>
      </div>
    </div>
  );
};
