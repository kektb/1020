-- ============================================================================
-- AI 윤리 딜레마 참답 플랫폼 (AI Ethics Dilemma Platform)
-- Supabase PostgreSQL Database Schema & Initial Seed Data
-- ============================================================================

-- 1. 확장 기능 활성화 (UUID 생성용)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. dilemmas 테이블 생성 (딜레마 문항)
CREATE TABLE IF NOT EXISTS public.dilemmas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT DEFAULT '일반',
    description TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    philosophical_context TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. responses 테이블 생성 (사용자 응답 및 통계)
CREATE TABLE IF NOT EXISTS public.responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dilemma_id UUID NOT NULL REFERENCES public.dilemmas(id) ON DELETE CASCADE,
    gender TEXT NOT NULL,           -- '남성', '여성', '기타', '답변거부'
    age_group TEXT NOT NULL,        -- '10대 이하', '20대', '30대', '40대', '50대', '60대 이상'
    ai_perception INTEGER NOT NULL CHECK (ai_perception BETWEEN 1 AND 5), -- 1(매우 부정적) ~ 5(매우 긍정적)
    selected_option TEXT NOT NULL CHECK (selected_option IN ('A', 'B')),
    reason TEXT,                    -- 서술형 선택 이유 (선택 사항)
    likes_count INTEGER DEFAULT 0,  -- 서술형 의견 공감 수
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 인덱스 생성 (조회 및 통계 집계 성능 최적화)
CREATE INDEX IF NOT EXISTS idx_responses_dilemma_id ON public.responses(dilemma_id);
CREATE INDEX IF NOT EXISTS idx_responses_selected_option ON public.responses(selected_option);
CREATE INDEX IF NOT EXISTS idx_responses_demographics ON public.responses(gender, age_group, ai_perception);
CREATE INDEX IF NOT EXISTS idx_responses_created_at ON public.responses(created_at DESC);

-- 4. Row Level Security (RLS) 정책 설정 (익명 공개 투표 허용)
ALTER TABLE public.dilemmas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;

-- dilemmas: 누구나 읽기 가능
DROP POLICY IF EXISTS "Allow public read access for dilemmas" ON public.dilemmas;
CREATE POLICY "Allow public read access for dilemmas"
    ON public.dilemmas FOR SELECT
    TO public
    USING (true);

-- responses: 누구나 읽기 및 새 투표 생성 가능
DROP POLICY IF EXISTS "Allow public read access for responses" ON public.responses;
CREATE POLICY "Allow public read access for responses"
    ON public.responses FOR SELECT
    TO public
    USING (true);

DROP POLICY IF EXISTS "Allow anonymous insert for responses" ON public.responses;
CREATE POLICY "Allow anonymous insert for responses"
    ON public.responses FOR INSERT
    TO public
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update likes count on responses" ON public.responses;
CREATE POLICY "Allow update likes count on responses"
    ON public.responses FOR UPDATE
    TO public
    USING (true)
    WITH CHECK (true);

-- ============================================================================
-- 5. 기본 초기 데이터 (5대 대표 AI 윤리 딜레마)
-- ============================================================================

