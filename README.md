# ⚡ 크루스칼의 마법: 낭비 제로(0) 네트워크를 설계하라
> **Kruskal's Algorithm Interactive Visualizer & EdTech Web App**  
> 전력·통신망 설치 축전 부스 및 컴퓨터과학 교육용 인터랙티브 웹 애플리케이션

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

---

## 📌 프로젝트 소개 (Overview)

**크루스칼의 마법**은 그래프 이론의 핵심인 **최소 신장 트리(Minimum Spanning Tree, MST)**를 누구나 직관적으로 체득할 수 있도록 기획·개발된 고성능 인터랙티브 웹 애플리케이션입니다.

가상의 10개 섬 군도에 최소 비용으로 전력 및 광통신 해저 케이블망을 구축하는 시나리오를 바탕으로, **그리디(Greedy) 알고리즘**과 **서로소 집합(Disjoint Set / Union-Find)**의 동작 원리를 생생한 캔버스 그래픽과 실시간 오디오 피드백으로 경험할 수 있습니다.

---

## ✨ 핵심 기능 (Key Features)

### 1. 🎨 동적 캔버스 그래프 렌더링 & 물리학 애니메이션
- 10개의 노드(발전소 및 허브 섬)와 16개의 간선(해저 케이블 후보)을 60fps로 매끄럽게 시각화.
- 전류 흐름 애니메이션 파티클, 선택/배제 시의 네온 발광 효과.

### 2. 🧠 단계별(Step-by-Step) 크루스칼 알고리즘 시뮬레이션
- 비용(가중치) 오름차순 정렬 간선 큐를 하나씩 검토.
- **사이클(Cycle) 검사:** 서로소 집합(Union-Find)을 통해 이미 연결된 컴포넌트 여부를 검사하고, 루프 형성 시 즉각 경고 및 배제 사유 표시.
- **경로 압축(Path Compression)** 및 **Rank 기반 Union** 최적화 적용 ($O(\alpha(V))$).

### 3. 🔊 Web Audio API 절차적 사운드 신시사이저
- 외부 음원 파일 의존 없이 브라우저 오실레이터(OscillatorNode)를 활용한 100% 순수 코드 사운드 엔진.
- 케이블 연결 성공음, 사이클 발생 경고음, 전체 네트워크 완성 축하 팡파레 제공.

### 4. 📱 네오-브루탈리즘 & 사이버-글래스 반응형 UI
- 다크 네이비 캔버스 기반의 하이 콘트라스트 비주얼 시스템.
- CSS 변수 기반 디자인 토큰 시스템 (`design-tokens.css`) 적용으로 유지보수성 및 확장성 극대화.

---

## 🏗️ 소프트웨어 아키텍처 (Architecture)

```text
축전웹앱/
├── index.html              # 시맨틱 마크업 및 컨트롤 패널 UI 구조
├── css/
│   ├── design-tokens.css   # 전역 색상, 폰트, 간격, 섀도우 토큰 체계
│   └── style.css           # 레이아웃, 캔버스 스타일, 인터랙션 애니메이션
├── js/
│   ├── disjoint-set.js     # Path Compression & Union-by-Rank 자료구조 클래스
│   ├── graph-data.js       # 섬 좌표 및 해저 케이블 그래프 토폴로지 정의
│   ├── sound.js            # Web Audio API 기반 절차적 사운드 엔진
│   └── app.js              # 캔버스 렌더링 루프 및 상태 관리 오케스트레이터
├── .gitignore              # 버전 관리 제외 규칙
└── README.md               # 프로젝트 매뉴얼
```

---

## 🚀 빠른 시작 (Getting Started)

외부 라이브러리(CDN, npm 등)에 의존하지 않는 **순수 웹 표준 기술(Vanilla Web Tech)**로 작성되어 있어, 브라우저만 있으면 어디서나 즉시 실행 가능합니다.

### 로컬 실행
1. 저장소를 클론합니다:
   ```bash
   git clone https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
   cd <YOUR-REPO-NAME>
   ```
2. `index.html` 파일을 더블 클릭하여 실행하거나, VS Code 등의 `Live Server`로 실행합니다.

---

## 🌐 GitHub Pages 무료 배포 가이드 (1분 완성)

이 프로젝트는 정적 웹사이트이므로 **GitHub Pages**를 통해 누구나 접속 가능한 웹사이트로 즉시 배포할 수 있습니다:

1. 본인 GitHub 저장소 페이지 상단의 **Settings** 메뉴로 이동합니다.
2. 좌측 사이드바에서 **Pages**를 클릭합니다.
3. **Build and deployment** 섹션의 Source를 `Deploy from a branch`로 선택합니다.
4. Branch를 `main` (또는 master) / `/ (root)`로 지정하고 **Save**를 누릅니다.
5. 1~2분 후 생성되는 공개 URL(`https://<아이디>.github.io/<저장소명>/`)로 접속하면 전 세계 어디서든 체험할 수 있습니다!

---

## 📜 라이선스 (License)

이 프로젝트는 MIT 라이선스에 따라 자유롭게 수정 및 배포가 가능합니다.
