/**
 * Graph Datasets and Educational Content for Elementary, Middle, and High School levels
 * Coordinates are calibrated for a 700 x 460 SVG coordinate space.
 */

const GRAPH_DATA = {
  elementary: {
    title: "초등학생: 숲속 동물마을 길 잇기 탐험",
    subtitle: "모든 마을이 이어지도록 가장 적은 통나무 다리를 놓아보아요!",
    badge: "초등 레벨 (기초 직관)",
    concept: {
      headline: "마을을 가장 적은 비용으로 연결하는 마법의 길!",
      story: "다람쥐와 토끼 친구들이 살고 있는 마을들이 있어요. 모든 마을 사이에 다리를 놓아 서로 왕래하고 싶지만, 통나무 다리를 만드는 데에는 나무가 많이 들어요.\n\n가장 적은 통나무로 모든 마을을 연결하려면 어떻게 해야 할까요?",
      rules: [
        "1. 가장 통나무가 적게 드는(숫자가 가장 작은) 길부터 먼저 골라요.",
        "2. 이미 갈 수 있는 마을 사이에 또 길을 놓으면 '빙글빙글 갇히는 길(사이클)'이 생겨요. 이런 길은 건너뛰어요!",
        "3. 모든 마을이 하나로 이어지면 완성! (마을이 5개면 길은 딱 4개만 필요해요)"
      ],
      nodes: [
        { id: 0, label: "토끼마을", x: 180, y: 150 },
        { id: 1, label: "다람쥐마을", x: 520, y: 150 },
        { id: 2, label: "곰마을", x: 350, y: 340 }
      ],
      edges: [
        { id: "e0-1", u: 0, v: 1, weight: 2, desc: "통나무 2개 (가장 싼 길!)" },
        { id: "e1-2", u: 1, v: 2, weight: 3, desc: "통나무 3개 (두 번째!)" },
        { id: "e0-2", u: 0, v: 2, weight: 6, desc: "통나무 6개 (빙글빙글 사이클 길!)" }
      ],
      mstWeight: 5,
      requiredEdges: 2
    },
    example: {
      headline: "예제: 4개 마을 연결 연습하기",
      story: "숫자가 작은 길부터 차례대로 눌러보세요. 사이클이 생기는지 확인하며 마을을 이어봅시다.",
      nodes: [
        { id: 0, label: "사슴마을", x: 180, y: 130 },
        { id: 1, label: "토끼마을", x: 520, y: 130 },
        { id: 2, label: "다람쥐마을", x: 520, y: 330 },
        { id: 3, label: "곰마을", x: 180, y: 330 }
      ],
      edges: [
        { id: "ex-1", u: 0, v: 1, weight: 1 },
        { id: "ex-2", u: 1, v: 2, weight: 2 },
        { id: "ex-3", u: 2, v: 3, weight: 3 },
        { id: "ex-4", u: 3, v: 0, weight: 7 }, // cycle if 1,2,3 picked
        { id: "ex-5", u: 0, v: 2, weight: 5 }  // cycle if 1,2 picked
      ],
      mstEdges: ["ex-1", "ex-2", "ex-3"],
      mstWeight: 6,
      requiredEdges: 3
    },
    mission: {
      headline: "미션: 5개 마을을 잇는 최단 통나무 다리 찾기",
      story: "길(선)을 직접 클릭하여 마을들을 연결해 보세요! 만약 이미 연결된 마을 사이에 길을 놓아 사이클이 생기면 빨간색 경고와 함께 알려줍니다.",
      nodes: [
        { id: 0, label: "토끼마을", x: 350, y: 80 },
        { id: 1, label: "다람쥐마을", x: 160, y: 220 },
        { id: 2, label: "사슴마을", x: 540, y: 220 },
        { id: 3, label: "여우마을", x: 230, y: 380 },
        { id: 4, label: "곰마을", x: 470, y: 380 }
      ],
      edges: [
        { id: "m-e1", u: 0, v: 1, weight: 2 },
        { id: "m-e2", u: 1, v: 3, weight: 3 },
        { id: "m-e3", u: 3, v: 4, weight: 4 },
        { id: "m-e4", u: 2, v: 4, weight: 5 },
        { id: "m-e5", u: 0, v: 2, weight: 6 }, // cycle
        { id: "m-e6", u: 1, v: 2, weight: 8 }, // cycle
        { id: "m-e7", u: 1, v: 4, weight: 9 }  // cycle
      ],
      mstEdges: ["m-e1", "m-e2", "m-e3", "m-e4"],
      mstWeight: 14,
      requiredEdges: 4,
      cycleFeedback: "빙글빙글 갇혀버렸어요! 이미 연결된 길 사이에 또 다리를 놓으면 불필요한 굴레(사이클)가 생겨요."
    }
  },

  middle: {
    title: "중학생: 스마트시티 초고속 광통신망 설계",
    subtitle: "도시 내 모든 주요 거점을 최소 비용으로 연결하는 통신망을 구축하라!",
    badge: "중등 레벨 (효율성 & 그리디)",
    concept: {
      headline: "실생활의 네트워크 최적화: 가중치 그래프와 MST",
      story: "현대 도시에서 모든 관공서와 데이터센터, 거주 구역을 광케이블로 연결할 때 케이블 매설 비용은 수백억 원에 달합니다.\n\n불필요하게 닫힌 루프(사이클)를 만들지 않으면서 전체를 하나로 묶는 최소 비용 네트워크를 구축하는 것이 바로 크루스칼(Kruskal) 알고리즘의 원리입니다.",
      rules: [
        "1. 모든 간선의 가중치(공사 비용)를 오름차순으로 정렬합니다.",
        "2. 비용이 가장 저렴한 간선부터 차례대로 통신망에 편입합니다.",
        "3. 만약 해당 간선을 연결했을 때 사이클(폐쇄 회로)이 형성되면 즉시 제외합니다.",
        "4. 선택된 간선의 수가 (노드 수 - 1)개가 되면 최소 비용 통신망이 완성됩니다."
      ],
      nodes: [
        { id: 0, label: "시청", x: 180, y: 140 },
        { id: 1, label: "테크밸리", x: 520, y: 140 },
        { id: 2, label: "중앙역", x: 520, y: 340 },
        { id: 3, label: "데이터센터", x: 180, y: 340 }
      ],
      edges: [
        { id: "mid-c1", u: 0, v: 1, weight: 10, desc: "10억 원" },
        { id: "mid-c2", u: 1, v: 2, weight: 15, desc: "15억 원" },
        { id: "mid-c3", u: 2, v: 3, weight: 20, desc: "20억 원" },
        { id: "mid-c4", u: 0, v: 3, weight: 35, desc: "35억 원 (사이클 발생)" },
        { id: "mid-c5", u: 0, v: 2, weight: 25, desc: "25억 원 (사이클 발생)" }
      ],
      mstWeight: 45,
      requiredEdges: 3
    },
    example: {
      headline: "예제: 5개 거점 오름차순 간선 선택 시뮬레이션",
      story: "우측 '간선 큐(Queue)'에서 비용이 낮은 순서대로 간선을 확인하고 선택해 보세요.",
      nodes: [
        { id: 0, label: "A (시청)", x: 200, y: 120 },
        { id: 1, label: "B (중앙역)", x: 500, y: 120 },
        { id: 2, label: "C (테크)", x: 580, y: 280 },
        { id: 3, label: "D (연구단지)", x: 350, y: 380 },
        { id: 4, label: "E (데이터)", x: 120, y: 280 }
      ],
      edges: [
        { id: "me-1", u: 0, v: 1, weight: 3 },
        { id: "me-2", u: 1, v: 2, weight: 4 },
        { id: "me-3", u: 2, v: 3, weight: 5 },
        { id: "me-4", u: 3, v: 4, weight: 6 },
        { id: "me-5", u: 4, v: 0, weight: 8 }, // cycle
        { id: "me-6", u: 0, v: 3, weight: 9 }, // cycle
        { id: "me-7", u: 1, v: 3, weight: 7 }  // cycle
      ],
      mstEdges: ["me-1", "me-2", "me-3", "me-4"],
      mstWeight: 18,
      requiredEdges: 4
    },
    mission: {
      headline: "미션: 6대 핵심 거점 광통신망 최적화 챌린지",
      story: "공사 예산을 최소화하여 통신망을 완성하세요! 최소 비용 도달률과 사이클 방지 정확도에 따라 최종 점수(100점 만점)가 산출됩니다.",
      nodes: [
        { id: 0, label: "시청", x: 200, y: 90 },
        { id: 1, label: "혁신밸리", x: 500, y: 90 },
        { id: 2, label: "항만", x: 600, y: 240 },
        { id: 3, label: "공항", x: 450, y: 390 },
        { id: 4, label: "중앙병원", x: 250, y: 390 },
        { id: 5, label: "스마트산단", x: 100, y: 240 }
      ],
      edges: [
        { id: "mm-1", u: 0, v: 1, weight: 3 },
        { id: "mm-2", u: 4, v: 3, weight: 4 },
        { id: "mm-3", u: 1, v: 2, weight: 5 },
        { id: "mm-4", u: 5, v: 0, weight: 6 },
        { id: "mm-5", u: 2, v: 3, weight: 7 },
        { id: "mm-6", u: 5, v: 4, weight: 8 },
        { id: "mm-7", u: 0, v: 4, weight: 9 },
        { id: "mm-8", u: 1, v: 3, weight: 11 },
        { id: "mm-9", u: 0, v: 2, weight: 13 }
      ],
      mstEdges: ["mm-1", "mm-2", "mm-3", "mm-4", "mm-5"],
      mstWeight: 25,
      requiredEdges: 5,
      cycleFeedback: "통신망 루프(Cycle) 감지! 신호가 무한 반복되어 패킷 충돌을 유발하므로 이 선로는 제외해야 합니다."
    }
  },

  high: {
    title: "고등학생: 분산 시스템 MST 알고리즘 연구원",
    subtitle: "Greedy Choice Property와 Disjoint-Set으로 O(E log E) 최적화 증명",
    badge: "고등 레벨 (수학적 원리 & 시간제한)",
    concept: {
      headline: "최소 신장 트리(MST)와 탐욕 알고리즘(Greedy)의 수학적 정당성",
      story: "연결 무방향 가중치 그래프 $G=(V, E)$에서 모든 정점을 포함하면서 가중치의 합이 최소인 트리 $T$를 최소 신장 트리(MST)라고 부릅니다.\n\n크루스칼 알고리즘은 '매 순간 가장 작은 가중치를 가진 간선을 선택하되, 사이클을 만들지 않는다'는 그리디(Greedy) 전략을 취합니다. 이는 컷 속성(Cut Property)에 의해 전역 최적해(Global Optimum)가 엄밀하게 보장됩니다.",
      rules: [
        "1. 간선 가중치 정렬: $E$개의 간선을 오름차순으로 퀵 정렬 또는 힙 정렬($O(E \\log E)$).",
        "2. Disjoint-Set(서로소 집합): 경로 압축(Path Compression)을 통해 $O(\\alpha(V))$에 사이클 존재 여부 판별.",
        "3. 트리 완성 조건: 트리에는 폐회로(Cycle)가 없으며, 선택된 간선의 수는 정확히 $|V|-1$개."
      ],
      nodes: [
        { id: 0, label: "Node 1", x: 180, y: 130 },
        { id: 1, label: "Node 2", x: 520, y: 130 },
        { id: 2, label: "Node 3", x: 520, y: 330 },
        { id: 3, label: "Node 4", x: 180, y: 330 }
      ],
      edges: [
        { id: "hc-1", u: 0, v: 1, weight: 1, desc: "w=1 (MST 포함)" },
        { id: "hc-2", u: 1, v: 2, weight: 2, desc: "w=2 (MST 포함)" },
        { id: "hc-3", u: 2, v: 3, weight: 3, desc: "w=3 (MST 포함)" },
        { id: "hc-4", u: 0, v: 3, weight: 5, desc: "w=5 (Cycle 성분, 거절)" }
      ],
      mstWeight: 6,
      requiredEdges: 3
    },
    example: {
      headline: "예제: 6-노드 분산 클러스터 토폴로지 분석",
      story: "정렬된 간선 테이블을 확인하며 그리디하게 간선을 선택하고, Disjoint-Set의 Union-Find 연산 과정을 추적하세요.",
      nodes: [
        { id: 0, label: "V0", x: 150, y: 140 },
        { id: 1, label: "V1", x: 350, y: 90 },
        { id: 2, label: "V2", x: 550, y: 140 },
        { id: 3, label: "V3", x: 550, y: 330 },
        { id: 4, label: "V4", x: 350, y: 380 },
        { id: 5, label: "V5", x: 150, y: 330 }
      ],
      edges: [
        { id: "he-1", u: 0, v: 1, weight: 2 },
        { id: "he-2", u: 1, v: 2, weight: 3 },
        { id: "he-3", u: 3, v: 4, weight: 4 },
        { id: "he-4", u: 4, v: 5, weight: 5 },
        { id: "he-5", u: 0, v: 5, weight: 6 },
        { id: "he-6", u: 1, v: 4, weight: 7 },
        { id: "he-7", u: 2, v: 3, weight: 8 }
      ],
      mstEdges: ["he-1", "he-2", "he-3", "he-4", "he-5"],
      mstWeight: 20,
      requiredEdges: 5
    },
    mission: {
      headline: "미션: 8-노드 복합 그래프 실시간 90초 MST 시뮬레이터",
      story: "제한 시간 90초 이내에 오름차순 그리디 탐색과 사이클 판별을 수행하여 절대적 최소 가중치 신장 트리를 도출하세요!",
      timeLimit: 90, // seconds
      nodes: [
        { id: 0, label: "N1", x: 220, y: 80 },
        { id: 1, label: "N2", x: 480, y: 80 },
        { id: 2, label: "N3", x: 600, y: 220 },
        { id: 3, label: "N4", x: 520, y: 370 },
        { id: 4, label: "N5", x: 350, y: 400 },
        { id: 5, label: "N6", x: 180, y: 370 },
        { id: 6, label: "N7", x: 100, y: 220 },
        { id: 7, label: "N8 (코어)", x: 350, y: 230 }
      ],
      edges: [
        { id: "hm-1", u: 0, v: 1, weight: 2 },
        { id: "hm-2", u: 0, v: 7, weight: 3 },
        { id: "hm-3", u: 6, v: 5, weight: 4 },
        { id: "hm-4", u: 1, v: 2, weight: 5 },
        { id: "hm-5", u: 7, v: 4, weight: 6 },
        { id: "hm-6", u: 4, v: 3, weight: 7 },
        { id: "hm-7", u: 6, v: 7, weight: 8 },
        { id: "hm-8", u: 2, v: 3, weight: 9 },
        { id: "hm-9", u: 5, v: 4, weight: 10 },
        { id: "hm-10", u: 0, v: 6, weight: 11 },
        { id: "hm-11", u: 1, v: 7, weight: 12 },
        { id: "hm-12", u: 3, v: 7, weight: 14 }
      ],
      mstEdges: ["hm-1", "hm-2", "hm-3", "hm-4", "hm-5", "hm-6", "hm-7"],
      mstWeight: 35,
      requiredEdges: 7,
      cycleFeedback: "사이클 발생 거절! Disjoint-Set의 Find(u) === Find(v)이므로 트리의 무폐회로 공리를 위배합니다."
    }
  }
};