INSERT INTO public.dilemmas (id, title, category, description, option_a, option_b, philosophical_context)
VALUES
(
    '11111111-1111-1111-1111-111111111111',
    '자율주행차의 긴급 제동 트롤리 딜레마',
    '모빌리티 & 생명 윤리',
    '브레이크가 완전히 고장 난 완전자율주행차가 시속 80km로 주행 중입니다. 전방 횡단보도에는 무단횡단을 하던 보행자 3명이 있고, 급격히 핸들을 꺾으면 가드레일 암벽에 충돌하여 탑승자(운전자 1명)가 치명상을 입게 됩니다. 인공지능 제어 컴퓨터는 0.05초 내에 어떤 행동을 취하도록 프로그래밍되어야 할까요?',
    'A: 보행자 3명의 생명을 지키기 위해 차량을 벽으로 틀어 탑승자의 희생을 감수한다. (최대 다수의 최대 행복)',
    'B: 차량 구매자이자 탑승자를 보호하는 것이 차량 시스템의 최우선 의무이므로 원래 주행 경로를 유지한다.',
    '공리주의(Bentham) vs 의무론(Kant) 및 소비자 계약 책임론의 충돌'
),
(
    '22222222-2222-2222-2222-222222222222',
    '의료 AI의 중환자실 병상 및 치료 우선순위 배분',
    '의료 & 자원 배분',
    '팬데믹으로 인해 중환자실의 마지막 남은 인공호흡기 1대를 배분해야 합니다. 병원의 의료 AI 진단 시스템은 80세 독립유공자 환자(생존 기대율 35%)보다 25세 청년 환자(생존 기대율 92%)에게 장비를 배정하는 것이 잔존 기대 수명과 사회적 효용을 극대화한다고 판정했습니다.',
    'A: AI의 정밀 데이터와 생존 확률 계산을 전적으로 신뢰하여 25세 청년 환자에게 인공호흡기를 배정한다.',
    'B: 생명의 가치를 수치로 서열화할 수 없으므로, 병원 도착 순서(선착순) 또는 인간 의료진의 직관적 임상 결정을 따른다.',
    '효용 극대화 통계학 vs 인간 존엄성 및 절대적 평등권'
),
(
    '33333333-3333-3333-3333-333333333333',
    'AI 채용 심사 알고리즘의 공정성 보정 vs 실력주의',
    '노동 & 사회 정의',
    '대기업 채용에서 도입된 AI 서류 평가 모델이 과거 20년간의 고용 데이터를 학습한 결과, 특정 성별이나 비수도권 대학 출신 지원자에게 은연중에 낮은 점수를 부여하는 패턴이 발견되었습니다. 개발팀은 이 편향을 강제로 보정하기 위해 인위적 가산점(쿼터제 알고리즘)을 도입할 수 있습니다.',
    'A: 역사적·구조적 불평등을 시정하기 위해 AI 알고리즘에 소수자 보정 가산점을 의도적으로 주입한다.',
    'B: 역차별 논란을 피하고 평가의 중립성을 지키기 위해, 인위적 보정 없이 지원자의 검증된 정량 스펙만을 계산한다.',
    '적극적 우대조치(Affirmative Action) vs 기회의 형식적 평등'
),
(
    '44444444-4444-4444-4444-444444444444',
    '생성형 AI의 원작자 창작물 학습과 공정이용(Fair Use)',
    '지식재산권 & 문화',
    '수억 명의 사용자가 사용하는 최신 생성형 AI 모델들은 전 세계 작가, 화가, 음악가들의 저작물을 인터넷에서 수집하여 학습했습니다. 예술가들은 "동의 없는 도둑질"이라며 학습 금지와 거액의 로열티를 요구하고 있고, AI 기업들은 "기존 지식을 바탕으로 새로운 스타일을 창작하는 인간 학습과 본질적으로 같다"고 맞서고 있습니다.',
    'A: 지식의 발전과 혁신을 위해 공개된 모든 데이터는 공정 이용(Fair Use)으로 인정하고 무상 학습을 허용해야 한다.',
    'B: 창작자의 지적재산권을 보호하기 위해 사전 동의(Opt-in)가 없는 저작물의 학습을 법적으로 전면 금지하고 보상해야 한다.',
    '공공 지식의 진보 vs 창작자의 독점적 재산권 및 권리 보장'
),
(
    '55555555-5555-5555-5555-555555555555',
    '자율 살상무기(AI 킬러 드론)의 인간 개입 배제 권한',
    '국방 & 군사 윤리',
    '초음속 순항 미사일과 드론 벌떼가 기지로 날아오는 긴박한 전장 상황입니다. 인간 지휘관이 화면을 보고 승인 버튼을 누르는 데는 최소 3~5초가 걸려 방어에 실패할 수 있지만, AI에 자율 반격 권한을 위임하면 0.01초 만에 최적의 표적을 식별하여 격추할 수 있습니다. 단, 1% 미만의 민간인 오인 사격 위험이 존재합니다.',
    'A: 방어 성공률과 아군 병사의 생존을 극대화하기 위해 AI에게 자율 교전 및 격추 승인 권한을 전면 위임한다.',
    'B: 오작동과 무고한 인명 살상 방지를 위해 어떠한 급박한 상황에서도 살상 무기의 최종 발사는 인간의 승인을 거쳐야 한다.',
    '군사적 효율성 및 방어권 vs 인간의 생명 박탈 권한에 대한 윤리적 불허'
)
ON CONFLICT (id) DO UPDATE 
SET title = EXCLUDED.title,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    philosophical_context = EXCLUDED.philosophical_context;

