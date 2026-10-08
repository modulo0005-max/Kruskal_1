/**
 * Kruskal's Algorithm Interactive Web App Main Controller
 * Orchestrates Level Selection, 3-Step Educational Progression,
 * Interactive SVG Graph Visualization, and Kruskal/Union-Find Execution Engine.
 */

class KruskalApp {
  constructor() {
    this.currentLevel = null; // 'elementary' | 'middle' | 'high'
    this.currentStep = 'concept'; // 'concept' | 'example' | 'mission'
    this.graphData = null;
    this.disjointSet = null;
    this.selectedEdges = [];
    this.rejectedEdges = [];
    this.currentWeight = 0;
    this.timer = null;
    this.timeLeft = 0;
    this.score = 100;
    this.wrongAttempts = 0;

    // DOM Elements Cache
    this.dom = {
      levelSelectView: document.getElementById('level-select-view'),
      workspaceView: document.getElementById('workspace-view'),
      stepperNav: document.getElementById('stepper-nav'),
      currentLevelBadge: document.getElementById('current-level-badge'),
      headerLevelTitle: document.getElementById('header-level-title'),
      changeLevelBtn: document.getElementById('change-level-btn'),
      soundToggleBtn: document.getElementById('sound-toggle-btn'),
      timerDisplay: document.getElementById('timer-display'),
      timerWrapper: document.getElementById('timer-wrapper'),
      svgCanvas: document.getElementById('graph-svg'),
      svgContainer: document.getElementById('svg-canvas-wrapper'),
      canvasAlert: document.getElementById('canvas-alert'),
      stepTitle: document.getElementById('step-title'),
      stepDescription: document.getElementById('step-description'),
      metricEdges: document.getElementById('metric-edges'),
      metricWeight: document.getElementById('metric-weight'),
      edgeQueueContainer: document.getElementById('edge-queue-container'),
      edgeQueueTableBody: document.getElementById('edge-queue-body'),
      hintBtn: document.getElementById('hint-btn'),
      resetBtn: document.getElementById('reset-btn'),
      nextStepBtn: document.getElementById('next-step-btn'),
      resultModal: document.getElementById('result-modal'),
      modalTitle: document.getElementById('modal-title'),
      modalBody: document.getElementById('modal-body'),
      modalCloseBtn: document.getElementById('modal-close-btn'),
      conceptGuideBtn: document.getElementById('concept-guide-btn'),
      introConceptModal: document.getElementById('intro-concept-modal'),
      introConceptCloseBtn: document.getElementById('intro-concept-close-btn')
    };

    this.initEventListeners();
  }

