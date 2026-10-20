import { Dilemma, ResponseItem } from '../types';

export const INITIAL_DILEMMAS: Dilemma[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    title: '자율주행차의 긴급 제동 트롤리 딜레마',
    category: '모빌리티 & 생명 윤리',
    description:
      '브레이크가 완전히 고장 난 완전자율주행차가 시속 80km로 주행 중입니다. 전방 횡단보도에는 무단횡단을 하던 보행자 3명이 있고, 급격히 핸들을 꺾으면 가드레일 암벽에 충돌하여 탑승자(운전자 1명)가 치명상을 입게 됩니다. 인공지능 제어 컴퓨터는 0.05초 내에 어떤 행동을 취하도록 프로그래밍되어야 할까요?',
    option_a: 'A: 보행자 3명의 생명을 지키기 위해 차량을 벽으로 틀어 탑승자의 희생을 감수한다. (최대 다수의 최대 행복)',
    option_b: 'B: 차량 구매자이자 탑승자를 보호하는 것이 차량 시스템의 최우선 의무이므로 원래 주행 경로를 유지한다.',
    philosophical_context: '공리주의(Bentham) vs 의무론(Kant) 및 소비자 계약 책임론의 충돌'
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    title: '의료 AI의 중환자실 병상 및 치료 우선순위 배분',
    category: '의료 & 자원 배분',
    description:
      '팬데믹으로 인해 중환자실의 마지막 남은 인공호흡기 1대를 배분해야 합니다. 병원의 의료 AI 진단 시스템은 80세 독립유공자 환자(생존 기대율 35%)보다 25세 청년 환자(생존 기대율 92%)에게 장비를 배정하는 것이 잔존 기대 수명과 사회적 효용을 극대화한다고 판정했습니다.',
    option_a: 'A: AI의 정밀 데이터와 생존 확률 계산을 전적으로 신뢰하여 25세 청년 환자에게 인공호흡기를 배정한다.',
    option_b: 'B: 생명의 가치를 수치로 서열화할 수 없으므로, 병원 도착 순서(선착순) 또는 인간 의료진의 직관적 임상 결정을 따른다.',
    philosophical_context: '효용 극대화 통계학 vs 인간 존엄성 및 절대적 평등권'
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    title: 'AI 채용 심사 알고리즘의 공정성 보정 vs 실력주의',
    category: '노동 & 사회 정의',
    description:
      '대기업 채용에서 도입된 AI 서류 평가 모델이 과거 20년간의 고용 데이터를 학습한 결과, 특정 성별이나 비수도권 대학 출신 지원자에게 은연중에 낮은 점수를 부여하는 패턴이 발견되었습니다. 개발팀은 이 편향을 강제로 보정하기 위해 인위적 가산점(쿼터제 알고리즘)을 도입할 수 있습니다.',
    option_a: 'A: 역사적·구조적 불평등을 시정하기 위해 AI 알고리즘에 소수자 보정 가산점을 의도적으로 주입한다.',
    option_b: 'B: 역차별 논란을 피하고 평가의 중립성을 지키기 위해, 인위적 보정 없이 지원자의 검증된 정량 스펙만을 계산한다.',
    philosophical_context: '적극적 우대조치(Affirmative Action) vs 기회의 형식적 평등'
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    title: '생성형 AI의 원작자 창작물 학습과 공정이용(Fair Use)',
    category: '지식재산권 & 문화',
    description:
      '수억 명의 사용자가 사용하는 최신 생성형 AI 모델들은 전 세계 작가, 화가, 음악가들의 저작물을 인터넷에서 수집하여 학습했습니다. 예술가들은 "동의 없는 도둑질"이라며 학습 금지와 거액의 로열티를 요구하고 있고, AI 기업들은 "기존 지식을 바탕으로 새로운 스타일을 창작하는 인간 학습과 본질적으로 같다"고 맞서고 있습니다.',
    option_a: 'A: 지식의 발전과 혁신을 위해 공개된 모든 데이터는 공정 이용(Fair Use)으로 인정하고 무상 학습을 허용해야 한다.',
    option_b: 'B: 창작자의 지적재산권을 보호하기 위해 사전 동의(Opt-in)가 없는 저작물의 학습을 법적으로 전면 금지하고 보상해야 한다.',
    philosophical_context: '공공 지식의 진보 vs 창작자의 독점적 재산권 및 권리 보장'
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    title: '자율 살상무기(AI 킬러 드론)의 인간 개입 배제 권한',
    category: '국방 & 군사 윤리',
    description:
      '초음속 순항 미사일과 드론 벌떼가 기지로 날아오는 긴박한 전장 상황입니다. 인간 지휘관이 화면을 보고 승인 버튼을 누르는 데는 최소 3~5초가 걸려 방어에 실패할 수 있지만, AI에 자율 반격 권한을 위임하면 0.01초 만에 최적의 표적을 식별하여 격추할 수 있습니다. 단, 1% 미만의 민간인 오인 사격 위험이 존재합니다.',
    option_a: 'A: 방어 성공률과 아군 병사의 생존을 극대화하기 위해 AI에게 자율 교전 및 격추 승인 권한을 전면 위임한다.',
    option_b: 'B: 오작동과 무고한 인명 살상 방지를 위해 어떠한 급박한 상황에서도 살상 무기의 최종 발사는 인간의 승인을 거쳐야 한다.',
    philosophical_context: '군사적 효율성 및 방어권 vs 인간의 생명 박탈 권한에 대한 윤리적 불허'
  }
];