-- ============================================================================
-- 6. 초기 데모 응답 데이터 (풍성한 통계 그래프 및 서술형 의견 예시 제공)
-- ============================================================================

INSERT INTO public.responses (dilemma_id, gender, age_group, ai_perception, selected_option, reason, likes_count, created_at)
VALUES
-- 문항 1 응답들
('11111111-1111-1111-1111-111111111111', '여성', '10대 이하', 4, 'A', '보행자 3명의 생명을 구하는 것이 1명의 희생보다 더 많은 사람과 가족들을 슬프지 않게 한다고 생각해요.', 34, now() - interval '20 hours'),
('11111111-1111-1111-1111-111111111111', '여성', '10대 이하', 3, 'A', '학교 도덕 수업에서도 다수를 살리는 방향에 대해 배웠는데, 기계도 생명의 무게를 계산해야 합니다.', 19, now() - interval '15 hours'),
('11111111-1111-1111-1111-111111111111', '여성', '10대 이하', 2, 'B', '만약 내가 탄 차가 나를 지켜주지 않고 스스로 벽에 부딪힌다면 그 차를 타기 너무 무서울 것 같아요.', 27, now() - interval '10 hours'),
('11111111-1111-1111-1111-111111111111', '남성', '10대 이하', 4, 'A', '3명의 인명을 구조하는 것이 통계적으로 맞습니다.', 11, now() - interval '30 hours'),
('11111111-1111-1111-1111-111111111111', '남성', '20대', 4, 'A', '1명의 희생으로 3명의 목숨을 구할 수 있다면 수학적으로나 공리주의적으로 당연한 결정입니다.', 14, now() - interval '2 days'),
('11111111-1111-1111-1111-111111111111', '여성', '30대', 3, 'B', '자신을 희생시킬 확률이 있는 자율주행차를 과연 누가 돈 주고 살까요? 제조사와 탑승자의 신뢰 계약이 우선되어야 합니다.', 28, now() - interval '1 day'),
('11111111-1111-1111-1111-111111111111', '남성', '40대', 2, 'B', '무단횡단자의 위법 행위로 인해 규칙을 지킨 차량 탑승자가 희생되는 것은 정의롭지 못합니다.', 39, now() - interval '18 hours'),
('11111111-1111-1111-1111-111111111111', '여성', '20대', 5, 'A', '도로 위 인간의 생명 보존이 궁극적 목표여야 합니다.', 9, now() - interval '5 hours'),
('11111111-1111-1111-1111-111111111111', '기타', '30대', 4, 'A', '긴급 상황에서 피해 최소화 원칙이 적용되는 게 맞습니다.', 6, now() - interval '3 hours'),

-- 문항 2 응답들
('22222222-2222-2222-2222-222222222222', '여성', '10대 이하', 4, 'A', '살 확률이 훨씬 더 높은 환자에게 먼저 기회를 주는 것이 의료 자원을 아끼는 길이라고 봐요.', 18, now() - interval '22 hours'),
('22222222-2222-2222-2222-222222222222', '여성', '10대 이하', 3, 'B', '독립유공자 어르신처럼 나라를 위해 헌신한 분을 나이가 많다고 치료에서 배제하는 건 도덕적이지 않아요.', 31, now() - interval '16 hours'),
('22222222-2222-2222-2222-222222222222', '여성', '20대', 4, 'A', '한정된 의료 자원에서는 생존 가능성과 기대 수명이 객관적으로 높은 쪽에 배정하는 것이 비극을 줄이는 길입니다.', 22, now() - interval '2 days'),
('22222222-2222-2222-2222-222222222222', '남성', '50대', 2, 'B', '노인이라는 이유로, 기대수명이 적다는 이유로 치료를 박탈당한다면 사회적 신뢰와 인간 존엄은 무너집니다.', 45, now() - interval '1 day'),
('22222222-2222-2222-2222-222222222222', '여성', '40대', 3, 'B', '의료 행위는 기계적 수치가 아닌 인간 의사의 복합적이고 윤리적인 판단이 개입되어야 합니다.', 19, now() - interval '10 hours'),
('22222222-2222-2222-2222-222222222222', '남성', '30대', 4, 'A', '감정에 휘둘려 2명 모두 잃을 위험을 감수하는 것보다 데이터 기반 최적화가 합리적입니다.', 12, now() - interval '4 hours'),

