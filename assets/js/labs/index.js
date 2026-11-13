/** Lab registry. Titles and blurbs are authored, not machine-translated at
 *  runtime; the English string is the fallback. */

export const LABS = [
  {
    id: 'lattice',
    title: { en: 'Lattice percolation', zh: '格子渗流', de: 'Gitterperkolation' },
    blurb: {
      en: 'One configuration at full resolution, cluster colouring, crossing indicator.',
      zh: '完整分辨率的单张构型、团簇着色与横穿指示。',
      de: 'Eine Konfiguration in voller Auflösung, Clusterfärbung, Durchgangsanzeige.',
    },
    mount: (el, ctx) => import('./lattice.js').then((m) => m.mount(el, ctx)),
  },
  {
    id: 'crossing',
    title: { en: 'Crossing & collapse', zh: '横穿与坍缩', de: 'Durchgang & Kollaps' },
    blurb: {
      en: 'π(p, L) for three sizes plus the finite-size collapse in (p−p_c)L^{1/ν}.',
      zh: '三种尺寸的 π(p, L)，以及 (p−p_c)L^{1/ν} 上的有限尺度坍缩。',
      de: 'π(p, L) für drei Größen plus Kollaps in (p−p_c)L^{1/ν}.',
    },
    mount: (el, ctx) => import('./crossing.js').then((m) => m.mount(el, ctx)),
  },
  {
    id: 'newman-ziff',
    title: { en: 'Newman–Ziff sweep', zh: 'Newman–Ziff 扫描', de: 'Newman–Ziff-Sweep' },
    blurb: {
      en: 'One edge order, the whole S_max(p) and χ(p) curves, replayed live.',
      zh: '一条边序给出完整的 S_max(p) 与 χ(p) 曲线，可实时重放。',
      de: 'Eine Kantenordnung, die ganzen S_max(p)- und χ(p)-Kurven, live abgespielt.',
    },
    mount: (el, ctx) => import('./nz.js').then((m) => m.mount(el, ctx)),
  },
  {
    id: 'network',
    title: { en: 'Network robustness', zh: '网络鲁棒性', de: 'Netzwerkrobustheit' },
    blurb: {
      en: 'Scale-free configuration model under random and targeted removal.',
      zh: '无标度配置模型在随机与定向删除下的响应。',
      de: 'Skalenfreies Konfigurationsmodell unter zufälligem und gezieltem Entfernen.',
    },
    mount: (el, ctx) => import('./network.js').then((m) => m.mount(el, ctx)),
  },
  {
    id: 'interdependent',
    title: { en: 'Coupled cascade', zh: '耦合级联', de: 'Gekoppelte Kaskade' },
    blurb: {
      en: 'Two layers, one-to-one coupling, the 2.4554/c saddle node.',
      zh: '两层一一耦合，2.4554/c 的鞍结点。',
      de: 'Zwei Schichten, eins zu eins gekoppelt, Sattel-Knoten 2.4554/c.',
    },
    mount: (el, ctx) => import('./interdependent.js').then((m) => m.mount(el, ctx)),
  },
  {
    id: 'continuum',
    title: { en: 'Boolean model', zh: '布尔模型', de: 'Boolesches Modell' },
    blurb: {
      en: 'Poisson disks, λ = nπr², and why coverage is not connectivity.',
      zh: 'Poisson 圆盘、λ = nπr²，以及为什么覆盖不等于连通。',
      de: 'Poisson-Scheiben, λ = nπr², und warum Überdeckung nicht Konnektivität ist.',
    },
    mount: (el, ctx) => import('./continuum.js').then((m) => m.mount(el, ctx)),
  },
  {
    id: 'cardy',
    title: { en: 'Cardy formula', zh: 'Cardy 公式', de: 'Cardy-Formel' },
    blurb: {
      en: 'The exact crossing curve and the measured points that confirm it.',
      zh: '精确横穿曲线与证实它的实测点。',
      de: 'Die exakte Durchgangskurve und die Messpunkte, die sie bestätigen.',
    },
    mount: (el, ctx) => import('./cardy.js').then((m) => m.mount(el, ctx)),
  },
  {
    id: 'directed',
    title: { en: 'Directed percolation', zh: '有向渗流', de: 'Gerichtete Perkolation' },
    blurb: {
      en: 'East is space, south is time; the causal future of the left boundary.',
      zh: '东为空间，南为时间；左边界在因果意义上的未来。',
      de: 'Ost ist Raum, Süd ist Zeit; die kausale Zukunft des linken Randes.',
    },
    mount: (el, ctx) => import('./directed.js').then((m) => m.mount(el, ctx)),
  },
  {
    id: 'bootstrap',
    title: { en: 'Bootstrap percolation', zh: '自举渗流', de: 'Bootstrap-Perkolation' },
    blurb: {
      en: 'A closure rule: r active neighbours activate a site. The final set is a least fixed point.',
      zh: '一个闭包规则：r 个活跃邻居激活一个位点。最终集合是最小不动点。',
      de: 'Eine Abschlussregel: r aktive Nachbarn aktivieren einen Platz. Die Endmenge ist ein kleinster Fixpunkt.',
    },
    mount: (el, ctx) => import('./bootstrap.js').then((m) => m.mount(el, ctx)),
  },
  {
    id: 'explosive',
    title: { en: 'Explosive percolation', zh: '爆炸渗流', de: 'Explosive Perkolation' },
    blurb: {
      en: 'Two-choice edge rules delay the giant component and sharpen the finite-size jump.',
      zh: '双选择加边规则推迟巨分量，并让有限尺度跳变更陡。',
      de: 'Zwei-Wahl-Kantenregeln verzögern die Riesenkomponente und schärfen den Endlichkeitssprung.',
    },
    mount: (el, ctx) => import('./explosive.js').then((m) => m.mount(el, ctx)),
  },
  {
    id: 'invasion',
    title: { en: 'Invasion percolation', zh: '侵入渗流', de: 'Invasion-Perkolation' },
    blurb: {
      en: 'Greedy minimum-threshold growth, accepted tree, rejected loops, finite-size fractal slope.',
      zh: '贪心的最小阈值生长、接受树、被拒绝的环，以及有限尺度的分形斜率。',
      de: 'Gieriges Wachstum über kleinste Schwellen, Spannbaum, verworfene Kreise, endliche Fraktalsteigung.',
    },
    mount: (el, ctx) => import('./invasion.js').then((m) => m.mount(el, ctx)),
  },
  {
    id: 'algorithm-studio',
    title: { en: 'Algorithm studio', zh: '算法工坊', de: 'Algorithmen-Studio' },
    blurb: {
      en: 'Replay a union-find sweep edge by edge and compare measured cost and scaling.',
      zh: '逐边重放并查集扫描，比较实测代价与标度。',
      de: 'Einen Union-Find-Sweep Kante für Kante abspielen und Kosten sowie Skalierung vergleichen.',
    },
    mount: (el, ctx) => import('./algorithm-studio.js').then((m) => m.mount(el, ctx)),
  },
  {
    id: 'random-cluster',
    title: { en: 'Random-cluster / Potts', zh: '随机簇 / Potts', de: 'Random-Cluster / Potts' },
    blurb: {
      en: 'Swendsen–Wang updates, the q-dependent self-dual point, and Ising at q=2.',
      zh: 'Swendsen–Wang 更新、依赖 q 的自对偶点，以及 q=2 的 Ising 情形。',
      de: 'Swendsen–Wang-Updates, der q-abhängige selbstduale Punkt und Ising bei q=2.',
    },
    mount: (el, ctx) => import('./random-cluster.js').then((m) => m.mount(el, ctx)),
  },
  {
    id: 'tree',
    title: { en: 'Bethe tree', zh: 'Bethe 树', de: 'Bethe-Baum' },
    blurb: {
      en: 'A finite branching tree beside the exact infinite-tree recursion, with p_c = 1/(z−1).',
      zh: '有限分支树与精确无限树递推并列，p_c = 1/(z−1)。',
      de: 'Ein endlicher Verzweigungsbaum neben der exakten Rekursion des unendlichen Baums, p_c = 1/(z−1).',
    },
    mount: (el, ctx) => import('./tree.js').then((m) => m.mount(el, ctx)),
  },
  {
    id: 'epidemic',
    title: { en: 'SIR as percolation', zh: 'SIR 即渗流', de: 'SIR als Perkolation' },
    blurb: {
      en: 'Final size, herd immunity and outbreak-size fluctuations from the percolation mapping.',
      zh: '由渗流对应得到最终规模、群体免疫与暴发规模涨落。',
      de: 'Endgröße, Herdenimmunität und Ausbruchsgrößen-Schwankungen aus der Perkolationsabbildung.',
    },
    mount: (el, ctx) => import('./epidemic.js').then((m) => m.mount(el, ctx)),
  },
];
