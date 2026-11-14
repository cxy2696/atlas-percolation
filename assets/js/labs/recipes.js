/** Three guided experiments that connect a laboratory to a specific claim.
 *
 *  A recipe is a link with preset parameters, a question, an expectation and
 *  the chapter that explains the claim. The laboratory reads the same query
 *  parameters, so a shared link reopens the state. The text is authored in
 *  all three editions; counts and parameter values are part of the record.
 */

export const RECIPES = [
  {
    id: 'self-duality',
    lab: 'lattice',
    minutes: 3,
    title: {
      en: 'Measure the crossing probability at p = 1/2',
      zh: '测量 p = 1/2 处的横穿概率',
      de: 'Die Durchgangswahrscheinlichkeit bei p = 1/2 messen',
    },
    question: {
      en: 'On a 64 × 64 square lattice, does an open left–right crossing occur about half the time at the exact bond threshold?',
      zh: '在 64 × 64 方格上，恰好在键阈值处，出现左右开横穿的频率是否约为一半？',
      de: 'Tritt auf einem 64 × 64-Quadratgitter bei der exakten Kantenschwelle in etwa der Hälfte der Fälle ein offener Links-rechts-Durchgang auf?',
    },
    expect: {
      en: 'Draw 400 independent configurations. The measured rate should be near 0.5; the 95% Wilson interval reports the Monte Carlo uncertainty and need not contain 0.5 every time.',
      zh: '独立抽取 400 个构型。实测频率应接近 0.5；95% Wilson 区间给出蒙特卡洛不确定性，不必每次都包含 0.5。',
      de: '400 unabhängige Konfigurationen ziehen. Die gemessene Rate sollte nahe 0.5 liegen; das 95%-Wilson-Intervall zeigt die Monte-Carlo-Unsicherheit und muss 0.5 nicht jedes Mal enthalten.',
    },
    params: { lattice: 'square', mode: 'bond', L: 64, p: 0.5, samples: 400 },
    chapter: '04-duality',
    algorithm: 'dsu',
  },
  {
    id: 'collapse',
    lab: 'crossing',
    minutes: 5,
    title: {
      en: 'Collapse three lattice sizes',
      zh: '让三种尺寸的曲线重合',
      de: 'Drei Gittergrößen zur Deckung bringen',
    },
    question: {
      en: 'Do the crossing curves for L = 32, 64 and 128 fall on one curve in the variable x = (p − 1/2) L^(1/ν) with ν = 4/3?',
      zh: '把 L = 32、64、128 的横穿曲线画在 x = (p − 1/2) L^(1/ν) 上（ν = 4/3），它们会重合吗？',
      de: 'Fallen die Durchgangskurven für L = 32, 64 und 128 in der Variablen x = (p − 1/2) L^(1/ν) mit ν = 4/3 auf eine Kurve?',
    },
    expect: {
      en: 'With ν = 4/3 the three curves should overlap. Set ν = 1 and they fan out. The contrast is the visual test, not a precision measurement of ν.',
      zh: 'ν = 4/3 时三条曲线应重合；把 ν 改成 1，它们会散开。这个对比是视觉检验，不是 ν 的精确测量。',
      de: 'Mit ν = 4/3 sollten die drei Kurven zusammenfallen. Mit ν = 1 fächern sie auf. Der Kontrast ist ein visueller Test, keine Präzisionsmessung von ν.',
    },
    params: { nu: 1.3333333333333333 },
    chapter: '07-two-dimensions',
    algorithm: 'nz',
  },
  {
    id: 'peak',
    lab: 'newman-ziff',
    minutes: 4,
    title: {
      en: 'Find the susceptibility peak',
      zh: '找到磁化率的峰值',
      de: 'Das Suszeptibilitätsmaximum finden',
    },
    question: {
      en: 'Does the peak of χ(p) sit exactly at p_c = 1/2 on a finite square lattice?',
      zh: '在有限方格上，χ(p) 的峰值是否精确落在 p_c = 1/2？',
      de: 'Liegt das Maximum von χ(p) auf einem endlichen Quadratgitter exakt bei p_c = 1/2?',
    },
    expect: {
      en: 'The peak sits slightly above 1/2 and moves toward it as L grows. One edge order gives one curve; the displacement is a finite-size effect, not a second threshold.',
      zh: '峰值略高于 1/2，并随 L 增大向 1/2 移动。一条边序给出一条曲线；这个偏移是有限尺度效应，不是第二个阈值。',
      de: 'Das Maximum liegt etwas über 1/2 und wandert mit wachsendem L nach unten. Eine Kantenordnung ergibt eine Kurve; die Verschiebung ist ein Endlichkeitseffekt, keine zweite Schwelle.',
    },
    params: { L: 256 },
    chapter: '11-measurement',
    algorithm: 'nz',
  },
];

export function recipesFor(labId) {
  return RECIPES.filter((recipe) => recipe.lab === labId);
}

export function recipeById(id) {
  return RECIPES.find((recipe) => recipe.id === id) || null;
}

export function recipeHref(lang, recipe) {
  const q = new URLSearchParams();
  for (const [key, value] of Object.entries(recipe.params || {})) q.set(key, String(value));
  q.set('recipe', recipe.id);
  return `#/${lang}/labs/${recipe.lab}?${q.toString()}`;
}
