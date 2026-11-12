/**
 * atlas-percolation — reference RNG.
 *
 * xoshiro128** (Blackman & Vigna, 2018) with SplitMix32 seeding.  The
 * generator is implemented with 32-bit integer arithmetic only, so the
 * byte stream is identical in C++, Julia, JavaScript and Python.  All
 * four libraries are checked against tests/golden/rng-seed42.json.
 *
 * Conventions (must not change without bumping the golden vectors):
 *   - seed s is reduced mod 2^32;
 *   - seeding performs four SplitMix32 steps starting from s;
 *   - random() consumes two 32-bit outputs, high 26 bits then low 27 bits,
 *     and returns an exact multiple of 2^-53 in [0,1);
 *   - int(n) uses rejection sampling against the largest multiple of n
 *     that is <= 2^32, then reduces mod n.
 */

const GOLDEN = 0x9e3779b9;

function mix32(z) {
  z = Math.imul(z ^ (z >>> 16), 0x21f0aaad) >>> 0;
  z = Math.imul(z ^ (z >>> 15), 0x735a2d97) >>> 0;
  return (z ^ (z >>> 15)) >>> 0;
}

function rotl(x, k) {
  return ((x << k) | (x >>> (32 - k))) >>> 0;
}

export class Rng {
  constructor(seed = 0x9e3779b9) {
    this.seed(seed);
  }

  seed(seed) {
    let x = seed >>> 0;
    const s = new Uint32Array(4);
    for (let i = 0; i < 4; i++) {
      x = (x + GOLDEN) >>> 0;
      s[i] = mix32(x);
    }
    if ((s[0] | s[1] | s[2] | s[3]) === 0) s[0] = 1;
    this.s = s;
    this._spare = undefined;
    return this;
  }

  /** Raw 32-bit output. */
  u32() {
    const s = this.s;
    const r = Math.imul(rotl(Math.imul(s[1], 5) >>> 0, 7), 9) >>> 0;
    const t = (s[1] << 9) >>> 0;
    s[2] = (s[2] ^ s[0]) >>> 0;
    s[3] = (s[3] ^ s[1]) >>> 0;
    s[1] = (s[1] ^ s[2]) >>> 0;
    s[0] = (s[0] ^ s[3]) >>> 0;
    s[2] = (s[2] ^ t) >>> 0;
    s[3] = rotl(s[3], 11);
    return r;
  }

  /** Uniform double in [0,1) with 53 bits of resolution. */
  random() {
    const a = this.u32() >>> 6; // 26 bits
    const b = this.u32() >>> 5; // 27 bits
    return (a * 134217728 + b) / 9007199254740992;
  }

  /** Uniform integer in [0,n), n >= 1. */
  int(n) {
    if (n <= 1) return 0;
    if (n > 4294967296) throw new Error('int(n) requires n <= 2^32');
    const limit = Math.floor(4294967296 / n) * n;
    let r;
    do {
      r = this.u32();
    } while (r >= limit);
    return r % n;
  }

  /** True with probability p. */
  bernoulli(p) {
    return this.random() < p;
  }

  /** In-place Fisher–Yates shuffle. */
  shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = this.int(i + 1);
      const t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  /** Standard normal via Box–Muller (two uniforms per pair; cached spare). */
  normal() {
    if (this._spare !== undefined) {
      const v = this._spare;
      this._spare = undefined;
      return v;
    }
    let u = 0;
    let v = 0;
    let s = 0;
    do {
      u = 2 * this.random() - 1;
      v = 2 * this.random() - 1;
      s = u * u + v * v;
    } while (s >= 1 || s === 0);
    const m = Math.sqrt((-2 * Math.log(s)) / s);
    this._spare = v * m;
    return u * m;
  }

  save() {
    return { s: Array.from(this.s), spare: this._spare };
  }

  load(state) {
    this.s = Uint32Array.from(state.s);
    this._spare = state.spare;
    return this;
  }
}

export default Rng;
