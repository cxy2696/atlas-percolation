/** Authored algorithm guide. Each entry explains the idea, the invariant,
 *  the cost, the exact code path, and the mistakes that survive a quick read.
 *  The text is written by hand in the three editions; it is not generated. */

export const ALGORITHM_ORDER = ['sampler', 'dsu', 'nz', 'leath', 'bootstrap', 'invasion', 'achlioptas'];

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
