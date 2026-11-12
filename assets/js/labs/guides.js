/** Authored reading guides for every instrument.
 *
 *  Four questions per instrument: what am I looking at, what does each control
 *  do, how do I read the dynamics, and what should I try?  The text is written
 *  by hand in all three editions; it is never machine-translated at runtime.
 *  Keeping it next to the laboratories makes drift visible: the build script
 *  checks that every registered laboratory has a guide in every language.
 */

export const GUIDE_CHROME = {
  en: {
    summary: 'Reading guide · parameters · what to try',
    read: 'What you see',
    params: 'Controls',
    dynamics: 'Reading the dynamics',
    try: 'Try this',
    caveat: 'Limits',
  },
  zh: {
    summary: '读图指南 · 参数解读 · 动手实验',
    read: '你看到的是什么',
    params: '参数解读',
    dynamics: '动态解读',
    try: '试一试',
    caveat: '适用边界',
  },
  de: {
    summary: 'Lesehilfe · Parameter · Experimente',
    read: 'Was Sie sehen',
    params: 'Regler',
    dynamics: 'Dynamik lesen',
    try: 'Probieren Sie',
    caveat: 'Grenzen',
  },
};

export const GUIDES = {
  lattice: {
    en: {
      read: `<p>Each square is one site; a cyan or amber edge is an open bond, a thin dot is a closed one. Sites themselves are coloured by the cluster they belong to: <b>cyan</b> is the largest cluster, <b>amber</b> the second largest, blue-grey the rest, near-black is an empty site. The readout “left–right crossing” turns green only when one cluster touches both vertical boundaries.</p>
        <p>The vertical scale is not a third dimension of the lattice: it is only a drawing device, so that a bond crossing another can be seen. The physics is two-dimensional.</p>`,
      params: `<dl class="guide-key">
        <dt>Lattice</dt><dd>Square, triangular or honeycomb. The bond threshold is exactly 1/2, 2 sin(π/18) ≈ 0.3473, and 1 − 2 sin(π/18) ≈ 0.6527.</dd>
        <dt>Mode</dt><dd>Bond percolation opens edges; site percolation occupies vertices. Square site percolation has no closed-form p_c; 0.592746 is numerical.</dd>
        <dt>Size L</dt><dd>The box is L × L. Larger boxes sharpen every transition but cost O(L²) time and memory.</dd>
        <dt>Occupancy p</dt><dd>The independent probability of each edge or site. The interesting window is p ≈ p_c, not the whole interval.</dd>
        <dt>Resample / Sweep</dt><dd>Resample draws a fresh configuration at the same p and a new seed; Sweep slowly walks p so the transition can be watched.</dd>
      </dl>`,
      dynamics: `<p>Below p_c the largest cluster is small and its size fluctuates by a few sites. Near p_c it becomes comparable to the box and the crossing indicator flips between runs at fixed p — that flip is the finite-size transition, not a bug. Above p_c a single cluster spans the box and the second-largest cluster shrinks.</p>`,
      try: `<div class="guide-try"><b>1.</b> Set square bond, L = 64, p = 0.500 and press Resample ten times. Count how often the crossing is green: about half. This is the self-duality identity π(1/2) = 1/2.</div>
        <div class="guide-try"><b>2.</b> Compare square bond (p_c = 0.5) with square site (p_c ≈ 0.5927). At p = 0.55 the first is supercritical and the second is still subcritical; the picture should disagree even though p is the same.</div>
        <div class="guide-try"><b>3.</b> Hold p = p_c and increase L from 32 to 256. The crossing fraction stays near 1/2 but individual runs become more decisive: the transition is sharpening around a fixed point.</div>`,
      caveat: `<p>The colouring shows the largest cluster, not the “infinite” cluster: in a finite box there is no infinite cluster. The crossing test uses the actual open edges, not a statistical proxy.</p>`,
    },
    zh: {
      read: `<p>每个方格是一个位点；青色或琥珀色的边是开的键，细点是闭键。位点按所属团簇着色：<b>青色</b>是最大团簇，<b>琥珀色</b>是次大团簇，蓝灰色是其余团簇，接近黑色的是空位点。只有当一个团簇同时触及左右边界时，“左右横穿”才会变绿。</p>
        <p>竖直方向不是格子的第三个维度，只是为了看清交叉的边而采用的画法。物理是二维的。</p>`,
      params: `<dl class="guide-key">
        <dt>格子</dt><dd>方格、三角或蜂窝。键阈值分别是精确的 1/2、2 sin(π/18) ≈ 0.3473、1 − 2 sin(π/18) ≈ 0.6527。</dd>
        <dt>模式</dt><dd>键渗流打开边；位点渗流占据顶点。方格位点渗流没有闭式 p_c，0.592746 是数值结果。</dd>
        <dt>尺寸 L</dt><dd>盒子为 L × L。盒子越大转变越锐利，但时间与内存都是 O(L²)。</dd>
        <dt>占据概率 p</dt><dd>每条边或每个位点独立开放的概率。真正有信息量的是 p ≈ p_c 的窗口，而不是整个区间。</dd>
        <dt>重采样 / 扫描</dt><dd>重采样在相同 p 下换一个种子重新抽样；扫描缓慢移动 p，便于观察转变过程。</dd>
      </dl>`,
      dynamics: `<p>p_c 以下最大团簇很小，尺寸只随几个位点涨落。接近 p_c 时它与盒子同量级，固定 p 连续重采样会让横穿指示忽绿忽灰——这是有限尺度转变，不是程序错误。p_c 以上会有一个团簇贯通盒子，次大团簇随之缩小。</p>`,
      try: `<div class="guide-try"><b>1.</b> 选方格键渗流、L = 64、p = 0.500，连按十次重采样，数一数横穿为绿的次数：大约一半。这就是自对偶恒等式 π(1/2) = 1/2。</div>
        <div class="guide-try"><b>2.</b> 对比方格键渗流（p_c = 0.5）与方格位点渗流（p_c ≈ 0.5927）。在 p = 0.55 时前者已超临界、后者仍亚临界；同样的 p，图像应当不同。</div>
        <div class="guide-try"><b>3.</b> 固定 p = p_c，把 L 从 32 增到 256。横穿比例仍接近 1/2，但单次运行更“果断”：转变正在一个不动点周围变锐。</div>`,
      caveat: `<p>着色画的是最大团簇，不是“无限”团簇——有限盒子里没有无限团簇。横穿判定使用真实的开边，不是统计代理量。</p>`,
    },
    de: {
      read: `<p>Jedes Quadrat ist ein Platz; eine cyanfarbene oder bernsteinfarbene Kante ist eine offene Bindung, ein dünner Punkt eine geschlossene. Die Plätze sind nach ihrem Cluster gefärbt: <b>Cyan</b> ist der größte Cluster, <b>Bernstein</b> der zweitgrößte, blaugrau die übrigen, fast schwarz ein leerer Platz. „Durchgang links–rechts“ wird erst grün, wenn ein Cluster beide vertikalen Ränder berührt.</p>
        <p>Die Höhe ist keine dritte Gitterdimension, sondern nur eine Zeichenhilfe, damit sich kreuzende Bindungen sichtbar bleiben. Die Physik ist zweidimensional.</p>`,
      params: `<dl class="guide-key">
        <dt>Gitter</dt><dd>Quadrat, Dreieck oder Bienenwabe. Die Bindungs-Schwellen sind exakt 1/2, 2 sin(π/18) ≈ 0.3473 und 1 − 2 sin(π/18) ≈ 0.6527.</dd>
        <dt>Modus</dt><dd>Bindungsperkolation öffnet Kanten; Platzperkolation besetzt Knoten. Für das Quadratgitter gibt es keinen geschlossenen Ausdruck; 0.592746 ist numerisch.</dd>
        <dt>Größe L</dt><dd>Die Box ist L × L. Größere Boxen schärfen den Übergang, kosten aber O(L²) Zeit und Speicher.</dd>
        <dt>Besetzung p</dt><dd>Die unabhängige Wahrscheinlichkeit jeder Kante oder jedes Platzes. Interessant ist das Fenster um p_c, nicht das ganze Intervall.</dd>
        <dt>Neu ziehen / Sweep</dt><dd>Neu ziehen würfelt bei gleichem p mit neuem Startwert; der Sweep fährt p langsam ab, damit der Übergang sichtbar wird.</dd>
      </dl>`,
      dynamics: `<p>Unterhalb von p_c ist der größte Cluster klein und schwankt um wenige Plätze. Nahe p_c wird er boxgroß, und die Durchgangsanzeige springt bei festem p zwischen den Läufen — das ist der endliche Übergang, kein Fehler. Oberhalb von p_c durchspannt ein Cluster die Box, der zweitgrößte schrumpft.</p>`,
      try: `<div class="guide-try"><b>1.</b> Quadrat, Bindung, L = 64, p = 0.500, zehnmal neu ziehen. Zählen Sie die grünen Durchgänge: etwa die Hälfte. Das ist die Selbstdualität π(1/2) = 1/2.</div>
        <div class="guide-try"><b>2.</b> Vergleichen Sie Quadrat/Bindung (p_c = 0.5) mit Quadrat/Platz (p_c ≈ 0.5927). Bei p = 0.55 ist das erste superkritisch, das zweite noch subkritisch.</div>
        <div class="guide-try"><b>3.</b> Halten Sie p = p_c und erhöhen Sie L von 32 auf 256. Der Durchgangsanteil bleibt bei 1/2, aber einzelne Läufe werden entschiedener.</div>`,
      caveat: `<p>Gezeigt wird der größte Cluster, nicht der „unendliche“: In einer endlichen Box gibt es keinen. Der Durchgangstest benutzt die tatsächlichen offenen Kanten, keinen statistischen Ersatzwert.</p>`,
    },
  },
  crossing: {
    en: {
      read: `<p>Left: three measured curves π(p, L) for square bond percolation, one per lattice size. Right: the same three curves after the change of variable x = (p − p_c)L^{1/ν} with ν = 4/3. If the scaling hypothesis is right, the curves should fall on one master curve.</p>
        <p>The counters show the running estimates exactly at p_c. Duality forces each of them to 1/2 in the limit; the visible scatter is the Monte Carlo error, not a deviation from the theorem.</p>`,
      params: `<dl class="guide-key">
        <dt>Samples per tick</dt><dd>How many independent configurations are drawn per animation frame. Larger values give smoother curves but a heavier CPU load.</dd>
        <dt>Run / Pause</dt><dd>Pause keeps the accumulated statistics; the curves do not restart.</dd>
        <dt>Reset</dt><dd>Clears the counters and starts a fresh accumulation.</dd>
      </dl>`,
      dynamics: `<p>The raw curves steepen with L around p = 1/2. In the collapsed view the points migrate toward one curve as the sample grows; residual separation at the edges is a finite-size correction, expected and informative. The width of the transition in p shrinks as L^{-1/ν}, which is the content of the exponent ν = 4/3.</p>`,
      try: `<div class="guide-try"><b>1.</b> Let it run until the three π(p_c) counters are within about 0.01 of 0.5. If one is far off, the sample is still small.</div>
        <div class="guide-try"><b>2.</b> Watch the collapse plot grow denser. A bad exponent (try to imagine ν = 1) would fan the three curves out; the data choose ν ≈ 4/3.</div>
        <div class="guide-try"><b>3.</b> Note that the three curves cross at p_c, not at the point where each looks steepest. Curvature and crossing are different questions.</div>`,
      caveat: `<p>This is a teaching estimator. A publishable ν needs many independent seeds, blocking, and a fit with a quoted goodness-of-fit; the Data view documents the protocol used by the benchmark.</p>`,
    },
    zh: {
      read: `<p>左图：方格键渗流在三种尺寸下的实测横穿曲线 π(p, L)。右图：把同一批数据换成标度变量 x = (p − p_c)L^{1/ν}（ν = 4/3）后的结果。若标度假设成立，三条曲线应落到同一条主曲线上。</p>
        <p>计数器给出 p_c 处的实时估计。对偶性要求它们在极限下都等于 1/2；看到的散布是蒙特卡洛误差，不是对定理的偏离。</p>`,
      params: `<dl class="guide-key">
        <dt>每帧样本数</dt><dd>每个动画帧抽取多少个独立构型。数值越大曲线越平滑，CPU 负担也越重。</dd>
        <dt>运行 / 暂停</dt><dd>暂停会保留已累计的统计量，曲线不会重新开始。</dd>
        <dt>重置</dt><dd>清空计数器，从零重新累计。</dd>
      </dl>`,
      dynamics: `<p>原始曲线在 p = 1/2 附近随 L 增大而变陡。坍缩图里，随着样本增加，点会向同一条曲线聚拢；两端的残余分离是有限尺度修正，属于预期信息。转变在 p 上的宽度按 L^{-1/ν} 收缩，这就是 ν = 4/3 的含义。</p>`,
      try: `<div class="guide-try"><b>1.</b> 让程序跑到三个 π(p_c) 计数都在 0.5 ± 0.01 以内。若有一个偏离很远，说明样本还太少。</div>
        <div class="guide-try"><b>2.</b> 观察坍缩图逐渐变密。若指数取错（例如 ν = 1），三条曲线会散开；数据选择的是 ν ≈ 4/3。</div>
        <div class="guide-try"><b>3.</b> 注意三条曲线相交于 p_c，而不是各自看起来最陡的位置。曲率与交点回答的是两个不同问题。</div>`,
      caveat: `<p>这是教学用估计器。可发表的 ν 需要多组独立种子、分块误差与带拟合优度的报告；Data 视图记录了基准测试所用协议。</p>`,
    },
    de: {
      read: `<p>Links: drei gemessene Kurven π(p, L) für Quadrat/Bindung, eine pro Gittergröße. Rechts: dieselben Daten nach der Variablentransformation x = (p − p_c)L^{1/ν} mit ν = 4/3. Wenn die Skalenhypothese stimmt, fallen die Kurven auf eine Masterkurve.</p>
        <p>Die Zähler zeigen die laufende Schätzung genau bei p_c. Die Dualität erzwingt im Limes 1/2; die sichtbare Streuung ist Monte-Carlo-Fehler, keine Abweichung vom Satz.</p>`,
      params: `<dl class="guide-key">
        <dt>Stichproben pro Takt</dt><dd>Wie viele unabhängige Konfigurationen pro Frame gezogen werden. Mehr bedeutet glattere Kurven und mehr CPU-Last.</dd>
        <dt>Lauf / Pause</dt><dd>Pause behält die gesammelte Statistik; die Kurven beginnen nicht neu.</dd>
        <dt>Zurücksetzen</dt><dd>Löscht die Zähler und startet eine neue Akkumulation.</dd>
      </dl>`,
      dynamics: `<p>Die Rohkurven werden um p = 1/2 mit wachsendem L steiler. Im Kollapsbild wandern die Punkte mit größerer Stichprobe auf eine Kurve zu; die Resttrennung an den Rändern ist eine endliche Korrektur und erwartbar. Die Breite des Übergangs in p schrumpft wie L^{-1/ν} — das ist der Inhalt von ν = 4/3.</p>`,
      try: `<div class="guide-try"><b>1.</b> Laufen lassen, bis alle drei π(p_c)-Zähler innerhalb von etwa 0.01 um 0.5 liegen.</div>
        <div class="guide-try"><b>2.</b> Den Kollaps dichter werden lassen. Ein falscher Exponent (etwa ν = 1) würde die Kurven auffächern; die Daten wählen ν ≈ 4/3.</div>
        <div class="guide-try"><b>3.</b> Beachten Sie: Die Kurven kreuzen sich bei p_c, nicht dort, wo jede einzelne am steilsten aussieht.</div>`,
      caveat: `<p>Das ist ein Lehrschätzer. Ein publizierbarer ν-Wert braucht viele unabhängige Seeds, Blockbildung und einen Fit mit Anpassungsgüte; die Data-Ansicht dokumentiert das Protokoll.</p>`,
    },
  },
  'newman-ziff': {
    en: {
      read: `<p>One random ordering of all edges is drawn once. Adding the first k edges gives an exact sample of bond percolation at p = k/m, so the whole curve S_max(p) and χ(p) comes from one object instead of hundreds of independent simulations.</p>
        <p>The moving marker is the current p. The sparkline history on the right is not a second estimator; it is the same curve being revealed from left to right.</p>`,
      params: `<dl class="guide-key">
        <dt>Replay</dt><dd>Restarts the same edge order from k = 0 (the seed is unchanged, so the curve is identical).</dd>
        <dt>Current p</dt><dd>k/m. The sweep is monotone: edges are never removed.</dd>
        <dt>S_max, χ, clusters</dt><dd>Maintained by the union-find in O(α(n)) per edge. χ here is the second-moment proxy M₂/n.</dd>
      </dl>`,
      dynamics: `<p>Below p_c the largest cluster grows slowly and χ stays small. At p_c the largest cluster begins to absorb a finite fraction of the lattice and χ peaks; above p_c S_max rises toward 1 and χ falls. The peak location is a finite-size estimate of p_c, biased upward by a term of order L^{-1/ν}.</p>`,
      try: `<div class="guide-try"><b>1.</b> Pause near the χ peak and compare it with the p_c = 1/2 line. On a finite lattice the peak sits slightly above 1/2.</div>
        <div class="guide-try"><b>2.</b> Replay and watch the largest-cluster jump. Its size distribution is broad at p_c, which is why a single run is not an estimate.</div>
        <div class="guide-try"><b>3.</b> Read the “edges added” counter: the x-axis of the physical curve is that integer divided by the total number of edges, not an independently chosen p.</div>`,
      caveat: `<p>The points along one sweep are correlated: consecutive p values differ by one edge. Do not compute error bars from them as if they were independent; average over edge orders.</p>`,
    },
    zh: {
      read: `<p>先一次性抽出一条包含所有边的随机顺序。加入前 k 条边，就得到 p = k/m 处键渗流的一个精确样本，因此整条 S_max(p) 与 χ(p) 曲线来自同一个对象，而不是成百上千次独立模拟。</p>
        <p>移动标记是当前 p。右侧的迷你曲线不是第二个估计器，而是同一条曲线从左到右被逐步揭示的过程。</p>`,
      params: `<dl class="guide-key">
        <dt>重放</dt><dd>从 k = 0 重新播放同一条边序（种子不变，所以曲线完全相同）。</dd>
        <dt>当前 p</dt><dd>k/m。扫描是单调的：边只加入，不删除。</dd>
        <dt>S_max、χ、团簇数</dt><dd>由并查集以每条边 O(α(n)) 维护。这里的 χ 是二阶矩代理 M₂/n。</dd>
      </dl>`,
      dynamics: `<p>p_c 以下最大团簇缓慢增长，χ 很小。到 p_c 时最大团簇开始吞掉有限比例的格子，χ 达到峰值；p_c 以上 S_max 趋向 1，χ 回落。峰值位置是 p_c 的有限尺度估计，会被 O(L^{-1/ν}) 的项向上偏移。</p>`,
      try: `<div class="guide-try"><b>1.</b> 在 χ 峰值附近暂停，与 p_c = 1/2 的竖线比较。有限格子上峰值略高于 1/2。</div>
        <div class="guide-try"><b>2.</b> 重放并盯住最大团簇的跳变。p_c 处它的尺寸分布很宽，所以单次运行不能当作估计。</div>
        <div class="guide-try"><b>3.</b> 读“已加边数”：物理曲线的横坐标是这个整数除以总边数，不是另选的 p。</div>`,
      caveat: `<p>同一次扫描上的点彼此相关：相邻 p 只差一条边。不要把它们当作独立样本去算误差棒，应在多条边序上平均。</p>`,
    },
    de: {
      read: `<p>Ein einziger zufälliger Kantenordnung wird gezogen. Die ersten k Kanten ergeben eine exakte Stichprobe der Bindungsperkolation bei p = k/m; die ganze Kurve S_max(p), χ(p) stammt also aus einem Objekt statt aus Hunderten Simulationen.</p>
        <p>Die Markierung ist das aktuelle p. Die kleine Kurve rechts ist kein zweiter Schätzer, sondern dieselbe Kurve, die von links nach rechts sichtbar wird.</p>`,
      params: `<dl class="guide-key">
        <dt>Wiederholen</dt><dd>Startet dieselbe Kantenordnung bei k = 0 neu (gleicher Seed, identische Kurve).</dd>
        <dt>Aktuelles p</dt><dd>k/m. Der Sweep ist monoton: Kanten werden nie entfernt.</dd>
        <dt>S_max, χ, Cluster</dt><dd>Von der Union-Find-Struktur in O(α(n)) pro Kante gepflegt. χ ist hier der Zweitmoment-Proxy M₂/n.</dd>
      </dl>`,
      dynamics: `<p>Unter p_c wächst der größte Cluster langsam, χ bleibt klein. Bei p_c beginnt er, einen endlichen Anteil des Gitters zu absorbieren, und χ erreicht ein Maximum; darüber steigt S_max gegen 1, χ fällt. Die Peak-Lage ist eine endliche Schätzung von p_c, nach oben verschoben um O(L^{-1/ν}).</p>`,
      try: `<div class="guide-try"><b>1.</b> Nahe dem χ-Peak pausieren und mit der Linie p_c = 1/2 vergleichen. Auf endlichen Gittern liegt der Peak etwas darüber.</div>
        <div class="guide-try"><b>2.</b> Wiederholen und den Sprung des größten Clusters beobachten. Bei p_c ist die Größenverteilung breit; ein Lauf ist keine Schätzung.</div>
        <div class="guide-try"><b>3.</b> Den Zähler „Kanten“ lesen: Die x-Achse ist diese Zahl geteilt durch die Gesamtzahl der Kanten.</div>`,
      caveat: `<p>Die Punkte eines Sweeps sind korreliert: benachbarte p unterscheiden sich um eine Kante. Fehlerbalken daraus wären falsch; über Kantenordnungen mitteln.</p>`,
    },
  },
  network: {
    en: {
      read: `<p>A configuration-model graph with N = 20 000 vertices and a power-law degree distribution P(k) ∝ k^{−γ}. The left curve removes vertices uniformly at random; the right curve removes the highest-degree vertices first. The hub map shows the top 600 vertices by degree and the edges among them.</p>
        <p>The giant component fraction S(f) is the order parameter. The theoretical random-attack threshold is f_c = 1 − 1/(κ − 1) with κ = ⟨k²⟩/⟨k⟩; the targeted threshold is measured by where S falls below 0.02.</p>`,
      params: `<dl class="guide-key">
        <dt>Degree exponent γ</dt><dd>Smaller γ means heavier tails and more hubs. For γ ≤ 3 the second moment diverges in the infinite network, so random attack never destroys the giant component in the thermodynamic limit; any finite network still does.</dd>
        <dt>Attack mode</dt><dd>Random is the null model; targeted is the adversarial extreme.</dd>
        <dt>Removed fraction f</dt><dd>Move it to trace the curve. At f = 0 nothing has been removed.</dd>
      </dl>`,
      dynamics: `<p>For random attack the curve bends downward slowly and hits zero at f_c. For targeted attack it collapses much earlier: a small fraction of hubs carries the connectivity. As γ decreases, the gap between the two curves widens. The kappa readout tells you why: κ is the expected degree of a randomly chosen neighbour, and it is dominated by the tail.</p>`,
      try: `<div class="guide-try"><b>1.</b> Set γ = 2.5 and compare f_c(random) with f_c(targeted). The targeted curve should fail while about 80–90% of vertices remain.</div>
        <div class="guide-try"><b>2.</b> Increase γ to 3.5. Hubs become rare, the two curves move closer, and κ falls.</div>
        <div class="guide-try"><b>3.</b> Move f slowly around the drop. The transition is sharp but not a jump: S(f) is continuous in the configuration model.</div>`,
      caveat: `<p>N = 20 000 imposes a finite cutoff on the degree tail; the measured targeted threshold is therefore not the infinite-network value. The model has no geometry, no communities and no redundancy — real infrastructure has all three.</p>`,
    },
    zh: {
      read: `<p>N = 20 000 个顶点、度分布服从幂律 P(k) ∝ k^{−γ} 的配置模型图。左曲线均匀随机删除顶点；右曲线优先删除度最大的顶点。枢纽图显示按度排名前 600 的顶点及其之间的边。</p>
        <p>巨分量比例 S(f) 是序参量。随机攻击的理论阈值是 f_c = 1 − 1/(κ − 1)，其中 κ = ⟨k²⟩/⟨k⟩；定向攻击阈值按 S 降到 0.02 以下的位置实测。</p>`,
      params: `<dl class="guide-key">
        <dt>度指数 γ</dt><dd>γ 越小尾巴越重、枢纽越多。无限网络中 γ ≤ 3 时二阶矩发散，随机攻击在热力学极限下无法摧毁巨分量；任何有限网络仍然会。</dd>
        <dt>攻击模式</dt><dd>随机是零模型；定向是 adversarial 极端。</dd>
        <dt>删除比例 f</dt><dd>拖动它来描出曲线。f = 0 表示尚未删除任何顶点。</dd>
      </dl>`,
      dynamics: `<p>随机攻击下曲线缓慢下弯，在 f_c 处归零。定向攻击下曲线早得多地崩塌：少数枢纽承载了连通性。γ 越小时两条曲线的间距越大。κ 读数解释了原因：它是以随机邻居的期望度，由尾部主导。</p>`,
      try: `<div class="guide-try"><b>1.</b> 取 γ = 2.5，比较 f_c（随机）与 f_c（定向）。定向曲线应在还有 80–90% 顶点时已经失效。</div>
        <div class="guide-try"><b>2.</b> 把 γ 增到 3.5。枢纽变少，两条曲线靠近，κ 下降。</div>
        <div class="guide-try"><b>3.</b> 在跌落附近缓慢移动 f。转变很陡但不是跳变：配置模型中 S(f) 连续。</div>`,
      caveat: `<p>N = 20 000 对度尾部施加了有限截断，因此实测定向阈值不是无限网络值。该模型没有几何、没有社区、没有冗余——真实基础设施三者都有。</p>`,
    },
    de: {
      read: `<p>Ein Konfigurationsmodell mit N = 20 000 Knoten und Potenzgesetz-Gradverteilung P(k) ∝ k^{−γ}. Die linke Kurve entfernt Knoten gleichmäßig zufällig, die rechte zuerst die mit höchstem Grad. Die Hub-Karte zeigt die 600 größten Knoten und ihre Kanten.</p>
        <p>Der Anteil der Riesenkomponente S(f) ist der Ordnungsparameter. Die theoretische Zufalls-Schwelle ist f_c = 1 − 1/(κ − 1) mit κ = ⟨k²⟩/⟨k⟩; die gezielte Schwelle wird dort gemessen, wo S unter 0.02 fällt.</p>`,
      params: `<dl class="guide-key">
        <dt>Grad-Exponent γ</dt><dd>Kleineres γ bedeutet schwerere Tails und mehr Hubs. Für γ ≤ 3 divergiert das zweite Moment im unendlichen Netz; ein endliches Netz bricht trotzdem.</dd>
        <dt>Angriffsmodus</dt><dd>Zufällig ist das Nullmodell, gezielt der adversariale Extremfall.</dd>
        <dt>Entfernter Anteil f</dt><dd>Damit wird die Kurve abgefahren. Bei f = 0 ist nichts entfernt.</dd>
      </dl>`,
      dynamics: `<p>Bei Zufallsangriff knickt die Kurve langsam ab und erreicht null bei f_c. Bei gezieltem Angriff kollabiert sie viel früher: ein kleiner Anteil Hubs trägt die Konnektivität. Je kleiner γ, desto größer die Lücke. Der κ-Wert erklärt es: κ ist der erwartete Grad eines zufälligen Nachbarn und wird vom Tail dominiert.</p>`,
      try: `<div class="guide-try"><b>1.</b> γ = 2.5 setzen und f_c (zufällig) mit f_c (gezielt) vergleichen. Die gezielte Kurve sollte versagen, solange noch 80–90% der Knoten da sind.</div>
        <div class="guide-try"><b>2.</b> γ auf 3.5 erhöhen. Hubs werden seltener, die Kurven rücken zusammen, κ sinkt.</div>
        <div class="guide-try"><b>3.</b> f langsam um den Abfall bewegen. Der Übergang ist scharf, aber kein Sprung: S(f) ist im Konfigurationsmodell stetig.</div>`,
      caveat: `<p>N = 20 000 schneidet den Grad-Tail ab; der gemessene gezielte Schwellenwert ist daher nicht der des unendlichen Netzes. Das Modell hat keine Geometrie, keine Gemeinschaften und keine Redundanz.</p>`,
    },
  },
  interdependent: {
    en: {
      read: `<p>Two Erdős–Rényi layers of N = 4096 vertices each, coupled one-to-one: vertex i in layer A depends on vertex i in layer B. A vertex survives a round only if it is in the giant component of both layers. The left panels show the surviving set after the current round; the right curve is the mutual giant component as a function of the retained fraction p.</p>`,
      params: `<dl class="guide-key">
        <dt>Mean degree c</dt><dd>The ER mean degree inside each layer. Higher c makes each layer more robust alone.</dd>
        <dt>Retained fraction p</dt><dd>The initial survival probability before the cascade; the remaining vertices are the external shock.</dd>
        <dt>Restart cascade</dt><dd>Draws a fresh pair of layers and reruns the iteration from p.</dd>
      </dl>`,
      dynamics: `<p>Each round removes vertices that lost support in the other layer, which can disconnect more vertices, and so on. Watch the step counter: the cascade converges in a handful of rounds. Near p_c the mutual component jumps from a finite value to zero — a first-order (saddle-node) transition at p_c = 2.4554/c, not the continuous transition of a single layer. At p slightly below p_c the iteration may oscillate before collapsing.</p>`,
      try: `<div class="guide-try"><b>1.</b> Set c = 4. The predicted p_c is 2.4554/4 ≈ 0.614. Sweep p slowly across it and watch the mutual component disappear.</div>
        <div class="guide-try"><b>2.</b> Set c = 6. The threshold moves to ≈ 0.409; the coupled system is much more fragile than either layer alone (single-layer ER threshold 1/c ≈ 0.167).</div>
        <div class="guide-try"><b>3.</b> Watch the first round: it removes much more than the initial shock. The cascade, not the shock, is the damage.</div>`,
      caveat: `<p>The one-to-one coupling is the most fragile case. Partial coupling or redundancy restores a continuous transition; this instrument does not model those variants. N = 4096 is small enough that the jump is rounded.</p>`,
    },
    zh: {
      read: `<p>两个各含 N = 4096 个顶点的 Erdős–Rényi 层，一一耦合：A 层的第 i 个顶点依赖 B 层的第 i 个顶点。一个顶点只有在同时属于两层巨分量时才能存活一轮。左侧显示当前轮之后的存活集合；右侧曲线是相互巨分量随保留比例 p 的变化。</p>`,
      params: `<dl class="guide-key">
        <dt>平均度 c</dt><dd>每层内部的 ER 平均度。c 越大，单层本身越鲁棒。</dd>
        <dt>保留比例 p</dt><dd>级联开始前的初始存活概率；其余顶点就是外部冲击。</dd>
        <dt>重新级联</dt><dd>重新抽一对层，并从 p 开始重跑迭代。</dd>
      </dl>`,
      dynamics: `<p>每一轮删除在另一层失去支撑的顶点，这可能让更多顶点断开，如此往复。看步数计数：级联在少数几轮内收敛。p_c 附近相互分量从有限值跳到零——这是 p_c = 2.4554/c 处的一阶（鞍结）转变，不是单层的连续转变。p 略低于 p_c 时迭代可能先振荡再崩溃。</p>`,
      try: `<div class="guide-try"><b>1.</b> 取 c = 4，预测 p_c = 2.4554/4 ≈ 0.614。缓慢扫过它，看相互分量消失。</div>
        <div class="guide-try"><b>2.</b> 取 c = 6，阈值移到 ≈ 0.409；耦合系统比任何单层都脆弱得多（单层 ER 阈值 1/c ≈ 0.167）。</div>
        <div class="guide-try"><b>3.</b> 盯住第一轮：它删除的远多于初始冲击。造成损害的是级联，不是冲击本身。</div>`,
      caveat: `<p>一一耦合是最脆弱的情形。部分耦合或冗余会把转变恢复为连续的；本仪器不模拟这些变体。N = 4096 足够小，跳变会被抹圆。</p>`,
    },
    de: {
      read: `<p>Zwei Erdős–Rényi-Schichten mit je N = 4096 Knoten, eins zu eins gekoppelt: Knoten i in Schicht A hängt von Knoten i in Schicht B ab. Ein Knoten überlebt eine Runde nur, wenn er in der Riesenkomponente beider Schichten liegt. Links steht die Überlebendenmenge nach der aktuellen Runde; rechts die gemeinsame Riesenkomponente über dem erhaltenen Anteil p.</p>`,
      params: `<dl class="guide-key">
        <dt>Mittlerer Grad c</dt><dd>Der ER-Mittelgrad innerhalb jeder Schicht. Größeres c macht die einzelne Schicht robuster.</dd>
        <dt>Erhaltener Anteil p</dt><dd>Die anfängliche Überlebenswahrscheinlichkeit vor der Kaskade; der Rest ist der externe Schock.</dd>
        <dt>Kaskade neu starten</dt><dd>Zieht ein neues Schichtenpaar und startet die Iteration bei p.</dd>
      </dl>`,
      dynamics: `<p>Jede Runde entfernt Knoten, die in der anderen Schicht den Halt verloren haben, was weitere Knoten abtrennen kann. Der Schrittzähler zeigt: die Kaskade konvergiert in wenigen Runden. Nahe p_c springt die gemeinsame Komponente von einem endlichen Wert auf null — ein Übergang erster Ordnung (Sattel-Knoten) bei p_c = 2.4554/c, nicht der stetige Übergang einer Schicht.</p>`,
      try: `<div class="guide-try"><b>1.</b> c = 4 setzen: p_c ≈ 0.614. Langsam darüber hinwegfahren und das Verschwinden beobachten.</div>
        <div class="guide-try"><b>2.</b> c = 6 setzen: Schwelle ≈ 0.409; das gekoppelte System ist viel fragiler als jede Schicht allein (1/c ≈ 0.167).</div>
        <div class="guide-try"><b>3.</b> Die erste Runde beobachten: Sie entfernt viel mehr als den Anfangsschock. Die Kaskade ist der Schaden.</div>`,
      caveat: `<p>Die eins-zu-eins-Kopplung ist der fragilste Fall. Teilkopplung oder Redundanz stellt einen stetigen Übergang wieder her; dieses Labor modelliert das nicht. N = 4096 rundet den Sprung ab.</p>`,
    },
  },
  continuum: {
    en: {
      read: `<p>Poisson points are placed in a square and each gets a hard disk of radius r. Two disks are connected when they overlap; a cluster is a connected set of disks. The reduced density λ = nπr² is the only control parameter in the infinite system, which is why changing r and changing n move the picture in the same direction.</p>
        <p>Coverage is the fraction of the square inside at least one disk. Connectivity is the existence of a spanning cluster. They are different functions of λ.</p>`,
      params: `<dl class="guide-key">
        <dt>Disk radius r</dt><dd>Larger disks increase λ at fixed n and also change the finite-box geometry.</dd>
        <dt>Points n</dt><dd>Fixed by the laboratory; λ is shown so that the result can be compared with the literature threshold λ_c ≈ 1.128.</dd>
        <dt>Coverage vs S_max</dt><dd>The coverage curve is smooth and has no threshold. S_max is the order parameter and does have one.</dd>
      </dl>`,
      dynamics: `<p>At small λ the disks form small islands and S_max is a few percent. As λ approaches 1.128 a spanning cluster appears; just above it the largest component grows quickly while coverage is still only about 68%. In a finite box the measured onset is slightly above the infinite-system value and moves with the box size.</p>`,
      try: `<div class="guide-try"><b>1.</b> Find the λ at which S_max first exceeds about 0.5. Compare it with the dashed λ_c line; the gap is a finite-size effect.</div>
        <div class="guide-try"><b>2.</b> At λ ≈ 0.7 note the high coverage but disconnected field: coverage is not connectivity.</div>
        <div class="guide-try"><b>3.</b> Increase r rather than n. The picture changes because λ changes, not because the number of points changed — this is the scaling collapse of the Boolean model.</div>`,
      caveat: `<p>Hard disks are an idealisation: real sensors have anisotropic range, obstacles and a finite deployment region. The isolated-disk coverage formula 1 − e^{−λ} assumes infinite area.</p>`,
    },
    zh: {
      read: `<p>在正方形内撒 Poisson 点，每个点放一个半径 r 的硬圆盘。两盘相交即连通；团簇是连通的一组圆盘。无限系统中唯一的控制量是约化密度 λ = nπr²，所以在有限盒子里改变 r 与改变 n 会把图像推向同一方向。</p>
        <p>覆盖率是正方形中至少被一个圆盘覆盖的面积比例。连通性是存在贯通团簇。它们是 λ 的两个不同函数。</p>`,
      params: `<dl class="guide-key">
        <dt>圆盘半径 r</dt><dd>固定 n 时增大 r 会提高 λ，同时也改变有限盒子的几何。</dd>
        <dt>点数 n</dt><dd>由实验室固定；显示 λ 是为了能和文献阈值 λ_c ≈ 1.128 比较。</dd>
        <dt>覆盖率与 S_max</dt><dd>覆盖率曲线光滑、没有阈值；S_max 是序参量，确实有阈值。</dd>
      </dl>`,
      dynamics: `<p>λ 很小时圆盘形成小岛，S_max 只有百分之几。λ 接近 1.128 时出现贯通团簇；刚过阈值时最大分量迅速增大，而覆盖率仍只有约 68%。有限盒子中实测起点略高于无限系统值，并随盒尺寸移动。</p>`,
      try: `<div class="guide-try"><b>1.</b> 找出 S_max 首次超过约 0.5 的 λ，与虚线 λ_c 比较；差距是有限尺度效应。</div>
        <div class="guide-try"><b>2.</b> 在 λ ≈ 0.7 注意：覆盖率已经很高，但场仍然是断开的——覆盖不等于连通。</div>
        <div class="guide-try"><b>3.</b> 只增大 r 而不改 n。图像变化是因为 λ 变了，不是因为点数变了——这就是布尔模型的标度坍缩。</div>`,
      caveat: `<p>硬圆盘是理想化：真实传感器有各向异性量程、障碍物和有限部署区域。孤立圆盘覆盖公式 1 − e^{−λ} 假设无限面积。</p>`,
    },
    de: {
      read: `<p>Poisson-Punkte werden in ein Quadrat gesetzt, jeder erhält eine harte Scheibe vom Radius r. Zwei Scheiben sind verbunden, wenn sie sich überlappen; ein Cluster ist eine zusammenhängende Scheibenmenge. Die reduzierte Dichte λ = nπr² ist im unendlichen System der einzige Kontrollparameter.</p>
        <p>Überdeckung ist der Flächenanteil, der in mindestens einer Scheibe liegt. Konnektivität ist die Existenz eines durchspannenden Clusters. Beides sind verschiedene Funktionen von λ.</p>`,
      params: `<dl class="guide-key">
        <dt>Scheibenradius r</dt><dd>Größere Scheiben erhöhen λ bei festem n und verändern die Geometrie der endlichen Box.</dd>
        <dt>Punkte n</dt><dd>Im Labor fest; λ wird angezeigt, damit der Vergleich mit λ_c ≈ 1.128 möglich ist.</dd>
        <dt>Überdeckung vs. S_max</dt><dd>Die Überdeckung ist glatt und hat keine Schwelle; S_max ist der Ordnungsparameter und hat eine.</dd>
      </dl>`,
      dynamics: `<p>Bei kleinem λ bilden die Scheiben Inseln, S_max liegt bei wenigen Prozent. Nahe 1.128 erscheint ein durchspannender Cluster; knapp darüber wächst die größte Komponente schnell, während die Überdeckung erst etwa 68% beträgt. In einer endlichen Box liegt der gemessene Einsatz etwas höher.</p>`,
      try: `<div class="guide-try"><b>1.</b> Das λ finden, bei dem S_max erstmals 0.5 überschreitet, und mit der gestrichelten λ_c-Linie vergleichen.</div>
        <div class="guide-try"><b>2.</b> Bei λ ≈ 0.7 die hohe Überdeckung bei getrenntem Feld beobachten: Überdeckung ist nicht Konnektivität.</div>
        <div class="guide-try"><b>3.</b> Nur r erhöhen, nicht n. Das Bild ändert sich, weil λ sich ändert — das ist der Skalenkollaps des Booleschen Modells.</div>`,
      caveat: `<p>Harte Scheiben sind eine Idealisierung: reale Sensoren haben anisotrope Reichweite, Hindernisse und ein endliches Gebiet. Die Formel 1 − e^{−λ} setzt unendliche Fläche voraus.</p>`,
    },
  },
  cardy: {
    en: {
      read: `<p>The solid curve is Cardy's exact prediction for the probability that a critical rectangle of aspect ratio ℓ = H/W has a left–right open crossing, with wired left and right sides and free top and bottom. The dots are square-lattice measurements at p = 1/2. The vertical line marks ℓ = 1, where the prediction is exactly 1/2.</p>`,
      params: `<dl class="guide-key">
        <dt>Aspect ratio ℓ</dt><dd>Moves along the curve. ℓ &lt; 1 is a tall rectangle, ℓ &gt; 1 a wide one. The formula uses P(ℓ) = 1 − P(1/ℓ) for ℓ &gt; 1.</dd>
        <dt>π(ℓ)</dt><dd>The current value of the formula at the slider position; compare it with the nearest measured dot.</dd>
        <dt>₂F₁ and m</dt><dd>The hypergeometric factor and the elliptic modulus that solves ℓ = K(m)/K(1−m). At ℓ = 1, m = 1/2.</dd>
      </dl>`,
      dynamics: `<p>As ℓ grows, the crossing probability rises monotonically from 0 to 1, with the steepest part near ℓ = 1. The measured dots sit on the curve within their error bars; deviations grow for extreme aspect ratios because the measurement uses a finite lattice.</p>`,
      try: `<div class="guide-try"><b>1.</b> Put ℓ = 1 and read π. It should be 0.500 to the displayed precision.</div>
        <div class="guide-try"><b>2.</b> Check the symmetry P(1.5) + P(0.6667) = 1 within rounding. This is a consequence of the formula, not an independent measurement.</div>
        <div class="guide-try"><b>3.</b> Look at ℓ = 2: π is close to but below 1. A wide rectangle almost always crosses; “almost” is the interesting part.</div>`,
      caveat: `<p>The formula is for critical percolation with a continuous limit. Measured points have statistical error and finite-size correction; the laboratory shows both rather than hiding the disagreement.</p>`,
    },
    zh: {
      read: `<p>实线是 Cardy 的精确预测：临界矩形（纵横比 ℓ = H/W，左右边界 wired、上下自由）存在左右开横穿的概率。散点是方格子在 p = 1/2 的实测值。竖线标出 ℓ = 1，此时预测精确为 1/2。</p>`,
      params: `<dl class="guide-key">
        <dt>纵横比 ℓ</dt><dd>沿曲线移动。ℓ &lt; 1 是竖长矩形，ℓ &gt; 1 是横宽矩形。ℓ &gt; 1 时公式用 P(ℓ) = 1 − P(1/ℓ)。</dd>
        <dt>π(ℓ)</dt><dd>滑块位置处公式的当前值；可与最近的实测点比较。</dd>
        <dt>₂F₁ 与 m</dt><dd>超几何因子与椭圆模数，m 满足 ℓ = K(m)/K(1−m)。ℓ = 1 时 m = 1/2。</dd>
      </dl>`,
      dynamics: `<p>ℓ 增大时横穿概率从 0 单调升到 1，最陡处靠近 ℓ = 1。实测点在误差范围内落在曲线上；极端纵横比处偏差变大，因为测量使用有限格子。</p>`,
      try: `<div class="guide-try"><b>1.</b> 取 ℓ = 1 读 π，在显示精度内应为 0.500。</div>
        <div class="guide-try"><b>2.</b> 检查对称性 P(1.5) + P(0.6667) = 1（在舍入误差内）。这是公式的推论，不是独立测量。</div>
        <div class="guide-try"><b>3.</b> 看 ℓ = 2：π 接近 1 但小于 1。宽矩形几乎总会横穿；“几乎”才是有意思的部分。</div>`,
      caveat: `<p>公式针对连续极限下的临界渗流。实测点含统计误差与有限尺度修正；实验室把两者都显示出来，而不是掩盖分歧。</p>`,
    },
    de: {
      read: `<p>Die durchgezogene Kurve ist Cardys exakte Vorhersage für die Wahrscheinlichkeit, dass ein kritisches Rechteck mit Seitenverhältnis ℓ = H/W einen offenen Links-rechts-Durchgang hat (linke und rechte Seite verdrahtet, oben und unten frei). Die Punkte sind Messungen des Quadratgitters bei p = 1/2. Die senkrechte Linie markiert ℓ = 1, wo die Vorhersage exakt 1/2 ist.</p>`,
      params: `<dl class="guide-key">
        <dt>Seitenverhältnis ℓ</dt><dd>Bewegt den Punkt auf der Kurve. ℓ &lt; 1 ist hoch, ℓ &gt; 1 breit. Für ℓ &gt; 1 gilt P(ℓ) = 1 − P(1/ℓ).</dd>
        <dt>π(ℓ)</dt><dd>Der aktuelle Formelwert am Regler; mit dem nächsten Messpunkt vergleichen.</dd>
        <dt>₂F₁ und m</dt><dd>Hypergeometrischer Faktor und Ellipsenmodul mit ℓ = K(m)/K(1−m). Bei ℓ = 1 ist m = 1/2.</dd>
      </dl>`,
      dynamics: `<p>Mit wachsendem ℓ steigt die Durchgangswahrscheinlichkeit monoton von 0 auf 1, am steilsten nahe ℓ = 1. Die Messpunkte liegen innerhalb ihrer Fehlerbalken auf der Kurve; bei extremen Seitenverhältnissen wachsen die Abweichungen wegen der endlichen Gitter.</p>`,
      try: `<div class="guide-try"><b>1.</b> ℓ = 1 setzen und π ablesen: 0.500 in der angezeigten Genauigkeit.</div>
        <div class="guide-try"><b>2.</b> Die Symmetrie P(1.5) + P(0.6667) = 1 prüfen. Sie folgt aus der Formel, ist keine unabhängige Messung.</div>
        <div class="guide-try"><b>3.</b> ℓ = 2 ansehen: π liegt nahe 1, aber darunter. Ein breites Rechteck kreuzt fast immer — das „fast“ ist der interessante Teil.</div>`,
      caveat: `<p>Die Formel gilt für kritische Perkolation im kontinuierlichen Limes. Messpunkte tragen statistischen Fehler und endliche Korrekturen; das Labor zeigt beides, statt den Widerspruch zu verstecken.</p>`,
    },
  },
  directed: {
    en: {
      read: `<p>Edges point east (space) and south (time). A site is reachable from the left boundary only through west→east and north→south steps. The cyan region is the causal future of the left boundary after one configuration; the bar at the bottom turns green when the reachable set touches the right boundary.</p>
        <p>This is directed percolation in 1+1 dimensions. Its universality class is not the undirected one: the exponents and even the threshold identity are different.</p>`,
      params: `<dl class="guide-key">
        <dt>Mode</dt><dd>Bond or site. The thresholds are p_c ≈ 0.644700 for bond and ≈ 0.705489 for site.</dd>
        <dt>Size L</dt><dd>L × L with L up to 512; the causal cone is a triangle, so only about half the sites can ever be reached.</dd>
        <dt>p</dt><dd>Edge or site probability. The same p means something different here than in the undirected model.</dd>
        <dt>Resample / Sweep</dt><dd>A fresh configuration, or a measured π(p) curve from repeated samples.</dd>
      </dl>`,
      dynamics: `<p>Below p_c the reachable set dies out after a few rows: the causal cone narrows and closes. At p_c it survives with a power-law distribution of widths. Above p_c a finite fraction of the cone stays open. Unlike the undirected square lattice, there is no duality identity at p_c, so the crossing probability at p_c is not 1/2 — it is a non-universal number.</p>`,
      try: `<div class="guide-try"><b>1.</b> Set p = 0.6, below p_c. Resample a few times: the cyan triangle almost always dies before the right edge.</div>
        <div class="guide-try"><b>2.</b> Set p = 0.7, above p_c. The reachable set reaches deep into the lattice and often crosses.</div>
        <div class="guide-try"><b>3.</b> Compare the same p in the undirected lattice laboratory. Direction changes the threshold from 0.5 to 0.6447, which is a large effect for a one-line change of the model.</div>`,
      caveat: `<p>The sweep is a finite-size measurement. The quoted p_c values are numerical, not exact; there is no Kesten-type theorem in this model.</p>`,
    },
    zh: {
      read: `<p>边指向东（空间）和南（时间）。一个位点只能通过西→东、北→南的步子从左边界到达。青色区域是一次构型中左边界的因果未来；当可达集合触及右边界时，底部横条变绿。</p>
        <p>这是 1+1 维有向渗流。它的普适类不同于无向渗流：指数不同，连阈值恒等式也不存在。</p>`,
      params: `<dl class="guide-key">
        <dt>模式</dt><dd>键或位点。阈值约为 0.644700（键）与 0.705489（位点）。</dd>
        <dt>尺寸 L</dt><dd>L × L，L 最大 512；因果锥是三角形，所以最多只有约一半位点可能被到达。</dd>
        <dt>p</dt><dd>边或位点概率。同样的 p 在这里与无向模型中的含义不同。</dd>
        <dt>重采样 / 扫描</dt><dd>换一张构型，或用重复抽样得到实测 π(p) 曲线。</dd>
      </dl>`,
      dynamics: `<p>p_c 以下可达集合在几行内熄灭：因果锥变窄并闭合。p_c 处它以幂律宽度分布存活。p_c 以上锥中有有限比例保持开放。与无向方格不同，p_c 处没有对偶恒等式，因此横穿概率不是 1/2，而是一个非普适的数。</p>`,
      try: `<div class="guide-try"><b>1.</b> 取 p = 0.6（低于 p_c），多次重采样：青色三角形几乎总在到达右边界前熄灭。</div>
        <div class="guide-try"><b>2.</b> 取 p = 0.7（高于 p_c）：可达集合深入格子，常常横穿。</div>
        <div class="guide-try"><b>3.</b> 把同样的 p 放到无向格子实验室比较。方向把阈值从 0.5 改成 0.6447——仅仅改了一条规则，效应却很大。</div>`,
      caveat: `<p>扫描是有限尺度测量。所引 p_c 是数值而非精确值；这个模型没有 Kesten 型定理。</p>`,
    },
    de: {
      read: `<p>Kanten zeigen nach Osten (Raum) und Süden (Zeit). Ein Platz ist vom linken Rand nur über West→Ost- und Nord→Süd-Schritte erreichbar. Der cyanfarbene Bereich ist die kausale Zukunft des linken Randes; die Leiste unten wird grün, wenn die Menge den rechten Rand berührt.</p>
        <p>Das ist gerichtete Perkolation in 1+1 Dimensionen. Ihre Universalitätsklasse ist nicht die ungerichtete: Exponenten und sogar die Schwellenidentität unterscheiden sich.</p>`,
      params: `<dl class="guide-key">
        <dt>Modus</dt><dd>Bindung oder Platz. Die Schwellen sind p_c ≈ 0.644700 (Bindung) und ≈ 0.705489 (Platz).</dd>
        <dt>Größe L</dt><dd>L × L bis 512; der Kausalzapfen ist ein Dreieck, also ist höchstens etwa die Hälfte der Plätze erreichbar.</dd>
        <dt>p</dt><dd>Kanten- oder Platzwahrscheinlichkeit. Dasselbe p bedeutet hier etwas anderes als im ungerichteten Modell.</dd>
        <dt>Neu ziehen / Sweep</dt><dd>Eine neue Konfiguration oder eine gemessene π(p)-Kurve.</dd>
      </dl>`,
      dynamics: `<p>Unter p_c stirbt die erreichbare Menge nach wenigen Zeilen: der Kausalzapfen verengt sich und schließt. Bei p_c überlebt sie mit einer Potenzgesetz-Verteilung der Breiten. Darüber bleibt ein endlicher Anteil offen. Anders als beim ungerichteten Quadratgitter gibt es bei p_c keine Dualitätsidentität; die Durchgangswahrscheinlichkeit ist nicht 1/2.</p>`,
      try: `<div class="guide-try"><b>1.</b> p = 0.6 (unter p_c). Mehrfach neu ziehen: Das cyanfarbene Dreieck stirbt fast immer vor dem rechten Rand.</div>
        <div class="guide-try"><b>2.</b> p = 0.7 (über p_c). Die Menge reicht tief ins Gitter und kreuzt oft.</div>
        <div class="guide-try"><b>3.</b> Dasselbe p im ungerichteten Gitterlabor vergleichen. Die Richtung verschiebt die Schwelle von 0.5 auf 0.6447.</div>`,
      caveat: `<p>Der Sweep ist eine endliche Messung. Die p_c-Werte sind numerisch, nicht exakt; ein Kesten-Satz existiert hier nicht.</p>`,
    },
  },
  'random-cluster': {
    en: {
      read: `<p>A 64×64 square lattice carrying the q-state Potts model, represented as a random-cluster (FK) measure. Each sweep opens equal-spin edges with probability p, colours every FK cluster with a fresh Potts colour, and repeats. The left panel shows the spin configuration; the readouts are the largest FK cluster and the magnetisation.</p>`,
      params: `<dl class="guide-key">
        <dt>States q</dt><dd>q = 1 is ordinary percolation, q = 2 is Ising, q &gt; 2 is the q-state Potts model. The self-dual point is p_c(q) = √q/(1+√q).</dd>
        <dt>Edge probability p</dt><dd>The random-cluster edge weight. At q = 2 and p = 0.586 the model is critical.</dd>
        <dt>Play / Step / Reset</dt><dd>Play runs sweeps continuously, Step performs one full update, Reset redraws the spins.</dd>
      </dl>`,
      dynamics: `<p>Below p_c the magnetisation fluctuates around zero and the largest cluster is small. At p_c the cluster distribution becomes scale-free and the magnetisation fluctuates over a wide range. Above p_c one FK cluster dominates and the magnetisation settles near a nonzero value. The update is a Gibbs sampler: successive sweeps are correlated, so “equilibrium” is an approximation at this size.</p>`,
      try: `<div class="guide-try"><b>1.</b> Set q = 2 and p = 0.586. The model should look critical: large clusters appear and disappear between sweeps.</div>
        <div class="guide-try"><b>2.</b> Set q = 2 and p = 0.75. A single cluster should dominate and the magnetisation should stay near ±1.</div>
        <div class="guide-try"><b>3.</b> Change q at fixed p. The self-dual point moves: p_c(1) = 0.5, p_c(2) ≈ 0.586, p_c(3) ≈ 0.634. The same edge probability is sub- or supercritical depending on q.</div>`,
      caveat: `<p>One sweep is not one independent sample. The browser does not claim to equilibrate a large lattice; use the step counter and the fluctuation of the readouts to judge mixing.</p>`,
    },
    zh: {
      read: `<p>64×64 方格上的 q 态 Potts 模型，用随机簇（FK）测度表示。每次扫描以概率 p 打开自旋相同的边，给每个 FK 团簇分配新的 Potts 颜色，然后重复。左图是自旋构型；读数给出最大 FK 团簇与磁化强度。</p>`,
      params: `<dl class="guide-key">
        <dt>状态数 q</dt><dd>q = 1 是普通渗流，q = 2 是 Ising，q &gt; 2 是 q 态 Potts 模型。自对偶点为 p_c(q) = √q/(1+√q)。</dd>
        <dt>边概率 p</dt><dd>随机簇的边权重。q = 2、p = 0.586 时模型临界。</dd>
        <dt>播放 / 单步 / 重置</dt><dd>播放连续扫描，单步执行一次完整更新，重置重新抽取自旋。</dd>
      </dl>`,
      dynamics: `<p>p_c 以下磁化强度在零附近涨落，最大团簇很小。p_c 处团簇分布无标度，磁化强度大范围涨落。p_c 以上一个 FK 团簇占主导，磁化强度稳定在非零值附近。该更新是 Gibbs 采样器：相邻扫描相关，这个尺寸下的“平衡”只是近似。</p>`,
      try: `<div class="guide-try"><b>1.</b> 取 q = 2、p = 0.586。模型应呈临界状态：大团簇在扫描间出现又消失。</div>
        <div class="guide-try"><b>2.</b> 取 q = 2、p = 0.75。应有一个团簇主导，磁化强度接近 ±1。</div>
        <div class="guide-try"><b>3.</b> 固定 p 改变 q。自对偶点移动：p_c(1) = 0.5，p_c(2) ≈ 0.586，p_c(3) ≈ 0.634。同一个边概率会因 q 不同而处于亚临界或超临界。</div>`,
      caveat: `<p>一次扫描不等于一个独立样本。浏览器不声称能让大格子达到平衡；请结合步数计数与读数的涨落判断混合程度。</p>`,
    },
    de: {
      read: `<p>Ein 64×64-Quadratgitter mit dem q-Zustands-Potts-Modell, dargestellt als Random-Cluster-(FK-)Maß. Jeder Sweep öffnet Kanten gleichen Spins mit Wahrscheinlichkeit p, färbt jedes FK-Cluster neu und wiederholt das. Links die Spinkonfiguration; rechts größtes FK-Cluster und Magnetisierung.</p>`,
      params: `<dl class="guide-key">
        <dt>Zustände q</dt><dd>q = 1 ist gewöhnliche Perkolation, q = 2 Ising, q &gt; 2 das q-Zustands-Potts-Modell. Der selbstduale Punkt ist p_c(q) = √q/(1+√q).</dd>
        <dt>Kantenwahrscheinlichkeit p</dt><dd>Das Kantengewicht des Random-Cluster-Modells. Bei q = 2 und p = 0.586 ist es kritisch.</dd>
        <dt>Play / Schritt / Zurück</dt><dd>Play läuft fortlaufend, Schritt macht ein vollständiges Update, Zurück zieht die Spins neu.</dd>
      </dl>`,
      dynamics: `<p>Unter p_c schwankt die Magnetisierung um null, der größte Cluster ist klein. Bei p_c wird die Clusterverteilung skalenfrei und die Magnetisierung schwankt weit. Darüber dominiert ein FK-Cluster. Das Update ist ein Gibbs-Sampler: aufeinanderfolgende Sweeps sind korreliert, „Gleichgewicht“ ist hier eine Näherung.</p>`,
      try: `<div class="guide-try"><b>1.</b> q = 2, p = 0.586: Das Modell sollte kritisch aussehen — große Cluster erscheinen und verschwinden.</div>
        <div class="guide-try"><b>2.</b> q = 2, p = 0.75: Ein Cluster sollte dominieren, die Magnetisierung nahe ±1 bleiben.</div>
        <div class="guide-try"><b>3.</b> q bei festem p ändern: p_c(1) = 0.5, p_c(2) ≈ 0.586, p_c(3) ≈ 0.634. Dasselbe p kann je nach q sub- oder superkritisch sein.</div>`,
      caveat: `<p>Ein Sweep ist keine unabhängige Stichprobe. Der Browser behauptet nicht, ein großes Gitter zu equilibrieren; nutzen Sie den Schrittzähler und die Fluktuation der Anzeigen.</p>`,
    },
  },

  bootstrap: {
    en: {
      read: `<p>The grid shows three states. <b>Cyan</b> sites were occupied in the initial draw. <b>Amber</b> and <b>green</b> sites were empty at t = 0 but became active later; the colour tracks the activation round. Grey sites never activate.</p>
        <p>The top-right curve is the final active fraction as a function of p, measured for the current lattice and r. The bottom-right curve is the number of newly activated sites in each round: a cascade is a sequence of waves, not a single event.</p>`,
      params: `<dl class="guide-key">
        <dt>p</dt><dd>Independent occupation probability at t = 0. Only occupied sites are active initially.</dd>
        <dt>r</dt><dd>How many active neighbours an empty site needs. r = 2 on the square lattice is the classical two-neighbour rule; r = 4 is much harder to satisfy and needs a larger p.</dd>
        <dt>L</dt><dd>Box side. A larger box gives a sharper measured onset, but the finite-size transition is still rounded.</dd>
        <dt>Run / Step</dt><dd>Run draws a new configuration and animates the closure. Step advances one synchronous round without redrawing the configuration.</dd>
      </dl>`,
      dynamics: `<p>Below the onset, activation stops after a few rounds and the final fraction is close to p. Near the onset, a small increase in p produces a cascade that reaches most of the box. The round curve shows why: early waves create the neighbours that trigger the next wave. The final set does not depend on the order in which you apply the rule — it is the least fixed point of a monotone operator.</p>`,
      try: `<div class="guide-try"><b>1.</b> r = 2, L = 64, sweep p from 0.40 to 0.60. Find where the final fraction jumps from roughly p to nearly 1.</div>
        <div class="guide-try"><b>2.</b> Keep p fixed and raise r to 3 and 4. The cascade disappears; the same occupation is no longer enough.</div>
        <div class="guide-try"><b>3.</b> Compare Run and Step at the same configuration. Step reveals the wave structure; Run hides it in one animation.</div>`,
      caveat: `<p>Bootstrap percolation is not Bernoulli percolation: the final set is a deterministic closure of the initial draw, so its fluctuations come only from the initial occupation. The “onset” readout is a finite-size 50% crossing, not a theorem.</p>`,
    },
    zh: {
      read: `<p>格子有三种状态。<b>青色</b>位点在初始抽样中就被占据；<b>琥珀色</b>与<b>绿色</b>位点在 t = 0 时是空的，后来才被激活，颜色对应激活轮次；灰色位点始终不激活。</p>
        <p>右上曲线是最终活跃比例随 p 的变化（当前格子与 r）；右下曲线是每轮新增激活数：级联是一系列波，不是一个瞬间事件。</p>`,
      params: `<dl class="guide-key">
        <dt>p</dt><dd>t = 0 时每个位点独立被占据的概率。只有被占据的位点初始活跃。</dd>
        <dt>r</dt><dd>空位点需要的活跃邻居数。方格上的 r = 2 是经典的双邻居规则；r = 4 更难满足，需要更大的 p。</dd>
        <dt>L</dt><dd>盒子边长。盒子越大，实测起点越锐利，但有限尺度转变仍然是圆滑的。</dd>
        <dt>运行 / 单步</dt><dd>运行会重新抽一张构型并动画播放闭包；单步只推进一轮，不重抽构型。</dd>
      </dl>`,
      dynamics: `<p>起点以下，激活在几轮内停止，最终比例接近 p。接近起点时，p 的微小增加会触发覆盖大部分盒子的级联。轮次曲线解释了原因：早期的波制造出触发下一波所需的邻居。最终集合与施加规则的顺序无关——它是单调算子的最小不动点。</p>`,
      try: `<div class="guide-try"><b>1.</b> r = 2、L = 64，把 p 从 0.40 扫到 0.60，找出最终比例从大约 p 跳到接近 1 的位置。</div>
        <div class="guide-try"><b>2.</b> 固定 p，把 r 提到 3 和 4。级联消失：同样的占据率不再足够。</div>
        <div class="guide-try"><b>3.</b> 在同一构型上比较“运行”与“单步”。单步揭示波的结构，运行把它藏进一段动画。</div>`,
      caveat: `<p>自举渗流不是 Bernoulli 渗流：最终集合是初始抽样的确定性闭包，涨落只来自初始占据。“起点”读数是有限尺度的 50% 交点，不是定理。</p>`,
    },
    de: {
      read: `<p>Das Gitter hat drei Zustände. <b>Cyan</b> war im ersten Zug besetzt. <b>Bernstein</b> und <b>Grün</b> waren bei t = 0 leer und wurden später aktiv; die Farbe zeigt die Aktivierungsrunde. Graue Plätze werden nie aktiv.</p>
        <p>Die obere Kurve zeigt den aktiven Endanteil über p für das aktuelle Gitter und r. Die untere zeigt die neuen Aktivierungen pro Runde: eine Kaskade ist eine Folge von Wellen.</p>`,
      params: `<dl class="guide-key">
        <dt>p</dt><dd>Unabhängige Besetzungswahrscheinlichkeit bei t = 0. Nur besetzte Plätze sind anfangs aktiv.</dd>
        <dt>r</dt><dd>Wie viele aktive Nachbarn ein leerer Platz braucht. r = 2 ist die klassische Zwei-Nachbarn-Regel; r = 4 ist viel schwerer und braucht größeres p.</dd>
        <dt>L</dt><dd>Boxseite. Größere Boxen schärfen den gemessenen Einsatz, der Übergang bleibt aber endlich gerundet.</dd>
        <dt>Start / Schritt</dt><dd>Start zieht neu und animiert den Abschluss. Schritt geht eine synchrone Runde weiter, ohne neu zu ziehen.</dd>
      </dl>`,
      dynamics: `<p>Unterhalb des Einsatzes stoppt die Aktivierung nach wenigen Runden, der Endanteil liegt nahe p. Nahe dem Einsatz löst eine kleine p-Erhöhung eine Kaskade aus, die fast die ganze Box erfasst. Die Rundenkurve zeigt warum: frühe Wellen erzeugen die Nachbarn für die nächste Welle. Die Endmenge hängt nicht von der Reihenfolge ab — sie ist der kleinste Fixpunkt eines monotonen Operators.</p>`,
      try: `<div class="guide-try"><b>1.</b> r = 2, L = 64, p von 0.40 bis 0.60 fahren. Suchen Sie den Sprung von etwa p auf fast 1.</div>
        <div class="guide-try"><b>2.</b> p festhalten und r auf 3 und 4 erhöhen. Die Kaskade verschwindet.</div>
        <div class="guide-try"><b>3.</b> Start und Schritt bei derselben Konfiguration vergleichen.</div>`,
      caveat: `<p>Bootstrap-Perkolation ist keine Bernoulli-Perkolation: die Endmenge ist ein deterministischer Abschluss, Fluktuationen kommen nur aus der Anfangsbesetzung. Der „Einsatz“ ist ein endlicher 50%-Schnitt, kein Satz.</p>`,
    },
  },
  explosive: {
    en: {
      read: `<p>The cyan curve is the two-choice process: at each step two candidate edges are drawn and the product rule keeps the one whose endpoint components have the smaller size product. The grey curve is ordinary random edge addition. The x-axis is q = steps / n, which equals the number of added edges per vertex for this process.</p>
        <p>The lower-left panel shows ΔS_max per step: a spike locates the jump. The right panel is a finite-size check: it reruns the process at four sizes.</p>`,
      params: `<dl class="guide-key">
        <dt>Rule</dt><dd>Product is the original Achlioptas rule; sum is a weaker comparator. Both delay the giant component relative to random addition.</dd>
        <dt>n</dt><dd>Number of vertices. The random baseline percolates near q = ln 2 ≈ 0.693 when candidate pairs are drawn with replacement; the product rule pushes the crossing to much larger q.</dd>
        <dt>Seed</dt><dd>Fixes the candidate sequence, hence the whole curve. Re-running with the same seed reproduces it exactly.</dd>
        <dt>Scaling check</dt><dd>Repeats the process at n = 500, 1000, 2000, 4000 and reports the largest jump.</dd>
      </dl>`,
      dynamics: `<p>Watch the cyan curve lag the grey one, then rise steeply. The lag is the mechanism: the rule refuses to merge two small components early, so the cluster size distribution stays narrow and a large component appears late. The ΔS_max panel shows a single dominating spike. The scaling table is the honest test: the spike shrinks with n, so the apparent “explosion” is a finite-size sharpening, not a thermodynamic discontinuity.</p>`,
      try: `<div class="guide-try"><b>1.</b> Run with n = 2000 and note q at S_max = 1/2. Compare it with the random baseline near ln 2 ≈ 0.693.</div>
        <div class="guide-try"><b>2.</b> Press Scaling check. The largest jump should decrease as n grows. Quote that, not the single-run spike, if you need a thermodynamic statement.</div>
        <div class="guide-try"><b>3.</b> Switch to the sum rule. The delay is smaller; the product rule is the stronger suppressor.</div>`,
      caveat: `<p>The label “explosive” is historical. Rigorous work shows the product rule is continuous in the thermodynamic limit; what you see is a finite-size jump. The lab is designed to make that distinction visible, not to sell a discontinuity.</p>`,
    },
    zh: {
      read: `<p>青色曲线是双选择过程：每步抽两条候选边，乘积规则保留两端分量大小乘积较小的一条。灰色曲线是普通随机加边。横轴 q = 步数 / n，在这个过程里等于人均加边数。</p>
        <p>左下角是每步的 ΔS_max：尖峰标出跳变位置。右侧是有限尺度检验：在四种规模上重跑。</p>`,
      params: `<dl class="guide-key">
        <dt>规则</dt><dd>乘积是 Achlioptas 原始规则；求和是较弱的比较器。两者相对随机加边都推迟巨分量。</dd>
        <dt>n</dt><dd>顶点数。候选点对允许重复时，随机基线在 q = ln 2 ≈ 0.693 附近渗流；乘积规则把交点推到更大的 q。</dd>
        <dt>种子</dt><dd>固定候选序列，从而固定整条曲线。同一种子可精确复现。</dd>
        <dt>尺度检验</dt><dd>在 n = 500、1000、2000、4000 上重复，报告最大跳变。</dd>
      </dl>`,
      dynamics: `<p>注意青色曲线落后于灰色，然后陡峭上升。滞后就是机制：规则拒绝过早合并两个小分量，尺寸分布保持狭窄，大分量出现得晚。ΔS_max 面板显示单一主尖峰。尺度表才是诚实的检验：尖峰随 n 增大而缩小，所以表面上的“爆炸”是有限尺度锐化，不是热力学不连续。</p>`,
      try: `<div class="guide-try"><b>1.</b> 取 n = 2000，记下 S_max = 1/2 处的 q，与随机基线的 ln 2 ≈ 0.693 比较。</div>
        <div class="guide-try"><b>2.</b> 按“尺度检验”。最大跳变应随 n 增大而减小。若需要热力学陈述，引用这个趋势，而不是单次尖峰。</div>
        <div class="guide-try"><b>3.</b> 切到求和规则。推迟较小；乘积规则的抑制更强。</div>`,
      caveat: `<p>“爆炸”是历史名称。严格工作表明乘积规则在热力学极限下是连续的；你看到的是有限尺度跳变。本实验的目的正是让这个区别可见，而不是推销不连续性。</p>`,
    },
    de: {
      read: `<p>Die cyanfarbene Kurve ist der Zwei-Wahl-Prozess: pro Schritt werden zwei Kandidatenkanten gezogen, die Produktregel behält die mit dem kleineren Produkt der Endkomponenten. Die graue Kurve ist gewöhnliche zufällige Kantenzugabe. Die x-Achse ist q = Schritte / n, hier die Kanten pro Knoten.</p>
        <p>Unten links: ΔS_max pro Schritt; eine Spitze markiert den Sprung. Rechts: Endlichkeitsprüfung bei vier Größen.</p>`,
      params: `<dl class="guide-key">
        <dt>Regel</dt><dd>Produkt ist die ursprüngliche Achlioptas-Regel; Summe ist ein schwächerer Vergleich. Beide verzögern die Riesenkomponente.</dd>
        <dt>n</dt><dd>Knotenzahl. Die Zufallsbasis perkoliert bei Ziehen mit Zurücklegen nahe q = ln 2 ≈ 0.693; die Produktregel verschiebt den Übergang deutlich.</dd>
        <dt>Seed</dt><dd>Fixiert die Kandidatenfolge und damit die ganze Kurve.</dd>
        <dt>Skalenprüfung</dt><dd>Wiederholt bei n = 500, 1000, 2000, 4000 und meldet den größten Sprung.</dd>
      </dl>`,
      dynamics: `<p>Die cyanfarbene Kurve hinkt der grauen hinterher und steigt dann steil. Das ist der Mechanismus: Die Regel verweigert frühe Verschmelzungen kleiner Komponenten, die Größenverteilung bleibt schmal, eine große Komponente erscheint spät. Die Skalentabelle ist der ehrliche Test: Der Sprung schrumpft mit n, der scheinbare „Explosions“-Effekt ist eine endliche Schärfung.</p>`,
      try: `<div class="guide-try"><b>1.</b> n = 2000 und q bei S_max = 1/2 notieren; mit der Zufallsbasis nahe ln 2 ≈ 0.693 vergleichen.</div>
        <div class="guide-try"><b>2.</b> Skalenprüfung starten. Der größte Sprung sollte mit n sinken.</div>
        <div class="guide-try"><b>3.</b> Zur Summenregel wechseln: die Verzögerung ist kleiner.</div>`,
      caveat: `<p>„Explosiv“ ist historisch. Rigorose Arbeiten zeigen: Die Produktregel ist im thermodynamischen Limes stetig; sichtbar ist ein Endlichkeitssprung. Das Labor macht genau diese Unterscheidung sichtbar.</p>`,
    },
  },
  invasion: {
    en: {
      read: `<p>Each cell is a site; each edge carries an independent uniform threshold, shown as colour from cyan (low) to red (high). Starting at the highlighted seed, the cluster always crosses the lowest-threshold edge on its boundary. The white lines are accepted tree edges; the red lines, when enabled, are edges rejected because they would close a cycle.</p>
        <p>The threshold-sequence plot is not monotone: after invading a site, newly exposed edges can be cheaper than the last accepted one. That is the difference between invasion percolation and Prim's minimum spanning tree on a fixed graph — here the graph is revealed as you grow.</p>`,
      params: `<dl class="guide-key">
        <dt>L</dt><dd>Box side. On a connected box the invasion eventually fills every site; the interesting structure is in the early growth.</dd>
        <dt>Seed</dt><dd>Controls both the threshold field and the starting site.</dd>
        <dt>Show rejected loops</dt><dd>Draws the edges that were popped but led to an already invaded site.</dd>
        <dt>Grow / Step</dt><dd>Animates the growth, or advances by about 5% of the cluster.</dd>
      </dl>`,
      dynamics: `<p>At the beginning the cluster is compact and follows a path of low thresholds. Later it must accept higher thresholds to keep growing; the threshold-sequence plot trends upward with large local fluctuations. The mass–radius slope is fitted over the first 40% of the growth. For ordinary invasion percolation the asymptotic cluster is expected to be fractal, but a finite box and a short fit window make the readout a diagnostic, not a precision measurement.</p>`,
      try: `<div class="guide-try"><b>1.</b> Grow with L = 48. Note that the cluster sometimes expands into a low-threshold region far from the seed, then returns to a high-threshold boundary elsewhere.</div>
        <div class="guide-try"><b>2.</b> Enable rejected loops. Many edges are popped and discarded; the accepted set is always a tree.</div>
        <div class="guide-try"><b>3.</b> Change the seed and compare the threshold sequences. They differ, but both drift upward as the cluster grows.</div>`,
      caveat: `<p>This is ordinary invasion percolation with loop rejection. It does not implement the trapping variant used for defending clusters in porous media, and it does not model pressure-dependent viscosity. The mass–radius slope is finite-size limited.</p>`,
    },
    zh: {
      read: `<p>每个格子是一个位点；每条边带有独立均匀阈值，用颜色表示（青色低、红色高）。从高亮的种子出发，团簇总是穿过边界上阈值最小的边。白线是接受的树边；开启后红线是被拒绝的边，因为它们会闭合回路。</p>
        <p>阈值序列图不是单调的：侵入一个新位点后，新暴露的边可能比上一条接受的边更便宜。这正是侵入渗流与固定图上 Prim 最小生成树的区别——这里图是随生长逐步揭示的。</p>`,
      params: `<dl class="guide-key">
        <dt>L</dt><dd>盒子边长。在连通盒子里侵入最终会填满所有位点；有意思的结构在早期生长。</dd>
        <dt>种子</dt><dd>同时控制阈值场与起始位点。</dd>
        <dt>显示被拒绝的环</dt><dd>画出被弹出但指向已侵入位点的边。</dd>
        <dt>生长 / 单步</dt><dd>动画播放生长，或一次推进约 5% 的团簇。</dd>
      </dl>`,
      dynamics: `<p>开始时团簇较紧凑，沿低阈值路径前进。后来它必须接受更高阈值才能继续生长；阈值序列整体上升，但局部涨落很大。质量–半径斜率只在生长前 40% 拟合。普通侵入渗流的渐近团簇预期是分形的，但有限盒子与短拟合窗口使这个读数只是诊断量，不是精确测量。</p>`,
      try: `<div class="guide-try"><b>1.</b> 取 L = 48 生长。注意团簇有时会伸向远离种子的低阈值区域，再回到别处的高阈值边界。</div>
        <div class="guide-try"><b>2.</b> 开启被拒绝的环。许多边被弹出并丢弃；接受集合始终是一棵树。</div>
        <div class="guide-try"><b>3.</b> 换种子比较阈值序列。它们不同，但都随团簇增大而整体上移。</div>`,
      caveat: `<p>这是带环拒绝的普通侵入渗流。它没有实现多孔介质中“防御团簇”的 trapping 变体，也没有模拟压力依赖的黏度。质量–半径斜率受有限尺度限制。</p>`,
    },
    de: {
      read: `<p>Jede Zelle ist ein Platz; jede Kante trägt eine unabhängige uniforme Schwelle, farblich von Cyan (klein) bis Rot (groß). Vom markierten Startplatz aus kreuzt der Cluster stets die Kante mit der kleinsten Schwelle am Rand. Weiße Linien sind akzeptierte Spannbaumkanten; rote Linien sind verworfene Kanten, die einen Kreis schließen würden.</p>
        <p>Die Schwellenfolge ist nicht monoton: Nach dem Überfluten eines Platzes können neue Kanten billiger sein als die letzte akzeptierte. Das unterscheidet Invasion-Perkolation von Prim auf einem festen Graphen.</p>`,
      params: `<dl class="guide-key">
        <dt>L</dt><dd>Boxseite. In einer zusammenhängenden Box füllt die Invasion schließlich alles; interessant ist das frühe Wachstum.</dd>
        <dt>Seed</dt><dd>Steuert Schwellenfeld und Startplatz.</dd>
        <dt>Verworfene Kreise zeigen</dt><dd>Zeichnet Kanten, die zu bereits überfluteten Plätzen führen.</dd>
        <dt>Wachsen / Schritt</dt><dd>Animiert das Wachstum oder geht etwa 5% weiter.</dd>
      </dl>`,
      dynamics: `<p>Anfangs ist der Cluster kompakt und folgt einer Bahn kleiner Schwellen. Später müssen höhere Schwellen akzeptiert werden; die Folge steigt mit starken lokalen Schwankungen. Die Masse-Radius-Steigung wird über die ersten 40% gefittet. Für gewöhnliche Invasion-Perkolation wird ein fraktaler asymptotischer Cluster erwartet, aber endliche Box und kurzes Fit-Fenster machen den Wert zu einer Diagnose.</p>`,
      try: `<div class="guide-try"><b>1.</b> Mit L = 48 wachsen lassen. Der Cluster dehnt sich manchmal in eine kleine Schwellenregion weit vom Seed aus.</div>
        <div class="guide-try"><b>2.</b> Verworfene Kreise einschalten. Viele Kanten werden verworfen; die akzeptierte Menge bleibt ein Baum.</div>
        <div class="guide-try"><b>3.</b> Seed ändern und Schwellenfolgen vergleichen. Beide driften nach oben.</div>`,
      caveat: `<p>Dies ist gewöhnliche Invasion-Perkolation mit Kreisverwerfung, nicht die Trapping-Variante für verteidigende Cluster in porösen Medien. Die Masse-Radius-Steigung ist endlich begrenzt.</p>`,
    },
  },
  'algorithm-studio': {
    en: {
      read: `<p>The canvas replays a Newman–Ziff edge order on a small lattice. At step k the first k edges of one random permutation are open; the colour is the cluster size, and the amber edge is the one just added. The slider is the whole history of the sweep, exposed one edge at a time.</p>
        <p>The plot is a log–log measurement of wall-clock time against lattice size for one sampling pass. The table reports measured time and estimated work for five routines.</p>`,
      params: `<dl class="guide-key">
        <dt>L / p / seed</dt><dd>Fix the lattice, the occupancy and the disorder. The same seed drives the replay and the benchmark.</dd>
        <dt>Repeats</dt><dd>Each timing is the minimum of this many runs. Minimum is used because the maximum is dominated by scheduling noise.</dd>
        <dt>Step k</dt><dd>Move it to see the first k unions. The cluster count falls and S_max rises; the biggest jumps happen near p_c.</dd>
        <dt>Benchmark / Scaling sweep</dt><dd>Runs the five routines once, or fits the cost exponent for one sampling pass.</dd>
      </dl>`,
      dynamics: `<p>At small k almost every edge merges two singletons and the largest cluster stays small. Near k/m = p_c a single merge can join two large components, producing a visible jump in S_max. The step history is one sample of the whole curve; it is not an average over disorder.</p>
        <p>The fitted exponent is an empirical slope. If the algorithm is O(n) in the number of sites and n = L², the expected slope is 2; a measured slope near 2 supports the implementation, but does not prove it.</p>`,
      try: `<div class="guide-try"><b>1.</b> Put k just below and just above the p_c line. Identify the edge whose addition joins the two largest components.</div>
        <div class="guide-try"><b>2.</b> Benchmark at L = 16 and L = 32. The Newman–Ziff sweep is still one pass over the edges, so its time grows with m, not with a second loop over p.</div>
        <div class="guide-try"><b>3.</b> Run the scaling sweep. The fitted slope should sit near 2 for one sample; deviations are JIT warm-up, cache effects and timer resolution, not a different complexity class.</div>`,
      caveat: `<p>Wall-clock timings on one browser are noisy and not portable. The table is for orders of magnitude and for teaching the difference between “one sample” and “the whole curve”; use the C++ harness for measurements you intend to publish.</p>`,
    },
    zh: {
      read: `<p>画布在小格子上重放一条 Newman–Ziff 边序。第 k 步时，一条随机排列的前 k 条边是开的；颜色表示团簇大小，琥珀色是刚加入的边。滑块把整次扫描的历史逐边展开。</p>
        <p>图是一次采样过程的墙钟时间对格子尺寸的双对数测量。表格报告五种例程的实测时间与估计工作量。</p>`,
      params: `<dl class="guide-key">
        <dt>L / p / 种子</dt><dd>固定格子、占据率与无序。同一个种子驱动重放与基准测试。</dd>
        <dt>重复次数</dt><dd>每次计时取多次运行的最小值。用最小值是因为最大值被调度噪声主导。</dd>
        <dt>步 k</dt><dd>拖动它查看前 k 次合并。团簇数下降、S_max 上升；最大的跳变发生在 p_c 附近。</dd>
        <dt>基准 / 标度扫描</dt><dd>运行五个例程各一次，或拟合一次采样过程的代价指数。</dd>
      </dl>`,
      dynamics: `<p>k 很小时几乎每条边都合并两个单点，最大团簇保持很小。接近 k/m = p_c 时，一次合并可能连接两个大分量，S_max 出现可见跳变。这段步进历史是整条曲线的一个样本，不是对无序的平均。</p>
        <p>拟合指数是经验斜率。若算法对位点数 n = L² 是 O(n)，预期斜率是 2；实测接近 2 支持实现，但不构成证明。</p>`,
      try: `<div class="guide-try"><b>1.</b> 把 k 放在 p_c 线两侧，找出连接两个最大分量的那条边。</div>
        <div class="guide-try"><b>2.</b> 在 L = 16 与 32 做基准。Newman–Ziff 扫描仍是对边的一次遍历，所以时间随 m 增长，而不是再对 p 循环一遍。</div>
        <div class="guide-try"><b>3.</b> 运行标度扫描。一次采样的拟合斜率应接近 2；偏差来自 JIT 预热、缓存与计时分辨率，不是不同的复杂度类。</div>`,
      caveat: `<p>单个浏览器上的墙钟计时噪声大且不可移植。表格只用于量级与教学（“单样本”与“整条曲线”的区别）；要发表的测量请用 C++ 基准。</p>`,
    },
    de: {
      read: `<p>Die Leinwand spielt eine Newman–Ziff-Kantenordnung auf einem kleinen Gitter ab. Bei Schritt k sind die ersten k Kanten einer zufälligen Permutation offen; die Farbe ist die Clustergröße, die bernsteinfarbene Kante die zuletzt hinzugefügte. Der Regler legt die ganze Geschichte des Sweeps Kante für Kante offen.</p>
        <p>Der Plot misst Wanduhrzeit gegen Gittergröße für einen Sampling-Durchlauf doppelt-logarithmisch. Die Tabelle zeigt Zeit und geschätzte Arbeit für fünf Routinen.</p>`,
      params: `<dl class="guide-key">
        <dt>L / p / Seed</dt><dd>Fixieren Gitter, Besetzung und Unordnung. Derselbe Seed treibt Replay und Benchmark.</dd>
        <dt>Wiederholungen</dt><dd>Jede Zeit ist das Minimum über diese Zahl von Läufen; das Maximum wird von Scheduling-Rauschen dominiert.</dd>
        <dt>Schritt k</dt><dd>Zeigt die ersten k Union-Operationen. Clusterzahl fällt, S_max steigt; die größten Sprünge liegen nahe p_c.</dd>
        <dt>Benchmark / Skalensweep</dt><dd>Führt die fünf Routinen aus oder fittet den Kostexponenten eines Sampling-Durchlaufs.</dd>
      </dl>`,
      dynamics: `<p>Bei kleinem k verschmilzt fast jede Kante zwei Singletonen, der größte Cluster bleibt klein. Nahe k/m = p_c kann eine Union zwei große Komponenten verbinden und einen sichtbaren Sprung erzeugen. Die Schrittgeschichte ist eine Stichprobe der ganzen Kurve, kein Mittel über Unordnung.</p>
        <p>Der gefittete Exponent ist eine empirische Steigung. Ist der Algorithmus O(n) in den Plätzen und n = L², ist 2 zu erwarten; eine Messung nahe 2 stützt die Implementierung, beweist sie aber nicht.</p>`,
      try: `<div class="guide-try"><b>1.</b> k knapp unter und über der p_c-Linie setzen und die Kante finden, die die zwei größten Komponenten verbindet.</div>
        <div class="guide-try"><b>2.</b> Bei L = 16 und 32 benchmarken. Der NZ-Sweep bleibt ein Durchlauf über die Kanten.</div>
        <div class="guide-try"><b>3.</b> Skalensweep starten. Die Steigung sollte nahe 2 liegen; Abweichungen sind JIT, Cache und Timer-Auflösung.</div>`,
      caveat: `<p>Wanduhrzeiten in einem Browser sind verrauscht und nicht portabel. Die Tabelle dient der Größenordnung und der Unterscheidung „eine Stichprobe“ vs. „ganze Kurve“; für publikationsfähige Messungen den C++-Harness nutzen.</p>`,
    },
  },
};

export function guideHTML(id, lang) {
  const g = GUIDES[id] && (GUIDES[id][lang] || GUIDES[id].en);
  if (!g) return '';
  const c = GUIDE_CHROME[lang] || GUIDE_CHROME.en;
  const pane = (key, label, active = false) =>
    `<div class="guide-pane${active ? ' active' : ''}" data-pane="${key}">${g[key] || ''}</div>`;
  return `<details class="guide" data-guide="${id}">
    <summary>${c.summary}</summary>
    <div class="guide-body">
      <div class="guide-tabs" role="tablist">
        <button type="button" class="active" data-tab="read">${c.read}</button>
        <button type="button" data-tab="params">${c.params}</button>
        <button type="button" data-tab="dynamics">${c.dynamics}</button>
        <button type="button" data-tab="try">${c.try}</button>
        <button type="button" data-tab="caveat">${c.caveat}</button>
      </div>
      ${pane('read', c.read, true)}
      ${pane('params', c.params)}
      ${pane('dynamics', c.dynamics)}
      ${pane('try', c.try)}
      ${pane('caveat', c.caveat)}
    </div>
  </details>`;
}