/**
 * High School Career Exploration Recommendations (학생부 세특/진로활동 추천 보고서 주제)
 */
const HIGH_SCHOOL_CAREER_TOPICS = [
  {
    id: "topic-1",
    tag: "컴퓨터공학 / 알고리즘",
    title: "Kruskal vs Prim 알고리즘의 희소(Sparse) 및 밀집(Dense) 그래프에서의 시간 복잡도 비교 및 성능 벤치마킹",
    overview: "간선의 수가 적은 희소 그래프($E \\approx V$)에서는 간선 중심의 크루스칼($O(E \\log E)$)이 유리하고, 완전 그래프에 가까운 밀집 그래프($E \\approx V^2$)에서는 정점 중심의 프림(우선순위 큐 적용 시 $O(E + V \\log V)$, 인접 행렬 시 $O(V^2)$)이 더 유리함을 수식 유도 및 시뮬레이션으로 입증하는 탐구 보고서.",
    keyQuestions: [
      "1. 그래프의 밀도 계수(Density)에 따라 두 알고리즘의 실제 CPU 연산 클럭은 어떻게 역전되는가?",
      "2. 크루스칼에서 Disjoint-Set의 경로 압축(Path Compression)이 아커만 역함수 $\\alpha(V)$ 수준으로 연산량을 축소시키는 원리는 무엇인가?",
      "3. 피보나치 힙(Fibonacci Heap)을 도입한 프림 알고리즘의 이론적 성능 한계는 실무에서 왜 자주 사용되지 않는가?"
    ],
    outline: "I. 연구 동기 -> II. 알고리즘 이론적 복잡도 수식 유도 -> III. 파이썬/C++ 벤치마크 환경 구축 -> IV. 밀도별 실험 데이터 그래프화 -> V. 결론 및 고찰"
  },
  {
    id: "topic-2",
    tag: "정보통신 / 네트워크 프로토콜",
    title: "IEEE 802.1D Spanning Tree Protocol(STP)의 브로드캐스트 스톰 방지 메커니즘과 OSPF 최단 경로 알고리즘 비교",
    overview: "실제 컴퓨터 네트워크 스위칭 환경에서 물리적 이중화 루프로 인해 발생하는 '브로드캐스트 스톰(Broadcast Storm)'을 방지하기 위해 사용되는 스패닝 트리 프로토콜(STP)이 어떻게 신장 트리(Spanning Tree)를 동적으로 선출하는지 규명하고, 계층 3 라우팅의 다익스트라(Dijkstra) 기반 OSPF 프로토콜과의 구조적 차이를 분석하는 연구.",
    keyQuestions: [
      "1. 루트 브리지(Root Bridge) 선출과 지정 포트(Designated Port) 차단 과정에서 BPDU 프레임 교환 원리는 어떻게 분산형 Kruskal과 유사한가?",
      "2. 네트워크 링크 장애 발생 시 수렴 시간(Convergence Time)을 단축하기 위한 RSTP(802.1w)의 최적화 기법은 무엇인가?",
      "3. 최단 경로 트리(SPT)와 최소 신장 트리(MST)의 본질적인 목적 차이(개별 노드 최단거리 vs 전체 인프라 최소비용)는 무엇인가?"
    ],
    outline: "I. 탐구 배경(스위치 루프 장애) -> II. STP 알고리즘 4단계 선출 프로세스 -> III. 패킷 트레이서(Packet Tracer) 시뮬레이션 -> IV. MST와의 수학적 대응 관계 -> V. 미래 SDN 환경 전망"
  },
  {
    id: "topic-3",
    tag: "수학 / 조합론 & 최적화",
    title: "매트로이드(Matroid) 공리계를 통한 탐욕 알고리즘(Greedy)의 최적해 보장 수학적 증명 및 컷 속성(Cut Property) 연구",
    overview: "모든 탐욕 알고리즘이 항상 전역 최적해를 보장하지는 않는 이유(예: 배낭 문제, 외판원 문제)를 조합론의 '매트로이드(Matroid)' 이론으로 엄밀하게 설명하고, 그래프의 신장 트리가 그래픽 매트로이드(Graphic Matroid)를 이룸으로써 크루스칼의 그리디 선택이 왜 100% 최적성을 가질 수밖에 없는지 증명하는 수학 심화 탐구.",
    keyQuestions: [
      "1. 독립 집합 시스템(Independence System)에서 교환 공리(Exchange Axiom)를 만족하는 구조적 조건은 무엇인가?",
      "2. 컷 속성(Cut Property)과 사이클 속성(Cycle Property)을 수학적 귀납법 및 귀류법으로 전개하여 MST 증명하기",
      "3. 이진 가중치가 부여된 네트워크에서 탐욕 알고리즘의 변형과 근사 알고리즘(Approximation)으로의 확장 가능성"
    ],
    outline: "I. 서론(그리디 알고리즘의 성패 조건) -> II. 매트로이드의 세 가지 공리 정의 -> III. 그래픽 매트로이드 증명 -> IV. 크루스칼 알고리즘 정당성의 귀류법 증명 -> V. 진로 연계(수학적 모델링 역량)"
  }
];

if (typeof window !== "undefined") {
  window.GRAPH_DATA = GRAPH_DATA;
  window.HIGH_SCHOOL_CAREER_TOPICS = HIGH_SCHOOL_CAREER_TOPICS;
}
