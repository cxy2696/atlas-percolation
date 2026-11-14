/** Authored algorithm guide. Each entry explains the idea, the invariant,
 *  the cost, the exact code path, and the mistakes that survive a quick read.
 *  The text is written by hand in the three editions; it is not generated. */

export const ALGORITHM_ORDER = ['sampler', 'dsu', 'nz', 'nz-site', 'leath', 'bootstrap', 'invasion', 'achlioptas', 'kcore', 'hoshen', 'bethe', 'sir', 'message'];

export const ALGORITHM_GROUPS = [
  { id: 'core', ids: ['sampler', 'dsu', 'nz', 'nz-site', 'leath'] },
  { id: 'dynamics', ids: ['bootstrap', 'invasion', 'achlioptas', 'kcore'] },
  { id: 'trees', ids: ['hoshen', 'bethe', 'sir', 'message'] },
];

export const ALGORITHM_GUIDE = {
  sampler: {
    tag: { en: 'Bernoulli sampling', zh: 'Bernoulli 抽样', de: 'Bernoulli-Sampling' },
    title: { en: 'One configuration, correctly', zh: '正确地抽一张构型', de: 'Eine Konfiguration, richtig gezogen' },
    purpose: {
      en: ['The sampler is the smallest routine and the one everything else is checked against. It walks the sites or the edges in a fixed order and draws one uniform number for each element. The code is short because the contract lives in the order, not in the arithmetic.'],
      zh: ['抽样器是最小的例程，也是其他一切的校验基准。它按固定顺序走过位点或边，为每个元素抽一个均匀数。代码很短，因为契约在顺序里，而不在算术里。'],
      de: ['Der Sampler ist die kleinste Routine und der Prüfstein für alles andere. Er läuft in fester Reihenfolge über Plätze oder Kanten und zieht für jedes Element eine Uniformzahl. Der Code ist kurz, weil der Vertrag in der Reihenfolge liegt, nicht in der Arithmetik.'],
    },
    steps: {
      en: ['Site mode: draw one uniform per site in index order; a site is occupied when the draw is below p.', 'Bond mode: draw one uniform per edge in build_lattice order; an edge is open when the draw is below p.', 'Union only open edges whose two endpoints are occupied. Closed elements are still drawn, so the stream position is predictable.', 'Compute cluster statistics in one pass over the roots.'],
      zh: ['位点模式：按索引顺序为每个位点抽一个均匀数；小于 p 则占据。', '键模式：按 build_lattice 的边序为每条边抽一个均匀数；小于 p 则开。', '只合并两端都被占据的开边。闭元素也消耗随机数，所以流位置可预测。', '对根做一遍扫描，计算团簇统计。'],
      de: ['Platzmodus: pro Platz in Indexordnung eine Uniformzahl; besetzt, wenn der Zug unter p liegt.', 'Kantenmodus: pro Kante in build_lattice-Reihenfolge eine Uniformzahl; offen, wenn der Zug unter p liegt.', 'Nur offene Kanten mit besetzten Endpunkten werden vereinigt. Geschlossene Elemente verbrauchen trotzdem Zufallszahlen, damit die Stream-Position vorhersagbar bleibt.', 'Clusterstatistik in einem Durchlauf über die Wurzeln.'],
    },
    invariant: {
      en: 'After the loop the occupancy and open-edge arrays are independent Bernoulli variables with parameter p, and the DSU contains exactly the connected components of the occupied/open subgraph.',
      zh: '循环结束后，占据数组与开边数组是参数为 p 的独立 Bernoulli 变量，并查集恰好包含占据/开子图的连通分量。',
      de: 'Nach der Schleife sind Besetzung und offene Kanten unabhängige Bernoulli-Variablen mit Parameter p, und die DSU enthält genau die Zusammenhangskomponenten des besetzten/offenen Teilgraphen.',
    },
    complexity: {
      en: [['site draw', 'O(n)'], ['bond draw', 'O(m)'], ['union pass', 'O(m α(n))'], ['memory', 'O(n + m)']],
      zh: [['位点抽样', 'O(n)'], ['键抽样', 'O(m)'], ['合并', 'O(m α(n))'], ['内存', 'O(n + m)']],
      de: [['Platzziehen', 'O(n)'], ['Kantenziehen', 'O(m)'], ['Vereinigung', 'O(m α(n))'], ['Speicher', 'O(n + m)']],
    },
    code: [
      { path: 'lib/js/engine/percolation.js', label: 'JavaScript sampler' },
      { path: 'lib/python/percolation_atlas/percolation.py', label: 'Python sampler' },
    ],
    notes: {
      en: [['sample(p, rng)', 'Draws the whole configuration; site and bond modes consume the stream in different orders, and that difference is part of the public contract.'], ['ensureBuilt()', 'Rebuilds the DSU lazily. The dirty flag prevents a second union pass when several observables are read.'], ['crossesLR()', 'A boundary test on the built components; it does not resample.']],
      zh: [['sample(p, rng)', '抽取整张构型；位点与键模式以不同顺序消费随机流，这个差别属于公开契约。'], ['ensureBuilt()', '惰性重建并查集。dirty 标志避免多个观测量读取时重复合并。'], ['crossesLR()', '在已构建分量上做边界判定；不会重新抽样。']],
      de: [['sample(p, rng)', 'Zieht die ganze Konfiguration; Platz- und Kantenmodus verbrauchen den Strom in verschiedener Reihenfolge — das gehört zum öffentlichen Vertrag.'], ['ensureBuilt()', 'Baut die DSU lazy neu. Das dirty-Flag verhindert einen zweiten Vereinigungsdurchlauf.'], ['crossesLR()', 'Randtest auf den gebauten Komponenten; es wird nicht neu gezogen.']],
    },
    pitfalls: {
      en: ['Mixing site and bond conventions produces a plausible picture with the wrong threshold.', 'Skipping draws for closed elements changes every later number for the same seed.', 'Using the number of occupied sites as the denominator for a bond observable is a different quantity.'],
      zh: ['混用位点与键约定会得到一张看似合理但阈值错误的图。', '为闭元素跳过抽样，会让同一种子之后的每个数都改变。', '用占据位点数作键观测量的分母，是另一个量。'],
      de: ['Das Vermischen von Platz- und Kantenkonventionen erzeugt ein plausibles Bild mit falscher Schwelle.', 'Züge für geschlossene Elemente zu überspringen verändert jede spätere Zahl bei gleichem Seed.', 'Die Zahl besetzter Plätze als Nenner einer Kantenobservablen zu nehmen, ist eine andere Größe.'],
    },
    tests: ['tests/js/engine.test.js', 'lib/python/tests/test_engine.py', 'data/golden/rng-seed42.json'],
  },

  dsu: {
    tag: { en: 'Data structure', zh: '数据结构', de: 'Datenstruktur' },
    title: { en: 'Union–find without magic', zh: '没有魔法的并查集', de: 'Union-Find ohne Magie' },
    purpose: {
      en: ['Every cluster algorithm in the atlas keeps a partition of the sites under edge insertions. Union–find answers “which component contains this site?” and “how large is it?” in amortised constant time. The two optimisations are not optional decoration: together they give the inverse-Ackermann bound.'],
      zh: ['图册里的每个团簇算法都在边插入下维护位点的划分。并查集回答“这个位点属于哪个分量？”和“它有多大？”，摊还时间接近常数。两个优化不是装饰：它们合起来才给出反 Ackermann 界。'],
      de: ['Jeder Clusteralgorithmus im Atlas pflegt eine Partition der Plätze unter Kanteneinfügungen. Union-Find beantwortet „Welche Komponente enthält diesen Platz?“ und „Wie groß ist sie?“ in amortisiert konstanter Zeit. Die beiden Optimierungen sind keine Dekoration: zusammen ergeben sie die Inverse-Ackermann-Schranke.'],
    },
    steps: {
      en: ['Each site starts as a root with size one.', 'find(x) walks parent pointers to the root, then compresses the path by halving.', 'union(a, b) links the smaller root under the larger and adds the sizes.', 'count and maxSize are updated inside union, because every observable needs them.'],
      zh: ['每个位点初始为根，大小为 1。', 'find(x) 沿父指针走到根，再用路径折半压缩。', 'union(a, b) 把小根挂到大根下并累加大小。', 'count 与 maxSize 在 union 内更新，因为每个观测量都要用。'],
      de: ['Jeder Platz startet als Wurzel der Größe eins.', 'find(x) läuft über Elternzeiger zur Wurzel und halbiert dann den Pfad.', 'union(a, b) hängt die kleinere Wurzel unter die größere und addiert die Größen.', 'count und maxSize werden in union gepflegt, weil jede Observable sie braucht.'],
    },
    invariant: {
      en: 'parent[] is a forest; find(x) returns its unique root; size[root] is the number of elements in that tree; every non-root has a parent. Depth is O(log n) because a root is only attached to a root at least as large, and path halving gives the amortised α(n) bound.',
      zh: 'parent[] 是一片森林；find(x) 返回唯一根；size[root] 是该树的元素数；每个非根都有父节点。深度为 O(log n)，因为根只挂到不小于它的根下；路径折半给出摊还 α(n) 界。',
      de: 'parent[] ist ein Wald; find(x) liefert die eindeutige Wurzel; size[root] ist die Elementzahl des Baums; jeder Nicht-Wurzelknoten hat einen Elternzeiger. Die Tiefe ist O(log n), weil eine Wurzel nur an eine mindestens gleich große Wurzel gehängt wird; Path Halving ergibt die amortisierte α(n)-Schranke.',
    },
    complexity: {
      en: [['find', 'O(α(n)) amortised'], ['union', 'O(α(n)) amortised'], ['memory', 'O(n)'], ['m operations', 'O(m α(n))']],
      zh: [['find', '摊还 O(α(n))'], ['union', '摊还 O(α(n))'], ['内存', 'O(n)'], ['m 次操作', 'O(m α(n))']],
      de: [['find', 'amortisiert O(α(n))'], ['union', 'amortisiert O(α(n))'], ['Speicher', 'O(n)'], ['m Operationen', 'O(m α(n))']],
    },
    code: [
      { path: 'lib/js/engine/dsu.js', label: 'JavaScript DSU' },
      { path: 'lib/python/percolation_atlas/percolation.py', label: 'Python DSU' },
    ],
    notes: {
      en: [['find(x)', 'The first while loop finds the root. The second rewrites pointers to the root; path halving is the cheaper variant used here.'], ['union(a, b)', 'Returns false when a and b are already connected, which is what lets Newman–Ziff skip the second moment update.'], ['roots()', 'Diagnostic only; calling it in a hot loop defeats the amortised bound.']],
      zh: [['find(x)', '第一个 while 找根；第二个把指针改写到根；这里用的是更便宜的路径折半。'], ['union(a, b)', '若 a、b 已连通则返回 false，Newman–Ziff 据此跳过二阶矩更新。'], ['roots()', '只用于诊断；在热循环里调用会破坏摊还界。']],
      de: [['find(x)', 'Die erste while-Schleife findet die Wurzel; die zweite schreibt Zeiger auf die Wurzel um; hier wird das billigere Path Halving genutzt.'], ['union(a, b)', 'Liefert false, wenn a und b schon verbunden sind; Newman–Ziff überspringt dann das Zweitmoment-Update.'], ['roots()', 'Nur zur Diagnose; in einer heißen Schleife zerstört es die amortisierte Schranke.']],
    },
    pitfalls: {
      en: ['Path compression without union by size gives only an O(log n) amortised bound, not α(n).', 'Using a label from Hoshen–Kopelman as a root after the scan is wrong until the label table is compressed.', 'Storing component sizes in a list that is not updated on every union gives silent wrong maxima.'],
      zh: ['只用路径压缩、不做按大小合并，只能得到 O(log n) 摊还界，而不是 α(n)。', '扫描后把 Hoshen–Kopelman 的标号直接当根是错的，必须先压缩标号表。', '若分量大小列表未在每次合并时更新，最大值会悄悄出错。'],
      de: ['Path Compression ohne Union by Size ergibt nur O(log n) amortisiert, nicht α(n).', 'Ein Hoshen–Kopelman-Label nach dem Scan als Wurzel zu behandeln ist falsch, bis die Label-Tabelle komprimiert ist.', 'Komponentengrößen in einer Liste zu führen, die nicht bei jeder Union aktualisiert wird, erzeugt stille falsche Maxima.'],
    },
    tests: ['tests/js/engine.test.js', 'lib/python/tests/test_engine.py', 'lib/cpp/tests/test_main.cpp'],
  },

  nz: {
    tag: { en: 'Sweep', zh: '扫描', de: 'Sweep' },
    title: { en: 'Newman–Ziff: one order, all p', zh: 'Newman–Ziff：一条边序，全部 p', de: 'Newman–Ziff: eine Ordnung, alle p' },
    purpose: {
      en: ['A naive study loops over p and draws a fresh configuration at every point. Newman–Ziff removes the outer loop: draw one random permutation of the edges, add them one at a time, and record the observables after each merge. The samples at different p are nested, so the whole curve comes from one object.'],
      zh: ['朴素研究会对 p 循环，并在每个点重抽构型。Newman–Ziff 去掉外层循环：抽一条随机边排列，逐条加入，并在每次合并后记录观测量。不同 p 的样本是嵌套的，所以整条曲线来自同一个对象。'],
      de: ['Eine naive Studie läuft über p und zieht an jedem Punkt eine neue Konfiguration. Newman–Ziff entfernt die äußere Schleife: eine zufällige Permutation der Kanten ziehen, einzeln hinzufügen und nach jeder Verschmelzung die Observablen notieren. Die Stichproben bei verschiedenen p sind verschachtelt.'],
    },
    steps: {
      en: ['Shuffle the m edge indices once with the shared RNG.', 'Walk the order; union the endpoints of the current edge.', 'Update M₂ by +2ab when components of sizes a and b merge.', 'At checkpoints record p = (k+1)/m, S_max, M₂/n and the cluster count.'],
      zh: ['用共享 RNG 洗牌一次 m 条边的索引。', '沿边序前进，合并当前边的两端。', '当大小为 a、b 的分量合并时，M₂ 增加 2ab。', '在检查点记录 p = (k+1)/m、S_max、M₂/n 与团簇数。'],
      de: ['Die m Kantenindizes einmal mit dem gemeinsamen RNG mischen.', 'Die Ordnung ablaufen und die Endpunkte der aktuellen Kante vereinigen.', 'M₂ um +2ab erhöhen, wenn Komponenten der Größen a und b verschmelzen.', 'An Checkpoints p = (k+1)/m, S_max, M₂/n und Clusterzahl notieren.'],
    },
    invariant: {
      en: 'After k edges, the open set is a uniform k-subset of the edges, hence a sample of bond percolation at p = k/m. M₂ is exactly Σ|C|² for that configuration, not an estimator of something else. Consecutive points are correlated by construction; that is the trade for the speed.',
      zh: '加入 k 条边后，开集是边的均匀 k-子集，因此是 p = k/m 处键渗流的样本。M₂ 恰好是该构型的 Σ|C|²，不是别的量的估计。相邻点按构造相关；这是速度的代价。',
      de: 'Nach k Kanten ist die offene Menge ein uniformes k-Tupel der Kanten, also eine Stichprobe der Bondperkolation bei p = k/m. M₂ ist exakt Σ|C|² für diese Konfiguration. Aufeinanderfolgende Punkte sind konstruktionsbedingt korreliert; das ist der Preis für die Geschwindigkeit.',
    },
    complexity: {
      en: [['one sweep', 'O(m α(n))'], ['memory', 'O(n + m)'], ['independent error bars', 'requires independent edge orders']],
      zh: [['一次扫描', 'O(m α(n))'], ['内存', 'O(n + m)'], ['独立误差棒', '需要独立边序']],
      de: [['ein Sweep', 'O(m α(n))'], ['Speicher', 'O(n + m)'], ['unabhängige Fehlerbalken', 'brauchen unabhängige Kantenordnungen']],
    },
    code: [
      { path: 'lib/js/engine/percolation.js', label: 'JavaScript newmanZiff' },
      { path: 'lib/python/percolation_atlas/percolation.py', label: 'Python newman_ziff' },
    ],
    notes: {
      en: [['rng.shuffle(order)', 'The only random step. The edge order is the whole experiment; a different order is a different sample.'], ['total2 += 2 * sa * sb', 'The second moment update. It is a statement about merging two components, not a fit parameter.'], ['every', 'Checkpoints are evenly spaced in edge count; the returned p grid is therefore k/m, not a hand-picked list.']],
      zh: [['rng.shuffle(order)', '唯一的随机步骤。边序就是整个实验；不同边序是不同样本。'], ['total2 += 2 * sa * sb', '二阶矩更新。它是关于两个分量合并的陈述，不是拟合参数。'], ['every', '检查点按边数均匀分布；返回的 p 网格因此是 k/m，不是手挑的列表。']],
      de: [['rng.shuffle(order)', 'Der einzige Zufallsschritt. Die Kantenordnung ist das ganze Experiment.'], ['total2 += 2 * sa * sb', 'Das Zweitmoment-Update. Es beschreibt das Verschmelzen zweier Komponenten, ist kein Fit-Parameter.'], ['every', 'Checkpoints sind gleichmäßig im Kantenzähler; das p-Gitter ist daher k/m.']],
    },
    pitfalls: {
      en: ['Treating the points along one sweep as independent underestimates the variance.', 'Recording S_max before the union misses the jump caused by the current edge.', 'Reporting χ without the infinite-cluster convention changes the meaning at p > p_c.'],
      zh: ['把一次扫描上的点当作独立样本会低估方差。', '在合并前记录 S_max 会漏掉当前边造成的跳变。', '不说明无限团簇约定就报告 χ，会改变 p > p_c 处的含义。'],
      de: ['Die Punkte eines Sweeps als unabhängig zu behandeln unterschätzt die Varianz.', 'S_max vor der Union zu notieren verpasst den Sprung der aktuellen Kante.', 'χ ohne die Konvention für den unendlichen Cluster zu berichten ändert die Bedeutung für p > p_c.'],
    },
    tests: ['tests/js/engine.test.js', 'data/golden/parity.json', 'data/golden/rng-seed42.json'],
  },

  leath: {
    tag: { en: 'Single cluster', zh: '单团簇', de: 'Einzelcluster' },
    title: { en: 'Leath growth: sample one cluster', zh: 'Leath 生长：只抽一个团簇', de: 'Leath-Wachstum: einen Cluster ziehen' },
    purpose: {
      en: ['When the question is about one cluster rather than the whole lattice, Leath growth is the right tool. Start at a seed, test each edge incident to a visited site once, and explore every open edge to an unvisited neighbour. The cost is proportional to the cluster and its boundary, not to the box.'],
      zh: ['当问题关于一个团簇而不是整张格子时，Leath 生长是正确工具。从种子出发，对与已访问位点相邻的每条边测试一次，探索通向未访问邻居的开边。代价与团簇及其边界成正比，而不是与盒子体积成正比。'],
      de: ['Wenn die Frage einen Cluster betrifft, nicht das ganze Gitter, ist Leath-Wachstum das richtige Werkzeug. Vom Seed aus jede Kante an einem besuchten Platz einmal testen und jeder offenen Kante zu einem unbesuchten Nachbarn folgen. Die Kosten skalieren mit Cluster und Rand, nicht mit der Box.'],
    },
    steps: {
      en: ['Mark the seed visited and queue it.', 'Pop a site; for each incident edge not yet tested, draw one uniform.', 'If the edge is open, mark the neighbour visited and enqueue it; otherwise count it as perimeter.', 'Stop when the queue is empty or the optional size cutoff is reached.'],
      zh: ['标记种子已访问并入队。', '弹出一个位点；对每条尚未测试的相邻边抽一个均匀数。', '若边开，标记邻居已访问并入队；否则计入边界。', '队列为空或达到可选尺寸截断时停止。'],
      de: ['Seed als besucht markieren und einreihen.', 'Einen Platz entnehmen; für jede noch ungetestete Kante eine Uniformzahl ziehen.', 'Ist die Kante offen, den Nachbarn als besucht markieren und einreihen; sonst als Rand zählen.', 'Stoppen, wenn die Queue leer ist oder der optionale Größenabschneider greift.'],
    },
    invariant: {
      en: 'Conditional on the seed being occupied, the visited set is exactly the cluster of the seed: every open edge out of the visited set is followed and every closed one is counted. Each edge is tested once, so no edge is double-counted.',
      zh: '在种子被占据的条件下，访问集合恰为种子的团簇：每条从访问集出去的开边都被跟随，每条闭边都被计入。每条边只测试一次，不会重复计数。',
      de: 'Bedingt darauf, dass der Seed besetzt ist, ist die besuchte Menge genau sein Cluster: Jede offene Kante aus der Menge wird verfolgt, jede geschlossene gezählt. Jede Kante wird einmal getestet.',
    },
    complexity: {
      en: [['time', 'O(|C| + boundary)'], ['memory', 'O(n + m)'], ['cutoff bias', 'tail is truncated']],
      zh: [['时间', 'O(|C| + 边界)'], ['内存', 'O(n + m)'], ['截断偏差', '尾部被截掉']],
      de: [['Zeit', 'O(|C| + Rand)'], ['Speicher', 'O(n + m)'], ['Abschneide-Bias', 'Tail wird gekappt']],
    },
    code: [
      { path: 'lib/js/engine/algorithms.js', label: 'JavaScript leathCluster' },
      { path: 'lib/python/percolation_atlas/algorithms.py', label: 'Python leath_cluster' },
    ],
    notes: {
      en: [['tested[e]', 'The edge-level guard is what prevents a boundary edge from being counted twice when both endpoints are visited.'], ['rng.random() < p', 'One draw per newly touched edge; the order of edge discovery is the BFS order, not the lattice order.'], ['maxSize', 'The cutoff is a bias, not a neutral optimisation; report it if you use it.']],
      zh: [['tested[e]', '边级守卫防止一条边界边在两端都被访问时被计两次。'], ['rng.random() < p', '每条新触及的边抽一次；发现顺序是 BFS 顺序，不是格子顺序。'], ['maxSize', '截断是偏差而不是中性优化；若使用就要报告。']],
      de: [['tested[e]', 'Der Kanten-Guard verhindert doppelte Zählung, wenn beide Endpunkte besucht sind.'], ['rng.random() < p', 'Ein Zug pro neu berührter Kante; die Reihenfolge ist BFS, nicht Gitterordnung.'], ['maxSize', 'Der Abschneider ist ein Bias, keine neutrale Optimierung; berichten, wenn genutzt.']],
    },
    pitfalls: {
      en: ['A cutoff creates a truncated cluster-size distribution; the tail is missing by construction.', 'On a torus the cluster can wrap and touch most of the box, so the cost advantage disappears.', 'Conditioning on the seed being occupied is part of the statement; an unconditioned run is a different experiment.'],
      zh: ['截断会产生被截断的团簇尺寸分布；尾部按构造缺失。', '环面上团簇可能绕回并触及盒子的绝大部分，代价优势消失。', '以种子被占据为条件是陈述的一部分；不设条件的运行是另一个实验。'],
      de: ['Ein Abschneider erzeugt eine gekappte Clustergrößenverteilung; der Tail fehlt konstruktionsbedingt.', 'Auf einem Torus kann der Cluster die Box umlaufen; der Kostenvorteil verschwindet.', 'Die Bedingung „Seed besetzt“ gehört zur Aussage; ein unbedingter Lauf ist ein anderes Experiment.'],
    },
    tests: ['tests/js/algorithms.test.js', 'lib/python/tests/test_algorithms.py', 'data/golden/algorithms-v3.json'],
  },

  bootstrap: {
    tag: { en: 'Closure', zh: '闭包', de: 'Abschluss' },
    title: { en: 'Bootstrap: iterate until nothing moves', zh: '自举：迭代到不再变化', de: 'Bootstrap: iterieren, bis nichts mehr geht' },
    purpose: {
      en: ['Bootstrap percolation starts from an occupied set and applies a threshold rule until the set stops changing. It is a closure, not a random growth process: the final set is the least fixed point and does not depend on the order in which sites are considered. The queue algorithm computes that fixed point in one linear pass.'],
      zh: ['自举渗流从一个占据集合出发，反复施加阈值规则直到集合不再变化。它是闭包，不是随机生长过程：最终集合是最小不动点，与考虑位点的顺序无关。队列算法用一趟线性扫描算出这个不动点。'],
      de: ['Bootstrap-Perkolation startet von einer besetzten Menge und wendet eine Schwellenregel an, bis sich nichts mehr ändert. Es ist ein Abschluss, kein zufälliges Wachstum: die Endmenge ist der kleinste Fixpunkt und unabhängig von der Reihenfolge. Die Queue berechnet ihn in einem linearen Durchlauf.'],
    },
    steps: {
      en: ['Mark initially occupied sites active at round 0.', 'Count active neighbours for every inactive site.', 'Queue every inactive site that already meets the threshold; activate those sites at round 1.', 'For each newly active site, increment the counts of its inactive neighbours; when a count reaches r, schedule that neighbour for the next round.'],
      zh: ['把初始占据位点标记为第 0 轮活跃。', '为每个非活跃位点统计活跃邻居数。', '把已经达到阈值的非活跃位点入队；它们在 1 轮激活。', '对每个新激活位点，增加其非活跃邻居的计数；计数达到 r 时把邻居排入下一轮。'],
      de: ['Anfangs besetzte Plätze als aktiv in Runde 0 markieren.', 'Für jeden inaktiven Platz aktive Nachbarn zählen.', 'Jeden inaktiven Platz, der die Schwelle schon erfüllt, einreihen; Aktivierung in Runde 1.', 'Für jeden neu aktiven Platz die Zähler inaktiver Nachbarn erhöhen; bei r den Nachbarn für die nächste Runde vormerken.'],
    },
    invariant: {
      en: 'At the end of round t the active set is exactly F^t(S₀), the t-fold application of the monotone threshold operator. Because F is monotone and the lattice is finite, iteration reaches the least fixed point; the synchronisation prevents a site from being activated by a neighbour activated in the same round.',
      zh: '第 t 轮结束时，活跃集合恰为 F^t(S₀)，即单调阈值算子的 t 次施加。由于 F 单调且格子有限，迭代到达最小不动点；同步化防止位点被同一轮激活的邻居提前激活。',
      de: 'Am Ende von Runde t ist die aktive Menge genau F^t(S₀), die t-fache Anwendung des monotonen Schwellenoperators. Weil F monoton und das Gitter endlich ist, erreicht die Iteration den kleinsten Fixpunkt; die Synchronisation verhindert Aktivierung durch einen Nachbarn derselben Runde.',
    },
    complexity: {
      en: [['time', 'O(n + m)'], ['memory', 'O(n + m)'], ['rounds', 'at most n']],
      zh: [['时间', 'O(n + m)'], ['内存', 'O(n + m)'], ['轮数', '至多 n']],
      de: [['Zeit', 'O(n + m)'], ['Speicher', 'O(n + m)'], ['Runden', 'höchstens n']],
    },
    code: [
      { path: 'lib/js/engine/algorithms.js', label: 'JavaScript bootstrapActivation' },
      { path: 'lib/python/percolation_atlas/algorithms.py', label: 'Python bootstrap_activation' },
    ],
    notes: {
      en: [['count[u] === r', 'The equality matters: a site is queued once, when its count first reaches the threshold. Incrementing past r must not enqueue it again.'], ['pending / next', 'Two buffers implement the synchronous round. Reusing one buffer would let a site be activated by a neighbour from the same round.'], ['rounds', 'The round list is a diagnostic; the final active set is the mathematical output.']],
      zh: [['count[u] === r', '等号很关键：位点只在计数首次达到阈值时入队。超过 r 的递增不能再次入队。'], ['pending / next', '两个缓冲区实现同步轮次。复用一个缓冲区会让位点被同一轮邻居提前激活。'], ['rounds', '轮次列表是诊断；最终活跃集合才是数学输出。']],
      de: [['count[u] === r', 'Die Gleichheit ist wichtig: Ein Platz wird einmal eingereiht, wenn sein Zähler die Schwelle erstmals erreicht.'], ['pending / next', 'Zwei Puffer implementieren die synchrone Runde. Ein Puffer würde Aktivierung durch Nachbarn derselben Runde erlauben.'], ['rounds', 'Die Rundenliste ist Diagnose; die aktive Endmenge ist die mathematische Ausgabe.']],
    },
    pitfalls: {
      en: ['For r = 2 on the square lattice the infinite-lattice threshold is zero; a finite box still fills only above an L-dependent crossover.', 'Using the maximum degree as r makes the rule unsatisfiable and the closure empty beyond the initial set.', 'An asynchronous update can activate a site in the same round as its neighbour, which is a different model.'],
      zh: ['方格上 r = 2 的无限格阈值为零；有限盒子仍只在依赖 L 的交叉点以上充满。', '把最大度当作 r 会让规则不可满足，闭包只剩初始集合。', '异步更新会在同一轮用邻居激活位点，那是另一个模型。'],
      de: ['Für r = 2 auf dem Quadratgitter ist die Schwelle des unendlichen Gitters null; eine endliche Box füllt sich erst oberhalb eines L-abhängigen Crossovers.', 'Den Maximalgrad als r zu nehmen macht die Regel unerfüllbar.', 'Ein asynchrones Update aktiviert einen Platz in derselben Runde wie seinen Nachbarn — ein anderes Modell.'],
    },
    tests: ['tests/js/algorithms.test.js', 'lib/python/tests/test_algorithms.py', 'data/golden/algorithms-v3.json'],
  },

  invasion: {
    tag: { en: 'Greedy growth', zh: '贪心生长', de: 'Gieriges Wachstum' },
    title: { en: 'Invasion: follow the cheapest boundary', zh: '侵入：沿最便宜的边界走', de: 'Invasion: dem billigsten Rand folgen' },
    purpose: {
      en: ['Invasion percolation assigns an i.i.d. threshold to every edge and grows a cluster from a seed by always accepting the lowest-threshold boundary edge that reaches an unvisited site. The path is selected, not sampled. This is the right model when a displacement is controlled by a capillary pressure threshold rather than by random occupation.'],
      zh: ['侵入渗流给每条边独立同分布阈值，从种子出发，总是接受边界上阈值最小、通向未访问位点的边。路径是被选择的，不是被抽样的。当驱替由毛细压力阈值而非随机占据控制时，这是正确模型。'],
      de: ['Invasion-Perkolation gibt jeder Kante eine i.i.d. Schwelle und wächst vom Seed, indem stets die Randkante mit der kleinsten Schwelle zu einem unbesuchten Platz akzeptiert wird. Der Pfad wird ausgewählt, nicht gezogen. Das ist das richtige Modell, wenn eine Verdrängung durch eine Kapillardruckschwelle gesteuert wird.'],
    },
    steps: {
      en: ['Mark the seed visited; push all incident edges into a min-heap.', 'Pop the lowest-threshold edge. If its other endpoint is already visited, record a rejected loop edge and continue.', 'Otherwise accept the edge, mark the new site visited, and push its incident edges.', 'Continue until the heap is empty; the accepted edges form a tree.'],
      zh: ['标记种子已访问；把相邻边压入最小堆。', '弹出阈值最小的边。若另一端已访问，记录一条被拒绝的环边并继续。', '否则接受该边，标记新位点已访问，并压入其相邻边。', '继续直到堆空；接受的边构成一棵树。'],
      de: ['Seed als besucht markieren; alle anliegenden Kanten in einen Min-Heap legen.', 'Die Kante mit kleinster Schwelle entnehmen. Ist der andere Endpunkt schon besucht, als verworfenen Kreis notieren und weiter.', 'Sonst die Kante akzeptieren, den neuen Platz als besucht markieren und seine Kanten einfügen.', 'Bis der Heap leer ist; die akzeptierten Kanten bilden einen Baum.'],
    },
    invariant: {
      en: 'The accepted edges form a spanning tree of the invaded region: an edge is accepted only when it joins a visited to an unvisited site, so no cycle is created and every accepted site except the seed is reached by exactly one accepted edge. The min-heap implements the greedy selection exactly.',
      zh: '接受的边构成侵入区域的生成树：只有连接已访问与未访问位点的边才被接受，所以不产生环；除种子外，每个接受位点恰由一条接受边到达。最小堆精确实现贪心选择。',
      de: 'Die akzeptierten Kanten bilden einen Spannbaum des überfluteten Gebiets: Eine Kante wird nur akzeptiert, wenn sie einen besuchten mit einem unbesuchten Platz verbindet; es entsteht kein Kreis, und jeder akzeptierte Platz außer dem Seed wird über genau eine Kante erreicht.',
    },
    complexity: {
      en: [['time', 'O(m log m) worst case'], ['heap', 'O(m)'], ['memory', 'O(n + m)']],
      zh: [['时间', '最坏 O(m log m)'], ['堆', 'O(m)'], ['内存', 'O(n + m)']],
      de: [['Zeit', 'O(m log m) im Worst Case'], ['Heap', 'O(m)'], ['Speicher', 'O(n + m)']],
    },
    code: [
      { path: 'lib/js/engine/algorithms.js', label: 'JavaScript invasionCluster' },
      { path: 'lib/python/percolation_atlas/algorithms.py', label: 'Python invasion_cluster' },
    ],
    notes: {
      en: [['MinHeap', 'A tiny binary heap keyed by the threshold. Ties are resolved by heap order; the accepted tree can differ while the threshold sequence stays valid.'], ['loopSeen', 'Each rejected edge is counted once. Without this guard, an edge with both endpoints visited is pushed twice and the loop count roughly doubles.'], ['accepted', 'The tree mask is the output that matters; the order array is for the animation.']],
      zh: [['MinHeap', '一个按阈值排序的小型二叉堆。平局由堆序决定；接受的树可能不同，但阈值序列仍合法。'], ['loopSeen', '每条被拒绝的边只计一次。没有这个守卫，两端都已访问的边会被压入两次，环计数几乎翻倍。'], ['accepted', '树掩码才是重要输出；order 数组用于动画。']],
      de: [['MinHeap', 'Ein kleiner Binärheap, sortiert nach Schwelle. Gleichstände entscheidet die Heap-Ordnung; der Baum kann variieren, die Schwellenfolge bleibt gültig.'], ['loopSeen', 'Jede verworfene Kante wird einmal gezählt. Ohne Guard wird eine Kante mit zwei besuchten Endpunkten zweimal eingefügt und der Kreiszähler verdoppelt sich fast.'], ['accepted', 'Die Baummaske ist die eigentliche Ausgabe; order dient der Animation.']],
    },
    pitfalls: {
      en: ['This is ordinary invasion percolation with loop rejection, not the trapping variant used for defending clusters.', 'The accepted threshold sequence is not monotone: newly exposed edges can be cheaper than the last accepted one.', 'On a connected finite box the invasion eventually fills every site; the interesting structure is in the early growth.'],
      zh: ['这是带环拒绝的普通侵入渗流，不是用于防御团簇的 trapping 变体。', '接受的阈值序列不是单调的：新暴露的边可能比上一条接受的边更便宜。', '在连通有限盒子里，侵入最终会填满所有位点；有意思的结构在早期生长。'],
      de: ['Dies ist gewöhnliche Invasion-Perkolation mit Kreisverwerfung, nicht die Trapping-Variante für verteidigende Cluster.', 'Die akzeptierte Schwellenfolge ist nicht monoton: neu exponierte Kanten können billiger sein.', 'In einer zusammenhängenden endlichen Box füllt die Invasion schließlich alles; interessant ist das frühe Wachstum.'],
    },
    tests: ['tests/js/algorithms.test.js', 'lib/python/tests/test_algorithms.py', 'data/golden/algorithms-v3.json'],
  },

  achlioptas: {
    tag: { en: 'Two choices', zh: '两个选择', de: 'Zwei Möglichkeiten' },
    title: { en: 'Achlioptas: choose the edge that suppresses growth', zh: 'Achlioptas：选择抑制生长的边', de: 'Achlioptas: die Kante wählen, die Wachstum bremst' },
    purpose: {
      en: ['At each step the process draws two candidate edges and keeps the one preferred by the product (or sum) rule. Small components are merged preferentially, so the cluster-size distribution stays narrow and the giant component appears later and more sharply. The finite-size jump is real; the thermodynamic discontinuity is not.'],
      zh: ['每一步抽两条候选边，保留乘积（或求和）规则偏好的那条。小分量被优先合并，尺寸分布保持狭窄，巨分量出现得更晚、更陡。有限尺度跳变是真的；热力学不连续不是。'],
      de: ['In jedem Schritt werden zwei Kandidatenkanten gezogen und die von der Produkt- (oder Summen-) Regel bevorzugte behalten. Kleine Komponenten werden bevorzugt verschmolzen; die Größenverteilung bleibt schmal, die Riesenkomponente erscheint später und schärfer. Der Endlichkeitssprung ist real, die thermodynamische Unstetigkeit nicht.'],
    },
    steps: {
      en: ['Sample two candidate edges (or two pairs on the complete graph).', 'Score each candidate by the product or sum of its endpoint component sizes.', 'Union the chosen edge, discard the other candidate, and update S_max and M₂.', 'Record the trajectory and the largest one-step jump.'],
      zh: ['抽两条候选边（完全图上抽两个点对）。', '用两端分量大小的乘积或和给每个候选打分。', '合并选中的边，丢弃另一个候选，更新 S_max 与 M₂。', '记录轨迹与最大单步跳变。'],
      de: ['Zwei Kandidatenkanten ziehen (oder zwei Paare auf dem vollständigen Graphen).', 'Jeden Kandidaten mit Produkt oder Summe der Endkomponenten bewerten.', 'Die gewählte Kante vereinigen, den anderen Kandidaten verwerfen, S_max und M₂ aktualisieren.', 'Trajektorie und größten Ein-Schritt-Sprung notieren.'],
    },
    invariant: {
      en: 'The DSU state is the component partition of the graph formed by the edges chosen so far. The trajectory is a deterministic function of the candidate sequence (and the seed that generates it). The rule never inspects a vertex that is not an endpoint of a candidate.',
      zh: '并查集状态是“目前所选边构成的图”的分量划分。轨迹是候选序列（及其生成种子）的确定性函数。规则从不检查不是候选端点的顶点。',
      de: 'Der DSU-Zustand ist die Komponentenpartition des Graphen aus den bisher gewählten Kanten. Die Trajektorie ist eine deterministische Funktion der Kandidatenfolge und des Seeds. Die Regel betrachtet keinen Knoten, der nicht Endpunkt eines Kandidaten ist.',
    },
    complexity: {
      en: [['per step', 'O(α(n))'], ['n steps', 'O(n α(n))'], ['memory', 'O(n)']],
      zh: [['每步', 'O(α(n))'], ['n 步', 'O(n α(n))'], ['内存', 'O(n)']],
      de: [['pro Schritt', 'O(α(n))'], ['n Schritte', 'O(n α(n))'], ['Speicher', 'O(n)']],
    },
    code: [
      { path: 'lib/js/engine/algorithms.js', label: 'JavaScript explosiveRandomGraph' },
      { path: 'lib/python/percolation_atlas/algorithms.py', label: 'Python explosive_random_graph' },
    ],
    notes: {
      en: [['product rule', 'Score = size(root u) × size(root v). The smaller score wins; ties go to the first candidate, which is part of the reproducibility contract.'], ['sum rule', 'A weaker suppressor; useful as a control in the laboratory.'], ['q = step / n', 'The horizontal axis counts candidate steps per vertex. Duplicate pairs count as additions but do not merge components.']],
      zh: [['乘积规则', '分数 = size(root u) × size(root v)。分数小者胜；平局取第一个候选，这属于可复现契约。'], ['求和规则', '较弱的抑制器；在实验室中用作对照。'], ['q = step / n', '横轴是人均候选步数。重复点对计为一次加边，但不合并分量。']],
      de: [['Produktregel', 'Score = size(root u) × size(root v). Der kleinere Score gewinnt; Gleichstand geht an den ersten Kandidaten — Teil des Reproduzierbarkeitsvertrags.'], ['Summenregel', 'Ein schwächerer Unterdrücker; im Labor als Kontrolle nützlich.'], ['q = step / n', 'Die x-Achse zählt Kandidatenschritte pro Knoten. Doppelte Paare zählen als Zugabe, verschmelzen aber nichts.']],
    },
    pitfalls: {
      en: ['Calling the finite-size jump a thermodynamic discontinuity is wrong; the product rule is continuous in the limit.', 'Comparing the process with random percolation at the same q is only fair when both sample candidate pairs the same way.', 'On the fixed-edge version half of the candidates are discarded, so the process stops at p = 1/2 unless the candidate list is extended.'],
      zh: ['把有限尺度跳变说成热力学不连续是错的；乘积规则在极限下连续。', '只有当两者以同样方式抽候选点对时，在同一 q 上与随机渗流比较才公平。', '固定边表版本会丢弃一半候选，所以除非扩展候选表，过程停在 p = 1/2。'],
      de: ['Den Endlichkeitssprung als thermodynamische Unstetigkeit zu bezeichnen ist falsch; die Produktregel ist im Limes stetig.', 'Der Vergleich mit Zufallsperkolation bei gleichem q ist nur fair, wenn beide Kandidatenpaare gleich ziehen.', 'In der Version mit fester Kantenliste wird die Hälfte der Kandidaten verworfen; ohne Verlängerung endet der Prozess bei p = 1/2.'],
    },
    tests: ['tests/js/algorithms.test.js', 'lib/python/tests/test_algorithms.py', 'data/golden/algorithms-v3.json'],
  },
  kcore: {
    tag: { en: 'Peeling', zh: '剥离', de: 'Peeling' },
    title: { en: 'k-core: peel the periphery', zh: 'k-core：剥掉外围', de: 'k-core: die Peripherie abschälen' },
    purpose: {
      en: ['The k-core is the largest induced subgraph in which every vertex has degree at least k. It is not a giant component and it is not a k-clique: it is what remains after repeatedly deleting every vertex whose current degree is below k. The result is unique, so the order of deletion cannot change it.'],
      zh: ['k-core 是每个顶点度数至少为 k 的最大诱导子图。它不是巨分量，也不是 k-团：它是反复删除当前度数低于 k 的顶点后剩下的部分。结果唯一，所以删除顺序不会改变它。'],
      de: ['Der k-Kern ist der größte induzierte Teilgraph, in dem jeder Knoten Grad mindestens k hat. Er ist weder eine Riesenkomponente noch eine k-Clique, sondern das, was nach wiederholtem Löschen aller Knoten mit aktuellem Grad unter k übrig bleibt. Das Ergebnis ist eindeutig.'],
    },
    steps: {
      en: ['Compute the active degree of every vertex.', 'Queue every vertex whose degree is below k.', 'Remove a queued vertex, decrement the degrees of its active neighbours, and queue any neighbour that falls below k.', 'When the queue is empty, the alive set is the k-core.'],
      zh: ['计算每个顶点的活跃度数。', '把度数低于 k 的顶点入队。', '弹出一个顶点，减少其活跃邻居的度数；低于 k 的邻居入队。', '队列为空时，存活集合就是 k-core。'],
      de: ['Den aktiven Grad jedes Knotens berechnen.', 'Jeden Knoten mit Grad unter k einreihen.', 'Einen Knoten entfernen, die Grade seiner aktiven Nachbarn senken und Nachbarn unter k einreihen.', 'Ist die Queue leer, ist die Alive-Menge der k-Kern.'],
    },
    invariant: {
      en: 'A vertex deleted at some step has current degree below k, and its degree can only decrease later, so it cannot belong to any subgraph with minimum degree k. Conversely, when the queue empties every surviving vertex has degree at least k, and the surviving set is induced. Hence it is exactly the unique maximal k-core.',
      zh: '某一步被删除的顶点当前度数低于 k，而之后度数只会更小，所以它不可能属于任何最小度为 k 的子图。反过来，队列空时每个存活顶点度数至少为 k，且存活集合是诱导子图。因此它恰为唯一的最大 k-core。',
      de: 'Ein gelöschter Knoten hat aktuellen Grad unter k, und sein Grad kann später nur fallen; er kann also in keinem Teilgraphen mit Mindestgrad k liegen. Ist die Queue leer, hat jeder überlebende Knoten Grad mindestens k, und die Menge ist induziert. Sie ist der eindeutige maximale k-Kern.',
    },
    complexity: {
      en: [['time', 'O(n + m)'], ['memory', 'O(n)'], ['queue', 'can exceed n entries']],
      zh: [['时间', 'O(n + m)'], ['内存', 'O(n)'], ['队列', '条目可超过 n']],
      de: [['Zeit', 'O(n + m)'], ['Speicher', 'O(n)'], ['Queue', 'kann mehr als n Einträge haben']],
    },
    code: [
      { path: 'lib/js/engine/network.js', label: 'JavaScript kcore' },
      { path: 'lib/python/percolation_atlas/network.py', label: 'Python kcore' },
    ],
    notes: {
      en: [['deg[v]', 'Counts only active neighbours, not all neighbours in the original graph.'], ['queue.push(w)', 'A vertex can be queued again after each neighbour is peeled, so the queue must be a growable list. A fixed Int32Array(n) silently drops writes.'], ['alive', 'The output mask; size is the number of survivors.']],
      zh: [['deg[v]', '只统计活跃邻居，不是原图中的全部邻居。'], ['queue.push(w)', '每剥掉一个邻居，顶点可能再次入队，所以队列必须可增长。固定 Int32Array(n) 会静默丢弃写入。'], ['alive', '输出掩码；size 是存活数。']],
      de: [['deg[v]', 'Zählt nur aktive Nachbarn, nicht alle Nachbarn im Originalgraphen.'], ['queue.push(w)', 'Ein Knoten kann nach jedem entfernten Nachbarn erneut eingereiht werden; die Queue muss wachsen können. Ein festes Int32Array(n) verwirft Schreibvorgänge still.'], ['alive', 'Die Ausgabemaske; size ist die Zahl der Überlebenden.']],
    },
    pitfalls: {
      en: ['k = 0 returns every active vertex; that is the definition, not a bug.', 'A fixed-size queue leaves a non-k-core behind when vertices are requeued.', 'The k-core is not the giant component: a graph can have a large k-core and no giant component, or the reverse.'],
      zh: ['k = 0 返回所有活跃顶点；这是定义，不是错误。', '固定大小队列在顶点重复入队时会留下非 k-core。', 'k-core 不是巨分量：图可以有很大的 k-core 却没有巨分量，反之亦然。'],
      de: ['k = 0 liefert alle aktiven Knoten; das ist die Definition, kein Fehler.', 'Eine feste Queue lässt bei erneutem Einreihen einen Nicht-k-Kern zurück.', 'Der k-Kern ist nicht die Riesenkomponente: Ein Graph kann einen großen k-Kern ohne Riesenkomponente haben, oder umgekehrt.'],
    },
    tests: ['tests/js/engine.test.js', 'lib/python/tests/test_engine.py', 'assets/js/labs/network.js'],
  },

  hoshen: {
    tag: { en: 'Cluster labelling', zh: '团簇标号', de: 'Cluster-Etikettierung' },
    title: { en: 'Hoshen–Kopelman labelling', zh: 'Hoshen–Kopelman 标号', de: 'Hoshen–Kopelman-Etikettierung' },
    purpose: {
      en: ['The DSU maintains components; Hoshen–Kopelman feeds it in one scan. Visit the elements in a fixed order, look only at the already-visited neighbours, and maintain an equivalence table between provisional labels. After the scan, compress the table once and read the cluster sizes. The graph form in the libraries visits the edge list once and assigns each vertex its root as a label.'],
      zh: ['并查集维护分量；Hoshen–Kopelman 用一次扫描为它提供输入。按固定顺序访问元素，只看已经访问过的邻居，并在临时标号之间维护等价表。扫描结束后压缩一次标号表，读出团簇大小。库中的图形式只遍历一次边表，把每个顶点的根作为标号。'],
      de: ['Die DSU pflegt Komponenten; Hoshen–Kopelman speist sie in einem Scan. Man besucht die Elemente in fester Reihenfolge, betrachtet nur bereits besuchte Nachbarn und pflegt eine Äquivalenztabelle provisorischer Labels. Nach dem Scan wird die Tabelle einmal komprimiert und die Clustergrößen gelesen. Die Graphvariante der Bibliotheken läuft einmal über die Kantenliste und vergibt die Wurzel als Label.'],
    },
    steps: {
      en: ['Initialise the DSU; every present vertex is its own component.', 'Visit each edge (or each site and its west/north neighbours) in scan order.', 'If the edge is open and both endpoints are present, union their provisional labels.', 'Compress the labels in one pass and accumulate the size of each root.'],
      zh: ['初始化并查集；每个存在的顶点自成一个分量。', '按扫描顺序访问每条边（或每个位点及其西/北邻居）。', '若边打开且两端都存在，合并它们的临时标号。', '一趟压缩标号，并累加每个根的大小。'],
      de: ['DSU initialisieren; jeder vorhandene Knoten ist seine eigene Komponente.', 'Jede Kante (oder jeden Platz mit West-/Nordnachbarn) in Scanreihenfolge besuchen.', 'Ist die Kante offen und beide Endpunkte vorhanden, ihre provisorischen Labels vereinigen.', 'Labels in einem Durchlauf komprimieren und die Größe jeder Wurzel aufsummieren.'],
    },
    invariant: {
      en: 'Two vertices receive the same compressed label iff they are connected by a path of open edges through present vertices. The number of distinct labels equals the number of clusters, and the size array sums to the number of present vertices. Inactive vertices are labelled -1.',
      zh: '两个顶点得到相同压缩标号，当且仅当它们通过存在顶点之间的开边路径连通。不同标号数等于团簇数，大小数组之和等于存在顶点数。非活跃顶点标为 -1。',
      de: 'Zwei Knoten erhalten dasselbe komprimierte Label genau dann, wenn sie durch einen Pfad offener Kanten über vorhandene Knoten verbunden sind. Die Zahl verschiedener Labels ist die Clusterzahl, und die Größen summieren sich zur Zahl vorhandener Knoten. Inaktive Knoten erhalten -1.',
    },
    complexity: {
      en: [['scan', 'O(n + m)'], ['unions', 'O(m α(n))'], ['label compression', 'O(n)'], ['memory', 'O(n)']],
      zh: [['扫描', 'O(n + m)'], ['合并', 'O(m α(n))'], ['标号压缩', 'O(n)'], ['内存', 'O(n)']],
      de: [['Scan', 'O(n + m)'], ['Vereinigungen', 'O(m α(n))'], ['Label-Kompression', 'O(n)'], ['Speicher', 'O(n)']],
    },
    code: [
      { path: 'lib/js/engine/algorithms.js', label: 'JavaScript labelClusters' },
      { path: 'lib/python/percolation_atlas/algorithms.py', label: 'Python label_clusters' },
      { path: 'lib/cpp/include/percolation_atlas/algorithms.hpp', label: 'C++ label_clusters' },
      { path: 'lib/julia/src/algorithms.jl', label: 'Julia label_clusters' },
    ],
    notes: {
      en: [['labelClusters(n, eu, ev, openEdges, active)', 'Both modes in one routine: active = null labels every vertex (bond), active given labels site percolation.'], ['sizes[root]', 'Only roots have a nonzero size; a vertex that is not a root must not be used as a cluster identifier before find().'], ['inactive label -1', 'The sentinel makes the site mode explicit; treating a closed site as its own cluster is the classic off-by-one-component error.']],
      zh: [['labelClusters(n, eu, ev, openEdges, active)', '一个例程覆盖两种模式：active = null 标注所有顶点（键渗流），给定 active 则标注位点渗流。'], ['sizes[root]', '只有根的大小非零；非根顶点在 find() 之前不能当作团簇标识。'], ['非活跃标号 -1', '哨兵值让位点模式显式化；把闭位点当成独立团簇是经典的“多算一个分量”错误。']],
      de: [['labelClusters(n, eu, ev, openEdges, active)', 'Beide Modi in einer Routine: active = null etikettiert alle Knoten (Kantenperkolation), mit active wird Platzperkolation etikettiert.'], ['sizes[root]', 'Nur Wurzeln haben eine von null verschiedene Größe; ein Nicht-Wurzelknoten darf vor find() nicht als Clusterkennung dienen.'], ['inaktives Label -1', 'Der Sentineltwert macht den Platzmodus explizit; einen geschlossenen Platz als eigenen Cluster zu zählen ist der klassische Fehler.']],
    },
    pitfalls: {
      en: ['Using a provisional label after the scan without compressing it gives the wrong cluster count.', 'Forgetting the inactive sentinel makes every empty site a singleton and inflates the cluster count.', 'Visiting an edge twice (from both endpoints) is harmless for union but changes the stated cost; the scan must be one pass.'],
      zh: ['扫描后不压缩临时标号就使用，会得到错误的团簇数。', '忘记非活跃哨兵，会把每个空位点算成单点团簇，虚增团簇数。', '从两端各访问一次边对合并无害，但会改变所述代价；扫描必须是一趟。'],
      de: ['Ein provisorisches Label nach dem Scan ohne Kompression zu nutzen ergibt eine falsche Clusterzahl.', 'Den inaktiven Sentineltwert zu vergessen macht jeden leeren Platz zu einem Singleton und bläht die Clusterzahl auf.', 'Eine Kante von beiden Enden zu besuchen ist für die Union harmlos, ändert aber die angegebene Kostenaussage; der Scan muss ein Durchlauf sein.'],
    },
    tests: ['tests/js/trees.test.js', 'lib/python/tests/test_trees.py', 'data/golden/algorithms-v3.json'],
  },

  bethe: {
    tag: { en: 'Exact tree', zh: '精确树', de: 'Exakter Baum' },
    title: { en: 'Bethe fixed point', zh: 'Bethe 不动点', de: 'Bethe-Fixpunkt' },
    purpose: {
      en: ['On a z-regular tree the open cluster is a branching process, and the percolation probability is the smallest fixed point of u = (1 − p + pu)^(z−1). The routine solves that equation by bisection on the first sign change, reports θ = 1 − (1 − p + pu)^z, and returns the exact threshold 1/(z−1).'],
      zh: ['在 z 正则树上，开团簇是分支过程，渗流概率是 u = (1 − p + pu)^(z−1) 的最小不动点。该例程用首次变号的二分法求解，报告 θ = 1 − (1 − p + pu)^z，并返回精确阈值 1/(z−1)。'],
      de: ['Auf einem z-regulären Baum ist der offene Cluster ein Verzweigungsprozess, und die Perkolationswahrscheinlichkeit ist der kleinste Fixpunkt von u = (1 − p + pu)^(z−1). Die Routine löst diese Gleichung per Bisektion auf den ersten Vorzeichenwechsel, meldet θ = 1 − (1 − p + pu)^z und liefert die exakte Schwelle 1/(z−1).'],
    },
    steps: {
      en: ['Compute p_c = 1/(z−1); if p ≤ p_c, return θ = 0 and u = 1.', 'Otherwise bisect u ∈ [0,1] on the sign of (1 − p + pu)^(z−1) − u, keeping the smallest root.', 'Evaluate θ = 1 − (1 − p + pu)^z and clamp a tiny negative value to zero.', 'Report χ = 1 + zp/(1 − p(z−1)) below p_c and ∞ above it.'],
      zh: ['计算 p_c = 1/(z−1)；若 p ≤ p_c，返回 θ = 0、u = 1。', '否则在 u ∈ [0,1] 上按 (1 − p + pu)^(z−1) − u 的符号二分，保留最小根。', '计算 θ = 1 − (1 − p + pu)^z，把极小的负值截为零。', 'p_c 以下报告 χ = 1 + zp/(1 − p(z−1))，以上报告 ∞。'],
      de: ['p_c = 1/(z−1) berechnen; für p ≤ p_c gilt θ = 0 und u = 1.', 'Sonst u ∈ [0,1] nach dem Vorzeichen von (1 − p + pu)^(z−1) − u halbieren und die kleinste Wurzel behalten.', 'θ = 1 − (1 − p + pu)^z auswerten und einen winzigen negativen Wert auf null setzen.', 'Unter p_c χ = 1 + zp/(1 − p(z−1)) melden, darüber ∞.'],
    },
    invariant: {
      en: 'The returned u is the smallest fixed point, so it is the physical finite-branch probability; the trivial fixed point u = 1 is never selected when p > p_c. θ is monotone in p, vanishes at p_c and tends to one as p → 1.',
      zh: '返回的 u 是最小不动点，因此是物理的有限分支概率；p > p_c 时不会选到平凡不动点 u = 1。θ 关于 p 单调，在 p_c 处为零，并在 p → 1 时趋于一。',
      de: 'Das zurückgegebene u ist der kleinste Fixpunkt und damit die physikalische Wahrscheinlichkeit eines endlichen Zweigs; der triviale Fixpunkt u = 1 wird für p > p_c nie gewählt. θ ist monoton in p, verschwindet bei p_c und strebt für p → 1 gegen eins.',
    },
    complexity: {
      en: [['bisection', 'O(log(1/tol))'], ['one evaluation', 'O(1)'], ['memory', 'O(1)']],
      zh: [['二分', 'O(log(1/tol))'], ['单次求值', 'O(1)'], ['内存', 'O(1)']],
      de: [['Bisektion', 'O(log(1/tol))'], ['eine Auswertung', 'O(1)'], ['Speicher', 'O(1)']],
    },
    code: [
      { path: 'lib/js/engine/trees.js', label: 'JavaScript bethePercolation' },
      { path: 'lib/python/percolation_atlas/trees.py', label: 'Python bethe_percolation' },
      { path: 'lib/cpp/include/percolation_atlas/algorithms.hpp', label: 'C++ bethe_percolation' },
      { path: 'lib/julia/src/algorithms.jl', label: 'Julia bethe_percolation' },
    ],
    notes: {
      en: [['firstRoot(g)', 'Bisection selects the first sign change, not a fixed point from an arbitrary starting value.'], ['p ≤ p_c branch', 'Returns exactly zero instead of a numerically small θ; the critical tree has no infinite cluster.'], ['chi', 'The mean cluster size is finite only below p_c; above it the infinite cluster makes the mean infinite, so ∞ is the honest value.']],
      zh: [['firstRoot(g)', '二分选择首次变号，而不是从任意初值迭代到某个不动点。'], ['p ≤ p_c 分支', '返回精确的零，而不是数值上很小的 θ；临界树没有无限团簇。'], ['chi', '平均团簇尺寸只在 p_c 以下有限；以上无限团簇使均值无穷，所以 ∞ 才是诚实的值。']],
      de: [['firstRoot(g)', 'Die Bisektion wählt den ersten Vorzeichenwechsel, nicht einen Fixpunkt von einem beliebigen Startwert.'], ['p ≤ p_c-Zweig', 'Liefert exakt null statt eines numerisch kleinen θ; der kritische Baum hat keinen unendlichen Cluster.'], ['chi', 'Die mittlere Clustergröße ist nur unter p_c endlich; darüber macht der unendliche Cluster den Mittelwert unendlich.']],
    },
    pitfalls: {
      en: ['Iterating from u = 1 stays at the trivial fixed point and reports θ = 0 above p_c.', 'Using 1/m for the z-regular tree with m = z forgets that the root has z neighbours but every other vertex has z−1 forward neighbours.', 'Applying the tree threshold to Z² (1/3 instead of 1/2) ignores the dual cycles.'],
      zh: ['从 u = 1 迭代会停在平凡不动点，在 p_c 以上误报 θ = 0。', '对 z 正则树用 1/m（m = z）会忘记根有 z 个邻居、其余顶点只有 z−1 个前向邻居。', '把树阈值套到 Z²（1/3 而非 1/2）忽略了对偶环。'],
      de: ['Iteration von u = 1 bleibt am trivialen Fixpunkt und meldet oberhalb von p_c fälschlich θ = 0.', '1/m für den z-regulären Baum mit m = z zu verwenden übersieht, dass die Wurzel z Nachbarn hat, jeder andere Knoten aber z−1 Vorwärtsnachbarn.', 'Die Baumschwelle auf Z² anzuwenden (1/3 statt 1/2) ignoriert die dualen Zyklen.'],
    },
    tests: ['tests/js/trees.test.js', 'lib/python/tests/test_trees.py', 'data/golden/algorithms-v3.json'],
  },

  sir: {
    tag: { en: 'Epidemics', zh: '流行病', de: 'Epidemien' },
    title: { en: 'SIR final size', zh: 'SIR 最终规模', de: 'SIR-Endgröße' },
    purpose: {
      en: ['The final size of an SIR epidemic on a static network is the giant component of the network after each edge is kept with transmissibility T. The routine evaluates the configuration-model fixed point S = 1 − G0(1 − T + Tu), u = G1(1 − T + Tu), and returns R0 = T(κ−1), the percolation threshold and the herd-immunity fraction.'],
      zh: ['静态网络上 SIR 流行的最终规模，等于每条边以传播概率 T 保留后网络的巨分量。该例程计算配置模型不动点 S = 1 − G0(1 − T + Tu)、u = G1(1 − T + Tu)，并返回 R0 = T(κ−1)、渗流阈值与群体免疫比例。'],
      de: ['Die Endgröße einer SIR-Epidemie auf einem statischen Netz ist die Riesenkomponente, nachdem jede Kante mit Übertragbarkeit T behalten wurde. Die Routine löst den Fixpunkt S = 1 − G0(1 − T + Tu), u = G1(1 − T + Tu) und liefert R0 = T(κ−1), die Perkolationsschwelle und die Herdenimmunitätsfraktion.'],
    },
    steps: {
      en: ['Normalise the degree pmf and compute G0, G1, ⟨k⟩ and κ.', 'Solve u = G1(1 − T + Tu) by bisection on the first sign change.', 'Evaluate S = 1 − G0(1 − T + Tu) and clamp to [0,1].', 'Return R0 = T(κ−1), T_c = 1/(κ−1), and v_c = 1 − 1/R0 when R0 > 1.'],
      zh: ['归一化度分布，计算 G0、G1、⟨k⟩ 与 κ。', '用首次变号的二分法解 u = G1(1 − T + Tu)。', '计算 S = 1 − G0(1 − T + Tu)，截到 [0,1]。', '返回 R0 = T(κ−1)、T_c = 1/(κ−1)，以及 R0 > 1 时的 v_c = 1 − 1/R0。'],
      de: ['Die Gradverteilung normalisieren und G0, G1, ⟨k⟩ sowie κ berechnen.', 'u = G1(1 − T + Tu) per Bisektion auf den ersten Vorzeichenwechsel lösen.', 'S = 1 − G0(1 − T + Tu) auswerten und auf [0,1] begrenzen.', 'R0 = T(κ−1), T_c = 1/(κ−1) und für R0 > 1 v_c = 1 − 1/R0 zurückgeben.'],
    },
    invariant: {
      en: 'The returned S is the fraction outside the giant component’s complement, i.e. the final size; it is zero below T_c and strictly increasing above it. R0 is the mean number of transmissions per index case in the branching limit, and v_c is the random-immunisation fraction that makes the effective R equal one.',
      zh: '返回的 S 是巨分量补集之外的比例，即最终规模；它在 T_c 以下为零，以上严格递增。R0 是分支极限下每个指示病例的平均传播数，v_c 是使有效 R 等于一的随机免疫比例。',
      de: 'Das zurückgegebene S ist der Anteil außerhalb des Komplements der Riesenkomponente, also die Endgröße; unterhalb von T_c ist es null, darüber streng wachsend. R0 ist die mittlere Übertragungszahl pro Indexfall im Verzweigungsgrenzfall, und v_c ist der Anteil zufälliger Immunisierung, der das effektive R auf eins bringt.',
    },
    complexity: {
      en: [['pmf evaluation', 'O(k_max)'], ['bisection', 'O(log(1/tol)) evaluations'], ['memory', 'O(k_max)']],
      zh: [['分布求值', 'O(k_max)'], ['二分', 'O(log(1/tol)) 次求值'], ['内存', 'O(k_max)']],
      de: [['Verteilungsauswertung', 'O(k_max)'], ['Bisektion', 'O(log(1/tol)) Auswertungen'], ['Speicher', 'O(k_max)']],
    },
    code: [
      { path: 'lib/js/engine/trees.js', label: 'JavaScript sirFinalSize' },
      { path: 'lib/python/percolation_atlas/trees.py', label: 'Python sir_final_size' },
      { path: 'lib/cpp/include/percolation_atlas/algorithms.hpp', label: 'C++ sir_final_size' },
      { path: 'lib/julia/src/algorithms.jl', label: 'Julia sir_final_size' },
    ],
    notes: {
      en: [['configurationGiantComponent(pmf, T)', 'The engine underneath; sirFinalSize only adds R0 and the herd-immunity fraction.'], ['T vs p', 'T is a transmissibility, not a bond occupancy. The two coincide only when the epidemic has been reduced to percolation.'], ['herdImmunity', 'Defined as 1 − 1/R0, and only meaningful when R0 > 1; the routine returns zero otherwise.']],
      zh: [['configurationGiantComponent(pmf, T)', '底层引擎；sirFinalSize 只额外给出 R0 与群体免疫比例。'], ['T 与 p', 'T 是传播概率，不是键占据概率。只有在流行病被归约为渗流时二者才相同。'], ['herdImmunity', '定义为 1 − 1/R0，只在 R0 > 1 时有意义；否则返回零。']],
      de: [['configurationGiantComponent(pmf, T)', 'Die Engine darunter; sirFinalSize ergänzt nur R0 und die Herdenimmunitätsfraktion.'], ['T vs. p', 'T ist eine Übertragbarkeit, keine Kantenbesetzung. Beide stimmen nur überein, wenn die Epidemie auf Perkolation reduziert wurde.'], ['herdImmunity', 'Definiert als 1 − 1/R0 und nur für R0 > 1 sinnvoll; sonst liefert die Routine null.']],
    },
    pitfalls: {
      en: ['Starting the fixed-point iteration at u = 1 stays at the trivial root and reports zero final size.', 'Using R0 = T⟨k⟩ instead of T(κ−1) is the homogeneous-mixing approximation, not the configuration-model answer.', 'Applying the static formula to a temporal network is an upper bound; it can overstate spread by a large factor.'],
      zh: ['从 u = 1 开始不动点迭代会停在平凡根，把最终规模报成零。', '用 R0 = T⟨k⟩ 而不是 T(κ−1)，是均匀混合近似，不是配置模型答案。', '把静态公式用于时序网络只是上界；它可能大幅高估传播。'],
      de: ['Die Fixpunktiteration bei u = 1 zu starten bleibt an der trivialen Wurzel und meldet Endgröße null.', 'R0 = T⟨k⟩ statt T(κ−1) zu verwenden ist die Homogen-Mixing-Näherung, nicht die Antwort des Konfigurationsmodells.', 'Die statische Formel auf ein zeitliches Netz anzuwenden ist eine Oberschranke; sie kann die Ausbreitung stark überschätzen.'],
    },
    tests: ['tests/js/trees.test.js', 'lib/python/tests/test_trees.py', 'data/golden/algorithms-v3.json'],
  },
  'nz-site': {
    tag: { en: 'Sweep (site)', zh: '扫描（位点）', de: 'Sweep (Platz)' },
    title: { en: 'Newman–Ziff for sites', zh: '位点 Newman–Ziff', de: 'Newman–Ziff für Plätze' },
    purpose: {
      en: ['The bond sweep adds edges; the site sweep adds vertices. Draw one random order of the sites, occupy them one at a time, and union each new site with the neighbours that have already appeared. After k sites the occupied set is a uniform k-subset, so the state is a site-percolation sample at p = k/n.'],
      zh: ['键扫描逐条加边；位点扫描逐个加顶点。抽一条随机的位点顺序，依次占据，并把每个新位点与已经出现的邻居合并。加入 k 个位点后，占据集是均匀 k-子集，因此该状态就是 p = k/n 处的位点渗流样本。'],
      de: ['Der Kanten-Sweep fügt Kanten hinzu; der Platz-Sweep fügt Knoten hinzu. Man zieht eine zufällige Reihenfolge der Plätze, besetzt sie einzeln und vereinigt jeden neuen Platz mit den bereits erschienenen Nachbarn. Nach k Plätzen ist die besetzte Menge ein uniformes k-Tupel, also eine Platzperkolations-Stichprobe bei p = k/n.'],
    },
    steps: {
      en: ['Shuffle the n site indices once with the shared RNG.', 'Activate the next site; increment the active cluster count and M₂ by one.', 'Union it with every neighbour that is already active; each union adds 2ab to M₂.', 'At checkpoints record p = k/n, S_max, M₂/n and the number of occupied clusters.'],
      zh: ['用共享 RNG 洗牌 n 个位点索引一次。', '激活下一个位点；活跃团簇数与 M₂ 各加一。', '把它与所有已激活邻居合并；每次合并给 M₂ 增加 2ab。', '在检查点记录 p = k/n、S_max、M₂/n 与占据团簇数。'],
      de: ['Die n Platzindizes einmal mit dem gemeinsamen RNG mischen.', 'Den nächsten Platz aktivieren; aktive Clusterzahl und M₂ um eins erhöhen.', 'Ihn mit jedem bereits aktiven Nachbarn vereinigen; jede Vereinigung addiert 2ab zu M₂.', 'An Checkpoints p = k/n, S_max, M₂/n und die Zahl besetzter Cluster notieren.'],
    },
    invariant: {
      en: 'After k steps the active set is a uniform k-subset of the vertices, and the DSU contains exactly the connected components of the induced subgraph. Edges are never sampled, so the random stream depends only on n, not on m.',
      zh: 'k 步之后，活跃集是顶点的均匀 k-子集，并查集恰好包含诱导子图的连通分量。整个过程不抽边，因此随机流只依赖 n，不依赖 m。',
      de: 'Nach k Schritten ist die aktive Menge ein uniformes k-Tupel der Knoten, und die DSU enthält genau die Zusammenhangskomponenten des induzierten Teilgraphen. Kanten werden nie gezogen; der Zufallsstrom hängt nur von n ab, nicht von m.',
    },
    complexity: {
      en: [['shuffle', 'O(n)'], ['one sweep', 'O(n + m α(n))'], ['memory', 'O(n + m)']],
      zh: [['洗牌', 'O(n)'], ['一次扫描', 'O(n + m α(n))'], ['内存', 'O(n + m)']],
      de: [['Mischen', 'O(n)'], ['ein Sweep', 'O(n + m α(n))'], ['Speicher', 'O(n + m)']],
    },
    code: [
      { path: 'lib/js/engine/percolation.js', label: 'JavaScript newmanZiffSite' },
      { path: 'lib/python/percolation_atlas/percolation.py', label: 'Python newman_ziff_site' },
      { path: 'lib/cpp/include/percolation_atlas/percolation.hpp', label: 'C++ newman_ziff_site' },
      { path: 'lib/julia/src/percolation.jl', label: 'Julia newman_ziff_site' },
    ],
    notes: {
      en: [['rng.shuffle(order)', 'The site order is the entire experiment. The edge order is irrelevant in site mode.'], ['union with active neighbours', 'A neighbour that has not appeared yet is ignored; it will union later when it appears and sees this site as active.'], ['chi2 = M₂/n', 'The denominator is the box size n, not the occupied count, so the curve is comparable to the bond sweep.']],
      zh: [['rng.shuffle(order)', '位点顺序就是整个实验。位点模式下边序无关。'], ['与活跃邻居合并', '尚未出现的邻居被忽略；它出现时会反过来看到当前位点已激活，再完成合并。'], ['chi2 = M₂/n', '分母是盒子大小 n，而不是占据数，因此曲线可与键扫描比较。']],
      de: [['rng.shuffle(order)', 'Die Platzordnung ist das ganze Experiment. Im Platzmodus ist die Kantenordnung irrelevant.'], ['Vereinigung mit aktiven Nachbarn', 'Ein noch nicht erschienener Nachbar wird ignoriert; er vereinigt später, wenn er erscheint und diesen Platz aktiv sieht.'], ['chi2 = M₂/n', 'Der Nenner ist die Boxgröße n, nicht die Zahl besetzter Plätze, damit die Kurve mit dem Kanten-Sweep vergleichbar bleibt.']],
    },
    pitfalls: {
      en: ['Sampling edges as well consumes a different random stream and breaks the uniform k-subset property.', 'Using the occupied count as the denominator changes chi2 and makes the curve incomparable with the bond sweep.', 'Forgetting to union a new site with all earlier neighbours undercounts the cluster size.'],
      zh: ['同时抽边会消耗不同的随机流，并破坏均匀 k-子集性质。', '用占据数作分母会改变 chi2，使曲线无法与键扫描比较。', '忘记把新位点与所有更早的邻居合并，会低估团簇大小。'],
      de: ['Auch Kanten zu ziehen verbraucht einen anderen Zufallsstrom und zerstört die uniforme k-Tupel-Eigenschaft.', 'Die Zahl besetzter Plätze als Nenner zu nehmen ändert chi2 und macht die Kurve mit dem Kanten-Sweep unvergleichbar.', 'Einen neuen Platz nicht mit allen früheren Nachbarn zu vereinigen unterschätzt die Clustergröße.'],
    },
    tests: ['tests/js/message.test.js', 'lib/python/tests/test_message.py', 'data/golden/algorithms-v3.json'],
  },

  message: {
    tag: { en: 'Fixed point', zh: '不动点', de: 'Fixpunkt' },
    title: { en: 'Message passing', zh: '消息传递', de: 'Botschaftspassage' },
    purpose: {
      en: ['Message passing computes the giant-component probability from local cavity messages. On a tree it is exact; on a graph with cycles it is the Bethe approximation, whose error is governed by the short-loop density. The implementation uses prefix/suffix products, so one sweep is O(n + m), not O(sum deg²).'],
      zh: ['消息传递用局部空腔消息计算巨分量概率。在树上精确；在有环的图上是 Bethe 近似，误差由短环密度控制。实现使用前缀/后缀乘积，使一趟扫描为 O(n + m)，而不是 O(Σdeg²)。'],
      de: ['Botschaftspassage berechnet die Riesenkomponenten-Wahrscheinlichkeit aus lokalen Cavity-Botschaften. Auf einem Baum ist sie exakt; auf einem Graphen mit Zyklen ist sie die Bethe-Näherung, deren Fehler von der Dichte kurzer Schleifen abhängt. Die Implementierung nutzt Präfix-/Suffixprodukte, sodass ein Durchlauf O(n + m) statt O(Σdeg²) kostet.'],
    },
    steps: {
      en: ['Build a CSR with a mate array pairing the two half-edges of every edge.', 'Initialise every message to zero, which selects the physical fixed point.', 'At each vertex compute prefix and suffix products of 1 − T + T·msg over incident half-edges.', 'Write the product excluding k to the opposite half-edge; iterate to tolerance.', 'Compute outside[v] and S = 1 − mean(outside).'],
      zh: ['建立 CSR，并用 mate 数组配对每条边的两条半边。', '把所有消息初始化为零，以选出物理不动点。', '在每个顶点对入射半边的 1 − T + T·msg 计算前缀与后缀乘积。', '把排除 k 的乘积写到对侧半边；迭代到容差。', '计算 outside[v] 与 S = 1 − mean(outside)。'],
      de: ['CSR mit einem mate-Array aufbauen, das die beiden Halbkanten jeder Kante paart.', 'Alle Botschaften auf null setzen; das wählt den physikalischen Fixpunkt.', 'An jedem Knoten Präfix- und Suffixprodukte von 1 − T + T·msg über die einfallenden Halbkanten berechnen.', 'Das Produkt ohne k auf die gegenüberliegende Halbkante schreiben; bis zur Toleranz iterieren.', 'outside[v] und S = 1 − mean(outside) berechnen.'],
    },
    invariant: {
      en: 'At a fixed point, msg[k] is the probability that the branch behind half-edge k does not connect to the giant component. On a tree the product factorisation is exact; on a graph with cycles it assumes independent branches and is the Bethe approximation. Starting from zero avoids the trivial all-ones solution.',
      zh: '在不动点处，msg[k] 是半边 k 背后的分支不连到巨分量的概率。树上乘积分解精确；有环图上它假设分支独立，是 Bethe 近似。从零出发避免了全一平凡解。',
      de: 'Am Fixpunkt ist msg[k] die Wahrscheinlichkeit, dass der Zweig hinter Halbkante k nicht an die Riesenkomponente anschließt. Auf einem Baum ist die Produktzerlegung exakt; auf einem Graphen mit Zyklen nimmt sie unabhängige Zweige an und ist die Bethe-Näherung. Der Start bei null vermeidet die triviale Eins-Lösung.',
    },
    complexity: {
      en: [['one sweep', 'O(n + m)'], ['iterations', 'graph-dependent, capped by max_iter'], ['memory', 'O(n + m)']],
      zh: [['一趟', 'O(n + m)'], ['迭代次数', '依赖图，受 max_iter 限制'], ['内存', 'O(n + m)']],
      de: [['ein Durchlauf', 'O(n + m)'], ['Iterationen', 'graphabhängig, durch max_iter begrenzt'], ['Speicher', 'O(n + m)']],
    },
    code: [
      { path: 'lib/js/engine/message.js', label: 'JavaScript messagePassingPercolation' },
      { path: 'lib/python/percolation_atlas/message.py', label: 'Python message_passing_percolation' },
      { path: 'lib/cpp/include/percolation_atlas/algorithms.hpp', label: 'C++ message_passing_percolation' },
      { path: 'lib/julia/src/algorithms.jl', label: 'Julia message_passing_percolation' },
    ],
    notes: {
      en: [['mate[k]', 'The message into v from adj[k] lives at k; the message v sends back lives at the opposite half-edge. Reading and writing the same index is the classic sign error.'], ['prefix / suffix', 'The two scans give every excluded product in O(deg), so a sweep is linear in the edge count.'], ['initialise at zero', 'Starting at one stays at the trivial fixed point and reports no giant component even when one exists.']],
      zh: [['mate[k]', '从 adj[k] 进入 v 的消息存在 k；v 发回去的消息存在对侧半边。读写同一个索引是经典符号错误。'], ['前缀 / 后缀', '两趟扫描以 O(deg) 给出每个排除乘积，因此一趟与边数线性。'], ['从零初始化', '从一出发会停在平凡不动点，即使存在巨分量也会报零。']],
      de: [['mate[k]', 'Die Botschaft von adj[k] nach v liegt bei k; die zurückgesandte Botschaft liegt an der gegenüberliegenden Halbkante. Derselbe Index zum Lesen und Schreiben ist der klassische Vorzeichenfehler.'], ['Präfix / Suffix', 'Die beiden Scans liefern jedes Ausschlussprodukt in O(deg); ein Durchlauf ist linear in der Kantenzahl.'], ['Start bei null', 'Der Start bei eins bleibt am trivialen Fixpunkt und meldet keine Riesenkomponente, auch wenn eine existiert.']],
    },
    pitfalls: {
      en: ['Updating msg[k] in place instead of mate[k] reverses every message.', 'Iterating from one reports S = 0 for a graph with a giant component.', 'On a lattice with short loops the answer is a Bethe approximation, not the lattice percolation probability.'],
      zh: ['原地更新 msg[k] 而不是 mate[k]，会把所有消息方向弄反。', '从一迭代会对有巨分量的图报 S = 0。', '在含短环的格子上，答案是 Bethe 近似，不是格子渗流概率。'],
      de: ['msg[k] statt mate[k] in place zu aktualisieren kehrt jede Botschaft um.', 'Iteration von eins meldet S = 0 für einen Graphen mit Riesenkomponente.', 'Auf einem Gitter mit kurzen Schleifen ist das Ergebnis eine Bethe-Näherung, nicht die Gitter-Perkolationswahrscheinlichkeit.'],
    },
    tests: ['tests/js/message.test.js', 'lib/python/tests/test_message.py', 'data/golden/algorithms-v3.json'],
  },

};

export function guideFor(id, lang) {
  const entry = ALGORITHM_GUIDE[id];
  if (!entry) return null;
  const pick = (field) => (entry[field] && (entry[field][lang] || entry[field].en));
  return {
    id,
    tag: entry.tag[lang] || entry.tag.en,
    title: entry.title[lang] || entry.title.en,
    purpose: pick('purpose') || [],
    steps: pick('steps') || [],
    invariant: pick('invariant') || '',
    complexity: pick('complexity') || [],
    notes: pick('notes') || [],
    pitfalls: pick('pitfalls') || [],
    code: entry.code,
    tests: entry.tests,

};
}