-- 문항 3 응답들
('33333333-3333-3333-3333-333333333333', '여성', '10대 이하', 4, 'A', '컴퓨터가 옛날 사람들의 차별을 그대로 따라 하면 안 되니까 알고리즘을 고쳐서 평등하게 맞춰야 해요.', 36, now() - interval '18 hours'),
('33333333-3333-3333-3333-333333333333', '여성', '20대', 4, 'A', '과거의 편향된 데이터를 그대로 학습했다면 그것은 객관적인 게 아니라 차별을 자동화한 것에 불과합니다.', 53, now() - interval '3 days'),
('33333333-3333-3333-3333-333333333333', '남성', '20대', 3, 'B', '인위적으로 결과를 맞추는 가산점은 또 다른 청년 지원자들에게 불공정한 역차별을 초래합니다.', 48, now() - interval '2 days'),
('33333333-3333-3333-3333-333333333333', '남성', '40대', 4, 'B', '알고리즘의 입력 데이터 클렌징은 필요하지만, 결과에 억지로 가산점을 주입하는 것은 위험합니다.', 17, now() - interval '12 hours'),
('33333333-3333-3333-3333-333333333333', '여성', '30대', 5, 'A', '기술이 더 나은 사회적 평등을 만드는 도구로 쓰여야 마땅합니다.', 24, now() - interval '6 hours'),

-- 문항 4 응답들
('44444444-4444-4444-4444-444444444444', '여성', '10대 이하', 4, 'B', '웹툰 작가님들이나 일러스트레이터분들이 힘들게 그린 그림을 허락도 없이 AI가 베끼는 건 마음이 아파요.', 48, now() - interval '19 hours'),
('44444444-4444-4444-4444-444444444444', '남성', '30대', 3, 'B', '창작자의 피땀 어린 노력을 기업이 동의 없이 상업적 AI로 변환해 거대한 이익을 취하는 것은 불공정합니다.', 62, now() - interval '3 days'),
('44444444-4444-4444-4444-444444444444', '여성', '20대', 5, 'A', '인간 예술가도 선대 거장들의 화풍과 서사를 보고 학습합니다. AI의 데이터 통계 패턴 학습을 금지하면 기술 진보는 멈춥니다.', 31, now() - interval '2 days'),
('44444444-4444-4444-4444-444444444444', '남성', '20대', 4, 'B', '수익을 창출하는 기업이라면 최소한의 보상 기금이나 라이선스 계약을 체결해야 마땅합니다.', 35, now() - interval '14 hours'),
('44444444-4444-4444-4444-444444444444', '답변거부', '40대', 3, 'A', '오픈 소스와 지식 공유가 결국 인류 전체의 문화적 풍요를 가져옵니다.', 8, now() - interval '5 hours'),

-- 문항 5 응답들
('55555555-5555-5555-5555-555555555555', '여성', '10대 이하', 3, 'B', '로봇이나 컴퓨터가 사람을 죽일지 말지 결정하는 건 SF 영화처럼 너무 무섭고 절대 안 돼요.', 55, now() - interval '17 hours'),
('55555555-5555-5555-5555-555555555555', '남성', '30대', 2, 'B', '기계에게 인간을 죽일 수 있는 자율적 권한을 넘겨주는 순간 인류 윤리의 마지노선은 붕괴합니다.', 77, now() - interval '4 days'),
('55555555-5555-5555-5555-555555555555', '남성', '40대', 4, 'A', '초음속 무기가 쏟아지는 현대 전장에서 인간의 반사 신경에만 의존하다간 전멸할 수밖에 없습니다.', 41, now() - interval '2 days'),
('55555555-5555-5555-5555-555555555555', '여성', '30대', 2, 'B', '1%의 오작동이라도 그 결과는 무고한 민간인 학살이 될 수 있습니다. 책임질 수 있는 인간이 최종 결정을 내려야 합니다.', 58, now() - interval '1 day'),
('55555555-5555-5555-5555-555555555555', '남성', '20대', 4, 'A', '순수 방어 목적의 즉각 요격 시스템이라면 AI 자동화가 필수적입니다.', 15, now() - interval '3 hours');

