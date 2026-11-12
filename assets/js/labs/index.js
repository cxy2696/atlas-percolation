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
    id: 'random-cluster',
    title: { en: 'Random-cluster / Potts', zh: '随机簇 / Potts', de: 'Random-Cluster / Potts' },
    blurb: {
      en: 'Swendsen–Wang updates, the q-dependent self-dual point, and Ising at q=2.',
      zh: 'Swendsen–Wang 更新、依赖 q 的自对偶点，以及 q=2 的 Ising 情形。',
      de: 'Swendsen–Wang-Updates, der q-abhängige selbstduale Punkt und Ising bei q=2.',
    },
    mount: (el, ctx) => import('./random-cluster.js').then((m) => m.mount(el, ctx)),
  },
];