  initEventListeners() {
    // Concept Guide Modal trigger
    if (this.dom.conceptGuideBtn) {
      this.dom.conceptGuideBtn.addEventListener('click', () => {
        window.soundManager.play('click');
        if (this.dom.introConceptModal) {
          this.dom.introConceptModal.classList.add('active');
        }
      });
    }

    if (this.dom.introConceptCloseBtn) {
      this.dom.introConceptCloseBtn.addEventListener('click', () => {
        window.soundManager.play('click');
        if (this.dom.introConceptModal) {
          this.dom.introConceptModal.classList.remove('active');
        }
      });
    }

    // Level selection cards
    document.querySelectorAll('.level-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const level = card.dataset.level;
        this.selectLevel(level);
      });
    });

    // Header level change
    this.dom.changeLevelBtn.addEventListener('click', () => {
      this.returnToLevelSelect();
    });

    // Sound toggle
    this.dom.soundToggleBtn.addEventListener('click', () => {
      const isMuted = window.soundManager.toggleMute();
      this.dom.soundToggleBtn.textContent = isMuted ? '🔇 소리 켜기' : '🔊 소리 끄기';
    });

    // Stepper navigation clicks
    document.querySelectorAll('.step-item').forEach(item => {
      item.addEventListener('click', () => {
        const step = item.dataset.step;
        this.setStep(step);
      });
    });

    // Reset button
    this.dom.resetBtn.addEventListener('click', () => {
      window.soundManager.play('click');
      this.resetCurrentStep();
    });

    // Hint button (Greedy suggestion)
    this.dom.hintBtn.addEventListener('click', () => {
      window.soundManager.play('click');
      this.provideGreedyHint();
    });

    // Next step button
    this.dom.nextStepBtn.addEventListener('click', () => {
      window.soundManager.play('click');
      if (this.currentStep === 'concept') {
        this.setStep('example');
      } else if (this.currentStep === 'example') {
        this.setStep('mission');
      } else {
        this.showResultModal();
      }
    });

    // Modal close
    this.dom.modalCloseBtn.addEventListener('click', () => {
      this.dom.resultModal.classList.remove('active');
    });
  }

  /**
   * Select school level and transition into interactive workspace
   * @param {'elementary' | 'middle' | 'high'} level 
   */
  selectLevel(level) {
    window.soundManager.play('select');
    this.currentLevel = level;
    this.dom.levelSelectView.style.display = 'none';
    this.dom.workspaceView.style.display = 'block';

    const levelConfig = window.GRAPH_DATA[level];
    this.dom.currentLevelBadge.textContent = levelConfig.badge;
    this.dom.headerLevelTitle.textContent = levelConfig.title;

    // Start with Concept step
    this.setStep('concept');
  }

  returnToLevelSelect() {
    window.soundManager.play('click');
    this.stopTimer();
    this.currentLevel = null;
    this.dom.workspaceView.style.display = 'none';
    this.dom.levelSelectView.style.display = 'block';
  }

  /**
   * Switch between [Concept] -> [Example] -> [Mission]
   * @param {'concept' | 'example' | 'mission'} step 
   */
  setStep(step) {
    this.stopTimer();
    this.currentStep = step;

    // Update Stepper Navigation visuals
    document.querySelectorAll('.step-item').forEach(item => {
      const itemStep = item.dataset.step;
      item.classList.remove('active');
      if (itemStep === step) {
        item.classList.add('active');
      }
    });

    // Load active step graph specification
    const levelConfig = window.GRAPH_DATA[this.currentLevel];
    this.activeData = levelConfig[step];

    // Update instruction panels
    this.dom.stepTitle.textContent = this.activeData.headline;
    this.dom.stepDescription.innerText = this.activeData.story;

    // Show/Hide Timer for High School Mission
    if (this.currentLevel === 'high' && step === 'mission') {
      this.dom.timerWrapper.style.display = 'flex';
      this.startTimer(this.activeData.timeLimit || 90);
    } else {
      this.dom.timerWrapper.style.display = 'none';
    }

    // Reset algorithm state
    this.resetCurrentStep();
  }

  resetCurrentStep() {
    this.selectedEdges = [];
    this.rejectedEdges = [];
    this.currentWeight = 0;
    this.wrongAttempts = 0;

    // Initialize DisjointSet with number of nodes
    const nodeCount = this.activeData.nodes.length;
    this.disjointSet = new DisjointSet(nodeCount);

    // Update status indicators
    this.updateMetrics();
    this.renderGraph();
    this.renderEdgeQueue();
    this.hideAlert();

    // Configure Next button text
    if (this.currentStep === 'concept') {
      this.dom.nextStepBtn.textContent = '예제 문제 풀기 →';
    } else if (this.currentStep === 'example') {
      this.dom.nextStepBtn.textContent = '게이미피케이션 미션 도전 →';
    } else {
      this.dom.nextStepBtn.textContent = '결과 및 진로 보고서 보기';
    }
  }

  startTimer(seconds) {
    this.stopTimer();
    this.timeLeft = seconds;
    this.updateTimerDisplay();

    this.timer = setInterval(() => {
      this.timeLeft--;
      this.updateTimerDisplay();

      if (this.timeLeft <= 0) {
        this.stopTimer();
        window.soundManager.play('cycle');
        this.showAlert('시간이 초과되었습니다! 다시 도전해보세요.', 'alert-error');
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  updateTimerDisplay() {
    const mins = Math.floor(this.timeLeft / 60);
    const secs = this.timeLeft % 60;
    this.dom.timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  updateMetrics() {
    const required = this.activeData.requiredEdges;
    this.dom.metricEdges.textContent = `${this.selectedEdges.length} / ${required}`;
    this.dom.metricWeight.textContent = `${this.currentWeight} (목표: ${this.activeData.mstWeight})`;
  }

  /**
   * Calculate node circle radius and text formatting to guarantee label fits completely inside
   * @param {string} labelText 
   */
  formatNodeLabel(labelText) {
    const textStr = String(labelText).trim();
    
    // Check if label contains parenthesis: e.g. "A (시청)", "B (중앙역)", "N8 (코어)", "D (연구단지)"
    const parenMatch = textStr.match(/^([A-Za-z0-9]+)\s*[\(\[](.+)[\)\]]$/);
    if (parenMatch) {
      return {
        isMultiLine: true,
        line1: parenMatch[1],
        line2: parenMatch[2],
        radius: 36
      };
    }

    const len = textStr.length;
    if (len <= 2) {
      // 1~2 chars: e.g. "시청", "항만", "공항", "곰", "토끼", "V0", "N1"
      return { isMultiLine: false, line1: textStr, radius: 30, fontSize: 13 };
    } else if (len <= 3) {
      // 3 chars: e.g. "중앙역", "곰마을"
      return { isMultiLine: false, line1: textStr, radius: 34, fontSize: 12 };
    } else if (len <= 4) {
      // 4 chars: e.g. "토끼마을", "사슴마을", "여우마을", "테크밸리", "중앙병원", "혁신밸리", "Node 1"
      return { isMultiLine: false, line1: textStr, radius: 36, fontSize: 11.5 };
    } else {
      // 5+ chars: e.g. "다람쥐마을", "데이터센터", "스마트산단"
      return { isMultiLine: false, line1: textStr, radius: 39, fontSize: 10.5 };
    }
  }

  /**
   * Render SVG Graph Nodes, Edges, and Weight Badges
   */
  renderGraph() {
    const svg = this.dom.svgCanvas;
    svg.innerHTML = '';

    const nodes = this.activeData.nodes;
    const edges = this.activeData.edges;

    // SVG Defs for arrowheads or filters if needed
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svg.appendChild(defs);

    // Group for Edges
    const edgesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    edgesGroup.setAttribute('id', 'edges-layer');
    svg.appendChild(edgesGroup);

    // Group for Edge Weights
    const weightsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    weightsGroup.setAttribute('id', 'weights-layer');
    svg.appendChild(weightsGroup);

    // Group for Nodes
    const nodesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    nodesGroup.setAttribute('id', 'nodes-layer');
    svg.appendChild(nodesGroup);

    // Map nodes by id for quick coordinate lookup
    const nodeMap = {};
    nodes.forEach(n => { nodeMap[n.id] = n; });

    // 1. Draw Edges
    edges.forEach(edge => {
      const uNode = nodeMap[edge.u];
      const vNode = nodeMap[edge.v];
      if (!uNode || !vNode) return;

      const isSelected = this.selectedEdges.some(e => e.id === edge.id);
      const isRejected = this.rejectedEdges.some(e => e.id === edge.id);

      // Edge line
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', uNode.x);
      line.setAttribute('y1', uNode.y);
      line.setAttribute('x2', vNode.x);
      line.setAttribute('y2', vNode.y);
      line.setAttribute('id', `edge-line-${edge.id}`);
      line.classList.add('graph-edge');

      if (isSelected) line.classList.add('selected', 'mst-edge');
      if (isRejected) line.classList.add('cycle-rejected');

      // Click event for line
      line.addEventListener('click', () => this.handleEdgeClick(edge));
      edgesGroup.appendChild(line);

      // Midpoint for weight badge
      const midX = (uNode.x + vNode.x) / 2;
      const midY = (uNode.y + vNode.y) / 2;

      // Edge Weight Group
      const weightGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      weightGroup.setAttribute('class', 'edge-weight-group');
      weightGroup.setAttribute('id', `weight-group-${edge.id}`);
      if (isSelected) weightGroup.classList.add('selected', 'mst-edge');

      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      
      const textVal = edge.weight.toString();
      text.textContent = textVal;
      text.setAttribute('x', midX);
      text.setAttribute('y', midY);
      text.classList.add('edge-weight-text');

      // Pill dimensions based on text length
      const rectW = 28;
      const rectH = 20;
      rect.setAttribute('x', midX - rectW / 2);
      rect.setAttribute('y', midY - rectH / 2);
      rect.setAttribute('width', rectW);
      rect.setAttribute('height', rectH);
      rect.classList.add('edge-weight-rect');

      weightGroup.appendChild(rect);
      weightGroup.appendChild(text);
      weightGroup.addEventListener('click', () => this.handleEdgeClick(edge));
      weightsGroup.appendChild(weightGroup);
    });

    // 2. Draw Nodes (Auto-sized circle and auto-fitted text)
    nodes.forEach(node => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'graph-node');
      g.setAttribute('id', `node-g-${node.id}`);

      // Check if node has at least one connected selected edge
      const isConnected = this.selectedEdges.some(e => e.u === node.id || e.v === node.id);
      if (isConnected) g.classList.add('connected');
      if (this.selectedEdges.length === this.activeData.requiredEdges) {
        g.classList.add('mst-complete');
      }

      const labelInfo = this.formatNodeLabel(node.label);

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', node.x);
      circle.setAttribute('cy', node.y);
      circle.setAttribute('r', labelInfo.radius);
      circle.classList.add('graph-node-circle');

      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', node.x);
      label.classList.add('graph-node-label');

      if (labelInfo.isMultiLine) {
        label.setAttribute('y', node.y);

        const tspan1 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        tspan1.setAttribute('x', node.x);
        tspan1.setAttribute('dy', '-5');
        tspan1.setAttribute('font-size', '12px');
        tspan1.setAttribute('font-weight', '800');
        tspan1.textContent = labelInfo.line1;

        const tspan2 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        tspan2.setAttribute('x', node.x);
        tspan2.setAttribute('dy', '14');
        tspan2.setAttribute('font-size', '10.5px');
        tspan2.setAttribute('font-weight', '700');
        tspan2.textContent = labelInfo.line2;

        label.appendChild(tspan1);
        label.appendChild(tspan2);
      } else {
        label.setAttribute('y', node.y);
        label.setAttribute('font-size', `${labelInfo.fontSize}px`);
        label.textContent = labelInfo.line1;
      }

      g.appendChild(circle);
      g.appendChild(label);
      nodesGroup.appendChild(g);
    });
  }

  /**
   * Render Sorted Edge List Table for Middle and High School (Kruskal Priority Queue inspection)
   */
  renderEdgeQueue() {
    const tableBody = this.dom.edgeQueueTableBody;
    tableBody.innerHTML = '';

    // Sort edges ascending by weight (Kruskal greedy property)
    const sortedEdges = [...this.activeData.edges].sort((a, b) => a.weight - b.weight);

    sortedEdges.forEach((edge, idx) => {
      const tr = document.createElement('tr');
      tr.classList.add('edge-row');

      const isSelected = this.selectedEdges.some(e => e.id === edge.id);
      const isRejected = this.rejectedEdges.some(e => e.id === edge.id);

      if (isSelected) tr.classList.add('selected');
      if (isRejected) tr.classList.add('cycle');

      // Node labels
      const nodeU = this.activeData.nodes.find(n => n.id === edge.u);
      const nodeV = this.activeData.nodes.find(n => n.id === edge.v);
      const connectionStr = `${nodeU ? nodeU.label : edge.u} ↔ ${nodeV ? nodeV.label : edge.v}`;

      let statusTag = '<span class="edge-status-tag tag-waiting">대기중</span>';
      if (isSelected) statusTag = '<span class="edge-status-tag tag-mst">MST 포함</span>';
      if (isRejected) statusTag = '<span class="edge-status-tag tag-cycle">사이클 제외</span>';

      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td><strong>${connectionStr}</strong></td>
        <td>${edge.weight}</td>
        <td>${statusTag}</td>
      `;

      tr.addEventListener('click', () => this.handleEdgeClick(edge));
      tableBody.appendChild(tr);
    });
  }

  /**
   * Main Kruskal Interaction: Edge Click Validation and Cycle Detection via Union-Find
   * @param {Object} edge - { id, u, v, weight }
   */
  handleEdgeClick(edge) {
    // If already in MST, prevent redundant processing
    if (this.selectedEdges.some(e => e.id === edge.id)) {
      this.showAlert('이미 선택된 간선입니다.', 'alert-info');
      return;
    }

    // If edge was previously rejected as cycle, inform user
    if (this.rejectedEdges.some(e => e.id === edge.id)) {
      this.showAlert('사이클(루프)을 형성하므로 선택할 수 없는 간선입니다.', 'alert-error');
      return;
    }

    // Check Cycle using DisjointSet find(u) === find(v)
    const formsCycle = this.disjointSet.connected(edge.u, edge.v);

    if (formsCycle) {
      // 1. CYCLE DETECTED!
      this.wrongAttempts++;
      this.rejectedEdges.push(edge);
      window.soundManager.play('cycle');

      // Visual feedback: Shake line and flash red
      const edgeLine = document.getElementById(`edge-line-${edge.id}`);
      if (edgeLine) {
        edgeLine.classList.add('cycle-rejected', 'edge-shake');
        setTimeout(() => edgeLine.classList.remove('edge-shake'), 400);
      }

      // Time penalty in High School mode
      if (this.currentLevel === 'high' && this.currentStep === 'mission') {
        this.timeLeft = Math.max(0, this.timeLeft - 5);
        this.updateTimerDisplay();
      }

      // Informative alert with level-specific phrasing
      const feedbackMsg = this.activeData.cycleFeedback || 
        (this.currentLevel === 'elementary' 
          ? "빙글빙글 갇혀버렸어요! 이미 이어진 마을이라 또 놓으면 사이클이 생겨요!" 
          : "사이클 발생 거절! 두 노드가 이미 같은 트리에 속해 있습니다.");
      
      this.showAlert(feedbackMsg, 'alert-error');

      // Re-render Edge queue status
      this.renderEdgeQueue();
      return;
    }

    // 2. VALID SELECTION (NO CYCLE)
    // Perform Union in Disjoint Set
    this.disjointSet.union(edge.u, edge.v);
    this.selectedEdges.push(edge);
    this.currentWeight += edge.weight;

    window.soundManager.play('select');
    this.showAlert(`간선 연결 성공! (가중치: ${edge.weight})`, 'alert-success');

    // Update visuals
    this.updateMetrics();
    this.renderGraph();
    this.renderEdgeQueue();

    // 3. CHECK MST COMPLETION (V - 1 edges reached)
    if (this.selectedEdges.length === this.activeData.requiredEdges) {
      this.handleMissionSuccess();
    }
  }

  handleMissionSuccess() {
    window.soundManager.play('success');
    this.stopTimer();

    const isOptimal = (this.currentWeight === this.activeData.mstWeight);
    const feedbackText = isOptimal 
      ? `축하합니다! 최소 가중치 ${this.activeData.mstWeight}로 완벽한 최소 신장 트리(MST)를 완성했습니다!`
      : `모든 정점이 연결되었습니다! (현재 가중치: ${this.currentWeight}, 최적 MST: ${this.activeData.mstWeight})`;

    this.showAlert(feedbackText, 'alert-success');

    // Re-render with completion styles
    this.renderGraph();

    // Trigger Success Modal after brief pause
    setTimeout(() => {
      this.showResultModal();
    }, 800);
  }

  provideGreedyHint() {
    // Find unselected edges that don't form cycles, sorted by weight
    const available = this.activeData.edges
      .filter(e => !this.selectedEdges.some(se => se.id === e.id) && !this.rejectedEdges.some(re => re.id === e.id))
      .sort((a, b) => a.weight - b.weight);

    for (const cand of available) {
      if (!this.disjointSet.connected(cand.u, cand.v)) {
        // Highlight this edge as best greedy choice
        const uNode = this.activeData.nodes.find(n => n.id === cand.u);
        const vNode = this.activeData.nodes.find(n => n.id === cand.v);
        const nameStr = `${uNode ? uNode.label : cand.u} ↔ ${vNode ? vNode.label : cand.v}`;
        this.showAlert(`💡 크루스칼 힌트: 가중치 ${cand.weight}의 [${nameStr}] 간선을 가장 먼저 확인해 보세요!`, 'alert-info');

        const edgeLine = document.getElementById(`edge-line-${cand.id}`);
        if (edgeLine) {
          edgeLine.style.stroke = 'var(--color-ikea-yellow)';
          edgeLine.style.strokeWidth = '8px';
          setTimeout(() => {
            edgeLine.style.stroke = '';
            edgeLine.style.strokeWidth = '';
          }, 1500);
        }
        return;
      }
    }

    this.showAlert('더 이상 추가할 유효한 간선이 없습니다.', 'alert-info');
  }

  showAlert(message, type = 'alert-info') {
    const alertBox = this.dom.canvasAlert;
    alertBox.textContent = message;
    alertBox.className = `canvas-alert-box show ${type}`;

    if (this.alertTimeout) clearTimeout(this.alertTimeout);
    this.alertTimeout = setTimeout(() => {
      this.hideAlert();
    }, 3500);
  }

  hideAlert() {
    const alertBox = this.dom.canvasAlert;
    alertBox.classList.remove('show');
  }

  /**
   * Display Final Result Modal with Achievement Badges and High School Career Section
   */
  showResultModal() {
    const modal = this.dom.resultModal;
    const isOptimal = (this.currentWeight === this.activeData.mstWeight);
    const scoreVal = isOptimal ? 100 : Math.max(60, 100 - (this.currentWeight - this.activeData.mstWeight) * 5 - this.wrongAttempts * 5);

    this.dom.modalTitle.textContent = isOptimal ? '🎉 미션 클리어! MST 구축 완료' : '👏 모든 마을 연결 완료!';

    let summaryHTML = `
      <div style="background: #f7f7f7; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>달성 점수:</span>
          <strong><span style="color: var(--color-status-success); font-size: 20px;">${scoreVal}점</span> / 100점</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>선택된 간선 수:</span>
          <strong>${this.selectedEdges.length}개 (정점 - 1개 만족)</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>총 간선 가중치(비용):</span>
          <strong>${this.currentWeight} (최적치: ${this.activeData.mstWeight})</strong>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>사이클 회피 실패 횟수:</span>
          <strong>${this.wrongAttempts}회</strong>
        </div>
      </div>
    `;

    // High School Career Exploration Section (Requirement #4)
    if (this.currentLevel === 'high') {
      summaryHTML += `
        <div class="career-section">
          <div class="career-section-title">
            <span>🎓</span> 학교생활기록부 진로/탐구활동 보고서 추천 주제 (3선)
          </div>
          <div class="career-section-desc">
            오늘 실습한 크루스칼 알고리즘과 최소 신장 트리(MST)를 컴퓨터공학, 정보보안, 이산수학 진로와 연계할 수 있는 탐구 주제입니다.
          </div>
          <div class="career-cards-grid">
      `;

      window.HIGH_SCHOOL_CAREER_TOPICS.forEach((topic) => {
        summaryHTML += `
          <div class="career-card">
            <div class="career-card-header">
              <span class="career-topic-tag">${topic.tag}</span>
              <button class="btn btn-secondary copy-btn" onclick="app.copyTopicToClipboard('${topic.id}')">📋 개요 복사</button>
            </div>
            <h4 class="career-card-title">${topic.title}</h4>
            <div class="career-card-body">${topic.overview}</div>
            <div class="career-outline-list">
              <strong>추천 보고서 목차:</strong> ${topic.outline}
            </div>
          </div>
        `;
      });

      summaryHTML += `</div></div>`;
    }

    this.dom.modalBody.innerHTML = summaryHTML;
    modal.classList.add('active');
  }

  copyTopicToClipboard(topicId) {
    const topic = window.HIGH_SCHOOL_CAREER_TOPICS.find(t => t.id === topicId);
    if (!topic) return;

    const copyText = `[학교생활기록부 진로/탐구활동 계획서]
■ 주제명: ${topic.title}
■ 세부 분야: ${topic.tag}
■ 탐구 개요: ${topic.overview}
■ 핵심 연구 질문:
${topic.keyQuestions.join('\n')}
■ 권장 보고서 목차:
${topic.outline}`;

    navigator.clipboard.writeText(copyText).then(() => {
      this.showAlert('보고서 개요가 클립보드에 복사되었습니다!', 'alert-success');
    }).catch(err => {
      console.warn('Clipboard write error', err);
    });
  }
}

// Global App Initialization
document.addEventListener('DOMContentLoaded', () => {
  window.app = new KruskalApp();
});