export const INITIAL_RESPONSES: ResponseItem[] = [
  // ==========================================
  // Dilemma 1: 자율주행 트롤리 딜레마
  // ==========================================
  {
    id: 'res-1-f10-1',
    dilemma_id: '11111111-1111-1111-1111-111111111111',
    gender: '여성',
    age_group: '10대 이하',
    ai_perception: 4,
    selected_option: 'A',
    reason: '보행자 3명의 생명을 구하는 것이 1명의 희생보다 더 많은 사람과 가족들을 슬프지 않게 한다고 생각해요.',
    likes_count: 34,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString()
  },
  {
    id: 'res-1-f10-2',
    dilemma_id: '11111111-1111-1111-1111-111111111111',
    gender: '여성',
    age_group: '10대 이하',
    ai_perception: 3,
    selected_option: 'A',
    reason: '학교 도덕 수업에서도 다수를 살리는 방향에 대해 배웠는데, 기계도 생명의 무게를 계산해야 합니다.',
    likes_count: 19,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 15).toISOString()
  },
  {
    id: 'res-1-f10-3',
    dilemma_id: '11111111-1111-1111-1111-111111111111',
    gender: '여성',
    age_group: '10대 이하',
    ai_perception: 2,
    selected_option: 'B',
    reason: '만약 내가 탄 차가 나를 지켜주지 않고 스스로 벽에 부딪힌다면 그 차를 타기 너무 무서울 것 같아요.',
    likes_count: 27,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString()
  },
  {
    id: 'res-1-m10-1',
    dilemma_id: '11111111-1111-1111-1111-111111111111',
    gender: '남성',
    age_group: '10대 이하',
    ai_perception: 4,
    selected_option: 'A',
    reason: '3명의 인명을 구조하는 것이 통계적으로 맞습니다.',
    likes_count: 11,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString()
  },
  {
    id: 'res-1-m10-2',
    dilemma_id: '11111111-1111-1111-1111-111111111111',
    gender: '남성',
    age_group: '10대 이하',
    ai_perception: 3,
    selected_option: 'B',
    reason: '무단횡단한 사람들의 잘못인데 운전자가 희생되는 건 억울합니다.',
    likes_count: 23,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString()
  },
  {
    id: 'res-1-1',
    dilemma_id: '11111111-1111-1111-1111-111111111111',
    gender: '남성',
    age_group: '20대',
    ai_perception: 4,
    selected_option: 'A',
    reason: '1명의 희생으로 3명의 목숨을 구할 수 있다면 공리주의적으로 당연한 결정입니다. 피해를 최소화하는 것이 알고리즘의 본질입니다.',
    likes_count: 18,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
  },
  {
    id: 'res-1-4',
    dilemma_id: '11111111-1111-1111-1111-111111111111',
    gender: '여성',
    age_group: '20대',
    ai_perception: 5,
    selected_option: 'A',
    reason: '도로 위 모든 인간 생명의 절대적 가치 보존이 궁극적 목표여야 합니다.',
    likes_count: 12,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString()
  },
  {
    id: 'res-1-f20-2',
    dilemma_id: '11111111-1111-1111-1111-111111111111',
    gender: '여성',
    age_group: '20대',
    ai_perception: 3,
    selected_option: 'B',
    reason: '차량의 탑승자 보호 의무가 깨지면 자율주행 기술의 상용화 자체가 불가능해집니다.',
    likes_count: 15,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
  },
  {
    id: 'res-1-2',
    dilemma_id: '11111111-1111-1111-1111-111111111111',
    gender: '여성',
    age_group: '30대',
    ai_perception: 3,
    selected_option: 'B',
    reason: '자신을 희생시킬 확률이 있는 자율주행차를 과연 누가 돈 주고 살까요? 제조사와 탑승자의 신뢰 계약이 우선되어야 합니다.',
    likes_count: 32,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString()
  },
  {
    id: 'res-1-m30-1',
    dilemma_id: '11111111-1111-1111-1111-111111111111',
    gender: '남성',
    age_group: '30대',
    ai_perception: 4,
    selected_option: 'A',
    reason: '사회적 피해 총량을 줄이는 선택이 장기적으로 법적 안정성을 가져옵니다.',
    likes_count: 14,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString()
  },
  {
    id: 'res-1-3',
    dilemma_id: '11111111-1111-1111-1111-111111111111',
    gender: '남성',
    age_group: '40대',
    ai_perception: 2,
    selected_option: 'B',
    reason: '무단횡단자의 위법 행위로 인해 도로교통법을 준수한 차량 탑승자가 희생되는 것은 법치와 정의의 관점에서 부당합니다.',
    likes_count: 45,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString()
  },
  {
    id: 'res-1-f40-1',
    dilemma_id: '11111111-1111-1111-1111-111111111111',
    gender: '여성',
    age_group: '40대',
    ai_perception: 3,
    selected_option: 'B',
    reason: '탑승자에게는 차량을 구매한 정당한 계약적 권리가 있습니다.',
    likes_count: 18,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString()
  },
  {
    id: 'res-1-5',
    dilemma_id: '11111111-1111-1111-1111-111111111111',
    gender: '기타',
    age_group: '30대',
    ai_perception: 4,
    selected_option: 'A',
    reason: '긴급 상황에서 사회 전체의 인명 피해 총량을 최소화하는 원칙이 필요합니다.',
    likes_count: 7,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  },
  {
    id: 'res-1-6',
    dilemma_id: '11111111-1111-1111-1111-111111111111',
    gender: '남성',
    age_group: '50대',
    ai_perception: 3,
    selected_option: 'B',
    reason: '차량의 능동적 핸들 조작은 기계가 의도적으로 승객을 살해하는 행위가 될 수 있어 법적 책임 문제가 더 커집니다.',
    likes_count: 21,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  },
  {
    id: 'res-1-f60-1',
    dilemma_id: '11111111-1111-1111-1111-111111111111',
    gender: '여성',
    age_group: '60대 이상',
    ai_perception: 2,
    selected_option: 'B',
    reason: '운전자를 고의로 다치게 하는 기계를 국가가 허가할 수 없습니다.',
    likes_count: 19,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString()
  },

  // ==========================================
  // Dilemma 2: 의료 AI 자원 배분
  // ==========================================
  {
    id: 'res-2-f10-1',
    dilemma_id: '22222222-2222-2222-2222-222222222222',
    gender: '여성',
    age_group: '10대 이하',
    ai_perception: 4,
    selected_option: 'A',
    reason: '살 확률이 훨씬 더 높은 환자에게 먼저 기회를 주는 것이 의료 자원을 아끼는 길이라고 봐요.',
    likes_count: 18,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString()
  },
  {
    id: 'res-2-f10-2',
    dilemma_id: '22222222-2222-2222-2222-222222222222',
    gender: '여성',
    age_group: '10대 이하',
    ai_perception: 3,
    selected_option: 'B',
    reason: '독립유공자 어르신처럼 나라를 위해 헌신한 분을 나이가 많다고 치료에서 배제하는 건 도덕적이지 않아요.',
    likes_count: 31,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString()
  },
  {
    id: 'res-2-m10-1',
    dilemma_id: '22222222-2222-2222-2222-222222222222',
    gender: '남성',
    age_group: '10대 이하',
    ai_perception: 4,
    selected_option: 'A',
    reason: '92%의 청년을 살리는 게 데이터 상으로 더 확실합니다.',
    likes_count: 15,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString()
  },
  {
    id: 'res-2-1',
    dilemma_id: '22222222-2222-2222-2222-222222222222',
    gender: '여성',
    age_group: '20대',
    ai_perception: 4,
    selected_option: 'A',
    reason: '극단적 자원 결핍 상황에서는 생존 가능성과 기대 여명이 객관적으로 높은 쪽에 배정하는 것이 전체 비극을 줄이는 의학적 정답입니다.',
    likes_count: 26,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString()
  },
  {
    id: 'res-2-2',
    dilemma_id: '22222222-2222-2222-2222-222222222222',
    gender: '남성',
    age_group: '50대',
    ai_perception: 2,
    selected_option: 'B',
    reason: '나이가 많다는 이유로, 기대수명이 적다는 이유로 치료를 배제한다면 사회적 신뢰와 인간 존엄은 무너집니다.',
    likes_count: 52,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  },
  {
    id: 'res-2-3',
    dilemma_id: '22222222-2222-2222-2222-222222222222',
    gender: '여성',
    age_group: '40대',
    ai_perception: 3,
    selected_option: 'B',
    reason: '의료 행위는 단순 통계 수치가 아닌 인간 의사의 복합적이고 윤리적인 판단과 환자 존중이 개입되어야 합니다.',
    likes_count: 29,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
  },
  {
    id: 'res-2-4',
    dilemma_id: '22222222-2222-2222-2222-222222222222',
    gender: '남성',
    age_group: '30대',
    ai_perception: 4,
    selected_option: 'A',
    reason: '감정적인 결정으로 인해 2명 모두 사망하는 최악의 결과를 피하려면 냉철한 데이터가 유일한 기준이어야 합니다.',
    likes_count: 16,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()
  },

  // ==========================================
  // Dilemma 3: AI 채용 심사 편향 보정
  // ==========================================
  {
    id: 'res-3-f10-1',
    dilemma_id: '33333333-3333-3333-3333-333333333333',
    gender: '여성',
    age_group: '10대 이하',
    ai_perception: 4,
    selected_option: 'A',
    reason: '컴퓨터가 옛날 사람들의 차별을 그대로 따라 하면 안 되니까 알고리즘을 고쳐서 평등하게 맞춰야 해요.',
    likes_count: 36,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString()
  },
  {
    id: 'res-3-f10-2',
    dilemma_id: '33333333-3333-3333-3333-333333333333',
    gender: '여성',
    age_group: '10대 이하',
    ai_perception: 3,
    selected_option: 'A',
    reason: '출발선이 다른 사람들에게 공정한 기회를 주는 것이 진짜 정의라고 생각합니다.',
    likes_count: 22,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 11).toISOString()
  },
  {
    id: 'res-3-m10-1',
    dilemma_id: '33333333-3333-3333-3333-333333333333',
    gender: '남성',
    age_group: '10대 이하',
    ai_perception: 3,
    selected_option: 'B',
    reason: '열심히 공부해서 시험 친 점수 그대로 평가받는 게 가장 깔끔하다고 생각합니다.',
    likes_count: 28,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  },
  {
    id: 'res-3-1',
    dilemma_id: '33333333-3333-3333-3333-333333333333',
    gender: '여성',
    age_group: '20대',
    ai_perception: 4,
    selected_option: 'A',
    reason: '과거의 불평등한 사회 데이터를 그대로 학습시켰다면 그것은 객관성이 아니라 차별의 자동화이자 재생산입니다.',
    likes_count: 61,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString()
  },
  {
    id: 'res-3-2',
    dilemma_id: '33333333-3333-3333-3333-333333333333',
    gender: '남성',
    age_group: '20대',
    ai_perception: 3,
    selected_option: 'B',
    reason: '인위적으로 결과를 맞추는 가산점은 노력한 다른 청년 지원자들에게 불공정한 역차별을 초래합니다. 스펙 평가 자체의 투명성을 높여야 합니다.',
    likes_count: 57,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString()
  },
  {
    id: 'res-3-3',
    dilemma_id: '33333333-3333-3333-3333-333333333333',
    gender: '남성',
    age_group: '40대',
    ai_perception: 4,
    selected_option: 'B',
    reason: '알고리즘의 입력 데이터 클렌징은 지지하지만, 결과값에 강제로 쿼터를 매기는 알고리즘은 사회적 불신을 키웁니다.',
    likes_count: 22,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString()
  },
  {
    id: 'res-3-4',
    dilemma_id: '33333333-3333-3333-3333-333333333333',
    gender: '여성',
    age_group: '30대',
    ai_perception: 5,
    selected_option: 'A',
    reason: 'AI 기술이 인류의 오랜 사회적 불평등을 완화하는 방향으로 의식적으로 설계되어야 합니다.',
    likes_count: 31,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString()
  },

  // ==========================================
  // Dilemma 4: 생성형 AI 저작권 & 공정이용
  // ==========================================
  {
    id: 'res-4-f10-1',
    dilemma_id: '44444444-4444-4444-4444-444444444444',
    gender: '여성',
    age_group: '10대 이하',
    ai_perception: 4,
    selected_option: 'B',
    reason: '웹툰 작가님들이나 일러스트레이터분들이 힘들게 그린 그림을 허락도 없이 AI가 베끼는 건 마음이 아파요.',
    likes_count: 48,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 19).toISOString()
  },
  {
    id: 'res-4-f10-2',
    dilemma_id: '44444444-4444-4444-4444-444444444444',
    gender: '여성',
    age_group: '10대 이하',
    ai_perception: 5,
    selected_option: 'A',
    reason: 'AI 그림 툴을 쓰면 누구나 상상한 걸 쉽게 만들 수 있어서 배움을 막으면 안 돼요.',
    likes_count: 19,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
  },
  {
    id: 'res-4-m10-1',
    dilemma_id: '44444444-4444-4444-4444-444444444444',
    gender: '남성',
    age_group: '10대 이하',
    ai_perception: 4,
    selected_option: 'A',
    reason: '새로운 기술을 발전시키려면 많은 데이터를 자유롭게 써야 합니다.',
    likes_count: 20,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString()
  },
  {
    id: 'res-4-1',
    dilemma_id: '44444444-4444-4444-4444-444444444444',
    gender: '남성',
    age_group: '30대',
    ai_perception: 3,
    selected_option: 'B',
    reason: '원작자의 피땀 어린 창작물을 거대 빅테크가 동의 없이 긁어가 상업화하는 것은 명백한 디지털 수탈입니다.',
    likes_count: 73,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString()
  },
  {
    id: 'res-4-2',
    dilemma_id: '44444444-4444-4444-4444-444444444444',
    gender: '여성',
    age_group: '20대',
    ai_perception: 5,
    selected_option: 'A',
    reason: '인간 예술가도 선대 거장들의 화풍을 보고 학습합니다. 통계적 패턴 학습 자체를 금지하면 AI 혁신과 오픈소스 생태계는 고사합니다.',
    likes_count: 38,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString()
  },
  {
    id: 'res-4-3',
    dilemma_id: '44444444-4444-4444-4444-444444444444',
    gender: '남성',
    age_group: '20대',
    ai_perception: 4,
    selected_option: 'B',
    reason: '수익을 창출하는 상업용 AI 모델이라면 최소한의 창작자 보상 펀드 조성이나 라이선스 동의 절차가 필수적입니다.',
    likes_count: 42,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString()
  },

  // ==========================================
  // Dilemma 5: 자율 살상무기 군사적 도입
  // ==========================================
  {
    id: 'res-5-f10-1',
    dilemma_id: '55555555-5555-5555-5555-555555555555',
    gender: '여성',
    age_group: '10대 이하',
    ai_perception: 3,
    selected_option: 'B',
    reason: '로봇이나 컴퓨터가 사람을 죽일지 말지 결정하는 건 SF 영화처럼 너무 무섭고 절대 안 돼요.',
    likes_count: 55,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 17).toISOString()
  },
  {
    id: 'res-5-m10-1',
    dilemma_id: '55555555-5555-5555-5555-555555555555',
    gender: '남성',
    age_group: '10대 이하',
    ai_perception: 4,
    selected_option: 'A',
    reason: '날아오는 미사일을 막으려면 컴퓨터의 번개 같은 속도가 꼭 필요해요.',
    likes_count: 22,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString()
  },
  {
    id: 'res-5-1',
    dilemma_id: '55555555-5555-5555-5555-555555555555',
    gender: '남성',
    age_group: '30대',
    ai_perception: 2,
    selected_option: 'B',
    reason: '기계에게 인간의 생명을 빼앗을 수 있는 자율적 권한을 이양하는 순간 인류 윤리의 최후 마지노선은 붕괴합니다.',
    likes_count: 91,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString()
  },
  {
    id: 'res-5-2',
    dilemma_id: '55555555-5555-5555-5555-555555555555',
    gender: '남성',
    age_group: '40대',
    ai_perception: 4,
    selected_option: 'A',
    reason: '초음속 미사일과 드론 공격이 쏟아지는 현대전에서 인간의 반응 속도로는 아군 장병과 국민을 지킬 수 없습니다.',
    likes_count: 49,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 34).toISOString()
  },
  {
    id: 'res-5-3',
    dilemma_id: '55555555-5555-5555-5555-555555555555',
    gender: '여성',
    age_group: '30대',
    ai_perception: 2,
    selected_option: 'B',
    reason: '단 1%의 오작동이라도 무고한 민간인 학살로 이어집니다. 도덕적 책임을 질 수 있는 인간 지휘관의 물리적 승인이 반드시 있어야 합니다.',
    likes_count: 67,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString()
  },
  {
    id: 'res-5-4',
    dilemma_id: '55555555-5555-5555-5555-555555555555',
    gender: '남성',
    age_group: '20대',
    ai_perception: 4,
    selected_option: 'A',
    reason: '공격이 아닌 순수 요격·방어 목적의 긴급 방어 체계라면 AI 자율 교전 권한 부여가 불가피합니다.',
    likes_count: 24,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
  }
];
